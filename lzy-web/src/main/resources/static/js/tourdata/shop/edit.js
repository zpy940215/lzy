define(['jquery', 'common', 'jqueryui', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'moment', 'stay', 'viewer', 'main','base64', 'bdueditor', 'ueditorlang'],
function($, common, jqueryui, ztree, Handlebars, HandlebarExt, diyUpload, moment, stay, viewer, main,base64, UE) {
	var delPics = new Array();
	var editList = {
		isAjaxing: false,
		pageSize: 15,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		saveView: function() {
			var checkResult = true;
			var dataget=new Object();
			var viewname = $("#viewname").val();
			var areaId = $("#areaId").val();
			var address = $("#address").val(); //之前是$("#address").attr("value"),用用属性值保存有问题
			var vid = $("#id").attr("value");
			var viewId = $("#viewid").val();
			var areaCode = $("#js_status").find("option:checked").attr("value");
			var viewSmallType = $("#viewType").find("option:checked").attr("value");
			var lng = $("#lng").val();
			var lag = $("#lat").val();
			var viewIcon = $(".js_viewIcon").val();

			//select下拉框值
			var options = $("#selectId option:selected"); //获取选中的项
			var viewareaId = options.val();
			//					alert(options.val()); 
			//最低价
			var lowerPrice = $("#floorPrice").val();

			var mobile = $("#mobile").val();

			//推荐指数
			var isRecommentOption = $("#isRecommentStar option:selected");
			var starOption = isRecommentOption.val();

			// 获取复选框值tags
			var tags = document.getElementsByName("viewVo.tags"); // 选择所有name="viewtags"的对象，返回数组
			var viewtags = ''; // 如果这样定义var s;变量s中会默认被赋个null值
			for (var i = 0; i < tags.length; i++) {
				if (tags[i].checked) { // 取到对象数组后，我们来循环检测它是不是被选中
					var j = tags.length;
					if ((i + 1) == j) {
						viewtags += tags[i].value; // 如果选中，将value添加到变量s中
					} else {
						viewtags += tags[i].value + ','; // 如果选中，将value添加到变量s中
					}
				}

			}
			var viewfacs = '';
			var facs = document.getElementsByName("viewVo.facs");
			for (var i = 0; i < facs.length; i++) {
				var size = facs.length;
				if (facs[i].checked) { // 取到对象数组后，我们来循环检测它是不是被选中
					if ((i + 1) == size) {
						viewfacs += facs[i].value; // 如果选中，将value添加到变量s中
					} else {
						viewfacs += facs[i].value + ','; // 如果选中，将value添加到变量s中
					}
				}

			}
			
			//图片
			var length=$('.js_pic .picinsert').length;
			if (length == 0) {
				viewIcon = '';
			}
			$('.js_pic .picinsert').each(function(){
				var thisindex=$(this).index();
				var urlPath=$(this).find('img').attr('_src');
				var picId = $(this).find('img').attr('picid');
				var pos = length - thisindex;
				dataget['picVoList['+thisindex+'].id']=picId;
				dataget['picVoList['+thisindex+'].urlPath']=urlPath;
				dataget['picVoList['+thisindex+'].pos']=pos;
			});

			//音频
			var audioInfo=$('.js_radio_items').length;
			for(var i=0;i<audioInfo;i++){
				var languageSelect=$('.js_radio_items').eq(i).find('.js_file_ext'),

					fileExt=languageSelect.find("option:checked").attr("value"),
					link=$('.js_radio_items').eq(i).find('.js_file_path').val(),
					name=$('.js_radio_items').eq(i).find('.js_file_name').val(),
					filePath=$('.js_radio_items').eq(i).find('.audioUrl').val(),
					description=$('.js_radio_items').eq(i).find('.js_description').val(),
					sourceId=$('.js_radio_items').eq(i).find('.sourceId').val(),


					showType=$('.js_radio_items').eq(i).find('.js_radio_type').find(".js_radio_select:checked").attr("value");

				dataget['resourceVoList['+i+'].fileExt']=fileExt;
				dataget['resourceVoList['+i+'].filePath']=filePath;
				dataget['resourceVoList['+i+'].name']=name;
				dataget['resourceVoList['+i+'].description']=description;
				dataget['resourceVoList['+i+'].link']=link;
				dataget['resourceVoList['+i+'].status']="open";
				dataget['resourceVoList['+i+'].id']=sourceId;
				dataget['resourceVoList['+i+'].showType']=showType;

			}

			var base64 = new Base64();
			// 描述图文上传
			var ue = UE.getEditor('Ueditor');
			var js_viewVodescription = ue.getContent();
			// 进行加密
			var js_viewVodescriptionEncode = base64.encode(js_viewVodescription);

			$("#Ueditor").val(js_viewVodescriptionEncode);
			// 詳細图文上传
			var ue2 = UE.getEditor('Ueditor2');
			var js_viewVodescription2 = ue2.getContent();
			// 进行加密
			var js_viewVodescriptionEncode2 = base64.encode(js_viewVodescription2);

			$("#Ueditor2").val(js_viewVodescriptionEncode2);
			// 須知图文上传
			var ue3 = UE.getEditor('Ueditor3');
			var js_viewVodescription3 = ue3.getContent();
			// 进行加密
			var js_viewVodescriptionEncode3 = base64.encode(js_viewVodescription3);

			$("#Ueditor3").val(js_viewVodescriptionEncode3);

			if (!common.validate.checkEmpty('#viewname', '请输入景点名称！')) {
				checkResult = false;
			}

			if (areaCode != null) {
				checkResult = false;
			}
			/*if (!common.validate.checkEmpty('#lng', '请选中景区所在点')) {
						checkResult = false;
					}
					if (!common.validate.checkEmpty('#lat', '请选中景区所在点')) {
						checkResult = false;
					}*/
			if (!common.validate.checkEmpty('#selectId', '请选择所属区域！')) {
				checkResult = false;
			}
			if (!checkResult) {
				// project.isAjaxing=false;
				editList.isAjaxing = false;
				return false;
			}
			/*
					 * if(checkResult){ $.ajax({ type : 'POST', data:new
					 * FormData($('#view_fromcontent')[0]), dataType : "json",
					 * processData : false, contentType : false, url :
					 * '${base}/view!save.ajax', success : function(data) { if
					 * (data.code == "success") { alert("xxx");
					 * window.location.href =
					 * '${base}/tourdata/scenic/list.html'; return; } }, error :
					 * function(e){
					 *  } }); }
					 */
			if (editList.isAjaxing) {
				return false;
			}
			editList.isAjaxing = true;
			editList.deletePic();

			//封装参数
			dataget['viewVo.id']=vid;
			dataget['viewVo.lvl']= "1";
			dataget['viewVo.type']= "shop";
			dataget['viewVo.smallType']= viewSmallType;
			dataget['viewVo.name']= viewname;
			dataget['viewVo.address']= address;
			dataget['viewVo.areaId']= viewareaId;
			dataget['viewVo.tags']= viewtags;
			dataget['viewVo.facs']= viewfacs;
			dataget['viewVo.longitude']= lng;
			dataget['viewVo.latitude']= lag;
			dataget['viewVo.description']= js_viewVodescriptionEncode;
			dataget['viewVo.content']= js_viewVodescriptionEncode2;
			dataget['viewVo.attention']= js_viewVodescriptionEncode3;
			dataget['viewVo.viewId']= viewId;
			dataget['viewVo.recommendIndex']= starOption;
			dataget['viewVo.price']= lowerPrice;
			dataget['viewVo.mobile']= mobile;
			dataget['viewVo.openingTime'] = $("#opentime").val();
			dataget['viewVo.businessTime'] = $("#bussinesstime").val();
			dataget['viewVo.icon'] = viewIcon;
			dataget['viewVo.otherSaleUrl'] = $('#otherSaleUrl').val();

			$.ajax({
				type: "post",
				url: "${base}/view!save.ajax",
				data: dataget,
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultMap) {
					editList.isAjaxing = false;
					common.base.loading("fadeOut");
					if (resultMap.code == "success") {
						editList.isAjaxing = false;
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '保存成功!',
							//提示语
							backFn: function(result) {
								if (result) {
									//返回列表
									window.location.href = '${base}/tourdata/shop/list.html';
								}
							}
						});

						$('.js_popUpCancel').on('click',
						function() {
							//编辑
							var editId = resultMap.data.viewVo.viewId;
							var viewType = resultMap.data.viewVo.type;
							if (editId != '' && viewType != '') {
								window.location.href = 'edit.html?viewVo.viewId=' + editId + '&viewVo.type' + viewType;
							}
						});

						return;
					} else {
						if (resultMap && resultMap.description) {
							alert(resultMap.description);
						} else if (resultMap && typeof(resultMap) == 'string') {
							alert(resultMap);
						} else {
							alert("出错了,请重试!");
						}
					}
				},
				error: function(e) {
					editList.isAjaxing = false;
					common.base.loading("fadeOut");
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						tipMesg: '操作异常',
						backFn: function(result) {}
					});
				}
			});
		},

		// 文本编辑器
		editListInit: function() {
			var ue = UE.getEditor('Ueditor');
			var ue2 = UE.getEditor('Ueditor2');
			var ue3 = UE.getEditor('Ueditor3');
		},
		// 地图
		mapsed: function() {
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
			map.addEventListener("click",
			function(e) {
				document.getElementById("lng").value = e.point.lng;
				document.getElementById("lat").value = e.point.lat;
				editList.geocoder();
			});
			map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
			/*鼠标点击获取经纬度 end*/
			var lng = document.getElementById("lng").value;
			var lat = document.getElementById("lat").value;
			var address = document.getElementById("address").value;
			/*if(lng!=''&& lat!=''){
		            	editList.geocoder();
		            }
		            else if(address!=''){
		            	editList.addressgeocoder();
		            }*/

			//逆地址
			$('#lng').blur(function() {
				if ($('#lng').val() != '' && $('#lat').val() != '') {
					editList.geocoder();
				}
			});
			$('#lat').blur(function() {
				if ($('#lng').val() != '' && $('#lat').val() != '') {
					editList.geocoder();
				}
			})

			var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
			{
				// "input" : "address",
				"input": "address",
				"location": map
			});
			ac.setInputValue($("#address").attr('value'));
			ac.addEventListener("onhighlight",
			function(e) { // 鼠标放在下拉列表上的事件
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
				editList.addressgeocoder();
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
					document.getElementById('lng').value = point.lng;
					document.getElementById('lat').value = point.lat;
					editList.addmarker(pointObj);
				}
			},
			"");
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
				document.getElementById('address').value = rs.address;
				editList.addmarker(pointObj);
			});

		},
		//添加标注点
		addmarker: function(pointObj) {
			map.clearOverlays();
			var point = new BMap.Point(pointObj.lngX, pointObj.latY);
			var marker = new BMap.Marker(point); // 创建标注
			map.addOverlay(marker); // 将标注添加到地图中
		},

		// 编辑页面表单编辑提交
		editform: function(picList) {
			//
			var datatime = $("#opentime").attr("value");
			if (datatime != '') {
				$("#opentime").val(datatime);
			}
			//展现形式切换
			$('.formradio input[name="displayform"]').click(function() {
				var dataattr = $(this).attr("data-index");
				$("#" + dataattr).show().siblings('.formtabbox').hide();
			})
			/*上传图片特效*/
			$(".editboxcon:eq(0)").show().siblings(".editboxcon").hide();

			$(".editboxbt span.editboxbtline").click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				var dataattr = $(this).attr("dataattr");
				$("#" + dataattr).show().siblings(".editboxcon").hide();
			});
			/*音频上传*/
			$(".editboxbt span.editboxbtline").click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				var dataattr = $(this).attr("dataattr");
				if(dataattr=='audioInfo'){
					//alert(1);

				}
				$("#" + dataattr).show().siblings(".editboxcon").hide();

			});
			//设置封面
			$(".picmaterialcon").on('click', '.setcover',function() {
				$(".setcover").removeClass("title").html("设为封面");
				$(this).addClass("title").html("封面图");
				var _src = $(this).parent('.js_picinsert').find('img').attr("_src");
				$(".picmaterialcon").prepend($(this).parent(".picinsert"));
				$(".js_viewIcon").val(_src);
			});
			//删除图片
			$(".picmaterialcon").on('click', '.js_Cancel',
			function() {
				var picsrc = $(this).parent('.picinsert').find('img').attr('_src');
				var picId = $(this).parent('.picinsert').find('img').attr('picId');
				$(this).parent('.picinsert').remove();
				//编辑时候异步删除图片
				//异步删除图片
				if (picId.length > 0) {
					editList.deletePic(picId);
				}

			})
			//图片拖动排序
			$("#sortable").sortable();
			$("#sortable").disableSelection();

			/*景区编辑页面基本信息提交*/
			var sceneryname = $("input[name='sceneryname']");
			var areaname = $("select[name='areaname']");
			sceneryname.bind('input propertychange',
			function() {
				if ($(this).val() != '') {
					$(this).siblings(".errortip").html('');
				}
			});
			areaname.bind('input propertychange',
			function() {
				if ($(this).val() != '请选择') {
					$(this).siblings(".errortip").html('');
				}
			});
			$("#upload_pic").click(function() {
				$.blockUI.defaults.css = {};
				$.blockUI({
					message: '<img src=\"${base}/js/ajax-loader.gif\" >',
					css: { //弹出元素的CSS属性
						top: '50%',
						left: '50%',
						background: 'none'
					}
				});
				setTimeout(function() {
					submitForm();
				},
				5000)

			});
			//删除图片
			$("div").on("click", ".js_Cancel",
			function() {
				var picId = $(this).next().attr('picId');
				delPics.push(picId);
				$(this).parents(".picinsert").remove();

			}),
			$("#basicscenicsave").click(function() {
				editList.saveView();
			});

		},
		ueedit: function(viewVoDescription, viewVoContent, viewVoAttention) {
			//判断ueditor 编辑器是否创建成功
			var ue = UE.getEditor('Ueditor', {
				wordCount: true,
				maximumWords: 200
			});
			ue.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue.setContent(base64.decode(viewVoDescription));

			});
			var ue2 = UE.getEditor('Ueditor2');
			ue2.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue2.setContent(base64.decode(viewVoContent));
			});

			var ue3 = UE.getEditor('Ueditor3');
			ue3.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue3.setContent(base64.decode(viewVoAttention));
			});
		},
		cancel: function() {
			$("#cancle").unbind("click");
			$("#cancle").click(function() {
				window.location.href = '${base}/tourdata/shop/list.html';
				//window.close();
			})
		},
		//本地上传与素材库tab切换
		uploadpic: function() {
			$('.js_picupload').unbind("click");
			$('.js_picupload').click(function() {
				$("#localupload").show().siblings(".picuploadbox").hide();
				$("span[dataattr='localupload']").addClass("active").siblings(".pictabtit").removeClass("active");
				editList.getMaterialPic();
			})
		},
		//获取素材库图片
		getMaterialPic: function(stadus) {
			$.ajax({
				url: '${base}/resource!queryResourceListPage.ajax',
				data: {
					"pageObject.page": editList.pageCur,
					"pageObject.pagesize": editList.pageSize,
					"resourceVo.name": $(".js_name").val(),
					"resourceVo.fileType": "pic"
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						console.log(resultData.data);
						//加载数据的处理
						if (stadus == "0") {
							var _templ = Handlebars.compile($("#material-save").html());
							$("#material-content").html(_templ(resultData.data));
						} else {
							var _templ = Handlebars.compile($("#uploadpic-save").html());
							$("#uploadpic-save-content").html(_templ());
							common.base.popUp(".js_popUpuploadpic");
							var _templ = Handlebars.compile($("#material-save").html());
							$("#material-content").html(_templ(resultData.data));

						}
						//初始化模板，才能操作模板中数据
						editList.popUpoperate();
						//分页
						editList.pageTotal = resultData.data.pagetotal;
						editList.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: editList.pageCur,
							pageTotal: editList.pageTotal,
							total: editList.total,
							backFn: function(p) {
								editList.pageCur = p;
								editList.getMaterialPic();
							}
						});
					} else {

						if (resultData && resultData.description) {
							//alert(resultData.description);
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
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '操作异常',
						//提示语
						backFn: function(result) {
							//alert(result);
						}
					});
				}
			});
		},
		//素材库搜索
		search: function() {
			$(document).on("click", ".js_search",
			function() {
				editList.pageCur = 1;
				editList.getMaterialPic("0");
			})
		},
		popUpoperate: function() {
			//本地上传
			$('#uploadpic').diyUpload({
				url: '${base}/view!uploadPic.action',
				success: function(data) {
					if(data.code == "success") {
						$(".viewThumb").each(function() {
							var picfile_src = $(this).find("img").attr("_src");
							if(data.data.picUrl==picfile_src){
								var picfile = $(this).find("img").attr("src");
								var pichtml = '<div class="picinsert js_picinsert fl"><div class="Cancel js_Cancel"></div><img _src="'+picfile_src+'" src=' + picfile + '><em  class="setcover" >设为封面</em></div>';
								if($(".js_picinsert").length==0){
									pichtml = '<div class="picinsert js_picinsert fl"><div class="Cancel js_Cancel"></div><img _src="'+picfile_src+'" src=' + picfile + '><em  class="setcover title" >封面图</em></div>';
									$(".js_viewIcon").val(picfile_src);
								}
								$(".js_picupload").before(pichtml);
							}
						});
					} else {
						alert(data.description);
					}
					// editList.save();
				},
				error: function(err) {
					console.info(err);
				}
			});
			//tab切换
			$(".pictabtit").click(function() {

				var dataattr = $(this).attr("dataattr");
				$("#" + dataattr).show().siblings(".picuploadbox").hide();
				$(this).addClass("active").siblings(".pictabtit").removeClass("active");
				if (dataattr == 'materialupload') {
					//editList.getMaterialPic();
					editList.search();
				}
			})
			//选择素材
			$('ul.materiallist li').unbind('click');
			$("ul.materiallist").on('click', 'li',
			function() {
				if ($(this).hasClass("active")) {

					$(this).find(".checkpic").prop("checked", false);
					$(this).removeClass("active");
				} else {

					$(this).addClass("active");
					$(this).find(".checkpic").prop("checked", true);

				}

			})
			//保存选择的素材
			$(document).on("click", "#addmaterialpic",
			function() {
				var length = 0;
				var total = $("ul.materiallist li.active").length;
				$("ul.materiallist li.active").each(function() {
					var picfile = $(this).find(".materiapic img").attr("src");
					var picUrl = picfile.split("appfile")[1];
					var pichtml = '<div class="picinsert js_picinsert fl"><div class="Cancel js_Cancel"></div><img src=' + picfile + ' _src=' + picUrl + '><em  class="setcover" >设为外观</em></div>';
					$(".picupload").before(pichtml);
					length++;
				});
				if (length == total) {

					$(".popup").removeClass("popupstyle");
					$(".popup").html("");
				}
			})

			//保存上传素材库图片（公用素材库地址）
			$("#uploadsave").click(function() {
				$(".popup").hide();
			})
		},
		//删除图片
		deletePic: function() {
			var i = delPics.length;
			while (i--) {
				var picId = delPics[i];
				$.ajax({
					type: "post",
					url: "${base}/view!deletePic.ajax",
					data: {
						"viewVo.picId": picId
					},
					dataType: "json",
					success: function(resultMap) {
						if (resultMap.code == "success") {} else {
							if (resultMap && resultMap.description) {
								alert(resultMap.description);
							} else if (resultMap && typeof(resultMap) == 'string') {
								alert(resultMap);
							} else {
								alert("出错了,请重试!");
							}
						}
					},
					error: function(e) {}
				});
			}
		},
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		inputType: function() {
			$(".js_radio_select").each(function() {
				if($(this).attr("checked")){
					var dataNum= $(this).attr('data-index');
					var thisparent = $(this).parents(".js_radio_items");
					thisparent.find(".js_radio_item").css("display","none");
					thisparent.find(".js_radio_item"+dataNum).css("display","block");
				}
			});
			$('.js_radio_select').unbind("click");
			$('.js_radio_select').on('click',function() {
				var dataNum= $(this).attr('data-index');
				var thisparent = $(this).parents(".js_radio_items");
				thisparent.find(".js_radio_item").css("display","none");
				thisparent.find(".js_radio_item"+dataNum).css("display","block");

				var thisindex=$(this).attr('data-index');
				if(thisindex=='2'){
					$(".uploadpic").each(function(){
						var thisid=$(this).attr('id');
						$("#"+thisid).diyUpload({
							url: "${base}/resource!uploadPic.ajax",
							fileNumLimit: 1,
							accept: {
								extensions: "mp3"
							},

							pick: {
								id: "#"+thisid,
								label: "选择文件"
							},
							loadSuccess:function(){
								webUploader.upload();
							},

							success: function(data) {
								$("#"+thisid).siblings(".audioUrl").val(data.data.picUrl);
								if (data.picUrl) {
									common.base.popUp('', {
										type: 'tip',
										tipTitle: '温馨提示',
										//标题
										tipMesg: '上传成功!',
										//提示语
										backFn: function(result) {
											if (result) {

											}
										}
									});
								}
							},
							error: function(err) {
								console.info(err);
							}

						});
					});
				}
			});
			$('.js_radio_itemadd').unbind("click");
			$('.js_radio_itemadd').on('click',function() {
				var dataNum= $('.js_radio_select').length+1;
				var _templ = Handlebars.compile($("#radio_itemcon").html());
				var data = new Array();
				data['num'] = dataNum;
				var html = _templ(data);
				$(this).parent().before(html);
				var thisindex=$('.js_radio_items').length;
				$('.js_radio_items:last .uploadpic').attr('id','radioupload'+thisindex);
				//$('.js_radio_items:last-child .audiouploadbtn').attr('id','audiouploadsave'+thisindex);
				editList.inputType();
			});
			$('.js_radio_itemdel').unbind("click");
			$('.js_radio_itemdel').on('click',function() {
				var dataId = $(this).attr('dataId');
				var thisItem = $(this).parents('.js_radio_items');
				if (dataId) {
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '确认删除，删除后将无法恢复？',
						//提示语
						backFn: function(result) {
							if (result) {
								$.ajax({
									type: "post",
									url: "${base}/resource!delete.ajax",
									data: {
										'resourceVo.id' : dataId
									},
									dataType: "json",
									success : function (resultMap) {
										if (resultMap.code == "success") {
											thisItem.remove();
										} else {
											if (resultMap && resultMap.description) {
												alert(resultMap.description);
											} else if (resultMap && typeof(resultMap) == 'string') {
												alert(resultMap);
											} else {
												alert("出错了,请重试!");
											}
										}
									},
								});
							}
						}
					});
				}else {
					thisItem.remove();
				}
			});
		},
		//标签的选中状态
		tagChecked: function(tagList) {
			var tags = tagList.split(",");
			if (tags.length > 0) {
				$('input[name="viewVo.tags"]').each(function() {
					for (var i = 0; i < tags.length; i++) {
						if ($(this).val() == tags[i]) {
							$(this).attr("checked", true);
						}
					}
				});
			}
		},
		viewTypeChange:function() {
			$('#viewType').on('change',function() {
				var viewType = $('#viewType').val();
				$.ajax({
					url: '${base}/viewType!queryByName.ajax',
					data: {
						"viewTypeVo.name": viewType
					},
					type: 'post',
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var typeId = resultData.data.viewtypeVo.typeId;
							if (typeId) {
								$.ajax({
									url: '${base}/tagsGroup!queryById.ajax',
									data: {
										"agsGroupVo.bizType": 'view',
										"tagsGroupVo.bizId": typeId
									},
									type: 'post',
									dataType: "json",
									success: function(resultData) {
										if (resultData.code == "success") {
//											var tagList = resultData.data.tagsGroupVo.tagsDataVos;
											var tagsGroupVos = resultData.data.tagsGroupVos;
											var str = "";
											$('.js_tagLable').html(str);
											for (var j= 0; j < tagsGroupVos.length; j ++) {
												var tagList = tagsGroupVos[j].tagsDataVos;
												str += '<div class="iteminfo clear"><span class="fl">'+tagsGroupVos[j].groupName+'：</span>'
												for(var i = 0; i < tagList.length; i++) {
													 str +=	'<span class="markcheck"><input type="checkbox" name="viewVo.tags" value="'+tagList[i].tagsId +'"/>'+tagList[i].tagsName+'</span>' 
												}
												str += '</div>'
											}
											$('.js_tagLable').append(str);
										}
									}
								});
							}else {
								$('.js_tagLable').html('');
							}
							
						} else {

						}
					}
				});
			})
		},

	}
	var editInit = function(viewVoDescription, viewVoContent, viewVoAttention, picList,tags) {
		editList.tagChecked(tags);
		editList.viewTypeChange();
		editList.uploadpic();
		editList.editform(picList);
		editList.cancel();
		//				editList.editform();
		editList.ueedit(viewVoDescription, viewVoContent, viewVoAttention);
		editList.inputType();
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
	}

	return {
		init: editInit
	};
})