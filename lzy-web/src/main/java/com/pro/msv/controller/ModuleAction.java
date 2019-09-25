package com.pro.msv.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pro.msv.common.constants.ActionConstants;
import com.pro.msv.module.req.ModuleReq;
import com.pro.msv.module.resp.ModuleResp;
import com.pro.msv.module.vo.ModuleBeforeVo;
import com.pro.msv.module.vo.ModuleVo;
import com.pro.msv.util.AppUtil;
import com.pro.msv.util.CookieUtil;

@Controller
public class ModuleAction {

	@GetMapping("/my/module/menu")
	public @ResponseBody ModuleResp queryMenuByUid() {
		ModuleReq req = new ModuleReq();
		String uid = CookieUtil.getAttribute("uid");
		if (StringUtils.isBlank(uid)) {
			return AppUtil.getFailResponse(401, "miss uid", ModuleResp.class);
		}
		req.setUid(Long.parseLong(uid));
		return AppUtil.post(ActionConstants.ModuleQueryMenuByUid, req, ModuleResp.class);
	}

	@GetMapping("/my/module/list")
	public @ResponseBody ModuleResp queryListByUid() {
		ModuleReq req = new ModuleReq();
		String uid = CookieUtil.getAttribute("uid");
		if (StringUtils.isBlank(uid)) {
			return AppUtil.getFailResponse(401, "miss uid", ModuleResp.class);
		}
		req.setUid(Long.parseLong(uid));
		ModuleResp resp = AppUtil.post(ActionConstants.ModuleQueryListByUid, req, ModuleResp.class);
		List<ModuleVo> moduleList = new ArrayList<ModuleVo>();
		for (ModuleVo moduleVoTemp : resp.getModuleVos()) {
			moduleList.add(moduleVoTemp);
			if (moduleVoTemp.getChildList().size() > 0) {
				for (ModuleVo moduleVoTempChild1 : moduleVoTemp.getChildList()) {
					moduleList.add(moduleVoTempChild1);
					if (moduleVoTempChild1.getChildList().size() > 0) {
						for (ModuleVo moduleVoTempChild2 : moduleVoTempChild1.getChildList()) {
							moduleList.add(moduleVoTempChild2);
						}
					}
				}
			}

		}
		List<ModuleBeforeVo> moduleListEnd = new ArrayList<ModuleBeforeVo>();
		for (ModuleVo moduleVoTemp : moduleList) {
			ModuleBeforeVo moduleBeforeVo = new ModuleBeforeVo();
			moduleBeforeVo.setName(moduleVoTemp.getName());
			moduleBeforeVo.setMark("module" + moduleVoTemp.getModuleId());
			moduleBeforeVo.setIcon(moduleVoTemp.getIcon());
			if (moduleVoTemp.getLvl() == 1) {
				// level=1时，父类为空
				moduleBeforeVo.setParent("");

			} else {
				if (moduleVoTemp.getLvl() == 2) {
					moduleBeforeVo.setDataparentid(moduleVoTemp.getUpId());
				}
				moduleBeforeVo.setParent(moduleVoTemp.getParent());
			}

			moduleBeforeVo.setUrl(moduleVoTemp.getUrl());
			moduleListEnd.add(moduleBeforeVo);
		}
		resp.setDataList(moduleListEnd);
		return resp;
	}
}
