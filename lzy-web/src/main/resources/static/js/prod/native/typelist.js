define(['jquery', 'common', 'jqueryui', 'Handlebars', 'ztree'],
function($, common, jqueryui, Handlebars, ztree) {
	var typeList = {
		isAjaxing: false,
		types: [],
		getTypelist: function(pid, dom) {
			$.ajax({
				url: '${base}/prodType!queryListByPid.ajax',
				type: 'POST',
				dataType: 'json',
				async: false,
				data: {
					"prodTypeVo.upId": pid,
					"prodTypeVo.status": "open"
				},
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultMap) {
					if (resultMap.code == "success") {
						var data = resultMap.data.typeVoList;
						var html = "";
						if (data != null && data.length > 0) {
							for (var i = 0; i < data.length; i++) {
								var temp = data[i];
								html += '<ul>' + '<div class="tabletreerow clear">' + '<div class="tabletreerowleft fl">' + '<a href="javascript:;" type_id="' + temp.typeId + '" up_id="' + temp.upId + '" class="for-ajax-link pms-folder js_pms-folder"><span class="glyphicon glyphicon-folder-close">&nbsp;</span>' + temp.name + '</a>' + '</div>' + '<div class="tabletreerowright fr">' + '<span ><a class="js_genre_add for-ajax-link  pms-modals-open" type_id="' + temp.typeId + '" up_id="' + temp.upId + '" href="javascript:;" >添加子分类</a> |</span> <span class="edit_row"><a href="javascript:void(0)" editId="' + temp.id + '" type_id="' + temp.typeId + '" up_id="' + temp.upId + '" class="js_genre_edit">编辑</a> |</span> <span><a href="javascript:void(0)" deleteId="' + temp.id + '" typeId="' + temp.typeId + '" up_id="' + temp.upId + '" class="js_delete_row">删除</a> </span>' + '</div>' + '</div>' + '<li class="js_childTreeList" ></li></ul>';

								
							}
							$(dom).html(html);
						}
						typeList.addTypeList();
						typeList.genreadd(); //初始化添加子分类
						typeList.deleterow(); //初始化删除行
						typeList.queryById(); //查询一条数据
					}
					common.base.loading("fadeOut");
				}
			});
		},
		addTypeList: function() {
			$("a.js_pms-folder").unbind("click");
			$("a.js_pms-folder").click(function() {
				var pid = $(this).attr('type_id');
				var dom = $(this).parent().parent().parent().children(".js_childTreeList");
				var sp = $(this).find('span');
				if (sp.hasClass('glyphicon-folder-close')) {
					$(this).parents('.tabletreerow').siblings().show();
					sp.addClass('glyphicon-folder-open').removeClass('glyphicon-folder-close');
					if (dom.find("ul").length == "0") {
						typeList.getTypelist(pid, dom);
					}
				} else if (sp.hasClass('glyphicon-folder-open')) {
					$(this).parents('.tabletreerow').siblings().hide();
					$(this).find('span').addClass('glyphicon-folder-close').removeClass('glyphicon-folder-open');
				}

			});
		},

		getListAll: function() {
			$.ajax({
				url: '${base}/prodType!queryListAll.ajax',
				data: {
					"prodTypeVo.upId": "05",
					"prodTypeVo.status": "open"
				},
				dataType: "json",
				success: function(resultData) {
					if (resultData.code == "success") {
						typeList.types = resultData.data.typeVoList;
						typeList.typeSetlvlstr(); //更新筛选值
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

		typeSetlvlstr: function() {
			var html = '',
			len = typeList.types.length;
			for (var i = 0; i < len; i++) {
				var lvl = typeList.types[i].lvl,
				nbsp = "";
				if (lvl == "3") nbsp = "----";
				if (lvl == "4") nbsp = "--------";
				typeList.types[i]['nbsp'] = nbsp;
			}
		},

		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('deleteId');
				var typeId = $(this).attr('typeId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/prodType!delete.ajax',
								data: {
									"prodTypeVo.id": Id,
									"prodTypeVo.typeId": typeId,
									"prodTypeVo.status": "delete"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										$(".js_pms-tabletree").html('');
										typeList.getTypelist("05", ".js_pms-tabletree");
										typeList.getListAll();
									} else {

}
								}
							});
						} else {
							typeList.addTypeList();
							typeList.genreadd(); //初始化添加子分类
							typeList.deleterow(); //初始化删除行
							typeList.genreedit();
						}
					}
				});
			});
		},
		//添加分类
		genreadd: function() {

			$('.js_genre_add').unbind("click");
			$(".js_genre_add").click(function() {
				$('.js_popUpSubmit').unbind('click');
				$('#genresubmit').unbind('click');
				var upId = $(this).attr('type_id');
				var typeData = [];
				var _templ = Handlebars.compile($("#genreadd-save").html());
				typeData['popUp'] = {
					titleName: '新增分类',
					upId: upId
				};
				typeData['typeList'] = typeList.types;
				$("#genreadd-save-content").html(_templ(typeData));
				common.base.popUp('.js_popUpgenreadd');
				$(".js_popUpSubmit").click(function() {
					typeList.save('', '', '');
				})

				/*
                 common.base.popUp('.js_popUpgenreadd',{
                     type:'form',
                     backFn:function(result){
                         if(result){
                             typeList.save('','','');
                         }
                     }
                 });
                 */
			})

		},

		//编辑分类
		genreedit: function(resultData, upId, id) {
			$('.js_popUpSubmit').unbind('click');

			if (resultData) {
				var typeData = resultData;
				var _templ = Handlebars.compile($("#genreadd-save").html());
				typeData['popUp'] = {
					titleName: '编辑分类',
					upId: upId
				};
				typeData['typeList'] = typeList.types;
				$("#genreadd-save-content").html(_templ(typeData));
				common.base.popUp('.js_popUpgenreadd');
				$(".js_popUpSubmit").click(function() {
					typeList.save(upId, typeData.typeId, id);
				})

				/*
                 common.base.popUp('.js_popUpgenreadd',{
                     type:'form',
                     backFn:function(result){
                         if(result){
                             typeList.save(upId,typeData.typeId,id);
                         }
                     }
                 });
                 */
			}
		},

		//保存
		save: function(upId, typeId, id) {
			if (typeList.isAjaxing) {
				return false;
			}
			typeList.isAjaxing = true;
			var checkResult = true,
			dataPost = {};
			if (!common.validate.checkEmpty('#name', '请输入分类名称！')) {
				checkResult = false;
			}
			if (!checkResult) {
				typeList.isAjaxing = false;
				return false;
			}
			var chooseStr = $(".js_commtext").val().split('_');
			dataPost['prodTypeVo.upId'] = chooseStr[0];
			dataPost['prodTypeVo.lvl'] = parseInt(chooseStr[1]) + 1;
			dataPost['prodTypeVo.name'] = $("#name").val();
			if (chooseStr[0] == upId && upId != '') { // 不用重新计算typeId
				dataPost['prodTypeVo.typeId'] = typeId;
			}
			if (id != '') {
				dataPost['prodTypeVo.id'] = id;
			}
			$.ajax({
				url: '${base}/prodType!save.ajax',
				data: dataPost,
				type: 'post',
				dataType: "json",
				success: function(resultData) {
					typeList.isAjaxing = false;
					if (resultData.data.code == "200") {
						$('.js_popUpgenreadd').fadeOut();
						//新增完成刷新列表
						$(".js_pms-tabletree").html('');
						typeList.getTypelist("05", ".js_pms-tabletree");
						typeList.getListAll();
					} else {
						if (resultData && resultData.data.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.data.description,
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
						}
					}
				},
				error: function(resultData) {
					typeList.isAjaxing = false;
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

		//查询一条记录
		queryById: function() {
			$('.js_popUpSubmit').unbind('click');
			$('.js_genre_edit').unbind("click");
			$(".js_genre_edit").click(function() {
				var id = $(this).attr('editId');
				var upId = $(this).attr('up_id');
				$.ajax({
					url: '${base}/prodType!queryById.ajax',
					data: {
						"prodTypeVo.id": id
					},
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var resultData = resultData.data.prodTypeVo;
							typeList.genreedit(resultData, upId, id);
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
		//与聚赢商场进行同步
		syncJySc:function(){
			$(".js_sync_jysc").click(function(){
				$.ajax({
					url: '${base}/prod!syncJuYingScGood.ajax',
					data: '',
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							common.base.popUp('', {
								type: 'choice',
								tipTitle: '温馨提示',
								//标题
								tipMesg: '同步成功!',
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
							typeList.getTypelist("05", ".js_pms-tabletree");
						} else {
							if (resultData && resultData.description) {
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
			})
		}
	}
	var typeListInit = function() {
		typeList.getTypelist("05", ".js_pms-tabletree");
		typeList.getListAll();
		typeList.syncJySc();
	}
	return {
		init: typeListInit
	};
})