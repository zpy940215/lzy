define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt'],
function($, common, jqueryui, Handlebars, HandlebarExt) {
	var showStatus = '';

	var native = {
		pageSize: 15,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数
		areaId: '',
		types :[],
		//筛选地区
		isAjaxing: false,
		nativeList: function() {

			native.areaId = $('#selectAreaId').val();

			if (native.isAjaxing) return false;
			native.isAjaxing = true;
			var _templ = Handlebars.compile($("#native-list").html());
			$("#native-list-content").html(_templ);

			$.ajax({
				url: '${base}/prod!queryListPage.ajax',
				data: {
					"pageObject.page": native.pageCur,
					"pageObject.pagesize": native.pageSize,
					"prodVo.prodTypeId": "04",
					"prodVo.name": $(".js_search_input").val(),
					"prodVo.areaId": native.areaId,
					"prodVo.status": showStatus
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					native.isAjaxing = false;
					if (resultData.code == "success") {
						//加载数据的处理
						var _templ = Handlebars.compile($("#native-list").html());
						$("#native-list-content").html(_templ(resultData.data));
						//分页
						native.pageTotal = resultData.data.pagetotal;
						native.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: native.pageCur,
							pageTotal: native.pageTotal,
							total: native.total,
							backFn: function(p) {
								native.pageCur = p;
								native.nativeList();
							}
						});
						native.nativeDelete(); //初始化删除事件
						native.checkbox(); //列表全选反选
						native.shelf(); //列表上架下架
						native.sort(); //列表排序
						native.showStatus();
						native.eachIndex();
						native.batchDel();
						native.batchUpdate();
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
				error: function(resultData) {
					common.base.loading("fadeOut");
					native.isAjaxing = false;
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

		// 上下架显示
		showStatus: function() {
			$("#showStatus").change(function() {
				showStatus = $("#showStatus").val();
			});
		},

		//删除行
		nativeDelete: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").on('click',
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
										native.nativeList();
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

							thisitem.parents("tr").find(".onsalestadus").html('<span class="style2">下架</span>');
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
										native.nativeList();
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
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "close"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										native.nativeList();
									} else {

}
								}
							});
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
			$('.js_sort_Up').unbind('click');
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
							tipMesg: '已经到顶了!'
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
			$('.js_sort_Down').unbind('click');
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
				$("#sortable tr").each(function() {
					var postData = {};
					var index = $(this).index();
					// $(this).parents("tr").attr("dataId")
					postData['prodVo.id'] = $(this).attr("dataId");
					// Pos =（总页数 - 当前页数）* 一页条数 + （一页条数 - 索引）
					postData['prodVo.pos'] = (native.pageTotal - native.pageCur) * native.pageSize + (native.pageSize - index);
					$.ajax({
						type: "post",
						url: "${base}/prod!save.ajax",
						data: postData,
						dataType: "json",
						success: function(resultMap) {
							if (resultMap.code == "success") {
								native.nativeList();
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
						tipMesg: "请选定要删除的特产！",
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
						tipMesg: '是否确定删除选定特产？',
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
														native.nativeList();
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
		},
		//批量修改分类
		batchUpdate:function(){
			$(".js_updateType").unbind("click");
			$(".js_updateType").on("click",function(){
				common.base.popUp($('.js_pop_updateType'));
				$(".js_popUpSubmit").unbind("click");
				$(".js_popUpSubmit").on("click",function(){
					if ($("#typeSelect").val() == '') {
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: "请选定分类！",
							//提示语
							backFn: function(result) {
								//
							}
						});
						return;
					}
					var rowchecked = $(".js_check_row:checked");
					if (rowchecked.length == '0') {
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: "请选定要修改的商品！",
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
							tipMesg: '是否确定修改选定商品？',
							//提示语
							backFn: function(result) {
								if (result) {
									rowchecked.each(function() {
										var postData = {};
										postData['prodVo.id'] = $(this).parents("tr").attr("dataId");
										postData['prodVo.prodChildTypeId'] = $("#typeSelect").val();
										$.ajax({
											url: '${base}/prod!save.ajax',
											data: postData,
											dataType: "json",
											success: function(resultData) {
												if (resultData.code == "success") {
													common.base.popUp('', {
														type: 'tip',
														tipTitle: '温馨提示',
														//标题
														tipMesg: "修改分类成功！",
														//提示语
														backFn: function(result) {
															native.nativeList();
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
			})
			$(document).on('click','.js_popUpCancel',function(){
				$('.js_pop_updateType').fadeOut();
			})
		},
		typeSetlvlstr: function() {
			var html = '',
			len = native.types.length;
			for (var i = 0; i < len; i++) {
				var lvl = native.types[i].lvl,
				nbsp = "";
				if (lvl == "3") nbsp = "----";
				if (lvl == "4") nbsp = "--------";
				native.types[i]['nbsp'] = nbsp;
			}

			for (i = 0; i < len; i++) {
				$(".js_typeSelect").append('<option value=' + native.types[i].typeId + '>' + native.types[i].nbsp + native.types[i].name + '</option>');
			}
		},
		//获取所有商品分类
		getTypeListAll: function() {
			$.ajax({
				url: '${base}/prodType!queryListAll.ajax',
				data: {
					"prodTypeVo.upId": "05",
					"prodTypeVo.status": "open"
				},
				dataType: "json",
				success: function(resultData) {
					if (resultData.code == "success") {
						native.types = resultData.data.typeVoList;
						native.typeSetlvlstr(); //更新筛选值
						$("#typeSelect").val($('#type').val());
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
	}
	var nativeListInit = function() {
		native.nativeList();
		native.getTypeListAll();

		//搜索
		$(document).on("click", ".js_searchbtn",
		function() {
			native.pageCur = 1;
			native.nativeList();
		})
	}
	return {
		init: nativeListInit
	};
})