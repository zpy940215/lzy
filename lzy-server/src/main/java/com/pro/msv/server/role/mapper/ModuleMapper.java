package com.pro.msv.server.role.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.pro.msv.server.role.domain.ModuleDomain;

@Mapper
public interface ModuleMapper{

	public List<ModuleDomain> qeuryListByUid(Long uid);
	
	public List<ModuleDomain> qeuryMenuByUid(Long uid);
}

