package com.example.demowithems.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class Employee {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	
	int id;
	String name;
	String department;
	int salary;
	
	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn( name ="project_id")
	Project p ;
	
	public Employee() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Employee(String name, String department, int salary, Project p) {
		super();
		this.name = name;
		this.department = department;
		this.salary = salary;
		this.p = p;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public int getSalary() {
		return salary;
	}
	public void setSalary(int salary) {
		this.salary = salary;
	}
	public Project getP() {
		return p;
	}
	public void setP(Project p) {
		this.p = p;
	}
	
	
	
	
	

}
