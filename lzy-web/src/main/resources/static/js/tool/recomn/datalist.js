define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'diyUpload', 'base64'],
function($, common, jqueryui, Handlebars, HandlebarExt, diyUpload, base64) {
	
	var delArray = new Array(); //存放删除记录id
	var picArray = new Array(); //存放上传图片路径
	var prepareDataArray = new Array(); //存放遍历出来的图片，链接和描述
	var totalNum;
	var articleListStr = '';
	var dataList = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总条数
		isAjaxing: false,
		picUrl: '',
		//获取分页数据
		getList: function() {
			$.ajax({
				url: '${base}/positionData!queryListPageSingle.ajax',
				data: {
					"pageObject.page": dataList.pageCur,
					"pageObject.pagesize": dataList.pageSize,
					"positionDataVo.name": $(".js_search_input").val(),
					"positionDataVo.isSpecial": "true",
					"positionDataVo.status": "open",
					"positionDataVo.positionId": $('.js_position').val()
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#positionData-list").html());
						$("#positionData-list-content").html(_templ(resultData.data));
						//分页
						dataList.pageTotal = resultData.data.pagetotal;
						dataList.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: dataList.pageCur,
							pageTotal: dataList.pageTotal,
							total: dataList.total,
							backFn: function(p) {
								dataList.pageCur = p;
								dataList.getList();
							}
						});
						dataList.deleterow();
						dataList.adddata();
						dataList.queryById();
						dataList.posChange();
						
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

		//查询所有站点
		getAllSites: function(siteId) {
			$.ajax({
				url: '${base}/site!querySitesList.ajax',
				dataType: "json",
				success: function(resultData) {
					if (resultData.code == "success") {
						var sites = resultData.data.sitelist;
						var len = sites.length;

						$("#site").html('');

						$("#site").append('<option value="">请选择</option>');
						for (i = 0; i < len; i++) {
							$("#site").append('<option value=' + sites[i].siteId + '>' + sites[i].name + '</option>');
						}
						if (siteId) {
							$("#site").val(siteId);
						}
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
		//站点选择
		chooseSite: function(positionId) {
			if (positionId) {
				dataList.getAllPosition(positionId);
			} else {
				$(document).on("change", "#site",
				function() {

					dataList.getAllPosition();
				});
			}
		},

		//查询所有位置
		getAllPosition: function(positionId) {

			$.ajax({
				url: '${base}/position!queryListPage.ajax',
				data: {
					"pageObject.page": 1,
					"pageObject.pagesize": 1000,
					"positionVo.siteId": $("#site").val(),
					"positionVo.status": "open"
				},
				dataType: "json",
				success: function(resultData) {
					if (resultData.code == "success") {

						var positions = resultData.data.dataList;
						var len = positions.length;

						$("#position").html('');

						$("#position").append('<option value="">请选择</option>');
						for (i = 0; i < len; i++) {
							$("#position").append('<option value=' + positions[i].id + '>' + positions[i].name + '</option>');
						}
						if (positionId) {
							$("#position").val(positionId);
						}

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
		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('deleteId');
				var positionId = $(this).attr('positionId');
				var dataType = $(this).attr('dataType');
				var postData = {};
				if (dataType == "more") {
					postData['positionDataVo.positionId'] = positionId;
				} else {
					postData['positionDataVo.id'] = Id;
				}

				if (dataList.isAjaxing) {
					return false;
				}
				dataList.isAjaxing = true;

				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								type : "post",
								url: '${base}/positionData!delete.ajax',
								data: postData,
								dataType: "json",
								success: function(resultData) {
									dataList.isAjaxing = false;
									if (resultData.code == "success") {
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: '删除成功!',
											//提示语
											backFn: function(result) {

}
										});
										dataList.getList();
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
						} else {
							dataList.deleterow();
							dataList.adddata();
						}
					}
				});
			});
		},
		//查询一条数据
		queryById: function() {
			$(".js_edit_location").unbind('click');
			$(".js_edit_location").click(function() {
				var Id = $(this).attr('editId');
				var positionId = $(this).attr('positionId');
				var dataType = $(this).attr('dataType');
				var name = $(this).attr('name');
				var postData = {};
				if (dataType == "more") {
					postData['positionDataVo.name'] = name;
					postData['positionDataVo.positionId'] = positionId;
				} else {
					postData['positionDataVo.id'] = Id;
				}

				if (dataList.isAjaxing) {
					return false;
				}
				dataList.isAjaxing = true;
				$.ajax({
					url: '${base}/positionData!queryById.ajax',
					data: postData,
					dataType: "json",
					success: function(resultData) {
						dataList.isAjaxing = false;
						if (resultData.code == "success") {
							// dataList.data = positionDataVoList;
							dataList.editData(resultData.data);
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
			});
		},
		//添加数据
		adddata: function() {
			$(".js_add_data").unbind('click');
			$(".js_add_data").click(function() {
				picArray = new Array();
				dataList.isPicNotChanged = false;
				var data = [];
				data['popUp'] = {
					titleName: '添加数据'
				};
				var _templ = Handlebars.compile($("#adddata-save").html());
				$("#adddata-save-content").html(_templ(data));
				common.base.popUp('.js_popUpadddata');
				$('.js_articleList').append(articleListStr);

				dataList.diyEdit();
				dataList.articleCheck();
				dataList.keyWords();
				$(".js_datapic_Cancel").unbind("click");
				$('.fileBoxUl').on('click', '.js_datapic_Cancel',
				function() {
					var index = $(this).parent().index();
					if (index < picArray.length && index >= 0) {
						picArray.splice(index, 1);
					}
					$(this).parent().remove();
				});
				dataList.getAllSites();
				dataList.chooseSite();
				//图片拖动排序
				$("#datapicsortable").sortable({
					stop: function(event, ui) {
						var startItem = ui.item;
						var offsetIndex = Math.round(( - ui.originalPosition.left + ui.position.left) / (startItem.width()));
						var startIndex = startItem.attr('dIndex');
						var endIndex = parseInt(startIndex) + parseInt(offsetIndex);
						// alert("startIndex="+startIndex+",offsetIndex="+offsetIndex+",endIndex="+endIndex);
						dataList.updateIndex();
						dataList.updatePicArray(startIndex, endIndex);
					}
				});
				$("#datapicsortable").disableSelection();
				$(".js_popUpSubmit").unbind('click');
				$(".js_popUpSubmit").on('click',
				function() {
					dataList.prepareData(false);
					dataList.formsubmit();
				})
				// dataList.savesubmit();
			});
		},
		diyEdit: function(uploadPicNum) {
			$('#datauploadpic').diyUpload({
				url: '${base}/positionData!uploadPic.ajax',
				fileNumLimit:1,
				loadSuccess: function() {
					webUploader.upload();
				},
				success: function(data) {
					$('.setcover').remove(); //移除设为外观
					if(data.code == "success") {
						picArray.push(data.data.picUrl);
						dataList.updateIndex();
					} else {
						alert(data.description);
					}
					
				},
				error: function(err) {
					console.info(err);
				}
			});
			// $(".js_datapic_Cancel").unbind("click");
			// $(document).on('click','.js_datapic_Cancel',function(){
			//     var index;
			//     if (uploadPicNum !=undefined) {
			//         index = $(this).parent().index() - uploadPicNum;
			//     }else {
			//         index = $(this).parent().index()
			//     }
			//     if (index < picArray.length && index >= 0) {
			//         picArray.splice(index,1);
			//     }
			//     $(this).parent().remove();
			// });
		},
		//更新index
		updateIndex: function() {
			$(".js_pic_List").each(function() {
				$(this).attr("dIndex", $(this).index());
			});
		},
		updatePicArray: function(startIndex, endIndex) {
			picArray.splice(endIndex, 0, picArray.splice(startIndex, 1)[0]);
		},

		//编辑数据
		editData: function(data) {
			picArray = new Array();
			var editData = data;
			editData['popUp'] = {
				titleName: '编辑数据'
			};
			var _templ = Handlebars.compile($("#adddata-save").html());
			$("#adddata-save-content").html(_templ(editData));
			common.base.popUp('.js_popUpadddata');

			var siteId = data.positionDataVoList[0].positionVo.siteId;
			var positionId = data.positionDataVoList[0].positionId;

			var uploadPicNum = data.positionDataVoList.length;
			dataList.diyEdit(uploadPicNum);
			$('.js_articleList').append(articleListStr);


			dataList.articleCheck();
			dataList.keyWords();
			$(".js_datapic_Cancel").unbind("click");
			$('.fileBoxUl').on('click', '.js_datapic_Cancel',
			function() {
				var index = $(this).parent().index() - uploadPicNum;
				if (index < picArray.length && index >= 0) {
					picArray.splice(index, 1);
				}
				$(this).parent().remove();
			});

			dataList.getAllSites(siteId);
			dataList.chooseSite(positionId);
			//图片拖动排序
			$("#datapicsortable").sortable();
			$("#datapicsortable").disableSelection();
			dataList.addDelData(); //填满要删除的记录
			$(".js_popUpSubmit").on('click',
			function() {
				dataList.prepareData(true);
				dataList.formsubmit();

			})
			// dataList.savesubmit();
		},
		savesubmit: function() {
			$(".js_popUpSubmit").unbind('click');
			$(".js_popUpSubmit").on('click',
			function() {
				var lilength = $(".diyUploadHover").length;
				if (lilength == 1) {
					picArray = new Array();
					dataList.formsubmit();
				}

			})
		},
		addDelData: function() {
			$(".js_pic_DEL").unbind("click");
			$(document).on('click', ".js_pic_DEL",
			function() {
				var id = $(this).attr("dataId");
				if (id != '') {
					delArray.push(id);
				}
				$(this).parents(".js_pic_List").remove();
			})
		},
		delData: function() {
			var i = delArray.length;
			while (i--) {
				var positionDataId = delArray[i];
				$.ajax({
					type: "post",
					url: '${base}/positionData!delete.ajax',
					data: {
						"positionDataVo.id": positionDataId
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
		// 遍历图片，链接和描述
		prepareData: function(isEdit) {
			dataList.isAjaxing = true;
			var count = $(".js_pic_List").length;
			prepareDataArray = new Array();
			var index = -1;
			$(".js_pic_List").each(function() {
				var dataMap = {};
				var id = $(this).find(".js_hidden_id").val();
				if (id) {
					dataMap['id'] = id;
				} else {
					index++;
				}
				dataMap['url'] = $(this).find(".js_link_input").val();
				dataMap['content'] = $(this).find(".js_con_input").val();
				dataMap['redirectBizType'] = $(this).find(".js_key_type").attr('key');
				dataMap['redirectBizId'] = $(this).find(".js_key_type").attr('typeId');
				if (index >= 0 && picArray.length > 0) {
					dataMap['icon'] = picArray[index];
					dataList.isAjaxing = false;
				}
				dataMap['pos'] = count - $(this).index();
				prepareDataArray.push(dataMap);
				if(isEdit) {
					dataList.isAjaxing = false;
				}
			});
		},
		formsubmit: function() {
			var checkResult = true;
			//验证
			var checkResult = true;
			var titlename = $('input[name="titlename"]'),
			selectsite = $('select[name="selectsite"]'),
			selectoption = $('select[name="selectoption"]');
			titlename.bind('input propertychange',
			function() {
				if ($(this).val() != '') {
					$(this).removeClass('errorborder')
				}
			})

			if (titlename.val() == '') {
				titlename.addClass('errorborder');
				checkResult = false;
			}
			if ($("#position").val() == '' && $("#positionId").val() == '') {
				$("#position").addClass('errorborder');
				checkResult = false;
			}

			if (!checkResult) {
				dataList.isAjaxing = false;
				return false;
			}
			var postData = {};
			var articleId = $('.js_search').attr('articleId');
			for (var i = 0; i < prepareDataArray.length; i++) {
				postData['positionDataVoList[' + i + '].id'] = prepareDataArray[i].id;
				postData['positionDataVoList[' + i + '].name'] = $('.js_titlename').val();
				postData['positionDataVoList[' + i + '].positionId'] = $('#position').val();
				if (prepareDataArray[i].icon) {
					postData['positionDataVoList[' + i + '].icon'] = prepareDataArray[i].icon;
				}
				if (articleId!=null && articleId!='') {
					postData['positionDataVoList[' + i + '].articleId'] =articleId;
				}else{
					postData['positionDataVoList[' + i + '].url'] = prepareDataArray[i].url;
					postData['positionDataVoList[' + i + '].content'] = prepareDataArray[i].content;
				}
				postData['positionDataVoList[' + i + '].pos'] = prepareDataArray[i].pos;
				postData['positionDataVoList[' + i + '].redirectBizType'] = prepareDataArray[i].redirectBizType;
				postData['positionDataVoList[' + i + '].redirectBizId'] = prepareDataArray[i].redirectBizId;
			}
			//提交数据
			if (dataList.isAjaxing) {
				return false;
			}
			dataList.isAjaxing = true;
			// var Id = $(this).attr('editId');
			var Id = $("#id").val();
			dataList.delData();
			$.ajax({
				url: '${base}/positionData!save.ajax',
				data: postData,
				dataType: "json",
				type:"post",
				success: function(resultData) {
					dataList.isAjaxing = false;
					if (resultData.code == "success") {
						dataList.getList();
						$(".popup").fadeOut();
						return false;
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
		posChange:function() {
			$('.js_pos').blur(function() {
				var pos = $(this).val();
				var id = $(this).attr('dataId');
				var postData = {};
				postData['positionDataVoList[0].pos'] = pos;
				postData['positionDataVoList[0].id'] = id;
				$.ajax({
					url: '${base}/positionData!save.ajax',
					data: postData,
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							dataList.getList();
							return false;
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
			});
		},
		articleCheck:function(){
			$('.js_typeCheck input[type="radio"]').unbind('click');
			$('.js_typeCheck input[type="radio"]').on('click',function(){
				
				var dataid=$(this).attr('dataid');
				if(dataid=='article'){
					$('.js_articlebt').show();
					$('.js_link_input').hide();
					$('.js_con_input').hide();
					$('.js_key_type').hide();
				}else{
					$('.js_articlebt').hide();
					
				}
			});
		},
	  articleList:function(){
        	$.ajax({
        		url:"${base}/article!queryAll.ajax",
        		type:"post",
        		data:{"articleVo.status":'open'},
        		success:function(resultMap){
        			if(resultMap.code=='success'){
        				var input = '<input type="text" class="commtext text_1 js_tenant js_search" placeholder="请输入文章标题" style="border:none"/>';
        				var html = '<div class="keyWords js_keyWords left1">';
        				for(var i=0;i< resultMap.data.articleVoList.length;i++){
        					var article = resultMap.data.articleVoList[i];
        					html += ' <div class="item js_shop_item" articleId="'+article.articleId+'">'+article.subject+'</div>';
        				}
        				html += '</div>';
        				articleListStr = input+html;
        			}
        		}
        	})
        },
      //关键词匹配  下拉框
		keyWords:function(){
			$('.js_search').unbind('click');
			$(document).on('click', '.js_search',function() {
				var thisval = $(this);
				$(this).parent().find(".js_keyWords").show();
				thisval.parent().find(".js_keyWords .item").unbind('click');
				thisval.parent().find(".js_keyWords .item").click(function() {
					var itemval = $(this).text();
					var articleId=$(this).attr('articleId');
					thisval.attr("articleId", articleId);
					if(articleId != undefined){
						thisval.attr("articleId", articleId);
					}
					thisval.val(itemval);
					
					thisval.parent().find('.js_keyWords').slideUp(200);
				})
			});
			$(document).on('input propertychange', '.js_search',function() {
				var thisval = $(this);
				$(this).parent().find(".js_keyWords .item").hide();
				$(this).parent().find('.js_keyWords .noitem').remove();
				var itemsize = 0;
				$(this).siblings(".js_keyWords").find('.item').each(function() {
					var keyWord = jQuery.trim(thisval.val()); //keyWord：输入关键词
					var couponname = $(this).text();
					if (couponname.indexOf(keyWord) != -1) { //有匹配项
						thisval.parent().find(".js_keyWords").show();
						$(this).show();
						itemsize++;
					}
				})
				if (itemsize == 0) {
					thisval.parent().find(".js_keyWords").show().append('<p class="noitem">暂无搜索结果！</p>');
				} else {
					thisval.parent().find('.js_keyWords .noitem').remove();
				}
				thisval.parent().find(".js_keyWords .item").unbind('click');
				thisval.parent().find(".js_keyWords .item").click(function() {
					var itemval = $(this).text();
					var id = $(this).attr('value');
					thisval.attr("dataid", id);
					thisval.val(itemval);
					thisval.parent().find('.js_keyWords').slideUp(200);
				})
			});
			
			$("body").click(function() {
				$('.js_keyWords').slideUp(200);
				$('.js_keyWords1').slideUp(200);
			})
			
		},
	}
	var dataListInit = function() {
		dataList.getList();
		dataList.articleList();
		dataList.keyWords();
		//搜索
		$('.js_searchbtn').click(function() {
			dataList.pageCur = 1;
			dataList.getList();
		});
	}
	return {
		init: dataListInit
	};
});
function getContent(obj){
	var keyword = jQuery.trim($(obj).val());
    $.ajax( {
	      type : "post",
	      url: "${base}/positionData!KeywordSearch.ajax",
	      data:{"keyword":keyword},
	      dataType: "json",
	      success : function(resultMap) {
	    	  	var view = resultMap.data.viewVoList;
	    	  	var prod = resultMap.data.prodVoList;
	    	  	var article = resultMap.data.articleVoList
				var html="";
	    	  	if(view!=''&&view!=null){
	    	  		for(var i=0;i<view.length;i++){
						html += "<li calss='item' onmouseenter='getFocus(this)' value="+view[i].id+" type='view' onclick='getCon(this)' style='border: 1px solid #ccc;height:25px;line-height:25px;'>"+view[i].name+"</li>"
					}
	    	  	}
	    	  	if(prod!=''&&prod!=null){
	    	  		for(var i=0;i<prod.length;i++){
						html += "<li calss='item' onmouseenter='getFocus(this)' value="+prod[i].id+" type='prod' onclick='getCon(this)' style='border: 1px solid #ccc;height:25px;line-height:25px;'>"+prod[i].name+"</li>"
					}
	    	  	}
	    	  	if(article!=''&&article!=null){
	    	  		for(var i=0;i<article.length;i++){
						html += "<li calss='item' onmouseenter='getFocus(this)' value="+article[i].id+" type='article' onclick='getCon(this)' style='border: 1px solid #ccc;height:25px;line-height:25px;'>"+article[i].subject+"</li>"
					}
	    	  	}
				
			    if(html == ""){
			    	$(obj).parent().next().hide().html("");
			    }else{
			    	$(obj).parent().next().show().html(html);
			    }
			    if(keyword == ""){
			    	$(obj).parent().next().hide().html("");
			    }
	      },
	      error :function(e){
	         console.log(e);
	      }
	  });
};
function getFocus(obj){
    $('li').removeClass('addbg');
    $(obj).addClass('addbg');
}
function getCon(obj){
	$('#minsukey').val($(".addbg").text());
	$("#minsukey").attr("typeId",$(obj).attr('value'));
	$("#minsukey").attr("key",$(obj).attr('type'));
   $("#keywordappend").hide().html("");
}