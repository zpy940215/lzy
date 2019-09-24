define(['jquery', 'common', 'jqueryui', 'scroll', 'Handlebars', 'HandlebarExt', 'echarts','base64'],
	function($, common, jqueryui, scroll, Handlebars, HandlebarExt, echarts,base64) {
		var datalist = {
			yesterDayArray: [], //昨日打卡人数
			todayArray: [], //今日打卡人数
			timeIntervalArray: [], //所有景点一段时间内打卡人数
			dateArray: [], //单个景点日期列表
			viewTimeIntervalArray: [], //单个景点按日期打卡人数
			viewNameList: [], //景点名称列表
			viewList:function() {
				$.ajax({
					url: '${base}/view!queryListAll.ajax',
					data: {
						'viewVo.status': 'finish'
					},
					type: 'post',
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var viewVoList = resultData.data.viewVoList;
							var html='<option value="">请选择景点</option>';
							if(viewVoList) {
								for(var i = 0; i < viewVoList.length; i ++) {
									html += '<option value="'+viewVoList[i].viewId+'">'+viewVoList[i].name+'</option>';
								}
								$('#viewList').html(html);
							}
						}
					},
				});
			},
			clockList:function() {
				$.ajax({
					url: '${base}/logUser!pageQuery.ajax',
					data: {
						'logUserVo.bizType': 'view',
						'logUserVo.operationType': 'clock'
					},
					type: 'post',
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var dataList = resultData.data.dataList;
							var base64 = new Base64();
							var html='';
							$('#clockList').html('');
							if(dataList) {
								for(var i = 0; i < dataList.length; i ++) {
									var viewName = dataList[i].viewVo.name;
									var userNickName = base64.decode(dataList[i].userVo.nick);
									var date = common.datatime.formatDate(new Date(dataList[i].createDate));
									html += '<li><p>'+date+'【'+viewName+'】景区【'+userNickName+'】打卡成功</p></li>';
								}
								$('#clockList').html(html);
								$(".messagebox1").myScroll({
									speed:150, 
									rowHeight:25 
								});
							}
						}
					},
				});
			},
			loginList:function() {
				$.ajax({
					url: '${base}/user!queryListAll.ajax',
					data: {
						'userVo.type': 'user',
						'pageObject.page': 1,
						'pageObject.pagesize': 20
					},
					type: 'post',
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var dataList = resultData.data.data.dataList;
							var base64 = new Base64();
							var html='';
							$('#loginList').html('');
							if(dataList) {
								for(var i = 0; i < dataList.length; i ++) {
									var loginDate = common.datatime.accurateDate(new Date(dataList[i].loginDate));
									var userNickName = base64.decode(dataList[i].nick);
									html += '<li><p>【'+userNickName+'】'+loginDate+'登入</p></li>';
								}
								$('#loginList').html(html);
								$(".messagebox2").myScroll({
									speed:150, 
									rowHeight:25 
								});
							}
						}
					},
				});
			},
			messageList:function() {
				$.ajax({
					url: '${base}/msg!queryPageList.ajax',
					data: {
						'msgVo.hasRead': 'N',
						'pageObject.page': 1,
						'pageObject.pagesize': 20
					},
					type: 'post',
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var dataList = resultData.data.dataList;
							var html='';
							$('#messageList').html('');
							if(dataList) {
								for(var i = 0; i < dataList.length; i ++) {
									html += '<li><p>'+dataList[i].content+'</p></li>';
								}
								$('#messageList').html(html);
								$(".messagebox3").myScroll({
									speed:150, 
									rowHeight:25 
								});
							}
						}
					},
				});
			},
		
			dateTime:function(stattime, endtime){
				$(stattime).datepicker({
					dateFormat: 'yy-mm-dd',
					dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
					monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					yearSuffix: '年',
					showMonthAfterYear: true,
					showOtherMonths: true,
					minDate: null,
					maxDate: 0,
					onClose: function(selectedDate) {
						$(this).parents('.date').find(endtime).datepicker("option", "minDate", selectedDate);
						$(this).siblings(endtime).datepicker("option", "minDate", selectedDate);

					}
				});
				$(endtime).datepicker({
					dateFormat: 'yy-mm-dd',
					dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
					monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					yearSuffix: '年',
					showMonthAfterYear: true,
					showOtherMonths: true,
					minDate: null,
					maxDate: 0,
					onClose: function(selectedDate) {

					}
				});
				/* $(stattime).datepicker('setDate',new Date());
				 $(endtime).datepicker('setDate', new Date());*/
			},

			trend1:function(xData,yData){
					console.log(xData);
					var maxNum=0;
					if(yData[0]){
						var data=yData[0].data;
						for(var i=0;i<data.length;i++){
							if(maxNum<data[i]){
								maxNum=data[i];
							}
						}
						if(yData[1]){
							var data=yData[1].data;
							for(var j=0;j<data.length;j++){
								if(maxNum<data[j]){
									maxNum=data[j];
								}
							}
						}
					}
					
					if(maxNum<5){
						maxNum=5
					}
					
					
					//折线图
					var myChart = echarts.init(document.getElementById('trend1'));
					var monthoption = {
						legend: {
							data: ['今日数据', '昨日数据', ],
							x: 'center', // 'center' | 'left' | {number},
							y: 'bottom', // 'center' | 'bottom' | {number}
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								label: {
									backgroundColor: '#6a7985'
								}
							}
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '15%',
							containLabel: true
						},
						dataZoom: [
				            {
				                type:'inside'
				            }
				        ],
						xAxis: [{
							type: 'category',
							boundaryGap: true,
							data: xData,
							splitLine: {
								show: true,
								lineStyle: {
									color: 'rgba(255,255,255,0.1)'
								}
							},
							axisLine: {
								show: false
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#666',
									fontWeight: 'normal'
								},
							},
							splitArea: {
								show: false //x轴显示隐藏
							},
							axisTick: {
								show: false
							} //很短的刻度线
						}],
						yAxis: {
							type: 'value',
							name: '单位：人',
							nameTextStyle: {
								color: '#000',
								fontSize: '12'
							},
							 min:0,
							 max:maxNum,
							 minInterval : 1,
							 boundaryGap : [ 0, 0.5 ],
							splitLine: {
								show: true,
								lineStyle: {
									color: '#e7e7e7'
								}
							},
							axisLine: {
								show: false //y轴显示隐藏
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#666',
									fontWeight: 'normal'
								},
							},
							splitArea: {
								show: false
							},
							axisTick: {
								show: false
							} //很短的刻度线
						},
						series: yData
					};
					myChart.setOption(monthoption);
					window.addEventListener("resize", function() {
						myChart.resize();
					});
				},
				intervalFunc:function() {
					datalist.clockList();
					datalist.loginList();
					datalist.messageList();
				},
				loadWin:function (){ //定时器，五分钟一次
					setInterval(datalist.intervalFunc,300000); 
				},
				onedayData:function(dateType) {
					$.ajax({
						url: '${base}/view!queryClockNum.ajax',
						data: {
							'dateType': dateType
						},
						type: 'post',
						dataType: "json",
						success: function(resultData) {
							if (resultData.code == "success") {
								var viewVoList = resultData.data.viewVoList;
								datalist.viewNameList = [];
								if (dateType == 'yesterday') { 
									datalist.yesterdayArray = [];
								}else if (dateType == 'today') {
									datalist.todayArray = [];
								}
								if (viewVoList) {
									for (var i = 0; i < viewVoList.length; i ++) {
										datalist.viewNameList.push(viewVoList[i].name);
										if (dateType == 'yesterday') { 
											datalist.yesterdayArray.push(viewVoList[i].clockNum);
										}else if (dateType == 'today') {
											datalist.todayArray.push(viewVoList[i].clockNum);
										}
									}
								}
							}
						},
					});
				},
				timeIntervalData:function(startDate,endDate) {
					$.ajax({
						url: '${base}/view!queryClockNum.ajax',
						data: {
							'dateType': 'timeInterval',
							'startDate':startDate,
							'endDate': endDate
						},
						type: 'post',
						dataType: "json",
						success: function(resultData) {
							if (resultData.code == "success") {
								var viewVoList = resultData.data.viewVoList;
								datalist.viewNameList = [];
								datalist.timeIntervalArray = [];
								if (viewVoList) {
									for (var i = 0; i < viewVoList.length; i ++) {
										datalist.viewNameList.push(viewVoList[i].name);
										datalist.timeIntervalArray.push(viewVoList[i].clockNum);
									}
									var yData = [{
										name: '',
										type: 'line',
										stack: '总量',
										areaStyle: {},
										data: datalist.timeIntervalArray,
										itemStyle: {
											normal: {
												lineStyle: { // 系列级个性化折线样式  
													color: "#84C3F6" //折线的颜色
												},
												color: '#84C3F6',
											}
											}
										}
									];
									datalist.trend1(datalist.viewNameList,yData);
								}
							}
						},
					});
				},
				viewTimeIntervalData:function(startDate,endDate,viewId) {
					$.ajax({
						url: '${base}/view!queryDateListByViewId.ajax',
						data: {
							'dateType': 'timeInterval',
							'startDate':startDate,
							'endDate': endDate,
							'viewVo.viewId': viewId
						},
						type: 'post',
						dataType: "json",
						success: function(resultData) {
							if (resultData.code == "success") {
								var clockPos = resultData.data.clockPos;
								datalist.dateArray = [];
								datalist.viewTimeIntervalArray = [];
								if (clockPos) {
									for (var i = 0; i < clockPos.length; i ++) {
										datalist.dateArray.push(common.datatime.formatDate(new Date(clockPos[i].date)));
										datalist.viewTimeIntervalArray.push(clockPos[i].num);
									}
									var yData = [{
										name: '',
										type: 'line',
										stack: '总量',
										areaStyle: {},
										data: datalist.viewTimeIntervalArray,
										itemStyle: {
											normal: {
												lineStyle: { // 系列级个性化折线样式  
													color: "#84C3F6" //折线的颜色
												},
												color: '#84C3F6',
											}
											}
										}
									];
									datalist.trend1(datalist.dateArray,yData);
								}
							}
						},
					});
				},
				search:function() {
					$('.js_search').on('click', function() {
						var stattime = $('#stattime').val();
						var endtime = $('#endtime').val();
						var viewList = $('#viewList').val();
						if(stattime!=''&&endtime!=''){
							if(viewList!=''){ //单个景点日期列表
								datalist.viewTimeIntervalData(stattime,endtime,viewList);
							}else{ // 所有景点一段日期
								datalist.timeIntervalData(stattime,endtime);
							}
						}else{ //昨日和今日
							datalist.onedayData("today");
							datalist.onedayData("yesterday");
						}
					});
				}
		}
		var dataInner = function() {
			datalist.onedayData("today");
			datalist.onedayData("yesterday");
			datalist.viewList();
			datalist.clockList();
			datalist.loginList();
			datalist.messageList();
			datalist.dateTime('#stattime', '#endtime');
			datalist.search();
			setTimeout(function () {
				var yData = [{
						name: '今日数据',
						type: 'line',
					
						areaStyle: {},
						
					
						data: datalist.todayArray,
						itemStyle: {
							normal: {
								lineStyle: { // 系列级个性化折线样式  
									color: "#84C3F6" //折线的颜色
								},
								color: '#84C3F6',
							}
						}
					},
					{
						name: '昨日数据',
						type: 'line',
						
						
						areaStyle: {},
						data: datalist.yesterdayArray,
						itemStyle: {
							normal: {
								lineStyle: { // 系列级个性化折线样式  
									color: "#9B8AB4" //折线的颜色
								},
								color: '#9B8AB4',
							}
						}
					},
				];
				datalist.trend1(datalist.viewNameList,yData); }, 1000);
			datalist.loadWin();
		}

		return {
			init: dataInner,
		}
	})