define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt'],
function($, common, jqueryui, Handlebars, HandlebarExt) {
	var scenic = '';
	var spot = '';
	var subSpot = '';
	var showStatus = '';
	var ticketList = {
		pageSize: 15,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		areaId: '',//筛选地区
		linkSpots: '',//筛选景点
		isAjaxing: false,//区域处理
		// 上下架显示
		showStatus: function() {
			$("#showStatus").change(function() {
				showStatus = $("#showStatus").val();
			});
		},
		//景区景点联动
		dealScenicData: function(upViewid, type, dom) {

			$.ajax({
				url: '${base}/view!queryTourDataList.ajax',
				data: {
					"viewPo.spotsOrSubspots": type,
					'viewPo.upViewId': upViewid,
					'viewPo.isDoTree': false

				},
				dataType: "json",
				success: function(resultData) {
					var viewVoList = resultData.data.viewVoList;
					var len = viewVoList.length;
					$(dom).html('');

					$(dom).append('<option value="">请选择</option>');
					for (i = 0; i < len; i++) {
						$(dom).append('<option value=' + viewVoList[i].viewId + '>' + viewVoList[i].name + '</option>');
					}
				}
			});
		},
		selectScenic: function() {
			ticketList.dealScenicData("", "scenic", "#selectSenicId");
			$("#selectSenicId").append('<option>景区</option>');
		},
		selectSpots: function() {
			$("#selectSenicId").change(function() {

				var scenicViewid = $("#selectSenicId").val();
				scenic = scenicViewid;
				spot = '';
				subSpot = '';
				ticketList.dealScenicData(scenicViewid, "onlyspots", "#selectSpotId");
			});
		},
		selectChildSpots: function() {
			$("#selectSpotId").change(function() {

				var scenicViewid = $("#selectSpotId").val();
				spot = scenicViewid;
				subSpot = '';
				ticketList.dealScenicData(scenicViewid, "onlysubspots", "#selectChildSpotId");
			});
		},
		selectSubSpots: function() {
			$("#selectChildSpotId").change(function() {
				subSpot = $("#selectChildSpotId").val();
			});
		},
		//产品上架与下架
		shelf: function() {
			//线路产品页面上架下架
			$('.js_on_sale').unbind("click");
			$(".js_on_sale").on('click',
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
							if (ticketList.isAjaxing) {
								return false;
							}
							ticketList.isAjaxing = true;
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "open"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										ticketList.isAjaxing = false;
										ticketList.getList();
									} else {

}
								}
							});
						}
					}

				});

			});
			$('.js_off_sale').unbind("click");
			$(".js_off_sale").on('click',
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
							if (ticketList.isAjaxing) {
								return false;
							}
							ticketList.isAjaxing = true;
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "close"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										ticketList.isAjaxing = false;
										ticketList.getList();
									} else {

}
								}
							});
						}
					}
				});
			})
		},
		// 获取列表
		getList: function() {
			// ticketList.areaId = $('#selectAreaId').val();

			if (subSpot != '') {
				ticketList.linkSpots = subSpot;
			} else if (spot != '') {
				ticketList.linkSpots = spot;
			} else if (scenic != '') {
				ticketList.linkSpots = scenic;
			} else {
				ticketList.linkSpots = '';
			}

			if (ticketList.isAjaxing) {
				return false;
			}
			ticketList.isAjaxing = true;
			$.ajax({
				url: '${base}/prod!queryListPage.ajax',
				data: {
					"pageObject.page": ticketList.pageCur,
					"pageObject.pagesize": ticketList.pageSize,
					"prodVo.prodTypeId": "03",
					"prodVo.name": $(".js_search_input").val(),
					// "prodVo.areaId": ticketList.areaId,
					"prodVo.linkSpots": ticketList.linkSpots,
					"prodVo.status": showStatus
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						ticketList.isAjaxing = false;
						var _templ = Handlebars.compile($("#prod-list").html());
						$("#prod-list-content").html(_templ(resultData.data));
						//分页
						ticketList.pageTotal = resultData.data.pagetotal;
						ticketList.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: ticketList.pageCur,
							pageTotal: ticketList.pageTotal,
							total: ticketList.total,
							backFn: function(p) {
								ticketList.pageCur = p;
								ticketList.getList();
							}
						});
						ticketList.selectScenic();
						ticketList.selectSpots();
						ticketList.selectChildSpots();
						ticketList.selectSubSpots();
						ticketList.showStatus();
						ticketList.deleterow();
						ticketList.shelf();
						ticketList.sort();
						ticketList.checkbox();
						ticketList.eachIndex();
						ticketList.batchDel();
						ticketList.syncSingleTicket();
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
		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
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
							if (ticketList.isAjaxing) {
								return false;
							}
							ticketList.isAjaxing = true;
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "delete"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										ticketList.isAjaxing = false;
										ticketList.getList();
									} else {
									}
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
					postData['prodVo.pos'] = (ticketList.pageTotal - ticketList.pageCur) * ticketList.pageSize + (ticketList.pageSize - index);
					$.ajax({
						type: "post",
						url: "${base}/prod!save.ajax",
						data: postData,
						dataType: "json",
						success: function(resultMap) {
							if (resultMap.code == "success") {
								ticketList.getList();
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
		//批量同步
		syncBatchTicket:function(){
			$(".sync_batch_ticket").unbind("click");
			$(".sync_batch_ticket").on("click",
					function() {
				$.ajax({
					url: '${base}/prod!syncBatchTicket.ajax',
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success: function(resultData) {
						common.base.loading("fadeOut");
						if (resultData.code == "success") {
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.description,
								//提示语
								backFn: function(result) {
									ticketList.getList();
								}
							});

						} else {

}
					}
				});
				
			})
			
		},
		syncSingleTicket:function(){
			$(".sync_info").unbind("click");
			$(".sync_info").on("click",function(){
				common.base.popUp('', {
					type: 'tip',
					tipTitle: '温馨提示',
					//标题
					tipMesg: "确认执行同步操作？",
					//提示语
					backFn: function(result) {
						if(result){
							var outProdCode = $(this).attr('dataId');
							$.ajax({
								url: '${base}/prod!syncSingleTicket.ajax',
								dataType: "json",
								data:{"prodVo.outProdCode":outProdCode},
								beforeSend: function() {
									common.base.loading("fadeIn");
								},
								success: function(resultData) {
									common.base.loading("fadeOut");
									if (resultData.code == "success") {
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: resultData.description,
											//提示语
											backFn: function(result) {
												ticketList.getList();
											}
										});

									} else {

			                        }
								}
							});
						}
					}
				});
			
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
						tipMesg: "请选定要删除的门票！",
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
						tipMesg: '是否确定删除选定门票？',
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
														ticketList.getList();
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
	var ticketListInit = function() {
		ticketList.getList();
		ticketList.syncBatchTicket();
		
		//搜索
		$('.js_searchBtn').click(function() {
			ticketList.pageCur = 1;
			ticketList.getList();
		});
	}
	return {
		init: ticketListInit
	};
})