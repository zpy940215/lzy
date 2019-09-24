define(['jquery', 'common', 'jqueryui', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'bdueditor', 'ueditorlang', 'viewer', 'main', 'base64'],
function($, common, jqueryui, ztree, Handlebars, HandlebarExt, diyUpload, UE, viewer, main, base64) {
	var picArray = new Array();
	var delPics = new Array();
	var prodPrices = new Array();
	var delProdPrices = new Array();

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
			var data = {};
			var viewType = $("#selectViewType").val();
			if(viewType != null) {
				data['viewVo.type'] = viewType;
			}
			data['viewVo.status'] = "create";
			$.ajax({
				url: '${base}/view!queryListAll.ajax',
				data: data,
				dataType: "json",
				async:false,
				success: function(resultData) {
					if (resultData.code == "success") {
						editList.types = resultData.data.viewVoList;
						$("#selectViewId").html("");
						editList.typeSetlvlstr(); //更新筛选值
						var viewId = $('.js_edit_viewId').val();
						$('#selectViewId').find("option[value="+viewId+"]").attr("selected",true);
					} else {
						if (resultData && resultData.description) {
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
		// 选择关联商户类型
		selectViewType:function() {
			$("#selectViewType").change(function() {
				editList.getTypeListAll();
			});
		},
		chooseViewType:function(viewType) {
			if(viewType != null) {
				$("#selectViewType").find("option[value="+viewType+"]").attr("selected",true);
			}
		},
		//获取商品规格
		getProdPrices: function() {
			var prodId = $("#id").val();
			if(prodId == ""){
				return false;
			}
			$.ajax({
				type: "post",
				url: "${base}/prodPrice!queryByProdId.ajax",
				data: {
					"prodPriceVo.prodId": prodId,
					"prodPriceVo.beginTime":'2017-01-01',
					"prodPriceVo.endTime":'2087-01-01'
				},
				dataType: "json",
				success: function(resultMap) {
					if (resultMap.code == "success") {
						var _templ = Handlebars.compile($("#prodPriceList").html());
						$("#prodPriceContent").html(_templ(resultMap.data));
						editList.delnative();
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
		typeSetlvlstr: function() {
			var len = editList.types.length;
			for (i = 0; i < len; i++) {
				$("#selectViewId").append('<option value=' + editList.types[i].viewId + '>' + editList.types[i].name + '</option>');
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
									$(".js_viewIcon").val(data.data.picUrl);
								}
								$(".js_picupload").before(pichtml);
							}
						});
						picArray.push(picfile_src);
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
			$("#uploadsave").click(function() {
				if (productname == '') {
					$(".check").addClass('errorborder');
				}
				if (selectarea.val() == '') {
					selectarea.addClass('errorborder');
				}
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
		checkParam:function(element,checkResult) {
			checkResult = editList.isEmpty(element,checkResult);
			$(element).bind('input propertychange',function() {
				checkResult = editList.isEmpty(element,checkResult);
			});
			return checkResult;
		},
		isEmpty:function(element,checkResult) {
			if ($(element).val() != '') {
				$(element).removeClass('errorborder');
				checkResult =  true;
			} else {
				$(element).addClass('errorborder');
				checkResult = false;
			}
			return checkResult;
		},
		//保存
		save: function() {
			$("#producteditsubmit").click(function() {
				var checkName = false,
				checkSalePrice = false,
				checkOriginPrice = false,
				checkFreeNum = false,
				checkUseStartDate = false,
				checkUseEndDate = false,
				checkViewType = false,
				checkViewId = false;
				editList.checkResult = false;
				editList.areaId = $('#selectAreaId').val();
				var viewIcon = $(".js_viewIcon").val();
				var subTitle = $("#subtitle").val();
				//基本信息校验
				var productname = $("#productname").val();
				var salePrice = $("#sale_price").val();
				var originPrice = $("#origin_price").val();
				var freenum = $("#freenum").val();
				var useStartDate = $(".js_start_Date").val();
				var useEndDate = $(".js_end_Date").val();
				var status = $('input:radio[name="onsale"]:checked').val();
				var viewType = $("#selectViewType").val();
				var viewId = $("#selectViewId").val();
				
				checkName = editList.checkParam($("#productname"));
				checkSalePrice = editList.checkParam($("#sale_price"));
				checkOriginPrice = editList.checkParam($("#origin_price"));
				checkFreeNum = editList.checkParam($("#freenum"));
				checkUseStartDate = editList.checkParam($(".js_start_Date"));
				checkUseEndDate = editList.checkParam($(".js_end_Date"));
				checkViewType = editList.checkParam($("#selectViewType"));
				checkViewId = editList.checkParam($("#selectViewId"));
				
				//加密
				var base64 = new Base64();
				var ue = UE.getEditor('Ueditor');
				var content = ue.getContent();
				var descriptionEncode = base64.encode(content);

				if (!checkName || !checkSalePrice || !checkOriginPrice || !checkFreeNum || !checkUseStartDate
						|| !checkUseEndDate || !checkViewType || !checkViewId) {
					editList.isAjaxing = false;
					//alert("miss param");
					return false;
				}
				//alert("seccess");

				var postData = {};
				postData['prodVo.id'] = $("#id").val();
				postData['prodVo.prodTypeId'] = "06";
				if (editList.areaId != '') {
					postData['prodVo.areaId'] = editList.areaId;
				}
				postData['prodVo.name'] = productname;
				postData['prodVo.subTitle'] = subTitle;
				postData['prodVo.freeNum'] = freenum;
				postData['prodVo.preferentialPrice'] = salePrice;
				postData['prodVo.price'] = originPrice;
				postData['prodVo.icon'] = viewIcon;
				postData['prodVo.status'] = status;
				postData['prodVo.viewId'] = viewId;
				postData['prodVo.prodPicString'] = picArray.join("|");
				postData['prodVo.uploadPicList'] = picArray;
				postData['prodExtVo.description'] = descriptionEncode;
				postData['paramValBean.useStartDate'] = useStartDate;
				postData['paramValBean.useEndDate'] = useEndDate;
				
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
							window.location.href = '${base}/prodnew/coupon/list.html';
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
				var prodPriceMap = {};
				prodPriceMap['id'] = $(this).attr("id");
				prodPriceMap['price'] = $(this).find(".js_marketPrice").val();
				prodPriceMap['discountPrice'] = $(this).find(".js_discountPrice").val();
				if ($(this).find(".js_freeNum").val() == '') {
					prodPriceMap['freeNum'] = 0;
				}else {
					prodPriceMap['freeNum'] = $(this).find(".js_freeNum").val();
				}
				prodPriceMap['param1Name'] = $(this).find(".js_param1").val();
				prodPriceMap['param1Value'] = $(this).find(".js_value1").val();
				prodPriceMap['param2Name'] = $(this).find(".js_param2").val();
				prodPriceMap['param2Value'] = $(this).find(".js_value2").val();
				prodPriceMap['param3Name'] = $(this).find(".js_param3").val();
				prodPriceMap['param3Value'] = $(this).find(".js_value3").val();
				prodPrices.push(prodPriceMap);
			});
		},

		//规格新增
		routeadd: function() {
			$(".routeadd").unbind('click');
			$(".routeadd").on('click', '.addnewroute',
			function() {

				var html = '<tr class="prodPrice">' + '<td><input type="text" class="routename js_marketPrice" style="width:70px; text-align: center;"/></td>' + '<td><input type="text" class="routename js_discountPrice" style="width:70px; text-align: center;"/></td>' + '<td><input type="text" class="routename js_freeNum" style="width:70px; text-align: center;"/></td>' + '<td><input type="text" class="routename js_param1" style="width:70px; text-align: center;"/></td>' + '<td><input type="text" class="routename js_value1" style="width:70px; text-align: center;"/></td>' + '<td><input type="text" class="routename js_param2" style="width:70px; text-align: center;"/></td>' + '<td><input type="text" class="routename js_value2" style="width:70px; text-align: center;"/></td>' + '<td><input type="text" class="routename js_param3" style="width:70px; text-align: center;"/></td>' + '<td><input type="text" class="routename js_value3" style="width:70px; text-align: center;"/></td>' + '<td><a class="js_delete_row" href="javascript:;">删除</a></td>' + '</tr>'

				$('#nativebox-content table tbody').append(html);

			})

		},
		delnative: function() {
			$('.js_delete_row').unbind("click");
			$(document).on('click', '.js_delete_row',
			function() {
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
							$this.parents('tr').remove();
						}

					}
				});
			});
		},
		//删除商品产品规格
		deletePrices: function() {
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
		}
	}
	var editListInit = function(description,viewType) {
		editList.chooseViewType(viewType);
		editList.selectViewType();
		editList.getTypeListAll();
		editList.getProdPrices();
		editList.uploadpic();
		editList.editform();
		editList.ueedit(description);
		editList.save();
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
		$('.js_start_Date').val($('.js_start_Date').attr("value"));
		$('.js_end_Date').val($('.js_end_Date').attr("value"));
	}

	return {
		init: editListInit
	};
})