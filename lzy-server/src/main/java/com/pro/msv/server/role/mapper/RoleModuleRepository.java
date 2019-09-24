package com.pro.msv.server.role.mapper;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.role.domain.RoleModuleDomain;

public interface RoleModuleRepository extends JpaRepository<RoleModuleDomain, String>{

}
