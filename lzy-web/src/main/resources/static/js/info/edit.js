define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'ztree', 'bdueditor', 'ueditorlang', 'diyUpload', 'viewer', 'main', 'base64'],
function($, common, jqueryui, Handlebars, HandlebarExt, ztree, UE, diyUpload, viewer, main, base64) {

	var picArray = new Array();
	var delPics = new Array();
	var categoryIds = '';
	var picstadus = '';
	var info = {
		pageSize: 15,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数d
		isAjaxing: false,
		siteId: '',
		categoryId: '',
		restorePicArray:new Array(),
		saveInfo: function(previewFlag) {
			var checkResult = true;
			var js_articleVoSubject = $("#js_articleVoSubject").val();
			var js_subjectId = $("#js_subjectId").val();
			var js_articleId = $("#js_articleId").val();
			var viewIcon = $(".js_viewIcon").val();
			var publishDate = $('.js_pub_date').val();

			var outlinkUrl = $("#outlinkval").val();
			var js_articleExtVoId = $("#js_articleExtVoId").val();
			var displayType = $('input[name="displayform"]:checked').val()
			//			var options=$("#ispublish option:selected");  //是否发布获取选中点
			//            var ispublish = options.val();
			//            var options2=$("#isrecommend option:selected");
			//			var isRecommend = options2.val();
			var ispublish = $("#ispublish").val();
			var isRecommend = $("#isrecommend").val();
			var recommendStartDate = $(".js_common_start_date").val();
			var recommendEndDate = $(".js_common_end_date").val();
			var ue = UE.getEditor('js_articleVodescription');
			var js_articleVodescription = ue.getContent();
			var outLinkUe = UE.getEditor('js_articleVoOutLinkDescription');
			var js_articleVoOutLinkDescription = outLinkUe.getContent();
			var outLinkUeContent = UE.getEditor('js_articleExtVoOutLinkContent');
			var js_articleExtVoOutLinkContent = outLinkUeContent.getContent();
			//进行加密
			var base64 = new Base64();
			var js_articleVodescriptionEncode = base64.encode(js_articleVodescription);
			var js_articleVoOutLinkDescriptionEncode = base64.encode(js_articleVoOutLinkDescription);
			var js_articleExtVoOutLinkContentEncode = base64.encode(js_articleExtVoOutLinkContent);
			var ueExtContent = UE.getEditor('js_articleExtVoContent');
			var js_articleExtVoContent = ueExtContent.getContent();
			var js_articleExtVoContentEncode = base64.encode(js_articleExtVoContent);
			var outlinkUrlEncode = base64.encode(outlinkUrl);

			var articleCaegoryIds = '';
			var siteId = '';

			/*var categoryIds = document.getElementsByName("articleVo.categoryIds");
			for (var i = 0; i < categoryIds.length; i++) {
				var size = categoryIds.length;
				if (categoryIds[i].checked){ // 取到对象数组后，我们来循环检测它是不是被选中
					if((i+1)==size){
						articleCaegoryIds += categoryIds[i].value ; // 如果选中，将value添加到变量s中
					}else{
						articleCaegoryIds += categoryIds[i].value + ','; // 如果选中，将value添加到变量s中
					}
				}

			}*/

//			$('input[name="categoryidList"]:checked').each(function() {
//				articleCaegoryIds += $(this).attr("value") + ',';
//				siteId = $(this).attr("siteid");
//			})
			articleCaegoryIds = $('input[name="categoryidList"]:checked').attr("value");
			siteId = $('input[name="siteList"]:checked').attr("value");
			if(siteId == null || siteId == undefined || siteId == "") {
				$('.js_tip_site').html("请选择站点!");
				checkResult = false;
			}else{
				$('.js_tip_site').html("");
			}
			if(articleCaegoryIds == null || articleCaegoryIds == undefined || articleCaegoryIds == "") {
				$("#columnsetbox").append('<span class="errortip js_errortip js_tip_cat">请选择栏目!</span>');
				checkResult = false;
			}else{
				$('.js_tip_cat').remove();
			}
			//checked Tags
			var articleTags = '';
			var tags = document.getElementsByName("articleVo.tags");
			for (var i = 0; i < tags.length; i++) {
				var size = tags.length;
				if (tags[i].checked) { // 取到对象数组后，我们来循环检测它是不是被选中
					if ((i + 1) == size) {
						articleTags += tags[i].value; // 如果选中，将value添加到变量s中
					} else {
						articleTags += tags[i].value + ','; // 如果选中，将value添加到变量s中
					}
				}

			}

			if (!common.validate.checkEmpty('#js_articleVoSubject', '请输入标题名称！')) {
				checkResult = false;
			}

			if (!checkResult) {
				info.isAjaxing = false;
				return false;
			}
			if (info.isAjaxing) {
				return false;
			}
			info.isAjaxing = true;
			//			info.deletePic(picId)

			var descriptionEncode = '';
			var contentEncode = '';
			var dataid = $('.formradio input[name="displayform"]:checked').attr("data-index");
			if (dataid == 'tab1') {
				descriptionEncode = js_articleVodescriptionEncode;
				contentEncode = js_articleExtVoContentEncode;
			}else if (dataid == 'tab3') {
				descriptionEncode = js_articleVoOutLinkDescriptionEncode;
				contentEncode = js_articleExtVoOutLinkContentEncode;
			}
			
			var postData = {};
			
			//图片
			//获取选中类型
			var type = $('input[name="displayform"]:checked').val();
			var picupload = $("#custom_pic .picinsert");
			if (type == 'outlink') {
				picupload = $('#outlink_pic .picinsert');
			}
			var length=picupload.length;
			picupload.each(function(){
				var thisindex=$(this).index();
				var url = $(this).find('img').attr('_src');
				var picId = $(this).find('img').attr('picid');
				var pos = length - thisindex;
				postData['picVoList['+thisindex+'].id']=picId;
				postData['picVoList['+thisindex+'].urlPath']=url;
				postData['picVoList['+thisindex+'].pos']=pos;
			});
			postData['articleVo.subject'] = js_articleVoSubject;
			postData['articleVo.id'] = js_subjectId;
			postData['articleVo.articleId'] = js_articleId;
			postData['articleExtVo.articleId'] = js_articleId;
			postData['articleExtVo.content'] = contentEncode;
			postData['articleVo.status'] = ispublish;
			postData['articleVo.showType'] = displayType;
			postData['articleVo.url'] = outlinkUrlEncode;
			postData['articleVo.isRecommend'] = isRecommend;
			postData['articleVo.recommBeginDate'] = recommendStartDate;
			postData['articleVo.recommEndDate'] = recommendEndDate;
			postData['articleVo.viewNum'] = $("#viewNum").val();
		//	postData['articleVo.realViewNum'] = $("#realViewNum").val();
			postData['articleVo.title'] = $("#title").val();
			postData['articleVo.keyword'] = $("#keyword").val();
			postData['articleVo.author'] = $("#author").val();
			postData['articleVo.description'] = descriptionEncode;
			postData['articleExtVo.id'] = js_articleExtVoId;
			postData['articleVo.categoryIds'] = articleCaegoryIds;
			postData['articleVo.siteId'] = siteId;
			postData['articleVo.tags'] = articleTags;
			postData['articleVo.onlyrecomment'] = "N";
			postData['articleVo.icon'] = viewIcon;
			postData['articleVo.publishDate'] = publishDate;
			
			postData['articleVo.source'] = $('#source').val();

			if (checkResult == true) {
				$.ajax({
					type: "post",
					url: "${base}/article!save.ajax",
					data: postData,
					dataType: "json",
					success: function(resultMap) {
						if (resultMap.code == "success") {
							info.isAjaxing = false;
							var articleVoId = info.getQueryString('articleVo.articleId');

							if (articleVoId == null) {
								var _templ = Handlebars.compile($("#continueaddcolumn-save").html());
								$("#continueaddcolumn").html(_templ());
								common.base.popUp('.js_continueaddcolumn');
							} else {
								if('Y'==previewFlag){
									var category=common.doc.getCategoryName();
									var categoryname=category[articleCaegoryIds];
									if(categoryname=='图片'){
										window.location.href = '${base}/info/picPreview.html?id=' + articleVoId+'&categoryId='+articleCaegoryIds;
									}
									else if(categoryname=='视频'){
										window.location.href = '${base}/info/videoPreview.html?id=' + articleVoId+'&categoryId='+articleCaegoryIds;
									}
									else{
										window.location.href = '${base}/info/Preview.html?id=' + articleVoId+'&categoryId='+articleCaegoryIds;
									}
									
								}else{
									
									common.base.popUp('', {
										type: 'tip',
										tipTitle: '温馨提示',
										//标题
										tipMesg: '保存成功!',
										//提示语
										backFn: function(result) {
											if (result) {
												window.location.href = '${base}/info/list.html?articleVo.categoryId=' + articleCaegoryIds;
											}
										}
									});
								}
							}

							$('.js_popUpClose').on('click',
							function() {
								//编辑
								var editId = resultMap.data.articleVo.articleId;
								if (editId != '') {
									window.location.href = 'edit.html?articleVo.articleId=' + editId;
								}
							})

							$('.js_popUpSure').on('click',
							function() {
								//编辑
								//var editId = resultMap.data.articleVo.id;
								//if(editId != '') {
								//window.location.href='edit.html?articleVo.id='+editId;
								//}
								window.location.href = 'list.html';
								//window.close();
								$('.js_continueaddcolumn').fadeOut();

							});

							$('.js_popUpcontinueadd').on('click',
							function() {
								$('.js_continueaddcolumn').fadeOut();
								//继续添加
								window.location.href = 'edit.html?' + '&siteId=' + info.siteId + '&categoryId=' + info.categoryId;
							})

							//							return;
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
					error: function(e) {}
				});
			}
		},
		deletePic: function(picId) {
			$.ajax({
				type: "post",
				url: "${base}/article!deletePic.ajax",
				data: {
					"articleVo.picId": picId,
					"articleVo.id": $("#js_subjectId").val(),
					"articleVo.articleId": $('#js_articleId').val()
				},
				dataType: "json",
				success: function(resultMap) {
					if (resultMap.code == "success") {
						info.showDeletedPic();
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
				error: function(e) {}
			});

		},
		//栏目的选中状态
		categoryChecked: function(categoryIdList) {
			var categoryIds = categoryIdList.split(",");
			if (categoryIdList.length > 0) {
				$('input[name="categoryidList"]').each(function() {
					for (var i = 0; i < categoryIds.length; i++) {
						if ($(this).val() == categoryIds[i]) {
							$(this).attr("checked", true);
						}
					}
				});
			}
		},

		//标签的选中状态
		tagChecked: function(tagList) {
			var tags = tagList.split(",");
			if (tags.length > 0) {
				$('input[name="articleVo.tags"]').each(function() {
					for (var i = 0; i < tags.length; i++) {
						if ($(this).val() == tags[i]) {
							$(this).attr("checked", true);
						}
					}
				});
			}
		},
		ueedit: function(articleVoDescription, articleExtVoContent) {
			//判断ueditor 编辑器是否创建成功
			var ue = UE.getEditor('js_articleVodescription', {
				wordCount: true,
				maximumWords: 200
			});
			ue.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue.setContent(base64.decode(articleVoDescription));

			});
			var ue1 = UE.getEditor('js_articleVoOutLinkDescription', {
				wordCount: true,
				maximumWords: 200
			});
			ue1.addListener("ready",
				function() {
					var base64 = new Base64();
					// editor准备好之后才可以使用
					ue1.setContent(base64.decode(articleVoDescription));

				});
			var ue2 = UE.getEditor('js_articleExtVoContent');
			ue2.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue2.setContent(base64.decode(articleExtVoContent));
			});
			var ue3 = UE.getEditor('js_articleExtVoOutLinkContent');
			ue3.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue3.setContent(base64.decode(articleExtVoContent));
			});
		},
		//本地上传与素材库tab切换
		uploadpic: function() {
			$('.js_picupload').unbind("click");
			$('.js_picupload').click(function() {

				if ($(this).hasClass('basicupload')) {
					picstadus = 'a';
				} else {
					picstadus = 'b';
				}
				$("#localupload").show().siblings(".picuploadbox").hide();

				$("span[dataattr='localupload']").addClass("active").siblings(".pictabtit").removeClass("active");

				info.getMaterialPic(picstadus);
			})
		},
		//获取素材库图片
		getMaterialPic: function(stadus) {
			$.ajax({
				url: '${base}/resource!queryResourceListPage.ajax',
				data: {
					"pageObject.page": info.pageCur,
					"pageObject.pagesize": info.pageSize,
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

							if (stadus == 'b') {

								$("span[dataattr='materialupload']").remove();
							}

						}
						//初始化模板，才能操作模板中数据
						info.popUpoperate(stadus);
						//分页
						info.pageTotal = resultData.data.pagetotal;
						info.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: info.pageCur,
							pageTotal: info.pageTotal,
							total: info.total,
							backFn: function(p) {
								info.pageCur = p;
								info.getMaterialPic();
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
		editform: function(picList, articleVoDescription, articleExtVoContent) {
			//获取选中类型
			var type = $('input[name="displayform"]:checked').val();
			var picupload = $(".custom_picupload");
			if (type == 'outlink') {
				picupload = $('.outlink_picupload');
			}
			//编辑页面从数据库获取图片数组，依次展现在前端
			//判断是否有图片
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
					var pichtml = '<div class="picinsert fl"><div class="Cancel js_Cancel"></div><img  _src="' + urlPath + '" src="' + picUrl + '" picId="' + picId + '"><em  class="setcover" >设为外观</em></div>';
					picupload.before(pichtml);
				}

			}

			var dataid = $('.formradio input[name="displayform"]:checked').attr("data-index");

			//展现形式切换
			$('.formradio input[name="displayform"]').click(function() {
				var dataattr = $(this).attr("data-index");
				if (dataattr == 'tab1') { //自定义

					info.ueedit(articleVoDescription, articleExtVoContent);

				}else if (dataattr == 'tab3') { //外链

				}
				$("#" + dataattr).show().siblings('.formtabbox').hide();
			})
			/*上传图片特效*/
			$(".editboxcon:eq(0)").show().siblings(".editboxcon").hide();

			$(".editboxbt span.editboxbtline").click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				var dataattr = $(this).attr("dataattr");
				$("#" + dataattr).show().siblings(".editboxcon").hide();
			})
			//设置封面
			$(".picmaterialcon").on('click', '.setcover',function() {
				$(".setcover").removeClass("title").html("设为封面");
				$(this).addClass("title").html("封面图");
				var _src = $(this).parent('.picinsert').find('img').attr("_src");
				$(".picmaterialcon").prepend($(this).parent(".picinsert"));
				$(".js_viewIcon").val(_src);
			});

			//删除图片
			$(".picmaterialcon").on('click', '.js_Cancel',
			function() {

				var picsrc = $(this).parent('.picinsert').find('img').attr('_src');
				var picId = $(this).parent('.picinsert').find('img').attr('picId');
				if (picsrc != undefined) {
					$.each(picArray,
					function(index, item) {});
					$(this).parent('.picinsert').remove();
					//编辑时候异步删除图片
					//异步删除图片
					if (picId.length > 0) {
						info.deletePic(picId);
					}

				} else {
					$(this).parent('.picinsert').remove();
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
			})

			$('.zipfile').change(function(){
				var showType = $('input[name="displayform"]:checked').val();
				if (showType == 'zip') {
					//上传压缩包
					var id = $(this).attr('id');
					var files = $(".zipfile").prop('files');
					var data = new FormData();
					var param = {};
					$.ajax({
						url: '${base}/article!uploadZip.action',
						type: 'POST',
						secureuri: false,
				    	fileElementId: id,
						data: data,
						cache: false,
						processData: false,
						contentType: false,
						success: function(resultData) {
							if(resultData.code == "success"){
								picArray.push(resultData.zipUrl);
								
							}
						}
					});
				} else {
					info.saveInfo();
				}
			})
			
			$("#basicinfosave").click(function() {
				info.saveInfo();

			});
			$("#saveAndPreview").click(function() {
				var showType = $('input[name="displayform"]:checked').val();
				if (showType == 'zip') {
					//上传压缩包
					var files = $(".zipfile").prop('files');
					var data = new FormData();
					data.append('file', files[0]);
					$.ajax({
						url: '${base}/article!uploadZip.action',
						type: 'POST',
						data: data,
						cache: false,
						processData: false,
						contentType: false,
						success: function(resultData) {
							picArray.push(resultData.zipUrl);
							info.saveInfo('Y');
						}
					});
				} else {
					info.saveInfo('Y');
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
			$(".diyCancel").on('click',
			function() {
				//删除文件夹中图片ToDo
				//删除文件路径
				$("#picUrl").val('');
				// submitForm('deletePic');
			});
		},

		//素材库搜索
		search: function() {
			$(document).on("click", ".js_search",
			function() {
				info.pageCur = 1;
				info.getMaterialPic("0");
			})
		},
		popUpoperate: function(stadus) {
			//本地上传
			var picupload = $(".custom_picupload");
			if (picstadus == 'b') {
				picupload = $('.outlink_picupload');
			}
			$('#uploadpic').diyUpload({
				url: '${base}/article!uploadPic.action',
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
								picupload.before(pichtml);
							}
						});
						picArray.push(data.picUrl);
					} else {
						alert(data.description);
					}
					

					//editList.save();
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
					info.search();
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
				var picupload = $(".custom_picupload");
				if (picstadus == 'b') {
					picupload = $('.outlink_picupload');
				}
				var length = 0;
				var total = $("ul.materiallist li.active").length;
				$("ul.materiallist li.active").each(function() {
					var picfile = $(this).find(".materiapic img").attr("src");
					var picUrl = picfile.split("appfile")[1];
					picArray.push(picUrl);
					var pichtml = '<div class="picinsert js_picinsert fl"><div class="Cancel js_Cancel"></div><img src=' + picfile + ' _src=' + picUrl + '><em  class="setcover" >设为外观</em></div>';
					picupload.before(pichtml);
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
		siteCheck: function() {
			$(".sitecheck").unbind('click');
			$(".sitecheck").on('click',
			function() {
				var dataid = $(this).attr('value');
				$.ajax({
					url: '${base}/category!queryCategoryList.ajax',
					data: {
						"categoryVo.siteId": dataid,
						"categoryVo.dataType": "article"
					},
					type: 'post',
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},

					success: function(resultData) {
						common.base.loading("fadeOut");
						if (resultData.code == "success") {
							$(".js_catagorylist").show();
							$("#columnsetbox").html('');
							var dataarray = resultData.data.categoryVoList;
							for (var i = 0; i < dataarray.length; i++) {
								var sitehtml = '<span class="markcheck">' + '<input type="radio" name="categoryidList" siteid=' + dataarray[i].siteId + '  value=' + dataarray[i].categoryId + ' />' + dataarray[i].name + '&nbsp;' + '</span>';
								$(".js_catagorylist").show();
								$("#columnsetbox").append(sitehtml);
							}
							info.categoryChecked(categoryIds);
							info.categoryCheck();
						} else {

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
			})
		},
		infoedit: function() {
			var categoryId = info.getQueryString('categoryId'),
			siteId = info.getQueryString('siteId');
			info.siteId = siteId;
			info.categoryId = categoryId;

			if (siteId != null) {

				$('input[value=' + siteId + ']').attr('checked', true);
				$.ajax({
					url: '${base}/category!queryCategoryList.ajax',
					data: {
						"categoryVo.siteId": siteId,
						"categoryVo.dataType": "article"
					},
					type: 'post',
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},

					success: function(resultData) {
						common.base.loading("fadeOut");
						if (resultData.code == "success") {
							$(".js_catagorylist").show();
							$("#columnsetbox").html('');
							var dataarray = resultData.data.categoryVoList;
							for (var i = 0; i < dataarray.length; i++) {
								var sitehtml = '<span class="markcheck">' + '<input type="radio" name="categoryidList" siteid=' + dataarray[i].siteId + '  value=' + dataarray[i].categoryId + ' />' + dataarray[i].name + '&nbsp;' + '</span>';
								$(".js_catagorylist").show();
								$("#columnsetbox").append(sitehtml);
							}

							$('input[value=' + categoryId + ']').attr('checked', true);
						} else {

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
			}

		},
		isRecommendChange:function() {
			$("#isrecommend").on("change",function(){
				info.isShowRecommendDate();
			});
		},
		isShowRecommendDate:function() {
			var result = $("#isrecommend").val();
			if(result == "Y") {
				$(".recommend_date").show();
			} else {
				$(".recommend_date").attr("style","display:none;");
			}
		},
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		categoryCheck:function() {
			$("input[name='categoryidList']").click(function(){
				var categoryId = $('input[name="categoryidList"]:checked').attr('value');
				$.ajax({
					url: '${base}/tagsGroup!queryById.ajax',
					data: {
						"agsGroupVo.bizType": 'article',
						"tagsGroupVo.bizId": categoryId
					},
					type: 'post',
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var tagList = resultData.data.tagsGroupVo.tagsDataVos;
							var str = "";
							$('.js_tagLable').html(str);
							for(var i = 0; i < tagList.length; i++) {
							 str +=	'<span class="markcheck"><input type="checkbox" name="articleVo.tags" value="'+tagList[i].tagsId +'"/>'+tagList[i].tagsName+'</span>' 
							}
							$('.js_tagLable').append(str);
						} else {

						}
					}
				});
			});
			
		},
		//回收站中的图片还原
		restoreDeletedPic:function(){
			$('#restoreDeleted').unbind('click');
			$('#restoreDeleted').on('click',function(){
		
				var loopTag = $('.js_check_row');
				var index = 0;
				loopTag.each(function(){
					if($(this).prop('checked') == true){
						var data = {};
						data['picVo.picId'] = $(this).attr('picId');
						data['picVo.status'] = "open";
						$(this).parent('.js_imgDiv').remove();
						$.ajax({
							url:'${base}/resource!changeStatus.ajax',
							data:data,
							type:'post',
							dataType:'json',
							success:function(result){
								if(result.code == "success"){
									info.showDeletedPic();
								}
							}
						})
					}
				})
				setTimeout(function(){
					info.showOpenPic();
				},2000)
			})
		},
		//显示回收站中的图片
		showDeletedPic:function(){
			var data = {};
			data['picVo.bizId'] = $('#js_articleId').val();
			data['picVo.status'] = "delete";
			$.ajax({
				url:'${base}/resource!queryListByBizIdAndStatus.ajax',
				data:data,
				type:'post',
				dataType:'json',
				success:function(result){
					if(result.code == "success"){
						var picVoList = result.data.picVoList;
						if(picVoList && picVoList.length > 0){
							var str = "";
							for(var i = 0;i<picVoList.length;i++){
								var picVo = picVoList[i];
								str += '<div class="editboxconb js_imgDiv">'+
											'<input type="checkbox" class="checkbox js_check_row editboxconc" picId="'+picVo.picId+'">'+
											'<img _src="'+picVo.urlPath+'" src="${(config.ResourcePath)}'+picVo.urlPath+'" picid="'+picVo.picId+'" class="viewer-toggle junkImg" >'+
										'</div>';
							}
							$('.js_deletedPicContent').html("");
							$('.js_deletedPicContent').html(str);
							$('.js_deletedPicContent').append('<input type="button" value="还原" class="btn-small comBtn" id="restoreDeleted">');
							info.restoreDeletedPic();
						}else{
							$('.js_deletedPicContent').html('<div class="datanull">暂无数据</div>');
						}
					}
				}
			})
		},
		//还原后刷新图片显示
		showOpenPic:function(){
			var data = {};
			data['picVo.bizId'] = $('#js_articleId').val();
			data['picVo.status'] = "open";
			$(".picinsert").remove();
			$.ajax({
				url:'${base}/resource!queryListByBizIdAndStatus.ajax',
				data:data,
				type:'post',
				dataType:'json',
				success:function(result){
					if(result.code == "success"){
						var picVoList = result.data.picVoList;
						if(picVoList && picVoList.length > 0){
							var str = "";
							//获取选中类型
							var type = $('input[name="displayform"]:checked').val();
							var picupload = $(".custom_picupload");
							if (type == 'outlink') {
								picupload = $('.outlink_picupload');
							}
							
							for(var i = 0;i<picVoList.length;i++){
								var picVo = picVoList[i];
								var pichtml = '<div class="picinsert fl"><div class="Cancel js_Cancel"></div><img  _src="' + picVo.urlPath + '" src="${(config.ResourcePath)}' + picVo.urlPath + '" picId="' + picVo.picId + '"><em  class="setcover" >设为外观</em></div>';
								picupload.before(pichtml);
							}
							info.restoreDeletedPic();
						}
					}
				}
			})
		},
		tabChange:function(){
			$(".editboxbtline").click(function() {

				var dataattr = $(this).attr("dataattr");
				$("#" + dataattr).show().siblings().hide();
				$(this).addClass("active").siblings().removeClass("active");
				info.showDeletedPic();
			})
		}
	}
	var editListInit = function(articleVoDescription, articleExtVoContent, picList, categoryIdList, tags) {
		var dataid = $('.formradio input[name="displayform"]:checked').attr("data-index");
		$("#" + dataid).show().siblings('.formtabbox').hide();

		info.ueedit(articleVoDescription, articleExtVoContent);

		categoryIds = categoryIdList;
		info.editform(picList, articleVoDescription, articleExtVoContent);
		info.siteCheck();
		info.uploadpic();
		info.categoryChecked(categoryIdList);
		info.tagChecked(tags);
		info.infoedit();
		info.isShowRecommendDate();
		info.isRecommendChange();
		info.tabChange();
		setTimeout(function(){
			info.categoryCheck();
		},2000)
		
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
		$('.js_start_Date').val($('.js_start_Date').attr('value'));
		$('.js_end_Date').val($('.js_end_Date').attr('value'));
	}

	return {
		init: editListInit

	};

})