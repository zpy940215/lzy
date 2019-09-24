define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'moment', 'stay'],
function($, common, jqueryui, Handlebars, HandlebarExt, moment, stay) {
	var data = {};
	var order = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		dataList: null,
		status: null,
		
		
		orderList:function(){
			data['pageObject.page'] = order.pageCur;
			data['pageObject.pagesize'] = order.pageSize;
			data['payLogVo.channelId']=$(".js_select_channelId").find("option:checked").attr("value");
			data['payLogVo.startDate'] = $(".js_order_startDate").val()+" 00:00:00";
			data['payLogVo.endDate'] = $(".js_order_endDate").val()+" 23:59:59";
			
			$.ajax({
				url: '${base}/paylog!queryPageList.ajax',
				data: data,
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						
						//加载数据的处理
						var _templ = Handlebars.compile($("#order-list").html());
						order.dataList = resultData.data.data.dataList;
						
						

						$("#order-list-content").html(_templ(resultData.data.data));
						
						//分页
						order.pageTotal = resultData.data.data.pagetotal;
						order.total = resultData.data.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: order.pageCur,
							pageTotal: order.pageTotal,
							total: order.total,
							backFn: function(p) {
								order.pageCur = p;
								order.orderList();
								

							}
						});
						order.exportExcel();
						order.searchKeyword();
						order.orderTotal();
						
						
					} else {}
					
				},
				error: function(resultData) {}
			});	
		},
		orderTotal:function(){
			data['pageObject.page'] = order.pageCur;
			data['pageObject.pagesize'] = order.total;
			data['payLogVo.channelId']=$(".js_select_channelId").find("option:checked").attr("value");
			data['payLogVo.startDate'] = $(".js_order_startDate").val()+" 00:00:00";
			data['payLogVo.endDate'] = $(".js_order_endDate").val()+" 23:59:59";
			
			$.ajax({
				url: '${base}/paylog!count.ajax',
				data: data,
				type: 'post',
				dataType: "json",
				
				success: function(resultData) {
					if (resultData.code == "success") {
						$(".js_totalPrice").html("营业汇总：￥"+resultData.data.totalPrice);
						$(".js_totalPriceIn").html(" 收入：￥"+resultData.data.totalPriceIn);
						$(".js_totalPriceOut").html(" 支出：￥"+resultData.data.totalPriceOut);
						
						
						
						
					} else {}
					
				},
				error: function(resultData) {}
			});	
		},
		
		
		searchKeyword:function(){
			$('.js_select_btn').unbind('click');
			$('.js_select_btn').on('click',function(){
				data['payLogVo.startDate'] = $(".js_order_startDate").val()+" 00:00:00";
				data['payLogVo.endDate'] = $(".js_order_endDate").val()+" 23:59:59";
				data['keywords'] = $(".js_value_keywords").val();
				data['payLogVo.channelId']=$(".js_select_channelId").find("option:checked").attr("value");
				order.pageCur = 1;
				order.orderList();
				
			})
		},
		
		exportExcel:function(){
			$('.js_excel_btn').unbind('click');
			$('.js_excel_btn').on('click',function(){
				data['payLogVo.startDate'] = $(".js_order_startDate").val()+" 00:00:00";
				data['payLogVo.endDate'] = $(".js_order_endDate").val()+" 23:59:59";
				data['keywords'] = $(".js_value_keywords").val();	
				data['pageObject.page'] = order.pageCur;
				data['pageObject.pagesize'] = order.total;
				data['payLogVo.channelId']=$(".js_select_channelId").find("option:checked").attr("value");
				$.ajax({
					url: '${base}/paylog!download.ajax',
					data: data,
					type: 'post',
					dataType: "json",
					success: function(result) {
						if(result.code == "success") {
							window.location.href=result.data;
						} else {
							alert("导出失败");
						}
					},
					error: function(resultData) {}
				});	
			});
		},
		DateTimeselect:function(startdate,enddate){
			$(startdate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true,
				onClose:function(selectedDate){
					$(".js_select_date").removeClass("active");
                	$(this).siblings(enddate).datepicker("option", "minDate", selectedDate);     
				} 	               
		   	});
		   	$(enddate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true,
				onClose:function(selectedDate){
					$(".js_select_date").removeClass("active");  
				} 
				             
		   	});

		}
	}
	var orderListInit = function() {
		$(".js_select_date[dataValue=30]").addClass("active");
		var today = common.datatime.today("-");
		var monthago = common.datatime.monthago("-");
		$(".js_order_startDate").val(monthago);
		$(".js_order_endDate").val(today);
		order.DateTimeselect('.js_order_startDate','.js_order_endDate');
		
		order.orderList();		
		
	}
	return {
		init: orderListInit
	};
})