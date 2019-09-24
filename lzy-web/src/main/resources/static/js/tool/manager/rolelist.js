define(['jquery', 'common', 'Handlebars', 'HandlebarExt', 'ztree', 'ztreecheck'],
function($, common, Handlebars, HandlebarExt, ztree, ztreecheck) {
	var data = {};
	var moduleObj;
	var roleList = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		isAjaxing: false,
		//角色列表
		list: function() {
			data['pageObject.page'] = roleList.pageCur;
			data['pageObject.pagesize'] = roleList.pageSize;
			$.ajax({
				url: '${base}/role!list.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(data) {
					common.base.loading("fadeOut");
					var _templ = Handlebars.compile($("#role_list").html());
					$("#role_show").html(_templ(data.dataList));
					if(data.dataList.dataList.length>0){
						var addId = parseInt(data.dataList.dataList[data.dataList.dataList.length - 1].roleId) + 1;
						$("#addId").val(addId);
					}
					//分页
					roleList.pageTotal = data.dataList.pagetotal;
					roleList.total = data.dataList.total;
					common.base.createPage('.js_pageDiv', {
						pageCur: roleList.pageCur,
						pageTotal: roleList.pageTotal,
						total: roleList.total,
						backFn: function(p) {
							roleList.pageCur = p;
							roleList.list();
						}
					});
					roleList.editrole();
					roleList.deleterow();
				}
			});
		},

		//模块列表
		moduleList: function() {
			$.ajax({
				url: '${base}/module!list.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					moduleObj = data.dataList;
				}
			});
		},
		search: function() {
			$("#search").click(function() {
				data['roleVo.name'] = $("#roleName").val();
				roleList.list();
			});

		},

		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('dataId');
				var roleId = $(this).attr('roleId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							roleList.roleDoDelete(Id, roleId);
						}
					}
				});
			});
		},
		roleDoDelete: function(Id, roleId) {
			if (!Id) {
				return false;
			}
			if (roleList.isAjaxing) return false;
			roleList.isAjaxing = true;
			$.ajax({
				url: '${base}/role!delete.ajax',
				data: {
					'id': Id,
					'roleId': roleId
				},
				type: 'post',
				dataType: "json",

				success: function(resultData) {
					roleList.isAjaxing = false;
					if (resultData.code == "success") {
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '删除成功!',
							//提示语
							backFn: function(result) {
								roleList.list();
							}
						});
						//删除完成刷新当前列表
						roleList.list();
						// article.inputSerch();
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
					article.isAjaxing = false;
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
		//添加角色
		addrole: function() {
			$('.js_add_role').unbind("click");
			$('.js_add_role').click(function() {
				var _templ = Handlebars.compile($("#addrole-save").html());
				$("#addrole-save-content").html(_templ());
				common.base.popUp('.js_popUpaddrole');
				roleList.addztreedemo();
			});
			//确认添加
			$("body").on('click', '#addRloe',
			function() {
				// var roleId=$("#addId").val();
				var roleName = $("#addName").val();
				var description = $("#description").val();
				var treeObj = $.fn.zTree.getZTreeObj("addroletree"),
				nodes = treeObj.getCheckedNodes(true),
				ids = "";
				for (var i = 0; i < nodes.length; i++) {
					ids += nodes[i].id + ",";
				}
				// data['roleId'] = roleId;
				data['name'] = roleName;
				data['description'] = description;
				data['moduleId'] = ids;
				if (roleList.isAjaxing) return false;
				roleList.isAjaxing = true;
				$.ajax({
					url: '${base}/role!add.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					success: function(data) {
						if (data.code == "success") {
							roleList.isAjaxing = false;
							window.location.reload();
						} else {
							alert(data.description);
						}
					}
				});
			});
		},
		//编辑角色
		editrole: function() {
			$('.js_edit_role').unbind("click");
			$('.js_edit_role').click(function() {
				var _templ = Handlebars.compile($("#editpower-save").html());
				$("#editpower-save-content").html(_templ());
				common.base.popUp('.js_popUpeditpower');
				roleList.editztreedemo();
				var mainId = $(this).attr('mainId');
				var roleId = $(this).attr('roleId');
				$('#mainId').val(mainId);
				$('#editId').val(roleId);
				var data = {};
				data['roleId'] = roleId;

				$.ajax({
					url: '${base}/role!queryRoleByRoleId.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					success: function(data) {

						$("#editName").val(data.roleVo.name);
						$("#editDescription").val(data.roleVo.description);
						if (data.moduleId != null && data.moduleId != "") {
							var datas = data.moduleId.split(',');
							var treeObj = $.fn.zTree.getZTreeObj("editroletree");
							var nodes = treeObj.getNodes();
							for (var i = 0; i < datas.length; i++) {
								for (var j = 0,
								l = nodes.length; j < l; j++) {
									if (datas[i] == nodes[j].id) {
										treeObj.checkNode(nodes[j], true, true);
									}
								}
							}
							var nodesList = treeObj.transformToArray(treeObj.getNodes());
							//菜单展开
							treeObj.expandAll(true);
							//单独处理level=0,1的，因为一旦level=0,1状态选中，那么level=2也会选中
							for (var j = 0,
							l = nodesList.length; j < l; j++) {
								if (nodesList[j].level < 2) {
									if ($.inArray(nodesList[j].id, datas) >= 0) {
										treeObj.checkNode(nodesList[j], true, true);
									}
								}

							}

							//单独处理level=2的列表数据,多选的去掉
//							for (var j = 0,
//							l = nodesList.length; j < l; j++) {
//								if (nodesList[j].level >= 2) {
//									if ($.inArray(nodesList[j].id, datas) < 0) {
//										treeObj.checkNode(nodesList[j], false, false);
//									}
//								}
//
//							}
							
							//多选的去掉
							for (var j = 0,l = nodesList.length; j < l; j++) {
								if ($.inArray(nodesList[j].id, datas) < 0) {
									treeObj.checkNode(nodesList[j], false, false);
								}

							}

						}
					}
				});
			});
			//确认编辑
			$("body").on('click', '#editRloe',
			function() {
				var mainId = $('#mainId').val();
				var roleId = $('#editId').val();
				var roleName = $("#editName").val();
				var description = $("#editDescription").val();
				var treeObj = $.fn.zTree.getZTreeObj("editroletree"),
				nodes = treeObj.getCheckedNodes(true),
				ids = "";
				for (var i = 0; i < nodes.length; i++) {
					ids += nodes[i].id + ",";
				}
				data['id'] = mainId;
				data['roleId'] = roleId;
				data['name'] = roleName;
				data['description'] = description;
				data['moduleId'] = ids;
				if (roleList.isAjaxing) return false;
				roleList.isAjaxing = true;
				$.ajax({
					url: '${base}/role!edit.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					success: function(data) {
						roleList.isAjaxing = false;
						if (data.code == "success") {
							window.location.reload();
						} else {
							alert(data.description);
						}
					}
				});
			});
		},
		//树形菜单
		addztreedemo: function() {
			var setting = {
				data: {
					key: {
						name: "name"
					},
					simpleData: {
						idKey: "id",
						pIdKey: "pId",
						enable: true,
						open: true
					}
				},
				check: {
					enable: true
				}
			};
			var zNodes = moduleObj;

			$(document).ready(function() {
				$.fn.zTree.init($("#addroletree"), setting, zNodes);
				var treeObj = $.fn.zTree.getZTreeObj("addroletree");
				treeObj.expandAll(true);
			});
		},
		//树形菜单
		editztreedemo: function() {
			var setting = {
				check: {
					enable: true
				},
				data: {
					simpleData: {
						enable: true
					}
				}
			};
			var zNodes = moduleObj;
			$(document).ready(function() {
				$.fn.zTree.init($("#editroletree"), setting, zNodes);
			});
		}

	}
	var roleListInit = function() {
		roleList.list();
		roleList.moduleList();
		roleList.search();
		roleList.addrole();
	}
	return {
		init: roleListInit
	};
})