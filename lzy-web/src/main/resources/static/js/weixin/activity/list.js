define(['jquery','common','jqueryui','Handlebars','HandlebarExt','diyUpload','base64'], function($,common,jqueryui,Handlebars,HandlebarExt,diyUpload,base64){
	var weixinList={
		pageSize:10,//每页显示数量
		pageTotal:1,//总页数
		pageCur:1,//当前页
		total:1,//总条数
		isAjaxing:false,
		siteId:"",
		categoryId:"",
		weixinList:function(){
			var wxname = $("#wxname").val();
		    var activityName = $("#activityName").val();
			$.ajax({
				url: "${(base)!''}/activity!queryListPage.ajax",
				data: {
					"pageObject.page": weixinList.pageCur,
					"pageObject.pagesize": weixinList.pageSize,
					"activityVo.wxname": wxname,
					"activityVo.name": activityName
				},
				type: 'post',
				dataType: "json",
				beforeSend: function() {
					$('#activity-list-content').append('<div class="loading" style="display:block;">&nbsp;</div>')
				},
				success: function(resultData) {
					if (resultData.code == "success") {
						var _templ = Handlebars.compile($("#activity-list").html());
						$("#activity-list-content").html(_templ(resultData.data));
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
		
		doSearch:function(){
			$('#js_doSearch').unbind('click');
			$("#js_doSearch").click(function(){
				weixinList.pageTotal=1;
				weixinList.pageCur=1;
				weixinList.total=1;
				weixinList.weixinList();
			});
		},
		weixinSave:function(id,isRecomment){
			
		},
		weixinDoDelete:function(Id,status){
			if(weixinList.isAjaxing)return false;
            weixinList.isAjaxing=true;
            if(!Id){
            	weixinList.isAjaxing=false;
                return false;
            }
			//ajax删除公众号
		},
		//删除行
		deleteRow:function(){
			$('.info_row_delete').unbind("click");
			$(".info_row_delete").click(function(){
				var Id = $(this).attr('dataId');
				common.base.popUp('',{
					type:'choice',
					tipTitle:'温馨提示', //标题
					tipMesg:'是否确定删除选中数据？',//提示语
					backFn:function(result){
						if(result){
							weixinList.weixinDoDelete(Id,"delete");
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
	                    success:function( data ) {
	                       
	                    },
	                    error:function( err ) {
	                        console.info( err );
	                    }
	                });
	                weixinList.weixinSave();
			})
		},
		//编辑公众号
		editWinxin:function(){
			$('.js_edit_weixin').unbind('click');
			$('.js_edit_weixin').on('click',function(){
				
				  var _templ = Handlebars.compile($("#addweixin-save").html());
	                $("#addweixin-save-content").html(_templ());
	                common.base.popUp('.js_popUpaddweixin');
	                $('.popup_box .popup_bt span').text('编辑公众号');
	                weixinList.copylink();
	                $('#uploadpic').diyUpload({
	                    fileNumLimit:1,
	                    success:function( data ) {
	                       
	                    },
	                    error:function( err ) {
	                        console.info( err );
	                    }
	                });
	                weixinList.weixinSave();
			})
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
				if($('.js_weixin_num').val()==''){
					$('.js_weixin_num').addClass('errorborder');
					checkResult = false;
				}
				if($('.js_weixin_AppId').val()==''){
					$('.js_weixin_AppId').addClass('errorborder');
					checkResult = false;
				}
				if($('.js_weixin_AppSecret').val()==''){
					$('.js_weixin_AppSecret').addClass('errorborder');
					checkResult = false;
				}
				if(!common.validate.isRadioCheck('controltoken', '请选择是否可控token！')){
					
					checkResult = false;
				}
				if(!common.validate.isRadioCheck('opentoken', '请选择是否开放token！')){
					checkResult = false;
				}
				if (!checkResult) {
					return false;
				}
				if(checkResult==true){
					//ajax
				}
			})
		}
	}	
	
	var weixinListInit=function(){
		 weixinList.weixinList();
		 weixinList.doSearch();
		 weixinList.editWinxin();
		 weixinList.deleteRow();
		 weixinList.addWeixin();
		
		$(".loading").remove();
	}
	return {
        init:weixinListInit
    };
})