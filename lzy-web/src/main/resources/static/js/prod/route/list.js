define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt'],
function($, common, jqueryui, Handlebars, HandlebarExt) {
	var showStatus = '';

	var route = {
		pageSize: 15,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		areaId: '',//筛选地区
		isAjaxing: false,
		routeList: function() {
			route.areaId = $('#selectAreaId').val();
			$.ajax({
				url: '${base}/prod!queryListPage.ajax',
				data: {
					"pageObject.page": route.pageCur,
					"pageObject.pagesize": route.pageSize,
					"prodVo.prodTypeId": "02",
					"prodVo.name": $(".js_search_input").val(),
					"prodVo.areaId": route.areaId,
					"prodVo.status": showStatus
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						console.log(resultData.data);
						var _templ = Handlebars.compile($("#prod-list").html());
						$("#prod-list-content").html(_templ(resultData.data));
						//分页
						route.pageTotal = resultData.data.pagetotal;
						route.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: route.pageCur,
							pageTotal: route.pageTotal,
							total: route.total,
							backFn: function(p) {
								route.pageCur = p;
								route.routeList();
							}
						});
						route.showStatus();
						route.deleterow();
						route.routeadd();
						route.shelf();
						route.sort();
						route.checkbox();
						route.eachIndex();
						route.batchDel();
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
				}
			});
		},


		// 上下架显示
		showStatus: function() {
			$("#showStatus").change(function() {
				showStatus = $("#showStatus").val();
			});
		},

		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".operate").on('click', '.js_delete_row',
			function() {
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
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "delete"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										route.routeList();
									} else {

}
								}
							});
						} else {
							route.deleterow();
							route.routeadd();
							route.shelf();
							route.checkbox();
						}
					}
				});
			});
		},
		//新增行程
		routeadd: function() {
			$('.js_route_add').unbind("click");
			$(".js_route_add").click(function() {
				var _templ = Handlebars.compile($("#routeadd-save").html());
				$("#routeadd-save-content").html(_templ());
				common.base.popUp('.js_popUprouteadd');
				$('.startDate').datepicker({
					dateFormat: 'yy-mm-dd',
					dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
					monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					yearSuffix: '年',
					showMonthAfterYear: true,
					showOtherMonths: true
				});
				$('.startDate').datepicker('setDate', new Date());

				var dataId = $(this).attr("dataId");
				route.routeSave(dataId);
			});
		},
		//保存行程
		routeSave: function(dataId) {
			$('.js_popUpSubmit').unbind("click");
			$('.js_popUpSubmit').on('click',
			function() {
				var postData = {};
				postData['prodLinePriceVo.prodId'] = dataId;
				postData['prodLinePriceVo.startDate'] = $("#startDate").val();
				postData['prodLinePriceVo.endDate'] = $("#endDate").val();
				postData['prodLinePriceVo.name'] = $("#name").val();
				postData['prodLinePriceVo.buyStartDate'] = $("#buyStartDate").val();
				postData['prodLinePriceVo.buyEndDate'] = $("#buyEndDate").val();
				postData['prodLinePriceVo.personMinNum'] = $("#personMinNum").val();
				postData['prodLinePriceVo.personMaxNum'] = $("#personMaxNum").val();
				postData['prodLinePriceVo.childMinNum'] = $("#childMinNum").val();
				postData['prodLinePriceVo.childMaxNum'] = $("#childMaxNum").val();
				postData['prodLinePriceVo.oldPersonPrice'] = $("#oldPersonPrice").val();
				postData['prodLinePriceVo.personPrice'] = $("#personPrice").val();
				postData['prodLinePriceVo.oldChildPrice'] = $("#oldChildPrice").val();
				postData['prodLinePriceVo.childPrice'] = $("#childPrice").val();
				postData['prodLinePriceVo.totalNum'] = $("#totalNum").val();
				postData['prodLinePriceVo.freeNum'] = $("#freeNum").val();
				postData['prodLinePriceVo.status'] = "open";

				if (route.isAjaxing) {
					return false;
				}
				route.isAjaxing = true;
				$.ajax({
					url: '${base}/prodLinePrice!save.ajax',
					data: postData,
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							route.isAjaxing = false;
							$(".js_popUprouteadd").fadeOut();
						} else {

}
					}
				});
			})

		},
		//列表全选反选
		checkbox: function() {
			$('.js_check_all').unbind("click");
			/*列表全选反选*/
			$(".js_check_all").click(function() {

				if ($(this).attr("checked")) {
					$(".js_check_row").prop("checked", false);
					$(this).attr("checked", false);
				} else {
					$(".js_check_row").prop("checked", true);
					$(this).attr("checked", true);
				}
			})
		},
		//产品上架与下架
		shelf: function() {
			//线路产品页面上架下架
			$('.js_on_sale').unbind("click");
			$(".data_table").on('click', '.js_on_sale',
			function() {
				var Id = $(this).attr('dataId');
				var thisitem = $(this);
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定上架？',
					//提示语
					backFn: function(result) {
						if (result) {
							thisitem.parents("tr").find(".onsalestadus").html("上架");
							thisitem.html("下架").addClass("js_off_sale").removeClass("js_on_sale");
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "open"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										route.routeList();
									} else {

}
								}
							});
						} else {
							route.deleterow();
							route.routeadd();
							route.shelf();
							route.checkbox();
						}
					}

				});

			});
			$('.js_off_sale').unbind("click");
			$(".data_table").on('click', '.js_off_sale',
			function() {
				var thisitem = $(this);
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定下架？',
					//提示语
					backFn: function(result) {
						if (result) {
							thisitem.parents("tr").find(".onsalestadus").html('<span class="style1">下架</span>');
							thisitem.html("上架").addClass("js_on_sale").removeClass("js_off_sale");
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "close"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										route.routeList();
									} else {

}
								}
							});
						} else {
							route.deleterow();
							route.routeadd();
							route.shelf();
							route.checkbox();
						}
					}
				});
			})
		},
		//排序上升与排序下降
		sort: function() {
			//列表拖动排序换位置
			var fixHelper = function(e, ui) {
				ui.children().each(function() {
					$(this).width($(this).width()); //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了   
				});
				return ui;
			};
			$(function() {
				$("#sortable").sortable({ //这里是talbe tbody，绑定 了sortable   
					helper: fixHelper,
					//调用fixHelper   
					axis: "y"
				}).disableSelection();
			})
			// 列表排序上升
			$('.js_sort_Up').on('click',
			function(e) {
				var rowchecked = $(".checkbox:checked");
				if (rowchecked.length == 1) {
					var _current = rowchecked.parents('tr');
					if (($('tr').index(_current) - 2) >= 0) {
						_current.insertBefore(_current.prev());
					} else {
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '已经到顶了'
							//提示语
						});
					}
				} else {
					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '请选择一行排序'
						//提示语
					});
				}

			});
			// 列表排序下降
			$('.js_sort_Down').on('click',
			function(e) {
				var rowchecked = $(".checkbox:checked");
				if (rowchecked.length == 1) {
					var rowchecked = $(".checkbox:checked");
					var _current = rowchecked.parents('tr');

					var currentIndex = $('tr').index(_current);
					var trLength = $('tr').length;
					if (trLength > (currentIndex + 1)) {
						_current.insertAfter(_current.next());
					} else {
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: "已经到底啦！",
							//提示语
							backFn: function(result) {
								//
							}
						});
					}
				} else {
					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '请选择一行排序'
						//提示语
					});
				}

			});
		},
		//遍历序号
		eachIndex: function() {
			$(".js_saveSort").unbind("click");
			$(".js_saveSort").on("click",
			function() {
				var postData = {};
				$("#sortable tr").each(function() {
					var index = $(this).index();
					postData['prodVo.id'] = $(this).attr("dataId");
					// Pos =（总页数 - 当前页数）* 一页条数 + （一页条数 - 索引）
					postData['prodVo.pos'] = (route.pageTotal - route.pageCur) * route.pageSize + (route.pageSize - index);
					$.ajax({
						type: "post",
						url: "${base}/prod!save.ajax",
						data: postData,
						dataType: "json",
						success: function(resultMap) {
							if (resultMap.code == "success") {
								route.routeList();
							} else {
								if (resultMap && resultMap.description) {
									alert(resultMap.description);
								} else if (resultMap && typeof(resultMap) == 'string') {
									alert(resultMap);
								} else {
									alert("出错了,请重试!");
								}
							}
						},
						error: function(e) {}
					});
				})
			})
		},
		//批量删除
		batchDel: function() {
			$(".js_delBtn").unbind("click");
			$(".js_delBtn").on("click",
			function() {
				var rowchecked = $(".js_check_row:checked");
				if (rowchecked.length == '0') {
					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: "请选定要删除的路线！",
						//提示语
						backFn: function(result) {
							//
						}
					});

				} else {
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '是否确定删除选定路线？',
						//提示语
						backFn: function(result) {
							if (result) {
								//
								rowchecked.each(function() {
									var postData = {};
									postData['prodVo.id'] = $(this).parents("tr").attr("dataId");
									postData['prodVo.status'] = 'delete';
									$.ajax({
										url: '${base}/prod!changeStatus.ajax',
										data: postData,
										dataType: "json",
										success: function(resultData) {
											if (resultData.code == "success") {
												common.base.popUp('', {
													type: 'tip',
													tipTitle: '温馨提示',
													//标题
													tipMesg: "删除成功！",
													//提示语
													backFn: function(result) {
														route.routeList();
													}
												});

											} else {

}
										}
									});
								})
							}
						}
					});

				}

			})
		}

	}
	var routeInit = function() {
		route.routeList();

		//搜索
		$('.js_searchbtn').click(function() {
			route.pageCur = 1;
			route.routeList();
		});
	}
	return {
		init: routeInit
	};
})