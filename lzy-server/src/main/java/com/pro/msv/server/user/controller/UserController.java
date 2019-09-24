package com.pro.msv.server.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pro.msv.server.user.domain.UserDomain;
import com.pro.msv.server.user.mapper.UserMapper;
import com.pro.msv.server.user.repo.UserRepository;
import com.pro.msv.server.user.service.UserService;
import com.pro.msv.user.req.UserReq;
import com.pro.msv.user.resp.UserResp;

@RestController
public class UserController {
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserService userService;

	@GetMapping(value = "/user/list")
	public UserResp queryList() {
		return userService.queryList();
	}
	
	@GetMapping(value = "/user/{id}")
	public UserDomain queryById(@PathVariable("id") String id) {
		return userMapper.queryById(id);
	}
	
	@PostMapping(value = "/user/update/status")
	public boolean updateStats(UserDomain userDomain) {
		return userMapper.updateStatus(userDomain);
	}
	
	@PostMapping(value = "/user/login")
	public UserResp doLogin(@RequestBody UserReq req) {
		return userService.login(req);
	}
}
