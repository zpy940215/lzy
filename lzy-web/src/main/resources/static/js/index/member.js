define(['jquery', 'common', 'echarts'],
function($, common, echarts) {
	var memberListInit = function() {

		var yearecharts = {

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

			grid: {
				left: '5%',
				right: '5%',
				top: '10%',
				bottom: '20%',
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
				name: '会员',
				"type": "bar",
				"barMaxWidth": "30",
				"data": [543, 454, 232, 236, 874, 788, 75, 110, 543, 647, 22, 711],
				itemStyle: {
					//通常情况下：每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
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
		var myChart = echarts.init(document.getElementById('containermap'));
		myChart.setOption(yearecharts);
		ObjectResize(myChart.resize);

		/////////////////////月报表/////////////////////////
		var monthecharts = {

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

			grid: {
				left: '5%',
				right: '5%',
				top: '10%',
				bottom: '20%',
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
				data: ["1日", "2日", "3日", "4日", "5日", "6日", "7日", "8日", "9日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日", "29日", "30日", "31日"]

			}],
			yAxis: [{
				type: 'value',
				min: '0',
				max: '100',
				splitNumber: '5',
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
				name: '会员',
				"type": "bar",
				"barMaxWidth": "30",
				"data": [3, 4, 2, 6, 4, 28, 5, 3, 4, 40, 6, 4, 8, 3, 4, 2, 6, 4, 68, 5, 3, 4, 2, 6, 74, 8, 4, 2, 56, 4, 8],
				itemStyle: {
					//通常情况下：每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
					normal: {
						color: function(params) {
							var colorList = ['#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7'];
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

		/////////////////////周报表/////////////////////////
		var weekecharts = {
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

			grid: {
				left: '5%',
				right: '5%',
				top: '10%',
				bottom: '20%',
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
				data: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"]

			}],
			yAxis: [{
				type: 'value',
				min: 0,
				max: 100,
				splitNumber: '5',
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
				name: '会员',
				"type": "bar",
				"barMaxWidth": "30",
				"data": [63, 34, 62, 36, 54, 58, 95],
				itemStyle: {
					//通常情况下：每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
					normal: {
						color: function(params) {
							var colorList = ['#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7'];
							return colorList[params.dataIndex];
						},

						label: {
							show: true,
							position: 'top',
							formatter: '{c}'
						}
					},
					//鼠标悬停时：
					emphasis: {
						shadowBlur: 0.15,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}

			}]
		};
		/////////////////////日报表/////////////////////////
		var dayecharts = {
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

			grid: {
				left: '5%',
				right: '5%',
				top: '10%',
				bottom: '20%',
				containLabel: true
			},

			xAxis: [{
				show: true,
				type: 'category',
				axisLabel: {
					interval: 0,
					rotate: 55,
					textStyle: {
						color: '#aaa'
					}
				},
				axisLine: {
					lineStyle: {
						color: '#f4f4f4'

					}
				},

				data: ["00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00", "05:00-06:00", "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-24:00"]

			}],

			yAxis: [{
				type: 'value',
				min: 0,
				max: 100,
				splitNumber: '5',
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
				name: '会员',
				"type": "bar",
				"barMaxWidth": "30",
				"data": [3, 4, 2, 6, 4, 2, 6, 4, 4, 8, 4, 2, 6, 4, 4, 2, 4, 2, 6, 4, 6, 4, 5],
				itemStyle: {
					//通常情况下：每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
					normal: {
						color: function(params) {
							var colorList = ['#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6', '#45a6f7', '#9b89b6'];
							return colorList[params.dataIndex];
						},

						label: {
							show: true,
							position: 'top',
							formatter: '{c}'
						}
					},
					//鼠标悬停时：
					emphasis: {
						shadowBlur: 0.15,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}

			}]
		};

		function ObjectResize(fn) {
			if (window.addEventListener) {
				window.addEventListener("resize", fn, false);
			} else {
				window.attachEvent("onresize", fn)
			}
		}
		$(".diagramtab ul li a").click(function() {
			var dateattr = $(this).attr("dateattr");
			$(this).parent().addClass("active").siblings().removeClass("active");
			var myChart = echarts.init(document.getElementById('containermap'));
			if (dateattr == "yearecharts") {
				myChart.setOption(yearecharts);
			} else if (dateattr == "monthecharts") {
				myChart.setOption(monthecharts);
			} else if (dateattr == "weekecharts") {
				myChart.setOption(weekecharts);

			} else if (dateattr == "dayecharts") {
				myChart.setOption(dayecharts);
			}
			ObjectResize(myChart.resize);

		})
	}
	return {
		init: memberListInit
	};
})