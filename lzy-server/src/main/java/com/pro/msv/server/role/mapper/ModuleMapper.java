package com.pro.msv.server.role.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.pro.msv.server.role.domain.ModuleDomain;

@Mapper
public interface ModuleMapper{

	@Select("SELECT m.* FROM s_module m " + 
			"LEFT JOIN s_rbac_role_module rrm on m.module_id = rrm.module_id " + 
			"LEFT JOIN s_rbac_user_role rur on rur.role_id = rrm.role_id " + 
			"where rur.uid = #{uid}")
	public List<ModuleDomain> qeuryListByUid(Long uid);
	
	@Select("SELECT m.* FROM s_module m " + 
			"LEFT JOIN s_rbac_role_module rrm on m.module_id = rrm.module_id " + 
			"LEFT JOIN s_rbac_user_role rur on rur.role_id = rrm.role_id " + 
			"where rur.uid = #{uid} and m.lvl = 1")
	public List<ModuleDomain> qeuryMenuByUid(Long uid);
}

