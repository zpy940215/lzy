define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt'],
function($, common, jqueryui, Handlebars, HandlebarExt) {
	var data = {};
	var question = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页
		total: 1,
		isAjaxing: false,
		orderby: "pos",
		type: "questionItem",
		questionList: function() {
			location.reload(bForceGet = true);
			//编辑
			question.questionEdit();
			//添加
			question.questionAdd();
			//删除
			question.questionDelete();

		},
		questionnaireList: function() {
			//查询左侧列表
			$.ajax({
				url: '${base}/question!queryListPage.ajax',
				type: 'POST',
				dataType: 'JSON',

				success: function(resultData) {
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#questionnaire-name-list").html());
						$("#question_name_show").html(_templ(resultData.data));
					}
				}

			});
		},
		questionEdit: function() {

			//编辑问题
			$(".js_edit_question").unbind("click");
			$(".js_edit_question").on('click',
			function() {
				var itemId = $(this).attr('itemId');
				var questionItemData = question.queryQuestionItemByItemId(itemId);
				var _templ = Handlebars.compile($("#addquestion-save").html());
				$("#addquestion").html(_templ(questionItemData.questionItemVo));
				$(".questionbox .popup_bt span").html('编辑问题');
				common.base.popUp('.js_question_popup');
				$("#optionName").empty();
				var type = questionItemData.questionItemVo.questionType;
				if(type == 'content'){
					$("#optionName").hide();
					$("#description").hide();
				}
				var obj = questionItemData.questionItemVo.questionOptionVoList;
				if (obj != null && obj != "" && obj != undefined) {
					$.each(obj,
					function(index, value) {
						if (index == 0) {
							$("#optionName").append('<label>问题选项：</label><input name="questionOptionVo.name" id="' + value.id + '" value="' + value.name + '"  type="text" class="commtext" placeholder="请输入选项"/><a class="style2 js_add_questype" href="javascript:;" >添加</a><br/>');
						} else {
							$("#optionName").append('<span><label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><input name="questionOptionVo.name" id="' + value.id + '" value="' + value.name + '" type="text" class="commtext" placeholder="请输入选项"/><a class="style2 js_remove_questype" href="javascript:;" id="' + value.id + '" >移除</a></br></span>');
						}
					});
				} else {
					$("#optionName").append('<label>问题选项：</label><input name="questionOptionVo.name"  type="text" class="commtext" placeholder="请输入选项"/><a class="style2 js_add_questype" href="javascript:;" >添加</a><br/>');
				}
				$('.js_add_questype').on('click',
				function() {
					var questionOptionName = '<span><label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><input name="questionOptionVo.name"  type="text" class="commtext" placeholder="请输入选项"/><a class="style2 js_remove_questype" href="javascript:;" >移除</a></br></span>';
					$("#optionName").append(questionOptionName);
					$(".js_remove_questype").click(function() {
						$(this).parent().remove();
					});
				});
				$(".js_remove_questype").click(function() {
					var id = $(this).attr("id");
					$.ajax({
						url: '${base}/questionOption!edit.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: {
							"questionOptionVo.id": id
						},
						success: function(resultData) {

}
					});
					$(this).parent().remove();
				});
				question.checkType();
				question.questionSave(questionId);
			});
		},
		questionAdd: function() {
			//添加问题弹窗
			var questionId = $("#questionId").val();
			$('.js_add_question').unbind("click");
			$('.js_add_question').on('click',
			function() {
				var _templ = Handlebars.compile($("#addquestion-save").html());
				$("#addquestion").html(_templ(questionId));
				common.base.popUp('.js_question_popup');
				$('.js_add_questype').on('click',
				function() {
					var questionOptionName = '<span><label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><input name="questionOptionVo.name"  type="text" class="commtext" placeholder="请输入选项"/><a class="style2 js_remove_questype" href="javascript:;" >移除</a></br></span>';
					$("#optionName").append(questionOptionName);
					$(".js_remove_questype").click(function() {
						$(this).parent().remove();
					});
				});
				question.checkType();
				question.questionSave(questionId);
			});
		},
		//确认保存问题
		questionSave: function(questionId) {
			$("#editRloe").unbind("click");
			$("#editRloe").on('click',
			function() {
				var dataget = new Object();
				dataget["questionItemVo.description"] = $("#description").val();
				dataget["questionItemVo.id"] = $("#id").val();
				dataget["questionItemVo.itemId"] = $("#itemId").val();
				dataget["questionItemVo.questionId"] = $("#questionId").val();
				dataget["questionItemVo.name"] = $('input[name="questionItemVo.name"]').val();
				dataget["questionItemVo.questionType"] = $('input[name="questionItemVo.questionType"]:checked').val();
				var optionVos = new Array();
				var $this = $("input[name='questionOptionVo.name']")
				for(var i=0;i<$this.length;i++) {
					dataget["optionVos["+i+"].name"]=$this.eq(i).val();
					dataget["optionVos["+i+"].id"]=$this.eq(i).attr("id");
				};
				var checkResult = true;
				//验证
				if (!common.validate.checkEmpty(".name", '请填写问题名称！')) {
					checkResult = false;
					return;
				}
				if (checkResult) {
					if (question.isAjaxing) question.isAjaxing = false;
					question.isAjaxing = true;
					$.ajax({
						url: '${base}/questionItem!save.ajax',
						type: 'POST',
						dataType: 'JSON',
						data: dataget,
						success: function(resultData) {
							if (resultData.code == "success") {
								common.base.popUp('', {
									type: 'tip',
									tipTitle: '温馨提示',
									//标题
									tipMesg: "保存成功",
									//提示语
									backFn: function(result) {
										question.questionList();
									}
								});
							} else {
								if (resultData && resultData.description) {
									common.base.popUp('', {
										type: 'tip',
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
						},
						error: function(resultData) {
							common.base.popUp('', {
								type: 'choice',
								tipTitle: '温馨提示',
								tipMesg: '操作异常',
								backFn: function(result) {}
							});
						}
					});
				}
			});

		},
		checkType: function(){
			$("input:radio[name='questionItemVo.questionType']").unbind("click");
			$("input:radio[name='questionItemVo.questionType']").on('click',
			function(){
				var val = $(this).val();
				if(val == 'content'){
					$("#optionName").hide();
					$("#description").hide();
				}else{
					$("#optionName").show();
					$("#description").show();
				}
			});
		},
		questionDelete: function() {
			//删除问题
			$(".js_delete_row").unbind("click");
			$(".js_delete_row").on('click',
			function() {
				var id = $(this).attr('id');
				var itemId = $(this).attr('itemId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/questionItem!delete.ajax',
								type: 'POST',
								cache: false,
								dataType: "JSON",
								data: {
									"questionItemVo.id": id,
									"questionItemVo.itemId": itemId,
								},
								success: function(data) {
									if (data.code == "success") {
										common.base.popUp('', {
											type: 'tip',
											tipTitle: '温馨提示',
											//标题
											tipMesg: "删除成功",
											//提示语
											backFn: function(result) {
												question.questionList();
											}
										});

									} else {
										alert(data.description);
									}
								}
							});
						}

					}
				});
			});
		},

		queryQuestionItemByItemId: function(itemId) {
			//查询问题信息
			var returnData;
			$.ajax({
				url: '${base}/questionItem!queryQuestionItemByItemId.ajax',
				data: {
					"questionItemVo.itemId": itemId
				},
				type: 'post',
				dataType: "json",
				async: false,
				//设置同步请求
				success: function(resultData) {
					if (resultData.code == "success") {
						returnData = resultData;
					}
				},
				error: function(resultData) {
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

		questionDoEdit: function(id, pos, statuval) {
			if (!id) {
				question.isAjaxing = false;
				return false;
			}
			$.ajax({
				type: "post",
				url: "${base}/questionItem!edit.ajax",
				data: {
					'questionItemVo.id': id,
					'questionItemVo.pos': pos,
					'questionItemVo.type': "questionItem",
					'questionItemVo.orderby': question.orderby
				},
				datatype: "json",
				success: function(resultData) {
					question.isAjaxing = false;
					if (resultData.code == "success") {
						if (statuval == 1) {
							var tipmesg = '';

							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: "保存排序成功",
								//提示语
								backFn: function(result) {
									question.questionList();
								}
							});
						}

					} else {
						if (resultData && resultData.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
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
				},
				error: function(resultData) {
					question.isAjaxing = false;
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

		//确认导入问题/上传文件
		questionUpFile: function(questionId) {
			$("#importRloe").unbind("click");
			$("#importRloe").on('click',
			function() {
				var fileDir = $("#upfile").val();
				var suffix = fileDir.substr(fileDir.lastIndexOf("."));
				if ("" == fileDir) {
					alert("选择需要导入的Excel文件！");
					return false;
				}
				if (".xls" != suffix && ".xlsx" != suffix) {
					alert("选择Excel格式的文件导入！");
					return false;
				}
				var files = $("#upfile").prop('files');
				var data = new FormData();
				data.append('file', files[0]);
				$.ajax({
					url: '${base}/questionItem!uploadXls.action',
					type: 'POST',
					data: data,
					cache: false,
					processData: false,
					contentType: false,
					success: function(resultData) {
						question.saveXls(questionId, resultData.xlsUrl);
					}
				});
			});
		},

		//导入问题
		saveXls: function(questionId, xlsUrl) {
			$.ajax({
				url: '${base}/questionItem!importFile.ajax',
				type: 'POST',
				data: {
					'questionItemVo.questionId': questionId,
					'xlsUrl': xlsUrl
				},
				datatype: "json",
				success: function(resultData) {
					question.isAjaxing = false;
					if (resultData.code == "success") {
						$('.js_question_import').fadeOut();
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: "导入问题成功",
							//提示语
							backFn: function(result) {
								question.questionList();
							}
						});

					} else {
						if (resultData && resultData.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
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
				},
				error: function(resultData) {
					question.isAjaxing = false;
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
		questionQueryLogs: function() {
			//查询问题反馈
			$(".js_query_logs").unbind("click");
			$(".js_query_logs").on('click',
			function() {
				var itemId = $(this).attr("itemId");
			$.ajax({
				url: '${base}/questionItem!queryQuestionLogsByItemId.ajax',
				data: {
					"questionItemVo.itemId": itemId
				},
				type: 'post',
				dataType: "json",
				async: false,
				//设置同步请求
				success: function(resultData) {
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#question-log").html());
						$("#querylogs").html(_templ(resultData.questionItemVo));
						common.base.popUp('.js_question_logs');
					}
				},
				error: function(resultData) {
					
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
			});
		},
	};
	var questionInit = function() {
		question.questionnaireList(); //左侧列表信息展示
		question.questionEdit(); //编辑问题
		question.questionAdd(); //添加问题
		question.questionDelete(); //删除问题
		question.questionQueryLogs(); //查看反馈
		// 列表自定义排序
		$(document).on('click', '.savesort',
		function(e) {
			var rowchecked = $(".checkbox:checked");
			var len = rowchecked.length;
			if (len == '0') {
				common.base.popUp('', {
					type: 'tip',
					tipTitle: '温馨提示',
					//标题
					tipMesg: "请选定要排序的问题！",
					//提示语
					backFn: function(result) {
						//
					}
				});
			} else {
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '确定保存排序？',
					//提示语
					backFn: function(result) {
						if (result) {
							statuval = 0;
							question.orderby = "pos";
							rowchecked.each(function(i) {
								var thisid = $(this).attr('id');
								var sortNum = $(this).parents("tr").find("#sortnum").val();
								if (i == len - 1) {
									statuval = 1;
								}
								question.questionDoEdit(thisid, sortNum, statuval);
							})
						}
					}
				});
			}
		});
		//导出问题
		$(document).on('click', '#export',
		function(e) {
			var questionId = $("#questionId").val();
			common.base.popUp('', {
				type: 'choice',
				tipTitle: '温馨提示',
				//标题
				tipMesg: '确定导出列表吗？',
				//提示语
				backFn: function(result) {
					if (result) {
						$.ajax({
							type: "post",
							url: "${base}/questionItem!export.ajax",
							data: {
								'questionItemVo.questionId': questionId
							},
							datatype: "json",
							success: function(resultData) {
								question.isAjaxing = false;
								if (resultData.code == "success") {
									var tipmesg = '';

									common.base.popUp('', {
										type: 'tip',
										tipTitle: '温馨提示',
										//标题
										tipMesg: "导出列表成功",
										//提示语
										backFn: function(result) {
											//													question.questionList();
										}
									});

								} else {
									if (resultData && resultData.description) {
										//alert(resultData.description);
										common.base.popUp('', {
											type: 'tip',
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
							},
							error: function(resultData) {
								question.isAjaxing = false;
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
					}

				}
			});
		});
		//导入问题
		$(document).on('click', '#import',
		function(e) {
			var questionId = $("#questionId").val();
			var _templ = Handlebars.compile($("#addquestion-import").html());
			$("#importQuestion").html(_templ(questionId));
			common.base.popUp('.js_question_import');
			question.questionUpFile(questionId);
		});
	}
	return {
		init: questionInit
	};

});