package com.pro.msv.server.role.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.role.domain.RoleDomain;

public interface RoleRepository extends JpaRepository<RoleDomain, String>{

}
