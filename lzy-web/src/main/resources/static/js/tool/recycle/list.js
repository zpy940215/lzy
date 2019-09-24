define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var recycleList = {
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
							//project.projectDoDelete(Id);
						}
					}
				});
			});
		},
		//批量选择删除
		batchrowdelete: function() {
			$('.js_banch_delete').unbind("click");
			$('.js_banch_delete').click(function() {
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
						tipMesg: '是否删除选定会员？',
						//提示语
						backFn: function(result) {
							if (result) {
								rowchecked.parents('tr').remove();
							}
						}
					});
				}
			})
		},
		//列表全选反选
		checkbox: function() {
			$('.js_check_all').unbind("click");
			$(".js_check_all").click(function() {
				if ($(this).attr("checked")) {
					$(".js_check_row").prop("checked", false);
					$(this).attr("checked", false);
				} else {
					$(".js_check_row").prop("checked", true);
					$(this).attr("checked", true);
				}
			})
		}
	}
	var recycleListInit = function() {

		recycleList.deleterow();
		recycleList.batchrowdelete();
		recycleList.checkbox();
	}
	return {
		init: recycleListInit
	};
});