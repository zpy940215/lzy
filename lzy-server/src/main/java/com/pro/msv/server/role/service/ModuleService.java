package com.pro.msv.server.role.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pro.msv.common.util.BeanUtil;
import com.pro.msv.module.req.ModuleReq;
import com.pro.msv.module.resp.ModuleResp;
import com.pro.msv.module.vo.ModuleVo;
import com.pro.msv.server.role.domain.ModuleDomain;
import com.pro.msv.server.role.mapper.ModuleMapper;

@Service
public class ModuleService {

	@Autowired
	private ModuleMapper moduleMapper;
	
	public ModuleResp queryListByUid(ModuleReq req) {
		ModuleResp resp = new ModuleResp();
		if(req == null || req.getUid() == null) {
			resp.setCode(400);
			resp.setDescription("recode no exist");
			return resp;
		}
		List<ModuleDomain> domains = moduleMapper.qeuryListByUid(req.getUid());
		resp.setModuleVos(BeanUtil.copySamePropertyList(domains, ModuleVo.class));
		return resp;
	}
	
	public ModuleResp queryMenuByUid(ModuleReq req) {
		ModuleResp resp = new ModuleResp();
		if(req == null || req.getUid() == null) {
			resp.setCode(400);
			resp.setDescription("recode no exist");
			return resp;
		}
		List<ModuleDomain> domains = moduleMapper.qeuryMenuByUid(req.getUid());
		List<ModuleVo> moduleVos = BeanUtil.copySamePropertyList(domains, ModuleVo.class);
		if(moduleVos != null && moduleVos.size() > 0) {
			
		}
		resp.setModuleVos(moduleVos);
		return resp;
	}
}
