define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt'],
function($, common, jqueryui, Handlebars, HandlebarExt) {

	var hotelList = {
		//列表
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数
		areaId: '',
		//筛选地区
		isAjaxing: false,
		getHotelList: function() {

			hotelList.areaId = $('#selectAreaId').val();

			$.ajax({
				url: '${base}/prod!queryListPage.ajax',
				data: {
					"pageObject.page": hotelList.pageCur,
					"pageObject.pagesize": hotelList.pageSize,
					"prodVo.prodTypeId": "01",
					"prodVo.name": $(".js_search_input").val(),
					"prodVo.areaId": hotelList.areaId
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						console.log(resultData.data);
						var _templ = Handlebars.compile($("#prod-list").html());
						$("#prod-list-content").html(_templ(resultData.data));
						//分页
						hotelList.pageTotal = resultData.data.pagetotal;
						hotelList.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: hotelList.pageCur,
							pageTotal: hotelList.pageTotal,
							total: hotelList.total,
							backFn: function(p) {
								hotelList.pageCur = p;
								hotelList.getHotelList();
							}
						});
						hotelList.shelf();
						hotelList.deleterow();
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
		//产品上架与下架
		shelf: function() {
			//线路产品页面上架下架
			$('.js_on_sale').unbind("click");
			$(".js_on_sale").on('click',
			function() {
				var Id = $(this).attr('dataId');
				var thisitem = $(this);
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定上架？',
					//提示语
					backFn: function(result) {
						if (result) {
							thisitem.parents("tr").find(".onsalestadus").html("上架");
							thisitem.html("下架").addClass("js_off_sale").removeClass("js_on_sale");
							if (hotelList.isAjaxing) {
								return false;
							}
							hotelList.isAjaxing = true;
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "open"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										hotelList.isAjaxing = false;
										hotelList.getHotelList();
									} else {

}
								}
							});
						}
					}

				});

			});
			$('.js_off_sale').unbind("click");
			$(".js_off_sale").on('click',
			function() {
				var thisitem = $(this);
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定下架？',
					//提示语
					backFn: function(result) {
						if (result) {
							thisitem.parents("tr").find(".onsalestadus").html('<span class="style1">下架</span>');
							thisitem.html("上架").addClass("js_on_sale").removeClass("js_off_sale");
							if (hotelList.isAjaxing) {
								return false;
							}
							hotelList.isAjaxing = true;
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "close"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										hotelList.isAjaxing = false;
										hotelList.getHotelList();
									} else {

}
								}
							});
						}
					}
				});
			})
		},
		//删除行
		deleterow: function() {
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
							if (hotelList.isAjaxing) {
								return false;
							}
							hotelList.isAjaxing = true;
							$.ajax({
								url: '${base}/prod!changeStatus.ajax',
								data: {
									"prodVo.id": Id,
									"prodVo.status": "delete"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										hotelList.isAjaxing = false;
										hotelList.getHotelList();
									} else {

}
								}
							});
						}
					}
				});
			});
		},
	}

	//地区列表
	var hotelListInit = function() {
		hotelList.getHotelList();
		//搜索
		$('.js_searchbtn').click(function() {
			hotelList.pageCur = 1;
			hotelList.getHotelList();
		});
	}
	return {
		init: hotelListInit
	};
})