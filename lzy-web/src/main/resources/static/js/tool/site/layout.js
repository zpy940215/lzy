define(['jquery','common','jqueryui','Handlebars','HandlebarExt','bdueditor','ueditorlang'],function($,common,jqueryui,Handlebars,HandlebarExt,UE){
	var layoutListInit=function(){
		    var ue = UE.getEditor('Ueditor');
		    $(".cfgweb-tit").click(function(){
		      $(".cfgweb").toggle();
		    })
		    $(".cfgweb span").click(function(){
		      $(this).siblings().removeClass("active");
		      $(this).addClass("active");
		      var thistxt = $(".cfgweb-tit").html($(this).html());
		       $(".cfgweb").hide();
		    })
	     
	}
	
	return {
	        init:layoutListInit
	    };
})