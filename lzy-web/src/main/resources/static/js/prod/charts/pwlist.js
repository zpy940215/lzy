define(['jquery','common','jqueryui','Handlebars','moment'], 
function($,common,jqueryui,Handlebars,moment){

	var order = {
		dataList:function() {
			order.salesDataList();
			order.salesChannelDataList();
			order.search();
		},
		salesDataList:function() {
			var start_date = $(".js_start_Date").val();
			var end_date = $(".js_end_Date").val();
			//var order_type = $(".js_value_type").val();
			$.ajax({
				url: '${base}/orderSource!queryListByDate.ajax',
				data: {
					"orderSourceVo.bizType":"piaowu",
					"orderSourceVo.startDate":start_date,
					"orderSourceVo.endDate":end_date
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(result) {
					common.base.loading("fadeOut");
					if (result.code == "success") {
						Handlebars.registerHelper({
							"compare":function(type,options){
								if(type != "jiudian") {
									return options.fn(this);
								} else {
									return options.inverse(this);
								}
							},
							"formatTime":function(timestamp) {
								var format = 'YYYY-MM-DD';  
						        if(arguments.length > 2){  
						            format = arguments[1];  
						        }  
						        if(timestamp != null){  
						            return moment(new Date(timestamp)).format(format);  
						        } else {
						        	return "";
						        }
							},
						});
						var _templ = Handlebars.compile($("#sales-order-list").html());
						$(".js-sales").html(_templ(result.data));
						//分页
						/*order.pageTotal = result.data.pagetotal;
						order.total = result.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: order.pageCur,
							pageTotal: order.pageTotal,
							total: order.total,
							backFn: function(p) {
								order.pageCur = p;
								order.orderList();
							}
						});*/
					} else {}
					
				},
				error: function(resultData) {}
			});
		},
		salesChannelDataList:function() {
			var start_date = $(".js_start_Date").val();
			var end_date = $(".js_end_Date").val();
			//var order_type = $(".js_value_type").val();
			$.ajax({
				url: '${base}/orderSource!queryListByDate.ajax',
				data: {
					"orderSourceVo.bizType":"piaowu",
					"orderSourceVo.startDate":start_date,
					"orderSourceVo.endDate":end_date,
					"orderSourceVo.sourceId":"sourceId"
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(result) {
					common.base.loading("fadeOut");
					if (result.code == "success") {
						Handlebars.registerHelper({
							"compare":function(type,options){
								if(type != "jiudian") {
									return options.fn(this);
								} else {
									return options.inverse(this);
								}
							},
							"formatTime":function(timestamp) {
								var format = 'YYYY-MM-DD';  
						        if(arguments.length > 2){  
						            format = arguments[1];  
						        }  
						        if(timestamp != null){  
						            return moment(new Date(timestamp)).format(format);  
						        } else {
						        	return "";
						        }
							},
						});
						var _templ = Handlebars.compile($("#salesChannel-order-list").html());
						$(".js-salesChannel").html(_templ(result.data));
						//分页
						/*order.pageTotal = result.data.pagetotal;
						order.total = result.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: order.pageCur,
							pageTotal: order.pageTotal,
							total: order.total,
							backFn: function(p) {
								order.pageCur = p;
								order.orderList();
							}
						});*/
					} else {}
					
				},
				error: function(resultData) {}
			});
		},
		// 搜索
		search:function() {
			$(".searchbtn").unbind("click");
			$(".searchbtn").on("click",function(){
				order.dataList();
			});
		},
		//切换
		tabSwitch:function() {
			$(".tab-head .tabBtn").click(function(){
			      var typeid = $(this).attr('typeid');
			      	$(this).addClass('active').siblings().removeClass('active');
			      if(typeid=='salesChannel'){
			      	$('.js-salesChannel').show();
			      	$('.js-sales').hide();
			      }else{
			      	$('.js-sales').show();
			      	$('.js-salesChannel').hide();
			      }
			})
		},
		//获取文件名称  
		getFileName:function() {
			function getFileName(path) {  
		        var pos1 = path.lastIndexOf('/');  
		        var pos2 = path.lastIndexOf('\\');  
		        var pos = Math.max(pos1, pos2);  
		        if (pos < 0) {  
		            return path;  
		        }  
		        else {  
		            return path.substring(pos + 1);  
		        }  
		    } 
		},
	}
	var materialListInit = function(){
		order.tabSwitch();
		order.getFileName();
		order.dataList();
  } 
  return {
        init:materialListInit
    };
})