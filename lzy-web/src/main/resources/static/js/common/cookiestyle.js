
	//风格初始化
     var cookie_style=$.cookie("changestyleType");
     if($.cookie("changestyleType")){
    	 $("link[title='"+cookie_style+"']").removeAttr("disabled");
         $("link[title!='"+cookie_style+"']").each(function(){
        	if($(this).attr('title')!=undefined){
        		$(this).attr("disabled","disabled");
        	}
         })
		}
		else{
			$("link[title='default']").removeAttr("disabled");
		}
		     