package com.pro.msv.server.user.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.pro.msv.server.user.domain.UserDomain;

@Mapper
public interface UserMapper{

	public List<UserDomain> queryListAll();
	
	public UserDomain queryById(String id);
	
	public boolean updateStatus(UserDomain userDomain);
	
	public UserDomain queryByAccountAndPasswd(String account,String passwd);
	
}
