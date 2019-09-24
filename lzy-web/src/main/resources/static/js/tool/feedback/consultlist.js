define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var base64 =new common.base.Base64();
	var complain = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数
		isAjaxing: false,
		consultlist: function() {
			if (complain.isAjaxing) return false;
			complain.isAjaxing = true;
			$.ajax({
				url: '${base}/complain!queryListPage.ajax',
				data: {
					"pageObject.page": complain.pageCur,
					"pageObject.pagesize": complain.pageSize,
					"complainVo.uname": $("#js_name").val(),
//					"complainVo.status":"finish"
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						Handlebars.registerHelper({
							"decodeName":function(name) {
								return base64.decode(name);
							}
						})
						//加载数据的处理
						var _templ = Handlebars.compile($("#complain-list").html());
						$("#complain-list-content").html(_templ(resultData.data));
						//分页
						complain.pageTotal = resultData.data.pagetotal;
						complain.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: complain.pageCur,
							pageTotal: complain.pageTotal,
							total: complain.total,
							backFn: function(p) {
								complain.pageCur = p;
								complain.consultlist();
							}
						});
						complain.complainDelete(); //初始化删除事件
						complain.words(); //初始化处理事件
						complain.looks(); //初始化查看回复事件
						complain.checkbox(); //初始化全选反选
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
					complain.isAjaxing = false;
					
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
					complain.isAjaxing = false;
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

		queryByComplainId: function(Id, complainId) {
			var returnData;
			$.ajax({
				url: '${base}/complain!queryByComplainId.ajax',
				data: {
					'complainVo.id': Id,
					'complainVo.complainId': complainId
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
					complain.isAjaxing = false;
				},
				error: function(resultData) {
					complain.isAjaxing = false;
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

		//删除行
		complainDelete: function() {
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
							complain.complainDoDelete(Id);
						}
					}
				});
			});
		},
		//批量选择删除
		batchrowdelete: function() {
			$('.js_banch_delete').unbind("click");
			$('.js_banch_delete').click(function() {
				var rowchecked = $(".js_check_row:checked");
				if (rowchecked.length == '0') {

					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '请选择要删除的行'
						//提示语
					});
				} else {
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '是否删除选定行？',
						//提示语
						backFn: function(result) {
							if (result) {
								rowchecked.parents('tr').remove();
							}
						}
					});
				}
			})
		},
		complainDoDelete: function(Id) {
			if (complain.isAjaxing) return false;
			complain.isAjaxing = true;
			if (!Id) {
				complain.isAjaxing = false;
				return false;
			}
			$.ajax({
				url: '${base}/complain!delete.ajax',
				data: {
					'complainVo.id': Id
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					complain.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '删除成功!',
							//提示语
							backFn: function(result) {
								complain.consultlist();
							}
						});
						//删除完成刷新当前列表
						complain.consultlist();
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
					common.base.loading("fadeOut");
					complain.isAjaxing = false;
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
		save: function(Id) {
			// if (complain.isAjaxing) return false;
			complain.isAjaxing = true;
			//dataPost['complainVo.reply'] = common.validate.trim($('#complain.reply').val());
			var reply = $("#reply").val();
			$.ajax({
				url: '${base}/complain!save.ajax',
				type: 'post',
				data: {
					'complainVo.reply': reply,
					'complainVo.id': Id,
					'complainVo.status': 'finish'
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					complain.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = '信息提交成功！';
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
						$('.js_popUpconsults').fadeOut();
						//新增完成刷新列表
						complain.pageCur = 1;
						complain.consultlist();
					}
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
					complain.isAjaxing = false;
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
		words: function() {
			$('.js_consult_handle').unbind("click");
			$('.js_consult_handle').click(function() {
				var Id = $(this).attr('dataId');
				var complainId = $(this).attr('complainId');
				var complainData = complain.queryByComplainId(Id, complainId);
				if (complainData.code == "success") {
					var _templ = Handlebars.compile($("#consult-save").html());
					complainData['data']['popUp'] = {
						titleName: '正在处理'
					};
					$("#consult-save-content").html(_templ(complainData.data));
					common.base.popUp('.js_popUpconsults', {
						type: 'form',
						backFn: function(result) {
							if (result) {
								complain.save(Id);
							}
						}
					});
				}
			});
		},
		looks: function() {
			$('.js_consult_look').unbind("click");
			$('.js_consult_look').click(function() {
				var Id = $(this).attr('dataId');
				var complainId = $(this).attr('complainId');
				var complainData = complain.queryByComplainId(Id, complainId);
				if (complainData.code == "success") {
					var _templ = Handlebars.compile($("#consult-save").html());
					complainData['data']['popUp'] = {
						titleName: '正在处理'
					};
					$("#consult-save-content").html(_templ(complainData.data));
					common.base.popUp('.js_popUpconsults', {
						type: 'form',
						backFn: function(result) {
							if (result) {
								complain.save(Id);
							}
						}
					});
				}
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
		}

	}
	/**
      * 立即加载查询方法
      */
	var consultlistInit = function() {
		complain.consultlist();
		complain.complainDelete();
		complain.batchrowdelete();
		complain.words();
		//搜索
		$('#js_doSearch').click(function() {
			complain.pageCur = 1;
			complain.consultlist();
		});
	}
	return {
		init: consultlistInit
	};
});