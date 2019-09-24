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
@Table(name = "s_module_project")
public class ModuleProjectDomain {
	@Id
	private String id;
	@Column(name = "project_id")
	private String projectId;/**/
	@Column(name = "module_id")
	private String moduleId;/**/
	@Column(name = "create_date")
	private Date createDate;/**/
	@Column(name = "module_name")
	private String moduleAlias;// 项目的栏目别名

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getModuleId() {
		return moduleId;
	}

	public void setModuleId(String moduleId) {
		this.moduleId = moduleId;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getModuleAlias() {
		return moduleAlias;
	}

	public void setModuleAlias(String moduleAlias) {
		this.moduleAlias = moduleAlias;
	}
}
