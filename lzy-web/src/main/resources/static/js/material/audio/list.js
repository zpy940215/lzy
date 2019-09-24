define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'ztree', 'diyUpload'],
function($, common, jqueryui, Handlebars, HandlebarExt, ztree, diyUpload) {
	var picarray = new Array();
	var imgNameArray = new Array();
	var audioFilePath = "";
	var newfilePath = "";
	var resource = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		//总数
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
					"resourceVo.fileType": "audio"
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},

				success: function(resultData) {
					common.base.loading("fadeOut");
					resource.isAjaxing = false;
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
						resource.audioedit(); //初始化编辑事件
						resource.deleterow(); //初始化删除事件
						resource.checkbox();

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
					resource.isAjaxing = false;
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
			imgNameArray.push($("#js_file_name").val());
			if (resource.isAjaxing) return false;
			resource.isAjaxing = true;
			$.ajax({
				type: "post",
				url: "${base}/resource!save.ajax",
				data: {
					"resourceVo.resourceNamesString": imgNameArray.join("|"),
					"resourceVo.fileType": "audio",
					'resourceVo.resourcePicString': picarray.join("|"),
					"resourceVo.description": $("#js_description").val()
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultMap) {
					common.base.loading("fadeOut");
					resource.isAjaxing = false;
					if (resultMap.code == "success") {
						$('.js_popUpupuploadaudio').fadeOut();
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
				},
				error: function(e) {
					resource.isAjaxing = false;
					common.base.loading("fadeOut");
				}
			});
		},
		checkbox: function() {
			$('.js_check_all').unbind("click");
			/*列表全选反选*/
			$("table").on('click', '.js_check_all',
			function() {

				if ($(this).attr("checked")) {
					$(".js_check_row").prop("checked", false);
					$(this).attr("checked", false);
				} else {
					$(".js_check_row").prop("checked", true);
					$(this).attr("checked", true);
				}
			})
		},
		//搜索
		inputSearch: function() {
			$('#do_search').click(function() {
				resource.pageCur = 1;
				resource.resourceList();
			})
		},
		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$('table').on('click', '.js_delete_row',
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
							resource.resourceDelete(Id);
						}

					}
				});

			});

		},
		//批量选择删除
		batchdelete: function() {
			$('.js_banch_delete').unbind("click");
			$(document).on('click', '.js_banch_delete',
			function() {
				var rowchecked = $(".js_check_row:checked");
				if (rowchecked.length == '0') {

					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',//标题
						tipMesg: '请选择要删除的行'//提示语
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
								resource.resourceDelete(Id);
								rowchecked.parents('tr').remove();
							}

						}
					});
				}

			})
		},
		resourceDelete: function(Id) {
			var keyword = $(".search_input").val();
			if (resource.isAjaxing) return false;
			resource.isAjaxing = true;
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
					common.base.loading("fadeOut");
					article.isAjaxing = false;
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
				},
				error: function(resultData) {
					article.isAjaxing = false;
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
		//本地上传语音
		audioupload: function() {
			$('.js_audio_upload').unbind("click");
			$(document).on('click', '.js_audio_upload',
			function() {
				var _templ = Handlebars.compile($("#audioupload-save").html());
				$("#uploadaudio-save-content").html(_templ());
				common.base.popUp('.js_popUpupuploadaudio');
				$(".js_popUpupuploadaudio .uploadpic").attr("id", "uploadpic");
				$(".js_popUpuppicedit .uploadpic").attr("id", "");
				//之所以id 必须为 uploadsave ，因为diyUpload代码通过uploadsavec绑定开始上传图片事件
				$(".js_popUpuppicedit .uploadSaveClass").attr("id", "");
				$(".js_popUpupuploadaudio .uploadSaveClass").attr("id", "uploadsave");
				$('.js_popUpupuploadaudio .uploadpic').diyUpload({
					url: "${base}/resource!uploadPic.ajax",
					success: function(data) {
						picarray.push(data.data.picUrl);
						resource.saveResource();
					},
					error: function(err) {
						console.info(err);
					},
					fileNumLimit: 1,
					accept: {
						extensions: "mp3"
					},

					pick: {
						id: "#uploadpic",
						label: "点击选择文件"
					}

				});

			})
		},
		jsAudioEdit: function(picId) {
			// $('#js_autdioEdit').click(function(){
			// 	resource.resourceEdit(picId);
			// })
			$('.js_popUpuppicedit .save').click(function() {
				//通过src判断 ，是否是新图片
				if ($(".js_popUpuppicedit #js_audio_source").attr("src") == audioFilePath) {
					//图片没有编辑
					resource.resourceEdit(picId);
				}
				//图片编辑就什么都不执行，让diyUpload去执行上传图片，和提交服务器

			})
		},
		// 编辑资源
		resourceEdit: function(ID) {
			if (resource.isAjaxing) return false;
			resource.isAjaxing = true;
			$.ajax({
				type: "post",
				url: "${base}/resource!save.ajax",
				data: {
					"resourceVo.name": $("#js_audio_name").val(),
					"resourceVo.description": $("#js_audio_description").val(),
					"resourceVo.fileType": "audio",
					'resourceVo.id': ID,
					'resourceVo.filePath': newfilePath
				},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultMap) {
					common.base.loading("fadeOut");
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
				},
				error: function(e) {
					common.base.loading("fadeOut");
					resource.isAjaxing = false;
				}
			});
		},
		// 语音编辑
		audioedit: function() {
			$('.js_audio_edit').unbind("click");
			$(".js_audio_edit").click(function() {
				var _templ = Handlebars.compile($("#audioedit-save").html());
				$("#audioedit-save-content").html(_templ());
				common.base.popUp('.js_popUpuppicedit');
				//之所以id 必须为 uploadpic ，因为diyUpload代码通过uploadpic绑定样式
				$(".js_popUpuppicedit .uploadpic").attr("id", "uploadpic");
				$(".js_popUpupuploadaudio .uploadpic").attr("id", "");
				//之所以id 必须为 uploadsave ，因为diyUpload代码通过uploadsavec绑定开始上传图片事件
				$(".js_popUpuppicedit .uploadSaveClass").attr("id", "uploadsave");
				$(".js_popUpupLoadpic .uploadSaveClass").attr("id", "");
				var picId = $(this).attr('dataId');
				//如果更改图片,则替换原来图片的src,否则，只更改图片的名称
				$('.js_popUpuppicedit .uploadSaveClass').diyUpload({
					url: "${base}/resource!uploadPic.ajax",
					success: function(data) {
						newfilePath = data.data.picUrl;
						resource.resourceEdit(picId);

					},
					error: function(err) {
						console.info(err);
					},
					fileNumLimit: 1,
					accept: {
						extensions: "mp3"
					},

					pick: {
						id: "#uploadpic",
						label: "点击选择文件"
					}
				});
				//赋值
				var audioName = $(this).attr('audioName');
				var audioDescription = $(this).attr('audioDescription');
				//图片路径
				audioFilePath = $(this).attr('audioImgfile');
				$("#js_audio_name").val(audioName);
				$("#js_file_audio_name").text(audioFilePath);
				$("#js_audio_description").text(audioDescription);
				$("#js_audio_source").attr('src', audioFilePath);

				var picId = $(this).attr('dataId');
				resource.jsAudioEdit(picId);
			})
		},
		//初始化数据
		initDatas: function() {
			picarray = new Array();
			//图片名字
			imgNameArray = new Array();

		}
	}
	var picListInit = function() {
		resource.resourceList();
		resource.batchdelete();
		resource.audioupload();
		resource.inputSearch();

	}
	return {
		init: picListInit
	};
})