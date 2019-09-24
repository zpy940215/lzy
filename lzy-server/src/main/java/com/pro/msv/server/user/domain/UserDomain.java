package com.pro.msv.server.user.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * t_user :
 **/
@Entity
@Table(name = "t_user")
public class UserDomain{
	@Id
	private String id;
	@Column(name = "project_id")
	private String projectId;/**/
	private String type;/* user/system/cust(微店铺) */
	@Column(name = "source_id")
	private String sourceId;// 来源渠道id
	private Long uid;/**/
	private String account;/**/
	private String passwd;/**/
	@Column(name = "dept_id")
	private String deptId;
	@Column(name = "position_id")
	private String positionId;
	@Column(name = "real_name")
	private String realName;/**/
	private String icon;/**/
	private String nick;/**/
	private String sex;/**/
	private Float score;
	private String mobile;/**/
	private String address;/**/
	private String email;/**/
	private String fax;/**/
	private String facebook;/**/
	private String icq;/**/
	private String talk;/* 韩国的talk */
	private String wechat;/**/
	private String line;/**/
	@Column(name = "login_date")
	private Date loginDate;/**/
	@Column(name = "error_num")
	private Integer errorNum;/**/
	@Column(name = "error_date")
	private Date errorDate;/**/
	@Column(name = "login_num")
	private Integer loginNum;/**/
	@Column(name = "login_token")
	private String loginToken;/**/
	@Column(name = "reg_status")
	private String regStatus;/* create->valid */
	@Column(name = "reg_status_date")
	private Date regStatusDate;/**/
	private String status;/* lock/open/close */
	@Column(name = "status_date")
	private Date statusDate;/**/
	@Column(name = "create_date")
	private Date createDate;/**/
	@Column(name = "modify_date")
	private Date modifyDate;/**/
	@Column(name = "xcx_openid")
	private String xcxOpenId;
	@Column(name = "gzh_openid")
	private String gzhOpenId;
	@Column(name = "kf_openid")
	private String kfOpenId;
	@Column(name = "resource_openid")
	private String resourceOpenId;
	@Column(name = "unionid")
	private String unionId;
	private Date birthday;
	private String idcard;
	@Column(name = "source_name")
	private String sourceName;
	@Column(name = "client_type")
	private String clientType;
	
	public String getClientType() {
		return clientType;
	}

	public void setClientType(String clientType) {
		this.clientType = clientType;
	}

	public String getSourceName() {
		return sourceName;
	}

	public void setSourceName(String sourceName) {
		this.sourceName = sourceName;
	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getIdcard() {
		return idcard;
	}

	public void setIdcard(String idcard) {
		this.idcard = idcard;
	}

	public String getKfOpenId() {
		return kfOpenId;
	}

	public void setKfOpenId(String kfOpenId) {
		this.kfOpenId = kfOpenId;
	}

	public String getResourceOpenId() {
		return resourceOpenId;
	}

	public void setResourceOpenId(String resourceOpenId) {
		this.resourceOpenId = resourceOpenId;
	}

	public String getXcxOpenId() {
		return xcxOpenId;
	}

	public void setXcxOpenId(String xcxOpenId) {
		this.xcxOpenId = xcxOpenId;
	}

	public String getGzhOpenId() {
		return gzhOpenId;
	}

	public void setGzhOpenId(String gzhOpenId) {
		this.gzhOpenId = gzhOpenId;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public Float getScore() {
		return score;
	}

	public void setScore(Float score) {
		this.score = score;
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSourceId() {
		return sourceId;
	}

	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}

	public String getProjectId() {
		return this.projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getUid() {
		return this.uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public String getAccount() {
		return this.account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getPasswd() {
		return this.passwd;
	}

	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}

	public String getRealName() {
		return this.realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getNick() {
		return this.nick;
	}

	public void setNick(String nick) {
		this.nick = nick;
	}

	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFax() {
		return this.fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getFacebook() {
		return this.facebook;
	}

	public void setFacebook(String facebook) {
		this.facebook = facebook;
	}

	public String getIcq() {
		return this.icq;
	}

	public void setIcq(String icq) {
		this.icq = icq;
	}

	public String getTalk() {
		return this.talk;
	}

	public void setTalk(String talk) {
		this.talk = talk;
	}

	public String getWechat() {
		return this.wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public String getLine() {
		return this.line;
	}

	public void setLine(String line) {
		this.line = line;
	}

	public Date getLoginDate() {
		return this.loginDate;
	}

	public void setLoginDate(Date loginDate) {
		this.loginDate = loginDate;
	}

	public Integer getErrorNum() {
		return this.errorNum;
	}

	public void setErrorNum(Integer errorNum) {
		this.errorNum = errorNum;
	}

	public Date getErrorDate() {
		return this.errorDate;
	}

	public void setErrorDate(Date errorDate) {
		this.errorDate = errorDate;
	}

	public Integer getLoginNum() {
		return this.loginNum;
	}

	public void setLoginNum(Integer loginNum) {
		this.loginNum = loginNum;
	}

	public String getLoginToken() {
		return this.loginToken;
	}

	public void setLoginToken(String loginToken) {
		this.loginToken = loginToken;
	}

	public String getRegStatus() {
		return this.regStatus;
	}

	public void setRegStatus(String regStatus) {
		this.regStatus = regStatus;
	}

	public Date getRegStatusDate() {
		return this.regStatusDate;
	}

	public void setRegStatusDate(Date regStatusDate) {
		this.regStatusDate = regStatusDate;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getStatusDate() {
		return this.statusDate;
	}

	public void setStatusDate(Date statusDate) {
		this.statusDate = statusDate;
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

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getPositionId() {
		return positionId;
	}

	public void setPositionId(String positionId) {
		this.positionId = positionId;
	}
}
