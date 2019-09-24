
 define(['jquery','common','jqueryui','Handlebars','HandlebarExt','diyUpload','timepicker','viewer','main','base64'], function($,common,jqueryui,Handlebars,HandlebarExt,diyUpload,timepicker,viewer,main,base64){

	    var editList ={
	    		//////////////////////////////基本信息/////////////////////////////
			      editform:function(){
			          	$('.clockpicker').clockpicker();
				        
				          	
			          	 
			          //tab切换
			            $(".editboxcon:eq(0)").show().siblings(".editboxcon").hide();
			            $(".editboxbt span.editboxbtline").click(function(){
			                $(this).addClass("active").siblings().removeClass("active");
			                var dataattr=$(this).attr("dataattr");
			                $("#"+dataattr).show().siblings(".editboxcon").hide();
			                if(dataattr=="basicinfo"){
			                	$('#uploadpic').diyUpload({
					          		fileNumLimit:1,
									url:"${(base)!''}/weixin!uploadPic.ajax",
									loadSuccess:function(){
										webUploader.upload();
									},
					               success:function( data ) {
					            	   $(".js_weixin_icon").val(data.picUrl);
					               },
					               error:function( err ) {
					                   console.info( err );
					               }
					           });
			                	
			                }
			                else if(dataattr=="attachedinfo"){
			                	//奖项设置
			                	editList.awardSetList();
			                	
			                	
			                }
			                else if(dataattr="enrollinfo"){
			                	//报名列表
			                	editList.enrollList();
			                	
			                	
			                	
			                }
			                
			            })
			          //设置封面
			           $(".picmaterialcon").on('click','.setcover',function(){
			                  $(".setcover").removeClass("title").html("设为外观");
			                  $(this).addClass("title").html("封面图");
			                  $(".picmaterialcon").prepend($(this).parent(".picinsert"));
			            })
			          //删除图片
			          $("div").on("click",".js_Cancel",function () {
			              var picId = $(this).next().attr('picId');
			              delPics.push(picId);
			              $(this).parents(".picinsert").remove();
			
			          })
			
			       		//拖动排序
			          $( "#sortable" ).sortable();
			          $( "#sortable" ).disableSelection();
			      	$('#uploadpic').diyUpload({
		          		fileNumLimit:1,
						url:"${(base)!''}/weixin!uploadPic.ajax",
						loadSuccess:function(){
							webUploader.upload();
						},
		               success:function( data ) {
		            	   $(".js_weixin_icon").val(data.picUrl);
		               },
		               error:function( err ) {
		                   console.info( err );
		               }
		           });
	          	
			      },

		
			      
			       basicinfoSave:function(){
			    	   $('.js_basicinfo_save').unbind('click');
			    	   $('.js_basicinfo_save').on('click',function(){
			    		   var checkResult = true
			    		    if (!common.validate.checkEmpty('#activityname', '请输入名称！')) {
								checkResult = false;
							}
							
							if (!common.validate.checkEmpty('#introduce', '请输入介绍！')) {
								checkResult = false;
							}
							if (!common.validate.checkEmpty('#partnum', '请输入参与次数！')) {
								checkResult = false;
							}
							/*if(!common.validate.isRadioCheck('attention', '请选择打开方式！')){
								checkResult = false;
							}*/
							if (!common.validate.checkEmpty('#invite', '请输入邀请增加次数！')) {
								checkResult = false;
							}
							if (!common.validate.checkEmpty('#share', '请输入分享增加次数！')) {
								checkResult = false;
							}
							/*if(!common.validate.isRadioCheck('award', '请选择奖品互赠方式！')){
								checkResult = false;
							}*/
							if (!common.validate.checkEmpty('#sharelink', '请输入分享链接！')) {
								checkResult = false;
							}
							if (!common.validate.checkEmpty('#sharebt', '请输入分享标题！')) {
								checkResult = false;
							}
							if (!common.validate.checkEmpty('#sharedescription', '请输入分享描述！')) {
								checkResult = false;
							}
							if (!common.validate.checkEmpty('#activitylink', '请输入活动链接！')) {
								checkResult = false;
							}
							if (!checkResult) {
								return false;
							}
							if(checkResult==true){
								common.base.popUp('',{
					          		type:'choice',
					          		tipTitle:'温馨提示',//标题
									tipMesg:'是否确定保存？',//提示语
									backFn:function(result){
										
										$.ajax({
											url : '${base}/activity!saveOrUpdate.action',
											type : 'POST',
											cache : false,
											data : new FormData($('#submit_form')[0]),
											processData : false,
											contentType : false
										}).done(function(res) {
											if (res.code == "success") {
												common.base.popUp('', {
			                                        type : 'tip',
			                                        tipTitle : '温馨提示',//标题
			                                        tipMesg : "保存成功！",//提示语
			                                        backFn : function(result) {
			                                        }
			                                    });
											
											} else {
												common.base.popUp('', {
			                                        type : 'tip',
			                                        tipTitle : '温馨提示',//标题
			                                        tipMesg : "保存失败！",//提示语
			                                        backFn : function(result) {
			                                        }
			                                    });
												
											}
										}).fail(function(res) {
										});
										
										
									}
								});
							}
			    		   
			    	   })
			    	   $('.loading').remove();  
			       },
			     /////////////////////////////////////奖项设置///////////////////////////////////
			      
			       //查询奖项设置
			     awardSetList:function(){

	                	//奖项列表
	                	$.ajax({
	        				url: "${(base)!''}/prize!queryPrizeList.ajax",
	        				data: {
	        					"activityPrizeVo.activityId": $("#activityId").val()
	        				},
	        				type: 'post',
	        				dataType: "json",
	        				beforeSend: function() {
	        					$('#attachedinfo').append('<div class="loading" style="display:block;">&nbsp;</div>')
	        				},
	        				success: function(resultData) {
	        					if (resultData.code == "success") {
	        						console.log(resultData);
	        						var _templ = Handlebars.compile($("#attachedinfo-list").html());
	        						$("#attachedinfo").html(_templ(resultData));
	        						editList.addAward();
	        						editList.saveAddaward();
	        					}else {
	        						if (resultData && resultData.description) {
	        							common.base.popUp('', {
	        								type: 'choice',
	        								tipTitle: '温馨提示',
	        								tipMesg: resultData.description,
	        								backFn: function(result) {}
	        							});
	        						}
	        					}
	        					$('.loading').remove()
	        				},
	        				error: function(resultData) {
	        					common.base.popUp('', {
	        						type: 'choice',
	        						tipTitle: '温馨提示',
	        						tipMesg: '操作异常',
	        						backFn: function(result) {}
	        					});
	        				}
	        			});
	                	
	                	
	                
			    	 
			     },
			       
			      
			       
			     //删除行
			     deleteAward:function(){
			    	 $('.js_delete_row').unbind("click");
			    	 $('.tablebox').on('click',".js_delete_row",function(){
			    		 
			    		 var id = $(this).attr('dataId');
							common.base.popUp('',{
				          		type:'choice',
				          		tipTitle:'温馨提示',//标题
								tipMesg:'是否确定删除？',//提示语
								backFn:function(result){
									if(result){
										$.ajax({
											url : '${base}/prize!changePrizeStatus.ajax',
											type : 'POST',
											cache : false,
											data :{"activityPrizeVo.id":id,"activityPrizeVo.status":"close"}
										}).done(function(res) {
											if (res.code == "success") {
												common.base.popUp('', {
			                                        type : 'tip',
			                                        tipTitle : '温馨提示',//标题
			                                        tipMesg : "保存成功！",//提示语
			                                        backFn : function(result) {
			                                        	editList.awardSetList();
			                                        }
			                                    });
											} else {
												alert("fail");
												
											}
										}).fail(function(res) {
										});
										
									}
								}
							});
						});
			     },
			     //新增奖品
			     addAward:function(){
			    	 
			    	 
			    	 $('.js_add_award').unbind('click');
			    	 $('.js_add_award').on('click',function(){
			    		 var html='<tr>'+
							'<td></td>'+
							'<td><input type="text" name="activityPrizeVo.name" class="forminputstyle4"/></td>'+
							'<td><input type="text" name="activityPrizeVo.prizeId" class="forminputstyle4"/></td>'+
							'<td><input type="text" name="activityPrizeVo.totalNum" class="forminputstyle4"/></td>'+
							'<td><input type="text" name="activityPrizeVo.freeNum" class="forminputstyle4"/></td>'+
							'<td><input type="text" name="activityPrizeVo.winRate" class="forminputstyle4"/></td>'+
							'<td></td>'+
							'<td><a href="javascript:;" class="js_delete_row">删除</a></td>'+
						'</tr>';
			    		 $('#awardList').append(html);
			    	 })
			     },
			     saveAddaward:function(){
			    	 $('.js_save_award').unbind('click');
			    	 $('.js_save_award').on('click',function(){
			    		 common.base.popUp('',{
				          		type:'choice',
				          		tipTitle:'温馨提示',//标题
								tipMesg:'是否确定保存？',//提示语
								backFn:function(result){
									if(result){
										var activityId=$("#activityId").val();
										var data = [];
//										
										$('#awardList tr').each(function(){
											var name=$(this).find('input[name="activityPrizeVo.name"]').val(),
											 prizeId=$(this).find('input[name="activityPrizeVo.prizeId"]').val(),
											 totalNum=$(this).find('input[name="activityPrizeVo.totalNum"]').val(),
											 freeNum=$(this).find('input[name="activityPrizeVo.freeNum"]').val(),
											 winRate=$(this).find('input[name="activityPrizeVo.winRate"]').val(),
											obj = {
												activityId:activityId,
												name    : name,
												prizeId : prizeId,
												totalNum: totalNum,
												freeNum : freeNum,
												winRate : winRate
											};
											data.push(obj);
											console.info(data);
										})
										 var dataJson = JSON.stringify(data); 
										 
										 var fd=new FormData($('#submit_award_form')[0]);
									        fd.append("dataJson",dataJson);
									
										$.ajax({
											url : '${base}/prize!saveBatchPrize.ajax',
											type : 'POST',
											cache : false,
											data :fd,
											processData : false,
											contentType : false
										}).done(function(res) {
											if (res.code == "success") {
												common.base.popUp('', {
			                                        type : 'tip',
			                                        tipTitle : '温馨提示',//标题
			                                        tipMesg : "保存成功！",//提示语
			                                        backFn : function(result) {
			                                        	editList.awardSetList();
			                                        }
			                                    });
											} else {
												alert("fail");
												
											}
										}).fail(function(res) {
										});
											
									}
								}
							});
			    	 })
			     },
			     
			     //刷新规则
			     refreshAward:function(){			    	 
			    	 $('.js_refresh_award').unbind('click');
			    	 $('.js_refresh_award').on('click',function(){
			    		 editList.awardSetList();
			    		 
			    	 })
			    	 
			     },
			     
			     
			     dataTotal:function(){
			    	 $('.js_check_datatotal').unbind('click');
			    	 $('.js_check_datatotal').on('click',function(){
			    		 var _templ = Handlebars.compile($("#checkinfo-save").html());
                         $("#checkinfo-content").html(_templ());
                         common.base.popUp(".js_popopUpcheckinfo");
			    	 })
			     },
			     //中奖列表
			     awardList:function(){
			    	 $('.js_award_List').unbind('click');
			    	 $('.js_award_List').on('click',function(){alert("xxx");
			    		 $('.editboxbtline[dataattr="awardinfo"]').trigger('click');
			    	 })
			     },
			     /////////////////////////////////////报名列表///////////////////////////////////
			     
			     //查询报名列表
			     enrollList:function(){

	                	//报名列表
	                	$.ajax({
	        				url: "${(base)!''}/person!queryPersonList.ajax",
	        				data: {
	        					"activityPersonVo.activityId": $("#activityId").val()
	        				},
	        				type: 'post',
	        				dataType: "json",
	        				beforeSend: function() {
	        					$('#enrollinfo').append('<div class="loading" style="display:block;">&nbsp;</div>')
	        				},
	        				success: function(resultData) {
	        					if (resultData.code == "success") {
	        						var _templ = Handlebars.compile($("#enrollinfo-list").html());
	        						$("#enrollinfo").html(_templ(resultData));
	        						editList.addEnroll();
	        						editList.batchDel();//报名列表批量删除
	        						editList.enrollListcheck();
	        						editList.refreshEnroll();
	        						
	        					}else {
	        						if (resultData && resultData.description) {
	        							common.base.popUp('', {
	        								type: 'choice',
	        								tipTitle: '温馨提示',
	        								tipMesg: resultData.description,
	        								backFn: function(result) {}
	        							});
	        						}
	        					}
	        					$('.loading').remove()
	        				},
	        				error: function(resultData) {
	        					common.base.popUp('', {
	        						type: 'choice',
	        						tipTitle: '温馨提示',
	        						tipMesg: '操作异常',
	        						backFn: function(result) {}
	        					});
	        				}
	        			});
	                	
	                	
	                
			    	 
			     },
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     enrollListcheck:function(){
			    	 $('.js_check_all').unbind("click");
			         /*列表全选反选*/
			         $(".js_check_all").click(function(){

			         if($(this).attr("checked")){
			           $(".js_check_row").prop("checked",false);
			           $(this).attr("checked",false);
			         }
			         else{
			           $(".js_check_row").prop("checked",true);
			           $(this).attr("checked",true);
			         }
			         })
			     },
			     //批量删除
			        batchDel:function () {
			            $(".js_delBtn").unbind("click");
			            $(".js_delBtn").on("click",function(){
			                var rowchecked=$(".js_check_row:checked");
			                if(rowchecked.length=='0'){
			                    common.base.popUp('', {
			                        type : 'tip',
			                        tipTitle : '温馨提示',//标题
			                        tipMesg : "请选定要删除的行！",//提示语
			                        backFn : function(result) {
			                            //
			                        }
			                    });

			                }
			                else{
			                    common.base.popUp('', {
			                        type : 'choice',
			                        tipTitle : '温馨提示',//标题
			                        tipMesg : '是否确定删除选定行？',//提示语
			                        backFn : function(result) {
			                            if(result){
			                            	var data = [];
			                                rowchecked.each(function() {
			                                	data.push($(this).val())
			                                	 //$(this).parents('tr').remove();
			                                });
			                                
			                                $.ajax({
												url: "${(base)!''}/person!changeStatus.ajax",
												data:  {"ids":data.toString(),"status":"delete"},
												type: 'post',
												dataType: "json",
												success: function(resultData) {
													if(resultData.code == "success") {
														common.base.popUp('',{
											          		type:'tip',
											          		tipTitle:'温馨提示',//标题
															tipMesg:"删除成功",//提示语
															backFn:function(result){
																//alert(result);
															}
														});
														//新增完成刷新列表
														editList.enrollList();
													}
													else{
												         if(resultData && resultData.description){
												             common.base.popUp('',{
												          		type:'tip',
												          		tipTitle:'温馨提示',//标题
																tipMesg:resultData.description,//提示语
																backFn:function(result){
																	//alert(result);
																}
															});
												         }
													}
													$('.loading').remove()
												},
												error: function(resultData) {
													common.base.popUp('', {
														type: 'choice',
														tipTitle: '温馨提示',
														tipMesg: '操作异常',
														backFn: function(result) {}
													});
												}
											});
			                                
			                            }
			                        }
			                    });

			                }

			            })
			        },
			        //删除行
				     deleteenRoll:function(){
				    	 $('.js_delete_row').unbind("click");
				    	 $('.tablebox').on('click',".js_delete_enrollrow",function(){
								var id = $(this).attr('dataId');
								
								common.base.popUp('',{
					          		type:'choice',
					          		tipTitle:'温馨提示',//标题
									tipMesg:'是否确定删除？',//提示语
									backFn:function(result){
										if(result){
											alert(Id);
											common.base.popUp('', {
		                                        type : 'tip',
		                                        tipTitle : '温馨提示',//标题
		                                        tipMesg : "删除成功！",//提示语
		                                        backFn : function(result) {
		                                        }
		                                    });
										}
									}
								});
							});
				     },
				     //添加报名
				     addEnroll:function(){
				    	 $('.js_add_enroll').unbind('click');
				    	 $('.js_add_enroll').on('click',function(){
				    		 var _templ = Handlebars.compile($("#addenroll-save").html());
	                         $("#addenroll-save-content").html(_templ());
	                         common.base.popUp(".js_popUpaddenroll");
	                         editList.UploadPic();//上传图片
	                         editList.saveEnroll();
				    	 })
				     },
				     //编辑报名
				     editEnroll:function(){
				    	 $('.js_edit_enroll').unbind('click');
				    	 $('.js_edit_enroll').on('click',function(){
				    		 var _templ = Handlebars.compile($("#addenroll-save").html());
	                         $("#addenroll-save-content").html(_templ());
	                         common.base.popUp(".js_popUpaddenroll");
	                         $('.popup_bt span').html('编辑报名');
	                         editList.UploadPic();//上传图片
				    	 })
				     },
				    //上传图片
				     UploadPic:function(){
				    	 $('#uploadenrollpic').diyUpload({
				          		fileNumLimit:1,
								url:"${(base)!''}/weixin!uploadPic.ajax",
								loadSuccess:function(){
									webUploader.upload();
								},
				               success:function( data ) {
				            	   $(".js_enroll_icon").val(data.picUrl);
				               },
				               error:function( err ) {
				                   console.info( err );
				               }
				           });
				     },
				     
				    refreshEnroll:function(){
				    	$('.js_refresh_enroll').unbind('click');
				    	 $('.js_refresh_enroll').on('click',function(){
				    		 editList.enrollList();
				    	 })
				    	 
				     },
				     
				  saveEnroll:function(){

						$('.js_popUpSubmit').unbind('click');
						$('.js_popUpSubmit').on('click',function(){
							var checkResult = true;
							if ($('.comminputstyle1').val()=='') {
								$('.comminputstyle1').addClass('errorborder');
								checkResult = false;
							}
							
							if (!checkResult) {
								return false;
							}
							if(checkResult==true){
								$.ajax({
									url: "${(base)!''}/person!saveOrUpdate.ajax",
									data:  new FormData($('#enroll_form')[0]),
									processData : false,
									contentType : false,
									type: 'post',
									dataType: "json",
									success: function(resultData) {
										if(resultData.code == "success") {
											common.base.popUp('',{
								          		type:'tip',
								          		tipTitle:'温馨提示',//标题
												tipMesg:"保存成功",//提示语
												backFn:function(result){
													//alert(result);
												}
											});
											$('.js_popUpaddenroll').fadeOut();
											//新增完成刷新列表
											editList.enrollList();
										}
										else{
									         if(resultData && resultData.description){
									             common.base.popUp('',{
									          		type:'tip',
									          		tipTitle:'温馨提示',//标题
													tipMesg:resultData.description,//提示语
													backFn:function(result){
														//alert(result);
													}
												});
									         }
										}
										$('.loading').remove()
									},
									error: function(resultData) {
										common.base.popUp('', {
											type: 'choice',
											tipTitle: '温馨提示',
											tipMesg: '操作异常',
											backFn: function(result) {}
										});
									}
								});
							}
						})
					
				  }   
				     
				     
				
			     
		};
	    
		 
	   var editListInit=function(){
		   editList.editform();//基本信息展示
		   editList.basicinfoSave();//基本信息保存
		   editList.deleteAward();//奖项设置列表删除
		   editList.addAward();//奖项设置新增奖品
		   editList.dataTotal();//奖项设置数据统计
		   editList.saveAddaward();//保存新增奖品
		   editList.awardList();//奖项设置中奖列表
		   editList.deleteenRoll();//报名列表删除
		   editList.editEnroll();//报名列表编辑报名
		   
	   }

		return {
	        init:editListInit
	    };
	})