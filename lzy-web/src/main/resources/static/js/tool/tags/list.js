define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'diyUpload', 'base64'],
function($, common, jqueryui, Handlebars, HandlebarExt, diyUpload, base64) {

	var delArray = new Array(); //存放删除记录id
	var picArray = new Array(); //存放上传图片路径
	var prepareDataArray = new Array(); //存放遍历出来的图片，链接和描述
	var totalNum;
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
			var data = {};
			var name = $(".js_search_input").val();
			data['pageObject.page'] = dataList.pageCur;
			data['pageObject.pagesize'] = dataList.pageSize;
			if(name != ""){
				data['tagsVo.tagsName'] = name;
			}
			$.ajax({
				url: '${base}/tags!queryListPage.ajax',
				data: data,
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#tagData-list").html());
						$("#tagData-list-content").html(_templ(resultData.data));
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
		//查重
		checkSameName:function(id) {
			if(id != "") {
				return true;
			}
			var checkResult = false;
			var name = $(".js_titlename").val();
			$.ajax({
				url:'${base}/tags!queryById.ajax',
				data:{
					"tagsVo.tagsName":name,
				},
				dataType:"json",
				async:false,
				success:function(result){
					if(result.code != "success") {
						checkResult = true;
					}
				}
			});
			return checkResult;
		},
		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var id = $(this).attr('deleteId');
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
								url: '${base}/tags!delete.ajax',
								data: {
									"tagsVo.id":id,
								},
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
			$(".js_edit_tag").unbind('click');
			$(".js_edit_tag").click(function() {
				var id = $(this).attr('editId');
				if (dataList.isAjaxing) {
					return false;
				}
				dataList.isAjaxing = true;
				$.ajax({
					url: '${base}/tags!queryById.ajax',
					data: {
						"tagsVo.id":id,
					},
					dataType: "json",
					success: function(resultData) {
						dataList.isAjaxing = false;
						if (resultData.code == "success") {
							var tagsVo = resultData.data.tagsVo;
							picArray = new Array();
							dataList.isPicNotChanged = false;
							var data = [];
							data['popUp'] = {
								titleName: '添加数据'
							};
							var _templ = Handlebars.compile($("#adddata-save").html());
							$("#adddata-save-content").html(_templ(tagsVo));
							common.base.popUp('.js_popUpadddata');
							if(tagsVo.tagType != null) {
								$("#position").find("option[value="+tagsVo.tagType+"]").attr("selected",true);
							}
							dataList.saveOrUpdate(tagsVo.id);
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
			});
		},
		//添加数据
		adddata: function() {
			$(".js_add_data").unbind('click');
			$(".js_add_data").click(function() {
				var _templ = Handlebars.compile($("#adddata-save").html());
				$("#adddata-save-content").html(_templ());
				common.base.popUp('.js_popUpadddata');
				dataList.saveOrUpdate("");
			});
		},
		//保存数据
		saveOrUpdate:function(id){
			$(".js_popUpSubmit").unbind('click');
			$(".js_popUpSubmit").on('click',function() {
				var name = $(".js_titlename");
				var description = $(".js_description").val();
				var pos = $('.js_pos').val();
				name.bind('input propertychange',
				function() {
					if ($(this).val() != '') {
						$(this).removeClass('errorborder')
					}
				});
				if (name.val() == '') {
					name.addClass('errorborder');
					return false;
				}
				if(!dataList.checkSameName(id)) {
					alert("当前位置下已有该标签");
					return false;
				}
				var data = {};
				var url = "";
				data["tagsVo.tagsName"] = name.val();
				data["tagsVo.description"] = description;
				data["tagsVo.pos"] = pos;
				if(id == "") {
					url = "${base}/tags!save.ajax";
				}else {
					url = "${base}/tags!update.ajax";
					data["tagsVo.id"] = id;
				}
				$.ajax({
					url:url,
					data:data,
					dataType:"json",
					async:false,
					success:function(result){
						$(".js_popUpadddata").fadeOut();
					}
				})
				dataList.getList();
			});
		},
	}
	var dataListInit = function() {
		dataList.getList();
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