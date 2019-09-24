define(['jquery','Handlebars','base64'],function($,Handlebars,base64){
	Dates = {};
	Dates.padNumber = function(num, count, padCharacter) {
		var lenDiff, padding;
		if (typeof padCharacter === "undefined") {
			padCharacter = '0';
		}
		lenDiff = count - String(num).length;
		padding = '';
		if (lenDiff > 0) {
			while (lenDiff--) {
				padding += padCharacter;
			}
		}
		return padding + num;
	};
	
	Handlebars.registerHelper("lt",
	function(a, b, options) {
		if (a < b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("multiply",
	function(a, b, options) {
		if (!a) return "";
		return a * b;
	});
	
	Handlebars.registerHelper("subtraction",
            function(a, b, options) {
      var num=0;
        if(a== null || b==null){
            return num;
        }
        if (a>b){
        	num = a-b;
        }else{
        	num = b-a;
        }

       return num.toFixed(2);
    });
	
	Handlebars.registerHelper("lteq",
	function(a, b, options) {
		if (a <= b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("equals",
	function(a, b, options) {
		if (a === b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("equal",
	function(a, b, options) {
		if (a == b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("json",
	function(jsonObj, options) {
		return JSON.stringify(jsonObj);
	});
	
	Handlebars.registerHelper("is",
	function(a, test, options) {
		if (a + "" === test + "") {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("isnt",
	function(a, test, options) {
		if (a !== test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("notin",
	function(a, arrayStr, options) {
		var array, item, k, len;
		array = arrayStr.split(",");
		for (k = 0, len = array.length; k < len; k++) {
			item = array[k];
			if (a === item) {
				return options.inverse(this);
			}
		}
		return options.fn(this);
	});
	
	Handlebars.registerHelper("in",
	function(a, arrayStr, options) {
		var array, item, k, len;
		array = arrayStr.split(",") || [];
		for (k = 0, len = array.length; k < len; k++) {
			item = array[k];
			if (a === item) {
				return options.fn(this);
			}
		}
		return options.inverse(this);
	});
	
	Handlebars.registerHelper("nullDefault",
	function(a, b, options) {
		if (a) {
			return a;
		} else {
			return b;
		}
	});
	
	Handlebars.registerHelper("subString",
	function(a, b, options) {
		var a = a || "";
		if (b < 0) {
			return "";
		}
		return a.substring(0, b) + "...";
	});
	
	Handlebars.registerHelper("formatTitle",
	function(str, options) {
		var array = str.split(",");
		for (var i = 0; i < array.length; i++) {
			array[i] += "\r\n";
		}
		return array.join("");
	});
	
	Handlebars.registerHelper("formatDate",
	function(date, model) {
		var _retDate;
		if (date === null) {
			return "";
		}
		date = new Date(date);
		_retDate = date.getFullYear() + "-" + Dates.padNumber(date.getMonth() + 1, 2) + "-" + Dates.padNumber(date.getDate(), 2);
		if (model === "default") {
			_retDate = _retDate + " " + Dates.padNumber(date.getHours(), 2, ' ') + ":" + Dates.padNumber(date.getMinutes(), 2);
		}
		return _retDate;
	});
	
	Handlebars.registerHelper("subtractDate",
	function(a, b, options) {
		var cha, checkDate, checkDate2, checkTime, checkTime2, dateArr, dateArr2, day;
		day = 24 * 60 * 60 * 1000;
		try {
			dateArr = d1.split("-");
			checkDate = new Date();
			checkDate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
			checkTime = checkDate.getTime();
			dateArr2 = d2.split("-");
			checkDate2 = new Date();
			checkDate2.setFullYear(dateArr2[0], dateArr2[1] - 1, dateArr2[2]);
			checkTime2 = checkDate2.getTime();
			cha = (checkTime - checkTime2) / day;
			return Math.ceil(cha);
		} catch(_error) {
			return false;
		}
	});
	
	Handlebars.registerHelper("subtract30Date",
	function(a, b, options) {
		var c, cha, checkDate, checkDate2, checkTime, checkTime2, dateArr, dateArr2, day;
		day = 24 * 60 * 60 * 1000;
		try {
			dateArr = d1.split("-");
			checkDate = new Date();
			checkDate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
			checkTime = checkDate.getTime();
			dateArr2 = d2.split("-");
			checkDate2 = new Date();
			checkDate2.setFullYear(dateArr2[0], dateArr2[1] - 1, dateArr2[2]);
			checkTime2 = checkDate2.getTime();
			cha = (checkTime - checkTime2) / day;
			c = Math.ceil(cha);
			if (c < 31) {
				return "剩余（" + c + "）天";
			}
			return "";
		} catch(_error) {
			return false;
		}
	});

	
	Handlebars.registerHelper("has",
	function(a, b, options) {
		if(a==null || a==''){
			return options.inverse(this);
		}
		if (a.indexOf(b) > -1) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("base64Decode",
	function(a) {
		var base64 = new Base64();
		return base64.decode(a);
	});
	
	Handlebars.registerHelper("haslowwer",
	function(a, b, options) {
		a = a || "";
		a = a.toLowerCase();
		if (a.indexOf(b) > -1) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	
	
	Handlebars.registerHelper("languageName",
	function(a, options) {
		a = a || "";
		var status = {
			"en": "English",
			"zh-tw": "繁體中文",
			"zh-cn": "简体中文",
			"th": "ภาษาไทย",
			"ko": "한국어",
			"jp": "日本語"
		};
	
		return status[a] || a;
	
	});
	
	Handlebars.registerHelper("applyStatus",
	function(a, options) {
		a = a || "";
		var status = {
			"create": "未处理",
			"applying": "处理中",
			"success": "已完成",
			"reject": "已拒绝"
		};
	
		return status[a] || a;
	
	});
	
	Handlebars.registerHelper("orderStatus",
			function(a, options) {
				a = a || "";
				var status = {
					"create": "创建",
          			"pay":"已支付",
          			"cancel":"已取消",
          			"close":"订单关闭",
          			"delivering":"发货中",
          			"delivered":"已发货",
          			"success":"订单成功",
          			"refunded":"已退款",
          			"refundapply":"申请退款",
          			"refunding":"退款中",
          			"refundrefuse":"拒绝退款"
				};
			
				return status[a] || a;
			
	});
	
	Handlebars.registerHelper("ticketOrderStatus",
			function(a, options) {
				a = a || "";
				var status = {
					"create": "创建",
          			"pay":"已支付",
          			"cancel":"已取消",
          			"close":"订单关闭",
          			"delivering":"发货中",
          			"delivered":"已发货",
          			"success":"已检票",
          			"refunded":"已退款",
          			"refundapply":"申请退款",
          			"refunding":"退款中",
          			"refundrefuse":"拒绝退款",
          			"get":"已取票"
				};
			
				return status[a] || a;
			
	});
	
	Handlebars.registerHelper("msgBizType",
	function(a, options) {
		a = a || "";
		var status = {
			"orderNew": "新订单通知",
			"orderModify": "订单修改通知",
			"orderCancel": "订单取消通知",
			"balanceCreate": "结算通知",
			"balanceCancel": "结算取消通知",
			"applyResult": "渠道审核结果通知",
			"apply": "渠道申请通知"
		};
	
		return status[a] || a;
	
	});
	
	Handlebars.registerHelper("apartPhoneNum",
	function(a, options) {
		a = a.replace(/\s+/g, "");
		if (a.length === 11) {
			a = a.replace(/(\d{3})(\d{4})/g, "$1 $2 ");
		} else if (a.length === 8) {
			a = a.replace(/(\d{4})/g, "$1 ");
		}
		return a;
	});
	
	Handlebars.registerHelper("add",
	function(a, b, options) {
		return a + b;
	});
	
	Handlebars.registerHelper("before",
	function(a, b, arr, options) {
		var i, j;
		i = indexOf(arr, a);
		j = indexOf(arr, b);
		if (j > i) {
			return options.inverse(this);
		} else {
			return options.fn(this);
		}
	});
	
	Handlebars.registerHelper("addOne",
	function(index, options) {
		return parseInt(index) + 1;
	});
	
	Handlebars.registerHelper("gt",
	function(a, b, options) {
		if (a > b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	if (typeof String.prototype.startsWith != "function") {
		String.prototype.startsWith = function(prefix) {
			return this.slice(0, prefix.length) === prefix;
		};
	}
	
	Handlebars.registerHelper("configUrl",
	function(a, b, options) {
		if (a == null || a == '') {
			return a;
		}
		if (a.startsWith("http://cdn.dujiake.com")) {
			return a;
		} else {
			var index = a.lastIndexOf(".");
			var urlPathPrefix = a.substring(0, index);
			var urlPathSuffix = a.substring(index);
			return urlPathPrefix + "_" + b + urlPathSuffix;
		}
		return a;
	});
	
	Handlebars.registerHelper("countStarWidth",
	function(a, starWidth, spacWidth, options) {
		if (a == null || a == '') {
			return 0;
		} else {
			return a * starWidth + a * spacWidth;
		}
	});
	
	Handlebars.registerHelper("sumAddOne",
	function(a, b, options) {
		return parseInt(a) + parseInt(b) + 1;
	});
	
	Handlebars.registerHelper("replace",
	function(a, b, c, options) {
		if (a == null || a == '') {
			return a;
		} else {
			var reg = new RegExp(b, 'g');
			return a.replace(reg, c);
		}
	});
	
	Handlebars.registerHelper("hasin",
	function(a, arrayStr, options) {
		if (a == null || a == '') {
			return a;
		}
		var array, item;
		array = arrayStr.split(",") || [];
		for (var k = 0; k < array.length; k++) {
			item = array[k];
			if (a.indexOf(item) > -1) {
				return options.fn(this);
			}
		}
		return options.inverse(this);
	});
	
	Handlebars.registerHelper("minusDealFee",
	function(a, b, options) {
		if (a == null || b == null) {
			return 0;
		}
		var result = a - b;
		if (result <= 0) {
			return 0.01;
		} else {
			return result;
		}
	});
	
	Handlebars.registerHelper("size",
	function(a, options) {
		if (a == null || a.length == 0) {
			return '不可退改'
		} else {
			return '可退改';
		}
	});
	
	Handlebars.registerHelper("decode",
	function(a, options) {
		var b = new Base64();
		var m = b.decode(a);
		return m;
	});
	
	Handlebars.registerHelper("urlchange",
	function(a, options) {
		var b = a.replace(/#/g, "&");
		return b;
	});
	
	Handlebars.registerHelper("ds",
	function(a, b, options) {
		var n = new Base64();
		var m = n.decode(a);
		var y = m.replace(/<.*?>/ig, "");
		if (b < 0) {
			return "";
		}
		return y.substring(0, b) + "...";
	});
	
	Handlebars.registerHelper("lts",
	function(a, options) {
		if ((a + 1 % 4) != 0) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("dsAll",function(a, options) {
		var n = new Base64();
		var m = n.decode(a);
		var y = m.replace(/<.*?>/ig, "");
		return y;
	});
	//取b个数之前的奇数
	Handlebars.registerHelper("lt_b",
	function(a, b, options) {
		if ((a + 1) % 2 == 1 && ((a + 1) / 2) < b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	//取b个数之前的偶数
	Handlebars.registerHelper("lt_c",function(a, b, options) {
		if ((a + 1) % 2 == 0 && ((a + 1) / 2) <= b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
	Handlebars.registerHelper("str_include",function(str,str2,options){
		if(str2.indexOf(str)>=0) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
		/*var sear=new RegExp(str);
		if(sear.test(str2)){
			return options.fn(this);
		}
		else {
			return options.inverse(this);
		}*/
	});
});

