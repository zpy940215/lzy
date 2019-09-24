define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var data = {};
	var notice = {
		pageSize: 10,//每页显示数量
		pageTotal: 1,//总页数
		pageCur: 1,//当前页
		total: 1,
		isAjaxing: false,
		list: function() {
			data['objectPage.page'] = notice.pageCur;
			data['objectPage.pagesize'] = notice.pageSize;
			data['projectConfigVo.type'] = "hotelUser";
			var keywords = $("#searchProdId").find("option:selected").val();
			if(keywords != null || keywords != ""){
				data['projectConfigVo.name'] = keywords;
			}
			$.ajax({
				url: '${base}/smsNotice!queryListPage.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(data) {
					if(data.code == "success") {
						var _templ = Handlebars.compile($("#notice_list").html());
						$("#notice_show").html(_templ(data.data));
						//分页
						notice.pageTotal = data.data.pagetotal;
						notice.total = data.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: notice.pageCur,
							pageTotal: notice.pageTotal,
							total: notice.total,
							backFn: function(p) {
								notice.pageCur = p;
								notice.list();
							}
						});
					}
					//编辑
					notice.editnotice();
					//删除
					notice.deleterow();
					common.base.loading("fadeOut");
				}
			});
		},
		search: function() {
			$("#search").click(function() {
				notice.list();
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
							notice.noticeDelete(Id);
						}
					}
				});
			});
		},
		noticeDelete: function(id) {
			var data = {};
			data['projectConfigVo.id'] = id;
			data['projectConfigVo.status'] = "close";
			$.ajax({
				url: '${base}/smsNotice!deleteSmsNotice.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					if (data.code == "success") {
						notice.list();
						return;
					} else {
						alert(data.description);
					}
				}
			});
		},
		//产品列表
		prodlist: function() {
			var data = {};
			data['prodVo.prodTypeId'] = "01";
			$.ajax({
				url: '${base}/prod!queryListAll.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				async:false,
				success: function(result) {
					console.log(result);
					if(result.code == "success") {
						var _templ = Handlebars.compile($("#notice-save").html());
						$("#notice-save-content").html(_templ(result.data));
					}
				}
			});
		},
		//搜索列表
		searchlist: function() {
			var data = {};
			data['prodVo.prodTypeId'] = "01";
			$.ajax({
				url: '${base}/prod!queryListAll.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				async:false,
				success: function(result) {
					console.log(result);
					if(result.code == "success") {
						var datalist = result.data.prodVoList;
						$("#searchProdId").html("");
						var optionstr = "<option value=''>请选择</option>";
						for(var j in datalist) {
							optionstr += "<option value="+datalist[j].id+">"+datalist[j].name+"</option>";
						}
						$("#searchProdId").html(optionstr);
					}
				}
			});
		},
		//添加
		addnotice: function() {
			$('.js_add_notice').unbind("click");
			$('.js_add_notice').on('click',
			function() {
				notice.prodlist();
				common.base.popUp('.js_popUpSaveNotice');
				notice.noticeAdd("");
			});
		},
		//确认添加
		noticeAdd: function(id) {
			$('.js_popUpSaveNotice .save').unbind("click");
			$('.js_popUpSaveNotice').on('click', '.save',
			function() {
				var prodId = $(".prod_select").find("option:selected").attr("value");
				var name = $(".notice_name").val();
				var mobile = $(".notice_mobile").val();
				//验证
				var checkResult = true;
				if (prodId == null || prodId == undefined || prodId == '' || prodId == '请选择') {
					$(".prod_select").siblings(".js_errortip").html('<i class="icon tipicon"></i>' + "    请选择关联酒店!");
					checkResult = false;
					return;
				} else {
					$(".prod_select").siblings(".js_errortip").html('');
					checkResult = true;
				}
				if (!common.validate.checkEmpty(".notice_name", '请输入通知人姓名！')) {
					checkResult = false;
					return;
				}
				if (!common.validate.checkEmpty(".notice_mobile", '请输入通知人电话！')) {
					checkResult = false;
					return;
				}
				var data = {};
				if(id != "") {
					data['projectConfigVo.id'] = id;
				}
				data['projectConfigVo.status'] = "open";
				data['projectConfigVo.name'] = prodId;
				data['projectConfigVo.type'] = "hotelUser";
				data['noticeVo.bizId'] = prodId;
				data['noticeVo.name'] = name;
				data['noticeVo.mobile'] = mobile;
				data['projectConfigVo.description'] = $(".notice_description").val();
				//验证通过
				if (checkResult) {
					if (notice.isAjaxing) return false;
					notice.isAjaxing = true;
					$.ajax({
						url: '${base}/smsNotice!addSmsNotice.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(data) {
							notice.isAjaxing = false;
							if (data.code == "success") {
								//弹框消失，
								$('.js_popUpSaveNotice').fadeOut();
								notice.list();
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
		editnotice: function() {
			$('.js_edit_notice').unbind("click");
			$(".js_edit_notice").on('click',function() {
				var noticeId = $(this).attr("id");
				notice.prodlist();
				notice.queryNotice(noticeId);
				common.base.popUp('.js_popUpSaveNotice');
				notice.noticeAdd(noticeId);
			})
		},
		queryNotice:function(id) {
			$.ajax({
				url:"smsNotice!queryById.ajax",
				type:"post",
				dataType:"json",
				data:{
					"projectConfigVo.id":id,
				},
				async:false,
				success:function(result) {
					if(result.code == "success"){
						var configVo = result.data.projectConfigVo;
						var smsNoticeVo = configVo.smsNoticeVo;
						$(".prod_select").find("option[value="+configVo.name+"]").attr("selected",true);
						$(".notice_name").val(smsNoticeVo.name);
						$(".notice_mobile").val(smsNoticeVo.mobile);
						$(".notice_description").val(configVo.description);
					}
				}
			})
		}
	}
	var noticeInit = function() {
		notice.list();
		notice.search();
		notice.addnotice();
		notice.searchlist();
	}
	return {
		init: noticeInit
	};
})