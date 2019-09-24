define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var data = {};
	var questionnaire = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		isAjaxing: false,
		type: "question",
		questionnaireList: function() {
			if (questionnaire.isAjaxing) {
				return false;
			} else {
				questionnaire.isAjaxing = true;
			}
			data['pageObject.page'] = questionnaire.pageCur;
			data['pageObject.pagesize'] = questionnaire.pageSize;
			data['questionVo.type'] = questionnaire.type;
			data['questionVo.ItemName'] = $(".search_input").val();
			$.ajax({
				url: '${base}/question!queryListPage.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				beforeSend: function() {
					common.base.loading("fadeIn");
				},

				success: function(resultData) {
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#questionnaire-list").html());
						$("#question_show").html(_templ(resultData.data));

						var _templ1 = Handlebars.compile($("#questionnaire-name-list").html());
						$("#question_name_show").html(_templ1(resultData.data));
						//分页
						questionnaire.pageTotal = resultData.data.pagetotal;
						questionnaire.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: questionnaire.pageCur,
							pageTotal: questionnaire.pageTotal,
							total: questionnaire.total,
							backFn: function(p) {
								questionnaire.pageCur = p;
								questionnaire.questionnaireList();

							}
						});
						//编辑
						questionnaire.editQuestion();
						//删除
						questionnaire.deleterow();
						questionnaire.addQuestion();
						questionnaire.isAjaxing = false;
					}
					common.base.loading("fadeOut");
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
					questionnaire.isAjaxing = false;
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
		queryById: function(id) {
			var returnData;
			$.ajax({
				url: '${base}/question!queryById.ajax',
				data: {
					"questionVo.id": id
				},
				type: 'post',
				dataType: "json",
				async: false,
				//设置同步请求
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					returnData = resultData;
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
					returnData = resultData;
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
			return returnData;
		},
		//搜索
		search: function() {
			$("#search").click(function() {
				data['questionVo.name'] = $("#name").val();
				questionnaire.questionnaireList();
			});

		},

		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('id');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							questionnaire.questionDelete(Id);
						}
					}
				});
			});
		},
		//删除方法
		questionDelete: function(id) {
			var data = {};
			data['questionVo.id'] = id;
			$.ajax({
				url: '${base}/question!delete.ajax',
				type: 'POST',
				dataType: 'JSON',
				data: data,
				success: function(data) {
					if (data.code == "success") {
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '删除成功！'
							//提示语
						});
						questionnaire.questionnaireList();
					} else {
						alert(data.description);
					}
				}
			});
		},

		//添加问卷弹窗
		addQuestion: function() {
			$('.js_add_questionnaire').unbind("click");
			$('.js_add_questionnaire').on('click',
			function() {
				var _templ = Handlebars.compile($("#addQuestion-save").html());
				$("#addquestionnaire-save-content").html(_templ());
				common.base.popUp('.js_questionnaireAdd_popup');
				common.base.DateTimeselect('.js_start_Date', '.js_end_Date');
				questionnaire.questionAdd();

			});
		},

		//确认添加
		questionAdd: function() {
			$('.js_questionnaireAdd_popup .save').unbind("click");
			$('.js_questionnaireAdd_popup').on('click', '.save',
			function() {
				//alert('22')
				var id = $(".id").val();
				var name = $(".name").val();
				var startDate = $(".startDate").val();
				var endDate = $(".endDate").val();
				var description = $(".description").val();
				var pos = $(".pos").val();

				//验证
				var checkResult = true;

				if (!common.validate.checkEmpty(".name", '请填写问卷名称！')) {
					checkResult = false;
					return;
				}
				var data = {};
				data['questionVo.id'] = id;
				data['questionVo.name'] = name;
				data['questionVo.startDate'] = startDate;
				data['questionVo.endDate'] = endDate;
				data['questionVo.description'] = description;
				data['questionVo.pos'] = pos;
				//验证通过之后，可以提交数据
				if (checkResult) {
					questionnaire.isAjaxing = true;
					$.ajax({
						url: '${base}/question!save.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(data) {
							questionnaire.isAjaxing = false;
							if (data.code == "success") {
								//弹框消失，
								$('.js_questionnaireAdd_popup').fadeOut();
								common.base.popUp('', {
									type: 'tip',
									tipTitle: '温馨提示',
									//标题
									tipMesg: '添加成功！'
									//提示语
								});
								questionnaire.questionnaireList();

							} else {
								alert(data.description);
							}
						}
					});
				}
			});
		},
		//编辑问卷弹窗
		editQuestion: function() {
			$(".js_edit_questionnaire").unbind("click");
			$(".js_edit_questionnaire").on('click',
			function() {
				var id = $(this).attr('id');
				var questionnaireData = questionnaire.queryById(id);
				var _templ = Handlebars.compile($("#editQuestion-edit").html());
				$("#editquestionnaire-edit-content").html(_templ(questionnaireData.questionVo));
				common.base.popUp('.js_questionnaireEdit_popup');
				common.base.DateTimeselect('.js_start_Date', '.js_end_Date');
				$('.js_start_Date').val($('#startDate').attr('value'));
				$('.js_end_Date').val($('#endDate').attr('value'));
				questionnaire.questionEdit(id);
			});
		},

		//确认编辑
		questionEdit: function(id) {
			$('.js_questionnaireEdit_popup .save').unbind("click");
			$('.js_questionnaireEdit_popup').on('click', '.save',
			function() {
				var name = $("#name").val();
				var startDate = $("#startDate").val();
				var endDate = $("#endDate").val();
				var description = $("#description").val();
				var pos = $("#pos").val();
				var data = {};
				data['questionVo.id'] = id;
				data['questionVo.name'] = name;
				data['questionVo.startDate'] = startDate;
				data['questionVo.endDate'] = endDate;
				data['questionVo.description'] = description;
				data['questionVo.pos'] = pos;

				//验证
				var checkResult = true;
				if (!common.validate.checkEmpty("#name", '请填写问卷名称！')) {
					checkResult = false;
					return;
				}
				if (checkResult) {
					questionnaire.isAjaxing = true;
					$.ajax({
						url: '${base}/question!edit.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: data,
						success: function(resultData) {
							questionnaire.isAjaxing = false;
							if (resultData.code == "success") {
								$('.js_questionnaireEdit_popup').fadeOut();
								common.base.popUp('', {
									type: 'tip',
									tipTitle: '温馨提示',
									//标题
									tipMesg: '编辑成功！'
									//提示语
								});
								questionnaire.questionnaireList();
							} else {
								alert(data.description);
							}
						}
					});
				}

			});
		},
		inputSerch: function() {
			//搜索
			$('#search').unbind('click');
			$("#search").click(function() {
				questionnaire.pageSize = 10; //每页显示数量
				questionnaire.pageTotal = 1; //总页数
				questionnaire.pageCur = 1; //当前页
				questionnaire.total = 1;
				questionnaire.questionnaireList();
			});

		}

	};
	var questionnaireInit = function() {
		questionnaire.questionnaireList();
		questionnaire.search();
		questionnaire.editQuestion();
		questionnaire.addQuestion();
		questionnaire.inputSerch();
	}
	return {
		init: questionnaireInit
	};

});