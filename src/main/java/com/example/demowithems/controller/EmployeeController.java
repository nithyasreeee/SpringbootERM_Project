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

    @PostMapping
    public ResponseEntity<Employee> saveEmployee(@Valid @RequestBody Employee e) {
        return ResponseEntity.status(HttpStatus.CREATED).body(es.saveemp(e));
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(es.selecttemp());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable int id) {
        return ResponseEntity.ok(es.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable int id, @Valid @RequestBody Employee e) {
        return ResponseEntity.ok(es.updateEmployee(id, e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int id) {
        es.deleteEmployee(id);
        return ResponseEntity.ok("Employee with id " + id + " deleted successfully");
    }
}