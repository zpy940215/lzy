define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'diyUpload', 'moment', 'base64'],
function($, common, jqueryui, Handlebars, HandlebarExt, diyUpload, moment, base64) {

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
			var bizType = $(".js_dataType_search option:selected").val();
			data['pageObject.page'] = dataList.pageCur;
			data['pageObject.pagesize'] = dataList.pageSize;
			data['logVo.startDate'] = $(".js_order_startDate").val();
			data['logVo.endDate'] = $(".js_order_endDate").val();
			if(name != ""){
				data['logVo.bizId'] = name;
			}
			if(bizType != "" || bizType != "请选择") {
				data['logVo.bizType'] = bizType;
			}
			$.ajax({
				url: '${base}/log!queryListPage.ajax',
				data: data,
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						Handlebars.registerHelper({
							"formatTime":function(timestamp) {
								var format = 'YYYY-MM-DD HH:mm:ss';  
						        if(arguments.length > 2){  
						            format = arguments[1];  
						        }  
						        if(timestamp != null){  
						            return moment(new Date(timestamp)).format(format);  
						        } else {
						        	return "暂无";
						        }
							},
							"viewType":function(viewType) {
								if(viewType == "view") {
									return "旅游数据";
								} else if (viewType == "view_type") {
									return "旅游数据类型";
								} else if (viewType == "article") {
									return "资讯";
								} else if (viewType == "category") {
									return "栏目";
								} else if (viewType == "resource") {
									return "素材";
								} else if (viewType == "prod") {
									return "电商";
								} else if (viewType == "prod_type") {
									return "产品类型";
								} else {
									return "其他";
								}
							},
							"actionDesc":function(actionDesc) {
								if(actionDesc == "create") {
									return "添加";
								} else if (actionDesc == "update") {
									return "修改";
								} else if (actionDesc == "delete") {
									return "删除";
								} else {
									return actionDesc;
								}
							},
							"actionResult":function(actionResult) {
								if(actionResult == "success") {
									return "成功";
								} else {
									return actionResult;
								}
							}
							
						});
						var _templ = Handlebars.compile($("#logData-list").html());
						$("#logData-list-content").html(_templ(resultData.data));
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
		searchList:function() {
			$.ajax({
				url:"tagType!queryListAll.ajax",
				type:"post",
				dataType:"json",
				async:false,
				data:{
					"tagTypeVo.status":"open"
					},
				success:function(result) {
					$(".js_position_search").html("");
					var datalist = result.data.tagTypeVoList;
					var str = "<option value=''>请选择</option>";
					for(var j in datalist) {
						str += "<option value="+datalist[j].tagTypeid+">"+datalist[j].tagTypename+"</option>";
					}
					$(".js_position_search").html(str);
				}
			});
		},
		getTagTypeList:function() {
			$.ajax({
				url:"tagType!queryListAll.ajax",
				type:"post",
				dataType:"json",
				async:false,
				data:{
					"tagTypeVo.status":"open"
					},
				success:function(result) {
					var data = result.data;
					var _templ = Handlebars.compile($("#adddata-save").html());
					$("#adddata-save-content").html(_templ(data));
					common.base.popUp('.js_popUpadddata');
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
			var bizType = $("#position option:selected").val();
			var tagType = $("#tagtype option:selected").val();
			$.ajax({
				url:'${base}/tag!queryById.ajax',
				data:{
					"tagVo.name":name,
					"tagVo.bizType":bizType,
					"tagVo.tagType":tagType,
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
								url: '${base}/tag!delete.ajax',
								data: {
									"tagVo.id":id,
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
					url: '${base}/tag!queryById.ajax',
					data: {
						"tagVo.id":id,
					},
					dataType: "json",
					success: function(resultData) {
						dataList.isAjaxing = false;
						if (resultData.code == "success") {
							var tagVo = resultData.data.tagVo;
							picArray = new Array();
							dataList.isPicNotChanged = false;
							var data = [];
							data['popUp'] = {
								titleName: '添加数据'
							};
							var _templ = Handlebars.compile($("#adddata-save").html());
							$("#adddata-save-content").html(_templ(tagVo));
							dataList.getTypeList();
							common.base.popUp('.js_popUpadddata');
							if(tagVo.tagType != null) {
								$("#position").find("option[value="+tagVo.tagType+"]").attr("selected",true);
							}
							dataList.saveOrUpdate(tagVo.id);
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
		/*positionChange:function() {
			$("#position").change(function(){
				var bizType = $("#position option:selected").val();
				dataList.getTypeList(bizType);
			});
		},*/
		getTypeList:function() {
				$("#position").html("<option value=''>请选择</option>");
				$.ajax({
					url:"${base}/tagType!queryListAll.ajax",
					data:{
						"tagTypeVo.status":"open",
					},
					async: false,
					dataType:"json",
					success:function(result){
						if(result.code == "success") {
							var dataList = result.data.tagTypeVoList;
							if(dataList.length > 0) {
								var optionstr = "";
								for(var j in dataList) {
									optionstr += "<option value="+dataList[j].tagTypeid+">"+dataList[j].tagTypename+"</option>";
								}
								$("#position").html("<option value=''>请选择</option>" + optionstr);
							}
						}
					}
				});
		},
		//添加数据
		adddata: function() {
			$(".js_add_data").unbind('click');
			$(".js_add_data").click(function() {
				dataList.getTagTypeList();
				//dataList.positionChange();
				dataList.saveOrUpdate("");
			});
		},
		//保存数据
		saveOrUpdate:function(id){
			$(".js_popUpSubmit").unbind('click');
			$(".js_popUpSubmit").on('click',function() {
				var name = $(".js_titlename");
				var tagType = $("#position option:selected");
				var description = $(".js_description").val();
				name.bind('input propertychange',
				function() {
					if ($(this).val() != '') {
						$(this).removeClass('errorborder')
					}
				});
				$("#position").change(function(){
					if ($(this).val() != '请选择' || $(this).val() != '') {
						$(this).removeClass('errorborder');
					}
				});
				if (name.val() == '') {
					name.addClass('errorborder');
					return false;
				}
				if (tagType.val() == '' || tagType.val() == '请选择') {
					$("#position").addClass('errorborder');
					return false;
				}
				if(!dataList.checkSameName(id)) {
					alert("当前位置下已有该标签");
					return false;
				}
				var data = {};
				var url = "";
				data["tagVo.name"] = name.val();
				data["tagVo.tagType"] = tagType.val();
				data["tagVo.description"] = description;
				if(id == "") {
					url = "${base}/tag!save.ajax";
				}else {
					url = "${base}/tag!update.ajax";
					data["tagVo.id"] = id;
				}
				data["tagVo.name"] = name.val();
				data["tagVo.tagType"] = tagType.val();
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
		DateTimeselect:function(startdate,enddate){
			$(startdate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true,
				onClose:function(selectedDate){
					$(".js_select_date").removeClass("active");
                	$(this).siblings(enddate).datepicker("option", "minDate", selectedDate);     
				} 	               
		   	});
		   	$(enddate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true,
				onClose:function(selectedDate){
					$(".js_select_date").removeClass("active");  
				} 
				             
		   	});
		   //$(startdate).datepicker('setDate', new Date());
		   //$(enddate).datepicker('setDate', new Date());
		},
	}
	var dataListInit = function() {
		dataList.DateTimeselect('.js_order_startDate','.js_order_endDate');
		dataList.getList();
		dataList.searchList();
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