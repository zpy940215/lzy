define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'ztree', 'diyUpload', 'base64'],
function($, common, jqueryui, Handlebars, HandlebarExt, ztree, diyUpload, base64) {

	/*var deleteUrl = "";
	var pageObjectPage = "";
	var pageObjectPageSize ="";
	var voId = ""; */
	var recycle = {
		//每页显示数量
		pageSize: 10,
		//总页数
		pageTotal: 1,
		//当前页
		pageCur: 1,
		//总数
		total: 1,
		
		//删除url
		deleteUrl:'',
		//恢复url
		resourceUrl:'',
		//listUrl
		listUrl:'',
		//列表显示面
		dom:'',
		
		
		
		recycleList: function(dataGet) {
			$.ajax({
				
				data:dataGet,
				url: recycle.listUrl,
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						//加载数据的处理
						var _templ = Handlebars.compile($(recycle.dom).html());
						$("#resource-list").html(_templ(resultData.data));
						//分页
						recycle.pageTotal = resultData.data.pagetotal;
						recycle.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: recycle.pageCur,
							pageTotal: recycle.pageTotal,
							total: recycle.total,
							backFn: function(p) {
								recycle.pageCur = p;
								if($(".js_position").val()=="view"){
									var dataGet={"viewPageObject.page" :recycle.pageCur,
											 "viewPageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
								}else if($(".js_position").val()=="article"){
									var dataGet={"articlePageObject.page" :recycle.pageCur,
											 "articlePageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
								}else if($(".js_position").val()=="article"){
									 var dataGet={"resourcePageObject.page" :recycle.pageCur,
											 "resourcePageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
						    	 }else if($(".js_position").val()=="prod"){
									 var dataGet={"prodPageObject.page" :recycle.pageCur,
											 "prodPageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
						    	 }
							}
						});
						recycle.checkbox();
						recycle.deleterow(); //初始化删除事件
						recycle.batchdelete();//初始化批量删除
						recycle.recoveryrow();//初始化恢复事件
						recycle.batchrecovery();//初始化批量恢复
						
					} else {
						if (resultData && resultData.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'choice',
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
		checkbox: function() {
			$('.js_check_all').unbind("click");
			//列表全选反选
			$('table').on('click', '.js_check_all',
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

		//恢复行
		recoveryrow: function() {
			$('.js_recovery_row').unbind("click");
			$('.js_recovery_row').on('click',
			function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定恢复？',
					//提示语
					backFn: function(result) {
						if (result) {
							recycle.resourceRecovery(Id);
						}
					}
				});
			})
		},
		//js_banch_recovery
		resourceRecovery: function(Id) {
			$.ajax({
				url: recycle.resourceUrl,
				data: {
					"voId": Id
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '恢复成功!',
							//提示语
							backFn: function(result) { 
								if($(".js_position").val()=="view"){
									var dataGet={"viewPageObject.page" :recycle.pageCur,
											 "viewPageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
								}else if($(".js_position").val()=="article"){
									 var dataGet={"articlePageObject.page" :recycle.pageCur,
											 "articlePageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
								}else if($(".js_position").val()=="resource"){
									 var dataGet={"resourcePageObject.page" :recycle.pageCur,
											 "resourcePageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
						    	 }else if($(".js_position").val()=="prod"){
									 var dataGet={"prodPageObject.page" :recycle.pageCur,
											 "prodPageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
						    	 }
							}
						});
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
								}
							});
						}
					}
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
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
		
		//批量恢复
		batchrecovery: function() {
			$('.js_banch_recovery').unbind("click");
			$(document).on('click', '.js_banch_recovery',
			function() {
				// $('.js_banch_delete').click(function(){
				var rowchecked = $(".js_check_row:checked");
				if (rowchecked.length == '0') {
					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '请选择要恢复的行'
						//提示语
					});
				} else {
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '确认恢复？',
						//提示语
						backFn: function(result) {
							if (result) {
								var idArray = new Array();
								for (var i = 0; i < rowchecked.length; i++) {
									var rowcheckedTemp = rowchecked[i];
									var idTemp = rowcheckedTemp.getAttribute("dataId");
									idArray.push(idTemp);
								}
								var Id = idArray.join("|");
								recycle.resourceRecovery(Id);
								rowchecked.parents('tr').remove();
							}

						}
					});
				}

			})
		},
		
		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$('.js_delete_row').on('click',
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
							recycle.resourceDelete(Id);
						}

					}
				});

			});

		},
		//批量选择删除
		batchdelete: function() {
			$('.js_banch_delete').unbind("click");
			$(document).on('click', '.js_banch_delete',
			function() {
				// $('.js_banch_delete').click(function(){
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
						tipMesg: '确认删除，删除后将无法恢复？',
						//提示语
						backFn: function(result) {
							if (result) {
								var idArray = new Array();
								for (var i = 0; i < rowchecked.length; i++) {
									var rowcheckedTemp = rowchecked[i];
									var idTemp = rowcheckedTemp.getAttribute("dataId");
									idArray.push(idTemp);
								}
								var Id = idArray.join("|");
								recycle.resourceDelete(Id);
								rowchecked.parents('tr').remove();
							}

						}
					});
				}

			})
		},
		
		resourceDelete: function(Id) {
			var a =recycle.deleteUrl;
			var keyword = $(".search_input").val();
			$.ajax({
				url: a,
				data: {
					"voId": Id
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '删除成功!',
							//提示语
							backFn: function(result) { 
								if($(".js_position").val()=="view"){
									var dataGet={"viewPageObject.page" :recycle.pageCur,
											 "viewPageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
								}else if($(".js_position").val()=="article"){
									 var dataGet={"articlePageObject.page" :recycle.pageCur,
											 "articlePageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
								}else if($(".js_position").val()=="resource"){
									 var dataGet={"resourcePageObject.page" :recycle.pageCur,
											 "resourcePageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
						    	 }else if($(".js_position").val()=="prod"){
									 var dataGet={"prodPageObject.page" :recycle.pageCur,
											 "prodPageObject.pagesize":recycle.pageSize};
						    		 recycle.recycleList(dataGet);
						    	 }
							}
						});
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
								}
							});
						}
					}
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
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

		//搜索
		inputSearch: function() {
			$('#do_search').click(function() {
				 if($(".js_position").val()=="view"){
					 recycle.deleteUrl="${base}/recycle!thoroughDeleteView.ajax";//删除url
					 recycle.resourceUrl="${base}/recycle!recoveryView.ajax";//恢复url
					 recycle.listUrl='${base}/recycle!queryViewCloseListPage.ajax';//listUrl
					 recycle.dom="#recycle-list-view";//列表显示面
					 var dataGet={"viewPageObject.page" :recycle.pageCur,
							 "viewPageObject.pagesize":recycle.pageSize};
		    		 recycle.recycleList(dataGet);
		    	 }else if($(".js_position").val()=="article"){
		    		 recycle.deleteUrl="${base}/recycle!thoroughDeleteArticle.ajax";//删除url
					 recycle.resourceUrl="${base}/recycle!recoveryArticle.ajax";//恢复url
					 recycle.listUrl='${base}/recycle!queryArticleCloseListPage.ajax';//listUrl
					 recycle.dom="#recycle-list-article";//列表显示面
					 var dataGet={"articlePageObject.page" :recycle.pageCur,
							 "articlePageObject.pagesize":recycle.pageSize};
		    		 recycle.recycleList(dataGet);
		    	 }else if($(".js_position").val()=="resource"){
		    		 recycle.deleteUrl="${base}/recycle!thoroughDeleteResource.ajax";//删除url
					 recycle.resourceUrl="${base}/recycle!recoveryResource.ajax";//恢复url
					 recycle.listUrl='${base}/recycle!queryResourceCloseListPage.ajax';//listUrl
					 recycle.dom="#recycle-list-resource";//列表显示面
					 var dataGet={"resourcePageObject.page" :recycle.pageCur,
							 "resourcePageObject.pagesize":recycle.pageSize};
		    		 recycle.recycleList(dataGet);
		    	 }else if($(".js_position").val()=="prod"){
		    		 recycle.deleteUrl="${base}/recycle!thoroughDeleteProd.ajax";//删除url
					 recycle.resourceUrl="${base}/recycle!recoveryProd.ajax";//恢复url
					 recycle.listUrl='${base}/recycle!queryProdCloseListPage.ajax';//listUrl
					 recycle.dom="#recycle-list-prod";//列表显示面
					 var dataGet={"prodPageObject.page" :recycle.pageCur,
							 "prodPageObject.pagesize":recycle.pageSize};
		    		 recycle.recycleList(dataGet);
		    	 }
			})
		},
		
	}
	var picListInit = function() {
		/*recycle.recycleType();
		recycle.batchdelete();*/
		recycle.inputSearch();

	}
	return {
		init: picListInit
	};
});