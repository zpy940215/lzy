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
			data['postagePage.page'] = manapeoList.pageCur;
			data['postagePage.pagesize'] = manapeoList.pageSize;
			if($("#search_Area").val() != null && $("#search_Area").val() != ""){
				data['postageVo.provinceId'] = $("#search_Area").find("option:selected").val();
			}
			$.ajax({
				url: '${base}/postage!queryPostagePage.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				beforeSend: function() {
					common.base.loading("fadeIn");
				},

				success: function(data) {
					if(data.code == "success") {
						var _templ = Handlebars.compile($("#user_list").html());
						$("#user_show").html(_templ(data.data));
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
					}
					
					//编辑
					manapeoList.editpeople();
					//删除
					manapeoList.deleterow();
					manapeoList.searchList();
					common.base.loading("fadeOut");
				}
			});
		},
		searchList:function() {
			$.ajax({
				url: '${base}/area!queryListbyParentCode.ajax?parentCode=0',
				type: 'POST',
				dataType: 'JSON',
				data: {},
				success: function(data) {
					var optionstring = "";
					for (var j in data.data.areaVoList) {
						optionstring += "<option value=\"" + data.data.areaVoList[j].code + "\" >" + data.data.areaVoList[j].name + "</option>";
					}
					$("#search_Area").html("<option value=''>请选择</option> " + optionstring);
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
			data['postageVo.id'] = id;
			$.ajax({
				url: '${base}/postage!deletePostage.ajax',
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
		//添加邮费
		addpeople: function() {
			$('.js_add_people').unbind("click");
			$('.js_add_people').on('click',
			function() {
				// $('.js_add_people').click(function(){
				//查询模板列表
				var _templ = Handlebars.compile($("#addpeople-save").html());
				$("#addpeople-save-content").html(_templ());
				common.base.popUp('.js_popUpaddpeople');
				manapeoList.templateList();
				manapeoList.provinceList();
				manapeoList.cityList();
				manapeoList.countryList();
				manapeoList.peopleAdd()
			});
		},
		// 选择邮费模板
		templateList:function(){
			var data = {};
			$.ajax({
				url: '${base}/postage!queryTemplateList.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					var optionstring = "";
					for (var j in data.data.templateList) {
						optionstring += "<option value=\"" + data.data.templateList[j].templateId + "\" >" + data.data.templateList[j].name + "</option>";
					}
					$(".templateSelect").html("<option value=''>请选择</option> " + optionstring);
				}
			});
		},
		//选择省份
		provinceList:function(){
			$.ajax({
				url: '${base}/area!queryListbyParentCode.ajax?parentCode=0',
				type: 'POST',
				dataType: 'JSON',
				data: {},
				success: function(data) {
					var optionstring = "";
					for (var j in data.data.areaVoList) {
						optionstring += "<option value=\"" + data.data.areaVoList[j].code + "\" >" + data.data.areaVoList[j].name + "</option>";
					}
					$(".provinceSelect").html("<option value=''>请选择</option> " + optionstring);
				}
			});
		},
		//选择城市
		cityList:function(){
			$('.provinceSelect').unbind("change");
			$('.provinceSelect').on('change',
			function(){
				var code = $(".provinceSelect").find("option:selected").val();
					$.ajax({
						url: '${base}/area!queryListbyParentCode.ajax?parentCode='+code,
						type: 'POST',
						dataType: 'JSON',
						data: {},
						success: function(data) {
							var optionstring = "";
							for (var j in data.data.areaVoList) {
								optionstring += "<option value=\"" + data.data.areaVoList[j].code + "\" >" + data.data.areaVoList[j].name + "</option>";
							}
							$(".citySelect").html("<option value=''>请选择</option> " + optionstring);

							$(".countrySelect").html("<option value=''>请选择</option>");
						}
					});
			});
		},
		//选择地区
		countryList:function(){
			$('.citySelect').unbind("change");
			$('.citySelect').on('change',
			function(){
				var code = $(".citySelect").find("option:selected").val();
					$.ajax({
						url: '${base}/area!queryListbyParentCode.ajax?parentCode='+code,
						type: 'POST',
						dataType: 'JSON',
						data: {},
						success: function(data) {
							var optionstring = "";
							for (var j in data.data.areaVoList) {
								optionstring += "<option value=\"" + data.data.areaVoList[j].code + "\" >" + data.data.areaVoList[j].name + "</option>";
							}
							$(".countrySelect").html("<option value=''>请选择</option> " + optionstring);
						}
					});
			});
		},
		templateStatus:function(post){
			$.ajax({
				url: '${base}/postage!queryTemplateList.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					var optionstring = "";
					for (var j in data.data.templateList) {
						optionstring += "<option value=\"" + data.data.templateList[j].templateId + "\" >" + data.data.templateList[j].name + "</option>";
					}
					$(".templateSelect").html("<option value=''>请选择</option> " + optionstring);
					$(".templateSelect option[value="+post.templateId+"]").attr("selected",true);
					manapeoList.provinceStatus(post);
				}
			});
		},
		provinceStatus:function(post){
			$.ajax({
				url: '${base}/area!queryListbyParentCode.ajax?parentCode=0',
				type: 'POST',
				dataType: 'JSON',
				data: {},
				success: function(data) {
					var optionstring = "";
					for (var j in data.data.areaVoList) {
						optionstring += "<option value=\"" + data.data.areaVoList[j].code + "\" >" + data.data.areaVoList[j].name + "</option>";
					}
					$(".provinceSelect").html("<option value=''>请选择</option> " + optionstring);
					$(".provinceSelect option[value="+post.provinceId+"]").attr("selected",true);
					manapeoList.cityStatus(post);
				}
			});
		},
		cityStatus:function(post){
			$.ajax({
				url: '${base}/area!queryListbyParentCode.ajax?parentCode='+post.provinceId,
				type: 'POST',
				dataType: 'JSON',
				data: {},
				success: function(data) {
					var optionstring = "";
					for (var j in data.data.areaVoList) {
						optionstring += "<option value=\"" + data.data.areaVoList[j].code + "\" >" + data.data.areaVoList[j].name + "</option>";
					}
					$(".citySelect").html("<option value=''>请选择</option> " + optionstring);
					$(".countrySelect").html("<option value=''>请选择</option>");
					$(".citySelect option[value="+post.cityId+"]").attr("selected",true);
					manapeoList.countryStatus(post);
				}
			});
		},
		countryStatus:function(post){
			$.ajax({
				url: '${base}/area!queryListbyParentCode.ajax?parentCode='+post.cityId,
				type: 'POST',
				dataType: 'JSON',
				async:false,
				data: {},
				success: function(data) {
					var optionstring = "";
					for (var j in data.data.areaVoList) {
						optionstring += "<option value=\"" + data.data.areaVoList[j].code + "\" >" + data.data.areaVoList[j].name + "</option>";
					}
					$(".countrySelect").html("<option value=''>请选择</option> " + optionstring);
					$(".countrySelect option[value="+post.countryId+"]").attr("selected",true);
				}
			});
		},
		//确认添加
		peopleAdd: function() {
			$('.js_popUpaddpeople .save').unbind("click");
			$('.js_popUpaddpeople').on('click', '.save',
			function() {
				var templateId = $(".templateSelect").find("option:selected").attr("value");
				var provinceCode = $(".provinceSelect").find("option:selected").attr("value");
				var cityCode = $(".citySelect").find("option:selected").attr("value");
				var countryCode = $(".countrySelect").find("option:selected").attr("value");
				var money = $(".money").val();
				//验证
				var checkResult = true;
				if (templateId == null || templateId == undefined || templateId == '' || templateId == '请选择') {
					$(".templateSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择邮费模板!");
					checkResult = false;
					return;
				} else {
					$(".templateSelect").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (provinceCode == null || provinceCode == undefined || provinceCode == '' || provinceCode == '请选择') {
					$(".provinceSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择省份!");
					checkResult = false;
					return;
				} else {
					$(".provinceSelect").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (cityCode == null || cityCode == undefined) {
					$(".citySelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择城市!");
					checkResult = false;
					return;
				} else {
					$(".citySelect").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (countryCode == null || countryCode == undefined) {
					$(".countrySelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择地区!");
					checkResult = false;
					return;
				} else {
					$(".countrySelect").siblings(".js_errortip").html('');
					checkResult = true;
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
				data['postageVo.templateId'] = templateId;
				data['postageVo.provinceId'] = provinceCode;
				data['postageVo.cityId'] = cityCode;
				data['postageVo.countryId'] = countryCode;
				data['postageVo.money'] = money;
				//验证通过
				if (checkResult) {
					if (manapeoList.isAjaxing) return false;
					manapeoList.isAjaxing = true;
					$.ajax({
						url: '${base}/postage!savePostage.ajax',
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
				var templateId = $(".templateSelect").find("option:selected").attr("value");
				var provinceId = $(".provinceSelect").find("option:selected").attr("value");
				var cityId = $(".citySelect").find("option:selected").attr("value");
				var countryId = $(".countrySelect").find("option:selected").attr("value");
				var money = $(".money").val();
				//验证
				var checkResult = true;
				if (templateId == null || templateId == undefined || templateId == '' || templateId == '请选择') {
					$(".templateSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择模板");
					checkResult = false;
					return;
				} else {
					$(".sexSelect").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (provinceId == null || provinceId == undefined || provinceId == '' || provinceId == '请选择') {
					$(".provinceSelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择省份");
					checkResult = false;
					return;
				} else {
					$(".provinceSelect").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (cityId == null || cityId == undefined) {
					$(".citySelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择城市");
					checkResult = false;
					return;
				} else {
					$(".citySelect").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (countryId == null || countryId == undefined) {
					$(".countrySelect").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择地区");
					checkResult = false;
					return;
				} else {
					$(".countrySelect").siblings(".js_errortip").html('');
					checkResult = true;
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
				data['postageVo.id'] = id;
				data['postageVo.templateId'] = templateId;
				data['postageVo.provinceId'] = provinceId;
				data['postageVo.cityId'] = cityId;
				data['postageVo.countryId'] = countryId;
				data['postageVo.money'] = money;
				if (checkResult) {
					if (manapeoList.isAjaxing) return false;
					manapeoList.isAjaxing = true;
					$.ajax({
						url: '${base}/postage!updatePostage.ajax',
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
				manapeoList.templateList();
				manapeoList.provinceList();
				manapeoList.cityList();
				manapeoList.countryList();
				//查询邮费信息
				var mainId = $(this).attr('id');
				var data = {};
				data['postageVo.id'] = mainId;
				$.ajax({
					url: '${base}/postage!queryOnePostage.ajax',
					type: 'POST',
					dataType: 'JSON',
					data: data,
					success: function(data) {
						var post = data.data.projectPostageVo;
						manapeoList.templateStatus(post);
						$(".money").val(post.money);
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
		manapeoList.searchList();
	}
	return {
		init: manapeoListInit
	};
})