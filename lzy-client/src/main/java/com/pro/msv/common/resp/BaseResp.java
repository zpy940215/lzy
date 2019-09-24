package com.pro.msv.common.resp;

public class BaseResp {

	private int code = 200;
	
	private String description;
	
	public boolean isSuccess() {
		return code == 200;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
