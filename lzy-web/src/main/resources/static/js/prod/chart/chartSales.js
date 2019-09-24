define(['jquery','common','echarts'], function($, common,echarts){
var indexListInit = function(){
	//订单量柱形图
	var salesBarChart=echarts.init(document.getElementById("chartSales_l"));
	var salesBarOption = {
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow',
	        },
	    },
	    toolbox: {
	        show : true,
	        x:'88%',
	        top:'45',
	        feature : {
	            magicType : {show: true, type: ['line', 'bar']},
	        }
	    },
	    legend: {
	        data: ['已支付', '创建', '取消'],
	        right: 'center',
	        top:'30',
	        selected: {'创建': false,'取消': false}
	    },
	    grid: {
	        left: '30',
	        right: '30',
	        top:'80',
	        bottom: '40',
	        containLabel: true
	    },
	    dataZoom: [
	        {
	            type:'inside',
	        }
	    ],
	    xAxis: {
	         type: 'category',
	          axisLine:{
	                lineStyle:{
	                    color:'#e6e6e6',
	                  
	                }
	            },
	            axisLabel: {
	                    textStyle: {
	                        color: '#666'
	                    }
	                },
	        data: ['03-21','03-22','03-23','03-24','03-25','03-26','03-27']
	       
	    },
	    yAxis: {
	        type: 'value',
	        'splitNumber':'4' , 
	         axisLine:{
	                lineStyle:{
	                    color:'#e6e6e6',
	                  
	                }
	            },
	            axisLabel: {
	                    textStyle: {
	                        color: '#666',
	                    },
	
	                },
	           splitLine: {
	             lineStyle:{
	                    color:'#e6e6e6',
	                  
	                }
	        },
	        boundaryGap: [0, 0.01]
	    },
	    series: [
	        {
	            name: '已支付',
	            type: 'bar',
	            smooth:true,
	            itemStyle : { normal: {label : {show: true, position: 'top'}}},
	            "barMaxWidth":"20",
	            data: [182, 2317, 291, 1704, 131, 60,700]
	        },
	        {
	            name: '创建',
	            type: 'bar',
	            smooth:true,
	            itemStyle : { normal: {label : {show: true, position: 'top'}}},
	            "barMaxWidth":"20",
	            data: [196, 234, 316, 124, 74, 68,70]
	        },
	        {
	            name: '取消',
	            type: 'bar',
	            smooth:true,
	            itemStyle : { normal: {label : {show: true, position: 'top'}}},
	            "barMaxWidth":"20",
	            data: [ 23, 316, 121, 134,96, 68,70]
	        }
	    ],
	     color: ['#7297db','#66cda7','#f3c562'],
	};
	salesBarChart.setOption(salesBarOption);
	ObjectResize(salesBarChart.resize);
	//订单量环形图
	var AmountsBarChart=echarts.init(document.getElementById("chartSales_r"));
	var AmountsBarOption = {
		   title: {
		        text: '订单量',
		        subtext: '2000000.00',
		        textStyle:{
		        	fontWeight:'normal'
		        },
		        x: 'center',
		        y: '40%'
		   },
	        tooltip : {
	            trigger: 'item',
	            formatter:"{a} <br/>{b}：{c} ({d}%)"
	        },
	        legend: {
	            orient: 'horizontal',
		         x : 'center',
		         y : '80%',
	             selectedMode:false,
	             itemWidth:10,
	             itemHeight:10,
	            data: ['已支付','创建','取消']
	        },
	        series : [
	            {
	                name: '订单量',
	                type: 'pie',
	                radius : ['35%', '55%'],
	                center: ['50%', '45%'],
	                data:[
	                    {value:54, name:'已支付'},
	                    {value:30, name:'创建'},
	                    {value:16, name:'取消'}
	                ],
	                itemStyle: {
	                  normal:{
		                         label:{
			                         show:true,
			                         formatter: '{b} ({c})',
		                         },
		                         labelLine:{
		                         	show:true
		                         }
	                         },
	                    emphasis: {
	                        shadowBlur: 10,
	                        shadowOffsetX: 0,
	                        shadowColor: 'rgba(0, 0, 0, 0.5)',
	                        
	                    }
	                }
	            }
	        ],
	        color: ['#7297db','#66cda7','#f3c562'],
	   };
	AmountsBarChart.setOption(AmountsBarOption);
	ObjectResize(AmountsBarChart.resize);
	//销售额柱形图
	var amountBarOption = {
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow',
	        },
	    },
	    toolbox: {
	        show : true,
	        x:'88%',
	        top:'45',
	        feature : {
	            magicType : {show: true, type: ['line', 'bar']},
	        }
	    },
	    legend: {
	        data: [''],
	        right: 'center',
	        top:'3%'
	    },
	    grid: {
	        left: '30',
	        right: '30',
	        top:'80',
	        bottom: '40',
	        containLabel: true
	    },
	    dataZoom: [
	        {
	            type:'inside',
	        }
	    ],
	    xAxis: {
	         type: 'category',
	          axisLine:{
	                lineStyle:{
	                    color:'#e6e6e6',
	                  
	                }
	            },
	            axisLabel: {
	                    textStyle: {
	                        color: '#666'
	                    }
	                },
	        data: ['03-21','03-22','03-23','03-24','03-25','03-26','03-27']
	       
	    },
	    yAxis: {
	        type: 'value',
	        'splitNumber':'4' , 
	         axisLine:{
	         		show:true,
	                lineStyle:{
	                    color:'#e6e6e6',
	                }
	            },
	            axisLabel: {
	                    textStyle: {
	                        color: '#666',
	                    },
	
	                },
	           splitLine: {
	             lineStyle:{
	                    color:'#e6e6e6',
	                }
	        },
	        boundaryGap: [0, 0.01]
	    },
	    series: [
	        {
	            name: '',
	            type: 'bar',
	            smooth:true,
	            "barMaxWidth":"20",
	            itemStyle : { normal: {label : {show: true, position: 'top'}}},
	            data: [1317744, 602301,704970,1827031, 2317489, 291734, 1704970]
	        }
	    ],
	     color: ['#45a6f7','#9b89b6','#ccc'],
	};
	//销售额环形图
	var amountCircleOption = {
		   title: {
		   		show:true,
		        text: '销售额',
		        textStyle:{
		        	fontWeight:'normal'
		        },
		        subtext: '2000000.00',
		        x: 'center',
		        y: '45%'
		   },
	        tooltip : {
	            trigger: 'item',
	            formatter:"{a} <br/>{b}：{c} ({d}%)"
	        },
	        legend: {
	            orient: 'horizontal',
		         x : 'center',
		         y : '80%',
	             selectedMode:false,
	             itemWidth:10,
	             itemHeight:10,
	            data: ['已支付','创建','取消']
	        },
	        series : [
	            {
	                name: '销售额',
	                type: 'pie',
	                radius : ['35%', '55%'],
	                center: ['50%', '50%'],
	                data:[
	                    {value:16, name:'03-21'},
	                    {value:30, name:'03-22'},
	                    {value:54, name:'03-23'},
	                    {value:16, name:'03-24'},
	                    {value:30, name:'03-25'},
	                    {value:54, name:'03-26'},
	                    {value:16, name:'03-27'} 
	                ],
	                itemStyle: {
	                  normal:{
		                         label:{
			                         show:true,
			                         formatter: '{b} ({c})',
		                         },
		                         labelLine:{
		                         	show:true
		                         }
	                         },
	                    emphasis: {
	                        shadowBlur: 10,
	                        shadowOffsetX: 0,
	                        shadowColor: 'rgba(0, 0, 0, 0.5)',
	                        
	                    }
	                }
	            }
	        ],
	        color:[
		        '#2ec7c9','#f3c562','#5ab1ef','#ffb980','#d87a80',
		        '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
		        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
		        '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
		    ]
	   };

    function ObjectResize(fn){
	    if(window.addEventListener)
	    {
	    window.addEventListener("resize",fn,false);
	    }
	    else
	    {
	    window.attachEvent("onresize",fn)
	    }
    }  
    

	//开始结束月份选择
	function monthselect(startdate,enddate){
		$(startdate).datepicker({
			dateFormat : 'yy-mm',
			dayNamesMin : ['日','一','二','三','四','五','六'],
			monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			yearSuffix:'年',
			showMonthAfterYear:true,
			showOtherMonths:true	               
	   	});
	   	$(enddate).datepicker({
			dateFormat : 'yy-mm',
			dayNamesMin : ['日','一','二','三','四','五','六'],
			monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			yearSuffix:'年',
			showMonthAfterYear:true,
			showOtherMonths:true,
			             
	   	});
	   $(startdate).datepicker('setDate', new Date());
	   $(enddate).datepicker('setDate', new Date());
	};  
     $(".part2 .tit span").click(function(){
         var typeattr=$(this).attr("typeattr");
         $(this).addClass("active").siblings().removeClass("active");
         var myChart_l= echarts.init(document.getElementById('chartSales_l'));
         var myChart_r= echarts.init(document.getElementById('chartSales_r'));
         if(typeattr=="sales"){
        	 myChart_l.setOption(salesBarOption);
        	 myChart_r.setOption(AmountsBarOption);
         }
         else if(typeattr=="salesAmount")
         {
	          myChart_l.setOption(amountBarOption);
	          myChart_r.setOption(amountCircleOption);
         }
        ObjectResize(myChart_l.resize);

    }) 
    $('.search-bar span').click(function(){
    	$(this).addClass("active").siblings().removeClass("active");
    })
    $('.search-head i').click(function(){
    	$('.barBox').toggle();
    	$('.search-head i').toggleClass('arrowUp arrowDown');
    	$('.part1').toggleClass('h1');
    	$('.part2').toggleClass('h1');
  		$('.filter').toggleClass('h1');
  		$('.part2 .active').click();
    })
    $('.js_dayselect .datetype').click(function(){
    	var datetype=$(this).attr('datetype');//alert(datetype);
    	if(datetype=='typeDay'){
    		$('.js_day').show().siblings('.js_month,.js_year').hide();
    	}else if(datetype=='typeMonth'){
    		$('.js_month').show().css('display',"inline-block").siblings('.js_year,.js_day').hide();
    		monthselect('.js_start_month','.js_end_month');
    	}else if(datetype=='typeYear'){
    		$('.page-form').show().css('display',"inline-block").siblings('.js_month,.js_day').hide();
    	}
    })   
}
return {
        init:indexListInit
    };
})    