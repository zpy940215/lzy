package com.pro.msv.server.user.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pro.msv.server.user.domain.UserDomain;

public interface UserRepository extends JpaRepository<UserDomain, String>{

}
