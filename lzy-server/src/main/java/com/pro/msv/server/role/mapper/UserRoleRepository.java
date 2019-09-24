package com.pro.msv.server.role.mapper;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.role.domain.UserRoleDomain;

public interface UserRoleRepository extends JpaRepository<UserRoleDomain, String>{

}
