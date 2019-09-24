define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'moment', 'stay'],
function($, common, jqueryui, Handlebars, HandlebarExt, moment, stay) {
	var order = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		dataList: null,
		status: null,
		orderList:function(){
			var start_date = $(".js_order_startDate").val();
			var end_date = $(".js_order_endDate").val();
			var order_type = $(".js_value_type").val();
			var order_status = $(".js_value_status").find("option:checked").attr("value");
			var order_status_pay = $(".js_value_status_pay").find("option:checked").attr("value");
			var order_status_use = $(".js_value_status_use").find("option:checked").attr("value");
			var keywords = $(".js_value_keywords").val();
			var clientType = $(".js_select_client").find("option:checked").attr("value");
			var payType = $(".js_select_payType").find("option:checked").attr("value");
			$.ajax({
				url: '${base}/order!queryPageList.ajax',
				data: {
					"pageObject.page": order.pageCur,
					"pageObject.pagesize": order.pageSize,
					"keywords":$(".search_input").val(),
					"orderVo.bizType":order_type,
					"orderVo.status":order.status,
					"orderVo.clientType":clientType,
					"orderVo.payType":payType,
					"keywords":keywords,
					"orderVo.startDate":start_date+" 00:00:00",
					"orderVo.endDate":end_date+" 23:59:59"
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
							"scOrderStatus":function(a, options) {
								a = a || "";
								var status = {
									"create": "创建",
				          			"pay":"已支付",
				          			"cancel":"已取消",
				          			"close":"订单关闭",
				          			"delivering":"发货中",
				          			"delivered":"已发货",
				          			"success":"已确认收货",
				          			"refunded":"已退款",
				          			"refundapply":"申请退款",
				          			"refunding":"退款中",
				          			"refundrefuse":"拒绝退款",
				          			"shipments":"配货完成",
				          			"refundAfterShip":"尚未入库"
								};
								return status[a] || a;
							},
							"compare":function(type,options){
								if(type != "jiudian") {
									return options.fn(this);
								} else {
									return options.inverse(this);
								}
							},
							"sub":function(totalFee,totalPrice){
								return (totalFee-totalPrice).toFixed(2);
							},
							"getClientTypeName":function(clientType){
								if(clientType == "wap"){
									return "手机网页端";
								} else if(clientType == "web"){
									return "PC网页端";
								} else if(clientType == "weixin"){
									return "微信";
								} else if(clientType == "all_in_one Pc"){
									return "一体机";
								} else if(clientType == "pad"){
									return "pad端";
								} else if(clientType == "app"){
									return "app端";
								} else if(clientType == "ios"){
									return "ios端";
								} else if(clientType == "android"){
									return "android端";
								} else if(clientType == "xcx"){
									return "小程序";
								} else {
									return "其他";
								}
							},
							"payType":function(payType){
								var arr = {
									"ali":"支付宝",
									"weixin":"微信"
								};
								return arr[payType];
							},
							"syncinfo":function(syncStatus,syncDesc){
								var arr = {
										"success":"(同步成功)",
										"fail":"(同步失败，失败原因:"+syncDesc+")"
									};
									return arr[syncStatus];
								},
						});
						//加载数据的处理
						var _templ = Handlebars.compile($("#order-list").html());
						order.dataList = resultData.data.dataList;
						
						//处理出票按钮显示与否
						var dataList = order.dataList;
						var today = common.datatime.today('-');
						if (dataList) {
							for (var i = 0; i < dataList.length; i ++) {
								var orderVo = dataList[i];
								if (common.datatime.formatDate(new Date(orderVo.occDate)) == today && orderVo.status == 'pay') {
									orderVo['ticket'] = true;
								}else {
									orderVo['ticket'] = false;
								}
							}
						}

						$("#order-list-content").html(_templ(resultData.data));
						// 商城订单添加发货按钮
						if (dataList) {
							for (var i = 0; i < dataList.length; i ++) {
								var orderVo = dataList[i];
								if(orderVo.status == 'pay' && orderVo.bizType == 'shangcheng') {
									$('#deliver_'+orderVo.id).html("<a href='javascript:;' orderNo="+orderVo.orderNo+" class='js_send_goods' deliver="+orderVo.id+">发货</a>");
								}
							}
						}
						//分页
						order.pageTotal = resultData.data.pagetotal;
						order.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: order.pageCur,
							pageTotal: order.pageTotal,
							total: order.total,
							backFn: function(p) {
								order.pageCur = p;
								order.orderList();

							}
						});

						order.ticketOrder();
						order.sendgoods();
						order.seegoods();
						order.payfee();
						order.orderDetail();
					} else {}
					
				},
				error: function(resultData) {}
			});	
		},
		Cancelorder:function(){ },
		editIdcard:function(){
			$('.js_edit_idcard').unbind('click');
			$('.js_edit_idcard').on('click',function(){
				var orderNo = $(this).attr('orderNo');
				var idcard = $('#idcard').val();
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '确认更新身份证号码？',
					//提示语
					backFn: function(result) {
						
						if (result) {
							$.ajax({
								url : '${base}/order!updateIdcard.ajax',
								data : {
									"orderNo": orderNo,
									"idcard": idcard
								},
								type : 'post',
								dataType : 'json',
								success: function (resultData) {
									if (resultData.code == "success") {
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: '更新成功!',
											//提示语
											backFn: function(result) {
												if (result) {
													order.orderList(); //刷新列表
												}
											}
										});
									}
								},
								error: function (resultData) {

								}
							});
							
							
						}

					}
				});
			});
		},
		ticketOrder:function () {
			$('.js_ticket_order').unbind('click');
			$('.js_ticket_order').on('click',function(){
				var thisItem = $(this);
				var orderNo = $(this).attr('orderNo');
				var playDate = $(this).attr('playDate');
				var status = $(this).attr('status');
				var myDate = common.datatime.today('-');

				if (playDate == myDate && status == 'pay') { //可出票
					$.ajax({
						url : '${base}/order!updateOrderStatus.ajax',
						data : {
							"orderVo.status": "success",
							"orderVo.orderNo": orderNo
						},
						type : 'post',
						dataType : 'json',
						success: function (resultData) {
							if (resultData.code == "success") {
								common.base.popUp('', {
									type: 'tip',
									tipTitle: '温馨提示',
									//标题
									tipMesg: '出票成功!',
									//提示语
									backFn: function(result) {
										if (result) {
											order.orderList(); //刷新列表
										}
									}
								});
								thisItem.parent('.ticketHide').remove();
							}
						},
						error: function (resultData) {

						}
					});
				}
			});
		},
		//同步订单
		
		ticketOrder:function () {
			$('.js_sync_order').unbind('click');
			$('.js_sync_order').on('click',function(){
				var thisItem = $(this);
				var orderNo = $(this).attr('orderNo');
				 //可出票
					$.ajax({
						url : '${base}/synclog!update.ajax',
						data : {
							"bizId": orderNo
						},
						type : 'post',
						dataType : 'json',
						success: function (resultData) {
							if (resultData.code == "success") {
								common.base.popUp('', {
									type: 'tip',
									tipTitle: '温馨提示',
									//标题
									tipMesg: '同步成功!',
									//提示语
									backFn: function(result) {
										if (result) {
											order.orderList(); //刷新列表
										}
									}
								});
								thisItem.parent('.ticketHide').remove();
							}
						},
						error: function (resultData) {

						}
					});
				
			});
		},
		
		// 发货
		goodsDelivery:function(orderNo){
			$('.goods_deliver_save').unbind('click');
			$('.goods_deliver_save').on('click',function(){
				var checkResult=true;
				var delivername = $('#delivername').val();
				var deliverno = $('#deliverno').val();
				if (!common.validate.checkEmpty('#delivername', '请输入快递名称！')) {
					checkResult = false;
				}
				if (!common.validate.checkEmpty('#deliverno', '请输入快递单号！')) {
					checkResult = false;
				}
				if (!checkResult) {
					return false;
				}
				var remarks = $('#delivername').val() + ',' + $('#deliverno').val();
				if(checkResult==true){
					$.ajax({
						url : '${base}/order!delivered.ajax',
						data : {
							"orderVo.orderNo": orderNo,
							"orderVo.remarks": remarks
						},
						type : 'post',
						dataType : 'json',
						success: function (resultData) {
							if (resultData.code == "success") {
								common.base.popUp('', {
									type: 'tip',
									tipTitle: '温馨提示',
									//标题
									tipMesg: '发货信息添加成功!',
									//提示语
									backFn: function(result) {
										if (result) {
											$('.js_popUpsendgoods').fadeOut(200);
											order.orderList();
										}
									}
								});
								thisItem.parent('.ticketHide').remove();
							}
						},
						error: function (resultData) {

						}
					});
				}
				
			});
			
		},
		exportExcel:function(){
			$('.js_excel_btn').unbind('click');
			$('.js_excel_btn').on('click',function(){
				var start_date = $(".js_order_startDate").val();
				var end_date = $(".js_order_endDate").val();
				var order_type = $(".js_value_type").val();
				var order_status = $(".js_value_status").find("option:checked").attr("value");
				var order_status_pay = $(".js_value_status_pay").find("option:checked").attr("value");
				var order_status_use = $(".js_value_status_use").find("option:checked").attr("value");
				var keywords = $(".js_value_keywords").val();
				var clientType = $(".js_select_client").find("option:checked").attr("value");
				var payType = $(".js_select_payType").find("option:checked").attr("value");
				$.ajax({
					url: '${base}/orderCount!downloadExcel.ajax',
					data: {
						"pageObject.page": order.pageCur,
						"pageObject.pagesize": order.pageSize,
						"keywords":$(".search_input").val(),
						"orderVo.bizType":order_type,
						"orderVo.status":order.status,
						"orderVo.clientType":clientType,
						"orderVo.payType":payType,
						"keywords":keywords,
						"orderVo.startDate":start_date+" 00:00:00",
						"orderVo.endDate":end_date+" 23:59:59"
					},
					type: 'post',
					dataType: "json",
					success: function(result) {
						if(result.code == "success") {
							var path=$.cookie("orderList");
							window.location.href=path;
						} else {
							alert("导出失败");
						}
					},
					error: function(resultData) {}
				});	
			});
		},
		orderDetail:function(){
			$('.js_detail_order').unbind('click');
			$('.js_detail_order').on('click',function(){
				var orderNo = $(this).attr("orderNo");
				
				$.ajax({
					url: '${base}/order!orderDetail.ajax',
					data: {
						"orderVo.orderNo":orderNo,
					},
					type: 'post',
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success: function(result) {
						common.base.loading("fadeOut");
						var orderTime = result.data.orderVo.orderTime;
						Handlebars.registerHelper({
							"subtract":function(number1,number2,options){
							return number = (number1 - number2).toFixed(2);  
							},
							"formatTime":function(timestamp) {
								var format = 'YYYY-MM-DD HH:mm:ss';  
						        if(arguments.length > 2){  
						            format = arguments[1];  
						        }  
						        if(timestamp != null){  
						            return moment(new Date(timestamp)).format(format);  
						        } else {
						        	return "暂无";
						        }
							},
							"deliveryAddress":function(country,province,city,address) {
								if(province.substring(0,3) == "市辖区" || province.substring(0,1) == "县") {
									return country+" "+city+" "+address;
								} else {
									return country+" "+province+" "+city+" "+address;
								}
							}
						});
						if(result.data.orderVo.bizType == "shangcheng") {
							var _templ = Handlebars.compile($("#order-detail-shangcheng").html());
							$("#shangcehng-detail-content").html(_templ(result.data.orderVo));
							common.base.popUp('.js_popUpShangchengDetail');
						} else if(result.data.orderVo.bizType == "piaowu") {
							var _templ = Handlebars.compile($("#order-detail-piaowu").html());
							$("#piaowu-detail-content").html(_templ(result.data.orderVo));
							common.base.popUp('.js_popUpPiaoWuDetail');
						} else if(result.data.orderVo.bizType == "jiudian") {
							var _templ = Handlebars.compile($("#order-detail-jiudian").html());
							$("#jiudian-detail-content").html(_templ(result.data.orderVo));
							common.base.popUp('.js_popUpJiuDianDetail');
						}
						order.editIdcard();
						order.applyRefund();
						order.refund();
						order.cancel();
					},
					error: function(resultData) {}
				});	
			});
			
		},
		orderCount:function(){
			$('.js_count_btn').unbind('click');
			$('.js_count_btn').on('click',function(){
				var start_date = $(".js_order_startDate").val();
				var end_date = $(".js_order_endDate").val();
				var order_type = $(".js_value_type").val();
				var order_status = $(".js_value_status").find("option:checked").attr("value");
				var order_status_pay = $(".js_value_status_pay").find("option:checked").attr("value");
				var order_status_use = $(".js_value_status_use").find("option:checked").attr("value");
				var keywords = $(".js_value_keywords").val();
				
				$.ajax({
					url: '${base}/orderCount!countOrder.ajax',
					data: {
						"pageObject.page": order.pageCur,
						"pageObject.pagesize": order.pageSize,
						"keywords":$(".search_input").val(),
						"orderVo.bizType":order_type,
						"orderVo.status":order.status,
						"keywords":keywords,
						"orderVo.startDate":start_date+" 00:00:00",
						"orderVo.endDate":end_date+" 23:59:59"
					},
					type: 'post',
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success: function(result) {
						/*$(".js_totalprice").html(result.data.totalOrderPrice);
						$(".js_totalfee").html(result.data.totalOrderFee);
						$(".js_successNum").html(result.data.successNum);
						$(".js_cancelNum").html(result.data.cancelNum);*/
						alert(result.code);
						common.base.loading("fadeOut");
					},
					error: function(resultData) {}
				});	
			});
		},
		orderRefund:function(){
			$('.js_refund').unbind('click');
			$('.js_refund').on('click',function(){
				var _templ = Handlebars.compile($("#refund-look").html());
				$("#refund-look-content").html(_templ());
				common.base.popUp('.js_popUprefund');
			})
			
		},
		sendgoods:function(){
			$('.js_send_goods').unbind('click');
			$('.js_send_goods').on('click',function(){
				var orderNo = $(this).attr("orderNo");
				var _templ = Handlebars.compile($("#sendgoods-save").html());
				$("#sendgoods-save-content").html(_templ());
				common.base.popUp('.js_popUpsendgoods');
				order.goodsDelivery(orderNo);
			})
		},
		seegoods:function(){
			$('.js_see_goods').unbind('click');
			$('.js_see_goods').on('click',function(){
				var orderNo = $(this).attr("orderNo");
				var arr = $(this).attr("remarks").split(',');
				var dataList = {};
				dataList['name'] = arr[0];
				dataList['no'] = arr[1];
				var _templ = Handlebars.compile($("#sendgoods-save").html());
				$("#sendgoods-save-content").html(_templ(dataList));
				common.base.popUp('.js_popUpsendgoods');
				order.goodsDelivery(orderNo);
			})
		},
		orderSelect:function(){
			$('.js_select').unbind('click');
			$('.js_select').on('click',function(){
				var dataType = $(this).attr("dataType");
				var dataValue = $(this).attr("dataValue");
				$(".js_select_"+dataType).removeClass("active");
				$(this).addClass("active");
				if(dataType=="date"){
					switch(dataValue){
						case "0":
							var today = common.datatime.today("-");
							$(".js_order_startDate").val(today);
							$(".js_order_endDate").val(today);
							break;
						case "1":
							var yestoday = common.datatime.yestoday("-");
							$(".js_order_startDate").val(yestoday);
							$(".js_order_endDate").val(yestoday);
							break;
						case "7":
							var weekago = common.datatime.weekago("-");
							var today = common.datatime.today("-");
							$(".js_order_startDate").val(weekago);
							$(".js_order_endDate").val(today);
							break;
						case "30":
							var today = common.datatime.today("-");
							var monthago = common.datatime.monthago("-");
							$(".js_order_startDate").val(monthago);
							$(".js_order_endDate").val(today);
							break;
					
					}
					
				}
				else{
					$(".js_value_"+dataType).val(dataValue);
				}
				order.orderList();
			});
			$('.js_select_btn').unbind('click');
			$('.js_select_btn').on('click',function(){
				order.orderList();
			});
			$('.js_select_select').on('change',function(){
				order.status=$(this).val();
				order.orderList();
			});
		},
		searchKeyword:function(){
			$('.search_input').unbind('click');
			$('.search_input').on('click',function(){
				order.orderList();
				
			})
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

		},
		payfee:function(){
			var price=0;
			$('.js_payFee').each(function(){
				if($(this).text()!=''){
					price+=parseFloat($(this).text());
				}
				$('.js_totalprice').text(price.toFixed(2));
			})
		},
		refund:function(){
			$(".js_agent_refund").unbind('click');
			$(".js_agent_refund").on('click',function(){
				var orderNo = $(this).attr('orderNo');
				var clientType = $(this).attr('clientType');
				var isAirPay = $("#isAirPay").val();
				if(isAirPay=="Y"){
					var url = "${base}/order!teemaxRefund.ajax";
				}else{
					var url = "${base}/order!refundOrder.ajax";
				}
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '确认退款吗？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: url,
								data: {
									 "orderNo":orderNo,
									 "clientType":clientType
								},
								type: 'post',
								dataType: "json",
								beforeSend: function() {
									common.base.loading("fadeIn");
								},
								success: function(result) {
									
									if(result.code=="success"){
										common.base.loading("fadeOut");
										console.log(result);

										$.ajax({
											url: '${base}/order!orderDetail.ajax',
											data: {
												"orderVo.orderNo":orderNo,
											},
											type: 'post',
											dataType: "json",
											beforeSend: function() {
												common.base.loading("fadeIn");
											},
											success: function(result) {
												common.base.loading("fadeOut");
												var orderTime = result.data.orderVo.orderTime;
												Handlebars.registerHelper({
													"subtract":function(number1,number2,options){
													return number = (number1 - number2).toFixed(2);  
													},
													"formatTime":function(timestamp) {
														var format = 'YYYY-MM-DD HH:mm:ss';  
												        if(arguments.length > 2){  
												            format = arguments[1];  
												        }  
												        if(timestamp != null){  
												            return moment(new Date(timestamp)).format(format);  
												        } else {
												        	return "暂无";
												        }
													},
													"deliveryAddress":function(country,province,city,address) {
														if(province.substring(0,3) == "市辖区" || province.substring(0,1) == "县") {
															return country+" "+city+" "+address;
														} else {
															return country+" "+province+" "+city+" "+address;
														}
													}
												});
												if(result.data.orderVo.bizType == "shangcheng") {
													var _templ = Handlebars.compile($("#order-detail-shangcheng").html());
													$("#shangcehng-detail-content").html(_templ(result.data.orderVo));
													common.base.popUp('.js_popUpShangchengDetail');
												} else if(result.data.orderVo.bizType == "piaowu") {
													var _templ = Handlebars.compile($("#order-detail-piaowu").html());
													$("#piaowu-detail-content").html(_templ(result.data.orderVo));
													common.base.popUp('.js_popUpPiaoWuDetail');
												} else if(result.data.orderVo.bizType == "jiudian") {
													var _templ = Handlebars.compile($("#order-detail-jiudian").html());
													$("#jiudian-detail-content").html(_templ(result.data.orderVo));
													common.base.popUp('.js_popUpJiuDianDetail');
												}
												order.editIdcard();
												order.applyRefund();
												order.refund();
											},
											error: function(resultData) {}
										});	
									}else{
										common.base.loading("fadeOut");
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: result.description,
											//提示语
											backFn: function(result) {
												if (result) {
												}
											}
										});
									}
								},
								error: function(resultData) {
									alert(resultData)
								}
							});	
						}
					}
				}); 
			});
		},
		applyRefund:function(){
			$(".js_agent_apply").unbind('click');
			$(".js_agent_apply").on('click',function(){
				var orderNo = $(this).attr('orderNo');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '确认取消订单吗？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/order!applyRefund.ajax',
								data: {
									 "orderNo":orderNo,
								},
								type: 'post',
								dataType: "json",
								beforeSend: function() {
									common.base.loading("fadeIn");
								},
								success: function(result) {
									common.base.loading("fadeOut");
									console.log(result);

									$.ajax({
										url: '${base}/order!orderDetail.ajax',
										data: {
											"orderVo.orderNo":orderNo,
										},
										type: 'post',
										dataType: "json",
										beforeSend: function() {
											common.base.loading("fadeIn");
										},
										success: function(result) {
											common.base.loading("fadeOut");
											var orderTime = result.data.orderVo.orderTime;
											Handlebars.registerHelper({
												"subtract":function(number1,number2,options){
												return number = (number1 - number2).toFixed(2);  
												},
												"formatTime":function(timestamp) {
													var format = 'YYYY-MM-DD HH:mm:ss';  
											        if(arguments.length > 2){  
											            format = arguments[1];  
											        }  
											        if(timestamp != null){  
											            return moment(new Date(timestamp)).format(format);  
											        } else {
											        	return "暂无";
											        }
												},
												"deliveryAddress":function(country,province,city,address) {
													if(province.substring(0,3) == "市辖区" || province.substring(0,1) == "县") {
														return country+" "+city+" "+address;
													} else {
														return country+" "+province+" "+city+" "+address;
													}
												}
											});
											if(result.data.orderVo.bizType == "shangcheng") {
												var _templ = Handlebars.compile($("#order-detail-shangcheng").html());
												$("#shangcehng-detail-content").html(_templ(result.data.orderVo));
												common.base.popUp('.js_popUpShangchengDetail');
											} else if(result.data.orderVo.bizType == "piaowu") {
												var _templ = Handlebars.compile($("#order-detail-piaowu").html());
												$("#piaowu-detail-content").html(_templ(result.data.orderVo));
												common.base.popUp('.js_popUpPiaoWuDetail');
											} else if(result.data.orderVo.bizType == "jiudian") {
												var _templ = Handlebars.compile($("#order-detail-jiudian").html());
												$("#jiudian-detail-content").html(_templ(result.data.orderVo));
												common.base.popUp('.js_popUpJiuDianDetail');
											}
											order.editIdcard();
											order.applyRefund();
											order.refund();
										},
										error: function(resultData) {}
									});	
								},
								error: function(resultData) {
									alert(resultData)
								}
							});	
						}
					}
				}); 
			});
		},
		cancel:function(){
			$(".js_Cancel_order").unbind('click');
			$(".js_Cancel_order").on('click',function(){
				var orderNo = $(this).attr('orderNo');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '确认取消吗？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: "${base}/order!updateOrderStatus.ajax",
								data: {
									 "orderVo.orderNo":orderNo,
									 "orderVo.status":"cancel",
								},
								type: 'post',
								dataType: "json",
								beforeSend: function() {
									common.base.loading("fadeIn");
								},
								success: function(result) {
									if(result.code=="success"){
										common.base.loading("fadeOut");
										console.log(result);
										$.ajax({
											url: '${base}/order!orderDetail.ajax',
											data: {
												"orderVo.orderNo":orderNo,
											},
											type: 'post',
											dataType: "json",
											beforeSend: function() {
												common.base.loading("fadeIn");
											},
											success: function(result) {
												common.base.loading("fadeOut");
												var orderTime = result.data.orderVo.orderTime;
												Handlebars.registerHelper({
													"subtract":function(number1,number2,options){
													return number = (number1 - number2).toFixed(2);  
													},
													"formatTime":function(timestamp) {
														var format = 'YYYY-MM-DD HH:mm:ss';  
												        if(arguments.length > 2){  
												            format = arguments[1];  
												        }  
												        if(timestamp != null){  
												            return moment(new Date(timestamp)).format(format);  
												        } else {
												        	return "暂无";
												        }
													},
													"deliveryAddress":function(country,province,city,address) {
														if(province.substring(0,3) == "市辖区" || province.substring(0,1) == "县") {
															return country+" "+city+" "+address;
														} else {
															return country+" "+province+" "+city+" "+address;
														}
													}
												});
												if(result.data.orderVo.bizType == "shangcheng") {
													var _templ = Handlebars.compile($("#order-detail-shangcheng").html());
													$("#shangcehng-detail-content").html(_templ(result.data.orderVo));
													common.base.popUp('.js_popUpShangchengDetail');
												} else if(result.data.orderVo.bizType == "piaowu") {
													var _templ = Handlebars.compile($("#order-detail-piaowu").html());
													$("#piaowu-detail-content").html(_templ(result.data.orderVo));
													common.base.popUp('.js_popUpPiaoWuDetail');
												} else if(result.data.orderVo.bizType == "jiudian") {
													var _templ = Handlebars.compile($("#order-detail-jiudian").html());
													$("#jiudian-detail-content").html(_templ(result.data.orderVo));
													common.base.popUp('.js_popUpJiuDianDetail');
												}
												order.editIdcard();
												order.applyRefund();
												order.refund();
											},
											error: function(resultData) {}
										});	
									}else{
										common.base.loading("fadeOut");
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: result.description,
											//提示语
											backFn: function(result) {
												if (result) {
												}
											}
										});
									}
								},
								error: function(resultData) {
									alert(resultData)
								}
							});	
						}
					}
				}); 
			});
		},
	}
	var orderListInit = function() {
		$(".js_select_date[dataValue=30]").addClass("active");
		var today = common.datatime.today("-");
		var monthago = common.datatime.monthago("-");
		$(".js_order_startDate").val(monthago);
		$(".js_order_endDate").val(today);
		order.DateTimeselect('.js_order_startDate','.js_order_endDate');
		order.orderSelect();
		order.orderList();
		order.exportExcel();
		order.orderCount();
		order.orderDetail();
		
	}
	return {
		init: orderListInit
	};
})