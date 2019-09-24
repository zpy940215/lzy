define(['jquery','common'], function($,common){
//树形菜单


	var examineList = {

		submit: function(ispass) {
			var dataBind=$("#dataBind");
			var dataType=dataBind.attr("dataType");
			var auditId=dataBind.attr('auditId');
			var dataId=dataBind.attr('dataId');
			// alert('dataType='+dataType+",auditId="+auditId+",dataId="+dataId);
			var pass=ispass;
			$.ajax({
				type: "post",
				url: "${base}/audit!editAudit.ajax",
				data: {
					'auditVo.id': auditId,
					'auditVo.dataType': dataType,
					'pass': pass,
					'auditVo.dataId':dataId
				},
				type: 'post',
				dataType: "json",
				beforeSend: function () {
					common.base.loading("fadeIn");
				},
				success: function (resultData) {
					common.base.loading("fadeOut");
					if('success'==resultData.code){
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '审核成功!',
							//提示语
							backFn: function(result) {
								if (result) {
									window.location.href = '${base}/tool/audit/list.html';
								}
							}
						});
					}else {
						common.base.popUp('', {
							type: 'tip',
							tipTitle: '温馨提示',
							//标题
							tipMesg: '操作失败!'+resultData.description,
							//提示语
							backFn: function(result) {
							}
						});
					}


				}
			})


		},
	}

	var initLoad=function(){
		$('#pass').click(function () {
			examineList.submit('true');
		});
		$('#nopass').click(function () {
			examineList.submit('false');
		});
	}
	 return {
        init:initLoad
    };
})
