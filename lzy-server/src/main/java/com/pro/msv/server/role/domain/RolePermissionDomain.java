package com.pro.msv.server.role.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * s_rbac_role_permission :
 **/
@Entity
@Table(name = "s_rbac_role_permission")
public class RolePermissionDomain {
	@Id
	private String id;
	@Column(name = "role_id")
	private String roleId;/**/
	private String permission;/**/
	@Column(name = "create_date")
	private Date createDate;/**/

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRoleId() {
		return this.roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getPermission() {
		return this.permission;
	}

	public void setPermission(String permission) {
		this.permission = permission;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
}
