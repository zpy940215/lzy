define(['jquery', 'common', 'jqueryui', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'moment', 'stay', 'timepicker', 'bdueditor', 'ueditorlang', 'viewer', 'main', 'base64'],
function($, common, jqueryui, ztree, Handlebars, HandlebarExt, diyUpload, moment, stay, timepicker, UE, viewer, main, base64) {
	var picArray = new Array();
	var delPics = new Array();
	var params = new Array();
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
		//获取所有景点
		getAllScenic: function() {
			$.ajax({
				type: "post",
				url: "${base}/view!queryTourDataList.ajax",
				data: {
					"viewPo.spotsOrSubspots": "allScenic"
				},
				dataType: "json",
				success: function(resultMap) {
					if (resultMap.code == "success") {
						var _templ = Handlebars.compile($("#scenic_list").html());
						$("#scenic_matchs").html(_templ(resultMap.data));
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
		//获取特殊字段
		getParams: function() {
			$.ajax({
				type: "post",
				url: "${base}/prodTypeParam!queryByTypeId.ajax",
				data: {
					"prodTypeId": "03"
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
			$('.clockpicker').clockpicker();
			$(".refundrule").click(function() {
				var dataid = $(this).attr("dataid");
				if (dataid == 'canrefund') {
					$(".supportrefund").show();
				} else {
					$(".supportrefund").hide();
				}
			});
			$(".noordertime").click(function() {
				if ($(this).prop('checked')) {
					$(".orderstatuscheck").hide();
				} else {
					$(".orderstatuscheck").show();
				}
			})
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

			//拖动排序
			$("#sortable").sortable();
			$("#sortable").disableSelection();
			/*下面是新增联票js*/
			$(document).on("click", ".addscenery",
			function() {

				var html = '<div class="sceneryconn clear">' + '<label class="fl"><span class="style1">*</span>关联景点：</label>' + '<div class="connectscenery fl">' + '<input type="text" class="formoinputtext js_scenery_match" name="connectscenery">' + '</div>' + ' <a class="addscenery" href="javascript:void(0)">+增加景点</a>' + '</div>';
				$(this).parent().after(html);

				$(this).removeClass('addscenery').addClass('removescenery');
				$(this).text(' 删除');

			});
			$(document).on("click", ".removescenery",
			function() {
				$(this).parents('.sceneryconn').remove();
			})

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
				if (paramsMap.bookedDate != '') {
					$("#ordertime").val(paramsMap.bookedDate);
				} else {
					$(".noordertime").attr('checked', true);
					$(".orderstatuscheck").hide();

				}
				$("#wayOfAdmission").val(paramsMap.wayOfAdmission);
				if (paramsMap.refundRules == 'y') {
					$('input[dataid="canrefund"]').attr('checked', true);
					$(".supportrefund").show();
				} else if (paramsMap.refundRules == 'n') {
					$('input[dataid="norefund"]').attr('checked', true);
				}
				if (paramsMap.partRefund == 'y') {
					$('input[dataid="yes"]').attr('checked', true);
				} else if (paramsMap.refundRules == 'n') {
					$('input[dataid="no"]').attr('checked', true);
				}

				if (paramsMap.dateType != '') {
					$("#"+paramsMap.dateType).attr('checked', true);
				}

				$("#effectiveTime").val(paramsMap.effectiveTime);
				$(".js_start_Date").val(paramsMap.useStartDate);
				$(".js_end_Date").val(paramsMap.useEndDate);
				if (paramsMap.payType == 'onLine') {
					$("#onLine").attr('checked', true);
				} else if (paramsMap.payType == 'payOnArea') {
					$("#payOnArea").attr('checked', true);
				}
				$("#admissionStartTime").val(paramsMap.admissionStartTime);
				$("#admissionEndTime").val(paramsMap.admissionEndTime);
				$("#address").val(paramsMap.getTicketAddress);
				$("#personNum").val(paramsMap.personNum);
				$("#childNum").val(paramsMap.childNum);
				$("#oldPrice").val(paramsMap.oldPrice);
				$("#price").val(paramsMap.price);
				$("#totalNum").val(paramsMap.totalNum);
			}
		},
		//关联景点模糊查询
		scenerymarch: function() {
			$('.js_scenery_match').unbind('click');
			$(document).on('input propertychange', '.js_scenery_match',
			function() {
				var thisindex = $(this).parents('.sceneryconn').index() + 1;
				$(".scenery_matchs").css('top', thisindex * 50 - 16);
				var thisval = $(this);
				$(".scenery_item").hide();
				$('.noitem').remove();
				var itemsize = 0;
				$(".scenery_matchs").find('.scenery_item').each(function() {
					var keyWord = jQuery.trim(thisval.val()); //keyWord：输入关键词
					var couponname = $(this).text();
					if (couponname.indexOf(keyWord) != -1) { //有匹配项
						$(".scenery_matchs").show();
						$(this).show();
						itemsize++;
					}

				})

				if (itemsize == 0) {

					$(".scenery_matchs").show().append('<p class="noitem">暂无搜索结果！</p>');
				} else {

					$('.noitem').remove();
				}
				$(".scenery_item").unbind('click');
				$(".scenery_item").click(function() {
					var itemval = $(this).text();
					var id = $(this).attr('id');
					var type = $(this).attr('type');
					thisval.attr("id", id);
					thisval.attr('type', type);
					thisval.val(itemval);
					$('.scenery_matchs').slideUp(200);
				})
			})

			$("body").click(function() {
				$('.scenery_matchs').slideUp(200);
			})
		},
		//保存
		save: function() {
			$('.js_infosubmit').unbind("click");
			$(".js_infosubmit").on('click',
			function() {
				var checkResult = true;
				var viewIcon = $(".js_viewIcon").val();
				var saleStart = $('.js_sale_start_date').val();
				var saleEnd = $('.js_sale_end_date').val()+" 23:59:59";
				var otherSaleUrl = $('#otherSaleUrl').val();
				
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

				//附属信息
				var paramsData = {};
				var bookedDate = ''
				if (!$(".noordertime").prop("checked") && $("#ordertime").val() != '') {
					bookedDate = $("#ordertime").val();
				}
				paramsData[params[0].name] = bookedDate;
				paramsData[params[1].name] = $("#wayOfAdmission").val();
				paramsData[params[2].name] = $("input[name='refundrule']:checked").val();
				if ($(".refundrule:checked").val() == 'y') {
					paramsData[params[3].name] = $("input[name='partrefund']:checked").val();
				}
				paramsData[params[4].name] = $("input[name='ticket']:checked").val();
				paramsData[params[5].name] = $("#effectiveTime").val();
				paramsData[params[6].name] = $(".js_start_Date").val();
				paramsData[params[7].name] = $(".js_end_Date").val();
				paramsData[params[8].name] = $("input[name='payway']:checked").val();
				paramsData[params[9].name] = $("#admissionStartTime").val();
				paramsData[params[10].name] = $("#admissionEndTime").val();
				paramsData[params[11].name] = $("#address").val();
				paramsData[params[12].name] = $("#personNum").val();
				paramsData[params[13].name] = $("#childNum").val();
				paramsData[params[14].name] = $("#oldPrice").val();
				paramsData[params[15].name] = $("#price").val();
				paramsData[params[16].name] = $("#totalNum").val();

				//关联景点
				var scenic = $(".js_scenery_match");
				var linkSpots = '';
				scenic.each(function() {
					var spotsId = $(this).attr("id");
					if (spotsId && spotsId != '') {
						linkSpots += spotsId + ',';
					}
				});

				if (!common.validate.checkEmpty('#title', '请输入主标题！')) {
					checkResult = false;
				}
				
				if($('input[name="dayPrice"]:checked').val()=='N'){
					if($("#prodPrice").val()=='' || $("#preferentialPrice").val()=='' ){
						checkResult = false;
					}
				}

				if (!checkResult) {
					editList.isAjaxing = false;
					return false;
				}

				var postData = {};
				postData['prodVo.id'] = $("#id").val();
				postData['prodVo.prodTypeId'] = "03";
				postData['prodVo.saleBeginDate'] = saleStart;
				postData['prodVo.saleEndDate'] = saleEnd;
				postData['prodVo.name'] = $("#title").val();
				postData['prodVo.subTitle'] = $("#subTitle").val();
				
				if($("#js_prodTypeId").val()=="08"){
					postData['prodVo.prodTypeId'] = "08";
				}
				
            	 var select_val = $(".js_search_customer").val();	
            	 var option_length = $("#views option").length;	
            	 var cid='';	
            	 for(var i=0;i<option_length;i++){		
            		 var option_value=$("#views option").eq(i).html();		
            		 if(select_val == option_value){			
            			 cid=$("#views option").eq(i).attr('viewId');
            			 break;		
            		 }	
            	 }
            	

            	 postData['prodVo.viewId'] = cid;
            	 var js_viewId=$("#spotsId").val();
            	 if(js_viewId!=null&&js_viewId!=""&&js_viewId!=undefined){
            		 postData['prodVo.viewId']=js_viewId
            	 }
				
//				alert(cid);
//				return false;
				postData['prodVo.price'] = $("#prodPrice").val();
				postData['prodVo.icon'] = viewIcon;
				postData['prodVo.tags'] = prodtags;
				postData['prodVo.preferentialPrice'] = $("#preferentialPrice").val();
				postData['prodVo.freeNum'] = $("#freeNum").val();
				postData['prodVo.status'] = $('input[name="onsale"]:checked').val();
				postData['prodVo.dayPrice'] = $('input[name="dayPrice"]:checked').val();
				postData['prodVo.prodPicString'] = picArray.join("|");
				postData['prodExtVo.description'] = descriptionEncode;
				postData['prodExtVo.content'] = contentEncode;
				postData['prodExtVo.costExplain'] = costExplainEncode;
				postData['prodExtVo.bookedExplain'] = bookedExplainEncode;
				postData['prodExtVo.othersExplain'] = othersExplainEncode;
				postData['prodExtVo.paramVal'] = base64.encode(JSON.stringify(paramsData));
				
				postData['prodExtVo.idcardDays'] = $("#idcardDays").val();
				postData['prodExtVo.idcardNum'] = $("#idcardNum").val();
				postData['prodExtVo.mobileDays'] = $("#mobileDays").val();
				postData['prodExtVo.mobileNum'] = $("#mobileNum").val();
				
				postData['prodVo.linkSpots'] = linkSpots;
				postData['prodVo.outProdCode'] = $("#outProdCode").val();
				postData['prodVo.otherSaleUrl'] = otherSaleUrl;
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
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success: function(resultMap) {
						editList.isAjaxing = false;
						if (resultMap.code == "success") {
							if($("#js_prodTypeId").val()=="08"){

								window.location.href = '${base}/prod/ticket/audiolist.html';
							}else{

								window.location.href = '${base}/prod/ticket/list.html';
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
		inputType: function() {
			$('.js_radio_itemadd').unbind("click");
			$('.js_radio_itemadd').on('click',function() {
				var html='<tbody>'+
                  '<tr>'+
                    '<input type="hidden" class="pricetext prodPriceId" >'+
                    '<td><input type="text" class="pricetext personNum" ></td>'+
                    '<td><input type="text" class="pricetext childNum" ></td>'+
                    '<td><input type="text" class="pricetext oldPrice" ></td>'+
                    '<td><input type="text" class="pricetext price" ></td>'+
                    '<td><input type="text" class="pricetext totalNum" ></td>'+
                    '<td><input type="text" class="pricetext freeNum" ></td>'+
                    '<td><input type="text" class="pricetext desc" ></td>'+
                    '<td><a class="js_radio_itemremove" href="javascript:void(0)">移除</a></td>'+
                  '</tr>'+
                '</tbody>';
				$("#prodPrice_num").append(html);
				editList.inputType();
			});
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
		},
		changeScenic(){
			$(".js_search_customer").change(function(){
				editList.changeScenicFun($(".js_search_customer").val())
			})
		},
		changeScenicFun(selectViewId){
			
				var chooseViewId=selectViewId;	
				var select_val = $(".js_search_customer").val()
				var option_length = $("#views option").length;
	           	 for(var i=0;i<option_length;i++){		
	           		 var option_value=$("#views option").eq(i).html();		
	           		 if(select_val == option_value){			
	           			chooseViewId=$("#views option").eq(i).attr('viewId');
	           			 break;		
	           		 }	
	           	 }
				$.ajax({
					type: "post",
					url: "${base}/view!queryListAll.ajax",
					data: {
						"viewVo.status": "finish"
					},
					async:false,
					dataType: "json",
					success: function(resultMap) {
						if(resultMap.code="success"){
							var list=resultMap.data.viewVoList;
							var spotsHtml="<option value=''>请选择</option>";
							var spotsChilds=""
							if(list!=null&&list.length>0){
								for(var i=0;i<list.length;i++){
									if(list[i].viewId==chooseViewId){
										spotsChilds=list[i].spotsChilds;
									}
								}
								if(spotsChilds!=null&&spotsChilds.length>0){						
									for(var i=0;i<spotsChilds.length;i++){
										spotsHtml+="<option value='"+spotsChilds[i].viewId +"' viewName='"+spotsChilds[i].name+"'>"+spotsChilds[i].name+"</option>"									
									}
								}				
								$("#spotsId").html(spotsHtml)
							}
						}
					}
				})
			
		},
		inputScenicName(){
			$.ajax({
				type: "post",
				url: "${base}/view!queryListAll.ajax",
				data: {
					"viewVo.status": "finish"
				},
				dataType: "json",
				success: function(resultMap) {
					if(resultMap.code="success"){
						var list=resultMap.data.viewVoList;
						var html=""
						if(list!=null&&list.length>0){
							//全部查询
							for(var i=0;i<list.length;i++){
								html+="<option viewId='"+list[i].viewId 
								+"' type='"+list[i].type
								+"' upViewId='"+list[i].upViewId
								+"' viewName='"+list[i].name+"'>"+list[i].name+"</option>"
							}
							$("#views").html(html);
							//
							var parentId=""
							var flag=false;
							$("#views option").each(function(){
								var viewId=$(this).attr("viewId")
								var js_prodViewId=$("#js_prodViewId").val();
								if(viewId!=null && viewId!=undefined && viewId!="" &&js_prodViewId==viewId){
									var type=$(this).attr("type");
									if(type=="scenic"){
										$(".js_search_customer").val($(this).attr("viewName"))
										return false;
									}else if(type=="spots"){
										parentId=$(this).attr("upViewId");
										if(parentId!=null&&parentId!=undefined&&parentId!=""){
											$("#views option").each(function(){
												var viewId=$(this).attr("viewId")
												if(parentId==viewId){
													
													$(".js_search_customer").val($(this).attr("viewName"))	
													
													return false;
												}
											})
										}
										editList.changeScenicFun(parentId)										
										$("#spotsId").val($(this).attr("viewId"));
										flag=true;
										return false;
									}
									
								}
							})
							if(!flag){
								editList.changeScenicFun(parentId)
							}
								
						}
						
					}
					
				}
			})
			
		}
	}

	var editListInit = function(description, content, costExplain, bookedExplain, othersExplain, param,tags) {
		editList.inputScenicName();
		editList.tagChecked(tags);
		editList.getAllScenic();
		editList.getParams();
		editList.uploadpic();
		editList.editform();
		editList.scenerymarch();
		editList.ueedit(description, content, costExplain, bookedExplain, othersExplain);
		editList.params(param);
		editList.save();
		editList.inputType();
		
		editList.changeScenic();
		var editbt = $('.js_sideBar li.active a').text();
		$('.js_editbt').text(editbt);
	}

	return {
		init: editListInit
	};
})