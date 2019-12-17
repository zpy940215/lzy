package com.pro.msv.action;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pro.msv.common.constants.ActionConstants;
import com.pro.msv.user.req.UserReq;
import com.pro.msv.user.resp.UserResp;
import com.pro.msv.util.AppUtil;
import com.pro.msv.util.CookieUtil;

@Controller
public class CommonAction {

	@GetMapping("/")
	public String login() {
		return "login";
	}

}
