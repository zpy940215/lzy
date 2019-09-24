define(['jquery', 'common', 'echarts'],function($, common, echarts) {
	 var today = common.datatime.today('-'),
     weekago = common.datatime.weekago('-');
	var indexListInit = function() {
		//首页访问来源
		var sourceChart = echarts.init(document.getElementById("interviewmap"));
		var sourceoption = {

			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}：{c}%"
			},
			legend: {
				orient: 'vertical',
				x: '70%',
				y: '50%',
				width: 40,
				selectedMode: false,
				itemWidth: 10,
				itemHeight: 10,
				data: ['搜索引擎', '直接访问', '微信']
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '70%',
				center: ['45%', '40%'],
				data: [{
					value: 16,
					name: '微信'
				},
				{
					value: 30,
					name: '直接访问'
				},
				{
					value: 54,
					name: '搜索引擎'
				}

				],
				itemStyle: {
					normal: {
						label: {
							show: true,
							position: 'inner',
							formatter: '{c}%',
							textStyle: {
								fontSize: 16

							}
						},
						labelLine: {
							show: false
						}
					},
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'

					}
				}
			}],
			color: ['#ffc45b', '#ff8c60', '#24c0f2']

		};

		sourceChart.setOption(sourceoption);
		ObjectResize(sourceChart.resize);

		//浏览访问统计
		var interviewChart = echarts.init($('#interviewsitemap')[0]);

		var interviewoption = {
			// title: {
			//     text: '浏览量',
			// },
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'

				}
			},
			legend: {
				data: ['站点1', '站点2'],
				right: '3%',
				top: '2%'
			},
			grid: {
				left: '3%',
				right: '4%',
				top: '20%',
				bottom: '15%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				axisLine: {
					lineStyle: {
						color: '#f4f4f4'

					}
				},
				axisLabel: {
					textStyle: {
						color: '#aaa'
					}
				},
				data: ['03-21', '03-22', '03-23', '03-24', '03-25', '03-26', '03-27']

			},
			yAxis: {
				type: 'value',
				'splitNumber': '4',
				axisLine: {
					lineStyle: {
						color: '#f4f4f4'

					}
				},
				axisLabel: {
					textStyle: {
						color: '#aaa'
					}

				},
				splitLine: {
					lineStyle: {
						color: '#f4f4f4'

					}
				},
				boundaryGap: [0, 0.01]
			},
			dataZoom: [
	                    {
	                        type:'inside'
	                    }
	                ],
			series: [{
				name: '站点1',
				type: 'bar',
				"barMaxWidth": "30",
				data: [1827031, 2317489, 291734, 1704970, 1317744, 602301, 704970]
			},
			{
				name: '站点2',
				type: 'bar',
				"barMaxWidth": "30",
				data: [196325, 234638, 316000, 1215794, 1341741, 681807, 704970]
			}],
			color: ['#45a6f7', '#9b89b6']
		};
		interviewChart.setOption(interviewoption);
		ObjectResize(interviewChart.resize);

		//每日会员统计
		var memberChart = echarts.init($('#membertotalmap')[0]);

		var memberoption = {

			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#45a6f7'
					},
					lineStyle: {
						type: 'dashed',
						width: 1,
						color: '#999'

					}
				}
			},
			legend: {
				data: ['会员统计'],
				right: '3%',
				top: '2%'
			},

			grid: {
				left: '3%',
				right: '4%',
				top: '18%',
				bottom: '25%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				boundaryGap: false,

				axisLine: {

					lineStyle: {
						color: '#f4f4f4'

					}
				},
				axisLabel: {
					textStyle: {
						color: '#aaa'
					}
				},
				data: ['03-21', '03-22', '03-23', '03-24', '03-25', '03-26', '03-27']
			}],

			yAxis: [{
				type: 'value',
				'splitNumber': '4',
				axisLine: {
					lineStyle: {
						color: '#f4f4f4'

					}
				},
				splitLine: {
					lineStyle: {
						color: '#f4f4f4'

					}
				},
				axisLabel: {
					textStyle: {
						color: '#aaa'
					}
				}
			}],
			dataZoom: [
	                    {
	                        type:'inside'
	                    }
	                ],
			series: [{
				name: '会员统计',
				type: 'line',
				stack: '总数',
				areaStyle: {
					normal: {}
				},

				data: [120, 132, 101, 134, 90, 230, 210]
			}],
			color: ['#45a6f7 ']
		};
		memberChart.setOption(memberoption);
		ObjectResize(memberChart.resize);
		function ObjectResize(fn) {
			if (window.addEventListener) {
				window.addEventListener("resize", fn, false);
			} else {
				window.attachEvent("onresize", fn)
			}
		}
	}
	return {
		init: indexListInit
	};
})