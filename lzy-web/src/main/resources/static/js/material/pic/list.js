define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'ztree', 'diyUpload', 'viewer', 'main', 'base64'],
function($, common, jqueryui, Handlebars, HandlebarExt, ztree, diyUpload, viewer, main, base64) {
	//图片路径
	var picarray = new Array();
	//图片名字
	var imgNameArray = new Array();
	//图片大小
	var picSizeArray = new Array();
	//图片宽度
	var picWArray = new Array();
	//图片长度
	var picHArray = new Array();
	var imgIndex = 0;

	//编辑时候
	//图片路径
	var picFilePath = "";
	//图片大小
	var picfileSize = "";
	//图片宽度
	var picwidth = "";
	//图片长度
	var pichigh = "";

	//编辑时图片的原路径
	var sourcefilePath = "";

	var resource = {
		pageSize: 9,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		isAjaxing: false,
		resourceList: function() {
			if (resource.isAjaxing) return false;
			resource.isAjaxing = true;
			var keyword = $(".search_input").val();
			$.ajax({
				url: '${base}/resource!queryResourceListPage.ajax',
				data: {
					"pageObject.page": resource.pageCur,
					"pageObject.pagesize": resource.pageSize,
					"resourceVo.name": $("#js_name").val(),
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
						var _templ = Handlebars.compile($("#resource-list-content").html());
						$("#resource-list").html(_templ(resultData.data));
						//列表刷新完之后初始化数据
						resource.initDatas();
						//分页
						resource.pageTotal = resultData.data.pagetotal;
						resource.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: resource.pageCur,
							pageTotal: resource.pageTotal,
							total: resource.total,
							backFn: function(p) {
								resource.pageCur = p;
								resource.resourceList();
							}
						});
						resource.picedit(); //初始化编辑事件
						resource.deleterow(); //初始化删除事件
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
					resource.isAjaxing = false;
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

		//添加资源图片
		saveResource: function() {
			if (resource.isAjaxing) return false;
			resource.isAjaxing = true;
			$.ajax({
				type: "post",
				url: "${base}/resource!save.ajax",
				data: {
					"resourceVo.bizType":$(".js_resource_type").val(),
					"resourceVo.resourceNamesString": imgNameArray.join("|"),
					"resourceVo.fileType": "pic",
					'resourceVo.resourcePicString': picarray.join("|"),
					'resourceVo.resourcePicSizeString': picSizeArray.join("|"),
					'resourceVo.resourcePicWString': picWArray.join("|"),
					'resourceVo.resourcePicHString': picHArray.join("|")
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultMap) {
					resource.isAjaxing = false;
					if (resultMap.code == "success") {
						$('.js_popUpupLoadpic').fadeOut();
						resource.resourceList();
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
					common.base.loading("fadeOut");
				},
				error: function(e) {}
			});
		},
		//编辑资源
		resourceEdit: function(ID) {
			if (resource.isAjaxing) return false;
			resource.isAjaxing = true;
			$.ajax({

				type: "post",
				url: "${base}/resource!save.ajax",
				data: {
					"resourceVo.name": $("#js_pic_name").val(),
					"resourceVo.fileType": "pic",
					'resourceVo.id': ID,
					'resourceVo.filePath': picFilePath,
					'resourceVo.fileSize': picfileSize,
					'resourceVo.width': picwidth,
					'resourceVo.high': pichigh
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultMap) {
					resource.isAjaxing = false;
					if (resultMap.code == "success") {
						$('.js_popUpuppicedit').fadeOut();
						resource.resourceList();
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
					common.base.loading("fadeOut");
				},
				error: function(e) {}
			});
		},
		// //查询资源列表
		// picList:function(){
		//  if(resource.isAjaxing)return false;
		//  resource.isAjaxing=true;
		//  $.ajax( {
		// 	 type : "post",
		// 	 url : "${base}/resource!save.ajax",
		// 	 data : {
		// 		 "resourceVo.resourceNamesString"       :imgNameArray.join("|"),
		// 		 "resourceVo.fileType"       			:"pic",
		// 		 'resourceVo.resourcePicString'		    :picarray.join("|")
		// 	 },
		// 	 dataType: "json",
		// 	 success : function(resultMap) {
		// 		 resource.isAjaxing=false;
		// 		 if(resultMap.code == "success"){
		//
		// 			 return;
		// 		 }else{
		// 			 if(resultMap && resultMap.description){
		// 				 alert(resultMap.description);
		// 			 }else if(resultMap && typeof(resultMap) == 'string' ){
		// 				 alert(resultMap);
		// 			 }else{
		// 				 alert("出错了,请重试!");
		// 			 }
		// 		 }
		// 	 },
		// 	 error :function(e){
		// 	 }
		//  });
		// },
		//图片编辑
		picedit: function() {
			$('.js_pic_edit').unbind("click");
			$('.picoperate').on('click', '.js_pic_edit',
			function() {
				var _templ = Handlebars.compile($("#picedit-save").html());
				//console.log(_templ);
				$("#picedit-save-content").html(_templ());
				common.base.popUp('.js_popUpuppicedit');
				//之所以id 必须为 uploadpic ，因为diyUpload代码通过uploadpic绑定样式
				$(".js_popUpuppicedit .uploadpic").attr("id", "uploadpic");
				$(".js_popUpupLoadpic .uploadpic").attr("id", "");
				//之所以id 必须为 uploadsave ，因为diyUpload代码通过uploadsavec绑定开始上传图片事件
				$(".js_popUpuppicedit .uploadSaveClass").attr("id", "uploadsave");
				$(".js_popUpupLoadpic .uploadSaveClass").attr("id", "");
				var picId = $(this).attr('dataId');
				//如果更改图片,则替换原来图片的src,否则，只更改图片的名称
				$('.js_popUpuppicedit .uploadSaveClass').diyUpload({
					url: "${base}/resource!uploadPic.ajax",
					success: function(data) {
						if(data.code == "success") {
							//图片路径
							picFilePath = data.data.picUrl;
							//图片大小
							picfileSize = data.data.picSize;
							//图片宽度
							picwidth = data.data.imageW;
							//图片长度
							pichigh = data.data.imageH;

							resource.resourceEdit(picId);
						} else {
							alert(data.description);
						}
					},
					error: function(err) {
						console.info(err);
					},
					accept: {
						extensions: "gif,jpg,jpeg,png"
					},

					pick: {
						id: "#uploadpic",
						label: "点击选择文件"
					}
				});
				//赋值 编辑页面初始化数据
				var picName = $(this).attr('picName');
				sourcefilePath = $(this).attr('picImgfile');
				$("#js_img_file_name").attr("src", sourcefilePath);
				$("#js_pic_name").val(picName);
				$("#js_pic_name2").text(picName);
				var picId = $(this).attr('dataId');
				resource.jsPicEdit(picId);

			})
		},
		jsPicEdit: function(picId) {
			$('.js_popUpuppicedit .save').click(function() {
				//通过src判断 ，是否是新图片
				if ($(".js_popUpuppicedit #js_img_file_name").attr("src") == sourcefilePath) {
					//图片没有编辑
					resource.resourceEdit(picId);
				}
			});
		},
		//批量选择删除
		batchdelete: function() {
			$('.js_banch_delete').unbind("click");
			$(document).on('click', '.js_banch_delete',
			function() {
				// $('.js_banch_delete').click(function(){
				var rowchecked = $(".js_check_row:checked");
				if (rowchecked.length == '0') {
					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '请选择要删除的行' //提示语
					});
				} else {
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '确认删除，删除后将无法恢复？',
						//提示语
						backFn: function(result) {
							if (result) {
								var idArray = new Array();
								for (var i = 0; i < rowchecked.length; i++) {
									var rowcheckedTemp = rowchecked[i];
									var idTemp = rowcheckedTemp.getAttribute("dataId");
									idArray.push(idTemp);
								}
								var Id = idArray.join("|");
								resource.isAjaxing = false;
								resource.resourceDelete(Id);
								rowchecked.parents('tr').remove();
							}
						}
					});
				}

			})
		},

		uploadpic: function() {
			$('.js_uploadpic').unbind('click');
			$(document).on('click', '.js_uploadpic',
			function() {
				// $('.js_uploadpic').click(function(){
				var _templ = Handlebars.compile($("#uploadpic-save").html());
				//console.log(_templ);
				$("#uploadpic-save-content").html(_templ());
				common.base.popUp('.js_popUpupLoadpic');
				$(".js_popUpupLoadpic .uploadpic").attr("id", "uploadpic");
				$(".js_popUpuppicedit .uploadpic").attr("id", "");
				//之所以id 必须为 uploadsave ，因为diyUpload代码通过uploadsavec绑定开始上传图片事件
				$(".js_popUpuppicedit .uploadSaveClass").attr("id", "");
				$(".js_popUpupLoadpic .uploadSaveClass").attr("id", "uploadsave");
				$('.js_popUpupLoadpic .uploadpic').diyUpload({

					url: "${base}/resource!uploadPic.ajax",
					success: function(data) {
						if(data.code == "success") {
							picarray.push(data.data.picUrl);
							picSizeArray.push(data.data.picSize);
							picWArray.push(data.data.imageW);
							picHArray.push(data.data.imageH);
							imgNameArray.push($("#img_WU_FILE_" + imgIndex).val());
							imgIndex++;
							//这里的imagesize，是选择完图片之后，标签的数量
							var imagesize = $(".viewThumb").length;

							//判断的原因是，等到图片都通过diyupload上传完成之后，再存到数据库
							if (picarray.length == imagesize) {
								resource.saveResource();
							}
						} else {
							alert(data.description);
						}
						

					},
					error: function(err) {
						console.info(err);
					}

				});

				//保存上传图片
				// $("#uploadsave").click(function(){
				// 	$(".viewThumb").each(function(){
				// 		var picfile=$(this).find("img").attr("src");
				// 		var pichtml='<div class="picinsert fl"><div class="Cancel js_Cancel"></div><img  src='+picfile+'><em  class="setcover" >设为外观</em></div>'
				// 		$(".picupload").before(pichtml);
				//
				// 	})
				//
				// });

			})
		},
		//搜索
		inputSearch: function() {
			$('#do_search').click(function() {
				resource.pageCur = 1;
				resource.resourceList();
			})
		},
		//初始化数据
		initDatas: function() {
			picarray = new Array();
			//图片名字
			imgNameArray = new Array();
			//图片大小
			picSizeArray = new Array();
			//图片宽度
			picWArray = new Array();
			//图片长度
			picHArray = new Array();
			//imgIndex不需要初始化数据，和diyUpload 的file_id 的生成规律保持一致
			// imgIndex = 0;
		},
		//删除
		deleterow: function() {
			$('.js_pic_delete').unbind("click");
			$('.js_pic_delete').on('click',
			function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							resource.isAjaxing = false;
							resource.resourceDelete(Id);
						}
					}
				});
			});
		},
		resourceDelete: function(Id) {
			if (resource.isAjaxing) return false;
			resource.isAjaxing = true;
			var keyword = $(".search_input").val();
			//			 if(resource.isAjaxing)return false;
			//			 resource.isAjaxing=true;
			$.ajax({
				url: '${base}/resource!delete.ajax',
				data: {
					"resourceVo.id": Id
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					resource.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '删除成功!',
							//提示语
							backFn: function(result) {
								resource.resourceList();
							}
						});
						//删除完成刷新当前列表
						// resource.resourceList();
						// resource.inputSerch();
					} else {
						if (resultData && resultData.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
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
					article.isAjaxing = false;
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
	}
	var picListInit = function() {
		resource.resourceList();
		resource.batchdelete();
		resource.uploadpic();
		resource.inputSearch();
	}
	return {
		init: picListInit
	};
});