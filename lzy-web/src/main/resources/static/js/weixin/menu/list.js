define(['jquery', 'common', 'ztree', 'Handlebars', 'HandlebarExt', 'diyUpload', 'moment', 'stay', 'viewer', 'main', 'base64','bdueditor', 'ueditorlang' ],
function($, common, ztree, Handlebars, HandlebarExt, diyUpload, moment, stay, viewer, main, base64,UE) {
	
	
	var wxmenuList = {
		isAjaxing: false,
		
		update: function() {
			
		
			var menutext=$('#menutext').val();
			var base64 = new Base64();
			
			wxmenuList.isAjaxing = true;
			

			$.ajax({
				type: "post",
				url: "${base}/wxmenu!update.ajax",
				data: {"menutext":base64.encode(menutext)},
				dataType: "json",
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultMap) {
					common.base.loading("fadeOut");
					wxmenuList.isAjaxing = false;
					if (resultMap.code == "success") {
						window.location.href = '${base}/weixin/menu/list.html';
					} else {
						
					}
				},
				error: function(e) {
					wxmenuList.isAjaxing = false;
					common.base.loading("fadeOut");
					common.base.popUp('', {
						type: 'choice',
						tipTitle: '温馨提示',
						tipMesg: '操作异常',
						backFn: function(result) {}
					});
				}
			});
		},

		
		// 编辑页面表单编辑提交
		wxmenuform: function() {
			
			$("#wxmenuupdate").click(function() {
				wxmenuList.update();
			});
		},
		cancel: function() {
			$("#cancle").unbind("click");
			$("#cancle").click(function() {
				window.location.href = '${base}/weixin/menu/list.html';
				
			})
		},
		
		
		
		
	}
	var wxmenuInit = function() {
		
		wxmenuList.cancel();
		
		wxmenuList.wxmenuform();
		
		
	}

	return {
		init: wxmenuInit
	};
})