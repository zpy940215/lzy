define(['jquery','cookie'],function($){
	var login = {
		/**
		 * 初始化 
		 */ 
		load:function(){
			$(".remPsw i").click(function(){
			        $(this).toggleClass('yes');
			});
			$(".sameLine input").focus(function(){
				 	$(this).addClass("borderStyle"); 
			});
			$(".sameLine input").blur(function(){
			    $(this).removeClass("borderStyle"); 
			});


			if($.cookie("passwd")!=''){
				$('#rememberPwd').attr("checked",true);
				$('#passwd').val($.cookie("passwd"));
				console.log($.cookie("passwd"));
			}
		},
		/**
		 * 验证登陆
		 */
		dologin:function(){
				var flag = false;
				var account=$("#account").val();
			    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				if (account == null || account == undefined || account == "" ){
					$(".errortip").html('请输入正确的账号').show();
					return false;
				}
			     // if(!myreg.test(account)){
			     //  $(".errortip").html('请输入正确的账号').show();
			     //  return false;
			     // }
			     else{
			       $(".errortip").hide();
			       flag=true;
			     }
			   var pwd=$("#passwd").val();
			   if(pwd==''){
			      $(".errortip").html('密码不正确').show();
			      return false;
			    }
			   else{
			      $(".errortip").hide();
			        //$("#passwd").siblings(".tip").html('<i class="icon tipicon"></i>').removeClass('error');
			        flag=true;
			    } 
				if(flag==true){
					var expireDate = new Date();
					$.cookie("uid", '', { path: '/', expires: expireDate });
					$.cookie("token",'', { path: '/', expires: expireDate });
					$.cookie("icq",'', { path: '/', expires: expireDate });
					$.cookie("account",'', { path: '/', expires: expireDate });
					$.cookie("projectId", '', { path: '/', expires: expireDate });
					//window.location.href="index.html";
					var account = $('#account').val();
					var passwd = $('#passwd').val();
					var persistent = '';
					if($("#rememberPwd").prop('checked') == true) {
						persistent = $("#rememberPwd").val();
					}
					$.ajax( {
						type : "post",
						url : "${base}/user!doLogin.ajax",
						data : {
							'account': account, 'passwd': passwd,'persistent': persistent  ,'random':parseInt(Math.random()*100000)
						},	
						dataType: "json",
						success : function(resultMap) {
						    if(resultMap.code == "success"){
							     var uid = resultMap.uid;
								 var token = resultMap.token;
								 var icq = resultMap.icq;
								 var expireDate = new Date();
								 expireDate.setTime(expireDate.getTime() + (  8 * 60 * 60 * 1000));
								 $.cookie("uid", uid, { path: '/', expires: expireDate });
								 $.cookie("token",token, { path: '/', expires: expireDate });
								 $.cookie("icq",icq, { path: '/', expires: expireDate });
								console.log(account);
								 $.cookie("account",account, { path: '/', expires: expireDate });
								 $.cookie("passwd",passwd, { path: '/', expires: expireDate });
//							     window.location.href='${base}/index/index.html';
									$.ajax({
								        type: "post",
								        url: "${base}/module!queryModuleByParams.ajax",
								        data : {
											'uid': $.cookie("uid")
										},	
								        async: false,
								     
								        dataType: "json",
								        success: function(resultMap) {
								        	if(resultMap.code=="success"){
								        		var url = resultMap.dataList.data[0].url;
								        		window.location.href='${base}/'+url;
								            
								        	}
								        	 
								        },
								        error: function(e) {
								            alert("error");
								        }
								    });
								 return;
							}else{
								if(resultMap && resultMap.description){
						             alert(resultMap.description);
						         }else if(resultMap && typeof(resultMap) == 'string' ){
						             alert(resultMap);
						         }else{
						             alert("出错了,请重试!");
						         }
							}
						},
						error :function(e){
						}
					});
				}
		}
	}
	
	var indexInit = function(){
		login.load();	
		$("#login_btn").click(function(){
			login.dologin();	
		});
		$(document).keyup(function(event){
			if(event.keyCode ==13){
				login.dologin();
			} 
		}); 
    };
    
    return{
        init: indexInit
    };
	
});