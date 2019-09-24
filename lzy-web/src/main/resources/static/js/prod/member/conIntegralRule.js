define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt', 'diyUpload', 'base64'],
function($, common, jqueryui, Handlebars, HandlebarExt, diyUpload, base64) {
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
				postData['conIntegralRule.consumeNum'] = $("#consumeNum").val();
				postData['conIntegralRule.consumeScore'] = $("#consumeScore").val();
				postData['conIntegralRule.sourceNumber'] = $("#sourceNumber").val();
				postData['conIntegralRule.sourceMoney'] = $("#sourceMoney").val();
				//提交数据
				
				$.ajax({
					url: '${base}/member!changeConIntegralRule.ajax',
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
		}	
				
	}
	var dataListInit = function() {
		dataList.formsubmit();
	}
	return {
		init: dataListInit
	};
});