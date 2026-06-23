package com.example.demowithems.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @NotBlank(message = "Name cannot be empty")
    String name;

    @NotBlank(message = "Department cannot be empty")
    String department;

    @Min(value = 1, message = "Salary must be greater than 0")
    int salary;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_id")
    Project p;

    // Constructors
    public Employee() {}

    public Employee(String name, String department, int salary, Project p) {
        this.name = name;
        this.department = department;
        this.salary = salary;
        this.p = p;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getSalary() { return salary; }
    public void setSalary(int salary) { this.salary = salary; }

    public Project getP() { return p; }
    public void setP(Project p) { this.p = p; }
}