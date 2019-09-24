package com.pro.msv.server.role.mapper;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.role.domain.ModuleProjectDomain;

public interface ModuleProjectRepository extends JpaRepository<ModuleProjectDomain, String>{

}
