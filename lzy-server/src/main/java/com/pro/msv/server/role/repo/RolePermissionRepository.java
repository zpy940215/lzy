package com.pro.msv.server.role.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.role.domain.RolePermissionDomain;

public interface RolePermissionRepository extends JpaRepository<RolePermissionDomain, String>{

}
