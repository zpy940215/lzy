define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var data = {};
	var manapeoList = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,
		isAjaxing: false,
		list: function() {
			data['templatePage.page'] = manapeoList.pageCur;
			data['templatePage.pagesize'] = manapeoList.pageSize;
			if($("#tempName").val() != null){
				data['templateVo.name'] = $("#tempName").val();
			}
			if($("#searchIsDefault").find("option:selected").val() != null){
				data['templateVo.isdefault'] = $("#searchIsDefault").find("option:selected").val();
			}
			if($("#searchIsFree").find("option:selected").val() != null){
				data['templateVo.isfree'] = $("#searchIsFree").find("option:selected").val();
			}
			$.ajax({
				url: '${base}/postage!queryTemplatePage.ajax',
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
						if(data.data.dataList[j].isdefault == "Y"){
							$("#isdefault_"+data.data.dataList[j].id).html("是");
						} else {
							$("#isdefault_"+data.data.dataList[j].id).html("否");
						}
						if(data.data.dataList[j].isfree == "Y"){
							$("#isfree_"+data.data.dataList[j].id).html("是");
						} else {
							$("#isfree_"+data.data.dataList[j].id).html("否");
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
			data['templateVo.id'] = id;
			$.ajax({
				url: '${base}/postage!deleteTemplate.ajax',
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
		//添加邮费模板
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
				var isdefault = $(".isdefault").find("option:selected").attr("value");
				var isfree = $(".isfree").find("option:selected").attr("value");
				var moneyType = $(".moneyType").val();
				var postType = $(".postType").val();
				var sendtime = $(".sendtime").val();
				var money = $(".money").val();
				
				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty(".name", '请输入名称！')) {
					checkResult = false;
					return;
				}
				if (isdefault == null || isdefault == undefined || isdefault == '' || isdefault == '请选择') {
					$(".isdefault").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择是否默认!");
					checkResult = false;
					return;
				} else {
					$(".isdefault").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (isfree == null || isfree == undefined || isfree == '' || isfree == '请选择') {
					$(".isfree").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择是否包邮!");
					checkResult = false;
					return;
				} else {
					$(".isfree").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (!common.validate.checkEmpty(".moneyType", '请输入计价方式！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".postType", '请输入运送方式！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".sendtime", '请输入发货时间！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".money", '请输入费用！')) {
					checkResult = false;
					return;
				}
				if (isNaN($(".money").val())) {
					$(".money").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请填入数字!");
					checkResult = false;
					return;
				} else {
					$(".money").siblings(".js_errortip").html('');
					checkResult = true;
				}
				var data = {};
				data['templateVo.name'] = name;
				data['templateVo.isdefault'] = isdefault;
				data['templateVo.isfree'] = isfree;
				data['templateVo.moneyType'] = moneyType;
				data['templateVo.postType'] = postType;
				data['templateVo.sendtime'] = sendtime;
				data['templateVo.money'] = money;
				//验证通过
				if (checkResult) {
					if (manapeoList.isAjaxing) return false;
					manapeoList.isAjaxing = true;
					$.ajax({
						url: '${base}/postage!saveTemplate.ajax',
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
		postageEdit: function(id) {
			$('.js_popUpeditpeople .save').unbind("click");
			//确认编辑
			$('.js_popUpeditpeople').on('click', '.save',
			function() {
				var name = $(".name").val();
				var isdefault = $(".isdefault").find("option:selected").attr("value");
				var isfree = $(".isfree").find("option:selected").attr("value");
				var moneyType = $(".moneyType").val();
				var postType = $(".postType").val();
				var sendtime = $(".sendtime").val();
				var money = $(".money").val();
				
				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty(".name", '请输入名称！')) {
					checkResult = false;
					return;
				}
				if (isdefault == null || isdefault == undefined || isdefault == '' || isdefault == '请选择') {
					$(".isdefault").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择是否默认!");
					checkResult = false;
					return;
				} else {
					$(".isdefault").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (isfree == null || isfree == undefined || isfree == '' || isfree == '请选择') {
					$(".isfree").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择是否包邮!");
					checkResult = false;
					return;
				} else {
					$(".isfree").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (!common.validate.checkEmpty(".moneyType", '请输入计价方式！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".postType", '请输入运送方式！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".sendtime", '请输入发货时间！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".money", '请输入费用！')) {
					checkResult = false;
					return;
				}
				if (isNaN($(".money").val())) {
					$(".money").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请填入数字!");
					checkResult = false;
					return;
				} else {
					$(".money").siblings(".js_errortip").html('');
					checkResult = true;
				}
				var data = {};
				data['templateVo.id'] = id;
				data['templateVo.name'] = name;
				data['templateVo.isdefault'] = isdefault;
				data['templateVo.isfree'] = isfree;
				data['templateVo.moneyType'] = moneyType;
				data['templateVo.postType'] = postType;
				data['templateVo.sendtime'] = sendtime;
				data['templateVo.money'] = money;
				if (checkResult) {
					if (manapeoList.isAjaxing) return false;
					manapeoList.isAjaxing = true;
					$.ajax({
						url: '${base}/postage!updateTemplate.ajax',
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
				data['templateVo.id'] = mainId;
				$.ajax({
					url: '${base}/postage!queryOneTemplate.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					success: function(data) {
						var temp = data.data.projectPostageTemplateVo;
						$(".name").val(temp.name);
						$(".isdefault option[value="+temp.isdefault+"]").attr("selected",true);
						$(".isfree option[value="+temp.isfree+"]").attr("selected",true);
						$(".moneyType").val(temp.moneyType);
						$(".postType").val(temp.postType);
						$(".sendtime").val(temp.sendtime);
						$(".money").val(temp.money);
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
	}
	return {
		init: manapeoListInit
	};
})