define(['jquery', 'common', 'Handlebars', 'jqueryui', 'HandlebarExt', 'ztree'],
function($, common, Handlebars, jqueryui, HandlebarExt, ztree) {
	var scenic = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		isAjaxing: false,
		viewType:"",
		orderby: "pos",
		dataList: null,
		areaCode: "",
		rootAreaid: "3301",//地区初始化
		areaList: function() {
			$.ajax({
				async: false,
				cache: false,
				type: 'POST',
				dataType: "json",
				url: '${base}/viewType!queryListByName.ajax',
				data: {
					"viewTypeVo.name": "arround",
				},
				success: function(data) {
					var setting = {
						data: {
							key: {
								name: "description"
							},
							simpleData: {
								idKey: "typeId",
								pIdKey: "upId",
								enable: true
							}
						},
						callback: {
							onClick: zTreeOnClick
						}

					};
					var zNodes = data.data.viewtypeList;
					if(zNodes==null || zNodes==''){
						$('.treewrap').remove();
						$('.rightcon').addClass('pLeft');
						$('.data_table_wrap,.searchwrap').addClass('pleft');
						$('.tableoperate').removeClass('ml2');
					}
					$.fn.zTree.init($("#typetreeDemo"), setting, zNodes);
					//树形结构加载成功之后，再查询列表
					scenic.scenicList();
					function zTreeOnClick(event, treeId, treeNode) {
						scenic.viewType = treeNode.name;
						scenic.scenicList();
					}
				}
			});
		},
		scenicList: function() {
			if (scenic.isAjaxing) return false;
			scenic.isAjaxing = true;
			// alert($("#js_status").find("option:checked").attr("value"));
			$.ajax({

				url: '${base}/view!queryListPage.ajax',
				data: {
					"pageObject.page": scenic.pageCur,
					"pageObject.pagesize": scenic.pageSize,
					"viewVo.status": $("#js_status").find("option:checked").attr("value"),
					"viewVo.type": "arround",
					"viewVo.name": $('.search_input').val(),
					"viewVo.orderby": "pos desc",
					"viewVo.areaId": $("#areaId").find("option:checked").attr("value"),
					"viewVo.smallType": scenic.viewType
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
						scenic.pageTotal = resultData.data.pagetotal;
						scenic.total = resultData.data.total;
						scenic.dataList = resultData.data.dataList;
						common.base.createPage('.pageDiv', {
							pageCur: scenic.pageCur,
							pageTotal: scenic.pageTotal,
							total: scenic.total,
							backFn: function(p) {
								scenic.pageCur = p;
								scenic.scenicList();

							}
						});
						scenic.scenicEdit(); //初始化编辑事件
						scenic.scenicDelete(); //初始化删除事件
						scenic.checkbox(); //初始化全选反选
						scenic.sortable(); //初始化排序
						scenic.sortchange();

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
					scenic.isAjaxing = false;
					
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
					scenic.isAjaxing = false;
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
		sortchange: function() {
			$('.jspos').blur(function() {
				// alert("ok");
				var dataObj = $(this).parents("tr").find(".id");
				var pos = dataObj.attr("pos");
				var id = dataObj.val();
				var viewId = dataObj.attr('viewId');
				var inputPos = $(this).val();

				// $(this).val(pos+","+id+","+viewId+","+inputPos);
				if (inputPos != pos) {
					scenic.scenicDoEdit(id, viewId, inputPos);
				}

				// alert(thisid);
			});
		},
		sortable: function() {
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
					axis: "y",
					stop: function(event, ui) {
						var startItem = ui.item;
						var offsetIndex = Math.round(( - ui.originalPosition.top + ui.position.top) / (startItem.height()));
						var startIndex = startItem.attr('dIndex');
						var endIndex = parseInt(startIndex) + parseInt(offsetIndex);

						var dataList = scenic.dataList;

						if (endIndex < 0) {
							endIndex = 0;
						}
						if (endIndex > dataList.length - 1) {
							endIndex = dataList.length - 1;
						}
						var data = dataList[startIndex];
						var endData = dataList[endIndex];
						var pos = endData['pos'];
						if (parseInt(offsetIndex) < 0) {
							pos++;
						} else {
							pos--;
						}
						// alert(data['name']+","+data['viewId']+","+pos);
						scenic.scenicDoEdit(data['id'], data['viewId'], pos);

					}
				}).disableSelection();
			})
		},
		scenicEdit: function() {
			//编辑
			//        	$(".savesort")
			/*            $(".js_project_edit").unbind("click");
					 $(".js_project_edit").click(function(){
					 var projectId = $(this).attr('dataId');
					 var projectData = project.queryByProjectId(projectId);
					 if (projectData.code == "success") {
					 var _templ = Handlebars.compile($("#project-save").html());
					 projectData['data']['popUp'] = {titleName:'栏目更新'};
					 $("#project-save-content").html(_templ(projectData.data));
					 common.base.popUp('.js_popUpProjectEdit',{
					 type:'form',
					 backFn:function(result){
					 if(result){
					 project.projectDoSave();
					 }
					 }
					 });
					 }
					 });*/
		},
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
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							var status = "close";
							scenic.scenicDoDelete(Id, viewId, status);
						}

					}
				});
			});
		},
		queryByScenictId: function(projectId) {
			var returnData;
			$.ajax({
				url: '${base}/project!queryByProjectId.ajax',
				data: {
					"projectVo.projectId": projectId
				},
				type: 'post',
				dataType: "json",
				async: false,
				//设置同步请求
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					returnData = resultData;
				},
				error: function(resultData) {
					returnData = resultData;
					common.base.loading("fadeOut");
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '操作异常',
						//提示语
						backFn: function(result) {}
					});
				}
			});
			return returnData;
		},
		scenicDoDelete: function(Id, viewId, status) {
			if (!Id) {
				scenic.isAjaxing = false;
				return false;
			}
			$.ajax({
				url: '${base}/view!delete.ajax',
				data: {
					'viewVo.id': Id,
					'viewVo.viewId': viewId,
					'viewVo.status': status
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					scenic.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = '';
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
								scenic.scenicList();
							}
						});
						//删除完成刷新当前列表
						scenic.scenicList();
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
					
				},
				error: function(resultData) {
					scenic.isAjaxing = false;
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
		scenicDoEdit: function(Id, viewid, pos, statuval) {
			//          if(scenic.isAjaxing)return false;
			//          scenic.isAjaxing=true;
			if (!Id) {
				scenic.isAjaxing = false;
				return false;
			}
			$.ajax({
				type: "post",
				url: "${base}/view!save.ajax",
				data: {
					'viewVo.id': Id,
					'viewVo.viewId': viewid,
					'viewVo.type': "arround",
					'viewVo.pos': pos,
					'viewVo.orderby': scenic.orderby
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					scenic.isAjaxing = false;
					if (resultData.code == "success") {

						if (statuval == 1) {
							var tipmesg = '';

							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: "保存排序成功",
								//提示语
								backFn: function(result) {
									scenic.pageCur = 1;
									scenic.scenicList();
								}
							});
						}

						//删除完成刷新当前列表
						scenic.pageCur = 1;
						scenic.scenicList();
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
					
				},
				error: function(resultData) {
					scenic.isAjaxing = false;
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

	//景区
	var tourScenicListInit = function(rootAreaid) {
		scenic.rootAreaid = rootAreaid;
		//查询区域
		scenic.areaList();
		//搜索
		$('#js_doSearch').click(function() {
			scenic.pageCur = 1;
			scenic.scenicList();
		});

		//列表批量选择删除
		$(document).on('click', '#banchdeleterow',
		function() {
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
							//               
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
										scenic.scenicDoDelete(scenicIds, scenicViewIds, status);
									}
								})
								//												var thisid = $(this).parents("tr").find(
								//														".id").val();
								//												var status = "delete";
								//												scenic.scenicDoDelete(thisid, status);
							})
						}
					}
				});

			}

		})
		//列表批量发布
		$(document).on('click', '#publish',
		function() {
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
										scenic.scenicDoDelete(scenicIds, scenicViewIds, status);
									}
								})
								//												
							})
							//							               
							//											rowchecked.each(function() {
							//												
							//												var thisid = $(this).parents("tr").find(
							//														".id").val();
							//												var status = "finish";
							//												scenic.scenicDoDelete(thisid, status);
							//											})
						}
					}
				});

			}

		})
		//列表批量取消发布
		$(document).on('click', '#cancelpublish',
		function() {
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
										scenic.scenicDoDelete(scenicIds, scenicViewIds, status);
									}
								})
								//											
							})
							//							             //               
							//											rowchecked.each(function() {
							//												var thisid = $(this).parents("tr").find(
							//														".id").val();
							//												var status = "canclefinish";
							//												scenic.scenicDoDelete(thisid, status);
							//											})
						}
					}
				});

			}

		})
		// 列表排序上升
		$(document).on('click', '.sortUp',
		function(e) {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == 1) {
				var _current = rowchecked.parents('tr');
				if (($('tr').index(_current) - 2) >= 0) {
					/*定义当前筛选类型POS**/
					scenic.orderby = "pos";
					//							alert("当前行"+$('tr').index(_current));
					var currentLine = $('tr').index(_current);

					// html实现效果        pageSize : 2,//每页显示数量 pageTotal : 1,//总页数pageCur     

					var thisid = _current.find(".id").val();
					var thisPos = (scenic.pageTotal - scenic.pageCur) * scenic.pageSize + (scenic.pageSize - currentLine) + 1;
					//							var thisPos = _current.find(
					//							".id").attr('pos');
					//上一级
					var getPosval = (scenic.pageTotal - scenic.pageCur) * scenic.pageSize + (scenic.pageSize - currentLine + 1) + 1;
					//							var getPosval = _current.prev('tr').find(
					//							".id").attr('pos');
					var thisviewId = _current.find(".id").attr('viewid');
					//上一级Id
					var preId = _current.prev('tr').find('.id').val();
					var previewId = _current.prev('tr').find('.id').attr('viewid');
					//当前行数与上一行数比较POS交换
					//							_current.insertBefore(_current.prev());
					scenic.scenicDoEdit(thisid, thisviewId, getPosval, "0");

					scenic.scenicDoEdit(preId, previewId, thisPos, "1")
					//							var v =2;
					//							for(var i=0;i<2;i++){
					//								scenic.scenicDoEdit(thisid,getPosval,orderby);
					//							}
					//							

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
		$(document).on('click', '.sortDown',
		function(e) {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == 1) {
				var rowchecked = $(".checkbox:checked");
				var _current = rowchecked.parents('tr');

				var currentIndex = $('tr').index(_current);
				var trLength = $('tr').length;
				if (trLength > (currentIndex + 1)) {
					scenic.orderby = "pos";

					var currentLine = $('tr').index(_current);
					var nextId = _current.next('tr').find('.id').val();
					//						var nextPos = _current.next('tr').find('.id').attr('pos');
					var nextPos = (scenic.pageTotal - scenic.pageCur) * scenic.pageSize + (scenic.pageSize - currentLine - 1) + 1;
					var nextViewId = _current.next('tr').find('.id').attr('viewid');
					var thisviewId = _current.find(".id").attr('viewid');
					var thisPos = l = (scenic.pageTotal - scenic.pageCur) * scenic.pageSize + (scenic.pageSize - currentLine) + 1;
					//                    _current.insertBefore(_current.prev());
					var thisid = _current.find(".id").val();

					scenic.scenicDoEdit(thisid, thisviewId, nextPos, "0");
					scenic.scenicDoEdit(nextId, nextViewId, thisPos, "1");
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
		$(document).on('click', '.savesort',
		function(e) {
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
							scenic.orderby = "pos";
							rowchecked.each(function() {
								var thisid = $(this).parents("tr").find('.id').val();
								var sortNum = $(this).parents("tr").find("#sortnum").val();
								//										alert(sortNum)
								var thisViewid = rowchecked.parents('tr').find(".id").attr('viewid');
								scenic.scenicDoEdit(thisid, thisViewid, sortNum);
							})
						}
					}
				});

			}

		});

	}
	return {
		initScenic: tourScenicListInit
	};

})