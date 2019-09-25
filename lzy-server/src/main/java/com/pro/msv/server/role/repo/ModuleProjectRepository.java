package com.pro.msv.server.role.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.role.domain.ModuleProjectDomain;

public interface ModuleProjectRepository extends JpaRepository<ModuleProjectDomain, String>{

}
