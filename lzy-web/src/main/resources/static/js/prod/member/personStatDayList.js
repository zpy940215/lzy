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
		uid:$("#uid").val(),
		//uid
		isAjaxing: false,
		memberList: function() {
			var postData = {};
			postData['pageObject.page'] = member.pageCur;
			postData['pageObject.pagesize'] = member.pageSize;
			postData['dayVo.startDate'] = $('.js_register_startDate').val();
			postData['dayVo.endDate'] = $('.js_register_endDate').val();
			postData['dayVo.uid'] = member.uid;
			postData['dayVo.articleId'] = 'ALL';
			$.ajax({
				url: '${base}/member!userStatDayListByUid.ajax',
				data: postData,
				dataType: 'json',
				beforeSend: function () {
					common.base.loading("fadeIn");
				},
				success: function (resultData) {
					console.log(resultData);
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
		memberChangeStatus:function () {},
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
		}
	}
	var memberListInit = function() {
		member.DateTime('.js_register_startDate','.js_register_endDate');
		member.memberList();
		$('.js_search').on('click', function () {
			member.pageCur = 1;
			member.memberList();
		});
	}
	return {
		init: memberListInit
	};
})