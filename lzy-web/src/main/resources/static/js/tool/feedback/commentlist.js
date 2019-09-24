define(['jquery', 'common', 'Handlebars', 'HandlebarExt','jqueryui', 'ztree'],
function($, common, Handlebars, HandlebarExt,jqueryui,ztree) {
	var comment = {
		pageSize: 10,
		//每页显示数量
		pageTotal: 1,
		//总页数
		pageCur: 1,
		//当前页e
		total: 1,
		//总条数
		isAjaxing: false,
		commentList: function() {
			if (comment.isAjaxing) return false;
			comment.isAjaxing = true;
			$.ajax({
				url: '${base}/comment!queryListPage.ajax',
				data: {
					"pageObject.page": comment.pageCur,
					"pageObject.pagesize": comment.pageSize,
					"commentVo.uname": $("#js_name").val()
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						//加载数据的处理
						var _templ = Handlebars.compile($("#comment-list").html());
						$("#comment-list-content").html(_templ(resultData.data));
						//分页
						comment.dataList = resultData.data.dataList;
						comment.pageTotal = resultData.data.pagetotal;
						comment.total = resultData.data.total;
						common.base.createPage('.js_pageDiv', {
							pageCur: comment.pageCur,
							pageTotal: comment.pageTotal,
							total: comment.total,
							backFn: function(p) {
								comment.pageCur = p;
								comment.commentList();
							}
						});
						//comment.commentList();
						comment.commentEdit(); //初始化编辑事件
						comment.commentDelete(); //初始化删除事件
						comment.commentAudit(); //初始化审核事件
						comment.checkbox(); //初始化全选反选
						comment.sortchange();
						comment.sortable();
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
					comment.isAjaxing = false;
					
				},
				error: function(resultData) {
					common.base.loading("fadeOut");
					comment.isAjaxing = false;
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

		words: function() {
			$('.js_comment_edit').unbind("click");
			$('.js_comment_edit').click(function() {
				var _templ = Handlebars.compile($("#comment-save").html());
				$("#comment-save-content").html(_templ());
				common.base.popUp('.js_popUpconsult');
			})
		},
		commentEdit: function() {
			//编辑
			$(".js_comment_edit").unbind("click");
			$(".js_comment_edit").click(function() {
				var commentId = $(this).attr('dataId');
				var commentData = comment.queryBycommentId(commentId);
				if (commentData.code == "success") {
					var _templ = Handlebars.compile($("#comment-save").html());
					commentData['data']['popUp'] = {
						titleName: '栏目更新'
					};
					$("#comment-save-content").html(_templ(commentData.data));
					common.base.popUp('.js_popUpcommentEdit', {
						type: 'form',
						backFn: function(result) {
							if (result) {
								comment.commentDoSave();
							}
						}
					});
				}
			});
		},
		commentDelete: function() {
			//删除
			$(".js_comment_delete").unbind("click");
			$(".js_comment_delete").click(function() {
				var Id = $(this).attr('dataId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							comment.commentDoDelete(Id);
						} else {
							comment.commentEdit(); //初始化编辑事件
							comment.commentDelete(); //初始化删除事件
							comment.commentAudit(); //初始化审核事件
						}
					}
				});
			});
		},
		commentAudit: function() {
			//审核
			$(".js_comment_audit").unbind("click");
			$(".js_comment_audit").click(function() {
				var commentId = $(this).attr('dataId');
				//根据id查询评论内容
				var commentData = comment.queryBycommentId(commentId);
				var status = commentData.data.commentVo.status;
				var _templ = Handlebars.compile($("#examine-list").html());
				comment.notThrough(commentId); //初始化未审核未通过事件
				$("#examinepopup").html(_templ(commentData.data));
				common.base.popUp('.js_examinepopup', {
					backFn: function(result) {
						if (result) {
							comment.commentDoAudit(commentId, "pass");
						}
					}
				});
			});
		},
		notThrough: function(commentId) {
			//审核不通过
			//			$("#not").click(function(){
			$(document).on('click', '#not',
			function() {
				//var commentId = $(this).attr('dataId');
				comment.commentNoAudit(commentId, "nopass");
			});
		},

		queryBycommentId: function(commentId) {
			var returnData;
			$.ajax({
				url: '${base}/comment!queryBycommentId.ajax',
				data: {
					"commentVo.commentId": commentId
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
		commentDoSave: function() {
			if (comment.isAjaxing) return false;
			comment.isAjaxing = true;
			//验证
			var checkResult = true,
			dataPost = {};
			dataPost['commentVo.id'] = common.validate.trim($('#id').val());
			if (!common.validate.checkEmpty('#name', '请输入项目名称！')) {
				checkResult = false;
			}
			if (!common.validate.checkEmpty('#admin', '请输入超级管理员账号！')) {
				checkResult = false;
			}
			if (!common.validate.isEmpty('#passwd')) {
				if (!common.validate.checkPwd('#passwd', '#passwd2', '请输入密码！', '两次输入不一致')) {
					checkResult = false;
				}
			}
			if (!checkResult) {
				comment.isAjaxing = false;
				return false;
			}
			dataPost['commentVo.name'] = common.validate.trim($('#name').val());
			dataPost['commentVo.admin'] = common.validate.trim($('#admin').val());
			dataPost['commentVo.passwd'] = common.validate.trim($('#passwd').val());
			dataPost['commentVo.url'] = common.validate.trim($('#url').val());
			dataPost['commentVo.description'] = common.validate.trim($('#description').val());
			$.ajax({
				url: '${base}/comment!save.ajax',
				data: dataPost,
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					comment.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = '信息提交成功！';
						if (resultData.data.commentVo) tipmesg = '信息提交成功，请牢记密码：' + resultData.data.commentVo.passwd;
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: tipmesg,
							//提示语
							backFn: function(result) {
								//alert(result);
							}
						});
						$('.js_popUpcommentEdit').fadeOut();
						//新增完成刷新列表
						comment.pageCur = 1;
						comment.commentList();
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
					common.base.loading("fadeOut");
					comment.isAjaxing = false;
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
		commentDoDelete: function(Id) {
			if (comment.isAjaxing) return false;
			comment.isAjaxing = true;
			if (!Id) {
				comment.isAjaxing = false;
				return false;
			}
			$.ajax({
				url: '${base}/comment!delete.ajax',
				data: {
					'commentVo.id': Id
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					comment.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '删除成功!',
							//提示语
							backFn: function(result) {
								comment.commentList();
							}
						});
						//删除完成刷新当前列表
						comment.commentList();
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
					common.base.loading("fadeOut");
					comment.isAjaxing = false;
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
		/**
		 * 审核
		 */
		commentDoAudit: function(commentId, status) {
			if (comment.isAjaxing) return false;
			comment.isAjaxing = true;
			if (!commentId) {
				comment.isAjaxing = false;
				return false;
			}
			$.ajax({
				url: '${base}/comment!audit.ajax',
				data: {
					'commentVo.commentId': commentId,
					'commentVo.status': status
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					if (resultData.code == "success") {
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '审核成功!',
							//提示语
							backFn: function(result) {}
						});
						$('.js_examinepopup').fadeOut();
						//审核完成刷新当前列表
						comment.commentList();
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
					comment.isAjaxing = false;
				},
				error: function(resultData) {
					common.base.loading("fadeIn");
					comment.isAjaxing = false;
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

		/**
		 * 审核未通过
		 */
		commentNoAudit: function(commentId, notTh) {
			$.ajax({
				url: '${base}/comment!audit.ajax',
				data: {
					'commentVo.commentId': commentId,
					'commentVo.status': notTh
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultData) {
					common.base.loading("fadeOut");
					comment.isAjaxing = false;
					if (resultData.code == "success") {
						var tipmesg = '';
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '审核成功!',
							//提示语
							backFn: function(result) {}
						});
						$('.js_examinepopup').fadeOut();
						//审核完成刷新当前列表
						comment.commentList();
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
					common.base.loading("fadeOut");
					comment.isAjaxing = false;
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

		//批量选择删除
		batchdelete: function() {
			$('.js_banch_delete').unbind("click");
			$(document).on('click', '.js_banch_delete',
			function() {
				var rowchecked = $(".js_check_row:checked");
				if (rowchecked.length == '0') {
					common.base.popUp('', {
						type: 'tip',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '请选择要删除的行'
						//提示语
					});
				} else {
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						//标题
						tipMesg: '是否删除选定记录？',
						//提示语
						backFn: function(result) {
							if (result) {
								var idArray = new Array();
								for (var i = 0; i < rowchecked.length; i++) {
									var rowcheckedTemp = rowchecked[i];
									var idTemp = rowcheckedTemp.getAttribute("dataId");
									idArray.push(idTemp);
								}
								var Id = idArray.join("|");
								comment.commentDoDelete(Id);
							}
						}
					});
				}
			})

			comment.commentEdit(); //初始化编辑事件
			comment.commentDelete(); //初始化删除事件
			comment.commentAudit(); //初始化审核事件
		},
		//列表全选反选
		checkbox: function() {
			$('.js_check_all').unbind("click");
			/*列表全选反选*/
			$(".js_check_all").click(function() {

				if ($(this).attr("checked")) {
					$(".js_check_row").prop("checked", false);
					$(this).attr("checked", false);
				} else {
					$(".js_check_row").prop("checked", true);
					$(this).attr("checked", true);
				}
			})
		},
		
		sortable: function() {
			var fixHelper = function(e, ui) {
				ui.children().each(function() {
					$(this).width($(this).width()); //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了
				});
				return ui;
			};
			$(function() {
				$("#sortable ").sortable({ //这里是talbe tbody，绑定 了sortable
					helper: fixHelper,
					//调用fixHelper
					axis: "y",
					stop: function(event, ui) {

						var startItem = ui.item;
						var offsetIndex = Math.round(( - ui.originalPosition.top + ui.position.top) / (startItem.height() / 10));
						var startIndex = startItem.attr('dIndex');
						var endIndex = parseInt(startIndex) + parseInt(offsetIndex);

						var dataList = comment.dataList;

						if (endIndex < 0) {
							endIndex = 0;
						}
						if (endIndex > dataList.length - 1) {
							endIndex = dataList.length - 1;
						}
						// alert("st="+startIndex+",end="+endIndex);
						var commentVo = dataList[startIndex];
						var changeVo = dataList[endIndex];
						if (changeVo.pos == null || isNaN(changeVo.pos)) {
							changeVo.pos = '0';
						}
						if (parseInt(offsetIndex) < 0) {
							commentVo['pos'] = parseInt(changeVo.pos) + 1;
						} else {
							commentVo['pos'] = parseInt(changeVo.pos) - 1;
						}
						var data = {};
						data['commentVo.id'] = commentVo.id;
						data['commentVo.pos'] = commentVo.pos;
						data['commentVo.commentId'] = commentVo.commentId;
						$.ajax({
							async: false,
							cache: false,
							type: 'POST',
							dataType: "json",
							url: '${base}/comment!editPos.ajax',
							data: data,
							success: function(result) {
//								 alert(JSON.stringify(result));
								if ('success' == result.code && result.data.success == true) { //成功
									comment.commentList();
								} else {
									alert("排序失败，请稍后再试...");
								}
							}
						});
					}
				}).disableSelection();

			})
		},
		
		sortchange: function() {
			$('.jspos').blur(function() {
//				 alert("hello");
//				 alert("hello"+$(this).attr('comId'));
				var commentId = $(this).attr('commentId');
				var pos = $(this).attr('pos');
				var value = $(this).val();
				var comId = $(this).attr('comId');
				var data = {};
				if (pos != value) {
					data['commentVo.commentId'] = commentId;
					data['commentVo.pos'] = value;
					data['commentVo.id'] = comId;
					$.ajax({
						async: false,
						cache: false,
						type: 'POST',
						dataType: "json",
						url: '${base}/comment!editPos.ajax',
						data: data,
						success: function(result) {
//							 alert(JSON.stringify(result));
							if ('success' == result.code && result.data.success == true) { //成功
								comment.commentList();
							} else {
								alert("排序失败，请稍后再试...");
							}
						}
					});
				}
			});
		},
	}
	var indexInit = function() {
		comment.commentList();
		comment.batchdelete();
		//搜索
		$('#js_doSearch').click(function() {
			comment.pageCur = 1;
			comment.commentList();
		});
		//新增
		$('.js_comment_add').click(function() {
			var _templ = Handlebars.compile($("#comment-save").html());
			var data = {
				popUp: {
					titleName: '栏目新增'
				}
			};
			$("#comment-save-content").html(_templ(data));
			//编辑
			common.base.popUp('.js_popUpcommentEdit', {
				type: 'form',
				backFn: function(result) {
					if (result) {
						comment.commentDoSave();
					}
				}
			});
		});
	};
	return {
		init: indexInit
	};

});