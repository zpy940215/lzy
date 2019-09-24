define(['jquery', 'async!GMap'],

function($) {

	var baiduMap = {
		// 地图
		mapsed: function(mapset) {
			var mapsetObj = JSON.parse(mapset);
			var point;
			var map = new BMap.Map('custom_places');//初始化手绘地图
			var tileLayer = new BMap.TileLayer({isTransparentPng: true});//isTransparentPng: true 瓦片是否是png格式 false就是jpg
			tileLayer.getTilesUrl = function(tileCoord, zoom) {
				var x = tileCoord.x;
				var y = tileCoord.y;
				var houzhui='.jpg';
				if(mapsetObj.pngx.indexOf(x)>=0||mapsetObj.pngx.indexOf(y)>=0)houzhui='.png';
				return "${(base)!''}/"+mapsetObj.mapurl+ zoom + '/sh' + x + '_' + y + houzhui;  //根据当前坐标，选取合适的瓦片图
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
	var baiduMapInit = function(mapset) {
		baiduMap.mapsed(mapset);
	}
	return {
		init: baiduMapInit
	};
});