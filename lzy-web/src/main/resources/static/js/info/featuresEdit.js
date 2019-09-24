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
		saveInfo: function() {
			var checkResult = true;
			var js_Subject = $("#subject").val();
			var js_subjectId = $("#js_subjectId").val();
			var js_specialId = $("#js_specialId").val();
			var viewIcon = $(".js_viewIcon").val();
			var outlinkUrl = $("#outlinkval").val();
			var ispublish = $("#ispublish").val();
			var isRecommend = $("#isrecommend").val();
			var startDate = $(".js_start_Date").val();
			var endDate = $(".js_end_Date").val();
			var ue = UE.getEditor('js_description');
			var js_articleVodescription = ue.getContent();
			var ueExtContent = UE.getEditor('js_content');
			var js_articleExtVoContent = ueExtContent.getContent();
			//进行加密
			var base64 = new Base64();
			var js_articleVodescriptionEncode = base64.encode(js_articleVodescription);
			var js_articleExtVoContentEncode = base64.encode(js_articleExtVoContent);
			var outlinkUrlEncode = base64.encode(outlinkUrl);

			var articleCaegoryIds = '';
			articleCaegoryIds = $('input[name="categoryidList"]:checked').attr("value");
			
			if (!common.validate.checkEmpty('#subject', '请输入标题名称！')) {
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
			
			var postData = {};
			
			//图片
			//获取选中类型
			
			var picupload = $("#custom_pic .picinsert");
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
			
			postData['specialVo.subject'] = js_Subject;
			postData['specialVo.id'] = js_subjectId;
			postData['specialVo.specialId'] = js_specialId;
			postData['specialVo.content'] = js_articleExtVoContentEncode;
			postData['specialVo.status'] = ispublish;
			postData['specialVo.url'] = outlinkUrlEncode;
			postData['specialVo.isRecommend'] = isRecommend;
			postData['specialVo.beginDate'] = startDate;
			postData['specialVo.endDate'] = endDate;
			postData['specialVo.viewNum'] = $("#viewNum").val();
			postData['specialVo.description'] = js_articleVodescriptionEncode;
			postData['specialVo.categoryIds'] = articleCaegoryIds;
			postData['specialVo.icon'] = viewIcon;

			if (checkResult == true) {
				$.ajax({
					type: "post",
					url: "${base}/special!save.ajax",
					data: postData,
					dataType: "json",
					success: function(resultMap) {
						if (resultMap.code == "success") {
							info.isAjaxing = false;
							var articleVoId = info.getQueryString('articleVo.articleId');

							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: '保存成功!',
								//提示语
								backFn: function(result) {
									if (result) {
										window.location.href = '${base}/info/features_list.html';
									}
								}
							});

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
				url: "${base}/special!deletePic.ajax",
				data: {
					"specialVo.picId": picId,
					"specialVo.id": $("#js_subjectId").val()
				},
				dataType: "json",
				success: function(resultMap) {
					if (resultMap.code == "success") {
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

		ueedit: function(articleVoDescription, articleExtVoContent) {
			//判断ueditor 编辑器是否创建成功
			var ue = UE.getEditor('js_description', {
				wordCount: true,
				maximumWords: 200
			});
			ue.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用
				ue.setContent(base64.decode(articleVoDescription));

			});
			var ue1 = UE.getEditor('js_content', {
				wordCount: true,
				maximumWords: 200
			});
			ue1.addListener("ready",
				function() {
					var base64 = new Base64();
					// editor准备好之后才可以使用
					ue1.setContent(base64.decode(articleExtVoContent));

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
				//info.popUpoperate(picstadus);
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
						
							//初始化模板，才能操作模板中数据
							info.popUpoperate(stadus);
							if (stadus == 'b') {

								$("span[dataattr='materialupload']").remove();
							}

						}
						
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
		editform: function() {
			var picupload = $(".custom_picupload");
			
			
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
			
			$("#basicinfosave").click(function() {
				info.saveInfo();
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
				url: '${base}/special!uploadPic.action',
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
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		}

	}
	var editListInit = function(articleVoDescription, articleExtVoContent) {
		var dataid = $('.formradio input[name="displayform"]:checked').attr("data-index");
		$("#" + dataid).show().siblings('.formtabbox').hide();

		info.ueedit(articleVoDescription, articleExtVoContent);
		info.editform();
		info.uploadpic();
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
	}

	return {
		init: editListInit

	};

})