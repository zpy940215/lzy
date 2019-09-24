// JavaScript Document
var ajaxImgUrl = 'http://osmnewweb.teemax.com.cn/appfile'; //图片固定接口
//var ajaxImgUrl = 'http://120.26.76.172:7001/lzy-web/appfile';
var ajaxIndexUrl='${base}';//接口引用固定位置
var projectId='1712201457035334946';
var siteId='1712251112502291701';


var base={
		linktype:function(){
			$('.js_linktype').unbind('click');
			$(document).on('click','.js_linktype',function(){
				base.newPage();
				var linktype=$(this).attr('linktype');
				
				window.location.href=linktype;
			})
		},
		//手机类型判断
		isMobile:function(){
			 var useragent = navigator.userAgent;
			 if(useragent.indexOf("oushiman-android") >= 0){
				 return 1;
			 }else if(useragent.indexOf("oushiman-iOS") >= 0){
				 return 2;
			 }else{
				 return 0;
			 }
		},	
		//是否登录
		isLogin:function(){
			var token=$.cookie('token');
			var uid=$.cookie('uid');
			if(token==null||token==""){
				if (base.isMobile()=='2') {//ios
					var message = {
					        'name':'jsLogin'
					    };
					    window.webkit.messageHandlers.webViewApp.postMessage(message);
					  
				}else if (base.isMobile()=='1') {//android
					client.jsLogin();
					
				}else {
					
					popUp('',{
						type:'tip',
						tipTitle:'',//标题
						tipMesg:'请登录！',//提示语
						backFn:function(result){
							if(result){
							}
						}
					});		
					
				};
				return false;
			}else{
				return true;
			}
		},
	//是否登录
/*	isLogin:function(type){
		var token=$.cookie('token');
		var uid=$.cookie('uid');
		if(token==null||token==""){
			var message = {
			        'name':'jsLogin'
			    };
			    window.webkit.messageHandlers.webViewApp.postMessage(message);
			  
		}
	},*/
	
	//是否是手机号码
	isTel:function (phone) {
		var pattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
		if(!pattern.test(phone)) {
			return false;
		} else {
			return true;
		}
	},
	
	//返回上一页
	backUp:function(){
		base.disableNative();
		$(".js_back").click(function(){
			
			
			if (base.isMobile()=='2') {//ios
				
				var message = {
		                'name' : 'jsCloseActivity'
		            };
		       		window.webkit.messageHandlers.webViewApp.postMessage(message);
				  
			}else if (base.isMobile()=='1') {//android
				client.jsCloseActivity();
				
			}
			else{
				window.history.back(-1);
			}
				
			/*}
			else{
				//window.location.href='index.html';
				var message = {
		                'name' : 'goBack'
		            };
		       		window.webkit.messageHandlers.webViewApp.postMessage(message);
			}*/
		});
	},
	//清除原生干预返回网站首页
	disableNative:function(){
       		if (base.isMobile()=='2') {//ios
       			var message = {
       	                'name' : 'jsDisableNativeBack'
       	            };
       	       		window.webkit.messageHandlers.webViewApp.postMessage(message);
				  
			}else if (base.isMobile()=='1') {//android
				client.jsDisableNativeBack();
				
			}
	},
	//隐藏底部菜单
	hideMenu:function(){
	
			
       		if (base.isMobile()=='2') {//ios
       			var message = {
       	                'name' : 'hideMenu'
       	            };
       	       		window.webkit.messageHandlers.webViewApp.postMessage(message);
				  
			}else if (base.isMobile()=='1') {//android
				client.hideMenu();
				
			}
		
	},
	//显示底部菜单
	showMenu:function(){
	
			
       		if (base.isMobile()=='2') {//ios
       			var message = {
       	                'name' : 'showMenu'
       	            };
       	       		window.webkit.messageHandlers.webViewApp.postMessage(message);
				  
			}else if (base.isMobile()=='1') {//android
				client.showMenu();
				
			}
	},
	//显示新页面
	newPage:function(){
		
       		if (base.isMobile()=='2') {//ios
       			var message = {
       	                'name' : 'newPage'
       	            };
       	       		window.webkit.messageHandlers.webViewApp.postMessage(message);
				  
			}else if (base.isMobile()=='1') {//android
				client.newPage();
				
			}
	},
	//显示新页面
	refreshPage:function(){
		
       		if (base.isMobile()=='2') {//ios
       			var message = {
       	                'name' : 'refresh'
       	            };
       	       		window.webkit.messageHandlers.webViewApp.postMessage(message);
				  
			}else if (base.isMobile()=='1') {//android
				client.refresh();
				
			}
	},
	//获取url的属性值
	getUrlParameter:function(){
		var url = location.search,
			value;
		var returnArray = new Array();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				returnArray[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
			}
		}
		return returnArray;
	},
	//文字解码
	 Base64:function() {
		// private property 
		_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		// public method for encoding 
		this.encode = function(input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = _utf8_encode(input);
			while(i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if(isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if(isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
					_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
			}
			return output;
		}
		// public method for decoding 
		this.decode = function(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while(i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if(enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if(enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = _utf8_decode(output);
			return output;
		}
	
		// private method for UTF-8 encoding 
		_utf8_encode = function(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			for(var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if(c < 128) {
					utftext += String.fromCharCode(c);
				} else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
	
			}
			return utftext;
		}

		// private method for UTF-8 decoding 
		_utf8_decode = function(utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while(i < utftext.length) {
				c = utftext.charCodeAt(i);
				if(c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
	}
}
/*弹窗*/
function popUp(popDiv,option){
	var args = $.extend({
		type : 'form',//弹窗类型 form 表单类型，choice选择类型
		tipTitle:'温馨提示',//标题
		tipMesg:'是否删除？',//提示语
		btnCancel:'取消',
		btnSure:'确定',
		backFn : function(){}
	},option);
	popupMethod.init($(popDiv),args);
}
var popupMethod={
		init:function(obj,args){
			return (function(){
				switch(args.type){
					case 'form':
						popupMethod.popUpForm(obj,args);
						break;
					case 'choice':
						popupMethod.popUpChoice(obj,args);
						break;
					case 'tip':
						popupMethod.popUpTip(obj,args);
						break;
					case 'tipsuc':
						popupMethod.popUpTipSuc(obj,args);
						break;
				}
			})();
		},
		//表单弹窗
		popUpForm:function(obj,args){
			return (function(){
				obj.fadeIn();
				obj.on("click",".js_popUpClose",function(){
					obj.fadeOut();
					if(typeof(args.backFn)=="function"){
						args.backFn(false);
					}
				});
				obj.on("click",".js_popUpSubmit",function(){
					if(typeof(args.backFn)=="function"){
						args.backFn(true);
						//obj.fadeOut();
					}
				});
			})();
		},
		popUpChoice:function(obj,args){
			return (function(){
				var html =  '<div class="popup popupChoice js_popUpChoice">'+
								'<div class="popup_bg">&nbsp;</div>'+
								'<div class="popup_box">'+
									'<div class="popup_bt">'+args.tipTitle+'<a class="popupclose js_popUpCancel" href="javascript:void(0)">&nbsp;</a></div>'+
									'<div class="popupform">'+
										'<div class="formfill">'+args.tipMesg+'<div>'+
										'<div class="formsubmit">'+
											'<input type="button" value="'+args.btnCancel+'" class="quit formbtn js_popUpCancel"/>'+
											'<input type="button" value="'+args.btnSure+'" class="save formbtn js_popUpSure"/>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
				$('body').append(html);
				$('.js_popUpChoice').fadeIn();
				obj = $('.js_popUpChoice');
				obj.on("click",".js_popUpCancel",function(){
					obj.remove();
					if(typeof(args.backFn)=="function"){
						args.backFn(false);
					}
				});
				obj.on("click",".js_popUpSure",function(){
					obj.remove();
					if(typeof(args.backFn)=="function"){
						args.backFn(true);
					}
				});
			})();
		},
		popUpTip:function(obj,args){
			return (function(){
				var html =  '<div class="popup popupChoice js_popUpTip">'+
								'<div class="popup_bg">&nbsp;</div>'+
								'<div class="popup_box">'+
									'<div class="popup_bt">'+args.tipTitle+'<a class="popupclose js_popUpCancel" href="javascript:void(0)">&nbsp;</a></div>'+
									'<div class="popupform">'+
										'<div class="formfill"><div class="fill_top"><i class="icon icon_tip"></i><br>'+args.tipMesg+'</div><div>'+
									'</div>'+
								'</div>'+
							'</div>';
				$('body').append(html);
				$('.js_popUpTip').fadeIn();
				obj = $('.js_popUpTip');
				setTimeout(function(){
					args.backFn(true);
					obj.fadeOut(function(){obj.remove()});
				},1500)	
				
			})();
		},
		popUpTipSuc:function(obj,args){
			return (function(){
				var html =  '<div class="popup popupChoice js_popUpTip">'+
								'<div class="popup_bg">&nbsp;</div>'+
								'<div class="popup_box">'+
									'<div class="popup_bt">'+args.tipTitle+'<a class="popupclose js_popUpCancel" href="javascript:void(0)">&nbsp;</a></div>'+
									'<div class="popupform">'+
										'<div class="formfill"><div class="fill_top"><i class="icon icon_tip"></i><br>'+args.tipMesg+'</div><div>'+
									'</div>'+
								'</div>'+
							'</div>';
				$('body').append(html);
				$('.js_popUpTip').fadeIn();
				obj = $('.js_popUpTip');
				setTimeout(function(){
					args.backFn(true);
					obj.fadeOut(function(){obj.remove()});
				},1200)	
				
			})();
		},
	};


var headdemo = {
	swiper:function(){
		var swiper = new Swiper('.swiper-container', {
		    slidesPerView: 5,
		    centeredSlides:true,
		    onTouchEnd: function(swiper){ 
		    	$('.swiper-slide').each(function(){
		    		var thisindex=$(this).index();
		    		var thisleft=$(this).offset().left;
		    		if(thisleft>0){
		    			$('.iconBox li').hide();
						$('.iconBox li').eq(thisindex+2).show().addClass('cur');
						
						return false;
		    		}
		    		
		    	})
		    }
		});
	},
	
	slide:function(){
		$('.tit .swiper-slide').click(function(e){
			var index = $(this).index();
			$('.tit .swiper-slide').removeClass('active');$(this).addClass('active');
			$('.iconBox li').hide();
			$('.iconBox li').eq(index).show().addClass('cur');
		})			
	}
}
var doc = {
	loadCategory:function(nameinfo){
		var html=[];
		var dataget=new Object();
		$.ajax({
		  type: "POST",
		  url:ajaxIndexUrl+'/category!queryCategoryList.ajax', 
		  data: dataget,  
		  dataType: "json",  
		  async: false,
		beforeSend: function(){
			$(".loadding").show();    
		},
		success: function(data) {
		  var categoryId='';
		  var aa=data.data.categoryVoList;
		  $.each(aa,function(index,info){
			  html[info.name]=info.categoryId;
		  });
		  
		},
		error: function(data) {
			$(".loadding").hide();
			//请求出错处理
			// alert('请求出错处理');
		}
		});
		return html;
	},
	getCategoryName:function(categoryId){
		var html=[];
		var dataget=new Object();
		$.ajax({
		  type: "POST",
		  url:ajaxIndexUrl+'/category!queryCategoryList.ajax', 
		  data: dataget,  
		  dataType: "json",  
		  async: false,
		beforeSend: function(){
			$(".loadding").show();    
		},
		success: function(data) {
		  var categoryName='';
		  var aa=data.data.categoryVoList;
		  $.each(aa,function(index,info){
			  html[info.categoryId]=info.name;
		  });
		  
		},
		error: function(data) {
			$(".loadding").hide();
			//请求出错处理
			// alert('请求出错处理');
		}
		});
		return html;
	},
	//时间戳
	formatDate:function(now){   
		var   year=now.getFullYear();     
		var   month=now.getMonth()+1;     
		var   date=now.getDate();     
		var   hour=now.getHours();     
		var   minute=now.getMinutes();     
		var   second=now.getSeconds();     
		return   year+"-"+month+"-"+date; 	
	},
	myFormatDate:function(time){   
		var now = new Date(time);
		var   year=now.getFullYear();     
		var   month=now.getMonth()+1;     
		var   date=now.getDate();     
		var   hour=now.getHours();     
		var   minute=now.getMinutes();     
		var   second=now.getSeconds();     
		return   year+"-"+month+"-"+date; 	

	},
	formatDate1:function(now){   
		var   year=now.getFullYear();     
		var   month=now.getMonth()+1;     
		var   date=now.getDate();     
		var   hour=now.getHours();     
		var   minute=now.getMinutes();     
		var   second=now.getSeconds();     
		var date= year+"-"+month+"-"+date+' '+hour+':'+minute+':'+second; 	
		var date2=doc.getDateTimeStamp(date);
		var datelast=doc.getDateDiff(date2);
		return datelast;
	},
	getDateTimeStamp:function(dateStr){
		return timestamp=Date.parse(dateStr.replace(/-/gi,"/"));
		
	},
	getDateDiff:function(dateTimeStamp){
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var now = new Date().getTime();
		var diffValue = now - dateTimeStamp;
		if(diffValue < 0){return;}
		var monthC =diffValue/month;
		var weekC =diffValue/(7*day);
		var dayC =diffValue/day;
		var hourC =diffValue/hour;
		var minC =diffValue/minute;
		if(monthC>=1){
		    result="" + parseInt(monthC) + "月前";
		}
		else if(weekC>=1){
		    result="" + parseInt(weekC) + "周前";
		}
		else if(dayC>=1){
		    result=""+ parseInt(dayC) +"天前";
		}
		else if(hourC>=1){
		    result=""+ parseInt(hourC) +"小时前";
		}
		else if(minC>=1){
		    result=""+ parseInt(minC) +"分钟前";
		}else
		result="刚刚";
		return result;
		}

};
var calendar={
	calendar:function(){
		var data=new Date();
		$('.datetime').text(doc.formatDate(data));
		calendar.dateTimesel(doc.formatDate(data));
		//日期选择
		var config = {
	        modules: {
	            'price-calendar': {
	                fullpath: "../js/plugin/ticketcalendar.js",
	                type    : 'js',
	                requires: ['price-calendar-css']
	            },
	            'price-calendar-css': {
	                fullpath: "../css/calendar.css",
	                type    : 'css'
	            }
	        }
	    };
	    YUI(config).use('price-calendar', 'jsonp', function(Y) {
	        var sub  = Y.Lang.sub;
	        //日历显示个数
	        var oCal;
	    	oCal = new Y.PriceCalendar({
		      	count:12,//全日历
		      	data:[],//价格数据
		      	date:new Date(),//开始日期
		      	depDate:'',
		      	minDate:'',//最小日期
		      	afterDays:3650,//可选天数
		      	inputname:'datetime'//结果显示框id
		    });
		    oCal.on('confirm', function() {
		      	var depDate = this.get('depDate')
		      	$('#datetimeClick .datetime').html(depDate);
		      	document.getElementsByClassName('price-calendar-bounding-box').item(0).style.display="none";
		      	calendar.dateTimesel(depDate);
		    });
		    oCal.on('checkin', function(e) {
		      	var depDate = this.get('depDate');
		      	$('#depDate').val(depDate);
		      	$('#datetimeClick .datetime').html(depDate);
		      	document.getElementsByClassName('price-calendar-bounding-box').item(0).style.display="none";
		      	calendar.dateTimesel(depDate);
		    });
		    oCal.on('checkout', function(e) {
		      	var endDate = this.get('endDate');
		      	$('#endDate').val(endDate);
		       	$('#datetimeClick .datetime').html(endDate);
		      	document.getElementsByClassName('price-calendar-bounding-box').item(0).style.display="none";
		      	calendar.dateTimesel(depDate);
		    });
		    //点击取消按钮
		    oCal.on('cancel', function() {
		      	document.getElementsByClassName('price-calendar-bounding-box').item(0).style.display="none";
		    });
		    var inputdateClick = document.getElementById('datetimeClick');
		    inputdateClick.addEventListener("click",function(e){
		      	var dateBox = document.getElementById(oCal._calendarId);
		      	dateBox.style.display = "block";
		      	dateBox.style.position = "fixed";
		      	dateBox.style.bottom = '45px';
		      	dateBox.style.left = '0px';
		      	dateBox.style.zIndex = 9999;
		      	
		    });
	 	});
	},
	//获取时间
	dateTimesel:function(datetime){
		var date = new Date();//获取当前时间
		var hour=date.getHours();//获取小时
		var day=doc.formatDate(date);
		var html='';
		$('.js_seltime').html('');
		if(datetime==day){
			if(hour>=8 &&hour<16){
				for(var i=hour+1;i<=16;i++){
					if(i!=12){
						if(i==11 || i==16){
							html='<option>'+i+':00</option>';
							$('.js_seltime').append(html);
						}
						else{
							html='<option>'+i+':00</option><option>'+i+':30</option>';
							$('.js_seltime').append(html);
						}
					}
					
				}
			}
			else{
				
				for(var i=8;i<=16;i++){
					if(i!=12){
						if(i==8){
							html='<option>'+i+':30</option>';
						}
						else if(i==11 || i==16){
							html='<option>'+i+':00</option>';
						}
						else{
							html='<option>'+i+':00</option><option>'+i+':30</option>';
							
						}
						$('.js_seltime').append(html);
					}
					
				}
			}
		}
		else{
			for(var i=8;i<=16;i++){
				if(i!=12){
					if(i==8){
						html='<option>'+i+':30</option>';
					}
					else if(i==11 || i==16){
						html='<option>'+i+':00</option>';
					}
					else{
						html='<option>'+i+':00</option><option>'+i+':30</option>';
						
					}
					$('.js_seltime').append(html);
				}
				
			}
		}
		
	},
	
};
var share={
		shareLink:function(){
			var curUrl = window.location.href;
			
			var datapost=new Object();
				datapost['curUrl'] = curUrl;
			$.ajax({
				type: "POST",
				url:"${(base)!''}/weixinJs!initWeixinJsConfig.ajax", 
				data: datapost,  
				dataType: "json",  
				success: function(resuleData) {
					if(resuleData.code=='success'){
						var shardData = resuleData.data;
						wx.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: shardData.appid, // 必填，公众号的唯一标识
							timestamp:shardData.timestamp , // 必填，生成签名的时间戳
							nonceStr: shardData.noncestr, // 必填，生成签名的随机串
							signature: shardData.signature,// 必填，签名，见附录1
							jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
					}
					
				},
				error: function(resuleData) {
					
				}
			});
		},
		sharetype:function(title,description,link,logo){
			 var fenxiang=new Object();window.fenxiang=fenxiang;
				fenxiang['title'] = title;
				fenxiang['desc'] = description;
				fenxiang['link'] = link;// 活动链接
				fenxiang['imgUrl'] =logo; // 分享图标
				wx.ready(function() {
		            //分享到朋友圈
		            wx.onMenuShareTimeline({
		                title: fenxiang['title'],
		                desc: fenxiang['desc'],
		                link: fenxiang['link'],
		                imgUrl: fenxiang['imgUrl'],
		                success: function() {
		                    //分享到朋友圈成功，开启活动
		                    //alert('已分享到朋友圈');
		                },
		                cancel: function() {
		                    //alert('已取消分享');
		                }
		            });
		            //发送给朋友
		            wx.onMenuShareAppMessage({
		                title: fenxiang['title'],
		                desc: fenxiang['desc'],
		                link: fenxiang['link'],
		                imgUrl: fenxiang['imgUrl'],
		                success: function() {
		                    // 用户确认分享后执行的回调函数
		                },
		                cancel: function() {
		                    // 用户取消分享后执行的回调函数
		                }
		            });
		            //分享到QQ
		            wx.onMenuShareQQ({
		                title: fenxiang['title'],
		                desc: fenxiang['desc'],
		                link: fenxiang['link'],
		                imgUrl: fenxiang['imgUrl'],
		                success: function() {
		                    // 用户确认分享后执行的回调函数
		                },
		                cancel: function() {
		                    // 用户取消分享后执行的回调函数
		                }
		            });
		            //分享到腾讯微博
		            wx.onMenuShareWeibo({
		                title: fenxiang['title'],
		                desc: fenxiang['desc'],
		                link: fenxiang['link'],
		                imgUrl: fenxiang['imgUrl'],
		                success: function() {
		                    // 用户确认分享后执行的回调函数
		                },
		                cancel: function() {
		                    // 用户取消分享后执行的回调函数
		                }
		            });
		            //分享到QQ空间
		            wx.onMenuShareQZone({
		                title: fenxiang['title'],
		                desc: fenxiang['desc'],
		                link: fenxiang['link'],
		                imgUrl: fenxiang['imgUrl'],
		                success: function() {
		                    // 用户确认分享后执行的回调函数
		                },
		                cancel: function() {
		                    // 用户取消分享后执行的回调函数
		                }
		            });
				});
		}
};
var headInit=function(){
	headdemo.slide();
	headdemo.swiper();
}
base.backUp();
base.linktype();
function prolink(url){
	if(base.isMobile()==1){
		client.browser(url);
	}
	else if(base.isMobile()==2){
		var message = {
		        'name':'browser',
				'data':url
		    };
		    window.webkit.messageHandlers.webViewApp.postMessage(message);
	}
	else{
		window.location.href=url;
	}
}
