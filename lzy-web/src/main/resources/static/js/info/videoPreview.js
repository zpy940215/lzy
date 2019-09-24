var parameter = base.getUrlParameter();
window.parameter = parameter;
var base64 = new base.Base64();
var ajaxpar = new Array();
window.ajaxpar=ajaxpar;
ajaxpar['isajaxing']=false;//是否正在请求数据  false情况下可以请求  
ajaxpar['page']=1;//当前页
ajaxpar['pagenum']=100;//每页显示数量
ajaxpar['islastpage']=false;//是否最后一页

var infodemo={
		detail:function(){
			var dataget=new Object();
				dataget['articleVo.articleId'] = parameter.id;
				$.ajax({
					type:"POST",
					url:ajaxIndexUrl+'/article!queryByViewTypeId.ajax', 
					data:dataget,
					dataType:"json",
					async:false,
					beforeSend:function(){
						//$("body").append('<div class="loadding"><img src="${base}/images/loading.gif"/></div>');
					},
					success:function(data){
						if(data.code=="success"){
							$("body .loadding").remove();
							var info=data.data.articleVo;
							if(info.status=='delete'){
								$('.js_detail').html('<div class="nodata">抱歉，该文章已被删除！</div>');
								return false;
							}
							var html='';
							html+='<div class="picimg imgbox">'+
								'<img class="imgzwf" src="${base}/images/zwf.png"/>'+
								'<iframe  width="100%" height="100%" src="'+info.url+'"  class="js_video imgshow"   frameborder="0" "allowfullscreen"></iframe>'+
							'</div>'+
							'<div class="title js_title">'+info.subject+'</div>'+
							'<div class="intro clear">'+
								'<span class="datetime fl"><i class="icon clockicon"></i>'+doc.formatDate(new Date(info.articleExtVo.createDate))+'</span>'+
								'<span class="scaninfo fr"><i class="icon scanicon"></i><span class="js_viewNum">'+(info.viewNum)*3+'</span></span>'+
							'</div>'+
							'<div class="detailcon js_detailcon">'+base64.decode(info.articleExtVo.content)+'</div>'+
							'<div class="piccon">'+
									'<div class="picimg imgbox">'+
									'<img class="imgzwf" src="${base}/images/zwf.png"/>'+
									'<img class="imgzwf" src="${base}/images/zwf.png"/>'+
							'</div>';
							$('.conbox').css('overflow-y','hidden');
							$('.js_detail').html(html);
							$('.js_categoryIds').val(info.categoryIds);
							$('.js_title').val(data.data.articleVo.subject);
							$('.js_imgurl').val(ajaxImgUrl+data.data.articleVo.icon);
						}
					},
					error:function(e){						
						$("body .loadding").remove();
					}
				});
			},
	
	wordsel:function(){//选择文字大小
		var changestyle=$.cookie("changestyleType");
		$('.js_detail').addClass(changestyle);
		$('.js_word').on('click',function(){
			$('.bg').show();
	    	$('.wordbox').slideDown();
		})
		$('.bg').on('click',function(){
			$('.bg').hide();
	    	$('.wordbox').slideUp();
		});
		//风格切换
		$('body').on("click",".js_wordchange li",function(){
			  var style = $(this).attr('dataid');
			  $('.js_detail').removeClass('middleword');
			  $('.js_detail').removeClass('bigword');
			  $('.js_detail').removeClass('smallword');
			  $('.js_detail').addClass(style);
			  var expireDate = new Date();
			  expireDate.setTime(expireDate.getTime() + (240 * 60 * 60 * 1000));
			  $.cookie("changestyleType", style, { path: '/', expires: expireDate });
			  $('.bg').hide();
			  $('.wordbox').slideUp();
		});
	},
	
	qrCode:function(){
		// 设置参数方式
		$("#qrcode").qrcode({
			width: 180, //宽度
			height:180, //高度
			text:'http://osmnewapp.teemax.com.cn/info/videoPreview.html?id='+parameter.id+'&categoryId='+parameter.categoryId+'' //任意内容
		});
	}
	
};
var infoInit=function(){
	infodemo.detail();//详情
	infodemo.wordsel();//选择文字大小
	infodemo.qrCode();
};
infoInit();
