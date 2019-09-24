define(['jquery', 'async!AMap', 'async!GMap'],
function($) {
	var aMap = {
		// 地图
		mapsed: function(mapset) {
			var mapsetObj = mapset;
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
					if(mapsetObj.houzhui)houzhui=mapsetObj.houzhui;
					if(houzhui.indexOf('.')<0)houzhui='.'+houzhui;
					if(mapsetObj.pngx.indexOf(x)>=0||mapsetObj.pngy.indexOf(y)>=0)houzhui='.png';
					return mapsetObj.mapurl+ z + '/sh' + x + '_' + y + houzhui;  //根据当前坐标，选取合适的瓦片图
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
//				return false;
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
	
	var baiduMap = {
		// 地图
		mapsed: function(mapset) {
			var mapsetObj = mapset;
			var point;
			var map = new BMap.Map('custom_places');//初始化手绘地图
			var tileLayer = new BMap.TileLayer({isTransparentPng: true});//isTransparentPng: true 瓦片是否是png格式 false就是jpg
			tileLayer.getTilesUrl = function(tileCoord, zoom) {
				var x = tileCoord.x;
				var y = tileCoord.y;
				var houzhui='.jpg';
				if(mapsetObj.pngx.indexOf(x)>=0||mapsetObj.pngy.indexOf(y)>=0)houzhui='.png';
				return mapsetObj.mapurl+ zoom + '/sh' + x + '_' + y + houzhui;  //根据当前坐标，选取合适的瓦片图
			}
			map.addTileLayer(tileLayer);//加载手绘地图层
			//var MyMap = new BMap.MapType('MyMap', tileLayer, {minZoom: 13, maxZoom: 19});
			//var map = new BMap.Map('custom_places', {mapType: MyMap});//不显示百度地图，全部显示手绘
			window.map = map;
			//当前点标注
			var lng = $("#lng").val();
			var lat = $("#lat").val();
			var address = $("#address").val();
			if(lng==""||lat==""){
				point = new BMap.Point(mapsetObj.longitude, mapsetObj.latitude);
			}
			else{
				point = new BMap.Point(lng, lat);
			}
			map.centerAndZoom(point, mapsetObj.defaultlevel);
			var marker = new BMap.Marker(point); // 创建标注
			map.addOverlay(marker); // 将标注添加到地图中
			map.enableScrollWheelZoom(true); //启用滚轮放大缩小，默认禁用
			map.addControl(new BMap.OverviewMapControl({
				isOpen: true,
				anchor: BMAP_ANCHOR_BOTTOM_RIGHT
			})); // 右下角，打开
			var localSearch = new BMap.LocalSearch(map);
			localSearch.enableAutoViewport(); // 允许自动调节窗体大小
			/*鼠标点击获取经纬度 begin*/
			map.addEventListener("click",function(e) {
				$("#lng").val(e.point.lng);
				$("#lat").val(e.point.lat);
				baiduMap.geocoder();
			});
			map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
			/*鼠标点击获取经纬度 end*/
			//逆地址
			$('#lng').blur(function() {
				if ($('#lng').val() != '' && $('#lat').val() != ''&&$("#address").val()=="") {
					baiduMap.geocoder();
				}
			});
			$('#lat').blur(function() {
				if ($('#lng').val() != '' && $('#lat').val() != ''&&$("#address").val()=="") {
					baiduMap.geocoder();
				}
			})
			var ac = new BMap.Autocomplete({ // 建立一个自动完成的对象
				"input": "address",
				"location": map
			});
			ac.setInputValue($("#address").val());
			ac.addEventListener("onhighlight",function(e) { // 鼠标放在下拉列表上的事件
				var _value = e.fromitem.value;
				var value = "";
				if (e.fromitem.index > -1) {
					value = _value.province + _value.city + _value.district + _value.street + _value.business;
					value = value.replace(/[\(]/g, '（').replace(/[\)]/g, '）');
					$("#address").attr("value", value);
				}
				value = "";
				if (e.toitem.index > -1) {
					_value = e.toitem.value;
					value = _value.province + _value.city + _value.district + _value.street + _value.business;
					value = value.replace(/[\(]/g, '（').replace(/[\)]/g, '）');
					$("#address").attr("value", value);
				}
			});
			$('#searchArea').click(function() {
				baiduMap.addressgeocoder();
			})

		},
		//地理解析 地址-经纬度
		addressgeocoder: function() {
			var address = document.getElementById('address').value;
			// 创建地址解析器实例
			var myGeo = new BMap.Geocoder();
			var pointObj = {};
			// 将地址解析结果显示在地图上,并调整地图视野
			myGeo.getPoint(address,
			function(point) {
				if (point) {
					pointObj = {
						lngX: point.lng,
						latY: point.lat,
						address: address
					};
					$('#lng').val(point.lng);
					$('#lat').val(point.lat);
					baiduMap.addmarker(pointObj);
				}
			},"");
		},
		//反地理解析  经纬度-地址
		geocoder: function() {
			//已知点坐标
			var lng = document.getElementById('lng').value;
			var lat = document.getElementById('lat').value;
			if($("#address").val()!=""){
				baiduMap.addmarker({lngX: lng,latY: lat});
				return false;
			}
			var lnglatXY = new BMap.Point(lng, lat);
			var myGeo = new BMap.Geocoder();
			var pointObj = {};
			//开始将经纬度解析成地理位置
			myGeo.getLocation(lnglatXY,
			function(rs) {
				pointObj = {
					lngX: lng,
					latY: lat,
					address: rs.address
				};
				$('#address').val(rs.address);
				baiduMap.addmarker(pointObj);
			});
		},
		//添加标注点
		addmarker: function(pointObj) {
			map.clearOverlays();
			var point = new BMap.Point(pointObj.lngX, pointObj.latY);
			var marker = new BMap.Marker(point); // 创建标注
			map.addOverlay(marker); // 将标注添加到地图中
		}
	}
	var mapInit = function(mapset) {
		var mapsetObj = JSON.parse(mapset);
		if(mapsetObj.maptype=="baidu"){
			baiduMap.mapsed(mapsetObj);
		}
		else if(mapsetObj.maptype=="gaode"){
			aMap.mapsed(mapsetObj);
		}
		
	}
	return {
		init: mapInit
	};
});