package com.pro.msv.module.resp;

import java.util.List;

import com.pro.msv.common.resp.BaseResp;
import com.pro.msv.module.vo.ModuleBeforeVo;
import com.pro.msv.module.vo.ModuleVo;

public class ModuleResp extends BaseResp{

	private List<ModuleVo> moduleVos;
	
	private List<ModuleBeforeVo> dataList;

	public List<ModuleVo> getModuleVos() {
		return moduleVos;
	}

	public void setModuleVos(List<ModuleVo> moduleVos) {
		this.moduleVos = moduleVos;
	}

	public List<ModuleBeforeVo> getDataList() {
		return dataList;
	}

	public void setDataList(List<ModuleBeforeVo> dataList) {
		this.dataList = dataList;
	}
}
