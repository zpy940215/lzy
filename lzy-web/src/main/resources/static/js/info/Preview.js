var parameter = base.getUrlParameter();
window.parameter = parameter;
var base64 = new base.Base64();
var ajaxpar = new Array();
window.ajaxpar=ajaxpar;
ajaxpar['isajaxing']=false;//是否正在请求数据  false情况下可以请求  
ajaxpar['page']=1;//当前页
ajaxpar['pagenum']=100;//每页显示数量
ajaxpar['islastpage']=false;//是否最后一页
var categoryid=parameter.categoryId;
var categoryname=doc.getCategoryName();
//console.log(categoryname[categoryid])
$(".js_title").html(categoryname[categoryid]);
var infodemo={
	detail:function(){
	var dataget=new Object();
		dataget['articleVo.articleId'] =parameter.id;
		$.ajax({
			type:"POST",
			url:ajaxIndexUrl+'/article!queryByViewTypeId.ajax', 
			data:dataget,
			dataType:"json",
			async:false,
			beforeSend:function(){
				$("body").append('<div class="loadding"><img src="${base}/images/loading.gif"/></div>');
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
					html+='<div class="title js_title">'+info.subject+'</div>'+
							'<div class="createinfo">发布日期:'+doc.formatDate(new Date(info.articleExtVo.createDate))+'</div>';
					if(info.authorName!=null && info.authorName != ''){
						html+='<div class="createinfo">'+info.authorName+'</div>';
					}
					html+='<div class="detailcon js_detailcon">'+base64.decode(info.articleExtVo.content)+'</div>';
					$('.js_detail').html(html);
					$('.js_categoryIds').val(info.categoryIds);
					$('.js_imgurl').val(ajaxImgUrl+info.picList[0].middlePicUrl);
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
			text:'http://osmnewapp.teemax.com.cn/info/Preview.html?id='+parameter.id+'&categoryId='+parameter.categoryId+'' //任意内容
		});
	}
}
var infoInit=function(){
	infodemo.detail();//详情
	infodemo.wordsel();//选择文字大小
	infodemo.qrCode();//二维码
};
infoInit();
