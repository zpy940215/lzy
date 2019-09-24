package com.pro.msv.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pro.msv.common.constants.ActionConstants;
import com.pro.msv.user.resp.UserResp;
import com.pro.msv.util.AppUtil;

@Controller
public class UserController {

	@GetMapping("/user/list")
	public @ResponseBody UserResp queryUserList() {
		 UserResp resp = AppUtil.get(ActionConstants.queryUserList, UserResp.class);
		 return resp;
	}
}
