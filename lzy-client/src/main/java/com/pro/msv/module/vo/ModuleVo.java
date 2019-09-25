package com.pro.msv.module.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ModuleVo {
	private String id;
	private String moduleId;/**/
	private String name;/**/
	private String upId;/**/
	private Integer pos;/**/
	private String url;/**/
	private String pattern;/**/
	private String description;/**/
	private String target;/**/
	private String ismenu;/**/
	private String html;/**/
	private Integer lvl;/**/
	private String status;/*open/close*/
	private String icon;
	private Date createDate;/**/
	private Date modifyDate;/**/
	
	private String mark;

	private String parent;

	private String alias;//别名

	private List<ModuleVo> childList = new ArrayList<ModuleVo>();
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getModuleId() {
		return moduleId;
	}
	public void setModuleId(String moduleId) {
		this.moduleId = moduleId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUpId() {
		return upId;
	}
	public void setUpId(String upId) {
		this.upId = upId;
	}
	public Integer getPos() {
		return pos;
	}
	public void setPos(Integer pos) {
		this.pos = pos;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getPattern() {
		return pattern;
	}
	public void setPattern(String pattern) {
		this.pattern = pattern;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	public String getIsmenu() {
		return ismenu;
	}
	public void setIsmenu(String ismenu) {
		this.ismenu = ismenu;
	}
	public String getHtml() {
		return html;
	}
	public void setHtml(String html) {
		this.html = html;
	}
	public Integer getLvl() {
		return lvl;
	}
	public void setLvl(Integer lvl) {
		this.lvl = lvl;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public Date getModifyDate() {
		return modifyDate;
	}
	public void setModifyDate(Date modifyDate) {
		this.modifyDate = modifyDate;
	}
	public String getMark() {
		return mark;
	}
	public void setMark(String mark) {
		this.mark = mark;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public List<ModuleVo> getChildList() {
		return childList;
	}
	public void setChildList(List<ModuleVo> childList) {
		this.childList = childList;
	}
}

