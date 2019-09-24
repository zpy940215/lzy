define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'ztree', 'validata'],
function($, common, jqueryui, Handlebars, HandlebarExt, ztree, validata) {
	var editList = {
		ztreelist: function() {
			//树形菜单
			var IDMark_A = "_a";
			var setting = {
				view: {
					addDiyDom: addDiyDom
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					onRightClick: OnRightClick
				}
			};

			var zNodes = [{
				id: 1,
				name: "全部站点",
				open: true,
				noR: true,
				icon: "${base}/js/plugin/ztree/zTreeStyle/img/diy/1_open.png",
				children: [{
					id: 11,
					name: "站点1",
					url: "../columnset.html",
					target: "_self",
					icon: "${base}/js/plugin/ztree/zTreeStyle/img/diy/1_open.png",
					open: true,
					children: [{
						id: 111,
						name: "栏目1",
						isParent: true,
						url: "../site/siteSetup.html",
						target: "_self",
						children: [{
							id: 1111,
							name: "子栏目1",
							noR: true,
							url: "../site/siteEdit.html",
							target: "_self"
						},
						{
							id: 1112,
							name: "子栏目2",
							noR: true,
							url: "../site/siteEdit.html",
							target: "_self"
						}]
					},
					{
						id: 112,
						name: "栏目2",
						isParent: true,
						url: "../site/siteSetup.html",
						target: "_self",
						children: [{
							id: 1121,
							name: "子栏目1",
							noR: true,
							url: "../site/siteEdit.html",
							target: "_self"
						},
						{
							id: 1122,
							name: "子栏目2",
							noR: true,
							url: "../site/siteEdit.html",
							target: "_self"
						}]
					}
					]
				},
				{
					id: 12,
					name: "站点2",
					isParent: true,
					open: false,
					url: "../site/siteSetup.html",
					target: "_self",
					icon: "${base}/js/plugin/ztree/zTreeStyle/img/diy/1_open.png"
				},
				{
					id: 13,
					name: "站点3",
					isParent: true,
					open: false,
					url: "../site/siteSetup.html",
					target: "_self",
					icon: "${base}/js/plugin/ztree/zTreeStyle/img/diy/1_open.png"
				}]
			}

			];
			//添加站点
			function addDiyDom(treeId, treeNode) {
				if (treeNode.parentNode && treeNode.parentNode.id != 2) return;
				var aObj = $("#" + treeNode.tId + IDMark_A);
				if (treeNode.id == 1) {
					var editStr = "<span class='demoIcon' id='diyBtn_" + treeNode.id + "' title='" + treeNode.name + "' onfocus='this.blur();'><span class='button icon01'></span></span>";
					aObj.append(editStr);
					var btn = $("#diyBtn_" + treeNode.id);
					if (btn) btn.bind("click",
					function() {
						var _templ = Handlebars.compile($("#siteadd-save").html());
						$("#siteadd-save-content").html(_templ());
						common.base.popUp('.js_popUpsiteadd');
						editList.validate();
					});
				}
			}

			//右键菜单实现
			function OnRightClick(event, treeId, treeNode) {
				if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
					zTree.cancelSelectedNode();
					showRMenu("root", event.clientX, event.clientY);
				} else if (treeNode && !treeNode.noR) {
					zTree.selectNode(treeNode);
					showRMenu("node", event.clientX, event.clientY);
				}
			}
			//显示右键菜单
			function showRMenu(type, x, y) {
				$("#rMenu ul").show();

				rMenu.css({
					"top": y + "px",
					"left": x + "px",
					"visibility": "visible"
				});

				$("body").bind("mousedown", onBodyMouseDown);
			}
			function hideRMenu() {
				if (rMenu) rMenu.css({
					"visibility": "hidden"
				});
				$("body").unbind("mousedown", onBodyMouseDown);
			}
			function onBodyMouseDown(event) {
				if (! (event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
					rMenu.css({
						"visibility": "hidden"
					});
				}
			}
			var addCount = 1;

			var zTree, rMenu;
			$(document).ready(function() {
				$.fn.zTree.init($("#treeDemo"), setting, zNodes);
				zTree = $.fn.zTree.getZTreeObj("treeDemo");
				rMenu = $("#rMenu");
			});
			//新建子栏目
			$(".js_add_TreeNode").click(function() {
				$("#rMenu").css({
					"visibility": "hidden"
				});
				$("body").unbind("mousedown", onBodyMouseDown);
				var _templ = Handlebars.compile($("#columnadd-save").html());
				$("#columnadd-save-content").html(_templ());
				common.base.popUp('.js_popUpcolumnadd');
				editList.validate();
			})
			//编辑子栏目
			$(".js_edit_TreeNode").click(function() {
				$("#rMenu").css({
					"visibility": "hidden"
				});
				$("body").unbind("mousedown", onBodyMouseDown);
				var _templ = Handlebars.compile($("#columnadd-save").html());
				$("#columnadd-save-content").html(_templ());
				common.base.popUp('.js_popUpcolumnadd');
				editList.validate();
			})
		},
		validate: function() {
			//新建栏目页面表单验证
			$("#columneditform").validate({
				rules: {
					columnname: "required",
					paytype: "required",
					power: "required",
					examine: "required",
					displayterminal: "required"
				},
				messages: {
					columnname: "请输入栏目名称",
					paytype: "请选择打开方式",
					power: "请选择评论权限",
					examine: "请选择审核状态",
					displayterminal: "请选择展示终端"
				}
			});
			//栏目编辑页面
			$("#columnedittable").validate({
				rules: {
					columnname: "required",
					paytype: "required",
					power: "required",
					examine: "required",
					displayterminal: "required"
				},
				messages: {
					columnname: "请输入栏目名称",
					paytype: "请选择打开方式",
					power: "请选择评论权限",
					examine: "请选择审核状态",
					displayterminal: "请选择展示终端"
				}
			});
			//添加站点表单验证
			$("#addsitepopup").validate({
				rules: {
					isopen: "required"
				},
				messages: {
					isopen: "请选择是否开启"
				}
			});
		}

	}
	var editListInit = function() {
		editList.ztreelist();
		editList.validate();
	}
	return {
		init: editListInit
	};
});