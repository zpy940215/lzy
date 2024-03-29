package com.pro.msv.action;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pro.msv.common.constants.ActionConstants;
import com.pro.msv.user.req.UserReq;
import com.pro.msv.user.resp.UserResp;
import com.pro.msv.util.AppUtil;
import com.pro.msv.util.CookieUtil;

@Controller
public class LoginAction {

	@RequestMapping("/index")
	public String index(Model model) {
		model.addAttribute("hello", "dello123");
		return "index/index";
	}

	@PostMapping("/doLogin")
	public String login(UserReq req) {
		UserResp resp = AppUtil.post(ActionConstants.UserdoLogin, req, UserResp.class);
		CookieUtil.setAttribute("uid", resp.getUserVo().getUid());
		return "redirect:/index";
	}

}
