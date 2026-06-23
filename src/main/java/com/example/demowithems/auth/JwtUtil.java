package com.example.demowithems.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "workforce_ems_jwt_secret_key_2025_nithya";
    private static final long EXPIRY = 1000 * 60 * 60 * 10;

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRY))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token, String username) {
        try {
            String extracted = extractUsername(token);
            return extracted.equals(username) && !isExpired(token);
        } catch (Exception e) { return false; }
    }

    private boolean isExpired(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey()).build()
                .parseClaimsJws(token).getBody()
                .getExpiration().before(new Date());
    }
}