define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt',  'diyUpload', 'base64','bdueditor', 'ueditorlang',],
function($, common, jqueryui, Handlebars, HandlebarExt, diyUpload, base64,UE) {
	var totalNum;
	var dataList = {
		formsubmit: function() {
			$("#ruleeditsubmit").click(function(){
				var checkResult = true;
				//验证
				var checkResult = true;
	
				$("input[type='text']").each(function(){
					if($(this).val()==""){
						alert("不能为空");checkResult= false;
						return false;
					}
				})
				if (!checkResult) {
					dataList.isAjaxing = false;
					return false;
				}
				var postData = {};
				
				var base64 = new Base64();
				var ueExtContent = UE.getEditor('js_articleVodescription');
				var js_articleExtVoContent = ueExtContent.getContent();
				var description = base64.encode(js_articleExtVoContent);
				
				postData['integralRule.shareNumber'] = $("#shareNumber").val();
				postData['integralRule.shareSource'] = $("#shareSource").val();
				postData['integralRule.maxShareTime'] = $("#maxShareTime").val();
				postData['integralRule.readNumber'] = $("#readNumber").val();
				postData['integralRule.readSource'] = $("#readSource").val();
				postData['integralRule.inviteNumber'] = $("#inviteNumber").val();
				postData['integralRule.inviteSource'] = $("#inviteSource").val();
				postData['integralRule.secoundShareNumber'] = $("#secoundShareNumber").val();
				postData['integralRule.secoundShareSource'] = $("#secoundShareSource").val();
				postData['integralRule.secoundReadNumber'] = $("#secoundReadNumber").val();
				postData['integralRule.secoundReadSource'] = $("#secoundReadSource").val();
				postData['integralRule.sourceNumber'] = $("#sourceNumber").val();
				postData['integralRule.sourceMoney'] = $("#sourceMoney").val();
				postData['integralRule.description'] = description;
				//提交数据
				
				$.ajax({
					url: '${base}/member!changeRule.ajax',
					data: postData,
					dataType: "json",
					success: function(resultData) {
						console.log(resultData);
						if(resultData.code=='success'){
							alert("修改成功");
						}
					}
				});
			})
		},
		ueedit: function(articleVoDescription) {
			//判断ueditor 编辑器是否创建成功
			var ue = UE.getEditor('js_articleVodescription', {
				wordCount: true,
				maximumWords: 1000
			});
			ue.addListener("ready",
			function() {
				var base64 = new Base64();
				//editor准备好之后才可以使用
				ue.setContent(base64.decode(articleVoDescription));
			});
		},
		changeStatus:function(){
			$('.js_inp').unbind('change');
			$('.js_inp').on('change',function(){
				var bool = $(this).prop('checked')
				var val = 'open';
				if(!bool){
					val = 'close';
				}
				console.log(val);
				var dataPost = {};
				dataPost['projectConfigVo.type']="web";
				dataPost['projectConfigVo.name']="forward_rule";
				dataPost['projectConfigVo.val']=val;

				$.ajax({
					url: '${base}/projectConfig!update.ajax',
					data: dataPost,
					dataType: "json",
					success: function(resultData) {
						if(resultData.code=='success'){
						}
					}
				});
			});
		}
				
	}
	var dataListInit = function(articleVoDescription) {
		dataList.changeStatus();
		dataList.formsubmit();
		dataList.ueedit(articleVoDescription);
	}
	return {
		init: dataListInit
	};
});