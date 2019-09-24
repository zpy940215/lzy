define(['jquery', 'common', 'jqueryui', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'bdueditor', 'ueditorlang', 'viewer', 'main', 'base64'],
function($, common, jqueryui, ztree, Handlebars, HandlebarExt, diyUpload, UE, viewer, main, base64) {
	var province = '';
	var city = '';
	var country = '';
	var picArray = new Array();
	var delPics = new Array();

	var editList = {
		pageSize: 15,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数
		areaId: '',
		//筛选地区
		isAjaxing: false,
		types: [],
		//获取所有商品分类
		getTypeListAll: function() {
			$.ajax({
				url: '${base}/prodType!queryListAll.ajax',
				data: {
					"prodTypeVo.upId": "05",
					"prodTypeVo.status": "open"
				},
				dataType: "json",
				success: function(resultData) {
					if (resultData.code == "success") {
						editList.types = resultData.data.typeVoList;
						editList.typeSetlvlstr(); //更新筛选值
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
				}
			});
		},
		typeSetlvlstr: function() {
			var html = '',
			len = editList.types.length;
			for (var i = 0; i < len; i++) {
				var lvl = editList.types[i].lvl,
				nbsp = "";
				if (lvl == "3") nbsp = "----";
				if (lvl == "4") nbsp = "--------";
				editList.types[i]['nbsp'] = nbsp;
			}

			for (i = 0; i < len; i++) {
				$(".js_typeSelect").append('<option value=' + editList.types[i].typeId + '>' + editList.types[i].nbsp + editList.types[i].name + '</option>');
			}
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
					common.base.loading("fadeOut");
				},
				error: function(resultData) {
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
		//本地上传与素材库tab切换
		uploadpic: function() {
			$('.js_picupload').unbind("click");
			$('.js_picupload').click(function() {
				$("#localupload").show().siblings(".picuploadbox").hide();
				$("span[dataattr='localupload']").addClass("active").siblings(".pictabtit").removeClass("active");
				editList.getMaterialPic();
			})
		},
		popUpoperate: function() {
			$('#uploadpic').diyUpload({
				url: '${base}/prod!uploadPic.ajax',
				success: function(data) {
					picArray.push(data.data.picUrl);
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
					picArray.push(picUrl);
					var pichtml = '<div class="picinsert fl"><img src=' + picfile + '><em  class="setcover" >设为外观</em></div>';
					$(".picupload").before(pichtml);
					length++;
				});
				if (length == total) {

					$(".popup").removeClass("popupstyle");
					$(".popup").html("");
				}
			})

			//保存上传图片
			$("#uploadsave").click(function() {
				// $(".popup").hide();
				$(".viewThumb").each(function() {
					var picfile = $(this).find("img").attr("src");
					var pichtml = '<div class="picinsert fl"><div class="Cancel js_Cancel"></div><img src=' + picfile + '><em  class="setcover" >设为外观</em></div>';
					$(".picupload").before(pichtml);
				});
				$(".popup").hide();
			})
		},
		//地区处理
		dealAreaData: function(parentCode, dom) {

			$.ajax({
				url: '${base}/area!queryListbyParentCode.ajax',
				data: {
					"parentCode": parentCode
				},
				dataType: "json",
				success: function(resultData) {

					var areaVoList = resultData.data.areaVoList;
					var len = areaVoList.length;
					$(dom).html('');

					$(dom).append('<option value="">请选择</option>');
					for (i = 0; i < len; i++) {
						$(dom).append('<option value=' + areaVoList[i].code + '>' + areaVoList[i].name + '</option>');
					}
				}
			});
		},
		selectarea: function() {
			editList.dealAreaData("0", "#selProvince");
			$("#selProvince").append('<option>省</option>');
		},
		selectcity: function() {
			$("#selProvince").change(function() {
				city = '';
				country = '';

				var areaid = $("#selProvince").val();
				province = areaid;
				editList.dealAreaData(areaid, "#selCity");
			});
		},
		listCountry: function() {
			$("#selCity").change(function() {
				country = '';

				var areaId = $("#selCity").val();
				city = areaId;
				editList.dealAreaData(areaId, "#selectCountry");

			});
		},
		selectCountry: function() {
			$("#selectCountry").change(function() {
				country = $("#selectCountry").val();
			});
		},

		editform: function() {
			//tab切换
			$(".editboxcon:eq(0)").show().siblings(".editboxcon").hide();
			$(".editboxbt span.editboxbtline").click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				var dataattr = $(this).attr("dataattr");
				$("#" + dataattr).show().siblings(".editboxcon").hide();
			})
			//设置封面
			$(".picmaterialcon").on('click', '.setcover',
			function() {
				$(".setcover").removeClass("title").html("设为外观");
				$(this).addClass("title").html("封面图");
				$(".picmaterialcon").prepend($(this).parent(".picinsert"));
			})

			//拖动排序
			$("#sortable").sortable();
			$("#sortable").disableSelection();
			//基本信息提交
			var productname = $('input[name="productname"]');
			var selectarea = $('#selProvince');
			productname.bind('input propertychange',
			function() {
				if ($(this).val() != '') {
					productname.removeClass('errorborder')
				}
			});
			selectarea.bind('input propertychange',
			function() {
				if ($(this).val() != '') {
					selectarea.removeClass('errorborder');
				}
			});
			$("#producteditsubmit").click(function() {
				if (productname.val() == '') {
					productname.addClass('errorborder');
				}
				if (selectarea.val() == '') {
					selectarea.addClass('errorborder');
				}
				if (productname.val() != '' && selectarea.val() != '') {
					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						// 标题
						tipMesg: '保存成功！',
						// 提示语
						backFn: function(result) {
							// alert(result);
						}
					});
				}
			})
			//删除图片
			$("div").on("click", ".js_Cancel",
			function() {
				var picId = $(this).next().attr('picId');
				delPics.push(picId);
				$(this).parents(".picinsert").remove();

			})

		},
		ueedit: function(description) {
			var ue = UE.getEditor('Ueditor');
			ue.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用,解密
				ue.setContent(base64.decode(description));
			});
		},
		//保存
		save: function() {
			$("#producteditsubmit").click(function() {
				var checkResult = true;
				//区域
				if (country != '') {
					editList.areaId = country;
				} else if (city != '') {
					editList.areaId = city;
				} else if (province != '') {
					editList.areaId = province;
				} else {
					editList.areaId = '';
				}

				//加密
				var base64 = new Base64();
				var ue = UE.getEditor('Ueditor');
				var content = ue.getContent();
				var descriptionEncode = base64.encode(content);

				if (editList.areaId == '' && $("#area").val() == '') {
					checkResult = false;
				}
				if ($("#title").val() == '') {
					checkResult = false;
				}
				if (!checkResult) {
					editList.isAjaxing = false;
					return false;
				}

				var postData = {};
				postData['prodVo.id'] = $("#id").val();
				postData['prodVo.prodTypeId'] = "04";
				if (editList.areaId != '') {
					postData['prodVo.areaId'] = editList.areaId;
				}
				if ($(".js_typeSelect").val() != '') {
					postData['prodVo.type'] = $(".js_typeSelect").val();
				}
				postData['prodVo.name'] = $("#title").val();
				postData['prodVo.prodChildTypeId'] = $("#typeSelect").val();
				postData['prodVo.freeNum'] = $("#stockNum").val();
				postData['prodVo.price'] = $("#price").val();
				postData['prodVo.preferentialPrice'] = $("#preferentialPrice").val();
				postData['prodVo.prodCode'] = $("#prodCode").val();
				postData['prodVo.status'] = $("#status").val();
				postData['prodVo.prodPicString'] = picArray.join("|");
				postData['prodVo.uploadPicList'] = picArray;
				postData['prodExtVo.description'] = descriptionEncode;

				if (editList.isAjaxing) {
					return false;
				}
				editList.isAjaxing = true;
				editList.deletePic();
				$.ajax({
					type: "post",
					url: "${base}/prod!save.ajax",
					data: postData,
					dataType: "json",
					success: function(resultMap) {
						editList.isAjaxing = false;
						if (resultMap.code == "success") {
							/*window.location.href='${base}/prod/native/list.html';*/
							var viewVoId = editList.getQueryString('viewVo.viewId');
							if (viewVoId != null) {
								window.close();
							} else {
								window.location.href = '${base}/prod/native/list.html';
							}
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
			});
		},
		//删除图片
		deletePic: function() {
			var i = delPics.length;
			while (i--) {
				var picId = delPics[i];
				$.ajax({
					type: "post",
					url: "${base}/prod!deletePic.ajax",
					data: {
						"prodVo.prodPicVo.id": picId
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
		}

	}
	var editListInit = function(description) {
		editList.getTypeListAll();
		editList.uploadpic();
		editList.editform();
		editList.ueedit(description);
		editList.selectarea();
		editList.selectcity();
		editList.listCountry();
		editList.selectCountry();
		editList.save();
	}

	return {
		init: editListInit
	};
})