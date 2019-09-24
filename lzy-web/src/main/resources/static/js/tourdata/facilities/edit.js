define(['jquery', 'common', 'jqueryui', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'moment', 'stay', 'viewer', 'main','base64', 'bdueditor', 'ueditorlang'],

function($, common, jqueryui, ztree, Handlebars, HandlebarExt, diyUpload, moment, stay, viewer, main, base64, UE) {

	var delPics = new Array();

	var editList = {
		isAjaxing: true,
		pageSize: 15,//素材库分页 每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		saveView: function() {
			var dataget=new Object();

			var viewname = $("#viewname").val();
			var areaId = $("#areaId").val();
			var address = $("#address").val(); //之前是$("#address").attr("value"),用用属性值保存有问题
			var vid = $("#id").attr("value");
			var viewId = $("#viewid").val();
			var areaCode = $("#js_status").find("option:checked").attr("value");
			var lng = $("#lng").val();
			var lag = $("#lat").val();
			var viewSmallType = $("#viewType").find("option:checked").attr("value");
			var mobile = $("#mobile").val();//服务电话
			var lowerPrice = $("#floorPrice").val();//最低价
			var isRecommentOption = $("#isRecommentStar option:selected");//推荐指数
			var starOption = isRecommentOption.val();
			var viewIcon = $(".js_viewIcon").val();
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
			var ue = UE.getEditor('Ueditor');// 描述图文上传
			var js_viewVodescription = ue.getContent();
			var js_viewVodescriptionEncode = base64.encode(js_viewVodescription);// 进行加密
			$("#Ueditor").val(js_viewVodescriptionEncode);
			var ue2 = UE.getEditor('Ueditor2');// 詳細图文上传
			var js_viewVodescription2 = ue2.getContent();
			var js_viewVodescriptionEncode2 = base64.encode(js_viewVodescription2);// 进行加密
			$("#Ueditor2").val(js_viewVodescriptionEncode2);
			var ue3 = UE.getEditor('Ueditor3');// 須知图文上传
			var js_viewVodescription3 = ue3.getContent();
			var js_viewVodescriptionEncode3 = base64.encode(js_viewVodescription3);// 进行加密
			$("#Ueditor3").val(js_viewVodescriptionEncode3);
			var checkResult = true;
			if (!common.validate.checkEmpty('#viewname', '请输入景点名称！')) {
				checkResult = false;
			}
			if (areaCode != null) {
				checkResult = false;
			}
			if (!checkResult) {
				editList.isAjaxing = false;
				return false;
			}
			editList.deletePic();

			//封装参数
			dataget['viewVo.id']=vid;
			dataget['viewVo.lvl']= "1";
			dataget['viewVo.type']= "facilities";
			dataget['viewVo.smallType'] = viewSmallType;
			dataget['viewVo.name']= viewname;
			dataget['viewVo.address']= address;
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
			dataget['viewVo.longitudeReal'] = $('.js_realJingdu').val();
			dataget['viewVo.latitudeReal'] = $('.js_realWeidu').val();


			if (checkResult) {
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
										//window.close();
										window.location.href = '${base}/tourdata/facilities/list.html';
									}
								}
							});
							return;
						} 
						else {
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
			}
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

			$(".editboxbt span.editboxbtline").click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				var dataattr = $(this).attr("dataattr");
				$("#" + dataattr).show().siblings(".editboxcon").hide();
			})
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
			$(".picmaterialcon").on('click', '.js_Cancel',function() {
				var picsrc = $(this).parent('.js_picinsert').find('img').attr('_src');
				var picId = $(this).parent('.js_picinsert').find('img').attr('picId');
				$(this).parent('.js_picinsert').remove();
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
			sceneryname.bind('input propertychange',function() {
				if ($(this).val() != '') {
					$(this).siblings(".errortip").html('');
				}
			});
			areaname.bind('input propertychange',function() {
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
				},5000);

			});
			//删除图片
			$("div").on("click", ".js_Cancel",function() {
				var picId = $(this).next().attr('picId');
				delPics.push(picId);
				$(this).parents(".js_picinsert").remove();

			});
			$("#basicscenicsave").click(function() {
				editList.saveView();
			});

		},
		ueedit: function(viewVoDescription, viewVoContent, viewVoAttention) {
			//判断ueditor 编辑器是否创建成功
			var ue = UE.getEditor('Ueditor');
			ue.addListener("ready",function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue.setContent(base64.decode(viewVoDescription));

			});
			var ue2 = UE.getEditor('Ueditor2');
			ue2.addListener("ready",function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue2.setContent(base64.decode(viewVoContent));
			});

			var ue3 = UE.getEditor('Ueditor3');
			ue3.addListener("ready",function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue3.setContent(base64.decode(viewVoAttention));
			});
		},
		cancel: function() {
			$("#cancle").unbind("click");
			$("#cancle").click(function() {
				window.location.href = '${base}/tourdata/facilities/list.html';
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
			$(document).on("click", ".js_search",function() {
				editList.pageCur = 1;
				editList.getMaterialPic("0");
			});
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
			$("ul.materiallist").on('click', 'li',function() {
				if ($(this).hasClass("active")) {
					$(this).find(".checkpic").prop("checked", false);
					$(this).removeClass("active");
				} else {
					$(this).addClass("active");
					$(this).find(".checkpic").prop("checked", true);
				}

			})
			//保存选择的素材
			$(document).on("click", "#addmaterialpic",function() {
				var length = 0;
				var total = $("ul.materiallist li.active").length;
				$("ul.materiallist li.active").each(function() {
					var picfile = $(this).find(".materiapic img").attr("src");
					var picUrl = picfile.split("appfile")[1];
					var pichtml = '<div class="picinsert js_picinsert fl"><div class="Cancel js_Cancel"></div><img src=' + picfile + ' _src=' + picUrl + '><em  class="setcover" >设为封面</em></div>';
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
			});
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
									}
								});
							}
						}
					});
				}else {
					thisItem.remove();
				}
			});
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
		editList.viewTypeChange();
		editList.editListInit();
		editList.uploadpic();
		editList.editform(picList);
		editList.cancel();
		//editList.editform();
		editList.ueedit(viewVoDescription, viewVoContent, viewVoAttention);
		editList.inputType();
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
	}

	return {
		init: editInit
	};
});