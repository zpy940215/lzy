package com.pro.msv.server.role.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pro.msv.module.req.ModuleReq;
import com.pro.msv.module.resp.ModuleResp;
import com.pro.msv.server.role.service.ModuleService;

@RestController
public class ModuleController {

	@Autowired
	private ModuleService moduleService;
	
	@PostMapping(value = "/module/list/byuid")
	public ModuleResp queryListByUid(@RequestBody ModuleReq req) {
		return moduleService.queryListByUid(req);
	}
	
	@PostMapping(value = "/module/menu/byuid")
	public ModuleResp queryMenuByUid(@RequestBody ModuleReq req) {
		return moduleService.queryMenuByUid(req);
	}
}
