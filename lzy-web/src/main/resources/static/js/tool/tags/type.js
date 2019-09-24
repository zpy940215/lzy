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
			var module = $('.js_selectModule_search').val();
			data['pageObject.page'] = type.pageCur;
			data['pageObject.pagesize'] = type.pageSize;
			var position = $(".js_selectType_search option:selected").val();
			if(name != "") {
				data['tagsGroupVo.groupName'] = name;
			}
			if(module != "") {
				data['tagsGroupVo.bizType'] = module;
			}
			$.ajax({
				url: '${base}/tagsGroup!queryListPage.ajax',
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
						type.tagsCheck();
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
		//查重
		checkSameName:function(id) {
			if(id != "") {
				return true;
			}
			var checkResult = false;
//			var groupName = $('input[name="groupName"]').val(),
			var groupName = $('.js_tagtypename').val(),
			selecttype = $('select[name="selecttagtype"]').val();
			$.ajax({
				url:'${base}/tagsGroup!queryById.ajax',
				data:{
					"tagsGroupVo.groupName":groupName,
					"tagsGroupVo.bizType":$('.js_select_module').val(),
					"tagsGroupVo.bizId":selecttype,
					"tagsGroupVo.status":"open",
				},
				dataType:"json",
				async:false,
				success:function(result){
					if(result.code == "success") {
						var tagsGroupVos = result.data.tagsGroupVos;
						if(tagsGroupVos.length < 1) {
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
								url: '${base}/tagsGroup!delete.ajax',
								data: {
									"tagsGroupVo.id": Id,
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
					url: '${base}/tagsGroup!queryById.ajax',
					data: {
						"tagsGroupVo.id": id
					},
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var result = resultData.data.tagsGroupVos[0];
							var _templ = Handlebars.compile($("#addTagType-save").html());
							$("#addTagType-save-content").html(_templ(result));
							common.base.popUp('.js_popUpaddTagType');
							type.childModuleList(result.bizId);
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
		childModuleList:function(bizId) {
			
			$(".js_selectType").html("");
			var str = "";
			var moduleId = $('.js_select_module').val();
			if(moduleId == 'article') {
				$.ajax({
					url: '${base}/category!queryCategoryList.ajax',
					data:{},
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var datalist = resultData.data.categoryVoList;
							for(var j in datalist) {
								str += "<option value="+datalist[j].categoryId+">"+datalist[j].name+"</option>";
							}
							$(".js_selectType").html(str);
							$(".js_selectType").val(bizId);
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
			}else if(moduleId == 'view') {
				$.ajax({
					url: '${base}/viewType!queryListAll.ajax',
					data:{
						'viewTypeVo.status': 'open'
					},
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var datalist = resultData.data.viewtypeList;
							for(var j in datalist) {
								str += "<option value="+datalist[j].typeId+">"+datalist[j].description+"</option>";
							}
							$(".js_selectType").html(str);
							$(".js_selectType").val(bizId);
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
			}else if(moduleId == 'prod') {
				$.ajax({
					url: '${base}/tagsGroup!queryProdTypeEnum.ajax',
					data:{},
					dataType: "json",
					success: function(resultData) {
							for (var key in resultData){
								str += "<option value="+key+">"+resultData[key]+"</option>";
							}
							$(".js_selectType").html(str);
							$(".js_selectType").val(bizId);
					}
				});
			}
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
				var groupName = $('input[name="tagtypename"]'),
				selecttype = $('select[name="selecttagtype"]');
				groupName.bind('input propertychange',
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
				
				if (groupName.val() == '') {
					groupName.addClass('errorborder');
				}
				if (selecttype.val() == '') {
					selecttype.addClass('errorborder');
				}
				if(!type.checkSameName(id)) {//查重
					alert("当前位置下已有该标签组");
					return false;
				}
				var description = $(".js_description").val();
				if (groupName.val() != '' && selecttype.val() != '') {
					data['tagsGroupVo.groupName'] = groupName.val();
					data['tagsGroupVo.pos'] = $('.js_pos').val();
					data['tagsGroupVo.bizType'] = $('.js_select_module').val();
					data['tagsGroupVo.bizId'] = selecttype.val();
					data['tagsGroupVo.description'] = description;
					if(id == "") {
						url = '${base}/tagsGroup!save.ajax';
					} else {
						url = '${base}/tagsGroup!update.ajax';
						data['tagsGroupVo.id'] = id;
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
		},
		tagsCheck:function() {
			$('.js_add_data').unbind('click');
			$('.js_add_data').on('click',function() {
				var groupId = $(this).attr('groupId');
				$.ajax({
					url: '${base}/tagsGroup!queryDataList.ajax',
					data: {
						'tagsGroupVo.groupId' : groupId
					},
					dataType: "json",
					success: function(result) {
						if (result.code == "success") {
							var tagDataVos = result.data.tagsDataVos;
							$.ajax({
								url: '${base}/tags!queryListPage.ajax',
								data: {
									'pageObject.page' : 1,
									'pageObject.pagesize' : 1000
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										var _templ = Handlebars.compile($("#dataAdd-save").html());
										$("#dataAdd-save-content").html(_templ(resultData.data));
										common.base.popUp('.js_popUpDataAdd');
										
										for (var a = 0; a < tagDataVos.length; a++) {
											$("input[value='"+tagDataVos[a].tagsId+"']").prop("checked",true);
										}
										
										type.tagsSave(groupId);
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
		tagsSave:function(groupId) {
			$('.js_popUpSubmitDataAdd').unbind('click');
			$('.js_popUpSubmitDataAdd').on('click',function() {
				  var tags = "";
		          $("input[name='tagsCheck']").each(function(){
		            if($(this).is(":checked")){
		            	tags += $(this).val()+",";
		            }
		          });
		          tags = tags.substring(0, tags.length - 1);
		          if (type.isAjaxing) return false;
				  type.isAjaxing = true;
		          $.ajax({
						url: '${base}/tagsGroup!dataUpsert.ajax',
						data: {
							'tagsGroupVo.groupId': groupId,
							'tagsGroupVo.tags': tags
						},
						dataType: "json",
						type:"post",
						success: function(resultData) {
							type.isAjaxing = false;
							if (resultData.code == "success") {
								$('.js_popUpDataAdd').fadeOut();
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
		}
	}
	var typeInit = function() {
		type.getList();
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