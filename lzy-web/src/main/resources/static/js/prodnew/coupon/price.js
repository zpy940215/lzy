define(['jquery', 'common', 'jqueryui', 'timepicker','Handlebars', 'HandlebarExt',],
function($, common, jqueryui, timepicker,Handlebars, HandlebarExt) {
	var priceSet = {
		pageSize: 60,
		pageTotal: 1,
		pageCur: 1,
		total: 1,
		isAjaxing: false,
		dateTime:function(startdate,enddate,startTime,endTime){
			$(startdate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true,
				onClose:function(selectedDate){
                      $(this).siblings(enddate).datepicker("option", "minDate", selectedDate);     
				} 	               
		   	});
		   	$(enddate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true
				             
		   	});
		},
		searchPrice:function(){
			if(!priceSet.isAjaxing){
				priceSet.isAjaxing = true;
				$.ajax({
					type: "post",
					url: "${base}/prodPrice!queryListPage.ajax",
					data: {
						"pageObject.page": priceSet.pageCur,
						"pageObject.pagesize": priceSet.pageSize,
						"prodPriceVo.beginTime": $('.js_price_startTime').val(),
				        "prodPriceVo.endTime":$('.js_price_endTime').val(),
				        "prodPriceVo.prodId":$('#prodId').val()
					},
					dataType: "json",
					success: function(resultMap) {
						if (resultMap.code == "success") {
							//加载数据的处理
							var _templ = Handlebars.compile($("#prodPrice-list").html());
							$("#prodPrice-list-content").html(_templ(resultMap.data));
							
							var datalist = resultMap.data.dataList;
							for(var j in datalist) {
								$(".js_refound_"+datalist[j].id).find("option[value="+datalist[j].param1Value+"]").attr("selected",true);
								$(".js_use_type_"+datalist[j].id).find("option[value="+datalist[j].param2Value+"]").attr("selected",true);
							}
							
							//分页
							priceSet.pageTotal = resultMap.data.pagetotal;
							priceSet.total = resultMap.data.total;
							common.base.createPage('.js_pageDiv', {
								pageCur: priceSet.pageCur,
								pageTotal: priceSet.pageTotal,
								total: priceSet.total,
								backFn: function(p) {
									priceSet.pageCur = p;
									priceSet.searchPrice();
								}
							});
							priceSet.changePirce();
						} else {

							if (resultData && resultData.description) {
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
						priceSet.isAjaxing = false;
						
					},
					error: function(e) {
						priceSet.isAjaxing = false;
					}
				});
				
			}
			
			$('.js_price_searchBtn').unbind('click');
			$('.js_price_searchBtn').on('click',function(){
				priceSet.searchPrice();
			});
		},
		changePirce:function(){
			$('.js_price_changebtn').unbind("click");
			$('.js_price_changebtn').click(function() {
				if(!priceSet.isAjaxing){
					priceSet.isAjaxing = true;
					var datapost = new Object();
					var prodPriceId=$(this).attr('prodPriceId');
					datapost['prodPriceVo.id'] = prodPriceId;
					datapost['prodPriceVo.beginTime'] = $('.beginTime_'+prodPriceId).val();
					datapost['prodPriceVo.endTime'] = $('.endTime_'+prodPriceId).val();
					datapost['prodPriceVo.price'] = $('.oldPrice_'+prodPriceId).val();
					datapost['prodPriceVo.discountPrice'] = $('.price_'+prodPriceId).val();
					datapost['prodPriceVo.netPrice'] = $('.net_price_'+prodPriceId).val();
					datapost['prodPriceVo.totalNum'] = $('.totalNum_'+prodPriceId).val();
					datapost['prodPriceVo.freeNum'] = $('.freeNum_'+prodPriceId).val();
					datapost['prodPriceVo.param1Name'] = "是否可退";
					datapost['prodPriceVo.param1Value'] = $('.js_refound_'+prodPriceId).val();
					datapost['prodPriceVo.param2Name'] = "使用类型";
					datapost['prodPriceVo.param2Value'] = $('.js_use_type_'+prodPriceId).val();
					datapost['prodPriceVo.param3Name'] = "购票说明";
					datapost['prodPriceVo.param3Value'] = $('.param3Value_'+prodPriceId).val();
					
					$.ajax({
						type: "post",
						url: "${base}/prodPrice!save.ajax",
						data: datapost,
						dataType: "json",
						success: function(resultMap) {
							priceSet.isAjaxing = false;
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								tipMesg: '更新成功'
							});
							priceSet.searchPrice();
						},
						error: function(e) {
							priceSet.isAjaxing = false;
						}
					});
				}
			})
		},
		setPrice:function(){
			$('.js_priceSet_set').unbind("click");
			$('.js_priceSet_set').click(function() {
				if(!priceSet.isAjaxing){
					priceSet.isAjaxing = true;
					var check = true;
					var datapost = new Object();
					datapost['prodPriceVo.prodId'] = $('#prodId').val();
					datapost['prodPriceVo.beginTime'] = $('.js_priceSet_startTime ').val();
					datapost['prodPriceVo.endTime'] = $('.js_priceSet_endTime').val();
					datapost['type'] = $("input[name='priceType']:checked").val();
					datapost['prodPriceVo.price'] = $('.js_price_origin').val();
					datapost['prodPriceVo.discountPrice'] = $('.js_price_sale').val();
					datapost['prodPriceVo.netPrice'] = $('.js_price_net ').val();
					datapost['prodPriceVo.totalNum']=$('.js_price_totalNum').val();
					datapost['prodPriceVo.freeNum']=$('.js_price_freeNum').val();
					datapost['prodPriceVo.param1Name'] = "是否可退";
					datapost['prodPriceVo.param1Value'] = $('input:radio[name=isRefound]').val();
					datapost['prodPriceVo.param2Name'] = "使用类型";
					datapost['prodPriceVo.param2Value'] = $('input:radio[name=useType]').val();
					datapost['prodPriceVo.param3Name'] = "购票说明";
					datapost['prodPriceVo.param3Value'] = $('.js_price_param3Value').val();
					
					if(datapost['prodPriceVo.beginTime']==''||datapost['prodPriceVo.endTime']==''){
						check = false;
						priceSet.isAjaxing = false;
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							tipMesg: '请选择开始和结束时间'
						});
					}
					if(datapost['prodPriceVo.price']==''){
						check = false;
						priceSet.isAjaxing = false;
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							tipMesg: '请输入门市价格'
						});
					}
					if(datapost['prodPriceVo.discountPrice']==''){
						check = false;
						priceSet.isAjaxing = false;
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							tipMesg: '请输入销售价格'
						});
					}
					if(check){
						$.ajax({
							type: "post",
							url: "${base}/prodPrice!saveBatch.ajax",
							data: datapost,
							dataType: "json",
							success: function(resultMap) {
								if(resultMap.code == "success") {
									priceSet.isAjaxing = false;
									common.base.popUp('', {
										type: 'tip',
										tipTitle: '温馨提示',
										tipMesg: '新增成功'
									});
									priceSet.searchPrice();
								}
							},
							error: function(e) {
								priceSet.isAjaxing = false;
							}
						});
					}
				}
			})
		}
	}

	var priceSetInit = function() {
		var endTime = common.datatime.datedays(new Date(),'-',30);
		priceSet.dateTime('.js_price_startTime','.js_price_endTime');
		priceSet.dateTime('.js_priceSet_startTime','.js_priceSet_endTime');
		$('.js_price_startTime').datepicker('setDate',new Date() );
		$('.js_price_endTime').datepicker('setDate', new Date(endTime));
		priceSet.searchPrice();
		priceSet.setPrice();
	}

	return {
		init: priceSetInit
	};
})