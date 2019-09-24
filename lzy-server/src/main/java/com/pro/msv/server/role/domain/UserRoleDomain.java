package com.pro.msv.server.role.domain;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * s_rbac_user_role :  
 **/
@Entity
@Table(name = "s_rbac_user_role")
public class UserRoleDomain{
	@Id
	private String id;
	private Long uid;/**/
    @Column(name="role_id")
	private String roleId;/**/
    @Column(name="create_date")
	private Date createDate;/**/

	public String getId() {
 		return this.id;
	}
	
	public void setId(String id) {
 		this.id = id;
	}

	public Long getUid() {
 		return this.uid;
	}
	
	public void setUid(Long uid) {
 		this.uid = uid;
	}

	public String getRoleId() {
 		return this.roleId;
	}
	
	public void setRoleId(String roleId) {
 		this.roleId = roleId;
	}

	public Date getCreateDate() {
 		return this.createDate;
	}
	
	public void setCreateDate(Date createDate) {
 		this.createDate = createDate;
	}
}
