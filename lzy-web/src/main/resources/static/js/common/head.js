define(['jquery','common','Handlebars','HandlebarExt','cookie'],function($, common,Handlebars,HandlebarExt){
	var head = {
		isAjaxing:false,
		headUser:function(){
			
			User.init();
		},
		menutop:function(){

			$.ajax({
		        type: "get",
		        url: "/my/module/menu",
		        data : {
					//'uid': $.cookie("uid")
				},	
		        async: false,
		     
		        dataType: "json",
		        success: function(resultMap) {
		        	if(resultMap.code==200){
		                var menuTempl = Handlebars.compile($("#head-menutop").html());
		                var _data = resultMap;
		                $("#head-menutop-content").html(menuTempl(_data));
		              
		                head.menuactive();
		        	}
		        	 
		        },
		        error: function(e) {
		            console.log("error");
		        }
		    });
//			
		},		
		menuactive:function(){
			
			
			 var dataparent=$("#head-menu-content .js_menu_left").attr("dataparent");
			$("#head-menutop-content ul li").each(function(){
				var datanname=$(this).attr("datanname");
				if(datanname==dataparent){
					$(this).addClass("active");
				}
			})
		},
		headMenu:function(menuCur){
			//初始
			var length=menuCur.length;
			if(length==9){
				menuCur = {cur1:menuCur,cur2:menuCur+'001',cur3:menuCur+'001001'};
			}
			if(length==12){
				menuCur = {cur1:menuCur.substr(0,9),cur2:menuCur,cur3:menuCur+'001'};
			}
			if(length==15){
				menuCur = {cur1:menuCur.substr(0,9),cur2:menuCur.substr(0,12),cur3:menuCur};
			}
			var menuTop1=menuCur;
			var data= {
				menu: menuCur,
				menuList:[]
			};
		    $.ajax({
				type: "get",
				url: "/my/module/list",
				async: false,
				beforeSend: function() {
					//	 $.blockUI({message: '<img src=\"${base}/js/ajax-loader.gif\" >'});
				},
				complete: function() {
					//	  $.unblockUI();
				},
				dataType: "json",

				success: function(resultMap) {
					if(resultMap.code=200){
						console.log(resultMap);
						data.menuList = resultMap.dataList;
						$("#head-menu-content").html(head.menuLeftHtml(data));

						$('.sideBar li.active').parent().show();
						$('.sideBar li.active').parent().siblings('ul').hide();
						$('.sideBar li.active').parent().siblings('ul').prev('.js_menu_left').addClass("close");
						$(".nosub").removeClass("close");
						//左侧导航展开收起
						$(".js_menu_left").click(function() {
							if($(this).hasClass('close')){
								$('#head-menu-content ul').slideUp();
								$(".js_menu_left").addClass('close');
								$(this).removeClass('close');
								$(this).next('ul').slideDown();
							}
							else{
								$(this).addClass('close');
								$(this).next('ul').slideUp();
							}
						})

					}

				},
				error: function(e) {
					console.log("error");
				}
			});
		 
		},
		menuLeftHtml:function(menuData){
			var html = '',len=menuData.menuList.length;
			for(var i2=0;i2<len;i2++){
				var m2 = menuData.menuList[i2];
				if(m2.parent==menuData.menu.cur1){
					if(m2.url){
						html+='<p class="sideBartit js_menu_left" dataparent="'+m2.dataparentid+'"><a href="${base}/'+m2.url+'"><span class="manaicon '+m2.icon+'"></span>'+m2.name+'</a></p>';
					}
					else{
						html+='<p class="sideBartit nosub js_menu_left" dataparent="'+m2.dataparentid+'"><span class="manaicon '+m2.icon+'"></span>'+m2.name+'</p>';
					}
					html+='<ul class="sideBar js_sideBar">';
					for(var i3=0;i3<len;i3++){
						var m3 = menuData.menuList[i3];
						if(m3.parent==m2.mark){
							if(m3.parent==menuData.menu.cur2){
								if(m3.mark==menuData.menu.cur3){
									html+='<li class="'+m3.mark+' active" ><a href="${base}/'+m3.url+'">'+m3.name+'</a></li>';
								}
								else{
									html+='<li class="'+m3.mark+'" ><a href="${base}/'+m3.url+'">'+m3.name+'</a></li>';
								}
							}
							else{
								html+='<li class="'+m3.mark+'" ><a href="${base}/'+m3.url+'">'+m3.name+'</a></li>';
							}
						}
						
					}
					html+='</ul>';
				}
			}
			return html;
		},
		modfiyPwd:function(){
			$(document).on('click',".modify_pwd",function(){
				var _templ = Handlebars.compile($("#modify-pwd-pop").html());
				$("#setPwd").html(_templ());
				common.base.popUp('.js_set_Pwd');
				$(".js_setPwd_submit").click(function(){
					var checkResult = true;
					if (!common.validate.checkEmpty('#oldPwd', '请输入原密码！')) {
						checkResult = false;
					}
					if (!common.validate.checkEmpty('#newPwd', '请输入新密码！')) {
						checkResult = false;
					}
					if (!common.validate.checkEmpty('#newPwdAgain', '请再次输入新密码！')) {
						checkResult = false;
					}
					if (!checkResult) {
						return false;
					}
					
					$.ajax({
						type: "post",
						url:"/user!setPwd.ajax",
						data:{"passwd":$("#oldPwd").val(),
							"newpasswd":$("#newPwd").val(),
							},
						dataType: "json",
						success:function(resultMap){
							if(resultMap.code=='success'){
								common.base.popUp('',{
					          		type:'tip',
					          		tipTitle:'温馨提示',//标题
									tipMesg:'修改密码成功!',//提示语
									backFn:function(result){
										if(result){
											var expireDate = new Date();
											$.cookie("uid", '', { path: '/', expires: expireDate });
											$.cookie("token",'', { path: '/', expires: expireDate });
											$.cookie("icq",'', { path: '/', expires: expireDate });
											$.cookie("account",'', { path: '/', expires: expireDate });
											$.cookie("projectId", '', { path: '/', expires: expireDate });
											window.location.href='/login.html';
										}
									}
								});
							}else{
								common.base.popUp('',{
					          		type:'tip',
					          		tipTitle:'温馨提示',//标题
									tipMesg:resultMap.description,//提示语
									backFn:function(result){
										if(result){
										}
									}
								});
							}
							
						}
					})
				})
			})
		}
	}
	var User={
		init:function(){
			//初始化
			var _templ = Handlebars.compile($("#head-user").html());
			var data={user:{account:$.cookie("account")}};
			$("#head-user-content").html(_templ(data));
			var obj=$('#head-user-content');
			//退出
			obj.on("click",".js_user_loginOut",function(){
				var expireDate = new Date();
				$.cookie("uid", '', { path: '/', expires: expireDate });
				$.cookie("token",'', { path: '/', expires: expireDate });
				$.cookie("icq",'', { path: '/', expires: expireDate });
				$.cookie("account",'', { path: '/', expires: expireDate });
				$.cookie("projectId", '', { path: '/', expires: expireDate });
				/*
				$.cookie("uid",'');
				$.cookie("token",'');
				$.cookie("icq",'');
				$.cookie("account",'');*/
				window.location.href='/login.html';
			});
			//设置
			obj.on("click",".js_user_setUp",function(e){
				e.stopPropagation()
				$(".js_user_stylebox").toggle();
			});
			
			//风格切换
			obj.on("click",".js_user_styleChange span",function(e){
				  var style = $(this).attr('dataid');
			        $("link[title='"+style+"']").removeAttr("disabled");
			         $("link[title!='"+style+"']").each(function(){
			        	
			        	if($(this).attr('title')!=undefined){
			        		
			        		$(this).attr("disabled","disabled");
			        	}
			         })
			         var expireDate = new Date();
			        
					expireDate.setTime(expireDate.getTime() + (240 * 60 * 60 * 1000));
					$.cookie("changestyleType", style, { path: '/', expires: expireDate });
				
			
			});
			$("body").click(function() {
				$(".js_user_stylebox").hide();
			});
			
		}
	};

	
	
	
	
	var headInit = function(menuStr){
		head.headUser();
		head.headMenu(menuStr);
		head.modfiyPwd();
		head.menutop();
		
		
    };
    
    return{
        init: headInit
    };
	
});