define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'ztree'],
function($, common, jqueryui, Handlebars, HandlebarExt, ztree) {
	var fatherSiteId;
	var thisCategoryId;
	var thisSiteId;
	//新增站点下的栏目 或者 栏目下的子栏目  保存点击时的相关信息
	var currentCategoryId; //获取站点的 categoryId
	var siteId; //获取站点的 siteId
	var projectId; //获取站点的 siteId

	var siteList = {
		pageSize: 10,
		// 每页显示数量
		pageTotal: 1,
		// 总页数
		total: 1,
		//总条数
		pageCur: 1,
		// 当前页
		isAjaxing: false,
		ztreelist: function() {
			// 树形菜单   规律为 第一级 treeDemo_1_a 第二级 treeDemo_2_a  第三级 treeDemo_3_a  依次类推
			var IDMark_A = "_a";
			$.ajax({
				url: '${base}/site!queryListAll.ajax',
				async: false,
				cache: false,
				data: {
					"pageObject.page": siteList.pageCur,
					"pageObject.pagesize": siteList.pageSize
				},
				type: 'POST',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(data) {
					var setting = {
						view: {
							addDiyDom: addDiyDom
							// 添加站点
						},
						data: {
							key: {
								name: "name"
							},
							simpleData: {
								idKey: "categoryId",
								pIdKey: "siteId",
								icon: "icon",
								enable: true
							}
						},
						callback: { // 右键菜单实现
							// beforeDrag: beforeDrag,
							onRightClick: OnRightClick,

							onClick: OnClick //点击栏目编辑
						}
					};
					var zNodes = data.data.allList;
					$.fn.zTree.init($("#treeDemo"), setting, zNodes);

					var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
					var nodes = treeObj.getNodes();
					if (nodes.length > 0) {
						treeObj.expandNode(nodes[0], true, true, true);
					}
					common.base.loading("fadeOut");
				}
			});

			//树形结构 加号
			function addDiyDom(treeId, treeNode) {
				//treeNode.tId  即为 第一级 treeDemo_1 第二级 treeDemo_2  第三级 treeDemo_3  依次类推
				var aObj = $("#" + treeNode.tId + IDMark_A);
				//treeNode.id == 1 这样判断的原因是 在siteService 的queryListAll 方法中 把全部站点数据的 ID设置为 1
				if (treeNode.id == 1) {
					var editStr = "<span class='demoIcon' id='diyBtn_" + treeNode.id + "' title='" + treeNode.name + "' onfocus='this.blur();'><span class='button icon01'></span></span>";
					aObj.after(editStr);
					var btn = $("#diyBtn_" + treeNode.id);
					if (btn) btn.bind("click",
					function() {
						var _templ = Handlebars.compile($("#siteadd-save").html());
						$("#siteadd-save-content").html(_templ());
						common.base.popUp('.js_popUpsiteadd');
						siteList.addsite();
					});
				}
			}

			// 右键菜单实现 添加
			function OnRightClick(event, treeId, treeNode) {
				//通过treeNode中的level来判断等级，全部站点 level = 0 , 具体站点 level = 1 ,栏目 level = 2 ,子栏目  level = 3 ,子子栏目 level = 4 ,依次往下推时间
				//右击全部站点  暂且不处理
				if (treeNode.level == 0 || treeNode.level == null) {
					return;
				}
				//右击 新建 具体站点 站点下的栏目
				if (treeNode.level == 1) {
					//站点没栏目，当前，站点即为新建栏目的siteid 为新建栏目的upid
					currentCategoryId = treeNode.categoryId; //获取站点的 categoryId
					siteId = treeNode.categoryId; //获取站点的 siteId
					projectId = treeNode.projectId; //获取站点的 projectId
					// $("#nodeDate").val(thisSiteId);
					zTree.selectNode(treeNode);
					showRMenu("node", event.clientX, event.clientY);
				}
				// 栏目的新建  以及子栏目
				if (treeNode.level > 1) {
					//初始化这些全局变量，为了后边的新增栏目提供参数
					currentCategoryId = treeNode.categoryId; //获取站点的 categoryId
					//在栏目和子栏目下的treeNode.siteId里面写的内容为他的上级的 categoryId ，即upid字段的值
					siteId = treeNode.currentSiteId; //获取站点的 siteId
					projectId = treeNode.projectId; //获取站点的 siteId
					// $("#nodeDate").val(thisSiteId);
					zTree.selectNode(treeNode);
					showRMenu("node", event.clientX, event.clientY);
				}
			}

			//点击栏目编辑
			function OnClick(event, treeId, treeNode) {
				//通过treeNode中的level来判断等级，全部站点 level = 0 , 具体站点 level = 1 ,栏目 level = 2 ,子栏目  level = 3 ,子子栏目 level = 4 ,依次往下推时间
				//单击全部站点  显示所有站点下的具体站点
				if (treeNode.level == 0) {
					siteList.sitePageList();
				}
				//单击具体站点  显示站点下的所有栏目
				if (treeNode.level == 1) {
					thisSiteId = treeNode.categoryId; //获取站点的 siteId
					// $("#nodeDate").val(thisSiteId);
					zTree.selectNode(treeNode);
					siteList.queryCategoryBySiteId(thisSiteId);
				}
				//点击栏目，显示栏目的编辑页面
				if (treeNode.level > 1) {
//					var primaryId = treeNode.categoryId; //获取站点或者栏目 本身的数据
					var primaryId = treeNode.id; 
					var categoryData = siteList.queryBycategoryId(primaryId);
					//获取栏目上级  siteId
					var upID = treeNode.siteId;
					var siteId = treeNode.currentSiteId;
					var projectId = treeNode.projectId;
					var Id = treeNode.id;
					if (categoryData.code == "success") {
						var _templ = Handlebars.compile($("#columnadd-save").html());
						$("#site-list-content").html(_templ(categoryData.data));
						$('.data_table').css('padding-top', '0px');
						//编辑栏目   Id不为空
						// siteList.validate();//验证用
						//编辑时候，需要有ID即可
						siteList.editorCategoryUpid(upID, siteId, projectId, Id, '0');

					}
				}


			}
			// 显示右键菜单
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
				zTree = $.fn.zTree.getZTreeObj("treeDemo");
				rMenu = $("#rMenu");
			});
			// 新建子栏目
			$(".js_add_TreeNode").click(function(treeNode) {
				$("#rMenu").css({
					"visibility": "hidden"
				});
				$("body").unbind("mousedown", onBodyMouseDown);
				var _templ = Handlebars.compile($("#columnadd-save").html());
				$("#site-list-content").html(_templ());
				$(".popup_bt").html('新增栏目');
				$('.data_table').css('padding-top', '0px');
				$('input[name="isunfold"]').eq(0).attr('checked', true);
				$('input[name="iscomments"]').eq(2).attr('checked', true);
				$('input[name="audit"]').eq(1).attr('checked', true);
				$('input[name="showClients"]').eq(0).attr('checked', true);
				//新增子栏目  新增时候  id为空
				// siteList.validate();//验证用
				siteList.editorCategoryUpid(currentCategoryId, siteId, projectId, null);

			})

		},

		/**编辑栏目 ,新增栏目
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/
		editorCategoryUpid: function(categoryUpid, siteId, projectId, Id, stadus) {

			var flag = true;
			//alert("栏目表主键ID "+primaryId);
			$('.js_popUpSubmitAddColumn').unbind("click");
			$('.js_popUpSubmitAddColumn').on('click',
			function() {

				var checkResult = true
				//注意啦 同一个页面  如果出现两个ID 一般不会报错，但是会取首先加载页面的数据 ，可以通过以下语法来实现获取当前页面的值
				var name = $(this).parents('.popupform').find(".categoryName").val();
				var dataType = $(this).parents('.popupform').find(".categoryDatatype  option:selected").val(); //选中的值
				// var dataType= $('#dType option:selected') .val();//选中的值
				if (dataType == "请选择") {
					alert("请填写数据类型");
					flag = false;
					return flag;
				}
				if (flag) {
					if (!common.validate.checkEmpty('.categoryName', '请输入栏目名称！')) {
						checkResult = false;
					}
					if (!common.validate.isRadioCheck('isunfold', '请选择打开方式！')) {
						checkResult = false;
					}
					if (!common.validate.isRadioCheck('iscomments', '请选择评论权限！')) {
						checkResult = false;
					}
					if (!common.validate.isRadioCheck('audit', '请选择是否需要审核！')) {
						checkResult = false;
					}
					if (!common.validate.isRadioCheck('showClients', '请选择展示终端！')) {
						checkResult = false;
					}

					// var url = $(this).parents('.popupform').find(".categoryUrl").val();
					var url = $(".categoryUrl").val();
					// var metaSubject=$(this).parents('.popupform').find(".categoryMetaSubject").val();
					var metaSubject = $("#metaSubject").val();
					// var metaKeywords=$(this).parents('.popupform').find(".categoryMetaKeywords").val();
					var metaKeywords = $("#metaKeywords").val();
					// var description=$(this).parents('.popupform').find(".categoryDescription").val();
					var description = $("#description").val();
					// var targetType = $(this).parents('.popupform').find(".categoryTarget input[name='isunfold']:checked").val(); //jquery获取input radio选中的value
					var targetType = $('#target input[name="isunfold"]:checked').val(); //jquery获取input radio选中的value
					// var commentPermission = $(this).parents('.popupform').find(".categoryComments input[name='iscomments']:checked").val();
					var commentPermission = $('#comments input[name="iscomments"]:checked').val();
					// var articleAudit = $(this).parents('.popupform').find(".categoryOpenTheWay input[name='audit']:checked").val();
					var articleAudit = $('#OpenTheWay input[name="audit"]:checked').val();
					// var showClients = $(this).parents('.popupform').find(".categoryTerminal input[name='showClients']:checked").val();
					var showClients = '';
					$('#terminal input[name="showClients"]:checked').each(function() {
						showClients += $(this).val() + ',';
					})

					if (!checkResult) {
						return false;
					}

					if (siteList.isAjaxing) return false;
					siteList.isAjaxing = true;
					$.ajax({
						url: '${base}/category!saveOrUpdate.ajax',
						type: 'POST',
						data: {
							'categoryVo.id': Id,
							'categoryVo.upId': categoryUpid,
							'categoryVo.siteId': siteId,
							'categoryVo.projectId': projectId,
							'categoryVo.name': name,
							'categoryVo.dataType': dataType,
							'categoryVo.url': url,
							'categoryVo.metaSubject': metaSubject,
							'categoryVo.metaKeywords': metaKeywords,
							'categoryVo.targetType': targetType,
							'categoryVo.description': description,
							'categoryVo.commentPermission': commentPermission,
							'categoryVo.articleAudit': articleAudit,
							'categoryVo.showClients': showClients
						},
						dataType: "json",
						beforeSend: function() {
							common.base.loading("fadeIn");
						},
						success: function(resultData) {
							if (resultData.code == "success") {
								siteList.isAjaxing = false;
								var editId;
								if (resultData.data.categoryVo != null) {
									editId = resultData.data.categoryVo.id;
								}
								if (stadus != 0) {

									var _templ = Handlebars.compile($("#continueaddcolumn-save").html());
									$("#continueaddcolumn").html(_templ());
									common.base.popUp('.js_continueaddcolumn');

									$('.js_popUpSure').on('click',
									function() {
										siteList.editorCategoryUpid(currentCategoryId, siteId, projectId, editId, null);
										$('.js_continueaddcolumn').fadeOut();
									});

									$('.js_popUpcontinueadd').on('click',
									function() {
										$('.js_continueaddcolumn').fadeOut();
										var _templ = Handlebars.compile($("#columnadd-save").html());
										$("#site-list-content").html(_templ());
										$(".popup_bt").html('新增栏目');

										$('input[name="isunfold"]').eq(0).attr('checked', true);
										$('input[name="iscomments"]').eq(2).attr('checked', true);
										$('input[name="audit"]').eq(1).attr('checked', true);
										$('input[name="showClients"]').eq(0).attr('checked', true);
										//新增子栏目  新增时候  id为空
										// siteList.validate();//验证用
										siteList.editorCategoryUpid(currentCategoryId, siteId, projectId, null);
									})
								} else {
									var tipmesg = '';
									common.base.popUp('', {
										type: 'tip',
										tipTitle: '温馨提示',
										//标题
										tipMesg: '更新成功!',
										//提示语
										backFn: function(result) {
											if (result) {
												window.location.href = '${base}/tool/site/siteSetup.html';

												$(".js_popUpcolumnadd").fadeOut();
											}
										}
									});
								}

								//新增完成刷新列表
								siteList.pageCur = 1;
								siteList.ztreelist();

							}
							common.base.loading("fadeOut");
						}
					});
				}

			})
		},

		/* 新建站点下的栏目 */
		addInfoCategory: function(thisSiteId) {
			//alert("进来？"+thisSiteId);
			$('.js_popUpSubmitAddColumn').unbind("click");
			$(document).on('click', '.js_popUpSubmitAddColumn',
			function() {
				var checkResult = true
				var name = $("#name").val();
				var dataType = $('#dType option:selected').val(); //选中的值
				var url = $("#url").val();
				var metaSubject = $("#metaSubject").val();
				var metaKeywords = $("#metaKeywords").val();
				var description = $("#description").val();
				var targetType = $('#target input[name="isunfold"]:checked').val(); //jquery获取input radio选中的value
				var commentPermission = $('#comments input[name="iscomments"]:checked').val();
				var articleAudit = $('#OpenTheWay input[name="audit"]:checked').val();
				var showClients = '';
				$('#terminal input[name="showClients"]:checked').each(function() {
					showClients += $(this).val() + ',';
				});
				if ($('#sitename').val() == '') {
					$(".errorbox .js_errortip").html("请输入站点名称！");
					checkResult = false;
				} else {
					$(".errorbox .js_errortip").html("");
				}
				if (!checkResult) {
					return false;
				}
				if (siteList.isAjaxing) {
					return false;
				}
				siteList.isAjaxing = true;
				$.ajax({
					url: '${base}/category!saveOrUpdate.ajax',
					type: 'POST',
					data: {
						//'categoryVo.id':Id,
						'categoryVo.siteId': thisSiteId,
						'categoryVo.name': name,
						'categoryVo.dataType': dataType,
						'categoryVo.url': url,
						'categoryVo.metaSubject': metaSubject,
						'categoryVo.metaKeywords': metaKeywords,
						'categoryVo.targetType': targetType,
						'categoryVo.description': description,
						'categoryVo.commentPermission': commentPermission,
						'categoryVo.articleAudit': articleAudit,
						'categoryVo.showClients': showClients
					},
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success: function(resultData) {
						common.base.loading("fadeOut");
						if (resultData.code == "success") {
							siteList.isAjaxing = false;
							var tipmesg = '信息更新成功';
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: tipmesg,
								//提示语
								backFn: function(result) {}
							});
							$('.js_popUpcolumnadd').fadeOut();
							//新增完成刷新列表
							siteList.pageCur = 1;
							// siteList.ztreelist();
							window.location.href = '${base}/tool/site/siteSetup.html';
						} else {
							
							if (resultData && resultData.description) {
								//alert(resultData.description);
								common.base.popUp('', {
									type: 'tip',
									tipTitle: '温馨提示',
									//标题
									tipMesg: resultData.description,
									//提示语
									backFn: function(result) {}
								});
							}
							
						}
						
					}
				});
			})
		},

		//根据categoryID查询
		queryBycategoryId: function(primaryId) {
			var returnData;
			$.ajax({
				url: '${base}/category!queryBycategoryId.ajax',
				type: 'POST',
				data: {
					"categoryVo.id": primaryId
				},
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
					common.base.loading("fadeOut");
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
		//根据siteId查询 站点下的所有栏目
		queryCategoryBySiteId: function(siteId) {
			var returnData;
			var searchInput = $('.js_search_input').val();
			$.ajax({
				url: '${base}/category!queryListPage.ajax',
				type: 'POST',
				data: {
					"categoryVo.siteId": siteId,
					"categoryVo.name": searchInput,
					"pageObject.page": siteList.pageCur,
					"pageObject.pagesize": siteList.pageSize
				},
				dataType: "json",
				async: false,
				//设置同步请求
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(data) {
					if (data.code == "success") {
						// 加载数据的处理
						var _templ = Handlebars.compile($("#category-list").html());
						$("#site-list-content").html(_templ(data.data));
						$('.data_table').css('padding-top', '40px');
						var html = '<div class="fr">' + '<label>查询条件 </label>' + '<input name="keywords" type="text" class="search_input js_search_input" placeholder="请输入栏目"/>' + '<input value="搜索" class="comBtn btn-small searchbtn js_searchbtn" type="button"/>' + '</div>';
						$(".table-head").append(html);
						// 分页
						siteList.pageTotal = data.data.pagetotal;
						siteList.total = data.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: siteList.pageCur,
							pageTotal: siteList.pageTotal,
							total: siteList.total,
							backFn: function(p) {
								siteList.pageCur = p;
								siteList.ztreelist();
								siteList.queryCategoryBySiteId(siteId);
							}
						});
						siteList.categoryEdit(); //初始化站点编辑事件
						siteList.deleterowCategory(); //初始化删除事件
						//搜索栏目
						$('.js_searchbtn').on('click',
						function() {
							siteList.queryCategoryBySiteId(siteId);
						})
					}
					common.base.loading("fadeOut");
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
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
		//根据ID查询
		queryBysiteId: function(Id, siteId) {
			var returnData;
			$.ajax({
				url: '${base}/site!queryBySiteId.ajax',
				data: {
					"siteVo.id": Id,
					"siteVo.siteId": siteId
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
						backFn: function(result) {
							//alert(result);
						}
					});
				}
			});
			return returnData;
		},
		// 查询分页  查询所有站点
		sitePageList: function() {
			$.ajax({
				url: '${base}/site!queryListPage.ajax',
				data: {
					"pageObject.page": siteList.pageCur,
					"pageObject.pagesize": siteList.pageSize
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(data) {
					if (data.code == "success") {
						// 加载数据的处理
						var _templ = Handlebars.compile($("#site-list").html());
						$("#site-list-content").html(_templ(data.data));
						// 分页
						siteList.pageTotal = data.data.pagetotal;
						siteList.total = data.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: siteList.pageCur,
							pageTotal: siteList.pageTotal,
							total: siteList.total,
							backFn: function(p) {
								siteList.pageCur = p;
								siteList.ztreelist();
								siteList.sitePageList();
							}
						});
						siteList.siteEdit(); //初始化编辑事件
						siteList.deleterowSite(); //初始化删除事件
					}
					common.base.loading("fadeOut");
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						// 标题
						tipMesg: '操作异常',
						// 提示语
						backFn: function(result) {
							// alert(result);
						}
					});
				}
			});
		},

		addsite: function(Id) {
			$('#addcolumnbtn').unbind("click");
			$(document).on('click', '#addcolumnbtn',
			function() {
				var radio = document.getElementsByName("siteVo.openReg");
				var checkResult = true
				var name = $("#js_site_name").val();
				/*var Reg= $('input[name="isopen"]:checked').val();
								 var noReg= $('input[name="isopen"]:checked').val();	*/
				var radioes = $('#Reg input[name="isopen"]:checked').val(); //jquery获取input radio选中的value
				var url = $("#url").val();
				var bigSize = $("#bigSize").val();
				var middleSize = $("#middleSize").val();
				var smallSize = $("#smallSize").val();
				if (!common.validate.checkEmpty('#js_site_name', '请输入站点名称！')) {
					checkResult = false;
				}
				if (!common.validate.isRadioCheck('isopen', '请输入注册登录状态！')) {
					checkResult = false;
				}
				if (checkResult) {
					if (siteList.isAjaxing) return false;
					siteList.isAjaxing = true;
					$.ajax({
						url: '${base}/site!saveOrUpdate.ajax',
						type: 'POST',
						data: {
							'siteVo.id': Id,
							'siteVo.name': name,
							'siteVo.openReg': radioes,
							'siteVo.url': url,
							'siteVo.bigSize': bigSize,
							'siteVo.middleSize': middleSize,
							'siteVo.smallSize': smallSize
						},
						dataType: "json",
						beforeSend: function() {
							common.base.loading("fadeIn");
						},
						success: function(resultData) {
							common.base.loading("fadeOut");
							if (resultData.code == "success") {
								siteList.isAjaxing = false;
								var tipmesg = '信息更新成功！';
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
								$('.popup').hide();
								//新增完成刷新列表
								siteList.ztreelist();
								siteList.sitePageList();
								// window.location.href='${base}/tool/site/siteSetup.html';
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
						}
					});

				}

			})
		},

		// 列表 站点 删除
		deleterowSite: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					// 标题
					tipMesg: '是否确定删除？',
					// 提示语
					backFn: function(result) {
						if (result) {
							siteList.siteDoDelete(Id);
						}
					}
				});
			});
		},
		// 列表 栏目 删除
		deleterowCategory: function() {
			$('.js_delete_row_category').unbind("click");
			$(".js_delete_row_category").click(function() {
				var Id = $(this).attr('dataId');
				var categoryId = $(this).attr('categoryId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					// 标题
					tipMesg: '是否确定删除？',
					// 提示语
					backFn: function(result) {
						if (result) {
							siteList.categoryDoDelete(Id, categoryId);
						}
					}
				});
			});
		},
		//站点删除
		siteDoDelete: function(Id) {
			$.ajax({
				url: '${base}/site!delete.ajax',
				data: {
					'siteVo.id': Id
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						siteList.isAjaxing = false;
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '删除成功!'
							//提示语
						});
						//删除完成刷新当前列表
						siteList.ztreelist();
					}
					
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
		//栏目删除
		categoryDoDelete: function(Id, categoryId) {
			$.ajax({
				url: '${base}/category!delete.ajax',
				data: {
					'categoryVo.id': Id,
					"categoryVo.categoryId": categoryId
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						siteList.isAjaxing = false;
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '删除成功!'
							//提示语
						});
						//删除完成刷新当前列表
						siteList.ztreelist();
					}
					
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
		//点击编辑站点
		siteEdit: function() {
			$(".js_consult_handle").unbind("click");
			$(".js_consult_handle").click(function() {
				var Id = $(this).attr('dataId');
				var siteId = $(this).attr('siteId');
				var siteData = siteList.queryBysiteId(Id, siteId);

				if (siteData.code == "success") {
					var _templ = Handlebars.compile($("#siteadd-save").html());
					siteData['data']['popUp'] = {
						titleName: '站点更新'
					};
					$("#siteadd-save-content").html(_templ(siteData.data));
					common.base.popUp('.js_popUpsiteadd', {
						type: 'form',
						backFn: function(result) {
							if (result) {
								siteList.addsite(Id);
							}
						}
					});
				}
			});
		},
		//点击编辑栏目
		categoryEdit: function() {
			$(".js_consult_handle_category").unbind("click");
			$(".js_consult_handle_category").on('click',
			function() {

				var Id = $(this).attr('dataId');
				var siteId = $(this).attr('siteId');
				var upId = $(this).attr('upId');
				var projectId = $(this).attr('projectId');
				//查询栏目信息
				var siteData = siteList.queryBycategoryId(Id, siteId);

				if (siteData.code == "success") {
					var _templ = Handlebars.compile($("#columnadd-save").html());
					siteData['data']['popUp'] = {
						titleName: '站点更新'
					};
					$("#columnadd-save-content").html(_templ(siteData.data));
					common.base.popUp('.js_popUpcolumnadd');

					// siteList.validate();//验证用
					siteList.editorCategoryUpid(upId, siteId, projectId, Id, '0');

				}
			});
		}

	}
	var siteListInit = function() {
		siteList.ztreelist();
		siteList.sitePageList();
		// siteList.deleterow();
	}
	return {
		init: siteListInit
	};
});