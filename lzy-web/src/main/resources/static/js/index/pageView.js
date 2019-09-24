define(['jquery', 'common', 'echarts'],
function($, common, echarts) {
	var pageListInit = function() {
		//首页访问来源
		var browseoption = {

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
				data: ['访问量'],
				right: '5%',
				top: '2%'
			},
			grid: {
				left: '5%',
				right: '5%',
				top: '10%',
				bottom: '10%',
				containLabel: true
			},
			xAxis: [{
				show: true,
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
				data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

			}],
			yAxis: [{
				type: 'value',
				min: '0',
				max: '1000',
				'splitNumber': '5',
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
				}
			}],
			dataZoom: [{
				type: 'inside'
			}],
			series: [{
				name: '访问量',
				"type": "bar",
				"barMaxWidth": "30",
				"data": [543, 454, 232, 236, 874, 788, 75, 110, 543, 647, 22, 711],
				itemStyle: {
					//每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
					normal: {
						color: function(params) {
							var colorList = ['#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6'];
							return colorList[params.dataIndex];
						},

						label: {
							show: true,
							position: 'top',
							formatter: '{c}'
						}
					}

				}

			}]
		};
		var browsechart = echarts.init(document.getElementById('browsemap'));
		browsechart.setOption(browseoption);

	}
	return {
		init: pageListInit
	};
})