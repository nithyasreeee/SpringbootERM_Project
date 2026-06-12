package com.example.demowithems.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demowithems.dao.EmployeeRepo;
import com.example.demowithems.entity.Employee;
import com.example.demowithems.exception.ResourceNotFoundException;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepo repo;

    // Save employee
    public Employee saveemp(Employee e) {
        return repo.save(e);
    }

    // Get all employees
    public List<Employee> selecttemp() {
        return repo.findAll();
    }

    // Get by ID — throws exception if not found
    public Employee getById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + id));
    }

    // Update employee
    public Employee updateEmployee(int id, Employee updatedEmp) {
        Employee existing = getById(id); // reuses getById (throws if not found)
        existing.setName(updatedEmp.getName());
        existing.setDepartment(updatedEmp.getDepartment());
        existing.setSalary(updatedEmp.getSalary());
        if (updatedEmp.getP() != null) {
            existing.setP(updatedEmp.getP());
        }
        return repo.save(existing);
    }

    // Delete employee
    public void deleteEmployee(int id) {
        Employee emp = getById(id); // throws if not found
        repo.delete(emp);
    }
}