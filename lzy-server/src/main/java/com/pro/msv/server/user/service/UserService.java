package com.pro.msv.server.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.pro.msv.common.util.BeanUtil;
import com.pro.msv.server.user.domain.UserDomain;
import com.pro.msv.server.user.mapper.UserMapper;
import com.pro.msv.server.user.repo.UserRepository;
import com.pro.msv.user.req.UserReq;
import com.pro.msv.user.resp.UserResp;
import com.pro.msv.user.vo.UserVo;

@Service
public class UserService {
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private UserRepository userRepository;

	public UserResp login(UserReq req) {
		UserResp resp = new UserResp();
		if(req == null) {
			resp.setCode(300);
			resp.setDescription("miss param ");
			return resp;
		}
		if(StringUtils.isEmpty(req.getAccount()) || StringUtils.isEmpty(req.getPassword())) {
			resp.setCode(300);
			resp.setDescription("miss account or password ");
			return resp;
		}
		UserDomain userDomain = userMapper.queryByAccountAndPasswd(req.getAccount(), req.getPassword());
		if(userDomain == null) {
			resp.setCode(302);
			resp.setDescription("user not exist ");
			return resp;
		}
		UserVo userVo = BeanUtil.copyNewSameProperty(userDomain, UserVo.class);
		resp.setUserVo(userVo);
		return resp;
	}
	
	public UserResp queryList() {
		UserResp resp = new UserResp();
		List<UserDomain> userDomains = userRepository.findAll();
		List<UserVo> userVos = BeanUtil.copySamePropertyList(userDomains, UserVo.class);
		resp.setUserVos(userVos);
		return resp;
	}
}
