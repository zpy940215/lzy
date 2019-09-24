package com.pro.msv.user.req;

import com.pro.msv.common.req.BaseReq;

public class UserReq extends BaseReq{

	private String account;
	
	private String password;

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
