define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var type = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,//总条数
		isAjaxing: false,
		sites: [],
		//获取分页数据
		getList: function() {
			var data = {};
			var name = $(".js_search_input").val();
			data['pageObject.page'] = type.pageCur;
			data['pageObject.pagesize'] = type.pageSize;
			var position = $(".js_selectType_search option:selected").val();
			if(position != "" || position != "请选择") {
				data['tagTypeVo.position'] = position;
			}
			if(name != "") {
				data['tagTypeVo.tagTypename'] = name;
			}
			$.ajax({
				url: '${base}/tagType!queryListPage.ajax',
				data: data,
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						console.log(resultData.data);
						var _templ = Handlebars.compile($("#tagtype-list").html());
						$("#tagtype-list-content").html(_templ(resultData.data));
						//分页
						type.pageTotal = resultData.data.pagetotal;
						type.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: type.pageCur,
							pageTotal: type.pageTotal,
							total: type.total,
							backFn: function(p) {
								type.pageCur = p;
								type.getList();
							}
						});
						type.deleterow();
						type.queryById();
						type.addlocation();
					} else {
						if (resultData && resultData.description) {
							common.base.popUp('', {
								type: 'choice',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.description,
								//提示语
								backFn: function(result) {
								}
							});
						}
					}
					
				}
			});
		},
		searchList:function() {
			$.ajax({
				url:"moduleProject!queryListByUpId.ajax",
				//url:"tagType!queryListAll.ajax",
				type:"post",
				dataType:"json",
				data:{
					"moduleVo.lvl":3
				},
				success:function(result) {
					if(result.code == "success") {
						$(".js_selectType_search").html("");
						var str = "<option value=''>请选择</option>";
						//var datalist = result.data.tagTypeVoList;
						var datalist = result.data.moduleProjectVoList;
						for(var j in datalist) {
							//str += "<option value="+datalist[j].position+">"+datalist[j].moduleName+"--"+datalist[j].childModuleName+"</option>";
							str += "<option value="+datalist[j].moduleId+">"+datalist[j].moduleAlias+"</option>";
						}
						$(".js_selectType_search").html(str);
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
			var tagtypename = $('input[name="tagtypename"]').val(),
			selecttype = $('select[name="selecttagtype"]').val();
			$.ajax({
				url:'${base}/tagType!queryById.ajax',
				data:{
					"tagTypeVo.tagTypename":tagtypename,
					"tagTypeVo.position":selecttype,
					"tagTypeVo.status":"open",
				},
				dataType:"json",
				async:false,
				success:function(result){
					if(result.code == "success") {
						var tagTypeVo = result.data.tagTypeVo;
						if(tagTypeVo.id == null) {
							checkResult = true;
						}
					}
				}
			});
			return checkResult;
		},
		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				if (type.isAjaxing) return false;
				type.isAjaxing = true;
				var Id = $(this).attr('deleteId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/tagType!delete.ajax',
								data: {
									"tagTypeVo.id": Id,
								},
								dataType: "json",
								beforeSend: function() {
									common.base.loading("fadeIn");
								},
								success: function(resultData) {
									common.base.loading("fadeOut");
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
										type.getList();
									} else {
										if (resultData && resultData.description) {
											common.base.popUp('', {
												type: 'choice',
												tipTitle: '温馨提示',
												//标题
												tipMesg: resultData.description,
												//提示语
												backFn: function(result) {
												}
											});
										}
									}
									type.isAjaxing = false;
								}
							});
						} else {
							type.deleterow();
							type.addlocation();
						}
					}
				});
			});
		},
		//编辑
		queryById: function() {
			$(".js_edit_type").unbind('click');
			$(".js_edit_type").click(function() {
				var id = $(this).attr('editId');
				$.ajax({
					url: '${base}/tagType!queryById.ajax',
					data: {
						"tagTypeVo.id": id
					},
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							type.getModuleList();
							var result = resultData.data.tagTypeVo;
							$('.js_tagtypename').val(result.tagTypename);
							$('.js_select_module').find("option[value="+result.moduleId+"]").attr("selected",true);
							type.childModuleList(result.moduleId);
							$('.js_selectType').find("option[value="+result.position+"]").attr("selected",true);
							type.moduleChange();
							type.formsubmit(result.id);
						} else {
							if (resultData && resultData.description) {
								common.base.popUp('', {
									type: 'choice',
									tipTitle: '温馨提示',
									//标题
									tipMesg: resultData.description,
									//提示语
									backFn: function(result) {
									}
								});
							}
						}
					}
				});
			});
		},
		moduleChange:function() {
			$(".js_select_module").change(function(){
				type.childModuleList("");
			});
		},
		//子模块
		childModuleList:function(id) {
				var moduleId;
				if(id == ""){
					moduleId = $(".js_select_module option:selected").attr("value");
				} else {
					moduleId = id;
				}
				var param = {};
				param['moduleVo.lvl'] = 3;
				param['moduleVo.upId'] = moduleId;
				$.ajax({
					type:"post",
					dataType:"json",
					url:"moduleProject!queryListByUpId.ajax",
					data:param,
					async:false,
					success:function(result) {
						if(result.code == "success") {
							$(".js_selectType").html("");
							var str = "";
							var datalist = result.data.moduleProjectVoList;
							for(var j in datalist) {
								str += "<option value="+datalist[j].moduleId+">"+datalist[j].moduleAlias+"</option>";
							}
							$(".js_selectType").html(str);
						}
					}
				});
		},
		getModuleList:function(){
			var param = {};
			param['moduleVo.lvl'] = 1;
			$.ajax({
				type:"post",
				dataType:"json",
				url:"moduleProject!queryListByProjectId.ajax",
				data:param,
				async:false,
				success:function(result) {
					if(result.code == 'success') {
						var data = result.data;
						var _templ = Handlebars.compile($("#addTagType-save").html());
						$("#addTagType-save-content").html(_templ(data));
						common.base.popUp('.js_popUpaddTagType');
					}
				}
			});
		},
		//添加位置
		addlocation: function() {
			$(".js_add_tagtype").unbind('click');
			$(".js_add_tagtype").click(function() {
				
				type.getModuleList();
				type.moduleChange();
				type.formsubmit("");
			})
			
		},
		//保存编辑位置
		editlocation: function(resultData, siteId) {
			if (resultData) {
				var placeData = resultData;
				placeData['popUp'] = {
					titleName: '编辑位置',
					siteId: siteId
				};
				placeData['siteList'] = type.sites;
				var _templ = Handlebars.compile($("#addlocation-save").html());
				$("#addlocation-save-content").html(_templ(placeData));
				common.base.popUp('.js_popUpaddlocation');
				type.formsubmit();
			}
		},
		//提交
		formsubmit: function(id) {
			/*位置管理页面添加位置弹窗表单验证*/
			$("#addtagtype").unbind('click');
			$("#addtagtype").on('click',(function() {
				var data = {};
				var url = "";
				var tagtypename = $('input[name="tagtypename"]'),
				selecttype = $('select[name="selecttagtype"]');
				tagtypename.bind('input propertychange',
				function() {
					if ($(this).val() != '') {
						$(this).removeClass('errorborder')
					}
				});
				selecttype.bind('input propertychange',
				function() {
					if ($(this).val() != '请选择') {
						$(this).removeClass('errorborder');
					}
				})
				
				if (tagtypename.val() == '') {
					tagtypename.addClass('errorborder');
				}
				if (selecttype.val() == '') {
					selecttype.addClass('errorborder');
				}
				if(!type.checkSameName(id)) {//查重
					alert("当前位置下已有该标签组");
					return false;
				}
				var description = $(".js_description").val();
				if (tagtypename.val() != '' && selecttype.val() != '') {
					data['tagTypeVo.tagTypename'] = tagtypename.val();
					data['tagTypeVo.position'] = selecttype.val();
					data['tagTypeVo.description'] = description;
					if(id == "") {
						url = '${base}/tagType!save.ajax';
					} else {
						url = '${base}/tagType!update.ajax';
						data['tagTypeVo.id'] = id;
					}
					
					//提交数据
					if (type.isAjaxing) {
						return false;
					}
					type.isAjaxing = true;
					$.ajax({
						url: url,
						data: data,
						dataType: "json",
						async:false,
						success: function(resultData) {
							type.isAjaxing = false;
							if (resultData.code == "success") {
								type.getList();
								$(".js_popUpaddTagType").fadeOut();
							} else {
								if (resultData && resultData.description) {
									common.base.popUp('', {
										type: 'choice',
										tipTitle: '温馨提示',
										//标题
										tipMesg: resultData.description,
										//提示语
										backFn: function(result) {
										}
									});
								}
							}
						}
					});
				}
			})
			)
		}
	}
	var typeInit = function() {
		type.getList();
		type.searchList();
		//搜索
		$('.js_searchbtn').click(function() {
			type.pageCur = 1;
			type.getList();
		});
	}
	return {
		init: typeInit
	};
});