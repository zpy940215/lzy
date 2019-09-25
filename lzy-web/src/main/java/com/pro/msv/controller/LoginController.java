package com.pro.msv.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pro.msv.common.constants.ActionConstants;
import com.pro.msv.user.req.UserReq;
import com.pro.msv.user.resp.UserResp;
import com.pro.msv.util.AppUtil;

@Controller
public class LoginController {

	@RequestMapping("/index")
	public String index(Model model) {
		model.addAttribute("hello", "dello123");
		return "index/index";
	}
	
	@PostMapping("/doLogin")
	public @ResponseBody UserResp login(@RequestBody UserReq req) {
		 UserResp resp = AppUtil.post(ActionConstants.UserdoLogin, req, UserResp.class);
		 return resp;
	}
	
}
