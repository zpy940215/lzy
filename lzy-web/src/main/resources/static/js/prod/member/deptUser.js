define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'moment', 'stay'],
function($, common, jqueryui, Handlebars, HandlebarExt, moment, stay) {
	var member = {
		//每页显示数量
		pageSize: 10,
		//总页数
		pageTotal: 1,
		//当前页
		pageCur: 1,
		//总条数
		total: 1,
		isAjaxing: false,
		deptList:[],
		deptPositionList:[],
		memberList: function() {
			var postData = {};
			postData['userVo.realName'] = $('.js_realName').val();
			postData['pageObject.page'] = member.pageCur;
			postData['pageObject.pagesize'] = member.pageSize;
			postData['userVo.account'] = $('.js_search_input').val();
			postData['userVo.deptId'] = $('.js_dept_select').val();
			postData['userVo.positionId'] = $('.js_positionId_select').val();
			postData['userVo.type'] = 'user';
			$.ajax({
				url: '${base}/memberDeptUser!queryListAll.action',
				type: 'POST',
				data: postData,
				dataType: 'json',
				beforeSend: function () {
					common.base.loading("fadeIn");
				},
				success: function (resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#user-list").html());
						$("#user-list-content").html(_templ(resultData.data.data));
						//分页
						member.pageTotal = resultData.data.data.pagetotal;
						member.total = resultData.data.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: member.pageCur,
							pageTotal: member.pageTotal,
							total: member.total,
							backFn: function(p) {
								member.pageCur = p;
								member.memberList();
							}
						});
						member.memberChangeStatus(); //初始化禁用启用
						member.memberDelete(); //初始化删除事件
						member.memberResetPwd(); //初始化重置密码事件
						member.checkbox(); //全选反选
						member.batchrowdelete(); //批量选择删除
						member.deptUserAdd();//初始化增加员工
						member.exportDeptExcel();//初始化导出Excel
						member.importPositionExcel();//初始化导入Excel
						member.importDeptExcelSbu();
						member.queryOne();//查询一条记录
					} else {
						if (resultData && resultData.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'choice',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.description,
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
						}
					}
				},
				error: function () {
					
				}
			});
		},
		
		importDeptExcelSbu:function(){
			$("#importRloe").unbind("click");
			$("#importRloe").on('click',
			function() {
				var fileDir = $("#upfile").val();
				var suffix = fileDir.substr(fileDir.lastIndexOf("."));
				if ("" == fileDir) {
					alert("选择需要导入的Excel文件！");
					return false;
				}
				if (".xls" != suffix && ".xlsx" != suffix) {
					alert("选择Excel格式的文件导入！");
					return false;
				}
				var files = $("#upfile").prop('files');
				var data = new FormData();
				data.append('file', files[0]);
				
				$.ajax({
					url: '${base}/memberDeptUser!importPositionExcel.ajax',
					data: data,
					type: 'POST',
					cache: false,
					processData: false,
					contentType: false,
					success: function(resultData) {
						if(resultData.code == "success" ){
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: '操作成功!',
								//提示语
								backFn: function(result) {
									window.location.href="${base}/prod/member/deptUser.html";
									member.pageCur = 1;
									member.memberList();
								}
							});
							
						}else{
							if (resultData && resultData.description) {
								//alert(resultData.description);
								common.base.popUp('', {
									type: 'choice',
									tipTitle: '温馨提示',
									//标题
									tipMesg: resultData.description,
									//提示语
									backFn: function(result) {
										window.location.href="${base}/prod/member/deptUser.html";
									}
								});
								
							}
						}
						
					}
				})
			});
		},
		
		importPositionExcel:function(){
			$('.js_importDeptExcel').unbind('click');
			$('.js_importDeptExcel').click(function() {
				var _templ = Handlebars.compile($("#addquestion-import").html());
				$("#importQuestion").html(_templ());
				common.base.popUp('.js_question_import');
				member.importDeptExcelSbu();
			});
		},
		
		exportDeptExcel:function(){
			$('.js_exportDeptExcel').unbind('click');
			$('.js_exportDeptExcel').click(function() {
				$.ajax({
					url: '${base}/memberDeptUser!exportDeptExcel.ajax',
					data: {},
					dataType: "json",
					success: function(resultData) {
						if(resultData == "success" ){
							var path=$.cookie("orderList");
							window.location.href=path;
						}else{
							common.base.popUp('', {
								type: 'choice',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.description,
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
						}
					}
				})
			});
		},
		
		deptUserAdd:function () {
			$('.js_deptUser_add').unbind("click");
			$(".js_deptUser_add").click(function() {
				
				var deptData = [];
				var _templ = Handlebars.compile($("#dept-list").html());
				deptData['deptList'] = member.deptList;
				deptData['deptPositionList'] = member.deptPositionList;
				$("#deptUseradd-save-content").html(_templ(deptData));
				common.base.popUp('.js_deptUseadd');
				
				$(document).on("change",'select.js_positiontext',function(){
				     console.log($(this).click(function() {
			    	 	member.positionList($(".js_positiontext").val());
						$(this).unbind("click");
					}));
				 });
				$(".js_positionSubmit").click(function() {
					member.addDeptUser();
				})
			})
		},
		
		addDeptUser:function(){
			var checkResult = true;
			if (!common.validate.checkEmpty('#username', '请输入账号！')) {
				checkResult = false;
			}
			if (!common.validate.checkEmpty('#realName', '请输入真实姓名！')) {
				checkResult = false;
			}
			if (!common.validate.checkEmpty('#usernick', '请输入用户昵称！')) {
				checkResult = false;
			}
			if (!common.validate.checkEmpty('#sex', '请选择性别！')) {
				checkResult = false;
			}
			if (!common.validate.checkEmpty('#mobile', '请输入联系电话！')) {
				checkResult = false;
			}
			if (!checkResult) {
				return false;
			}
			var userdata = {};
			userdata["userVo.type"]="user";
			userdata["userVo.deptId"]=$(".js_positiontext").val();
			userdata["userVo.positionId"]=$(".js_depttext").val();
			userdata["userVo.account"]=$("#username").val();
			userdata["userVo.passwd"]="123456";
			userdata["userVo.nick"]=$("#usernick").val();
			userdata["userVo.realName"]=$("#realName").val();
			userdata["userVo.sex"]=$("input[type='radio']:checked").val();
			userdata["userVo.mobile"]=$("#mobile").val();
			userdata["userVo.status"]="open";
			userdata["userVo.id"]=$("#userId").val();
			$.ajax({
				url: '${base}/memberDeptUser!addDeptUser.ajax',
				type: 'POST',
				data: userdata,
				dataType: 'json',
				success: function (resultData) {
					if (resultData.code == "success") {
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '操作成功!',
							//提示语
							backFn: function(result) {
								member.pageCur = 1;
								member.memberList();
								$('.js_deptUseadd').fadeOut();
							}
						});
					}else{
						if (resultData && resultData.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'choice',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.description,
								//提示语
								backFn: function(result) {
									//alert(result);
									
								}
							});
						}
					}
				}
			})
		},
		
		positionList:function(deptId){
			$.ajax({
				url: '${base}/member!queryPositionList.ajax',
				type: 'POST',
				data: {
					"deptPositionVo.deptId":deptId
				},
				dataType: 'json',
				success: function (resultData) {
					if (resultData.code == "success") {
						var positionVoList = resultData.data.deptPositionVoList;
						var html="";
						if(positionVoList!=null&&positionVoList.length>0){
							for(var i=0;i<positionVoList.length;i++){
								var positionVo = positionVoList[i];
								html+="<option value="+positionVo.positionId+">"+positionVo.name+"</option>";
							}
						}
						$(".js_depttext").html(html);
					}
				}
			})
		},
		
		deptList:function () {
			$.ajax({
				url: '${base}/member!queryDeptListAll.ajax',
				type: 'POST',
				data: {
					"deptVo.status":"open",
				},
				dataType: 'json',
				success: function (resultData) {
					if (resultData.code == "success") {
						member.deptList=resultData.data.deptVoList;
						member.deptPositionList=resultData.data.deptPositionVoList;
					}
				}
			});
		},
		
		memberChangeStatus:function () {
			//禁用启用
			$('.js_change_status').unbind('click');
			$('.js_change_status').click(function () {
				var Id = $(this).attr('dataId');
				var status = $(this).attr('status');
				$.ajax({
					url: '${base}/user!changeStatus.ajax',
					data: {
						'userVo.status' : status,
						'userVo.id' : Id
					},
					dataType: 'json',
					beforeSend: function () {
						common.base.loading("fadeIn");
					},
					success: function (resultData) {
						common.base.loading("fadeOut");
						if (resultData.code == "success") {
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: '操作成功!',
								//提示语
								backFn: function(result) {
									member.pageCur = 1;
									member.memberList();
								}
							});
						} else {
							if (resultData && resultData.description) {
								//alert(resultData.description);
								common.base.popUp('', {
									type: 'choice',
									tipTitle: '温馨提示',
									//标题
									tipMesg: resultData.description,
									//提示语
									backFn: function(result) {
										//alert(result);
									}
								});
							}
						}
					},
					error: function () {

					}
				});
			});
		},
		memberDelete: function() {
			//删除
			$(".js_delete_row").unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/user!changeStatus.ajax',
								data: {
									'userVo.status' : 'close',
									'userVo.id' : Id
								},
								dataType: 'json',
								beforeSend: function () {
									common.base.loading("fadeIn");
								},
								success: function (resultData) {
									common.base.loading("fadeOut");
									if (resultData.code == "success") {
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: '删除成功!',
											//提示语
											backFn: function(result) {
												member.pageCur = 1;
												member.memberList();
											}
										});
									} else {
										if (resultData && resultData.description) {
											//alert(resultData.description);
											common.base.popUp('', {
												type: 'choice',
												tipTitle: '温馨提示',
												//标题
												tipMesg: resultData.description,
												//提示语
												backFn: function(result) {
													//alert(result);
												}
											});
										}
									}
								},
								error: function () {

								}
							});
						}
					}
				});
			});
		},
		//批量选择删除
		batchrowdelete: function() {
			$('.js_banch_delete').unbind("click");
			$('.js_banch_delete').click(function() {
				var rowchecked = $(".js_check_row:checked");
				if (rowchecked.length == '0') {

					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',//标题
						tipMesg: '请选择要删除的行'//提示语
					});
				} else {
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',//标题
						tipMesg: '是否删除选定会员？',//提示语
						backFn: function(result) {
							if (result) {
								rowchecked.parents('tr').remove();
								rowchecked.each(function() {
									$.ajax({
										url: '${base}/user!changeStatus.ajax',
										data: {
											'userVo.status' : 'close',
											'userVo.id' : $(this).parents("tr").attr("dataId")
										},
										dataType: 'json',
										beforeSend: function () {
											common.base.loading("fadeIn");
										},
										success: function (resultData) {
											common.base.loading("fadeOut");
											if (resultData.code == "success") {
												member.pageCur = 1;
												member.memberList();
											} else {
												if (resultData && resultData.description) {
													//alert(resultData.description);
													common.base.popUp('', {
														type: 'choice',
														tipTitle: '温馨提示',
														//标题
														tipMesg: resultData.description,
														//提示语
														backFn: function(result) {
															//alert(result);
														}
													});
												}
											}
										},
										error: function () {

										}
									});
								});
							}
						}
					});
				}
			})
		},
		//重置密码
		memberResetPwd: function() {
			$(".js_reset_pwd").unbind("click");
			$(".js_reset_pwd").click(function() {
				var uid = $(this).attr('uid');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定重置密码？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/user!resetpwd.ajax',
								data: {
									'newpasswd' : '123456',
									'userVo.uid' : uid
								},
								dataType: 'json',
								beforeSend: function () {
									common.base.loading("fadeIn");
								},
								success: function (resultData) {
									common.base.loading("fadeOut");
									if (resultData.code == "success") {
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: '重置密码成功!',
											//提示语
											backFn: function(result) {
												//alert(result);
											}
										});
									} else {
										if (resultData && resultData.description) {
											//alert(resultData.description);
											common.base.popUp('', {
												type: 'choice',
												tipTitle: '温馨提示',
												//标题
												tipMesg: resultData.description,
												//提示语
												backFn: function(result) {
													//alert(result);
												}
											});
										}
									}
								},
								error: function () {

								}
							});
						}
					}
				});
			});
		},
		//列表全选反选
		checkbox: function() {

			$('.js_check_all').unbind("click");
			/*列表全选反选*/
			$(".js_check_all").on('click',
			function() {

				if ($(this).attr("checked")) {
					$(".js_check_row").prop("checked", false);
					$(this).attr("checked", false);
				} else {
					$(".js_check_row").prop("checked", true);
					$(this).attr("checked", true);
				}
			})
		},
		//查询一条记录
		queryOne: function() {
			$('.js_updata').unbind("click");
			$(".js_updata").on('click',function() {
				var uid = $(this).attr('uid');
				$.ajax({
					url: '${base}/user!queryUserListAll.ajax',
					data: {
						'userVo.uid' : uid
					},
					dataType: 'json',
					success: function (resultData) {
						if (resultData.code == "success") {
							var deptData = [];
							var _templ = Handlebars.compile($("#dept-list").html());
							deptData['deptList'] = member.deptList;
							deptData['deptPositionList'] = resultData.data.deptPositionVos;
							deptData['userVo'] = resultData.data.userVoList[0];
							$("#deptUseradd-save-content").html(_templ(deptData));
							common.base.popUp('.js_deptUseadd');
							
							$(document).on("change",'select.js_positiontext',function(){
							     console.log($(this).click(function() {
						    	 	member.positionList($(".js_positiontext").val());
									$(this).unbind("click");
								}));
							 });
							$(".js_positionSubmit").click(function() {
								member.addDeptUser();
							})
						} else {
							if (resultData && resultData.description) {
								//alert(resultData.description);
								common.base.popUp('', {
									type: 'choice',
									tipTitle: '温馨提示',
									//标题
									tipMesg: resultData.description,
									//提示语
									backFn: function(result) {
										//alert(result);
									}
								});
							}
						}
					},
				});
			})
		},
	}
	var memberListInit = function() {
		member.memberList();
		member.deptList();
		$('.js_search').on('click', function () {
			member.pageCur = 1;
			member.memberList();
		});
	}
	return {
		init: memberListInit
	};
})