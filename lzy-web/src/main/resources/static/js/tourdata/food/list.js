define(['jquery', 'common', 'Handlebars', 'jqueryui', 'HandlebarExt', 'ztree'],
function($, common, Handlebars, jqueryui, HandlebarExt, ztree) {

	var food = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		dataList: null,
		viewType:"",
		isAjaxing: false,
		areaCode: "",
		orderby: "pos",
		rootAreaid: "3301",//地区初始化
		areaList: function() {
			$.ajax({
				async: false,
				cache: false,
				type: 'POST',
				dataType: "json",
				url: '${base}/viewType!queryListByName.ajax',
				data: {
					"viewTypeVo.name": "food",
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
					if(zNodes==null || zNodes=='' || zNodes.length == 1){
						$('.treewrap').remove();
						$('.rightcon').addClass('pLeft');
						$('.data_table_wrap,.searchwrap').addClass('pleft');
						$('.tableoperate').removeClass('ml2');
					}
					$.fn.zTree.init($("#typetreeDemo"), setting, zNodes);
					//树形结构加载成功之后，再查询列表
					food.foodList();
					function zTreeOnClick(event, treeId, treeNode) {
						food.viewType = treeNode.name;
						food.foodList();
					}
				}
			});
		},
		foodList: function() {
			if (food.isAjaxing) return false;
			food.isAjaxing = true;
			// alert($("#js_status").find("option:checked").attr("value"));
			$.ajax({

				url: '${base}/view!queryListPage.ajax',
				data: {
					"pageObject.page": food.pageCur,
					"pageObject.pagesize": food.pageSize,
					"viewVo.status": $("#js_status").find("option:checked").attr("value"),
					"viewVo.areaId": $("#areaId").find("option:checked").attr("value"),
					"viewVo.name": $('.search_input').val(),
					"viewVo.orderby": "pos desc",
					"viewVo.type": "food",
					"viewVo.smallType": food.viewType
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
						food.pageTotal = resultData.data.pagetotal;
						food.total = resultData.data.total;
						food.dataList = resultData.data.dataList;
						common.base.createPage('.pageDiv', {
							pageCur: food.pageCur,
							pageTotal: food.pageTotal,
							total: food.total,
							backFn: function(p) {
								food.pageCur = p;
								food.foodList();

							}
						});
						food.foodEdit(); //初始化编辑事件
						food.foodDelete(); //初始化删除事件
						food.checkbox(); //初始化全选事件
						food.sortable(); //初始化排序事件
						food.sortchange();
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
					food.isAjaxing = false;
				},
				error: function(resultData) {
					food.isAjaxing = false;
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
					food.foodDoEdit(id, viewId, inputPos);
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

						var dataList = food.dataList;

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
						food.foodDoEdit(data['id'], data['viewId'], pos);
					}
				}).disableSelection();
			})
		},
		foodEdit: function() {
			//            //编辑
			//            $(".js_project_edit").unbind("click");
			//            $(".js_project_edit").click(function(){
			//                var projectId = $(this).attr('dataId');
			//                var projectData = project.queryByProjectId(projectId);
			//                if (projectData.code == "success") {
			//                    var _templ = Handlebars.compile($("#project-save").html());
			//                    projectData['data']['popUp'] = {titleName:'栏目更新'};
			//                    $("#project-save-content").html(_templ(projectData.data));
			//                    common.base.popUp('.js_popUpProjectEdit',{
			//                        type:'form',
			//                        backFn:function(result){
			//                            if(result){
			//                                project.projectDoSave();
			//                            }
			//                        }
			//                    });
			//                }
			//            });
		},
		//列表全选反选
		checkbox: function() {
			$('.js_check_all').unbind("click");
			/*列表全选反选*/
			$('table').on("click", ".js_check_all",
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
		foodDelete: function() {
			//删除
			$(".js_view_delete").unbind("click");
			$('table').on('click', '.js_view_delete',
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
							food.foodDoDelete(Id, viewId, status);
						}

					}
				});
			});
		},
		queryByfoodtId: function(projectId) {
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
			return returnData;
		},
		foodDoSave: function() {
			if (project.isAjaxing) return false;
			project.isAjaxing = true;
			//验证
			var checkResult = true,
			dataPost = {};
			dataPost['projectVo.id'] = common.validate.trim($('#id').val());
			if (!common.validate.checkEmpty('#name', '请输入项目名称！')) {
				checkResult = false;
			}
			if (!common.validate.checkEmpty('#admin', '请输入超级管理员账号！')) {
				checkResult = false;
			}
			if (!common.validate.isEmpty('#passwd')) {
				if (!common.validate.checkPwd('#passwd', '#passwd2', '请输入密码！', '两次输入不一致')) {
					checkResult = false;
				}
			}
			if (!checkResult) {
				project.isAjaxing = false;
				return false;
			}
			dataPost['projectVo.name'] = common.validate.trim($('#name').val());
			dataPost['projectVo.admin'] = common.validate.trim($('#admin').val());
			dataPost['projectVo.passwd'] = common.validate.trim($('#passwd').val());
			dataPost['projectVo.url'] = common.validate.trim($('#url').val());
			dataPost['projectVo.description'] = common.validate.trim($('#description').val());
			$.ajax({
				url: '${base}/project!save.ajax',
				data: dataPost,
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					project.isAjaxing = false;
					$('.js_popUpProjectEdit').fadeOut();
					if (resultData.code == "success") {
						var tipmesg = '信息提交成功！';
						if (resultData.data.projectVo) tipmesg = '信息提交成功，请牢记密码：' + resultData.data.projectVo.passwd;
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: tipmesg,
							//提示语
							backFn: function(result) {
								//alert(result);
							}
						});
						//新增完成刷新列表
						project.pageCur = 1;
						project.projectList();
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
					project.isAjaxing = false;
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
		foodDoDelete: function(Id, viewId, status) {
			if (!Id) {
				food.isAjaxing = false;
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
					food.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = '';
						switch (status) {
						case "delete":
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
								food.foodList();
							}
						});
						//删除完成刷新当前列表
						food.foodList();
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
					food.isAjaxing = false;
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
		foodDoEdit: function(Id, viewid, pos, statuval) {
			//          if(food.isAjaxing)return false;
			//          scenic.isAjaxing=true;
			if (!Id) {
				food.isAjaxing = false;
				return false;
			}
			$.ajax({
				type: "post",
				url: "${base}/view!save.ajax",
				data: {
					'viewVo.id': Id,
					'viewVo.viewId': viewid,
					'viewVo.type': "food",
					'viewVo.pos': pos,
					'viewVo.orderby': food.orderby
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					food.isAjaxing = false;
					if (resultData.code == "success") {

						var tipmesg = '';
						if (statuval == 1) {
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: "保存排序成功",
								//提示语
								backFn: function(result) {
									food.pageCur = 1;
									food.foodList();
								}
							});
						}

						//删除完成刷新当前列表
						food.pageCur = 1;
						food.foodList();
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
					food.isAjaxing = false;
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
		}

	}

	//景区
	var tourFoodListInit = function(rootAreaid) {
		food.rootAreaid = rootAreaid;
		//查询区域
		food.areaList();
		//搜索
		$('#js_doSearch').click(function() {
			food.pageCur = 1;
			food.foodList();
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

							var foodIds = "";
							var foodViewIds = "";
							var count = 0;

							rowchecked.each(function() {

								var thisid = $(this).parents("tr").find(".id").val();
								var thisViewId = $(this).parents().find('.id').attr('viewid');
								if (foodIds != null && foodIds != '') {
									foodIds = foodIds + "," + thisid;
								} else {
									foodIds = thisid;
								}
								if (foodViewIds != null && foodViewIds != '') {
									foodViewIds = foodViewIds + "," + thisViewId;
								} else {
									foodViewIds = thisViewId;
								}
								count++;
								if (count == rowchecked.length) {
									var status = "close";
									food.foodDoDelete(foodIds, foodViewIds, status);
								}
							})
							//					               
							//									rowchecked.each(function() {
							//										var thisid = $(this).parents("tr").find(
							//												".id").val();
							//										var status = "delete";
							//										food.foodDoDelete(thisid, status);
							//									})
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
							var foodIds = "";
							var foodViewIds = "";
							var count = 0;

							rowchecked.each(function() {

								var thisid = $(this).parents("tr").find(".id").val();
								var thisViewId = $(this).parents().find('.id').attr('viewid');
								if (foodIds != null && foodIds != '') {
									foodIds = foodIds + "," + thisid;
								} else {
									foodIds = thisid;
								}
								if (foodViewIds != null && foodViewIds != '') {
									foodViewIds = foodViewIds + "," + thisViewId;
								} else {
									foodViewIds = thisViewId;
								}
								count++;
								if (count == rowchecked.length) {
									var status = "finish";
									food.foodDoDelete(foodIds, foodViewIds, status);
								}
							})
							//									rowchecked.each(function() {
							//										var thisid = $(this).parents("tr").find(
							//												".id").val();
							//										var status = "finish";
							//										food.foodDoDelete(thisid, status);
							//									})
						}
					}
				});

			}

		})
		//列表批量取消发布
		$('#cancelpublish').unbind('click');
		$('#cancelpublish').on('click',
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
							var foodIds = "";
							var foodViewIds = "";
							var count = 0;

							rowchecked.each(function() {

								var thisid = $(this).parents("tr").find(".id").val();
								var thisViewId = $(this).parents().find('.id').attr('viewid');
								if (foodIds != null && foodIds != '') {
									foodIds = foodIds + "," + thisid;
								} else {
									foodIds = thisid;
								}
								if (foodViewIds != null && foodViewIds != '') {
									foodViewIds = foodViewIds + "," + thisViewId;
								} else {
									foodViewIds = thisViewId;
								}
								count++;
								if (count == rowchecked.length) {
									var status = "canclefinish";
									food.foodDoDelete(foodIds, foodViewIds, status);
								}
							})
							//					               
							//									rowchecked.each(function() {
							//										var thisid = $(this).parents("tr").find(".id").val();
							//										var status = "canclefinish";
							//										food.foodDoDelete(thisid, status);
							//									})
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
					food.orderby = "pos";
					//					alert("当前行"+$('tr').index(_current));
					var currentLine = $('tr').index(_current);

					// html实现效果        pageSize : 2,//每页显示数量 pageTotal : 1,//总页数pageCur     

					var thisid = _current.find(".id").val();
					var thisPos = (food.pageTotal - food.pageCur) * food.pageSize + (food.pageSize - currentLine) + 1;
					//					var thisPos = _current.find(
					//					".id").attr('pos');
					//上一级
					var getPosval = (food.pageTotal - food.pageCur) * food.pageSize + (food.pageSize - currentLine + 1) + 1;
					//					var getPosval = _current.prev('tr').find(
					//					".id").attr('pos');
					var thisviewId = _current.find(".id").attr('viewid');
					//上一级Id
					var preId = _current.prev('tr').find('.id').val();
					var previewId = _current.prev('tr').find('.id').attr('viewid');
					//当前行数与上一行数比较POS交换
					//					_current.insertBefore(_current.prev());
					food.foodDoEdit(thisid, thisviewId, getPosval, "0");

					food.foodDoEdit(preId, previewId, thisPos, "1")

					//					var v =2;
					//					for(var i=0;i<2;i++){
					//						scenic.scenicDoEdit(thisid,getPosval,orderby);
					//					}
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
					food.orderby = "pos";

					var currentLine = $('tr').index(_current);
					var nextId = _current.next('tr').find('.id').val();
					//				var nextPos = _current.next('tr').find('.id').attr('pos');
					var nextPos = (food.pageTotal - food.pageCur) * food.pageSize + (food.pageSize - currentLine - 1) + 1;
					var nextViewId = _current.next('tr').find('.id').attr('viewid');
					var thisviewId = _current.find(".id").attr('viewid');
					var thisPos = l = (food.pageTotal - food.pageCur) * food.pageSize + (food.pageSize - currentLine) + 1;
					//                    _current.insertBefore(_current.prev());
					var thisid = _current.find(".id").val();

					food.foodDoEdit(thisid, thisviewId, nextPos, "0");
					food.foodDoEdit(nextId, nextViewId, thisPos, "1");
					//				alert("排序上升单行的ID"+ thisid)
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
				//                _current.insertAfter(_current.next());
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
							food.orderby = "pos";
							rowchecked.each(function() {
								var thisid = $(this).parents("tr").find('.id').val();
								var sortNum = $(this).parents("tr").find("#sortnum").val();
								var thisViewid = $(this).parents('tr').find(".id").attr('viewid');
								food.foodDoEdit(thisid, thisViewid, sortNum);
							})
						}
					}
				});

			}

		});

	}
	return {
		initFood: tourFoodListInit
	};

})