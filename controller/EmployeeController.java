package com.example.demowithems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demowithems.service.EmployeeService;
import com.example.demowithems.entity.Employee;
import jakarta.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    EmployeeService es;

    // CREATE
    @PostMapping
    public ResponseEntity<Employee> saveEmployee(@Valid @RequestBody Employee e) {
        Employee saved = es.saveemp(e);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(es.selecttemp());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable int id) {
        Employee emp = es.getById(id);
        return ResponseEntity.ok(emp);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable int id,
            @Valid @RequestBody Employee e) {
        Employee updated = es.updateEmployee(id, e);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int id) {
        es.deleteEmployee(id);
        return ResponseEntity.ok("Employee with id " + id + " deleted successfully");
    }
}