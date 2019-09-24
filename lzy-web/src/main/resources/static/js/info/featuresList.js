define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'ztree'],
function($, common, jqueryui, Handlebars, HandlebarExt, ztree) {
	var article = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数
		isAjaxing: false,
		siteId: "",
		categoryId: "",
		dataList: null,
		//新增
		addArticle: function() {
			$('.js_addArticleBtn').on('click',
			function() {
				$(this).attr('href', 'edit.html?siteId=' + article.siteId + '&categoryId=' + article.categoryId);
			})
		},
		articleList: function() {
			if (article.isAjaxing) return false;
			article.isAjaxing = true;
			var keyword = $(".search_input").val();
			var checked_statu = $("#ispush").find("option:checked").attr("value");
			var isRecomment = $("#isrecommend").find("option:checked").attr("value");
			var postData = {};
			postData['pageObject.page'] = article.pageCur;
			postData['pageObject.pagesize'] = article.pageSize;
			postData['specialVo.subject'] = keyword;
			if (checked_statu) {
				postData['specialVo.status'] = checked_statu;
			}
			if (isRecomment) {
				postData['specialVo.isRecommend'] = isRecomment;
			}
			if ($("#category").val()) {
				postData['specialVo.categoryIds'] = $("#category").val();
			}

			$.ajax({
				url: '${base}/special!queryListPage.ajax',
				data: postData,
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						console.log(resultData.data);
						//加载数据的处理
						var _templ = Handlebars.compile($("#article-list").html());
						$("#article-list-content").html(_templ(resultData.data));

						//分页
						article.pageTotal = resultData.data.pagetotal;
						article.total = resultData.data.total;
						article.dataList = resultData.data.dataList;
						common.base.createPage('.pageDiv', {
							pageCur: article.pageCur,
							pageTotal: article.pageTotal,
							total: article.total,
							backFn: function(p) {
								article.pageCur = p;
								article.articleList();
							}
						});
						article.addArticle();
						article.deleterow(); //初始化删除事件
						article.batchrowdelete();
						article.checkbox(); //初始化全选事件
						article.Recommend(); //初始化是否推荐事件
						article.sortchange();
						article.sortable();
//						article.queryLink();

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
					article.isAjaxing = false;
				},
				error: function(resultData) {
					article.isAjaxing = false;
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
		articleSave: function(id, isRecomment) {
			if (article.isAjaxing) return false;
			article.isAjaxing = true;
			if (!id) {
				article.isAjaxing = false;
				return false;
			}
			$.ajax({
				type: "post",
				url: "${base}/special!save.ajax",
				data: {
					'specialVo.id': id,
					"specialVo.isRecommend": isRecomment,
				},
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				dataType: "json",
				success: function(resultMap) {
					article.isAjaxing = true;
					common.base.loading("fadeOut");
					if (resultMap.code == "success") {
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '保存成功!',
							//提示语
							backFn: function(result) {
								if (result) {
									// window.location.href='${base}/info/list.html';
									article.articleList();
								}
							}
						});
					} else {
						if (resultMap && resultMap.description) {
							alert(resultMap.description);
						} else if (resultMap && typeof(resultMap) == 'string') {
							alert(resultMap);
						} else {
							alert("出错了,请重试!");
						}
					}
				},
				error: function(e) {
					article.isAjaxing = true;
					common.base.loading("fadeOut");
				}
			});
		},
		articleDoDelete: function(Id, status) {
			if (article.isAjaxing) return false;
			article.isAjaxing = true;
			if (!Id) {
				article.isAjaxing = false;
				return false;
			}
			$.ajax({
				url: '${base}/special!changeStatus.ajax',
				data: {
					'specialVo.id': Id,
					'specialVo.status': status
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
						switch (status) {
						case "delete":
							tipMesg = "删除成功!";
							break;
						case "open":
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
								article.articleList();
							}
						});
						//删除完成刷新当前列表
						article.articleList();
						article.inputSerch();
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
					article.isAjaxing = false;
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
		//删除行
		deleterow: function() {
			$('.info_row_delete').unbind("click");
			$(".info_row_delete").click(function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除选中数据？',
					//提示语
					backFn: function(result) {
						if (result) {
							article.articleDoDelete(Id, "delete");
						}
					}
				});
			});
		},
		//批量选择删除
		batchrowdelete: function() {
			$('.js_bance_delete').on('click',
			function() {
				var rowchecked = $(".js_check_row:checked");
				if (rowchecked.length == '0') {

					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '请选择要删除的行' //提示语
					});
				} else {
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '是否删除选定文章？',
						//提示语
						backFn: function(result) {
							if (result) {
								rowchecked.parents('tr').remove();
								rowchecked.each(function() {
									var thisid = $(this).parents("tr").find(".id").val();
									var status = "delete";
									article.articleDoDelete(thisid, status);
								})
							}
						}
					});
				}
			})
		},
		sortable: function() {
			var fixHelper = function(e, ui) {
				ui.children().each(function() {
					$(this).width($(this).width()); //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了
				});
				return ui;
			};
			$(function() {
				$("#sortable ").sortable({ //这里是talbe tbody，绑定 了sortable
					helper: fixHelper,
					//调用fixHelper
					axis: "y",
					stop: function(event, ui) {

						var startItem = ui.item;
						var offsetIndex = Math.round(( - ui.originalPosition.top + ui.position.top) / (startItem.height() / 10));
						var startIndex = startItem.attr('dIndex');
						var endIndex = parseInt(startIndex) + parseInt(offsetIndex);

						var dataList = article.dataList;

						if (endIndex < 0) {
							endIndex = 0;
						}
						if (endIndex > dataList.length - 1) {
							endIndex = dataList.length - 1;
						}
						// alert("st="+startIndex+",end="+endIndex);
						var specialVo = dataList[startIndex];
						var changeVo = dataList[endIndex];
						if (changeVo.pos == null || isNaN(changeVo.pos)) {
							changeVo.pos = '0';
						}
						if (parseInt(offsetIndex) < 0) {
							specialVo['pos'] = parseInt(changeVo.pos) + 1;
						} else {
							specialVo['pos'] = parseInt(changeVo.pos) - 1;
						}
						var data = {};
						data['specialVo.id'] = specialVo.id;
						data['specialVo.pos'] = specialVo.pos;
						data['specialVo.articleId'] = specialVo.articleId;
						$.ajax({
							async: false,
							cache: false,
							type: 'POST',
							dataType: "json",
							url: '${base}/special!editPos.ajax',
							data: data,
							success: function(result) {
								if ('success' == result.code && result.data.success == true) { //成功
									article.articleList();
								} else {
									alert("排序失败，请稍后再试...");
								}
							}
						});
					}
				}).disableSelection();

			})
		},

		sortchange: function() {
			$('.jspos').blur(function() {
				// alert("hello");
				// alert("hello"+$(this).id);
				var specialId = $(this).attr('specialId');
				var pos = $(this).attr('pos');
				var value = $(this).val();
				var vitulId = $(this).attr('vitulId');
				var data = {};
				if (pos != value) {
					data['specialVo.specialId'] = specialId;
					data['specialVo.pos'] = value;
					data['specialVo.id'] = vitulId;
					$.ajax({
						async: false,
						cache: false,
						type: 'POST',
						dataType: "json",
						url: '${base}/special!editPos.ajax',
						data: data,
						success: function(result) {
							// alert(JSON.stringify(result));
							if ('success' == result.code && result.data.success == true) { //成功
								article.articleList();
							} else {
								alert("排序失败，请稍后再试...");
							}
						}
					});
				}
			});
		},
		inputSerch: function() {
			//搜索
			$('#do_search').click(function() {
				article.pageCur = 1;
				article.articleList();
			})
		},
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		
		//是否推荐
		Recommend: function() {
			$(".js_Recommend").on("click",
			function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '确定要推荐么？',
					//提示语
					backFn: function(result) {
						if (result) {
							//
							article.articleSave(Id, "Y");
						}
					}
				});
			});
			$(".js_NoRecommend").on("click",
			function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '确定要取消推荐么？',
					//提示语
					backFn: function(result) {
						if (result) {
							//
							article.articleSave(Id, "N");
						}
					}
				});
			})
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
		},
		ztreeSite: function() {
			var setting = {
				data: {
					key: {
						name: "name"
					},
					simpleData: {
						idKey: "categoryId",
						pIdKey: "siteId",
						enable: true
					}
				},
				callback: {
					onClick: zTreeOnClick
				}

			};
			var zNodes;

			$(function() {
				$.ajax({
					async: false,
					cache: false,
					type: 'POST',
					dataType: "json",
					url: '${base}/site!queryListAll.ajax',
					data: {
						'siteVo.dataType': "article"
					},
					success: function(data) {
						console.log(data);
						zNodes = data.data.allList;
						var html = '<option value="">请选择</option>';
						for (var i = 0; i < zNodes.length - 1; i ++) {
							html += '<option value="'+zNodes[i].categoryId+'">'+zNodes[i].name+'</option>';
						}
						$('#category').html(html);
					}
				});
			})

			$(document).ready(function() {
				$.fn.zTree.init($("#themetreeDemo"), setting, zNodes);
			});

			function zTreeOnClick(event, treeId, treeNode) {
				if (treeNode.categoryId != 1) {
					
					article.categoryId = treeNode.newcategoryId;
					article.siteId = treeNode.currentSiteId;
					
					//查询对应栏目文章			
					article.articles();
				} else {
					article.siteId = "";
					article.categoryId = "";
				}

			}

		}

	}

	var articleListInit = function() {
		 Handlebars.registerHelper('ifCond',function(v1 , v2 ,options){
		        if(v1 == v2){
		            return options.fn(this);
		        }
		        return options.inverse(this);
		    });
		
		var categoryId = article.getQueryString("specialVo.categoryId");
		if (categoryId != '') {
			article.categoryId = categoryId;
		}
		article.articleList();
		//			article.articleexamine();
		article.ztreeSite();
		article.deleterow();
		//			article.publishtheme();
		article.inputSerch();

		//列表批量发布
		$(document).on('click', '#publish',
		function() {
			var rowchecked = $(".checkbox:checked");
			if (rowchecked.length == '0') {
				common.base.popUp('', {
					type: 'tip',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '请选择需要发布的数据！',
					//提示语
					backFn: function(result) {
						//alert(result);
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
							//			                          
							rowchecked.each(function() {
								var thisid = $(this).parents("tr").find(".id").val();
								var status = "open";
								article.articleDoDelete(thisid, status);
							})
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
					tipMesg: '请选定要取消发布的数据！',
					//提示语
					backFn: function(result) {
						//alert(result);
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
							//			                          
							rowchecked.each(function() {
								var thisid = $(this).parents("tr").find(".id").val();
								var status = "canclefinish";
								article.articleDoDelete(thisid, status);
							})
						}

					}
				});

			}

		})

	}
	return {
		init: articleListInit
	};

})