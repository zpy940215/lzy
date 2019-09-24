define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var data = {};
	var manapeoList = {
		pageSize: 50,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,
		isAjaxing: false,
		list: function() {
			data['pageObject.page'] = manapeoList.pageCur;
			data['pageObject.pagesize'] = manapeoList.pageSize;
			if($("#tempName").val() != null){
				data['sourceVo.name'] = $("#tempName").val();
			}
			if($("#searchIsFree").find("option:selected").val() != null){
				data['sourceVo.status'] = $("#searchIsFree").find("option:selected").val();
			}
			$.ajax({
				url: '${base}/source!queryListPage.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(data) {
					var _templ = Handlebars.compile($("#user_list").html());
					$("#user_show").html(_templ(data.data));
					for (var j in data.data.dataList) {
						if(data.data.dataList[j].status == "open"){
							$("#isfree_"+data.data.dataList[j].id).html("启用");
						} else {
							$("#isfree_"+data.data.dataList[j].id).html("禁用");
						}
					}
					//分页
					manapeoList.pageTotal = data.data.pagetotal;
					manapeoList.total = data.data.total;
					common.base.createPage('.js_pageDiv', {
						pageCur: manapeoList.pageCur,
						pageTotal: manapeoList.pageTotal,
						total: manapeoList.total,
						backFn: function(p) {
							manapeoList.pageCur = p;
							manapeoList.list();
						}
					});
					//编辑
					manapeoList.editpeople();
					//删除
					manapeoList.deleterow();
					//下载单个二维码
					manapeoList.downloadQrcodeById();
					common.base.loading("fadeOut");
				}
			});
		},
		//角色列表
		rolelist: function() {
			$.ajax({
				url: '${base}/role!list.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					var _templ = Handlebars.compile($("#editpeople-save").html());
					$("#editpeople-save-content").html(_templ(data));
				}
			});
		},
		search: function() {
			$("#search").click(function() {
				manapeoList.list();
			});
		},
		
		/*生成二维码*/
		createQrcode: function() {
			$("#createQrcode").click(function() {
				$.ajax({
					url: '${base}/source!createQrcode.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					beforeSend: function() {
						common.base.loading("fadeIn");
					},
					success: function(data) {
						alert(data.code);
						common.base.loading("fadeOut");
						
					}
				});
				

			});
		},
		/*下载二维码*/
		downloadQrcode: function() {
			$("#downloadQrcode").click(function() {
				var qrcodePath=$.cookie("qrcodePath");
				window.location.href=qrcodePath;
				
			});
		},
		/*单个下载二维码*/
		downloadQrcodeById: function() {
			$('.js_download').unbind("click");
			$(".js_download").click(function() {
				var id = $(this).attr("dataId");
				var sourceCode = $(this).attr("sourceCode");
				var data = {};
				data['sourceVo.id'] = id;
				$.ajax({
					url: '${base}/source!createQrcodeById.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					success: function(data) {
						var path=data.filePath;
						const a = document.createElement('a');
					    a.setAttribute('href', path);
					    a.setAttribute('download', sourceCode + ".png");
					    a.click();
					}
				});
			});
		},
		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							manapeoList.peopleDelete(Id);
						}
					}
				});
			});
		},
		peopleDelete: function(id) {
			var data = {};
			data['sourceVo.id'] = id;
			$.ajax({
				url: '${base}/source!deleteSource.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					if (data.code == "success") {
						manapeoList.list();
						return;
					} else {
						alert(data.description);
					}
				}
			});
		},
		//添加渠道
		addpeople: function() {
			$('.js_add_people').unbind("click");
			$('.js_add_people').on('click',
			function() {
				var _templ = Handlebars.compile($("#addpeople-save").html());
				$("#addpeople-save-content").html(_templ());
				common.base.popUp('.js_popUpaddpeople');
				manapeoList.peopleAdd()
			});
		},
		//确认添加
		peopleAdd: function() {
			$('.js_popUpaddpeople .save').unbind("click");
			$('.js_popUpaddpeople').on('click', '.save',
			function() {
				var name = $(".name").val();
				var isfree = $(".isfree").find("option:selected").attr("value");
				var moneyType = $(".moneyType").val();
				var discount = $(".discount").val();
				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty(".name", '请输入渠道名称！')) {
					checkResult = false;
					return;
				}
				/*if (!common.validate.checkEmpty(".discount", '请输入折扣！')) {
					checkResult = false;
					return;
				}*/
				/*
				if (isfree == null || isfree == undefined || isfree == '' || isfree == '请选择') {
					$(".isfree").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择是否包邮!");
					checkResult = false;
					return;
				} else {
					$(".isfree").siblings(".js_errortip").html('');
					checkResult = true;
				}*/
				var data = {};
				data['sourceVo.name'] = name;
				data['sourceVo.description'] = moneyType;
				data['sourceVo.discount'] = discount;
				data['sourceVo.status'] = isfree;
				//验证通过
				if (checkResult) {
					if (manapeoList.isAjaxing) return false;
					manapeoList.isAjaxing = true;
					$.ajax({
						url: '${base}/source!addSource.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(data) {
							manapeoList.isAjaxing = false;
							if (data.code == "success") {
								//弹框消失，
								$('.js_popUpaddpeople').fadeOut();
								alert("添加成功");
								manapeoList.list();
								return;
							} else {
								alert(data.description);
							}
						}
					});
				}
			});
		},
		//与聚赢商场进行同步
		syncJySc:function(){
			$(".js_sync_jy").click(function(){
				$.ajax({
					url: '${base}/source!syncJuYing.ajax',
					data: '',
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							common.base.popUp('', {
								type: 'choice',
								tipTitle: '温馨提示',
								//标题
								tipMesg: '同步成功!',
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
							manapeoList.list();
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
			})
		},
		postageEdit: function(id) {
			$('.js_popUpeditpeople .save').unbind("click");
			//确认编辑
			$('.js_popUpeditpeople').on('click', '.save',
			function() {
				var name = $(".name").val();
				var isfree = $(".isfree").find("option:selected").attr("value");
				var moneyType = $(".moneyType").val();
				var discount = $(".discount").val();
				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty(".name", '请输入名称！')) {
					checkResult = false;
					return;
				}
				/*if (isfree == null || isfree == undefined || isfree == '' || isfree == '请选择') {
					$(".isfree").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择是否包邮!");
					checkResult = false;
					return;
				} else {
					$(".isfree").siblings(".js_errortip").html('');
					checkResult = true;
				}*/
				var data = {};
				data['sourceVo.id'] = id;
				data['sourceVo.name'] = name;
				data['sourceVo.description'] = moneyType;
				data['sourceVo.status'] = isfree;
				data['sourceVo.discount'] = discount;
				if (checkResult) {
					if (manapeoList.isAjaxing) return false;
					manapeoList.isAjaxing = true;
					$.ajax({
						url: '${base}/source!updateSource.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(data) {
							manapeoList.isAjaxing = false;
							if (data.code == "success") {
								$('.js_popUpeditpeople').fadeOut();
								manapeoList.list();
								alert("编辑成功");
								return;
							} else {
								alert(data.description);
							}
						}
					});
				}
			});
		},		
		//编辑邮费
		editpeople: function() {
			$('.js_edit_people').unbind("click");
			$(".js_edit_people").on('click',
			function() {
				var _templ = Handlebars.compile($("#editpeople-save").html());
				$("#editpeople-save-content").html(_templ());
				common.base.popUp('.js_popUpeditpeople');
				//查询邮费信息
				var mainId = $(this).attr('id');
				var data = {};
				data['sourceVo.id'] = mainId;
				$.ajax({
					url: '${base}/source!queryById.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					success: function(data) {
						var temp = data.data.sourceVo;
						$(".name").val(temp.name);
						$(".isfree option[value="+temp.status+"]").attr("selected",true);
						$(".moneyType").val(temp.description);
						manapeoList.postageEdit(mainId);
					}
				});
			})
		}
	}
	var manapeoListInit = function() {
		manapeoList.list();
		manapeoList.search();
		manapeoList.addpeople();
		manapeoList.createQrcode();
		manapeoList.downloadQrcode();
		manapeoList.syncJySc();
	}
	return {
		init: manapeoListInit
	};
})