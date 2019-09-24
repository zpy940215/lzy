define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt'],
function($, common, jqueryui, Handlebars, HandlebarExt) {
	var configArray = {};
	var orderSet = {
		isAjaxing: false,
		queryByModuleName:function(moduleName) {
			var dataArr = {};
			dataArr["projectConfigVo.type"]='sc_order_set';
			dataArr["projectConfigVo.name"]='detail';
			$.ajax({
				url:"${base}/projectConfig!queryProjectConfig.ajax",
				type:"post",
				dataType:"json",
				async:false,
				data:'',
				success:function(result) {
					if(result.code == "success") {
						var configVo = result.data;
						//$("#moduleName option[value="+configVo.moduleName+"]").prop("selected",true);
						//$("#big_width").val(configVo.bigWidth);
						//$("#middle_width").val(configVo.middleWidth);
						//$("#small_width").val(configVo.smallWidth);
						//$("#filesize").val(configVo.fileSize);
						//$("#isSaveOrigin option[value="+configVo.isSaveOrigin+"]").prop("selected",true);
					} else {
						//$("#big_width").val("");
						//$("#middle_width").val("");
						//$("#small_width").val("");
						//$("#filesize").val("");
						 $("#isAutoSync option[value=N]").prop("selected",true);
					}
				}
			});
		},
		syncChange:function(){
			$("#isAutoSync").on('change',function(){
				if($("#isAutoSync").val()=='Y'){
					$('.showhid').show();
				}
				if($("#isAutoSync").val()=='N'){
					$('.showhid').hide();
				}
			})
		},
		addConfig:function() {
			
			$('.js_save_config').on('click',function(){
				var checkResult = true;
				var dataArr = {};
				var arr=document.getElementsByName("orderShow");
				for(i=0;i<arr.length;i++){
					if(arr[i].value=='showOrderStatus'){
						if(arr[i].checked){
							dataArr["orderShowVo.showOrderStatus"]='Y';
						}else{
							dataArr["orderShowVo.showOrderStatus"]='N';
						}
					}
					if(arr[i].value=='showCheckStatus'){
						if(arr[i].checked){
							dataArr["orderShowVo.showCheckStatus"]='Y';
						}else{
							dataArr["orderShowVo.showCheckStatus"]='N';
						}
					}
					if(arr[i].value=='showClientStatus'){
						if(arr[i].checked){
							dataArr["orderShowVo.showClientStatus"]='Y';
						}else{
							dataArr["orderShowVo.showClientStatus"]='N';
						}
					}
					if(arr[i].value=='showPayType'){
						if(arr[i].checked){
							dataArr["orderShowVo.showPayType"]='Y';
						}else{
							dataArr["orderShowVo.showPayType"]='N';
						}
					}
				}
		
				var syncTime = $("#syncTime").val();
				var isAutoSync = $("#isAutoSync").val();
				var isNeedPostage = $("#isNeedPostage").val();
				var isStock = $("#isStock").val();
				
				if(isAutoSync=='Y'){
					if(common.validate.checkEmpty("#syncTime","请设定同步周期!")) {
						checkResult = true;
					}else{
						checkResult = false;
					}
				}
				dataArr['scSetVo.isAutoSync'] = isAutoSync;
				dataArr['scSetVo.syncTime'] = syncTime;
				dataArr['scSetVo.isNeedPostage'] = isNeedPostage;
				dataArr['scSetVo.isStock']=isStock;
				if(checkResult == true) {
					$.ajax({
						url:"${base}/orderSet!save.ajax",
						type:"post",
						dataType:"json",
						data:dataArr,
						success:function(result) {
							if(result.code == "success") {
								alert("设置成功");
							} else {
								alert(result.description);
							}
						}
					})
				}
			})
		} 
	}
	var orderSetInit = function() {
		$('.showhid').hide();
		orderSet.syncChange();
		orderSet.addConfig();
	}
	return {
		init: orderSetInit
	};

});