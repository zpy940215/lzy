package com.pro.msv.user.vo;

import java.util.Date;

/**
 * 
 **/
public class UserVo {
	private String id;
	/**/
	private String projectId;
	/* user/system/cust(微店铺) */
	private String type;
	private String sourceId;// 来源渠道id
	/**/
	private Long uid;

	private String xcxOpenId;

	private String gzhOpenId;

	private String kfOpenId;

	private String resourceOpenId;/* 支付，授权不一致用于支付 */

	private String unionId;
	/**/
	private String account;
	/**/
	private String passwd;
	/* 部门id */
	private String deptId;
	/* 职位id */
	private String positionId;

	/**/
	private String realName;
	/**/
	private String icon;

	/**/
	private String nick;
	/**/
	private String sex;
	/**/
	private String mobile;

	private Float score;

	private Float rankScore;

	private String keywords;

	private Date birthday;

	private String idcard;

	private String sourceName;

	private String personNum;

	private String clientType;

	public String getClientType() {
		return clientType;
	}

	public void setClientType(String clientType) {
		this.clientType = clientType;
	}

	public String getPersonNum() {
		return personNum;
	}

	public void setPersonNum(String personNum) {
		this.personNum = personNum;
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

	/**/
	private String address;
	/**/
	private String email;
	/**/
	private String fax;
	/**/
	private String facebook;
	/**/
	private String icq;
	/* 韩国的talk */
	private String talk;
	/**/
	private String wechat;
	/**/
	private String line;
	/**/
	private Date loginDate;
	/**/
	private Integer errorNum;
	/**/
	private Date errorDate;
	/**/
	private Integer loginNum;
	/**/
	private String loginToken;
	/* create->valid */
	private String regStatus;
	/**/
	private Date regStatusDate;
	/* lock/open/close */
	private String status;
	/**/
	private Date statusDate;
	/**/
	private Date createDate;
	/**/
	private Date modifyDate;
	// 用户站点中间表关联
	private String siteId;
	// 用户角色中间表关联
	private String roleId;

	/* 项目根区域 */
	private String rootAreaid;

	// 开始时间，结束时间
	private Date startDate;
	private Date endDate;

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

	public String getSiteId() {
		return siteId;
	}

	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getRootAreaid() {
		return rootAreaid;
	}

	public void setRootAreaid(String rootAreaid) {
		this.rootAreaid = rootAreaid;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Float getRankScore() {
		return rankScore;
	}

	public void setRankScore(Float rankScore) {
		this.rankScore = rankScore;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}
}
