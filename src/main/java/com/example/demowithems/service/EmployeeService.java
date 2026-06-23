package com.example.demowithems.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demowithems.entity.Employee;
import com.example.demowithems.dao.EmployeeRepo;
import com.example.demowithems.exception.ResourceNotFoundException;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepo repo;

    public Employee saveemp(Employee e) { return repo.save(e); }

    public List<Employee> selecttemp() { return repo.findAll(); }

    public Employee getById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + id));
    }

    public Employee updateEmployee(int id, Employee updatedEmp) {
        Employee existing = getById(id);
        existing.setName(updatedEmp.getName());
        existing.setDepartment(updatedEmp.getDepartment());
        existing.setSalary(updatedEmp.getSalary());
        if (updatedEmp.getP() != null) existing.setP(updatedEmp.getP());
        return repo.save(existing);
    }

    public void deleteEmployee(int id) {
        repo.delete(getById(id));
    }
}