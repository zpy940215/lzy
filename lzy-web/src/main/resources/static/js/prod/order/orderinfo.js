define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'moment', 'stay',"LodopFuncs","print"],
function($, common, jqueryui, Handlebars, HandlebarExt, moment, stay,LodopFuncs,print) {
	 
	
	var order = {
		getQueryString:function(name) {  
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
		    var r = window.location.search.substr(1).match(reg);  
		    if (r != null)  
		        return unescape(r[2]);  
		    return null;  
		},
		orderinfo:function(){
			$(".js_hid").hide();
			
			var orderVo;
			var orderNo= order.getQueryString("orderNo");
			var printName = $("#printName").val();
			$(".orderNoVal").text(orderNo);
			
			//根据订单状态返回中文
			var getStatus = function( status ){
				var result = '';
				switch(status){
				case 'shipments':
					result='配货完成';
				  break;
				case 'pay':
					result='已支付';
				  break;
				case 'refunded':
					result='已退款';
				  break;  
				case 'create':
					result='未支付';
				  break;  
				case 'refundAfterShip':
					result='尚未入库';
				  break; 
				case 'success':
					result='已完成';
				  break;  
				} 
				return result;
			}
			
			//ajax
			$.ajax({
				url: '${base}/order!orderDetail.ajax',
				data: {
					"orderVo.orderNo":orderNo
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					console.log(resultData);
					var data = resultData.data.orderVo;
					orderVo =data;
					$("#totalNum").text(data.itemNum);
					$("#totalFee").text(data.totalFee+"元");
					
					//显示可见按钮
					if(orderVo.status=='pay' || orderVo.status=='shipments' || orderVo.status=='refundAfterShip'){
						$(".js_print").show();
						if(orderVo.status=='pay'){
							$(".js_finishgoods").show();
						}else
						if(orderVo.status=='refundAfterShip'){
							$(".js_storage").show();
						}
						if(orderVo.status=='shipments'){
							$(".js_success").show();
						}
					}
					
					var temp ="<tr><th width='10%'>订单号</th>"
		  				+"	<td width='40%'>"+(orderNo || "")+"</td>"
		  				+"	<th width='10%'>检票状态</th>"
		  				+"	<td width='40%'><span class='style1'>"+ getStatus((data.status || ""))+"</span></td>"
		  				+"</tr><tr>"
		  				+"	<th width='30%'>商品名称</th>"
		  				+"	<th width='30%'>商品规格</th>"
		  				+"	<th width='20%'>单价</th>"
		  				+"	<th width='20%'>数量</th></tr>";
					
					var temp2 = "<tr><th width='25%'>订单号:"+(orderNo || "")+"</th>"
						+"	<td width='25%'>姓名:"+(data.orderPersonVo.name || "")+"</td>"
						+"	<th width='25%'>电话:"+(data.orderPersonVo.mobile || "")+"</th>"
						+"	<td width='25%'>时间:"+common.datatime.formatDate(new Date((data.createDate || "")))+"</td>"
						+"	</tr><tr>"
						+"		<th width='30%'>商品名称</th>"
						+"		<th width='30%'>单价(元)</th>"
						+"		<th width='20%'>数量</th>"
						+"		<th width='20%'>总价(元)</th></tr>";
					for(var i=0;i<data.orderItemVoList.length;i++){
						temp+="<tr><td>"+(data.orderItemVoList[i].prodName || "")+"</td><td>"+(data.orderItemVoList[i].prodName || "")+"</td>"
							+"<td>"+data.orderItemVoList[i].discountPrice+"</td><td>"+data.orderItemVoList[i].prodNum+"</td></tr>";
					
						temp2+="<tr><td>"+(data.orderItemVoList[i].prodName || "")+"</td><td>"+data.orderItemVoList[i].discountPrice
							+"</td><td>"+(data.orderItemVoList[i].prodNum || "")+"</td><td>"+data.orderItemVoList[i].prodNum*data.orderItemVoList[i].discountPrice+"</td></tr>";
					}
					
					temp +="<tr><th width='10%'>订单总计</th>"
			  				+"	<td width='40%'><span class='style1'>"+data.totalPrice+"</span></td>"
			  				+"	<th width='10%'>积分抵扣</th>"
			  				+"	<td width='40%'><span class='style1'>-¥"+(data.totalPrice-data.payFee)+"</span></td>"
			  				+"</tr><tr>"
			  				+"	<th width='10%'>订单应付</th>"
			  				+"	<td width='40%'><span class='style1'>"+data.payFee+"</span></td>"
			  				+"	<th width='10%'>提交时间</th>"
			  				+"	<td width='40%'>"+common.datatime.formatDate(new Date((data.createDate || "")))+"</td></tr>";
					$("#itemList").html(temp);
					$("#orderList").html(temp2);
				},
				error: function(resultData) {}
			});	
			
			$(".js_print").on('click',function(){
				print.printAccounts(orderVo,'');
				$.ajax({
					url:'${base}/orderStep!save.ajax',
					data:{
						"orderStepVo.orderNo":orderNo,
						"orderStepVo.status":"order_shipments_print_success"
					},
					type:"post",
					dataType: "json",
					success:function(){
						
					}
				})
			})
		},
		//配货
		shipments: function(){
			var orderNo= order.getQueryString("orderNo");
			$(".js_finishgoods").on('click',function(){
				$.ajax({
					url: '${base}/order!updateOrderStatus.ajax',
					data: {
						"orderVo.status":"shipments",
						"orderVo.orderNo":orderNo
					},
					type: 'post',
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success:function(){
						common.base.loading("fadeOut");
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '配货成功',
							//提示语
							backFn: function(result) {
								//alert(result);
							}
						});
						location.reload();
					}
				})
			})
		},
		toSuccess: function(){
			var orderNo= order.getQueryString("orderNo");
			$(".js_success").on('click',function(){
				$.ajax({
					url: '${base}/order!updateOrderStatus.ajax',
					data: {
						"orderVo.status":"confirmationReceipt",
						"orderVo.orderNo":orderNo
					},
					type: 'post',
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success:function(){
						common.base.loading("fadeOut");
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '确认收货成功',
							//提示语
							backFn: function(result) {
								//alert(result);
							}
						});
						location.reload();
					}
				})
			})
		},
		//重新入库
		refundAfterShip: function(){
			var orderNo= order.getQueryString("orderNo");
			$(".js_storage").on('click',function(){
				$.ajax({
					url: '${base}/order!updateOrderStatus.ajax',
					data: {
						"orderVo.status":"reRuku",
						"orderVo.orderNo":orderNo
					},
					type: 'post',
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success:function(){
						common.base.loading("fadeOut");
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '重新入库成功',
							//提示语
							backFn: function(result) {
								//alert(result);
							}
						});
						location.reload();
					}
				})
			})
		}
	}
	var orderinfoInit = function() {
		order.orderinfo();
		order.shipments();
		order.refundAfterShip();
		order.toSuccess();
	}
	return {
		init: orderinfoInit
	};
})