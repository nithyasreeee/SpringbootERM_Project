package com.example.demowithems.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demowithems.entity.Employee;

public interface EmployeeRepo extends JpaRepository<Employee, Integer> {
}