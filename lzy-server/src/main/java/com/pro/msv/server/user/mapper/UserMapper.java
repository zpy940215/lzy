package com.pro.msv.server.user.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.pro.msv.server.user.domain.UserDomain;

@Mapper
public interface UserMapper{

	@Select("select * from t_user")
	public List<UserDomain> queryListAll();
	
	@Select("select * from t_user where id = #{id}")
	public UserDomain queryById(String id);
	
	@Update("update t_user set status = #{status},status_date = now(),modify_date = now() where id = #{id}")
	public boolean updateStatus(UserDomain userDomain);
	
	@Select("select * from t_user where account = #{account} and passwd = #{passwd}")
	public UserDomain queryByAccountAndPasswd(String account,String passwd);
	
}
