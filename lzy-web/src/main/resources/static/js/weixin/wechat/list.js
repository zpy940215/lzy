define(['jquery','common','jqueryui','Handlebars','HandlebarExt','diyUpload','base64'], function($,common,jqueryui,Handlebars,HandlebarExt,diyUpload,base64){
	var weixinList={
		pageSize:10,//每页显示数量
		pageTotal:1,//总页数
		pageCur:1,//当前页
		total:1,//总条数
		isAjaxing:false,
		weixinList:function(){
			var keyword = $(".js_search_keywords").val();
		    var weixinType = $(".js_search_type").find("option:checked").attr("value");
			$.ajax({
				url: "${(base)!''}/weixin!queryListPage.ajax",
				data: {
					"pageObject.page": weixinList.pageCur,
					"pageObject.pagesize": weixinList.pageSize,
					"weixinVo.name": keyword,
					"weixinVo.type": weixinType
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					$('#weixin-list-content').append('<div class="loading" style="display:block;">&nbsp;</div>')
				},
				success: function(resultData) {
					if (resultData.code == "success") {
						console.log(resultData.data);
						var _templ = Handlebars.compile($("#weixin-list").html());
						$("#weixin-list-content").html(_templ(resultData.data));
						weixinList.pageTotal = resultData.data.pagetotal;
						weixinList.total = resultData.data.total;
						weixinList.dataList = resultData.data.dataList;
						common.base.createPage('.pageDiv', {
							pageCur: weixinList.pageCur,
							pageTotal: weixinList.pageTotal,
							total: weixinList.total,
							backFn: function(p) {
								weixinList.pageCur = p;
								weixinList.weixinList()
							}
						});
						weixinList.addWeixin();
						weixinList.deleteRow();
						weixinList.checkbox();
						weixinList.editWinxin();
						
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
					weixinList.isAjaxing = false;
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
		queryByWeixinId:function(weixinId){
			var returnData;
			$.ajax({
				url: '${base}/weixin!queryByWeixinId.ajax',
				data: {
				    "weixinVo.weixinId":weixinId
				},  
				type:'post',
				dataType: "json",
				async:false,//设置同步请求
				beforeSend:function(){
					$('#weixin-list-content').append('<div class="loading" style="display:block;">&nbsp;</div>');
				},
				success: function(resultData) {
					 $('.loading').hide();
					 returnData = resultData;
				},
				error: function(resultData) {
					returnData=resultData;
					common.base.popUp('',{
		          		type:'choice',
		          		tipTitle:'温馨提示',//标题
						tipMesg:'操作异常',//提示语
						backFn:function(result){
							//alert(result);
						}
					});
				}
			});
			return returnData;
		},
		weixinDoDelete:function(Id,status){
			if(weixinList.isAjaxing)return false;
            weixinList.isAjaxing=true;
            if(!Id){
            	weixinList.isAjaxing=false;
                return false;
            }
			//ajax删除公众号
            $.ajax({
	                url: '${base}/weixin!delete.ajax',
	                data: {
	                    'weixinVo.id':Id,
	                    'weixinVo.status':status 
	                },
	                type:'post',
	                dataType: "json",
	                beforeSend:function(){
	                    $('#weixin-list-content').append('<div class="loading" style="display:block;">&nbsp;</div>');
	                },
	                success: function(resultData) {
	                	weixinList.isAjaxing=false;
	                    if(resultData.code == "success") {
	                        common.base.popUp('',{
	                            type:'tip',
	                            tipTitle:'温馨提示',//标题
	                            tipMesg:"删除成功!",//提示语
	                            backFn:function(result){
	                            	//删除完成刷新当前列表
	                                weixinList.weixinList();
	                            }
	                        });
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
	                    $('.loading').remove();
	                },
	                error: function(resultData) {
	                	article.isAjaxing=false;
	                    common.base.popUp('',{
	                        type:'choice',
	                        tipTitle:'温馨提示',//标题
	                        tipMesg:'操作异常',//提示语
	                        backFn:function(result){
	                            //alert(result);
	                        }
	                    });
	                }
	            });
		},
		//删除行
		deleteRow:function(){
			$('.js_delete_row').unbind("click");
			$(".js_delete_row").click(function(){
				var Id = $(this).attr('dataId');
				common.base.popUp('',{
					type:'choice',
					tipTitle:'温馨提示', //标题
					tipMesg:'是否确定删除选中数据？',//提示语
					backFn:function(result){
						if(result){
							weixinList.weixinDoDelete(Id,"close");
						}
					}
				});
			});
		},
		checkbox:function(){
			/*列表全选反选*/
			$('.js_check_all').unbind("click");
			$(".js_check_all").click(function(){
				if($(this).attr("checked")){
					$(".js_check_row").prop("checked",false);
					$(this).attr("checked",false);
				}
				else{
					$(".js_check_row").prop("checked",true);
					$(this).attr("checked",true);
				}
			});
		},
		//添加公众号
		addWeixin:function(){
			$('.js_add_weixin').unbind('click');
			$('.js_add_weixin').on('click',function(){
				var _templ = Handlebars.compile($("#addweixin-save").html());
				$("#addweixin-save-content").html(_templ());
				common.base.popUp('.js_popUpaddweixin');
				weixinList.copylink();
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
				weixinList.weixinSave();
			});
		},
		//编辑公众号
		editWinxin:function(){
			$('.js_edit_weixin').unbind('click');
			$('.js_edit_weixin').on('click',function(){
				var weixinId = $(this).attr('dataId');
				var weixinData = weixinList.queryByWeixinId(weixinId);
				var _templ = Handlebars.compile($("#addweixin-save").html());
				$("#addweixin-save-content").html(_templ(weixinData.data.weixinVo));
				common.base.popUp('.js_popUpaddweixin');
				$('.popup_box .popup_bt span').text('编辑公众号');
				weixinList.copylink();
				weixinList.weixinSave();
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
			});
		},
		doSearch:function(){
			$('#js_doSearch').unbind('click');
			$("#js_doSearch").click(function(){
				weixinList.pageTotal=1;
				weixinList.pageCur=1;
				weixinList.total=1;
				weixinList.weixinList();
			});
		},
		copylink:function(){
			$('.js_copy_link').unbind('click');
			$(".js_copy_link").click(function(){
				var articleId = $(this).attr("articleId");
				var Url2=$(this).siblings(".js_article_url"+articleId);
				Url2.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				$(".copysucc").show().fadeOut(1000);
			});
		},
		weixinSave:function(){
			$('.js_popUpSubmit').unbind('click');
			$('.js_popUpSubmit').on('click',function(){
				var checkResult = true;
				if ($('.js_weixin_name').val()=='') {
					$('.js_weixin_name').addClass('errorborder');
					checkResult = false;
				}
				if($('.js_weixin_wechatid').val()==''){
					$('.js_weixin_wechatid').addClass('errorborder');
					checkResult = false;
				}
				if($('.js_weixin_appId').val()==''){
					$('.js_weixin_appId').addClass('errorborder');
					checkResult = false;
				}
				if($('.js_weixin_appSecret').val()==''){
					$('.js_weixin_appSecret').addClass('errorborder');
					checkResult = false;
				}
				if (!checkResult) {
					return false;
				}
				if(checkResult==true){
					$.ajax({
						url: "${(base)!''}/weixin!save.ajax",
						data:  new FormData($('#submit_weixinEditform')[0]),
						processData : false,
						contentType : false,
						type: 'post',
						dataType: "json",
						beforeSend: function() {
							$('#weixin-list-content').append('<div class="loading" style="display:block;">&nbsp;</div>')
						},
						success: function(resultData) {
							weixinList.isAjaxing=false;
							if(resultData.code == "success") {
								var tipmesg = '信息提交成功！';
								if(resultData.data.weixinVo)tipmesg='信息提交成功!';
								common.base.popUp('',{
					          		type:'tip',
					          		tipTitle:'温馨提示',//标题
									tipMesg:tipmesg,//提示语
									backFn:function(result){
										//alert(result);
									}
								});
								$('.js_popUpaddweixin').fadeOut();
								//新增完成刷新列表
							 	weixinList.pageCur=1;
								weixinList.weixinList();
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
							weixinList.isAjaxing = false;
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
	}	
	
	var weixinListInit=function(){
		weixinList.doSearch();
		weixinList.weixinList();
		weixinList.editWinxin();
		weixinList.deleteRow();
		$(".loading").remove();
	}
	return {
        init:weixinListInit
    };
})