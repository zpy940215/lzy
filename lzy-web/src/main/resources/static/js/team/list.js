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
					tipMesg: '删除后不能恢复，请慎重选择？',
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
		//添加团队
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
				var sourcecode = $(".sourcecode").val();
				
				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty(".name", '请输入团队名称！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".sourcecode", '请输入团队编码！')) {
					checkResult = false;
					return;
				}
				
				var data = {};
				data['sourceVo.name'] = name;
				data['sourceVo.description'] = moneyType;
				data['sourceVo.sourceType'] = 'team';
				data['sourceVo.sourceCode'] = sourcecode;
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
		
		postageEdit: function(id) {
			$('.js_popUpeditpeople .save').unbind("click");
			//确认编辑
			$('.js_popUpeditpeople').on('click', '.save',
			function() {
				var name = $(".name").val();
				var isfree = $(".isfree").find("option:selected").attr("value");
				var moneyType = $(".moneyType").val();
				var discount = $(".discount").val();
				var sourcecode = $(".sourcecode").val();
				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty(".name", '请输入团队名称！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".sourcecode", '请输入团队编码！')) {
					checkResult = false;
					return;
				}
				
				var data = {};
				data['sourceVo.id'] = id;
				data['sourceVo.name'] = name;
				data['sourceVo.description'] = moneyType;
				data['sourceVo.status'] = isfree;
				data['sourceVo.discount'] = discount;
				data['sourceVo.sourceCode'] = sourcecode;
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
		//编辑团队
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
						$(".sourcecode").val(temp.sourceCode);
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