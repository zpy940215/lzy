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
	dataDetail:function(){
		var dataget=new Object();
		dataget['articleVo.articleId'] =parameter.id;
		$.ajax({
			type:"POST",
			url:ajaxIndexUrl+'/article!queryByViewTypeId.ajax',
			data:dataget,
			dataType:"json",
			async:false,
			beforeSend:function(){
				//$("body").append('<div class="loadding"><img src="../../images/loading.gif"/></div>');
			},
			success:function(data){
				if(data.code=="success"){
					$("body .loadding").remove();
					if(data.data.articleVo.status=='delete'){
						$(".js_imgshow").html('<div class="nodata">抱歉，该文章已被删除！</div>');
						return false;
					}
					var len=data.data.articleVo.picList.length;
					//$('.js_title').html(data.data.articleVo.subject);
					$('.js_intro').html(base64.decode(data.data.articleVo.articleExtVo.content));
					$('.js_imgurl').val(ajaxImgUrl+data.data.articleVo.icon);
					$('.js_title').val(data.data.articleVo.subject);
					var picInfo=[];
					var imglength=$('.js_intro img').length;
					for(var j=0;j<$('.js_intro p').length;j++){
						if($('.js_intro p').eq(j).text()!=''){
							picInfo.push($('.js_intro p').eq(j).text());
						}
					}
					for(var i=0;i<imglength;i++){
						var html="";
						var thissrc=$('.js_intro img').eq(i).attr('src');
						var thislink=$('.js_intro img').eq(i).parent('a').attr('onclick');
						
						html='<div class="swiper-slide ">';
								if(thislink!='' && thislink!=undefined){
									html+='<a href="javascript:;" onclick='+thislink+'>'+
											'<div class="imgcon">'+
											'<img class="imgzwf" src="${base}/images/zwf.png"/>'+
											'<img class="bannerpic imgshow" src='+thissrc+' />'+
											'</div>';
											if(picInfo[i]!='' && picInfo[i]!=undefined){
												html+='<div class="picInfo"><div class="swiper-pagination"></div>'+picInfo[i]+'</div>';
											}
											else{
												html+='<div class="picInfo"><div class="swiper-pagination"></div>'+data.data.articleVo.subject+'</div>';
											}
										html+='</a>';
								}
								else{
									html+='<div class="imgcon">'+
									'<img class="imgzwf" src="${base}/images/zwf.png"/>'+
									'<img class="bannerpic imgshow" src='+thissrc+' />'+
									'</div>';
									if(picInfo[i]!='' && picInfo[i]!=undefined){
										html+='<div class="picInfo"><div class="swiper-pagination"></div>'+picInfo[i]+'</div>';
									}
									else{
										html+='<div class="picInfo"><div class="swiper-pagination"></div>'+data.data.articleVo.subject+'</div>';
									}
									
								}
								html+='</div>';
						$(".js_imgshow").append(html);
						
					}
					
					 var swiper = new Swiper('.swiper-container', {
						 	pagination: '.swiper-pagination',
							paginationType : 'fraction',
							paginationClickable: true,
							spaceBetween: 0,
							centeredSlides: true,
							autoplay: 2500,
							autoplayDisableOnInteraction: false
					    });
				
				}
			}
		})
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
			text:'http://osmnewapp.teemax.com.cn/info/picPreview.html?id='+parameter.id+'&categoryId='+parameter.categoryId+'' //任意内容
		});
	}
	
};
var infoInit=function(){
	infodemo.dataDetail();//详情
	infodemo.wordsel();//选择文字大小
	infodemo.qrCode();
};
infoInit();
