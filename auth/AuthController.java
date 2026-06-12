package com.example.demowithems.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired AuthenticationManager authManager;
    @Autowired JwtUtil jwtUtil;
    @Autowired UserRepo userRepo;
    @Autowired PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (userRepo.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        // First registered user becomes SUPER_ADMIN
        if (userRepo.count() == 0) {
            user.setRole("SUPER_ADMIN");
        } else {
            user.setRole("EMPLOYEE");
        }

        userRepo.save(user);
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, user.getUsername(), user.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getUsername(), req.getPassword()));
            User user = userRepo.findByUsername(req.getUsername()).get();
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(
                    new AuthResponse(token, user.getUsername(), user.getRole()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }

    // Get all users — SUPER_ADMIN only
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepo.findAll();
        return ResponseEntity.ok(users);
    }

    // Promote/demote user role — SUPER_ADMIN only
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable int id,
            @RequestBody Map<String, String> body) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(body.get("role"));
        userRepo.save(user);
        return ResponseEntity.ok("Role updated to " + body.get("role"));
    }
}