package com.pro.msv.server.role.domain;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * s_rbac_permission :  
 **/
@Entity
@Table(name = "s_rbac_permission")
public class PermissionDomain{
	@Id
	private String id;
    @Column(name="project_id")
	private String projectId;/**/
    @Column(name="site_id")
	private String siteId;/**/
	private String name;/**/
	private String description;/**/
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

	public String getProjectId() {
 		return this.projectId;
	}
	
	public void setProjectId(String projectId) {
 		this.projectId = projectId;
	}

	public String getSiteId() {
 		return this.siteId;
	}
	
	public void setSiteId(String siteId) {
 		this.siteId = siteId;
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
}
