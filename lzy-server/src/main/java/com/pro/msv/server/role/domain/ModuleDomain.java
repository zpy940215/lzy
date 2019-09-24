package com.pro.msv.server.role.domain;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * s_module :  
 **/
@Entity
@Table(name = "s_module")
public class ModuleDomain{
	@Id
	private String id;
	@Column(name ="module_id")
	private String moduleId;/**/
	private String name;/**/
	@Column(name="up_id")
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
	@Column(name="create_date")
	private Date createDate;/**/
	@Column(name="modify_date")
	private Date modifyDate;/**/

	public String getId() {
 		return this.id;
	}
	
	public void setId(String id) {
 		this.id = id;
	}
 

	public String getModuleId() {
 		return this.moduleId;
	}
	
	public void setModuleId(String moduleId) {
 		this.moduleId = moduleId;
	}

	public String getName() {
 		return this.name;
	}
	
	public void setName(String name) {
 		this.name = name;
	}

	public String getUpId() {
 		return this.upId;
	}
	
	public void setUpId(String upId) {
 		this.upId = upId;
	}

	public Integer getPos() {
 		return this.pos;
	}
	
	public void setPos(Integer pos) {
 		this.pos = pos;
	}

	public String getUrl() {
 		return this.url;
	}
	
	public void setUrl(String url) {
 		this.url = url;
	}

	public String getPattern() {
 		return this.pattern;
	}
	
	public void setPattern(String pattern) {
 		this.pattern = pattern;
	}

	public String getDescription() {
 		return this.description;
	}
	
	public void setDescription(String description) {
 		this.description = description;
	}

	public String getTarget() {
 		return this.target;
	}
	
	public void setTarget(String target) {
 		this.target = target;
	}

	public String getIsmenu() {
 		return this.ismenu;
	}
	
	public void setIsmenu(String ismenu) {
 		this.ismenu = ismenu;
	}

	public String getHtml() {
 		return this.html;
	}
	
	public void setHtml(String html) {
 		this.html = html;
	}

	public Integer getLvl() {
 		return this.lvl;
	}
	
	public void setLvl(Integer lvl) {
 		this.lvl = lvl;
	}

	public String getStatus() {
 		return this.status;
	}
	
	public void setStatus(String status) {
 		this.status = status;
	}

	public Date getCreateDate() {
 		return this.createDate;
	}
	
	public void setCreateDate(Date createDate) {
 		this.createDate = createDate;
	}

	public Date getModifyDate() {
 		return this.modifyDate;
	}
	
	public void setModifyDate(Date modifyDate) {
 		this.modifyDate = modifyDate;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}
}
