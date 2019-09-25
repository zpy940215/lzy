package com.pro.msv.server.role.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.role.domain.ModuleDomain;

public interface ModuleRepository extends JpaRepository<ModuleDomain, String>{

}
