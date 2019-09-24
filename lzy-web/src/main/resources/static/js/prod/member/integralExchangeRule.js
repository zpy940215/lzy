define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'moment', 'stay'],
function($, common, jqueryui, Handlebars, HandlebarExt, moment, stay) {
	var member = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数
		isAjaxing: false,
		memberList: function() {
			var postData = {};
			postData['pageObject.page'] = member.pageCur;
			postData['pageObject.pagesize'] = member.pageSize;
			postData['projectConfigVo.type'] = 'integral_consume_rule';
			postData['projectConfigVo.posStr'] = 'name';
			$.ajax({
				url: '${base}/rule!exchangeRulePageQuery.ajax',
				data: postData,
				dataType: 'json',
				beforeSend: function () {
					common.base.loading("fadeIn");
				},
				success: function (resultData) {
					console.log(resultData);
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#rule-list").html());
						$("#rule-list-content").html(_templ(resultData.data));
						//分页
						member.pageTotal = resultData.data.pagetotal;
						member.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: member.pageCur,
							pageTotal: member.pageTotal,
							total: member.total,
							backFn: function(p) {
								member.pageCur = p;
								member.memberList();
							}
						});
						
						member.memberDelete(); //初始化删除事件
						member.checkbox(); //全选反选
						member.batchrowdelete(); //批量选择删除
						member.consumeRuleEdit();
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
		memberDelete: function() {
			//删除
			$(".js_delete_row").unbind("click");
			$(".js_delete_row").click(function() {
				var name = $(this).attr('name');
				var val =$(this).attr('val');
				var dataId =$(this).attr('dataid');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/rule!modifyRuleById.ajax',
								data: {
									'projectConfigVo.status' : 'close',
									'projectConfigVo.id' : dataId,
									'projectConfigVo.type' : 'integral_consume_rule',
									'projectConfigVo.name' : name,
									'projectConfigVo.val' : val
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
						tipMesg: '是否删除选定规则？',//提示语
						backFn: function(result) {
							if (result) {
								rowchecked.parents('tr').remove();
								rowchecked.each(function() {
									$.ajax({
										url: '${base}/rule!modifyRuleById.ajax',
										data: {
											'projectConfigVo.status' : 'close',
											'projectConfigVo.id' :  $(this).parents("tr").attr("dataId"),
											'projectConfigVo.type' : 'integral_consume_rule',
											'projectConfigVo.name' :  $(this).parents("tr").attr("name"),
											'projectConfigVo.val' :  $(this).parents("tr").attr("val")
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
		//添加规则弹窗
		ruleadd: function() {
			$('.js_rule_add').unbind("click");
			$(".js_rule_add").click(function() {
				$('.js_popUpSubmit').unbind('click');
				$('#genresubmit').unbind('click');
				var upId = $(this).attr('type_id');
				var typeData = [];
				var _templ = Handlebars.compile($("#consume-rule-save").html());
				typeData['popUp'] = {
					titleName: '新增规则',
				};
				$("#ruleadd-save-content").html(_templ(typeData));
				common.base.popUp('.js_popUpruleadd');
				$(".js_popUpSubmit").click(function() {			
					member.ruleSave();
				})
			})

		},
		//保存
		ruleSave: function() {
			if (member.isAjaxing) {
				return false;
			}
			member.isAjaxing = true;
			var checkResult = true,
			dataPost = {};
			var res = /^[0-9]*$/;
			if ($("#name").val()== ""  ) {
				$(".js_errortip1").html("请输入消费额度");
				checkResult = false;
			} else if(!res.test($("#name").val())){
				$(".js_errortip1").html("只能输入数字");
				checkResult = false;
			}else{
				$(".js_errortip1").html("");
			}
			
			if ($("#val").val()== "") {
				$(".js_errortip2").html("请输入可用积分");
				checkResult = false;
			}else if(!res.test($("#val").val())){
				$(".js_errortip2").html("只能输入数字");
				checkResult = false;
			}else {
				$(".js_errortip2").html("");
			}
			if (!checkResult) {
				member.isAjaxing = false;
				return false;
			}
			dataPost['projectConfigVo.name'] = $("#name").val();
			dataPost['projectConfigVo.val'] = $("#val").val();
			dataPost['projectConfigVo.type'] = 'integral_consume_rule';
			dataPost['projectConfigVo.posStr'] = 'name';
			$.ajax({
				url: '${base}/rule!addExchangeRule.ajax',
				data: dataPost,
				type: 'post',
				dataType: "json",
				success: function(resultData) {
					member.isAjaxing = false;
					if (resultData.data.code == "200") {
						$('.js_popUpgenreadd').fadeOut();
						//新增完成刷新列表
						$(".js_pms-tabletree").html('');
						member.memberList();
					} else {
						if (resultData && resultData.data.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.data.description,
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
						}
					}
				},
				error: function(resultData) {
					member.isAjaxing = false;
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '操作异常',
						//提示语
						backFn: function(result) {
							//alert(result);
						}
					});
				}
			});

		},
		//积分抵扣规则修改
		ruleEdit:function(){
			$('#ruleeditsubmit').unbind("click");
			$("#ruleeditsubmit").click(function(){
				member.modifly($("#ruleId").val(), "integral_exchange_rule", $("#ruleName").val(), $("#ruleVal").val(),"open")
			})
		},
		//编辑规则
		consumeRuleEdit: function() {
			$('.js_edit_row').unbind("click");
			$(".js_edit_row").click(function() {
				$('.js_popUpSubmit').unbind('click');
				
				var name = $(this).attr('name');
				var val =$(this).attr('val');
				var dataId =$(this).attr('dataid');
				var typeData = [];
				var _templ = Handlebars.compile($("#consume-rule-save").html());
				typeData['popUp'] = {
					titleName: '编辑规则',
				};
				typeData['name']=name;
				typeData['val']=val;
				typeData['editId']=dataId;
				$("#ruleadd-save-content").html(_templ(typeData));
				common.base.popUp('.js_popUpruleadd');
				$(".js_popUpSubmit").click(function() {	
					if (member.isAjaxing) {
						return false;
					}
					member.isAjaxing = true;
					var checkResult = true;
					var res = /^[0-9]*$/;
					if ($("#name").val()== ""  ) {
						$(".js_errortip1").html("请输入消费额度");
						checkResult = false;
					} else if(!res.test($("#name").val())){
						$(".js_errortip1").html("只能输入数字");
						checkResult = false;
					}else{
						$(".js_errortip1").html("");
					}
					
					if ($("#val").val()== "") {
						$(".js_errortip2").html("请输入可用积分");
						checkResult = false;
					}else if(!res.test($("#val").val())){
						$(".js_errortip2").html("只能输入数字");
						checkResult = false;
					}else {
						$(".js_errortip2").html("");
					}
					if (!checkResult) {
						member.isAjaxing = false;
						return false;
					}
					member.modifly($("#editId").val(), "integral_consume_rule", $("#name").val(),$("#val").val(), "open");
				})
			})

		},
		//修改
		modifly:function(id,type,name,val,status){
			var dataPost = {};
			dataPost['projectConfigVo.name'] = name;
			dataPost['projectConfigVo.val'] = val;
			dataPost['projectConfigVo.type'] = type;
			dataPost['projectConfigVo.id'] = id;
			dataPost['projectConfigVo.stauts'] = status;
			$.ajax({
				url: '${base}/rule!modifyRuleById.ajax',
				data: dataPost,
				type: 'post',
				dataType: "json",
				success: function(resultData) {
					member.isAjaxing = false;
					if (resultData.data.code == "200") {
						$('.js_popUpgenreadd').fadeOut();
						//新增完成刷新列表
						alert("修改成功");
						$(".js_pms-tabletree").html('');
						member.memberList();
						$('.js_popUpruleadd').fadeOut();
					} else {
						if (resultData && resultData.data.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.data.description,
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
						}
					}
				}
				
			});
		}
		
	}
	var memberListInit = function() {
		common.base.DateTimeselect('.js_register_startDate','.js_register_endDate');
		member.memberList();
		member.ruleEdit();
		member.ruleadd();
		
		$('.js_search').on('click', function () {
			member.pageCur = 1;
			member.memberList();
		});
	}
	return {
		init: memberListInit
	};
})