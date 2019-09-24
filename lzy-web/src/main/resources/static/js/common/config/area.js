define(['jquery', 'common'],
function($, common) {
	var initSelect = {
		rootAreaid: "3301",
		//地区初始化
		reInitSelect: function(selectId) {
			while ($("#" + selectId + " option").length >= 1) {
				$("#" + selectId + " option:last").remove();
			}
		},
		initAreaSelect: function() {
			var areaId = $("#areaId").val();
			var countroySelectObj = $("#selectId");
			while ($("#selectId option").length >= 1) {
				$("#selectId option:last").remove();
			}
			$.ajax({
				type: "post",
				url: "${base}/area!queryListbyParentCode.ajax",
				data: {
					"parentCode": initSelect.rootAreaid
				},
				async: false,
				beforeSend: function() {
					//	 $.blockUI({message: '<img src=\"${base}/js/ajax-loader.gif\" >'});
				},
				complete: function() {
					//	  $.unblockUI();
				},
				dataType: "json",
				success: function(resultMap) {
					if (resultMap.code == "success") {
						var areaVoList = resultMap.data.areaVoList;
						var option = $("<option>").val("").text("请选择");
						countroySelectObj.append(option);
						for (var i = 0; i < areaVoList.length; i++) {
							var areaVo = areaVoList[i];
							var option = $("<option>").val(areaVo.code).text(areaVo.name);
							if (areaId != null && areaId == areaVo.code) {
								option.attr("selected", true);
							}
							countroySelectObj.append(option);
						}
					} else {
						alert(resultMap.description);
					}
				},
				error: function(e) {
					alert("error");
				}
			});

		}
	};

	var areaInit = function(rootAreaid) {
		if(rootAreaid)initSelect.rootAreaid = rootAreaid;
		initSelect.initAreaSelect();
	};
	return {
		init: areaInit
	};
});