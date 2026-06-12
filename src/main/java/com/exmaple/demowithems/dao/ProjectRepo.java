package com.exmaple.demowithems.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demowithems.entity.*;
public interface ProjectRepo extends JpaRepository<Project,Integer>{
	

}
