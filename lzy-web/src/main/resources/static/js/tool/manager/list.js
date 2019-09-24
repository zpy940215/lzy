define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var data = {};
	var manapeoList = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,
		isAjaxing: false,
		list: function() {
			data['pageObject.page'] = manapeoList.pageCur;
			data['pageObject.pagesize'] = manapeoList.pageSize;
			$.ajax({
				url: '${base}/manager!list.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				beforeSend: function() {
					common.base.loading("fadeIn");
				},

				success: function(data) {
					var _templ = Handlebars.compile($("#user_list").html());
					$("#user_show").html(_templ(data.dataList));
					//分页
					manapeoList.pageTotal = data.dataList.pagetotal;
					manapeoList.total = data.dataList.total;
					common.base.createPage('.js_pageDiv', {
						pageCur: manapeoList.pageCur,
						pageTotal: manapeoList.pageTotal,
						total: manapeoList.total,
						backFn: function(p) {
							manapeoList.pageCur = p;
							manapeoList.list();
						}
					});
					//编辑
					manapeoList.editpeople();
					//删除
					manapeoList.deleterow();
					common.base.loading("fadeOut");
				}

			});
		},
		//角色列表
		rolelist: function() {
			$.ajax({
				url: '${base}/role!list.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					var _templ = Handlebars.compile($("#editpeople-save").html());
					$("#editpeople-save-content").html(_templ(data));
				}
			});
		},
		search: function() {
			$("#search").click(function() {
				data['userVo.realName'] = $("#roleName").val();
				manapeoList.list();
			});

		},
		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('uid');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							manapeoList.peopleDelete(Id);
						}
					}
				});
			});
		},
		peopleDelete: function(id) {
			var data = {};
			data['userVo.id'] = id;
			$.ajax({
				url: '${base}/manager!delete.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					if (data.code == "success") {
						manapeoList.list();
						return;
					} else {
						alert(data.description);
					}
				}
			});
		},
		//添加管理员
		addpeople: function() {
			$('.js_add_people').unbind("click");
			$('.js_add_people').on('click',
			function() {
				// $('.js_add_people').click(function(){
				//查询角色列表
				var data = {};
				//data['roleVo.type'] = 'manager';
				$.ajax({
					url: '${base}/role!list.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					success: function(data) {
						var _templ = Handlebars.compile($("#addpeople-save").html());
						$("#addpeople-save-content").html(_templ());
						common.base.popUp('.js_popUpaddpeople', {
							tipTitle: '新增成员',//标题
							backFn: function(result) {
								if(result){
									manapeoList.peopleAdd();
								}
							}
						});

						var optionstring = "";
						for (var j in data.dataList.dataList) {
							optionstring += "<option value=\"" + data.dataList.dataList[j].roleId + "\" >" + data.dataList.dataList[j].name + "</option>";
						}
						$(".js_roleSelect").html("<option value='请选择'>请选择</option> " + optionstring);

					}
				});
				//查询站点信息
				$.ajax({
					url: '${base}/site!querySitesList.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: {},
					success: function(data) {
						var optionstring = "";
						for (var j in data.data.sitelist) {
							optionstring += "<option value=\"" + data.data.sitelist[j].siteId + "\" >" + data.data.sitelist[j].name + "</option>";
						}
						$(".siteSelect").html("<option value='请选择'>请选择</option> " + optionstring);

					}
				});
			});

		},
		peopleAdd: function() {
			
			
			if(!manapeoList.isAjaxing){
				manapeoList.isAjaxing=true;
				// alert('1')
				var account = $(".js_account").val();
				var realName = $(".js_realName").val();
				var passwd = $(".js_passwd").val();
				var mobile = $(".js_mobile").val();
				var sex = $('input:radio[name="js_sex"]:checked').val();
				var roleId = $(".js_roleSelect").find("option:selected").attr("value");
				var siteId = $(".js_roleSelect").find("option:selected").attr("value");
	
				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty(".js_account", '请填写用户名称！')) {
					checkResult = false;
				}
				if (!common.validate.checkEmpty(".js_realName", '请填写真实姓名！')) {
					checkResult = false;
				}
				if (!common.validate.checkEmpty(".js_passwd", '请填写密码！')) {
					checkResult = false;
				}
				if (sex == null || sex == undefined || sex == '' || sex == '请选择') {
					$(".js_sexSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择性别");
					checkResult = false;
				}else {
					$(".js_sexSelect").siblings(".js_errortip").html('');
				}
				if (roleId == null || roleId == undefined || roleId == '' || roleId == '请选择') {
					$(".js_roleSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择角色");
					checkResult = false;
				} else {
					$(".js_roleSelect").siblings(".js_errortip").html('');
				}
				if(mobile != null && mobile != undefined && mobile != '') {
					if(common.validate.isTelphone(".js_mobile","请输入正确的手机号！")) {
						checkResult = false;
					}
				}
				var data = {};
				data['userVo.account'] = account;
				data['userVo.realName'] = realName;
				data['userVo.passwd'] = passwd;
				data['userVo.mobile'] = mobile;
				data['userVo.sex'] = sex;
				data['userVo.roleId'] = roleId;
				data['userVo.siteId'] = siteId;
				//验证通过之后，可以提交数据
				if (checkResult) {
					$.ajax({
						url: '${base}/manager!saveOrUpdate.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(data) {
							manapeoList.isAjaxing = false;
							if (data.code == "success") {
								//弹框消失，
								$('.js_popUpaddpeople').fadeOut();
								alert("添加成功");
								manapeoList.list();
								return;
							} else {
								alert(data.description);
							}
						},
						error:function(){
							manapeoList.isAjaxing=false;
						}
					});
				}
				else{
					manapeoList.isAjaxing=false;
					return false;
				}
			}
		},
		peopleEdit: function(id,type) {
			$('.js_popUpeditpeople .save').unbind("click");
			//确认编辑
			$('.js_popUpeditpeople').on('click', '.save',
			function() {
				// alert('1')
				var account = $(".account").val();
				var realName = $(".realName").val();
				var passwd = $(".passwd").val();
				var mobile = $(".mobile").val();
				// var sex=$('#sexSelect input[name="sex"]:checked ').val();
				var sex = $('input:radio[name="sex"]:checked').val();
				// var roleId=$("#roleSelect option:selected");
				var roleId = $(".roleSelect").find("option:selected").attr("value");
				// var siteId=$("#siteSelect option:selected");
				var siteId = $(".siteSelect").find("option:selected").attr("value");
				var data = {};
				data['userVo.account'] = account;
				data['userVo.realName'] = realName;
				data['userVo.passwd'] = passwd;
				data['userVo.mobile'] = mobile;
				data['userVo.sex'] = sex;
				data['userVo.roleId'] = roleId;
				data['userVo.siteId'] = siteId;
				data['userVo.id'] = id;
				data['userVo.type'] = type;

				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty(".account", '请填写用户名称！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".realName", '请填写真实姓名！')) {
					checkResult = false;
					return;
				}

				if (sex == null || sex == undefined || sex == '' || sex == '请选择') {
					$(".sexSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择性别");
					checkResult = false;
					return;
				} else {
					$(".sexSelect").siblings(".js_errortip").html('');
					checkResult = true;

				}
				if (roleId == null || roleId == undefined || roleId == '' || roleId == '请选择') {
					$(".roleSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择角色");
					checkResult = false;
					return;
				} else {
					$(".roleSelect").siblings(".js_errortip").html('');
					checkResult = true;

				}
				if(mobile != null && mobile != undefined && mobile != '') {
					if(common.validate.isTelphone(".js_mobile","请输入正确的手机号！")) {
						checkResult = false;
					}
				}
				//				 if (siteId == null || siteId == undefined || siteId == '' || siteId == '请选择') {
				//					 $(".siteSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>'+"    请选择站点");
				//					 checkResult = false;
				//					 return;
				//				 }else {
				//					 $(".siteSelect").siblings(".js_errortip").html('');
				//					 checkResult = true;
				//				 }
				if (checkResult) {
					if (manapeoList.isAjaxing) return false;
					manapeoList.isAjaxing = true;
					$.ajax({
						url: '${base}/manager!saveOrUpdate.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(data) {
							manapeoList.isAjaxing = false;
							if (data.code == "success") {
								$('.js_popUpeditpeople').fadeOut();
								manapeoList.list();
								alert("编辑成功");
								return;
							} else {
								alert(data.description);
							}
						}
					});
				}

			});
		},
		//编辑管理员成员
		editpeople: function() {
			$('.js_edit_people').unbind("click");
			$(".js_edit_people").on('click',
			function() {
				//先显示弹框
				var _templ = Handlebars.compile($("#editpeople-save").html());
				$("#editpeople-save-content").html(_templ());
				common.base.popUp('.js_popUpeditpeople');

				//查询用户信息
				var mainId = $(this).attr('uid');
				var type = $(this).attr('type');
				//查询角色
				$.ajax({
					url: '${base}/role!list.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: {
						
					},
					success: function(data) {
						var optionstring = "";
						for (var j in data.dataList.dataList) {
							optionstring += "<option value=\"" + data.dataList.dataList[j].roleId + "\" >" + data.dataList.dataList[j].name + "</option>";
						}
						$(".roleSelect").html("<option value='请选择'>请选择</option> " + optionstring);

						//查询站点信息
						$.ajax({
							url: '${base}/site!querySitesList.ajax',
							type: 'POST',
							dataType: 'JSON',
							data: {},
							success: function(data) {
								var optionstring = "";
								for (var j in data.data.sitelist) {
									optionstring += "<option value=\"" + data.data.sitelist[j].siteId + "\" >" + data.data.sitelist[j].name + "</option>";
								}
								$(".siteSelect").html("<option value='请选择'>请选择</option> " + optionstring);

							}
						});
						//用户id
						data['userVo.id'] = mainId;
						$.ajax({
							url: '${base}/manager!list.ajax',
							type: 'POST',
							dataType: 'JSON',
							data: data,
							success: function(data) {
								var obj = data.dataList.dataList[0];

								$(".account").val(obj.account);
								$(".realName").val(obj.realName);
								$(".mobile").val(obj.mobile);
								// $('input:radio[name="sex"]:checked').val(obj.sex);
								// $(".roleSelect").find("option:selected").attr("value",obj.roleVolist[0].roleId);
								$(".siteSelect").find("option:selected").attr("value", obj.siteId);
								var sex1 = $("#editpeople-save-content input[name=sex]:eq(0)");
								var sex2 = $("#editpeople-save-content input[name=sex]:eq(1)");
								if (obj.sex == sex1.val()) {
									sex1.attr("checked", 'checked');
								} else if (obj.sex == sex2.val()) {
									sex2.attr("checked", 'checked');
								}
								//一个用户多个角色，多个站点会有问题这样写
								$(".roleSelect").find("option[value=" + obj.roleVolist[0].roleId + "]").attr("selected", true);
								// $(".siteSelect").find("option[value=" + obj.siteVolist[0].siteId + "]").attr("selected", true);
								//编辑用户
								manapeoList.peopleEdit(mainId,type);
							}
						});

					}
				});

			})
		}

	}
	var manapeoListInit = function() {
		manapeoList.list();
		manapeoList.rolelist();
		manapeoList.search();
		manapeoList.addpeople();
	}
	return {
		init: manapeoListInit
	};
})