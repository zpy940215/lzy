package com.pro.msv.user.resp;

import java.util.List;

import com.pro.msv.common.resp.BaseResp;
import com.pro.msv.user.vo.UserVo;

public class UserResp extends BaseResp{

	private UserVo userVo;
	
	private List<UserVo> userVos;

	public UserVo getUserVo() {
		return userVo;
	}

	public void setUserVo(UserVo userVo) {
		this.userVo = userVo;
	}

	public List<UserVo> getUserVos() {
		return userVos;
	}

	public void setUserVos(List<UserVo> userVos) {
		this.userVos = userVos;
	}
}
