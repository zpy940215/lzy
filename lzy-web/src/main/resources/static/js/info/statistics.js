define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'moment', 'stay'],
function($, common, jqueryui, Handlebars, HandlebarExt, moment, stay) {
	var articleHot = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数
		uid:$("#uid").val(),
		//uid
		isAjaxing: false,
		articleHotList: function() {
			var postData = {};
			postData['pageObject.page'] = articleHot.pageCur;
			postData['pageObject.pagesize'] = articleHot.pageSize;
			postData['articleVo.recommBeginDate'] = $('.js_register_startDate').val();
			postData['articleVo.recommEndDate'] = $('.js_register_endDate').val();
			postData['articleVo.subject'] = $('.js_search_input').val();
			$.ajax({
				url: '${base}/article!queryHotListPage.ajax',
				data: postData,
				dataType: 'json',
				beforeSend: function () {
					common.base.loading("fadeIn");
				},
				success: function (resultData) {
					console.log(resultData);
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#user-list").html());
						$("#user-list-content").html(_templ(resultData.data));
						//分页
						articleHot.pageTotal = resultData.data.pagetotal;
						articleHot.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: articleHot.pageCur,
							pageTotal: articleHot.pageTotal,
							total: articleHot.total,
							backFn: function(p) {
								articleHot.pageCur = p;
								articleHot.articleHotList();
							}
						});
						
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
				},
				error: function () {
					
				}
			});
		},
		exportExcel:function(){
			$('.js_excel_btn').unbind('click');
			$('.js_excel_btn').on('click',function(){
				var postData = {};
				postData['articleVo.recommBeginDate'] = $('.js_register_startDate').val();
				postData['articleVo.recommEndDate'] = $('.js_register_endDate').val();
				postData['articleVo.subject'] = $('.js_search_input').val();
				$.ajax({
					url: '${base}/articleExcel!downloadExcel.ajax',
					data: postData,
					type: 'post',
					dataType: "json",
					success: function(result) {
						if(result.code == "success") {
							var path=$.cookie("articleList");
							window.location.href=path;
						} else {
							alert("导出失败");
						}
					},
					error: function(resultData) {}
				});	
			});
		},
		articleHotDelete: function() {
			//删除
			$(".js_delete_row").unbind("click");
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
							$.ajax({
								url: '${base}/user!changeStatus.ajax',
								data: {
									'userVo.status' : 'close',
									'userVo.id' : Id
								},
								dataType: 'json',
								beforeSend: function () {
									common.base.loading("fadeIn");
								},
								success: function (resultData) {
									common.base.loading("fadeOut");
									if (resultData.code == "success") {
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: '删除成功!',
											//提示语
											backFn: function(result) {
												articleHot.pageCur = 1;
												articleHot.articleHotList();
											}
										});
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
								},
								error: function () {

								}
							});
						}
					}
				});
			});
		},
			
		//列表全选反选
		checkbox: function() {

			$('.js_check_all').unbind("click");
			/*列表全选反选*/
			$(".js_check_all").on('click',
			function() {

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
	var articleHotListInit = function() {
		common.base.DateTimeselect('.js_register_startDate','.js_register_endDate');
		articleHot.exportExcel();
		articleHot.articleHotList();
		$('.js_search').on('click', function () {
			articleHot.pageCur = 1;
			articleHot.articleHotList();
		});
	}
	return {
		init: articleHotListInit
	};
})