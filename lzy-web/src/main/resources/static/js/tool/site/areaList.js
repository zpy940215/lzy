define(['jquery', 'common', 'Handlebars', 'HandlebarExt'],
function($, common, Handlebars, HandlebarExt) {
	var areaList = {
		//树形菜单
		getProviceList: function() {
			$('.loading').remove();
			$(document).on('click', 'a.djk-folder',
			function() {
				var p = $(this).parent().parent();
				var parentCode = $(this).attr('data-key-id');
				var sp = $(this).find('span');
				if (sp.hasClass('glyphicon-folder-close')) {
					$(this).parent().siblings().show();
					if ($(this).parent().siblings('li').length == 0) {
						$.ajax({
							url: '${base}/area!queryListbyParentCode.ajax',
							type: 'POST',
							dataType: 'json',
							async: false,
							data: {
								"parentCode": parentCode
							},
							beforeSend: function() {
								common.base.loading("fadeIn");
							},
							success: function(resultMap) {
								if (resultMap.code == "success") {
									var data = resultMap.data.areaVoList;
									if (data != null && data.length > 0) {
										for (var i = 0; i < data.length; i++) {
											var temp = data[i];
											var html = '<ul>' + '<div>' + '<a href="javascript:;" data-key-id="' + temp.code + '" class="for-ajax-link djk-folder"><span class="glyphicon glyphicon-folder-close">&nbsp;</span>' + temp.name + '</a>' + '<a href="javascript:;" data-id="' + temp.id + '" data-area-id="' + temp.areaId + '" id="deleteArea" class="for-ajax-link djk-delete pull-right"><span class="glyphicon glyphicon-remove">&nbsp;</span>删除</a>' + '<a href="javascript:;" data-area-id="' + temp.areaId + '" id="edit" class="for-ajax-link djk-edit pull-right djk-modals-open"><span class="glyphicon glyphicon-edit">&nbsp;</span>编辑</a>' + '<a href="javascript:;" data-area-id="' + temp.areaId + '" class="for-ajax-link djk-add pull-right djk-modals-open"><span class="glyphicon glyphicon-plus">&nbsp;</span>添加子栏目</a>' + '</div>' + '</ul>';
											p.append('<li>' + html + '</li>');
										}
									}
								}
								common.base.loading("fadeOut");
							}
						});
					}

					sp.addClass('glyphicon-folder-open').removeClass('glyphicon-folder-close');
				} else if (sp.hasClass('glyphicon-folder-open')) {
					$(this).parent().siblings().hide();
					$(this).find('span').addClass('glyphicon-folder-close').removeClass('glyphicon-folder-open');
				}
			});

		},
		//添加地区
		addArea: function() {
			$('.js_area_add').unbind("click");
			$(".js_area_add").click(function() {

				var _templ = Handlebars.compile($("#areaadd-save").html());
				$("#areaadd-save-content").html(_templ());
				common.base.popUp('.js_popUpareaadd');
				$("#addarea").click(function() {
					if ($('select[name="prevarea"]').val() == '请选择') {

						$(".errortip").html("请选择上级地区！");
						return;
					} else {
						$(".errortip").html("");
					}
				})
			})
		},
		//添加地区
		editArea: function() {
			$('.js_area_edit').unbind("click");
			$(".js_area_edit").click(function() {

				var _templ = Handlebars.compile($("#areaadd-save").html());
				$("#areaadd-save-content").html(_templ());
				common.base.popUp('.js_popUpareaadd');
				$("#addarea").click(function() {
					if ($('select[name="prevarea"]').val() == '请选择') {

						$(".errortip").html("请选择上级地区！");
						return;
					} else {
						$(".errortip").html("");
					}
				})
			})
		},
		//删除地区
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				//var Id = $(this).attr('dataId');
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
		}

	}
	var areaListInit = function() {
		areaList.getProviceList();
		areaList.addArea();
		areaList.deleterow();
	}
	return {
		init: areaListInit
	};
})