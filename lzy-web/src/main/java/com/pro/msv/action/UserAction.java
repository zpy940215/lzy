package com.pro.msv.action;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pro.msv.common.constants.ActionConstants;
import com.pro.msv.user.resp.UserResp;
import com.pro.msv.util.AppUtil;
import com.pro.msv.util.CookieUtil;

@Controller
public class UserAction {

	@GetMapping("/user/list")
	public @ResponseBody UserResp queryUserList() {
		System.out.println(CookieUtil.getAttribute("uid"));
		return AppUtil.get(ActionConstants.UserQueryList, UserResp.class);
	}
}
