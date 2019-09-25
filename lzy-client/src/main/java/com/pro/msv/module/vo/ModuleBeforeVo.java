package com.pro.msv.module.vo;

public class ModuleBeforeVo {
	private String id;

	private String pId;

	private String open;

	private String children;

	private String name;

	private String url;

	//和前端对应
	private String mark;

	private String parent;

	private String icon;

	private String dataparentid;
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		if (url==null)
			return "";
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
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

	public String getIcon() {
		if (icon==null)
			return "";
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getDataparentid() {
		return dataparentid;
	}

	public void setDataparentid(String dataparentid) {
		this.dataparentid = dataparentid;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getpId() {
		return pId;
	}

	public void setpId(String pId) {
		this.pId = pId;
	}

	public String getOpen() {
		return open;
	}

	public void setOpen(String open) {
		this.open = open;
	}

	public String getChildren() {
		return children;
	}

	public void setChildren(String children) {
		this.children = children;
	}
}
