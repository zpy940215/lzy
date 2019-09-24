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
		categoryId: "",
		specialId:"",
		dataList: null,
		linkArticles: function() {
			if (article.isAjaxing) return false;
			article.isAjaxing = true;
			$.ajax({
				url: '${base}/special!queryArticles.ajax',
				data: {
					'specialVo.specialId': article.specialId
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						console.log(resultData.data);
						article.dataList = resultData.data.specialArticleVos;
						//加载数据的处理
						var _templ = Handlebars.compile($("#article-list").html());
						$("#article-list-content").html(_templ(resultData.data));
						article.deleteArticle(); 
						article.queryLink();
						article.editPos();
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
		editPos:function() {
			$('.js_pos').blur(function() {
				var pos = $(this).val();
				var id = $(this).attr('vitulId');
				if (article.isAjaxing) return false;
				article.isAjaxing = true;
				$.ajax({
					async: false,
					cache: false,
					type: 'POST',
					dataType: "json",
					url: '${base}/special!editLinkArticlePos.ajax',
					data: {
						'specialArticleVo.id': id,
						'specialArticleVo.pos': pos
					},
					success: function(resultData) {
						if (resultData.code == "success") {
							article.isAjaxing = false;
							article.linkArticles();
						}
					}
				});
			});
		},
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		
		//移除关联文章
		deleteArticle:function() {
			$('.js_delete_link').unbind('click');
			$('.js_delete_link').on('click',function() {
				var specialId = $(this).attr('specialId');
				var articleId = $(this).attr('articleId');
				if (article.isAjaxing) return false;
				article.isAjaxing = true;
				$.ajax({
					async: false,
					cache: false,
					type: 'POST',
					dataType: "json",
					url: '${base}/special!deleteLinkArticle.ajax',
					data: {
						'specialArticleVo.specialId': specialId,
						'specialArticleVo.articleId': articleId
					},
					success: function(resultData) {
						if (resultData.code == "success") {
							article.isAjaxing = false;
							article.linkArticles();
						}
					}
				});
			});
		},
		
		//查询关联文章
		queryLink:function() {
			$('.js_genre_add').on('click',function() {
				var _templ = Handlebars.compile($("#genreadd-save").html());
				$("#genreadd-save-content").html(_templ());
				common.base.popUp('.js_popUpgenreadd');
				article.articles();
				if (!article.getQueryString("categoryId")) {
					article.ztreeSite();
				}
				article.linkSave();
			});
		},
		//保存关联文章
		linkSave:function() {
			$('.js_linkSubmit').unbind('click');
			$('.js_linkSubmit').on('click',function() {
				var dataget=new Object();
				dataget['specialVo.specialId']=article.specialId;
				var rowchecked = $(".js_check_row:checked");
				rowchecked.each(function(i) {
					var articleId = $(this).attr('articleId');
					dataget['specialArticleVos['+i+'].articleId']=articleId;
					dataget['specialArticleVos['+i+'].specialId']=article.specialId;
					dataget['specialArticleVos['+i+'].pos']=$(this).parents('tr').find('.js_pos').val();
				});
				if (article.isAjaxing) return false;
				article.isAjaxing = true;
				$.ajax({
					async: false,
					cache: false,
					type: 'POST',
					dataType: "json",
					url: '${base}/special!linkArticles.ajax',
					data: dataget,
					success: function(resultData) {
						if (resultData.code == "success") {
							article.isAjaxing = false;
							article.linkArticles();
							$('.js_popUpgenreadd').fadeOut();
						}
					}
				});
			});
			
		},
		//查询文章列表
		articles:function() {
			var postData = {};
			postData['pageObject.page'] = 1;
			postData['pageObject.pagesize'] = 300;
			postData['articleVo.categoryIds'] = article.categoryId;

			$.ajax({
				url: '${base}/article!queryListPage.ajax',
				data: postData,
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						//加载数据的处理
						var _templ = Handlebars.compile($("#articles").html());
						$("#articles-content").html(_templ(resultData.data));
						$('#articles-content').find("tr").each(function(){
					        var articleId = $(this).attr('articleId');
					        for (var i = 0; i < article.dataList.length; i ++) {
					        		if (article.dataList[i].articleId == articleId) {
					        			var html = '<td >已关联</td>' +
					        					   '<td >'+article.dataList[i].articleName+'</td>' +
					        					   '<td >'+article.dataList[i].pos+'</td>';
					        			$(this).html(html);
					        		}
					        }
					    });
					} 
				}
			});
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
		article.specialId = article.getQueryString("specialId");
		article.categoryId = article.getQueryString("categoryId");
		article.linkArticles();
	}
	return {
		init: articleListInit
	};

})