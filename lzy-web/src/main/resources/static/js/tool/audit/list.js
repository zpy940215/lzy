define(['jquery', 'common', 'Handlebars', 'jqueryui', 'HandlebarExt', 'ztree'],
function($, common, Handlebars, jqueryui, HandlebarExt, ztree) {
	var audit = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		isAjaxing: false,
		orderby: "pos",
		areaCode: "",
		auditType:null,
		auditStatusType:null,
		dataList: null,
		rootAreaid: "3301",//地区初始化
		areaList: function() {
			
		},
		scenicList: function() {
			if (audit.isAjaxing) return false;
			audit.isAjaxing = true;
			var auditType = $("#js_view_type").find("option:checked").attr("value"),smallType = "";
			var auditStatusType= $("#js_status").find("option:checked").attr("value"),smallType = "";
			$.ajax({
				url: '${base}/audit!queryListPage.ajax',
				data: {
					"pageObject.page": audit.pageCur,
					"pageObject.pagesize": audit.pageSize,
					"auditVo.dataType":auditType,
					"auditVo.status":auditStatusType
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						//加载数据的处理
						var _templ = Handlebars.compile($("#view-list").html());
						$("#view-list-content").html(_templ(resultData.data));
						//分页
						audit.pageTotal = resultData.data.pagetotal;
						audit.total = resultData.data.total;
						audit.dataList = resultData.data.dataList;
						common.base.createPage('.pageDiv', {
							pageCur: audit.pageCur,
							pageTotal: audit.pageTotal,
							total: audit.total,
							backFn: function(p) {
								audit.pageCur = p;
								audit.scenicList();

							}
						});
						// audit.scenicDetail(); //初始化编辑事件
						audit.scenicDelete(); //初始化删除事件
						// audit.checkbox(); //初始化全选反选
						// audit.sortable(); //初始化排序
						// audit.sortchange();
					} else {

						if (resultData && resultData.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'choice',
								tipTitle: '温馨提示',
								tipMesg: resultData.description,//标题
								backFn: function(result) {
									//提示语
									//alert(result);
								}
							});
						}
					}
					audit.isAjaxing = false;
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
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
		// sortchange: function() {
		// 	$('.jspos').blur(function() {
		// 		var dataObj = $(this).parents("tr").find(".id");
		// 		var pos = dataObj.attr("pos");
		// 		var id = dataObj.val();
		// 		var viewId = dataObj.attr('viewId');
		// 		var inputPos = $(this).val();
		// 		if (inputPos != pos) {
		// 			audit.scenicDoEdit(id, viewId, inputPos);
		// 		}
		// 	});
		// },
		// sortable: function() {
		// 	var fixHelper = function(e, ui) {
		// 		ui.children().each(function() {
		// 			$(this).width($(this).width()); //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了
		// 		});
		// 		return ui;
		// 	};
		// 	$(function() {
		// 		$("#sortable").sortable({ //这里是talbe tbody，绑定 了sortable
		// 			helper: fixHelper,
		// 			//调用fixHelper
		// 			axis: "y",
		// 			stop: function(event, ui) {
		// 				var startItem = ui.item;
		// 				var offsetIndex = Math.round(( - ui.originalPosition.top + ui.position.top) / (startItem.height()));
		// 				var startIndex = startItem.attr('dIndex');
		// 				var endIndex = parseInt(startIndex) + parseInt(offsetIndex);
		// 				var dataList = audit.dataList;
		// 				if (endIndex < 0) {
		// 					endIndex = 0;
		// 				}
		// 				if (endIndex > dataList.length - 1) {
		// 					endIndex = dataList.length - 1;
		// 				}
		// 				var data = dataList[startIndex];
		// 				var endData = dataList[endIndex];
		// 				var pos = endData['pos'];
		// 				if (parseInt(offsetIndex) < 0) {
		// 					pos++;
		// 				} else {
		// 					pos--;
		// 				}
		// 				audit.scenicDoEdit(data['id'], data['viewId'], pos);
        //
		// 			}
		// 		}).disableSelection();
		// 	})
		// },
		// scenicDetail: function() {
		//
		// },
		scenicDelete: function() {
			//删除
			$(".js_view_delete").unbind("click");
			$("table").on('click', '.js_view_delete',
			function() {
				var Id = $(this).attr('dataId');
				var viewId = $(this).attr('viewId');

				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					tipMesg: '是否确定删除？',//标题
					backFn: function(result) {
						//提示语
						if (result) {
							var status = "close";
							audit.auditDoDelete(Id, viewId, status);
						}

					}
				});
			});
		},
		// queryByScenictId: function(projectId) {
		// 	var returnData;
		// 	$.ajax({
		// 		url: '${base}/project!queryByProjectId.ajax',
		// 		data: {
		// 			"projectVo.projectId": projectId
		// 		},
		// 		type: 'post',
		// 		dataType: "json",
		// 		async: false,
		// 		beforeSend: function() {
		// 			common.base.loading("fadeIn");
		// 		},
		// 		success: function(resultData) {
		// 			common.base.loading("fadeOut");
		// 			returnData = resultData;
		// 		},
		// 		error: function(resultData) {
		// 			returnData = resultData;
		// 			common.base.popUp('', {
		// 				type: 'choice',
		// 				tipTitle: '温馨提示',//标题
		// 				tipMesg: '操作异常',//提示语
		// 				backFn: function(result) {}
		// 			});
		// 		}
		// 	});
		// 	return returnData;
		// },
		auditDoDelete: function(Id, viewId, status) {
			if (!Id) {
				audit.isAjaxing = false;
				return false;
			}
			$.ajax({
				url: '${base}/audit!delAudit.ajax',
				data: {
					'auditVo.id': Id,
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					audit.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = 'close';
						switch (status) {
						case "close":
							tipMesg = "删除成功!";
							break;
						case "finish":
							tipMesg = "发布成功!";
							break;
						case "canclefinish":
							tipMesg = "取消发布成功!"
							break;
						default:
							tipMesg = "删除成功!"
							break;
						}

						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: tipMesg,
							//提示语
							backFn: function(result) {
								audit.scenicList();
							}
						});
						//删除完成刷新当前列表
						audit.scenicList();
					} else {
						if (resultData && resultData.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
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
					common.base.loading("fadeOut");
				},
				error: function(resultData) {
					audit.isAjaxing = false;
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
		// scenicDoEdit: function(Id, viewid, pos, statuval) {
		// 	if (!Id) {
		// 		audit.isAjaxing = false;
		// 		return false;
		// 	}
		// 	$.ajax({
		// 		type: "post",
		// 		url: "${base}/view!save.ajax",
		// 		data: {
		// 			'viewVo.id': Id,
		// 			'viewVo.viewId': viewid,
		// 			'viewVo.type': "scenic",
		// 			'viewVo.pos': pos,
		// 			'viewVo.orderby': audit.orderby
		// 		},
		// 		type: 'post',
		// 		dataType: "json",
		// 		beforeSend: function() {
		// 			common.base.loading("fadeIn");
		// 		},
		// 		success: function(resultData) {
		// 			audit.isAjaxing = false;
		// 			if (resultData.code == "success") {
        //
		// 				if (statuval == 1) {
		// 					var tipmesg = '';
        //
		// 					common.base.popUp('', {
		// 						type: 'tip',
		// 						tipTitle: '温馨提示',
		// 						//标题
		// 						tipMesg: "保存排序成功",
		// 						//提示语
		// 						backFn: function(result) {
		// 							audit.pageCur = 1;
		// 							audit.scenicList();
		// 						}
		// 					});
		// 				}
        //
		// 				//删除完成刷新当前列表
		// 				audit.pageCur = 1;
		// 				audit.scenicList();
		// 			} else {
		// 				if (resultData && resultData.description) {
		// 					//alert(resultData.description);
		// 					common.base.popUp('', {
		// 						type: 'tip',
		// 						tipTitle: '温馨提示',
		// 						//标题
		// 						tipMesg: resultData.description,
		// 						//提示语
		// 						backFn: function(result) {
		// 							//alert(result);
		// 						}
		// 					});
		// 				}
		// 			}
		// 			common.base.loading("fadeOut");
		// 		},
		// 		error: function(resultData) {
		// 			audit.isAjaxing = false;
		// 			common.base.popUp('', {
		// 				type: 'choice',
		// 				tipTitle: '温馨提示',
		// 				//标题
		// 				tipMesg: '操作异常',
		// 				//提示语
		// 				backFn: function(result) {
		// 					//alert(result);
		// 				}
		// 			});
		// 		}
		// 	});
		// },
		//列表全选反选
		checkbox: function() {
			$('.js_check_all').unbind("click");
			/*列表全选反选*/
			$("table").on("click", ".js_check_all",
			function() {

				if ($(this).attr("checked")) {
					$(".js_check_row").prop("checked", false);
					$(this).attr("checked", false);
				} else {
					$(".js_check_row").prop("checked", true);
					$(this).attr("checked", true);
				}
			})
		}
	}

	var tourAuditListInit = function(rootAreaid) {
		audit.rootAreaid = rootAreaid;
		//查询列表
		audit.scenicList();
		//搜索
		$('#js_doSearch').click(function() {
			var auditType = $("#js_view_type").find("option:checked").attr("value"),smallType = "";
			var auditStatusType= $("#js_status").find("option:checked").attr("value"),smallType = "";
			auditType.auditType=auditType;
			auditType.auditStatusType=auditStatusType;
			audit.pageCur = 1;
			audit.scenicList();
		});

		//列表批量选择删除
		$(document).on('click', '#banchdeleterow',function() {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == '0') {
				common.base.popUp('', {
					type: 'tip',
					tipTitle: '温馨提示',
					//标题
					tipMesg: "请选定要删除的数据！",
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
					tipMesg: '是否确定删除选中数据？',
					//提示语
					backFn: function(result) {
						if (result) {            
							rowchecked.each(function() {
								var scenicIds = "";
								var scenicViewIds = "";
								var count = 0;
								rowchecked.each(function() {
									var thisid = $(this).parents("tr").find(".id").val();
									var thisViewid = $(this).parents("tr").find('.id').attr('viewid');
									if (scenicIds != null && scenicIds != '') {
										scenicIds = scenicIds + "," + thisid;
									} else {
										scenicIds = thisid;
									}
									if (scenicViewIds != null && scenicViewIds != '') {
										scenicViewIds = scenicViewIds + "," + thisViewid;
									} else {
										scenicViewIds = thisViewid;
									}
									count++;
									if (count == rowchecked.length) {
										var status = "close";
										audit.auditDoDelete(scenicIds, scenicViewIds, status);
									}
								});
							});
						}
					}
				});

			}

		})
		//列表批量发布
		$(document).on('click', '#publish',function() {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == '0') {
				common.base.popUp('', {
					type: 'tip',
					tipTitle: '温馨提示',
					//标题
					tipMesg: "请选择需要发布的数据！",
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
					tipMesg: '确定发布选中数据？',
					//提示语
					backFn: function(result) {
						if (result) {
							rowchecked.each(function() {

								var scenicIds = "";
								var scenicViewIds = "";
								var count = 0;

								rowchecked.each(function() {

									var thisid = $(this).parents("tr").find(".id").val();
									var thisViewid = $(this).parents("tr").find('.id').attr('viewid');
									if (scenicIds != null && scenicIds != '') {
										scenicIds = scenicIds + "," + thisid;
									} else {
										scenicIds = thisid;
									}
									if (scenicViewIds != null && scenicViewIds != '') {
										scenicViewIds = scenicViewIds + "," + thisViewid;
									} else {
										scenicViewIds = thisViewid;
									}
									count++;
									if (count == rowchecked.length) {
										var status = "finish";
										audit.auditDoDelete(scenicIds, scenicViewIds, status);
									}
								})										
							})
						}
					}
				});

			}

		})
		//列表批量取消发布
		$(document).on('click', '#cancelpublish',function() {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == '0') {
				common.base.popUp('', {
					type: 'tip',
					tipTitle: '温馨提示',
					//标题
					tipMesg: "请选定要取消发布的数据！",
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
					tipMesg: '确定取消发布选中数据？',
					//提示语
					backFn: function(result) {
						if (result) {
							rowchecked.each(function() {

								var scenicIds = "";
								var scenicViewIds = "";
								var count = 0;

								rowchecked.each(function() {
									var thisid = $(this).parents("tr").find(".id").val();
									var thisViewid = $(this).parents("tr").find('.id').attr('viewid');
									if (scenicIds != null && scenicIds != '') {
										scenicIds = scenicIds + "," + thisid;
									} else {
										scenicIds = thisid;
									}
									if (scenicViewIds != null && scenicViewIds != '') {
										scenicViewIds = scenicViewIds + "," + thisViewid;
									} else {
										scenicViewIds = thisViewid;
									}
									count++;
									if (count == rowchecked.length) {
										var status = "canclefinish";
										audit.auditDoDelete(scenicIds, scenicViewIds, status);
									}
								})									
							})
						}
					}
				});

			}

		})
		// 列表排序上升
		$(document).on('click', '.sortUp',function(e) {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == 1) {
				var _current = rowchecked.parents('tr');
				if (($('tr').index(_current) - 2) >= 0) {
					/*定义当前筛选类型POS**/
					audit.orderby = "pos";
					var currentLine = $('tr').index(_current);
					// html实现效果        pageSize : 2,//每页显示数量 pageTotal : 1,//总页数pageCur     
					var thisid = _current.find(".id").val();
					var thisPos = (audit.pageTotal - audit.pageCur) * audit.pageSize + (audit.pageSize - currentLine) + 1;
					var getPosval = (audit.pageTotal - audit.pageCur) * audit.pageSize + (audit.pageSize - currentLine + 1) + 1;
					var thisviewId = _current.find(".id").attr('viewid');
					//上一级Id
					var preId = _current.prev('tr').find('.id').val();
					var previewId = _current.prev('tr').find('.id').attr('viewid');
					//当前行数与上一行数比较POS交换
					//_current.insertBefore(_current.prev());
					audit.scenicDoEdit(thisid, thisviewId, getPosval, "0");
					audit.scenicDoEdit(preId, previewId, thisPos, "1")						

				} else {
					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: "已经到顶了！",
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
					tipMesg: "请选择一行排序！",
					//提示语
					backFn: function(result) {
						//
					}
				});
			}

		});
		// 列表排序下降
		$(document).on('click', '.sortDown',function(e) {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == 1) {
				var rowchecked = $(".checkbox:checked");
				var _current = rowchecked.parents('tr');

				var currentIndex = $('tr').index(_current);
				var trLength = $('tr').length;
				if (trLength > (currentIndex + 1)) {
					audit.orderby = "pos";

					var currentLine = $('tr').index(_current);
					var nextId = _current.next('tr').find('.id').val();
					//						var nextPos = _current.next('tr').find('.id').attr('pos');
					var nextPos = (audit.pageTotal - audit.pageCur) * audit.pageSize + (audit.pageSize - currentLine - 1) + 1;
					var nextViewId = _current.next('tr').find('.id').attr('viewid');
					var thisviewId = _current.find(".id").attr('viewid');
					var thisPos = l = (audit.pageTotal - audit.pageCur) * audit.pageSize + (audit.pageSize - currentLine) + 1;
					//                    _current.insertBefore(_current.prev());
					var thisid = _current.find(".id").val();

					audit.scenicDoEdit(thisid, thisviewId, nextPos, "0");
					audit.scenicDoEdit(nextId, nextViewId, thisPos, "1");
					//						alert("排序上升单行的ID"+ thisid)
					//                _current.insertAfter(_current.next());
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
					tipMesg: "请选择一行排序！",
					//提示语
					backFn: function(result) {
						//
					}
				});
			}

		});

		// 列表自定义排序
		$(document).on('click', '.savesort',function(e) {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == '0') {
				common.base.popUp('', {
					type: 'tip',
					tipTitle: '温馨提示',
					//标题
					tipMesg: "请选定要排序的数据！",
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
					tipMesg: '确定保存需要排序选中数据？',
					//提示语
					backFn: function(result) {
						if (result) {
							//					               
							audit.orderby = "pos";
							rowchecked.each(function() {
								var thisid = $(this).parents("tr").find('.id').val();
								var sortNum = $(this).parents("tr").find("#sortnum").val();
								//										alert(sortNum)
								var thisViewid = rowchecked.parents('tr').find(".id").attr('viewid');
								audit.scenicDoEdit(thisid, thisViewid, sortNum);
							})
						}
					}
				});

			}

		});

	}
	return {
		initAudit: tourAuditListInit
	};

})