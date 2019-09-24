define(['jquery', 'common', 'jqueryui', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'moment', 'stay', 'viewer', 'main','base64', 'bdueditor', 'ueditorlang'],
function($, common, jqueryui, ztree, Handlebars, HandlebarExt, diyUpload, moment, stay, viewer, main,base64, UE ) {
	var delPics = new Array();
	var editList = {
		isAjaxing: false,
		pageSize: 15,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		saveView: function() {
			var checkResult = true
			
			var dataget=new Object();
			
			var viewname = $("#viewname").val();			
			var upviewid = $("#selectSenicId").val();
			if (!upviewid) {
				upviewid = '';
			}
			var areaId = $("#areaId").val();
			var address = $("#address").val(); //之前是$("#address").attr("value"),用用属性值保存有问题
			var vid = $("#id").attr("value");
			var viewId = $("#viewid").val();
			var areaCode = $("#js_status").find("option:checked").attr("value");
			var lng = $("#lng").val();
			var lag = $("#lat").val();
			var viewIcon = $(".js_viewIcon").val();

			//select下拉框值
			var options = $("#selectId option:selected"); //获取选中的项
			var viewareaId = options.val();
			//					alert(options.val()); 
			//服务电话
			var mobile = $("#mobile").val();
			
			var distance = $("#distance").val();

			//最低价
			var lowerPrice = $("#floorPrice").val();

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

//			var base64 = new Base64();
//			// 描述图文上传
//			var ue = UE.getEditor('Ueditor');
//			var js_viewVodescription = ue.getContent();
//			// 进行加密
//			var js_viewVodescriptionEncode = base64.encode(js_viewVodescription);
//
//			$("#Ueditor").val(js_viewVodescriptionEncode);
//			// 詳細图文上传
//			var ue2 = UE.getEditor('Ueditor2');
//			var js_viewVodescription2 = ue2.getContent();
//			// 进行加密
//			var js_viewVodescriptionEncode2 = base64.encode(js_viewVodescription2);
//
//			$("#Ueditor2").val(js_viewVodescriptionEncode2);
//			// 須知图文上传
//			var ue3 = UE.getEditor('Ueditor3');
//			var js_viewVodescription3 = ue3.getContent();
//			// 进行加密
//			var js_viewVodescriptionEncode3 = base64.encode(js_viewVodescription3);
//
//			$("#Ueditor3").val(js_viewVodescriptionEncode3);

			if (!common.validate.checkEmpty('#viewname', '请输入景点名称！')) {
				checkResult = false;
			}
			
			if (!common.validate.checkEmpty('#distance', '请输入打卡范围！')) {
				checkResult = false;
			}
			
			if (!common.validate.checkEmpty('#opentime', '请输入打卡时间！')) {
				checkResult = false;
			}
			
			if (!common.validate.checkEmpty('#address', '请输入打卡地址！')) {
				checkResult = false;
			}
			
			if (!common.validate.checkEmpty('#lng', '请输入经度！')) {
				checkResult = false;
			}
			
			if (!common.validate.checkEmpty('#lat', '请输入纬度！')) {
				checkResult = false;
			}
			
			if (!checkResult) {
				editList.isAjaxing = false;
				return false;
			}
			
			if (editList.isAjaxing) {
				return false;
			}
			editList.isAjaxing = true;
			editList.deletePic();
			
			//封装参数
			dataget['viewVo.id']=vid;
			dataget['viewVo.lvl']= "2";
			dataget['viewVo.upViewId']= upviewid;
			dataget['viewVo.type']= "spots";
			dataget['viewVo.name']= viewname;
			dataget['viewVo.address']= address;
			dataget['viewVo.distance']= distance;
			dataget['viewVo.areaId']= viewareaId;
			dataget['viewVo.tags']= viewtags;
			dataget['viewVo.facs']= viewfacs;
			dataget['viewVo.longitude']= lng;
			dataget['viewVo.latitude']= lag;
//			dataget['viewVo.description']= js_viewVodescriptionEncode;
//			dataget['viewVo.content']= js_viewVodescriptionEncode2;
//			dataget['viewVo.attention']= js_viewVodescriptionEncode3;
			dataget['viewVo.viewId']= viewId,
			dataget['viewVo.recommendIndex']= starOption,
			dataget['viewVo.price']= lowerPrice,
			dataget['viewVo.mobile']= mobile,
			dataget['viewVo.openingTime'] = $.trim($("#opentime").val()),
//			dataget['viewVo.score'] = score;
			dataget['viewVo.businessTime'] = $("#bussinesstime").val()
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
									window.location.href = '${base}/tourdata/dakaSpots/list.html?upviewid='+upviewid+'';
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

		//根据所选景区指定地区
		setArea: function () {
			$("#selectSenicId").change(function () {
				editList.queryAreaId();
			});
		},
		queryAreaId:function() {
			$.ajax({
				url: '${base}/view!queryByViewTypeId.ajax',
				data: {
					"viewVo.type": "scenic",
					'viewVo.viewId': $("#selectSenicId").val()
				},
				dataType: "json",
				success: function(resultData) {
					if (resultData.code == "success") {
						var viewVo = resultData.data.viewVo;
						$("#selectId").val(viewVo.areaId);
					}
				}
			});
		},

		// 文本编辑器
		editListInit: function() {
			var ue = UE.getEditor('Ueditor');
			var ue2 = UE.getEditor('Ueditor2');
			var ue3 = UE.getEditor('Ueditor3');
		},
		
		// 编辑页面表单编辑提交
		editform: function(picList) {
			//
			var datatime = $("#opentime").attr("value");
			if (datatime != '') {
				$("#opentime").val(datatime);
			}
			//编辑页面从数据库获取图片数组，依次展现在前端
			//判断是否有图片
			var viewIcon = $(".js_viewIcon").val();
			if (picList.length > 0) {
				//先去掉最后一个|
				var picListEnd = picList.substring(0, picList.length - 1);
				//用|区分
				picListEnd = picListEnd.split("|");
				//ID 和 pic 用 "-"分割，每个url用"|"分割
				for (i = 0; i < picListEnd.length; i++) {
					var idAndurlPath = picListEnd[i];
					var idUrlList = idAndurlPath.split("-");
					var picId = idUrlList[0];
					var urlPath = idUrlList[1];
					var picUrl = "${(config.ResourcePath)!''}" + urlPath;
					if (urlPath.indexOf("http") >= 0) {
						var picUrl = urlPath;
					}
					var pichtml = '<div class="picinsert js_picinsert fl"><div class="Cancel js_Cancel"></div><img  _src="' + urlPath + '" src="' + picUrl + '" picId="' + picId + '"><em  class="setcover" >设为封面</em></div>';
					if(viewIcon==urlPath){
						pichtml = '<div class="picinsert js_picinsert fl"><div class="Cancel js_Cancel"></div><img  _src="' + urlPath + '" src="' + picUrl + '" picId="' + picId + '"><em  class="setcover title" >封面图</em></div>';
					}
					$(".picupload").before(pichtml);
				}

			}
			//展现形式切换
			$('.formradio input[name="displayform"]').click(function() {
				var dataattr = $(this).attr("data-index");
				$("#" + dataattr).show().siblings('.formtabbox').hide();
			})
			/*上传图片特效*/
			$(".editboxcon:eq(0)").show().siblings(".editboxcon").hide();

			
			/*音频上传*/
			$(".editboxbt span.editboxbtline").click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				var dataattr = $(this).attr("dataattr");
				if(dataattr=='audioInfo'){
					/*$('#audioupload').diyUpload({
						url: "${base}/resource!uploadPic.ajax",
						fileNumLimit: 1,
						accept: {
							extensions: "mp3"
						},
	
						pick: {
							id: "#audioupload",
							label: "选择文件"
						},
						loadSuccess:function(){
							webUploader.upload();
						},

						success: function(data) {
							$(".audioUrl").val(data.picUrl);
						},
						error: function(err) {
							console.info(err);
						}	
						
					});*/
				}
				$("#" + dataattr).show().siblings(".editboxcon").hide();
				
			})
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
					info.deletePic(picId);
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
		//景区景点联动
		dealScenicData: function(upViewid, type, dom) {

			$.ajax({
				url: '${base}/view!queryTourDataList.ajax',
				data: {
					"viewPo.spotsOrSubspots": type,
					//	                    'viewPo.upViewId':upViewid,
					'viewPo.isDoTree': false

				},
				dataType: "json",
				success: function(resultData) {
					var viewVoList = resultData.data.viewVoList;
					var len = viewVoList.length;
					$(dom).html('');
					for (i = 0; i < len; i++) {
						//	                		<#if upViewid?? && upViewid==viewVoList[i].viewId>selected="selected"</#if> 
						$(dom).append('<option value=' + viewVoList[i].viewId + '>' + viewVoList[i].name + '</option>');
						if (upViewid == viewVoList[i].viewId) {
							$('#selectSenicId').val(viewVoList[i].viewId);
						}
					}
					if (upViewid == null || upViewid == "") {
						$(dom).append('<option value="">请选择</option>');
						editList.handleSenicId();
					//	editList.queryAreaId();
					}
				}
			});
		},
		selectScenic: function() {
			var upviewId = $("#upviewid").val();
			editList.dealScenicData(upviewId, "scenic", "#selectSenicId");
			$("#selectSenicId").append('<option>景区</option>');
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
				window.location.href = '${base}/tourdata/spots/list.html';
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
				//$(".js_radio_item").css("display","none");
				//$(".js_radio_item"+dataNum).css("display","block");
				var thisindex=$(this).attr('data-index');
				if(thisindex=='2'){
					$(".uploadpic").each(function(){
						var thisid=$(this).attr('id');
						$("#"+thisid).diyUpload({
							url: "${base}/resource!uploadPic.ajax",
							fileNumLimit: 1,
							accept: {
								extensions: "mp3,m4a"
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
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		handleSenicId:function() {
			var upviewid = editList.getQueryString('upviewid');
			if(upviewid != '') {
				$('#selectSenicId').val(upviewid);
				
				
			}
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
		}

	}
	var editInit = function(viewVoDescription, viewVoContent, viewVoAttention, picList,tags) {
		editList.tagChecked(tags);
		editList.setArea();
		editList.uploadpic();
		editList.editform(picList);
		editList.cancel();
		editList.selectScenic();
//		editList.ueedit(viewVoDescription, viewVoContent, viewVoAttention);
		editList.inputType();
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
	}

	return {
		init: editInit
	};
})