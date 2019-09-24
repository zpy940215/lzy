define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var data = {};
	var oldAccount = "";
	var manapeoList = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,
		isAjaxing: false,
		list: function() {
			data['pageObject.page'] = manapeoList.pageCur;
			data['pageObject.pagesize'] = manapeoList.pageSize;
			data['userVo.type'] = "merchant";
			$.ajax({
				url: '${base}/manager!list.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				async:false,
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
					common.base.loading("fadeOut");
				}
			});
			manapeoList.addpeople();
			manapeoList.editpeople();
			manapeoList.deleterow();
		},
		viewTypeChange:function() {
			$(".js_viewTypeSelect").change(function(){
				manapeoList.viewlist();
			});
		},
		// 生成0-9的随机数
		createRandomNum:function() {
			var Random = Math.random();   
			return (0 + Math.round(Random * 9));
		},
		// 重置密码
		resetRandomNum:function() {
			$(".js_psd_reset").on('click',function(){
				var newPsd = "";
				var uid = $(this).attr("uid");
				for(var j = 0;j < 6;j++) {
					newPsd += manapeoList.createRandomNum();
				}
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: "密码将重置为"+newPsd+",确定修改?",
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url:"user!resetpwd.ajax",
								data:{
									"newpasswd":newPsd,
									"userVo.uid":uid,
								},
								dataType:"json",
								type:"post",
								success:function(result) {
									if(result.code == "success") {
										manapeoList.popTip("密码已重置为"+newPsd+",请牢记!");
									} else {
										manapeoList.popTip("密码重置失败");
									}
								}
							});
						}
					}
				});
				
			});
		},
		popTip:function(desc) {
			common.base.popUp('', {
				type: 'tip',
				tipTitle: '温馨提示',
				//标题
				tipMesg: desc,
				//提示语
				backFn: function(result) {
					if (result) {
						
					}
				}
			});
		},
		//商户列表
		viewlist:function() {
			var data = {};
			var type = $(".js_viewTypeSelect").val();
			if(type != null) {
				data['viewVo.type'] = type;
			}
			$.ajax({
				url:"view!queryListAll.ajax",
				data:data,
				type:"post",
				dataType:"json",
				async:false,
				success:function(result) {
					if(result.code == "success") {
						$(".js_merchantSelect").html("");
						var htmlstr = "";
						var datalist = result.data.viewVoList;
						for(var j in datalist) {
							htmlstr += "<option value="+datalist[j].viewId+">"+datalist[j].name+"</option>";
						}
						$(".js_merchantSelect").html(htmlstr);
					}
				}
			});
		},
		search: function() {
			$("#search").click(function() {
				data['userVo.realName'] = $(".search_input").val();
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
		// 重名验证
		checkSameName:function(oldaccount,account) {
			if(oldaccount == account) {
				return true;
			}
			var check = false;
				$.ajax({
					url:"manager!queryOne.ajax",
					data:{
						"userVo.account":account,
						"userVo.status":'open',
					},
					dataType:"json",
					type:"post",
					async:false,
					success:function(result) {
						if(result.code == "success") {
							if(result.data.userVo.id == null) {
								check = true;
							} else {
								check = false;
							}
						}
					}
				});
			return check;
		},
		//添加管理员
		addpeople: function() {
			$('.js_add_people').unbind("click");
			$('.js_add_people').on('click',function() {
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
				manapeoList.viewTypeChange();
			});
		},
		peopleAdd: function() {
			if(!manapeoList.isAjaxing){
				manapeoList.isAjaxing=true;
				var account = $(".js_account").val();
				var realName = $(".js_realName").val();
				var passwd = $(".js_passwd").val();
				var sex = $('input:radio[name="js_sex"]:checked').val();
				var viewId = $(".js_merchantSelect").find("option:selected").attr("value");
	
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
				if (viewId == null || viewId == undefined || viewId == '' || viewId == '请选择') {
					$(".js_merchantSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择商户");
					checkResult = false;
				} else {
					$(".js_merchantSelect").siblings(".js_errortip").html('');
				}
				if(!manapeoList.checkSameName("",account)) {
					checkResult = false;
					alert("该用户名已注册!");
				}
				var data = {};
				data['userVo.account'] = account;
				data['userVo.realName'] = realName;
				data['userVo.passwd'] = passwd;
				data['userVo.sex'] = sex;
				data['viewUserVo.viewId'] = viewId;
				//验证通过之后，可以提交数据
				if (checkResult) {
					$.ajax({
						url: '${base}/manager!userNoRoleSaveOrUpdate.ajax',
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
		peopleEdit: function(id,type,viewUserId) {
			$('.js_popUpeditpeople .save').unbind("click");
			//确认编辑
			$('.js_popUpeditpeople').on('click', '.save',
			function() {
				var viewId = $(".js_merchantSelect").find("option:selected").attr("value");
				var account = $(".account").val();
				var realName = $(".realName").val();
				var passwd = $(".passwd").val();
				var sex = $('input:radio[name="sex"]:checked').val();
				var data = {};
				data['userVo.account'] = account;
				data['userVo.realName'] = realName;
				data['userVo.passwd'] = passwd;
				data['userVo.sex'] = sex;
				data['userVo.id'] = id;
				data['userVo.type'] = type;
				data['viewUserVo.viewId'] = viewId;
				data['viewUserVo.id'] = viewUserId;

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
				if (viewId == null || viewId == undefined || viewId == '' || viewId == '请选择') {
					$(".js_merchantSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择商户");
					checkResult = false;
					return;
				} else {
					$(".js_merchantSelect").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if(!manapeoList.checkSameName(oldAccount,account)) {
					checkResult = false;
					alert("该用户名已注册!");
				}
				if (checkResult) {
					if (manapeoList.isAjaxing) return false;
					manapeoList.isAjaxing = true;
					$.ajax({
						url: '${base}/manager!userNoRoleSaveOrUpdate.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(data) {
							manapeoList.isAjaxing = false;
							if (data.code == "success") {
								$('.js_popUpeditpeople').fadeOut();
								manapeoList.list();
								alert("编辑成功");
								window.location.href = "${base}/tool/manager/merchantList.html";
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
			$('.js_edit_people').unbind('click');
			$('.js_edit_people').on('click',function(){
				//查询用户信息
				var mainId = $(this).attr('uid');
				var type = $(this).attr('type');
				var viewUserId = $(this).attr('viewUserId');
				//用户id
					data['userVo.id'] = mainId;
					$.ajax({
						url: '${base}/manager!list.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(data) {
							var _templ = Handlebars.compile($("#editpeople-save").html());
							$("#editpeople-save-content").html(_templ());
							common.base.popUp('.js_popUpeditpeople');

							var obj = data.dataList.dataList[0];
							oldAccount = obj.account;
							$(".account").val(obj.account);
							$(".realName").val(obj.realName);
							$('input:radio[name="sex"]:checked').val(obj.sex);
							var sex1 = $("#editpeople-save-content input[name=sex]:eq(0)");
							var sex2 = $("#editpeople-save-content input[name=sex]:eq(1)");
							if (obj.sex == sex1.val()) {
								sex1.attr("checked", 'checked');
							} else if (obj.sex == sex2.val()) {
								sex2.attr("checked", 'checked');
							}
							$('.js_viewTypeSelect').find("option[value="+obj.viewUserVo.viewVo.type+"]").attr("selected",true);
							manapeoList.viewlist();
							$('.js_merchantSelect').find("option[value="+obj.viewUserVo.viewId+"]").attr("selected",true);
							manapeoList.viewTypeChange();
							//编辑用户
							manapeoList.peopleEdit(mainId,type,viewUserId);
						}
				});
			});
		}
	}
	var manapeoListInit = function() {
		manapeoList.list();
		manapeoList.addpeople();
		manapeoList.editpeople();
		manapeoList.deleterow();
		manapeoList.search();
		manapeoList.resetRandomNum();
	}
	return {
		init: manapeoListInit
	};
})