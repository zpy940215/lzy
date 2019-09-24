define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var placeList = {
		pageSize: 15,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		isAjaxing: false,
		sites: [],
		//获取分页数据
		getList: function() {
			$.ajax({
				url: '${base}/position!queryListPage.ajax',
				data: {
					"pageObject.page": placeList.pageCur,
					"pageObject.pagesize": placeList.pageSize,
					"positionVo.name": $(".js_search_input").val(),
					"positionVo.status": "open"
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						console.log(resultData.data);
						var _templ = Handlebars.compile($("#position-list").html());
						$("#position-list-content").html(_templ(resultData.data));
						//分页
						placeList.pageTotal = resultData.data.pagetotal;
						placeList.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: placeList.pageCur,
							pageTotal: placeList.pageTotal,
							total: placeList.total,
							backFn: function(p) {
								placeList.pageCur = p;
								placeList.getList();
							}
						});
						placeList.deleterow();
						placeList.queryById();
						placeList.addlocation();
						placeList.getAllSites();
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
				if (placeList.isAjaxing) return false;
				placeList.isAjaxing = true;
				var Id = $(this).attr('deleteId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/position!delete.ajax',
								data: {
									"positionVo.id": Id,
									"positionVo.status": "delete"
								},
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
											tipMesg: '删除成功!',
											//提示语
											backFn: function(result) {

}
										});
										placeList.getList();
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
									placeList.isAjaxing = false;
								}
							});
						} else {
							placeList.deleterow();
							placeList.addlocation();
						}
					}
				});
			});
		},
		//查询一条记录
		queryById: function() {
			$(".js_edit_location").unbind('click');
			$(".js_edit_location").click(function() {
				var id = $(this).attr('editId');
				var siteId = $(this).attr('siteId');
				$.ajax({
					url: '${base}/position!queryById.ajax',
					data: {
						"positionVo.id": id
					},
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var resultData = resultData.data.positionVo;
							placeList.editlocation(resultData, siteId);
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
			});
		},
		//添加位置
		addlocation: function() {
			$(".js_add_location").unbind('click');
			$(".js_add_location").click(function() {
				var placeData = [];
				placeData['popUp'] = {
					titleName: '添加位置'
				};
				placeData['siteList'] = placeList.sites;
				var _templ = Handlebars.compile($("#addlocation-save").html());
				$("#addlocation-save-content").html(_templ(placeData));
				common.base.popUp('.js_popUpaddlocation');
				placeList.formsubmit();
			})

		},
		//编辑位置
		editlocation: function(resultData, siteId) {
			if (resultData) {
				var placeData = resultData;
				placeData['popUp'] = {
					titleName: '编辑位置',
					siteId: siteId
				};
				placeData['siteList'] = placeList.sites;
				var _templ = Handlebars.compile($("#addlocation-save").html());
				$("#addlocation-save-content").html(_templ(placeData));
				common.base.popUp('.js_popUpaddlocation');
				placeList.formsubmit();
			}
		},
		//查询所有站点
		getAllSites: function() {
			$.ajax({
				url: '${base}/site!querySitesList.ajax',
				dataType: "json",
				success: function(resultData) {
					if (resultData.code == "success") {
						placeList.sites = resultData.data.sitelist;
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
		//提交
		formsubmit: function() {
			/*位置管理页面添加位置弹窗表单验证*/

			var locationname = $('input[name="locationname"]'),
			selectsite = $('select[name="selectsite"]');
			locationname.bind('input propertychange',
			function() {
				if ($(this).val() != '') {
					$(this).removeClass('errorborder')
				}
			});
			selectsite.bind('input propertychange',
			function() {
				if ($(this).val() != '请选择') {
					$(this).removeClass('errorborder');
				}
			})
			// alert(selectsite.val());
			$("#addlocation").click(function() {
				if (locationname.val() == '') {
					locationname.addClass('errorborder');
				}
				if (selectsite.val() == '') {
					selectsite.addClass('errorborder');
				}
				if (locationname.val() != '' && selectsite.val() != '') {
					//提交数据
					if (placeList.isAjaxing) {
						return false;
					}
					placeList.isAjaxing = true;
					$.ajax({
						url: '${base}/position!save.ajax',
						data: {
							"positionVo.name": locationname.val(),
							"positionVo.siteId": selectsite.val(),
							"positionVo.id": common.validate.trim($('#id').val())
						},
						dataType: "json",
						success: function(resultData) {
							placeList.isAjaxing = false;
							if (resultData.code == "success") {
								placeList.getList();
								$(".js_popUpaddlocation").fadeOut();
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
				}
			})
		}

	}
	var placeListInit = function() {
		placeList.getList();

		//搜索
		$('.js_searchbtn').click(function() {
			placeList.pageCur = 1;
			placeList.getList();
		});
	}
	return {
		init: placeListInit
	};
});