// JavaScript Document
define(['jquery','jqueryui'],function($){
	/*全局变量*/
	var LCONF = new Array();
		LCONF['BASE_URL'] = '';
	var base={
		loading:function(option){
			//common.base.loading("fadeIn");
			//common.base.loading("fadeOut");
			if(option=="fadeIn"){
				$(".js_loading").remove();
				$("body").append("<div class=\"loading js_loading\"><img src=\"${(base)!''}/images/loading.gif\"/></div>");
				$(".js_loading").fadeIn();
			}
			else if(option=="fadeOut"){
				$(".js_loading").fadeOut();
			}
		},
		getUrlParameter:function (){
			var url = location.search,value;
			var returnArray = new Array();
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				strs = str.split("&");
				for(var i = 0; i < strs.length; i ++) {
					returnArray[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]);
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
		},
		createPage:function(pageDiv,option){
			var args = $.extend({
				pageTotal : 10,//总页数
				pageCur : 1,//当前页
				turnDown:'true',//是否显示跳转框，显示为true，不现实为false,一定记得加上引号...
				backFn : function(){}
			},option);
			$(".js_pageDiv").html('<div class="pageDiv"> &nbsp; </div>');
			page.init($('.js_pageDiv .pageDiv'),args);
		},
		//开始结束日期选择
		DateTimeselect:function(startdate,enddate){
			$(startdate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true,
				onClose:function(selectedDate){
                      $(this).siblings(enddate).datepicker("option", "minDate", selectedDate);     
				} 	               
		   	});
		   	$(enddate).datepicker({
				dateFormat : 'yy-mm-dd',
				dayNamesMin : ['日','一','二','三','四','五','六'],
				monthNames : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				yearSuffix:'年',
				showMonthAfterYear:true,
				showOtherMonths:true
				             
		   	});
		   $(startdate).datepicker('setDate', new Date());
		   $(enddate).datepicker('setDate', new Date());

		},
		
		popUp:function(popDiv,option){
			var args = $.extend({
				type : 'form',//弹窗类型 form 表单类型，choice选择类型
				tipTitle:'温馨提示',//标题
				tipMesg:'是否删除？',//提示语
				backFn : function(){}
			},option);
			popupMethod.init($(popDiv),args);
		}
		
		/*,
		popUpChoice:function(tipMesg,backFn:function(){}){
			var html =  '<div class="popup js_popUpChoice">'
							'<div class="popup_bg">&nbsp;</div>'
							'<div class="popup_box">'
								'<div class="popup_bt">温馨提示<a class="popupclose js_popUpCancel" href="javascript:void(0)">&nbsp;</a></div>'
								'<div class="popupform">'
									'<p class="formfill">'+tipMesg+'<p>'
									'<div class="formsubmit">'
										'<input type="button" value="取消" class="quit formbtn js_popUpCancel"/>'
										'<input type="button" value="确定" class="save formbtn js_popUpSure"/>'
									'</div>'
								'</div>'
							'</div>'
						'</div>';
			$('body').append('<div></div>');
			$('.js_popUpChoice').fadeIn();
			$('.js_popUpCancel').unbind('click');
			$('.js_popUpCancel').click(function(){
				$(popDiv).fadeOut();
				return (function(){
					backFn(false);
				})();
			});
			$('.js_popUpSure').unbind('click');
			$('.js_popUpSure').click(function(){
				$(popDiv).fadeOut();
				return (function(){
					backFn(true);
				})();
			});
		}*/
	};
	var validate={
		tipIcon:'<i class="icon tipicon"></i>',
		isPositiveInteger:function(value){
			//正整数
			var re = /^[1-9]+[0-9]*]*$/;
			if(!re.test(value)){
				return false;
			}
			return true;
		},
		isTelphone: function (idname, errortip) {
            //手机号验证
            var objthis = $(idname);
            var reg = /^1(3|4|5|7|8)\d{9}$/;
            if (!reg.test(objthis.val())) {
                objthis.siblings(".js_errortip").html(this.tipIcon + errortip);
                return false;
            }
            else {
                objthis.siblings(".js_errortip").html("");
                return true;
            }
        },
		isEmail:function(email){
			//邮箱验证
			var reg =/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
			if(!reg.test(email)){
				return false;
			}
			return true;
		},
		isNumber:function(idname,errortip){
			//数字验证
			var objthis = $(idname);
			var value = this.trim(objthis.val()); 
			if(isNaN(value)){
				objthis.siblings(".js_errortip").html(this.tipIcon+errortip);
				return false;
			}
			else{
				objthis.siblings(".js_errortip").html("");
				return true;
			}
		},
		isRadioCheck:function(itemname,errortip){
			//单选按钮验证
			var objlength =$('input[name='+itemname+']:checked').length;
			if(objlength==0) {
				$('input[name='+itemname+']').siblings(".js_errortip").html(errortip);
				return false;
			}
			else{
				$('input[name='+itemname+']').siblings(".js_errortip").html("");
				return true;
			}
		},
		
		trim:function (str,type){
			var result = str.replace(/(^\s*)|(\s*$)/g, ""); 
			if(type=='all'){
				 result =  result.replace(/\s/g,"");
			}
			return result;
		},
		isEmpty:function (idname){
			
			var objthis = $(idname);
			var value = this.trim(objthis.val()); 
			if(value==""){
				return true;
			}
			else{
				return false;
			}
		},
		checkEmpty:function (idname,errortip){
			//非空判断
			var objthis = $(idname);
			var value = this.trim(objthis.val()); 
			if(value==""){
				objthis.siblings(".js_errortip").html(this.tipIcon+errortip);
				return false;
			}
			else{
				objthis.siblings(".js_errortip").html("");
				return true;
			}
		},
		PopcheckEmpty:function(idname){
			//弹窗表单非空判断
			var objthis = $(idname);
			var value = this.trim(objthis.val()); 
			if(value==""){
				objthis.addClass("errorborder");
				return false;
			}
			else{
				objthis.removeClass("errorborder");
				return true;
			}
		},
		checkPwd:function(idname,idname2,errortip,errortip2){
			//密码验证
			//6-16位数字或字母
			var objthis = $(idname);
			var objthis2 = $(idname2);
			var pattern=/^[0-9a-zA-Z]{6,16}$/g;
			if(!pattern.test(objthis.val())) { 
				objthis.siblings(".js_errortip").html(this.tipIcon+errortip+'6-16位数字或字母');
				return false;
			}
			else{
				objthis.siblings(".js_errortip").html("");
				if(objthis.val()!=objthis2.val()){
					objthis2.siblings(".js_errortip").html(this.tipIcon+errortip2);
					return false;
				}
				objthis.siblings(".js_errortip").html("");
				objthis2.siblings(".js_errortip").html("");
				return true;
			}
		}
	};
	var popupMethod={
		init:function(obj,args){
			obj.remove();
			obj.appendTo("body");
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
				}
			})();
		},
		//表单弹窗
		popUpForm:function(obj,args){
			return (function(){
				obj.show();
				obj.addClass("popupstyle");
				obj.find(".popup_bg").fadeIn();
				obj.find(".popup_box").addClass("show");
				obj.on("click",".js_popUpClose",function(){
					obj.find(".popup_box").removeClass("show");
					obj.find(".popup_bg").fadeOut(function(){
						obj.removeClass("popupstyle");
						obj.html("");
					});
					if(typeof(args.backFn)=="function"){
						args.backFn(false);
					}
				});
				obj.on("click",".js_popUpSubmit",function(){
					if(typeof(args.backFn)=="function"){
						args.backFn(true);
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
										'<p class="formfill">'+args.tipMesg+'<p>'+
										'<div class="formsubmit">'+
											'<input type="button" value="取消" class="quit formbtn js_popUpCancel"/>'+
											'<input type="button" value="确定" class="save formbtn js_popUpSure"/>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
				$('body').append(html);
				obj = $('.js_popUpChoice');
				obj.show();
				obj.addClass("popupstyle");
				obj.find(".popup_bg").fadeIn();
				obj.find(".popup_box").addClass("Choiceshow");
				
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
										'<p class="formfill">'+args.tipMesg+'<p>'+
										'<div class="formsubmit">'+
											'<input type="button" value="确定" class="save formbtn js_popUpSure"/>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
				$('body').append(html);
				obj = $('.js_popUpTip');
				obj.show();
				obj.addClass("popupstyle");
				obj.find(".popup_bg").fadeIn();
				obj.find(".popup_box").addClass("Choiceshow");
				
				obj.on("click",".js_popUpCancel",function(){
					
					obj.remove()
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
		}
	};
	var page={
		init:function(obj,args){
			return (function(){
				page.fillHtml(obj,args);
				page.bindEvent(obj,args);
			})();
		},
		//填充html
		fillHtml:function(obj,args){
			return (function(){
				obj.empty();
				//上一页
				if(args.pageCur > 1){
					obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
				}else{
					obj.remove('.prevPage');
					obj.append('<span class="disabled">上一页</span>');
				}
				//中间页码
				if(args.pageCur != 1 && args.pageCur >= 4 && args.pageTotal != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
				}
				if(args.pageCur-2 > 2 && args.pageCur <= args.pageTotal && args.pageTotal > 5){
					obj.append('<span>...</span>');
				}
				var start = args.pageCur -2,end = args.pageCur+2;
				if((start > 1 && args.pageCur < 4)||args.pageCur == 1){
					end++;
				}
				if(args.pageCur > args.pageTotal-4 && args.pageCur >= args.pageTotal){
					start--;
				}
				for (;start <= end; start++) {
					if(start <= args.pageTotal && start >= 1){
						if(start != args.pageCur){
							obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
						}else{
							obj.append('<span class="pageCur">'+ start +'</span>');
						}
					}
				}
				if(args.pageCur + 2 < args.pageTotal - 1 && args.pageCur >= 1 && args.pageTotal > 5){
					obj.append('<span>...</span>');
				}
				if(args.pageCur != args.pageTotal && args.pageCur < args.pageTotal -2  && args.pageTotal != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+args.pageTotal+'</a>');
				}
				//下一页
				if(args.pageCur < args.pageTotal){
					obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
				}else{
					obj.remove('.nextPage');
					obj.append('<span class="disabled">下一页</span>');
				}
				obj.append('<span class="pageTotal">第'+args.pageCur+'页,</span>');
				obj.append('<span class="pageTotal">共'+args.total+'条记录</span>');
				//跳转页码
				// if(args.turnDown == 'true'){
				// 	obj.append('<span class="countYe">到第<input type="text" value="'+args.pageCur+'" maxlength='+args.pageTotal.toString().length+'>页<a href="javascript:;" class="turnDown">确定</a><span>');
				// }
			})();
		},
		//绑定事件
		bindEvent:function(obj,args){
			return (function(){
				obj.on("click","a.tcdNumber",function(){
					var pageCur = parseInt($(this).text());
					page.fillHtml(obj,{"pageCur":pageCur,"pageTotal":args.pageTotal,"total":args.total,"turnDown":args.turnDown});
					if(typeof(args.backFn)=="function"){
						args.backFn(pageCur);
					}
				});
				//上一页
				obj.on("click","a.prevPage",function(){
					var pageCur = parseInt(obj.children("span.pageCur").text());
					page.fillHtml(obj,{"pageCur":pageCur-1,"pageTotal":args.pageTotal,"total":args.total,"turnDown":args.turnDown});
					if(typeof(args.backFn)=="function"){
						args.backFn(pageCur-1);
					}
				});
				//下一页
				obj.on("click","a.nextPage",function(){
					var pageCur = parseInt(obj.children("span.pageCur").text());
					page.fillHtml(obj,{"pageCur":pageCur+1,"pageTotal":args.pageTotal,"total":args.total,"turnDown":args.turnDown});
					if(typeof(args.backFn)=="function"){
						args.backFn(pageCur+1);
					}
				});
				//跳转
				obj.on("click","a.turnDown",function(){
					var pageNum = parseInt($("span.countYe input").val());
					if(!validate.isPositiveInteger(pageNum)||pageNum>args.pageTotal||pageNum==args.pageCur){
						obj.find('input').focus();
						return false;
					}
					page.fillHtml(obj,{"pageCur":pageNum,"pageTotal":args.pageTotal,"turnDown":args.turnDown});
					/*if(typeof(args.backFn)=="function"){
						args.backFn(pageCur+1);
					}*/
				});
			})();
		}
	  
	};
	var doc = {
    		loadCategory:function(nameinfo){
    			var html=[];
    			var dataget=new Object();
    			$.ajax({
    			  type: "POST",
    			  url:'${base}/category!queryCategoryList.ajax', 
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
    			  url:'${base}/category!queryCategoryList.ajax', 
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
    	}; 
	 /*date*/
    var datatime = {
        getDate : function(d){
            var now = new Date();
            var newday = new Date(now.getFullYear(),now.getMonth(),now.getDate()+d);
            var month = newday.getMonth()+1;
            var day = newday.getDate();
            return month+'月'+day+'日';
        },
		//时间戳
		formatDate:function(now){
			var   year=now.getFullYear();
			var   month=now.getMonth()+1;
			var   date=now.getDate();
			var   hour=now.getHours();
			var   minute=now.getMinutes();
			var   second=now.getSeconds();
			if (month<10){
				month = '0'+month;
			}
			if(date<10){
				date='0'+date;
			}
			return   year+"-"+month+"-"+date;
		},
		accurateDate:function(now){
			var   year=now.getFullYear();
			var   month=now.getMonth()+1;
			var   date=now.getDate();
			var   hour=now.getHours();
			var   minute=now.getMinutes();
			var   second=now.getSeconds();
			if (month<10){
				month = '0'+month;
			}
			if(date<10){
				date='0'+date;
			}
			return   year+"-"+month+"-"+date + " " + hour + " :" + minute;
		},
        getDateWeek: function(date){
            if(!date || date.constructor!=Date){
                date = new Date();
            }
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var dayWeek = date.getDay();
            var strWeek='';
            switch (dayWeek){
                case 0:{
                    strWeek = "周日";
                    break;
                }
                case 1:{
                    strWeek = "周一";
                    break;
                }
                case 2:{
                    strWeek = "周二";
                    break;
                }
                case 3:{
                    strWeek = "周三";
                    break;
                }
                case 4:{
                    strWeek = "周四";
                    break;
                }
                case 5:{
                    strWeek = "周五";
                    break;
                }
                case 6:{
                    strWeek = "周六";
                    break;
                }
            }
            return year + "年" + month + "月" + day + "日" + "  " + strWeek;
        },
        today: function(split){
            if(!split){
                split = '';
            }
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth()+1;
            var day = now.getDate();
            if (month<10){
                month = '0'+month;
            }
            if(day<10){
                day='0'+day;
            }
            return year+''+split+''+month+''+split+''+day;
        },
        yestoday: function(split){
            if(!split){
                split = '';
            }
            var now = new Date();
            var yestoday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
            var year = yestoday.getFullYear();
            var month = yestoday.getMonth()+1;
            var day = yestoday.getDate();
            if (month<10){
                month = '0'+month;
            }
            if(day<10){
                day='0'+day;
            }
            return year+''+split+''+month+''+split+''+day;
        },
        weekago: function(split){
            if(!split){
               split = '';
            }
            var now = new Date();
            var weekago = new Date(now.getFullYear(),now.getMonth(),now.getDate()-6);
            var year = weekago.getFullYear();
            var month = weekago.getMonth()+1;
            var day = weekago.getDate();
            if (month<10){
                month = '0'+month;
            }
            if(day<10){
                day='0'+day;
            }
            return year+''+split+''+month+''+split+''+day;
        },
        monthago: function(split){
            if(!split){
                split = '';
            }
            var now = new Date();
            var _year = now.getFullYear();
            var _month = now.getMonth();
            var _day = now.getDate();
            var monthago = new Date(_year, _month, _day-parseInt(datatime.getDayOfMonth(_year,_month)));
            var year = monthago.getFullYear();
            var month = monthago.getMonth()+1;
            var day = monthago.getDate();
            if (month<10){
                month = '0'+month;
            }
            if(day<10){
                day='0'+day;
            }
            return year+''+split+''+month+''+split+''+day;
           var dd = new Date();  
		   dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
		   var y = dd.getFullYear();   
		   var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0  
		   var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0  
		   return y+"-"+m+"-"+d;   
        },
        getDayOfMonth:function(year,month){
	        var dayCount;
	        now = new Date(year,month, 0);
	        dayCount = now.getDate();
	        return dayCount;
		},
        datedays: function(date,split,days){ 
        	if(!split){
                split = '';
            }
            var now = date;
            if(!date){
                var now = new Date();
            }
            var _year = now.getFullYear();
            var _month = now.getMonth();
            var _day = now.getDate();
            var monthago = new Date(_year, _month, _day+days);
            var year = monthago.getFullYear();
            var month = monthago.getMonth()+1;
            var day = monthago.getDate();
            if (month<10){
                month = '0'+month;
            }
            if(day<10){
                day='0'+day;
            }
            return year+''+split+''+month+''+split+''+day;
        },
        currentYear: function(){
            var now = new Date();
            return now.getFullYear();
        },
        currentMonth:function(){
            var now = new Date();
            var month = now.getMonth()+1;
            if (month<10){
                month = '0'+month;
            }
            return month;
        },
        lastYearMonth : function(split){
            if(!split){
                split = '';
            }
            var now = new Date();
            var _year = now.getFullYear();
            var _month = now.getMonth();
            var _day = now.getDate();
            var lastMonthDate = new Date(_year, _month, _day-parseInt(datatime.getDayOfMonth(_year,_month)));
            var year = lastMonthDate.getFullYear();
            var month = lastMonthDate.getMonth()+1;
            if (month<10){
                month = '0'+month;
            }
            return year+''+split+''+month;
        },

        getDatePart: function(dateStr, split){
            if(!dateStr || dateStr.constructor!=String)
                return;
            if(split && split.length){
                var parts = dateStr.split(split.toString());
                return {
                    year:parts[0],
                    month:parts[1],
                    day:parts[2]
                }
            }
            else{
                return {
                    year:dateStr.substr(0,4),
                    month:dateStr.substr(4,2),
                    day:dateStr.substr(6,2)
                }
            }
        },
        getjsonDate: function(obj){
            if(!obj)
                return;
            var year = obj.year;
            var month = obj.month;
            if (month.length<2){
                month = "0"+month;
            }
            return year + "年" + month+"月";
        },
        getAddDateStr:function(AddDayCount) {   
		   var dd = new Date();  
		   dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
		   var y = dd.getFullYear();   
		   var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0  
		   var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0  
		   return y+"-"+m+"-"+d;   
		}  
        
    };
    
  		  

    String.prototype.endWith=function(endStr){
        var d=this.length-endStr.length;
        return (d>=0&&this.lastIndexOf(endStr)==d)
    };
    var searchheight=$(".search").height();
	if(searchheight>0){
		$(".tablewrap.pt").css("padding-top",searchheight+15);
	}
    $(window).resize(function() {
    	//右侧内容区域高度变化
		var searchheight=$(".search").height();
		if(searchheight>0){
			$(".tablewrap.pt").css("padding-top",searchheight+15);
		}
			
		
    })
	return {
		LCONF:LCONF,
		base:base,
		validate:validate,
		datatime:datatime,
		doc:doc,
		//timelimit:base.DateTimeselect('.js_start_Date','.js_end_Date'),

		timelimit:base.DateTimeselect('.js_start_Date','.js_end_Date')


	};

})