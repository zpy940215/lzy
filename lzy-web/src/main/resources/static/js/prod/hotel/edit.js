define(['jquery', 'common', 'jqueryui', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'bdueditor', 'viewer', 'main', 'base64', 'ueditorlang'],
function($, common, jqueryui, ztree, Handlebars, HandlebarExt, diyUpload, UE,viewer, main, base64) {
	var picArray = new Array();
	var delPics = new Array();
	var prodPrices = new Array();
	var delProdPrices = new Array();
	var mapObj;
	var marker = new Array();
	var windowsArr = new Array();
	var hotelPicArray = new Array;
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
		//获取商品规格
		getProdPrices: function() {
			var prodId = $("#prodId").val();
			$.ajax({
				type: "post",
				url: "${base}/prodPrice!queryByProdId.ajax",
				data: {
					"prodPriceVo.prodId": prodId,
					//"prodPriceVo.status": "open",
					"prodPriceVo.beginTime": '2017-01-01',
					"prodPriceVo.endTime": '2018-01-01'
					
				},
				dataType: "json",
				success: function(resultMap) {
					if (resultMap.code == "success") {
						var _templ = Handlebars.compile($("#prodPriceList").html());
						$("#prodPriceContent").html(_templ(resultMap.data));
						if (resultMap.data.prodPriceVoList != null) {
							var count = resultMap.data.prodPriceVoList.length;
							for (var i = 0; i < count; i++) {
								hotelPicArray.push("null");
							}
						}
						editList.delnative();
						editList.editform();
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
						picArray.push(data.data.picUrl);
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
					picArray.push(picUrl);
					var pichtml = '<div class="picinsert js_picinsert fl"><div class="Cancel js_Cancel"></div><img src=' + picfile + ' _src=' + picUrl + '><em  class="setcover" >设为外观</em></div>';
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
				$(".popup").hide();
			})
		},

		editform: function() {
			//规格删除图片
			$('.js_diyCancel').on('click',
			function() {
				$(this).parents('.diyUploadHover').remove();
			})
			//tab切换
			$(".editboxcon:eq(0)").show().siblings(".editboxcon").hide();
			$(".editboxbt span.editboxbtline").click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				var dataattr = $(this).attr("dataattr");
				$("#" + dataattr).show().siblings(".editboxcon").hide();
				editList.routeadd();
				if (dataattr == 'nativeinfo') {
					$(".picset").each(function() {
						var thisid = $(this).find('.picid').attr('id');
						$('#' + thisid).diyUpload({

							url: '${base}/prod!uploadPic.ajax',
							loadSuccess: function() {
								webUploader.upload();
							},
							success: function(data, thisid) {
								if(data.code == "success") {
									var index = $("#" + thisid).parents('tr').index();
									hotelPicArray.splice(index, 1, data.data.picUrl);
								} else {
									alert(data.description);
								}
							},
							error: function(err) {
								console.info(err);
							}
						});
					})

				}

			})
			//设置封面
			$(".picmaterialcon").on('click', '.setcover',function() {
				$(".setcover").removeClass("title").html("设为封面");
				$(this).addClass("title").html("封面图");
				var _src = $(this).parent('.js_picinsert').find('img').attr("_src");
				$(".picmaterialcon").prepend($(this).parent(".picinsert"));
				$(".js_viewIcon").val(_src);
			});

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
		ueedit: function(description, content, costExplain, bookedExplain) {
			var ue = UE.getEditor('Ueditor');
			ue.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用,解密
				ue.setContent(base64.decode(description));
			});
			var ue2 = UE.getEditor('Ueditor2');
			ue2.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用,解密
				ue2.setContent(base64.decode(content));
			});
			var ue3 = UE.getEditor('Ueditor3');
			ue3.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用,解密
				ue3.setContent(base64.decode(costExplain));
			});
			var ue4 = UE.getEditor('Ueditor4');
			ue4.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用,解密
				ue4.setContent(base64.decode(bookedExplain));
			});
		},
		//保存
		save: function() {
			$("#producteditsubmit").click(function() {
				var checkResult = true;
				editList.areaId = $('#selectAreaId').val();
				var viewIcon = $(".js_viewIcon").val();
				
				// 获取复选框值tags
				var tags = document.getElementsByName("prodVo.tags"); // 选择所有name="prodtags"的对象，返回数组
				var prodtags = ''; // 如果这样定义var s;变量s中会默认被赋个null值
				for (var i = 0; i < tags.length; i++) {
					if (tags[i].checked) { // 取到对象数组后，我们来循环检测它是不是被选中
						var j = tags.length;
						if ((i + 1) == j) {
							prodtags += tags[i].value; // 如果选中，将value添加到变量s中
						} else {
							prodtags += tags[i].value + ','; // 如果选中，将value添加到变量s中
						}
					}

				}

				//加密
				var base64 = new Base64();
				var ue = UE.getEditor('Ueditor');
				var ue2 = UE.getEditor('Ueditor2');
				var ue3 = UE.getEditor('Ueditor3');
				var ue4 = UE.getEditor('Ueditor4');
				var content = ue.getContent();
				var content2 = ue2.getContent();
				var content3 = ue3.getContent();
				var content4 = ue4.getContent();
				var descriptionEncode = base64.encode(content);
				var contentEncode = base64.encode(content2);
				var costExplainEncode = base64.encode(content3);
				var bookedExplainEncode = base64.encode(content4);

				//商品规格
				editList.prodPrice();

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
				postData['prodVo.prodTypeId'] = "01";
				if (editList.areaId != '') {
					postData['prodVo.areaId'] = editList.areaId;
				}
				postData['prodVo.name'] = $("#title").val();
				postData['prodVo.linkMobile'] = $("#tel").val();
				postData['prodVo.address'] = $("#address").val();
				postData['prodVo.longitude'] = $("#lng").val();
				postData['prodVo.latitude'] = $("#lat").val();
				postData['prodVo.freeNum'] = $("#stockNum").val();
				postData['prodVo.price'] = $("#price").val();
				postData['prodVo.icon'] = viewIcon;
				postData['prodVo.preferentialPrice'] = $("#preferentialPrice").val();
				postData['prodVo.status'] = $("#status").val();
				postData['prodVo.tags'] = prodtags;
				postData['prodVo.prodPicString'] = picArray.join("|");
				postData['prodVo.uploadPicList'] = picArray;
				postData['prodExtVo.description'] = descriptionEncode;
				postData['prodExtVo.content'] = contentEncode;
				postData['prodExtVo.costExplain'] = costExplainEncode;
				postData['prodExtVo.bookedExplain'] = bookedExplainEncode;
				
				//图片
				var length=$('.js_pic .picinsert').length;
				$('.js_pic .picinsert').each(function(){
					var thisindex=$(this).index();
					var url = $(this).find('img').attr('_src');
					var picId = $(this).find('img').attr('picid');
					var pos = length - thisindex;
					postData['picVoList['+thisindex+'].id']=picId;
					postData['picVoList['+thisindex+'].urlPath']=url;
					postData['picVoList['+thisindex+'].pos']=pos;
				});

				//产品规格
				for (var i = 0; i < prodPrices.length; i++) {
					postData['prodPriceVoList[' + i + '].id'] = prodPrices[i].id;
					postData['prodPriceVoList[' + i + '].price'] = prodPrices[i].price;
					postData['prodPriceVoList[' + i + '].discountPrice'] = prodPrices[i].discountPrice;
					postData['prodPriceVoList[' + i + '].freeNum'] = prodPrices[i].freeNum;
					postData['prodPriceVoList[' + i + '].param1Value'] = prodPrices[i].name;
					postData['prodPriceVoList[' + i + '].param2Value'] = prodPrices[i].picUrl;
					postData['prodPriceVoList[' + i + '].beginTime'] = '2018-01-01';
					postData['prodPriceVoList[' + i + '].endTime'] = '2018-01-01';
				}

				if (editList.isAjaxing) {
					return false;
				}
				editList.isAjaxing = true;
				editList.deletePic();
				editList.deletePrices();
				$.ajax({
					type: "post",
					url: "${base}/prod!save.ajax",
					data: postData,
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success: function(resultMap) {
						editList.isAjaxing = false;
						if (resultMap.code == "success") {
							window.location.href = '${base}/prod/hotel/list.html';
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
					url: "${base}/pic!delete.ajax",
					data: {
						"picVo.id": picId
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
		//遍历商品规格
		prodPrice: function() {
			$(".prodPrice").each(function() {
				var index = $(this).index();
				var prodPriceMap = {};
				prodPriceMap['id'] = $(this).attr("id");
				prodPriceMap['name'] = $(this).find(".js_name").val();
				prodPriceMap['price'] = $(this).find(".js_marketPrice").val();
				prodPriceMap['discountPrice'] = $(this).find(".js_discountPrice").val();
				prodPriceMap['freeNum'] = $(this).find(".js_freeNum").val();
				prodPriceMap['picUrl'] = hotelPicArray[index];
				prodPrices.push(prodPriceMap);
			});
		},
         //规格新增
   		routeadd:function(){
   		$(".routeadd").unbind('click');
   		$(".routeadd").on('click','.addnewroute',function(){
   				var indexarray=[];
   				var trindex=$('tr.prodPrice').length;
   				
   				var html='<tr class="prodPrice">'+
					  '<td><input type="text" class="routename js_name" style="width:70px; text-align: center;"/></td>'+
				      '<td><input type="text" class="routename js_marketPrice" style="width:70px; text-align: center;"/></td>'+
				      '<td><input type="text" class="routename js_discountPrice" style="width:70px; text-align: center;"/></td>'+
				      '<td><input type="text" class="routename js_freeNum" style="width:70px; text-align: center;"/></td>'+
				      '<td><div class="parentFileBox">'+
                    	'<ul class="fileBoxUl" >'+
                    	'<li class="hoteluploadpic "><div id="uploadhotelpic'+trindex+'"></div></li>'+
                    		'</ul>'+
                		'</div></td>'+
				      '<td><a class="js_delete_row" href="javascript:;">删除</a></td>'+
		          '</tr>'

				$('#nativebox-content table tbody').append(html);
				$('#uploadhotelpic' + trindex + '').diyUpload({
					fileNumLimit: 1,
					url: '${base}/prod!uploadPic.ajax',
					loadSuccess: function() {
						webUploader.upload();
					},
					success: function(data, thisid) {
						if(data.code == "success") {
							var index = $("#" + thisid).parents('tr').index();
							hotelPicArray.splice(index, 1, data.data.picUrl);
						} else {
							alert(data.description)
						}
						
					},
					error: function(err) {
						console.info(err);
					}
				});
			})
		},
		delnative: function() {
			$('.js_delete_row').unbind("click");
			$(document).on('click', '.js_delete_row',
			function() {
				var index = $(this).parents('.prodPrice').index();
				hotelPicArray.splice(index, 1);
				var $this = $(this);
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							var id = $this.attr("dataId");
							if (id != '') {
								delProdPrices.push(id);
							}
							if(editList.deletePrices()) {
								$this.parents('tr').remove();
							}
						}
					}
				});
			});
		},
		//删除商品产品规格
		deletePrices: function() {
			var check = false;
			var i = delProdPrices.length;
			while (i--) {
				var priceId = delProdPrices[i];
				$.ajax({
					type: "post",
					url: "${base}/prodPrice!delete.ajax",
					data: {
						"prodPriceVo.id": priceId
					},
					dataType: "json",
					async: false,
					success: function(resultMap) {
						if (resultMap.code == "success") {
							check = true;
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
			return check;
		},
		//标签的选中状态
		tagChecked: function(tagList) {
			var tags = tagList.split(",");
			if (tags.length > 0) {
				$('input[name="prodVo.tags"]').each(function() {
					for (var i = 0; i < tags.length; i++) {
						if ($(this).val() == tags[i]) {
							$(this).attr("checked", true);
						}
					}
				});
			}
		}

	}
	var editListInit = function(description, content, costExplain, bookedExplain,tags) {
		editList.tagChecked(tags);
		editList.getProdPrices();
		editList.uploadpic();
		editList.editform();
		editList.ueedit(description, content, costExplain, bookedExplain);
		editList.save();
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
	}

	return {
		init: editListInit
	};
})