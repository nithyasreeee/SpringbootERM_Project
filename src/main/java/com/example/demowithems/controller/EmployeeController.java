package com.example.demowithems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import com.example.demowithems.service.*;
import com.example.demowithems.entity.*;
import java.util.*;

@RestController
public class EmployeeController {
     
	 @Autowired
	 EmployeeService es;
	 
	 @PostMapping("/save")
	 
	 public Employee get1(@RequestBody Employee e) {
		 
		return es.saveemp(e);
	}
	 
	 @GetMapping("/home")
	 public List<Employee>get2()
	 {
		 return es.selecttemp();
	 }
}
