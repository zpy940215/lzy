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
			var biz_id = $(".js_ticket_type").val();
			var keywords = $(".js_value_keywords").val();
			$.ajax({
				url: '${base}/orderItem!queryPageList.ajax',
				data: {
					"pageObject.page": order.pageCur,
					"pageObject.pagesize": order.pageSize,
					"orderItemVo.bizType":"piaowu",
					"orderItemVo.bizId":biz_id,
					"orderItemVo.orderNo":keywords,
					"orderItemVo.startDate":start_date+" 00:00:00",
					"orderItemVo.endDate":end_date+" 23:59:59"
				},
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
						order.payfee();
						order.orderDetail();
					} else {}
					
				},
				error: function(resultData) {}
			});	
		},
		ticketType:function() {
			$.ajax({
				url : '${base}/prod!queryListPage.ajax',
				data : {
					"prodVo.prodTypeId": '03',
					"pageObject.page": 1,
					"pageObject.pagesize": 100
				},
				type : 'post',
				dataType : 'json',
				success: function (resultData) {
					if (resultData.code == "success") {
						var list = resultData.data.dataList;
						var html = '';
						if (list) {
							for (var i = 0; i < list.length; i ++) {
								html += '<option value="'+list[i].prodId+'">'+list[i].name+'</option>';
							}
						}
						$('.js_ticket_type').append(html);
					}
				},
				error: function (resultData) {

				}
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
				if(checkResult==true){
					$.ajax({
						url : '${base}/orderStep!sendGoods.ajax',
						data : {
							"orderExpressVo.expressName": delivername,
							"orderExpressVo.expressCode": deliverno,
							"orderExpressVo.orderNo": orderNo
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
				order.orderList();
				var start_date = $(".js_order_startDate").val();
				var end_date = $(".js_order_endDate").val();
				var biz_id = $(".js_ticket_type").val();
				var keywords = $(".js_value_keywords").val();
				var prodName = $(".js_ticket_type").find("option:selected").text();
				if(prodName == "请选择") {
					prodName = "";
				}

				var toatlNum = order.total + 100;
				$.ajax({
					url: '${base}/orderItem!downloadExcel.ajax',
					data: {
						"pageObject.page": 1,
						"pageObject.pagesize": toatlNum,
						"orderItemVo.bizType":"piaowu",
						"orderItemVo.bizId":biz_id,
						"orderItemVo.orderNo":keywords,
						"orderItemVo.prodName":prodName,
						"orderItemVo.startDate":start_date+" 00:00:00",
						"orderItemVo.endDate":end_date+" 23:59:59"
					},
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
							},
							"payType":function(payType) {
								if("alipay" == payType){
									return "支付宝";
								} else if("weixin" == payType){
									return "微信";
								} else if("cash" == payType){
									return "现金";
								} else if("card" == payType){
									return "一卡通";
								} else if("cust" == payType){
									return "游客";
								} else if("weixinmini" == payType){
									return "微信小程序";
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
		search:function(){
			$('.js_select_btn').unbind('click');
			$('.js_select_btn').on('click',function(){
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
		exportProdExcel:function(){
			$('.js_excel_prod_btn').unbind('click');
			$('.js_excel_prod_btn').on('click',function(){
				order.orderList();
				var start_date = $(".js_order_startDate").val();
				var end_date = $(".js_order_endDate").val();

				var toatlNum = order.total + 100;
				$.ajax({
					url: '${base}/orderItem!downloadProdExcel.ajax',
					data: {
						"orderItemVo.startDate":start_date+" 00:00:00",
						"orderItemVo.endDate":end_date+" 23:59:59"
					},
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
	}
	var orderListInit = function() {
		order.ticketType();
		$(".js_select_date[dataValue=30]").addClass("active");
		var today = common.datatime.today("-");
		var monthago = common.datatime.monthago("-");
		$(".js_order_startDate").val(monthago);
		$(".js_order_endDate").val(today);
		order.DateTimeselect('.js_order_startDate','.js_order_endDate');
		order.search();
		order.orderList();
		order.exportExcel();
		order.orderCount();
		order.orderDetail();
		order.exportProdExcel();
	}
	return {
		init: orderListInit
	};
})