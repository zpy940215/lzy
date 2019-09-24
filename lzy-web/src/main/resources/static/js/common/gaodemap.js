define(['jquery', 'async!AMap'],
function($) {
	var aMap = {
		// 地图
		mapsed: function(mapset) {
			var mapsetObj = JSON.parse(mapset);
			var map = new AMap.Map('custom_places', {
				resizeEnable: true
			});
			window.map = map;
			//当前点标注
			var lng = $("#lng").val();
			var lat = $("#lat").val();
			var address = $("#address").val();
			if(lng==""||lat==""){
				map.setZoomAndCenter(mapsetObj.defaultlevel,[mapsetObj.longitude, mapsetObj.latitude]);
				aMap.addmarker(mapsetObj.longitude, mapsetObj.latitude);
			}
			else{
				map.setZoomAndCenter(mapsetObj.defaultlevel,[lng,lat]);
				aMap.addmarker(lng, lat);
			}
			
			var mapLayer = null;
		    // 添加手绘图层
	        mapLayer = new AMap.TileLayer({
	        	getTileUrl:function(x, y,z){
					var houzhui='.jpg';
					if(mapsetObj.pngx.indexOf(x)>=0||mapsetObj.pngx.indexOf(y)>=0)houzhui='.png';
					return "${(base)!''}"+mapsetObj.mapurl+ z + '/sh' + x + '_' + y + houzhui;  //根据当前坐标，选取合适的瓦片图
				},
	        	zIndex:100
	        });
	        mapLayer.setMap(map);
			
			/*鼠标点击获取经纬度 begin*/
			//为地图注册click事件获取鼠标点击出的经纬度坐标
		    var clickEventListener = map.on('click', function(e) {
		        $("#lng").val(e.lnglat.getLng());
				$("#lat").val(e.lnglat.getLat());
				aMap.regeocoder();
		    });
		    /*鼠标点击获取经纬度 end*/
		    //逆地址
			$('#lng').blur(function() {
				if ($('#lng').val() != '' && $('#lat').val() != ''&&$("#address").val()=="") {
					aMap.regeocoder();
				}
			});
			$('#lat').blur(function() {
				if ($('#lng').val() != '' && $('#lat').val() != ''&&$("#address").val()=="") {
					aMap.regeocoder();
				}
			});
			//为地图注册click事件获取鼠标点击出的经纬度坐标
		    var clickEventListener = map.on('click', function(e) {
		        $("#lng").val(e.lnglat.getLng());
				$("#lat").val(e.lnglat.getLat());
				aMap.regeocoder();
		    });
		    AMap.plugin('AMap.Autocomplete',function(){//回调函数
			    var autoOptions = {
			        city: "", //城市，默认全国
			        input:"address"//使用联想输入的input的id
			    };
			    var autocomplete= new AMap.Autocomplete(autoOptions);
			    AMap.event.addListener(autocomplete, "select", function(e){
			        //TODO 选择后的处理程序，data的格式见 附录
			    	if (e.poi && e.poi.location) {
			            map.setZoom(15);
			            map.setCenter(e.poi.location);
			        }
			    }); 
			});
			//注册监听，当选中某条记录时会触发
		    $(".js_map_dengji").change(function(){
		    	map.setZoom($(this).val());
		    });
		    $('#searchArea').click(function() {
				aMap.geocoder();
			})
		},
		//地理解析 地址-经纬度
		geocoder: function() {
			var address = $('#address').val();
			if(address==""){
				$(".js_errortip_geocoder").html("请输入有效地址");
				return false;
			}
			$(".js_errortip_geocoder").html("");
			
			AMap.plugin('AMap.Geocoder',function(){//回调函数
			    var geocoder = new AMap.Geocoder();
		        //地理编码,返回地理编码结果
		        geocoder.getLocation(address, function(status, result) {
		            if (status === 'complete' && result.info === 'OK') {
		                var resultStr = "";
				        //地理编码结果数组
				        var geocode = result.geocodes;
				        for (var i = 0; i < geocode.length; i++) {
				        	resultStr += "<span style=\"font-size: 12px;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\">" + "<b>地址</b>：" + geocode[i].formattedAddress + "" + "&nbsp;&nbsp;<b>的地理编码结果是:</b><b>&nbsp;&nbsp;&nbsp;&nbsp;坐标</b>：" + geocode[i].location.getLng() + ", " + geocode[i].location.getLat() + "" + "<b>&nbsp;&nbsp;&nbsp;&nbsp;匹配级别</b>：" + geocode[i].level + "</span>";
				        }
				        aMap.addmarker(geocode[0].location.getLng(),geocode[0].location.getLat());
				        map.setFitView();
				        console.log(resultStr);
		            }
		            else if(status==='no_data'){
		            	$(".js_errortip_geocoder").html("没有查到该地址相应坐标");
		            }
		        });
			});
		},
		//反地理解析  经纬度-地址
		regeocoder: function() {
			//已知点坐标
			var lng = document.getElementById('lng').value;
			var lat = document.getElementById('lat').value;
			if($("#address").val()!=""){
				aMap.addmarker(lng,lat);
				return false;
			}
			var lnglatXY =  [lng,lat];
			AMap.plugin('AMap.Geocoder',function(){//回调函数
				var geocoder = new AMap.Geocoder({
		            radius: 1000,
		            extensions: "all"
		        });        
		        geocoder.getAddress(lnglatXY, function(status, result) {
		            if (status === 'complete' && result.info === 'OK') {
		                var address = result.regeocode.formattedAddress; //返回地址描述
	        			$("#address").val(address);
	        			aMap.addmarker(lng,lat);
		            }
		        });
			});
		},
		//添加标注点
		addmarker: function(lngX,latY) {
			map.clearMap();  // 清除地图覆盖物
			//添加点标记，并使用自己的icon
		    new AMap.Marker({
		        map: map,
				position: [lngX,latY],
		        icon: new AMap.Icon({            
		            size: new AMap.Size(40, 50),  //图标大小
		            image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
		            imageOffset: new AMap.Pixel(0, -60)
		        })        
		    });
		}
	}
	var aMapInit = function(mapset) {
		aMap.mapsed(mapset);
	}
	return {
		init: aMapInit
	};
});