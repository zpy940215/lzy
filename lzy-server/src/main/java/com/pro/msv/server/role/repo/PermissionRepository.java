package com.pro.msv.server.role.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.role.domain.PermissionDomain;

public interface PermissionRepository extends JpaRepository<PermissionDomain, String>{

}
