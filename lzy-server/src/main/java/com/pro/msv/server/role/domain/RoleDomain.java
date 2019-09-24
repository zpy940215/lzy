package com.pro.msv.server.role.domain;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * s_rbac_role :  
 **/
@Entity
@Table(name = "s_rbac_role")
public class RoleDomain{
	@Id
	private String id;
    @Column(name="project_id")
	private String projectId;/**/
	private String type;
    @Column(name="site_id")
	private String siteId;/**/
    @Column(name="role_id")
	private String roleId;/**/
	private String name;/**/
	private String description;/**/
	private String status;/**/
    @Column(name="create_date")
	private Date createDate;/**/

	public String getId() {
 		return this.id;
	}
	
	public void setId(String id) {
 		this.id = id;
	}

	public String getProjectId() {
 		return this.projectId;
	}
	
	public void setProjectId(String projectId) {
 		this.projectId = projectId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSiteId() {
 		return this.siteId;
	}
	
	public void setSiteId(String siteId) {
 		this.siteId = siteId;
	}

	public String getRoleId() {
 		return this.roleId;
	}
	
	public void setRoleId(String roleId) {
 		this.roleId = roleId;
	}

	public String getName() {
 		return this.name;
	}
	
	public void setName(String name) {
 		this.name = name;
	}

	public String getDescription() {
 		return this.description;
	}
	
	public void setDescription(String description) {
 		this.description = description;
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
}
