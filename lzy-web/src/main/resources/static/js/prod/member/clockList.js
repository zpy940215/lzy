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
		userType: '',
		sourceName: '',
		memberList: function() {
			if (member.userType == 'team') {
				member.sourceName = $('#temaName').val();
			}else if (member.userType == 'personal') {
				member.sourceName = $('.js_company').val();
			}else if (member.userType == '') {
				member.sourceName = '';
			}
			var postData = {};
			postData['pageObject.page'] = member.pageCur;
			postData['pageObject.pagesize'] = member.pageSize;
			postData['userVo.nick'] = $('.js_nick').val();
			postData['userVo.mobile'] = $('.js_tel').val();
			postData['userVo.sourceId'] = member.userType;
			postData['userVo.sourceName'] = member.sourceName;
			postData['userVo.startDate'] = $('.js_register_startDate').val();
			postData['userVo.endDate'] = $('.js_register_endDate').val();
			postData['userVo.type'] = 'user';

			$.ajax({
				url: '${base}/user!queryListAll.ajax',
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
						member.clockList(); //打卡明细
						member.orderList();
						member.userLogList();
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
		DateTime:function(startdate,enddate){
			$(startdate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true,
				onClose:function(selectedDate){
                      $(this).siblings(enddate).datepicker("option", "minDate", selectedDate);     
				} 	               
		   	});
		   	$(enddate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true
		   	});
		},
		clockList:function() {
			$('.js_clock_detail').unbind('click');
			$('.js_clock_detail').on('click',function() {
				var uid = $(this).attr('uid');
				$.ajax({
					url: '${base}/logUser!queryListNameByUid.ajax',
					data: {
						'logUserVo.uid' : uid,
						'logUserVo.bizType' : 'view',
						'logUserVo.operationType': 'clock'
					},
					dataType: 'json',
					success: function (resultData) {
						if (resultData.code == "success") {
							var logUserVos = resultData.data.logUserVos;
							var _templ = Handlebars.compile($("#clock-detail").html());
							$("#clock-detail-content").html(_templ(resultData.data));
							$('#daka_detail').fadeIn();
							$('.check_btn').click(function(){
								$('.open').fadeOut();
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
				});
			});
		},
		userLogList:function() {
			$('.js_in_detail').unbind('click');
			$('.js_in_detail').on('click',function() {
				var uid = $(this).attr('uid');
				$.ajax({
					url: '${base}/logUser!logUserPageQuery.ajax',
					data: {
						'logUserVo.uid' : uid,
						'logUserVo.bizType' : 'view',
						'pageObject.page':'1',
						'pageObject.pagesize':'100',
						'logUserVo.sort':'desc'
					},
					dataType: 'json',
					success: function (resultData) {
						if (resultData.code == "success") {
							var logUserVos = resultData.data.logUserVos;
							var _templ = Handlebars.compile($("#in-detail").html());
							$("#in-detail-content").html(_templ(resultData.data.data));
							$('#inDetail').fadeIn();
							$('.check_btn').click(function(){
								$('.open').fadeOut();
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
				});
			});
		},
		orderList:function() {
			$('.js_out_detail').unbind('click');
			$('.js_out_detail').on('click',function() {
				var uid = $(this).attr('uid');
				$.ajax({
					url: '${base}/order!queryOrderPage.ajax',
					data: {
						'orderVo.createUid': uid,
						'orderVo.status':'afterpay',
						'pageObject.page':'1',
						'pageObject.pagesize':'100',
					},
					dataType: 'json',
					success: function (resultData) {
						if (resultData.code == "success") {
							var logUserVos = resultData.data.logUserVos;
							var _templ = Handlebars.compile($("#out-detail").html());
							$("#out-detail-content").html(_templ(resultData.data.data));
							$('#outDetail').fadeIn();
							$('.check_btn').click(function(){
								$('.open').fadeOut();
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
				});
			});
		},
		typeChange:function() {
			$('#userType').change(function () {
				var userType = $(this).val();
				member.userType = $(this).val();
				if (userType == 'team') {
					$('#temaName').show();
					$('.js_company').hide();
				}else if (userType == 'personal') {
					$('#temaName').hide();
					$('.js_company').show();
				}else if (userType == '') {
					$('#temaName').hide();
					$('.js_company').hide();
				}
			});
		}
	}
	var memberListInit = function() {
		member.DateTime('.js_register_startDate','.js_register_endDate');
		member.memberList();
		member.typeChange();
		$('.js_search').on('click', function () {
			member.pageCur = 1;
			member.memberList();
		});
	}
	return {
		init: memberListInit
	};
})