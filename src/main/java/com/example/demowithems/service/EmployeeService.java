package com.example.demowithems.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demowithems.entity.*;
import com.exmaple.demowithems.dao.*;

import java.util.List;

@Service
public class EmployeeService {
	
	@Autowired
	EmployeeRepo r;
	
	//insert code
	public Employee saveemp(Employee e) {
		return r .save(e);//insert
	}
	
	//select all
	public List<Employee> selecttemp()
	{
		return r.findAll();
	}
	

}
