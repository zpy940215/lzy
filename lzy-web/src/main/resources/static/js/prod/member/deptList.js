define(['jquery', 'common', 'jqueryui', 'Handlebars', 'treeTable', 'ztree'],
function($, common, jqueryui, Handlebars, treeTable, ztree) {
	var typeList = {
		isAjaxing: false,
		types: [],
		getTypelist: function(pid, dom,deptName) {
			$.ajax({
				url: '${base}/member!queryListByPid.ajax',
				type: 'POST',
				dataType: 'json',
				async: false,
				data: {
					"deptVo.upId": pid,
					"deptVo.status": "open",
					"deptVo.name": deptName
				},
				beforeSend: function() {
					common.base.loading("fadeIn");
				},
				success: function(resultMap) {
					if (resultMap.code == "success") {
						var data = resultMap.data.deptVoList;
						var deptPositionVoList = resultMap.data.deptPositionVoList;
						var html = '';
						var html2 = '';
						if (data != null && data.length > 0) {
							for (var i = 0; i < data.length; i++) {
								var temp = data[i];
									var lvl = '';
									if(temp.lvl!=null&&!temp.lvl!=undefined){
										lvl = temp.lvl;
									}
								    html += '<ul>' + 
												'<div class="tabletreerow clear">' + 
													'<div class="tabletreerowleft fl">' + 
														'<a href="javascript:;" type_id="' + temp.deptId + '" up_id="' + temp.upId + '" class="for-ajax-link pms-folder js_pms-folder">'+
															'<span class="glyphicon glyphicon-folder-close">&nbsp;</span>' + 
															temp.name + 
														'</a>' + 
													'</div>'+
													'<div class="tabletreerowleft fl" style="position: absolute;left: 37%;">' + 
														'<span>'+lvl+'</span>'+
													'</div>'+
													'<div class="tabletreerowleft fl" style="position: absolute;left: 59%;">';
												    if(temp.needStat == 'Y') {
												    	html += '<span>是</span>';
												    } else {
												    	html += '<span>否</span>';
												    }
													html +=	'</div>' + 
													'<div class="tabletreerowright fr">' + 
													'<span >'+
														'<a class="js_genre_add for-ajax-link  pms-modals-open" type_id="' + temp.deptId + '" up_id="' + temp.upId + '" href="javascript:;" >添加子部门</a>&nbsp;&nbsp;'+
													'|&nbsp;&nbsp;</span>'+
													'<span >'+
														'<a class="js_position_add for-ajax-link  pms-modals-open" type_id="' + temp.deptId + '" up_id="' + temp.upId + '" href="javascript:;" >添加职位</a>&nbsp;&nbsp;'+
													'|&nbsp;&nbsp;</span>'+
													'<span class="edit_row">'+
														'<a href="javascript:void(0)" editId="' + temp.id + '" type_id="' + temp.deptId + '" up_id="' + temp.upId + '" class="js_genre_edit">编辑</a>&nbsp;&nbsp;'+
													'|&nbsp;&nbsp;</span>'+
													'<span>'+
														'<a href="javascript:void(0)" deleteId="' + temp.id + '" typeId="' + temp.deptId + '" up_id="' + temp.upId + '" class="js_delete_row">删除</a>&nbsp;&nbsp;'+
													'|&nbsp;&nbsp;</span>' + 
													'<span>';
													 if(temp.needStat == 'Y') {
														 html+= '<a href="javascript:void(0)" Id="' + temp.id + '" typeId="' + temp.deptId + '" needStat="N" class="js_needStat_edit">否</a>';
													 }else{
														 html+= '<a href="javascript:void(0)" Id="' + temp.id + '" typeId="' + temp.deptId + '" needStat="Y" class="js_needStat_edit">是</a>';
													 }
													 html+= '</span>' + 
													'</div>' + 
												'</div>'+ 
												'<li class="js_childTreeList" ></li>'+
											'</ul>';
							}
						}
						if (deptPositionVoList != null && deptPositionVoList.length > 0) {
							for (var j = 0;j<deptPositionVoList.length;j++){
								var deptPositionVo = deptPositionVoList[j];
									var lvl2 = '';
									if(deptPositionVo.lvl!=null&&deptPositionVo.lvl!=undefined){
										lvl2 = deptPositionVo.lvl;
									}
								    html += '<ul>' +
											'<div class="tabletreerow clear">' + 
												'<div class="tabletreerowleft fl">' + 
													'<a href="javascript:;" dept_id="' + deptPositionVo.deptId + '" position_id="' + deptPositionVo.positionId + '" class="for-ajax-link pms-folder">'+
														deptPositionVo.name + 
													'</a>' + 
												'</div>' + 
												'<div class="tabletreerowleft fl" style="position: absolute;left: 37%;">' + 
													'<span>'+lvl2+'</span>'+
												'</div>' + 
												'<div class="tabletreerowright fr">' + 
												'<span class="edit_row">'+
													'<a href="javascript:void(0)" editId="' + deptPositionVo.id + '" dept_id="' + deptPositionVo.deptId + '" position_id="' + deptPositionVo.positionId + '" class="js_position_edit">编辑</a>&nbsp;&nbsp;'+
												'|&nbsp;&nbsp;</span>'+
												'<span>'+
													'<a href="javascript:void(0)" deleteId="' + deptPositionVo.id + '" deptId="' + deptPositionVo.deptId + '" position_id="' + deptPositionVo.positionId + '" class="js_position_delete">删除</a>'+
												'</span>' + 
												'</div>' + 
											'</div>'+ 
											'<li class="js_childTreeList" ></li>'+
										'</ul>';
							}
						}
						$(dom).append(html+html2);
						typeList.addTypeList();
						typeList.genreadd(); //初始化添加子部门
						typeList.deleterow(); //初始化删除行
						typeList.queryById(); //查询一条数据positionadd
						typeList.positionadd(); //初始化添加部门职位
						typeList.queryPositionById();
						typeList.deletposition();
						typeList.deptselect();
						typeList.needStat();
						typeList.exportDeptExcel();
						typeList.importDeptExcel();
						typeList.importDeptExcelSbu();
					}
					common.base.loading("fadeOut");
				}
			});
		},
		
		importDeptExcelSbu:function(){
			$("#importRloe").unbind("click");
			$("#importRloe").on('click',
			function() {
				var fileDir = $("#upfile").val();
				var suffix = fileDir.substr(fileDir.lastIndexOf("."));
				if ("" == fileDir) {
					alert("选择需要导入的Excel文件！");
					return false;
				}
				if (".xls" != suffix && ".xlsx" != suffix) {
					alert("选择Excel格式的文件导入！");
					return false;
				}
				var files = $("#upfile").prop('files');
				var data = new FormData();
				data.append('file', files[0]);
				
				$.ajax({
					url: '${base}/member!importDeptExcel.action',
					data: data,
					type: 'POST',
					cache: false,
					processData: false,
					contentType: false,
					success: function(resultData) {
						if(resultData.code == "success" ){
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: '操作成功!',
								//提示语
								backFn: function(result) {
									window.location.href="${base}/prod/member/deptList.html";
									member.pageCur = 1;
									member.memberList();
								}
							});
							
						}else{
							if (resultData && resultData.description) {
								//alert(resultData.description);
								common.base.popUp('', {
									type: 'choice',
									tipTitle: '温馨提示',
									//标题
									tipMesg: resultData.description,
									//提示语
									backFn: function(result) {
										window.location.href="${base}/prod/member/deptList.html";
									}
								});
								
							}
						}
						
					}
				})
			});
		},
		
		importDeptExcel:function(){
			$('.js_importDeptExcel').unbind('click');
			$('.js_importDeptExcel').click(function() {
				var _templ = Handlebars.compile($("#addquestion-import").html());
				$("#importQuestion").html(_templ());
				common.base.popUp('.js_question_import');
				typeList.importDeptExcelSbu();
			});
		},
		
		exportDeptExcel:function(){
			$('.js_exportDeptExcel').unbind('click');
			$('.js_exportDeptExcel').click(function() {
				$.ajax({
					url: '${base}/member!exportDeptExcel.ajax',
					data: {},
					dataType: "json",
					success: function(resultData) {
						if(resultData == "success" ){
							var path=$.cookie("orderList");
							window.location.href=path;
						}else{
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
				})
			});
		},
		deptselect:function() {
			$('#deptselect').unbind('click');
			$('#deptselect').click(function() {
				var deptName=$('#keywords').val();
				if(deptName==null || deptName==''){
					$('.js_pms-tabletree').html("");
					typeList.getTypelist("0", ".js_pms-tabletree","");
				}else{
					$('.js_pms-tabletree').html("");
					typeList.getTypelist("", ".js_pms-tabletree",deptName);
				}
			});
		},
		
		addTypeList: function() {
			$("a.js_pms-folder").unbind("click");
			$("a.js_pms-folder").click(function() {
				var pid = $(this).attr('type_id');
				var dom = $(this).parent().parent().parent().children(".js_childTreeList");
				var sp = $(this).find('span');
				if (sp.hasClass('glyphicon-folder-close')) {
					$(this).parents('.tabletreerow').siblings().show();
					sp.addClass('glyphicon-folder-open').removeClass('glyphicon-folder-close');
					if (dom.find("ul").length == "0") {
						typeList.getTypelist(pid, dom,"");
					}
				} else if (sp.hasClass('glyphicon-folder-open')) {
					$(this).parents('.tabletreerow').siblings().hide();
					$(this).find('span').addClass('glyphicon-folder-close').removeClass('glyphicon-folder-open');
				}

			});
		},

		getListAll: function() {
			$.ajax({
				url: '${base}/member!queryListAll.ajax',
				data: {
					"deptVo.status": "open"
				},
				dataType: "json",
				success: function(resultData) {
					if (resultData.code == "success") {
						typeList.types = resultData.data.deptVoList;
						typeList.typeSetlvlstr(); //更新筛选值
					} else {
						if (resultData && resultData.description) {
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
				}
			});
		},

		typeSetlvlstr: function() {
			var html = '',
			len = typeList.types.length;
			for (var i = 0; i < len; i++) {
				var lvl = typeList.types[i].lvl,
				nbsp = "";
				if (lvl == "2") nbsp = "--";
				if (lvl == "3") nbsp = "----";
				if (lvl == "4") nbsp = "------";
				typeList.types[i]['nbsp'] = nbsp;
			}
		},

		//删除行
		deleterow: function() {
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function() {
				var Id = $(this).attr('deleteId');
				var typeId = $(this).attr('typeId');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/member!delete.ajax',
								data: {
									"deptVo.id": Id,
									"deptVo.deptId": typeId,
									"deptVo.status": "delete"
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										$(".js_pms-tabletree").html('');
										typeList.getTypelist("0", ".js_pms-tabletree","");
										typeList.getListAll();
									} else {

}
								}
							});
						} else {
							typeList.addTypeList();
							typeList.genreadd(); //初始化添加子部门
							typeList.deleterow(); //初始化删除行
							typeList.queryById(); //查询一条数据positionadd
							typeList.positionadd(); //初始化添加部门职位
							typeList.queryPositionById();
							typeList.deletposition();
							typeList.deptselect();
							typeList.needStat();
						}
					}
				});
			});
		},
		
		//修改统计
		needStat: function() {
			$('.js_needStat_edit').unbind("click");
			$(".js_needStat_edit").click(function() {
				var Id = $(this).attr('Id');
				var typeId = $(this).attr('typeId');
				var needStat = $(this).attr('needStat');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定修改？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/member!updateNeedStat.ajax',
								data: {
									"deptVo.id": Id,
									"deptVo.deptId": typeId,
									"deptVo.needStat":needStat,
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										$(".js_pms-tabletree").html('');
										typeList.getTypelist("0", ".js_pms-tabletree","");
										typeList.getListAll();
									}
								}
							});
						} else {
							typeList.addTypeList();
							typeList.genreadd(); //初始化添加子部门
							typeList.deleterow(); //初始化删除行
							typeList.queryById(); //查询一条数据positionadd
							typeList.positionadd(); //初始化添加部门职位
							typeList.queryPositionById();
							typeList.deletposition();
							typeList.deptselect();
							typeList.needStat();
						}
					}
				});
			});
		},
		
		//添加部门
		genreadd: function() {

			$('.js_genre_add').unbind("click");
			$(".js_genre_add").click(function() {
				$('.js_popUpSubmit').unbind('click');
				$('#genresubmit').unbind('click');
				var upId = $(this).attr('type_id');
				var typeData = [];
				var _templ = Handlebars.compile($("#genreadd-save").html());
				typeData['popUp'] = {
					titleName: '新增部门',
					upId: upId
				};
				typeData['deptList'] = typeList.types;
				$("#genreadd-save-content").html(_templ(typeData));
				common.base.popUp('.js_popUpgenreadd');
				$(".js_popUpSubmit").click(function() {
					typeList.save('', '', '');
				})
			})

		},

		//编辑部门
		genreedit: function(resultData, upId, id) {
			$('.js_popUpSubmit').unbind('click');
			if (resultData) {
				var typeData = resultData;
				var _templ = Handlebars.compile($("#genreadd-save").html());
				typeData['popUp'] = {
					titleName: '编辑部门',
					upId: upId,
					deptId:typeData.deptId
				};
				typeData['deptList'] = typeList.types;
				$("#genreadd-save-content").html(_templ(typeData));
				common.base.popUp('.js_popUpgenreadd');
				$(".js_popUpSubmit").click(function() {
					typeList.save(upId, typeData.deptId, id);
				})
			}
		},

		//保存
		save: function(upId, deptId, id) {
			if (typeList.isAjaxing) {
				return false;
			}
			typeList.isAjaxing = true;
			var checkResult = true,
			dataPost = {};
			if (!common.validate.checkEmpty('#name', '请输入部门名称！')) {
				checkResult = false;
			}
			if (!checkResult) {
				typeList.isAjaxing = false;
				return false;
			}
			var chooseStr = $(".js_commtext").val().split('_');
			dataPost['deptVo.upId'] = chooseStr[0];
			dataPost['deptVo.lvl'] = parseInt(chooseStr[1])+1;
			dataPost['deptVo.name'] = $("#name").val();
			dataPost['deptVo.oldDeptId'] = deptId;
			dataPost['deptVo.needStat'] = $(".js_needStat").val();
			if (chooseStr[0] == upId && upId != '') { // 不用重新计算typeId
				dataPost['deptVo.deptId'] = deptId;
			}
			if (id != '') {
				dataPost['deptVo.id'] = id;
			}
			$.ajax({
				url: '${base}/member!save.ajax',
				data: dataPost,
				type: 'post',
				dataType: "json",
				success: function(resultData) {
					typeList.isAjaxing = false;
					if (resultData.data.code == "200") {
						$('.js_popUpgenreadd').fadeOut();
						//新增完成刷新列表
						$(".js_pms-tabletree").html('');
						typeList.getTypelist("0", ".js_pms-tabletree","");
						typeList.getListAll();
					} else {
						if (resultData && resultData.data.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.data.description,
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
						}
					}
				},
				error: function(resultData) {
					typeList.isAjaxing = false;
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

		//查询一条记录（编辑部门）
		queryById: function() {
			$('.js_popUpSubmit').unbind('click');
			$('.js_genre_edit').unbind("click");
			$(".js_genre_edit").click(function() {
				var id = $(this).attr('editId');
				var upId = $(this).attr('up_id');
				$.ajax({
					url: '${base}/member!queryById.ajax',
					data: {
						"deptVo.id": id
					},
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var resultData = resultData.data.deptVo;
							typeList.genreedit(resultData, upId, id);
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
					}
				});
			});
		},
		
		//查询一条记录（编辑职位）
		queryPositionById: function() {
			$('.js_positionSubmit').unbind('click');
			$('.js_position_edit').unbind("click");
			$(".js_position_edit").click(function() {
				var id = $(this).attr('editId');
				var deptid = $(this).attr('dept_id');
				$.ajax({
					url: '${base}/member!queryPositionById.ajax',
					data: {
						"deptPositionVo.id": id
					},
					dataType: "json",
					success: function(resultData) {
						if (resultData.code == "success") {
							var resultData = resultData.data.deptPositionVo;
							typeList.positionedit(deptid,resultData, id);
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
					}
				});
			});
		},
		
		//编辑职位
		positionedit: function(deptid,resultData, id) {
			$('.js_positionSubmit').unbind('click');
			if (resultData) {
				var typeData = resultData;
				var _templ = Handlebars.compile($("#positionadd-save").html());
				typeData['popUp'] = {
					titleName: '编辑部门',
					deptid: deptid
				};
				typeData['deptList'] = typeList.types;
				$("#positionadd-save-content").html(_templ(typeData));
				common.base.popUp('.js_positionadd');
				$(".js_positionSubmit").click(function() {
					typeList.positionsave(deptid,resultData.positionId,id);
				})
			}
		},
		
		//添加职位
		positionadd: function() {
			$('.js_position_add').unbind("click");
			$(".js_position_add").click(function() {
				$('.js_positionSubmit').unbind('click');
				var deptId = $(this).attr('type_id');
				var typeData = [];
				var _templ = Handlebars.compile($("#positionadd-save").html());
				typeData['popUp'] = {
					titleName: '新增职位',
					deptid: deptId
				};
				typeData['deptList'] = typeList.types;
				$("#positionadd-save-content").html(_templ(typeData));
				common.base.popUp('.js_positionadd');
				$(".js_positionSubmit").click(function() {
					typeList.positionsave('','','');
				})
			})

		},
		
		//保存职位
		positionsave: function(deptid,positionId,id) {
			if (typeList.isAjaxing) {
				return false;
			}
			typeList.isAjaxing = true;
			var checkResult = true,
			dataPost = {};
			if (!common.validate.checkEmpty('#positionname', '请输入部门职位名称！')) {
				checkResult = false;
			}
			if (!common.validate.checkEmpty('#positionlvl', '请输入部门等级！')) {
				checkResult = false;
			}
			if (!checkResult) {
				typeList.isAjaxing = false;
				return false;
			}
			var chooseStr = $(".js_positiontext").val();
			
			dataPost['deptPositionVo.deptId'] = chooseStr;
			dataPost['deptPositionVo.name'] = $("#positionname").val();
			dataPost['deptPositionVo.lvl'] = $("#positionlvl").val();
			if (chooseStr == deptid && deptid != '') { // 不用重新计算positionId
				dataPost['deptPositionVo.positionId'] = positionId;
			}
			if (id != '') {
				dataPost['deptPositionVo.id'] = id;
			}
			$.ajax({
				url: '${base}/member!deptPositionSave.ajax',
				data: dataPost,
				type: 'post',
				dataType: "json",
				success: function(resultData) {
					typeList.isAjaxing = false;
					if (resultData.data.code == "200") {
						$('.js_positionadd').fadeOut();
						//新增完成刷新列表
						$(".js_pms-tabletree").html('');
						typeList.getTypelist("0", ".js_pms-tabletree","");
						typeList.getListAll();
					} else {
						if (resultData && resultData.data.description) {
							//alert(resultData.description);
							common.base.popUp('', {
								type: 'tip',
								tipTitle: '温馨提示',
								//标题
								tipMesg: resultData.data.description,
								//提示语
								backFn: function(result) {
									//alert(result);
								}
							});
						}
					}
				},
				error: function(resultData) {
					typeList.isAjaxing = false;
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
		//删除职位
		deletposition: function() {
			$('.js_position_delete').unbind("click");
			$(".js_position_delete").click(function() {
				var Id = $(this).attr('deleteId');
				var positionId = $(this).attr('position_id');
				common.base.popUp('', {
					type: 'choice',
					tipTitle: '温馨提示',
					//标题
					tipMesg: '是否确定删除？',
					//提示语
					backFn: function(result) {
						if (result) {
							$.ajax({
								url: '${base}/member!deletePosition.ajax',
								data: {
									"deptPositionVo.id": Id,
									"deptPositionVo.positionId": positionId,
								},
								dataType: "json",
								success: function(resultData) {
									if (resultData.code == "success") {
										$(".js_pms-tabletree").html('');
										typeList.getTypelist("0", ".js_pms-tabletree","");
										typeList.getListAll();
									} 
								}
							});
						} else {
							typeList.addTypeList();
							typeList.genreadd(); //初始化添加子部门
							typeList.deleterow(); //初始化删除行
							typeList.queryById(); //查询一条数据positionadd
							typeList.positionadd(); //初始化添加部门职位
							typeList.queryPositionById();
							typeList.deletposition();
							typeList.deptselect();
							typeList.needStat();
						}
					}
				});
			});
		}
		
	}
	
	
	var typeListInit = function() {
		typeList.getTypelist("0", ".js_pms-tabletree","");
		typeList.getListAll();
	}
	return {
		init: typeListInit
	};
})