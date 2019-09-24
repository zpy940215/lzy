require.config({
    baseUrl: "../js/",
    paths: {
        'jquery': 'http://cdn.teemax.com.cn/common/js/lib/jquery-2.1.0.min',
        'async' : 'http://cdn.teemax.com.cn/common/js/lib/require/async',
        'cookie': 'http://cdn.teemax.com.cn/common/js/lib/jquery.cookie.min',
		'Handlebars':'http://cdn.teemax.com.cn/common/js/lib/handlebars-v4.0.5',
		'HandlebarExt':'lib/handlebars-help',
		'echarts':'http://cdn.teemax.com.cn/common/js/plugin/echarts/echarts.min',
		'ztree': 'http://cdn.teemax.com.cn/common/js/plugin/ztree/jquery.ztree.core',
        'ztreecheck':'http://cdn.teemax.com.cn/common/js/plugin/ztree/jquery.ztree.excheck',
        'ztreeedit':'http://cdn.teemax.com.cn/common/js/plugin/ztree/jquery.ztree.exedit',
        'jqueryui':'http://cdn.teemax.com.cn/common/js/lib/jquery.ui',
        'diyUpload':'plugin/diyUpload/js/diyUpload',
        'webuploader':'plugin/diyUpload/js/webuploader.html5only.min',
        'stay':'plugin/date/js/stay',
        'moment':'plugin/date/js/moment.min',
        'viewer':'plugin/assets/js/viewer',
        'main':'plugin/assets/js/main',
        'timepicker':'http://cdn.teemax.com.cn/common/js/plugin/timepicker/jquery-clockpicker.min',
        'pub':'lib/public',
        'mapsed':'tourdata/mapsed',
        'GMap':['http://api.map.baidu.com/api?v=2.0&ak=zMxcZzb3PtuEwBOlk9KKMWlEBX5xgshc'],
        'AMap':['http://webapi.amap.com/maps?v=1.4.0&key=6c716160c20ce159bc7702fe696ee42d'],
        'bdueditor': 'http://cdn.teemax.com.cn/common/js/plugin/bdueditor/ueditor.all',
        'ueditorlang':'plugin/bdueditor/lang/zh-cn/zh-cn',
        'base64': 'lib/base64',
        'area':'common/config/area',
    		'LodopFuncs':'lib/LodopFuncs',
        'print':'lib/print',
        'scroll':'lib/scroll'
    },
    waitSeconds: 0,
    shim: {
        'Handlebars': {
            exports: 'Handlebars'
        },
        'GMap': {
            deps: ['jquery'],
            exports: 'GMap'
        },
        'bdueditor': {
            deps: ['jquery','plugin/bdueditor/third-party/zeroclipboard/ZeroClipboard.min', 'plugin/bdueditor/ueditor.config'],
            exports: 'UE',
            init:function($,ZeroClipboard){
                //导出到全局变量，供ueditor使用
                window.ZeroClipboard = ZeroClipboard;
            }
        },
        'ueditorlang':['jquery','bdueditor'],//百度编辑器样式js
        'cookie' : ['jquery'],
        'jqueryui':['jquery'],
        'ztree':['jquery'],
		'ztreecheck':['jquery','ztree'],
		'ztreeedit':['jquery'],
		'diyUpload':{
			 deps: ['jquery','plugin/diyUpload/js/webuploader.html5only.min'],
			 exports:'diyUpload',
			 init:function($,WebUploader){
				  window.WebUploader = WebUploader;
			 }
		},

		'stay':['jquery','moment'],
		'moment':['jquery'],
        'treeTable':['jquery'],
        'viewer':['jquery'],
        'main':['jquery','viewer'],
        'timepicker':['jquery'],
//        'validata':['jquery'],
        'mapsed':['jquery'],
//        'laydate':{
//        	
//        	 exports:'laydate',
//        }
       
    }
   
});