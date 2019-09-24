define(['jquery', 'common', 'jqueryui', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'moment', 'stay', 'bdueditor', 'ueditorlang', 'viewer', 'main', 'base64'],
function($, common, jqueryui, ztree, Handlebars, HandlebarExt, diyUpload, moment, stay, UE, viewer, main, base64) {
	var picArray = new Array();
	var delPics = new Array();
	var params = new Array();
	var linePrices = new Array();
	var delLines = new Array();

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

		//获取特殊字段
		getParams: function() {
			$.ajax({
				type: "post",
				url: "${base}/prodTypeParam!queryByTypeId.ajax",
				data: {
					"prodTypeId": "02"
				},
				dataType: "json",
				success: function(resultMap) {
					if (resultMap.code == "success") {
						params = resultMap.data.paramDefVoList;
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
		//获取行程产品规格
		getLinePrice: function() {
			var prodId = $("#prodId").val();
			$.ajax({
				type: "post",
				url: "${base}/prodLinePrice!queryByProdId.ajax",
				data: {
					"prodLinePriceVo.prodId": prodId
				},
				dataType: "json",
				success: function(resultMap) {
					if (resultMap.code == "success") {
						var _templ = Handlebars.compile($("#routeBoxList").html());
						$("#routebox-content").html(_templ(resultMap.data));
						$(".routebox").find('.startDate,.endDate').datepicker({
							dateFormat: 'yy-mm-dd',
							dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
							monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
							yearSuffix: '年',
							showMonthAfterYear: true,
							showOtherMonths: true
						});
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
		//行程管理新增
		routeadd: function() {
			$(".routeadd").unbind('click');
			$(".routeadd").on('click', '.addnewroute',
			function() {
				var html = '<div class="routebox">' + 
								'<form action="" >' + 
									'<div class="formformat cheduletime">'+
										'<label>行程时间：</label>'+
										'<input  class="formoinputtext startDate js_startDate" value=""  readonly  type="text" placeholder="年/月/日"/>'+
										'<input  class="formoinputtext startDate js_endDate" readonly type="text" placeholder="年/月/日"/>'+
									'</div>' + 
									'<div class="formformat buytime">'+
										'<label>购买时间：</label>'+
										'<input  class="formoinputtext startDate js_buyStartDate" value="" readonly type="text" placeholder="年/月/日"/> '+
										'<input  class="formoinputtext startDate js_buyEndDate" value=""  readonly type="text" placeholder="年/月/日"/>'+
									'</div>' + 
									'<div class="formformat">' + 
										'<p class="routetabletitle"><label>价格库存：</label>（说明：套票模式成人以及儿童最少最多人数需保持一致；合计价格为销售价格）</p>' + 
										'<div class="routetable">' + 
											'<table width="100%" border="0" cellspacing="0">' + 
												'<thead>' + 
													'<tr class="title">' + 
														'<td width="14%">名称</td>' + 
														'<td width="30%">人数限制</td>' + 
														'<td width="30%">单价/元</td>' + 
														'<td width="13%">合计价格</td>' + 
														'<td width="13%">库存</td>' + 
													'</tr>' + 
												'</thead>' + 
											'<tbody>' + 
												'<tr>' + 
													'<td><input type="text" class="routename"></td>' + 
													'<td>' + 
														'<p>成人：<select class="peoselect minpeonum"><option>最少成人数</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>&nbsp&nbsp&nbsp<select class="peoselect maxpeonum"><option>最多成人数</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></p>' +
														'<p>儿童：<select class="peoselect  minChildrennum"><option>最少儿童数</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>&nbsp&nbsp&nbsp<select class="peoselect maxChildnum"><option>最多儿童数</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></p>' + 
													'</td>' + 
													'<td>' + 
														'<p>成人：<input type="text" placeholder="原价" class="pricetext historypeoPrice"> <input type="text" placeholder="现价" class="pricetext currentpeoPrice"></p>' + 
														'<p>儿童：<input type="text" placeholder="原价" class="pricetext historychildPrice"> <input type="text" placeholder="现价" class="pricetext currentchildPrice"></p>' + 
													'</td>' + 
													'<td><input type="text" class="stockinput totalprice"></td>' + 
													'<td><input type="text" class="stockinput stocknum"></td>' + 
												'</tr>' + 
											'</tbody>' + 
										'</table>' + 
									'</div>' + 
									'<div class="clear routeadd"><a class="delroute fr js_delLinePrice" href="javascript:void(0)" dataId="">删除</a></div>'+
								'</form>'+
							'</div>';

				$(this).before(html);
				$(this).prev(".routebox").find('.startDate').datepicker({
					dateFormat: 'yy-mm-dd',
					dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
					monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					yearSuffix: '年',
					showMonthAfterYear: true,
					showOtherMonths: true
				});

				$(this).prev(".routebox").find('.startDate').datepicker('setDate', new Date());
			})

		},
		delroute: function() {
			$(".js_delLinePrice").unbind("click");
			$(document).on('click', ".js_delLinePrice",
			function() {
				var id = $(this).attr("dataId");
				if (id != '') {
					delLines.push(id);
				}
				$(this).parents(".routebox").remove();
			})
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
			$(".picmaterialcon").on('click', '.setcover',function() {
				$(".setcover").removeClass("title").html("设为封面");
				$(this).addClass("title").html("封面图");
				var _src = $(this).parent('.js_picinsert').find('img').attr("_src");
				$(".picmaterialcon").prepend($(this).parent(".picinsert"));
				$(".js_viewIcon").val(_src);
			});
			//删除图片
			$("div").on("click", ".js_Cancel",
			function() {
				var picId = $(this).next().attr('picId');
				delPics.push(picId);
				$(this).parents(".picinsert").remove();

			})
			//鼠标经过图片
			//$(".picinsert").hover(function(){
			//  $(this).find(".setcover").toggle();
			//})
			//拖动排序
			$("#sortable").sortable();
			$("#sortable").disableSelection();
			//基本信息保存
			// $(".infosubmit").click(function(){
			// 	  if($("input[name='maintitle']").val()==''){
			// 		  $("input[name='maintitle']").siblings(".errortip").show().html("主标题不能为空!");
			// 		  $("input[name='maintitle']").focus();
			// 	  }
			// 	  else{
			// 		  $("input[name='maintitle']").siblings(".errortip").hide();
			// 	  }
			// })
		},
		ueedit: function(description, content, costExplain, bookedExplain, othersExplain) {
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
			var ue5 = UE.getEditor('Ueditor5');
			ue5.addListener("ready",
			function() {
				var base64 = new Base64();
				// editor准备好之后才可以使用,解密
				ue5.setContent(base64.decode(othersExplain));
			});
		},
		//特殊字段处理
		params: function(param) {
			if (param != '') {
				var paramsMap = JSON.parse(param);
				$("#travelAgency").val(paramsMap.travelAgency);
				$("#getherPlace").val(paramsMap.getherPlace);
				$(".js_formselectn").val(paramsMap.transportation);
				$("#mobile").val(paramsMap.mobile);
				$("#address").val(paramsMap.address);
			}
		},

		//遍历路线规格
		linePrice: function() {
			$(".routebox").each(function() {
				var linePriceMap = {};
				linePriceMap['id'] = $(this).attr("id");
				linePriceMap['startDate'] = $(this).find(".cheduletime .js_startDate").val();
				linePriceMap['endDate'] = $(this).find(".cheduletime .js_endDate").val();
				linePriceMap['buyStartDate'] = $(this).find(".buytime .js_buyStartDate").val();
				linePriceMap['buyEndDate'] = $(this).find(".buytime .js_buyEndDate").val();;
				linePriceMap['name'] = $(this).find(".routename").val();
				linePriceMap['personMinNum'] = $(this).find(".minpeonum").val();
				linePriceMap['personMaxNum'] = $(this).find(".maxpeonum").val();
				linePriceMap['childMinNum'] = $(this).find(".minChildrennum").val();
				linePriceMap['childMaxNum'] = $(this).find(".maxChildnum").val();
				linePriceMap['oldPersonPrice'] = $(this).find(".historypeoPrice").val();
				linePriceMap['personPrice'] = $(this).find(".currentpeoPrice").val();
				linePriceMap['oldChildPrice'] = $(this).find(".historychildPrice").val();
				linePriceMap['childPrice'] = $(this).find(".currentchildPrice").val();
				linePriceMap['totalNum'] = $(this).find(".totalprice").val();
				linePriceMap['freeNum'] = $(this).find(".stocknum").val();
				linePrices.push(linePriceMap);
			});
		},

		//保存
		save: function() {
			$('.js_infosubmit').unbind("click");
			$(".js_infosubmit").on('click',
			function() {
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
				var ue5 = UE.getEditor('Ueditor5');
				var content = ue.getContent();
				var content2 = ue2.getContent();
				var content3 = ue3.getContent();
				var content4 = ue4.getContent();
				var content5 = ue5.getContent();
				var descriptionEncode = base64.encode(content);
				var contentEncode = base64.encode(content2);
				var costExplainEncode = base64.encode(content3);
				var bookedExplainEncode = base64.encode(content4);
				var othersExplainEncode = base64.encode(content5);

				//标签
				var itemChecked = $(".js_markCheck:checked");
				var tags = '';
				itemChecked.each(function() {
					tags += $(this).val() + ',';
				});

				//附属信息
				var paramsData = {};
				paramsData[params[0].name] = $("#travelAgency").val();
				paramsData[params[1].name] = $("#getherPlace").val();
				paramsData[params[2].name] = $(".js_formselectn").val();
				paramsData[params[3].name] = $("#mobile").val();
				paramsData[params[4].name] = $("#address").val();

				//价格规划
				editList.linePrice();

				if(editList.areaId == '' && $("#area").val() == '') {
				    checkResult = false;
				}
				if (!common.validate.checkEmpty('#title', '请输入主标题！')) {
					checkResult = false;
				}
				if (!checkResult) {
					editList.isAjaxing = false;
					return false;
				}

				var postData = {};
				postData['prodVo.id'] = $("#id").val();
				postData['prodVo.prodTypeId'] = "02";
				if (editList.areaId != '') {
					postData['prodVo.areaId'] = editList.areaId;
				}
				postData['prodVo.name'] = $("#title").val();
				postData['prodVo.subTitle'] = $("#subTitle").val();
				postData['prodVo.tags'] = tags;
				postData['prodVo.icon'] = viewIcon;
				postData['prodVo.tags'] = prodtags;
				postData['prodVo.status'] = $('input[name="onsale"]:checked').val();
				postData['prodVo.prodPicString'] = picArray.join("|");
				postData['prodExtVo.description'] = descriptionEncode;
				postData['prodExtVo.content'] = contentEncode;
				postData['prodExtVo.costExplain'] = costExplainEncode;
				postData['prodExtVo.bookedExplain'] = bookedExplainEncode;
				postData['prodExtVo.othersExplain'] = othersExplainEncode;
				postData['prodExtVo.paramVal'] = base64.encode(JSON.stringify(paramsData));
				
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
				
				//规格
				for (var i = 0; i < linePrices.length; i++) {
					postData['prodLinePriceVoList[' + i + '].id'] = linePrices[i].id;
					postData['prodLinePriceVoList[' + i + '].startDate'] = linePrices[i].startDate;
					postData['prodLinePriceVoList[' + i + '].endDate'] = linePrices[i].endDate;
					postData['prodLinePriceVoList[' + i + '].buyStartDate'] = linePrices[i].buyStartDate;
					postData['prodLinePriceVoList[' + i + '].buyEndDate'] = linePrices[i].buyEndDate;
					postData['prodLinePriceVoList[' + i + '].name'] = linePrices[i].name;
					postData['prodLinePriceVoList[' + i + '].personMinNum'] = linePrices[i].personMinNum;
					postData['prodLinePriceVoList[' + i + '].personMaxNum'] = linePrices[i].personMaxNum;
					postData['prodLinePriceVoList[' + i + '].childMinNum'] = linePrices[i].childMinNum;
					postData['prodLinePriceVoList[' + i + '].childMaxNum'] = linePrices[i].childMaxNum;
					postData['prodLinePriceVoList[' + i + '].oldPersonPrice'] = linePrices[i].oldPersonPrice;
					postData['prodLinePriceVoList[' + i + '].personPrice'] = linePrices[i].personPrice;
					postData['prodLinePriceVoList[' + i + '].oldChildPrice'] = linePrices[i].oldChildPrice;
					postData['prodLinePriceVoList[' + i + '].childPrice'] = linePrices[i].childPrice;
					postData['prodLinePriceVoList[' + i + '].totalNum'] = linePrices[i].totalNum;
					postData['prodLinePriceVoList[' + i + '].freeNum'] = linePrices[i].freeNum;
				}

				if (editList.isAjaxing) {
					return false;
				}
				editList.isAjaxing = true;
				editList.deleteLines();
				editList.deletePic();
				$.ajax({
					type: "post",
					url: "${base}/prod!save.ajax",
					data: postData,
					dataType: "json",
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success: function(resultMap) {
						if (resultMap.code == "success") {
							editList.isAjaxing = false;
							window.location.href = '${base}/prod/route/list.html';
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
		//删除路线产品规格
		deleteLines: function() {
			var i = delLines.length;
			while (i--) {
				var lineId = delLines[i];
				$.ajax({
					type: "post",
					url: "${base}/prodLinePrice!delete.ajax",
					data: {
						"prodLinePriceVo.id": lineId,
						"prodLinePriceVo.status": "delete"
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
	var editListInit = function(description, content, costExplain, bookedExplain, othersExplain, param,tags) {
		editList.tagChecked(tags);
		editList.getParams();
		editList.getLinePrice();
		editList.delroute();
		editList.uploadpic();
		editList.routeadd();
		editList.editform();
		editList.ueedit(description, content, costExplain, bookedExplain, othersExplain);
		editList.params(param);
		editList.save();
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
	}

	return {
		init: editListInit
	};
})