define(['jquery', 'common', 'jqueryui', 'Handlebars', 'HandlebarExt'],
function($, common, jqueryui, Handlebars, HandlebarExt) {
	var configArray = {};
	var uploadSet = {
		isAjaxing: false,
		queryByModuleName:function(moduleName) {
			var dataArr = {};
			dataArr['uploadSetVo.moduleName'] = moduleName;
			$.ajax({
				url:"${base}/uploadSet!queryByModuleName.ajax",
				type:"post",
				dataType:"json",
				async:false,
				data:dataArr,
				success:function(result) {
					if(result.code == "success") {
						var configVo = result.data;
						$("#moduleName option[value="+configVo.moduleName+"]").prop("selected",true);
						$("#big_width").val(configVo.bigWidth);
						$("#middle_width").val(configVo.middleWidth);
						$("#small_width").val(configVo.smallWidth);
						$("#filesize").val(configVo.fileSize);
						$("#isSaveOrigin option[value="+configVo.isSaveOrigin+"]").prop("selected",true);
					} else {
						$("#big_width").val("");
						$("#middle_width").val("");
						$("#small_width").val("");
						$("#filesize").val("");
						$("#isSaveOrigin option[value=N]").prop("selected",true);
					}
				}
			});
		},
		addConfig:function(url) {
			var checkResult = false;
			var moduleName = $("#moduleName").val();
			var bigwidth = $("#big_width").val();
			var middlewidth = $("#middle_width").val();
			var smallwidth = $("#small_width").val();
			//var width = $("#width").val();
			var filesize = $("#filesize").val();
			var isSaveOrigin = $("#isSaveOrigin").val();
			var dataArr = {};
			if(common.validate.checkEmpty("#moduleName","请选择板块!")) {
				checkResult = true;
			}else{
				checkResult = false;
			}
			if(common.validate.checkEmpty("#big_width","请输入大图宽度!")) {
				checkResult = true;		
			}else{
				checkResult = false;
			}
			if(common.validate.checkEmpty("#middle_width","请输入中图宽度!")) {
				checkResult = true;		
			}else{
				checkResult = false;
			}
			if(common.validate.checkEmpty("#small_width","请输入小图宽度!")) {
				checkResult = true;		
			}else{
				checkResult = false;
			}
			/*if(common.validate.checkEmpty("#width","请输入宽度")) {
				checkResult = true;
			}else{
				checkResult = false;
			}*/
			if(common.validate.checkEmpty("#filesize","请输入限制大小!")) {
				checkResult = true;
			}else{
				checkResult = false;
			}
			dataArr['uploadSetVo.moduleName'] = moduleName;
			dataArr['uploadSetVo.bigWidth'] = bigwidth;
			dataArr['uploadSetVo.middleWidth'] = middlewidth;
			dataArr['uploadSetVo.smallWidth'] = smallwidth;
			//dataArr['uploadSetVo.width'] = width;
			dataArr['uploadSetVo.fileSize'] = filesize;
			dataArr['uploadSetVo.isSaveOrigin'] = isSaveOrigin;
			if(checkResult == true) {
				$.ajax({
					url:url,
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
		},
		// 添加配置
		savePorjectConfig:function() {
			$(".js_configsubmit").unbind("click");
			$(".js_configsubmit").bind("click",function(){
				var url = "${base}/uploadSet!saveConfig.ajax";
				uploadSet.addConfig(url);
			});
		},
		// 加载板块默认配置
		loadDefaultSetting:function() {
			$("select#moduleName").change(function(){
				uploadSet.queryByModuleName($(this).val());
			});
		},
		// 修改配置
		updateConfigSetting:function() {
			$(".js_configupdate").unbind("click");
			$(".js_configupdate").bind("click",function(){
				var url = "${base}/uploadSet!updateConfig.ajax";
				uploadSet.addConfig(url);
			})
		}
	}
	var uploadSetInit = function(moduleName) {
		uploadSet.queryByModuleName(moduleName);
		uploadSet.savePorjectConfig();
		uploadSet.loadDefaultSetting();
		uploadSet.updateConfigSetting();
	}
	return {
		init: uploadSetInit
	};

});