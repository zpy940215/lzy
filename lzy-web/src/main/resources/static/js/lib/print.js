define(['jquery',"LodopFuncs"],function($,LodopFuncs){

	String.prototype.StrCut2Arr=function(n){
		var str=this;
		var arr=[];
		var len=Math.ceil(str.length/n);
		for(var i=0;i < len;i++){
			if(str.length >= n){
				var strCut=str.substring(0,n);
				arr.push(strCut);
				str=str.substring(n);
			}else{
				str=str;
				arr.push(str);
			}
		}
		return arr;
	}
	
	
	
	var printAccounts = function(orderVo,printName){
		
		LODOP = getLodop(); 
		if(LODOP==undefined ||LODOP==undefined){
			return false;
		}
		var TOPHEIGHT = 5;
		LODOP.PRINT_INIT("配货单");
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,10,750,20,"配货单");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",15);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
		TOPHEIGHT += 30;
		LODOP.ADD_PRINT_LINE(TOPHEIGHT,50,TOPHEIGHT,650,2,1);
		TOPHEIGHT += 10;
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,50,80,23,"订单号：");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,120,200,23,orderVo.orderNo);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,400,90,23,"下单时间:");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,480,300,23,formatDate(orderVo.createDate));
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		
		TOPHEIGHT += 20;
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,50,80,23,"姓 名：");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		if(orderVo.orderPersonVo.realName!=null && orderVo.orderPersonVo.realName!=''){
			LODOP.ADD_PRINT_TEXT(TOPHEIGHT,120,200,23,orderVo.orderPersonVo.realName);
		}else{
			LODOP.ADD_PRINT_TEXT(TOPHEIGHT,120,200,23,orderVo.orderPersonVo.name);
		}
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,400,90,23,"联系电话:");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,480,300,23,orderVo.orderPersonVo.mobile);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
		
		TOPHEIGHT += 50;
		LODOP.ADD_PRINT_LINE(TOPHEIGHT,50,TOPHEIGHT,650,0,1);
		
		//for
		TOPHEIGHT += 10;
		LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,110,150,23,"商品名称");
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,310,100,23,"单价(元)");
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,440,100,23,"数量");
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,560,100,23,"总价(元)");
		TOPHEIGHT += 24;
		LODOP.ADD_PRINT_LINE(TOPHEIGHT,50,TOPHEIGHT,650,0,1);
		LODOP.ADD_PRINT_LINE(TOPHEIGHT, 50,TOPHEIGHT-34,50,0,1);
		LODOP.ADD_PRINT_LINE(TOPHEIGHT, 250,TOPHEIGHT-34,250,0,1);
		LODOP.ADD_PRINT_LINE(TOPHEIGHT, 400,TOPHEIGHT-34,400,0,1);
		LODOP.ADD_PRINT_LINE(TOPHEIGHT, 500,TOPHEIGHT-34,500,0,1);
		LODOP.ADD_PRINT_LINE(TOPHEIGHT, 650,TOPHEIGHT-34,650,0,1);
		
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		for(var i = 0; i < orderVo.orderItemVoList.length ; i++){
			TOPHEIGHT += 10;
			
			var orderItemVo= orderVo.orderItemVoList[i];
			LODOP.ADD_PRINT_TEXT(TOPHEIGHT,110,150,23,orderItemVo.prodName);
			LODOP.ADD_PRINT_TEXT(TOPHEIGHT,310,100,23,orderItemVo.discountPrice);
			LODOP.ADD_PRINT_TEXT(TOPHEIGHT,440,100,23,orderItemVo.prodNum);
			LODOP.ADD_PRINT_TEXT(TOPHEIGHT,560,100,23,orderItemVo.prodNum*orderItemVo.discountPrice);
			
			TOPHEIGHT += 24;
			LODOP.ADD_PRINT_LINE(TOPHEIGHT,50,TOPHEIGHT,650,0,1);
			LODOP.ADD_PRINT_LINE(TOPHEIGHT, 50,TOPHEIGHT-34,50,0,1);
			LODOP.ADD_PRINT_LINE(TOPHEIGHT, 250,TOPHEIGHT-34,250,0,1);
			LODOP.ADD_PRINT_LINE(TOPHEIGHT, 400,TOPHEIGHT-34,400,0,1);
			LODOP.ADD_PRINT_LINE(TOPHEIGHT, 500,TOPHEIGHT-34,500,0,1);
			LODOP.ADD_PRINT_LINE(TOPHEIGHT, 650,TOPHEIGHT-34,650,0,1);
			
		}
		
		TOPHEIGHT += 30;
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,50,80,23,"总计金额：");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,115,60,23,(orderVo.totalPrice>0?orderVo.totalPrice:0)+"元");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,220,80,23,"优惠金额:");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,280,70,23,(orderVo.discountFee>0?orderVo.discountFee:0)+"元");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		TOPHEIGHT += 20;
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,50,80,23,"实付金额：");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,115,60,23,(orderVo.payFee>0?orderVo.payFee:0)+"元");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,220,80,23,"支付方式:");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,520,150,23,"配货人:__________");
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		var payType = "";
		if(orderVo.payType == "weixin"){
			payType = "微信";
		}else if(orderVo.payType == "ali"){
			payType = "支付宝";
		}else if(orderVo.payType == "cash"){
			payType = "现金";
		}
		LODOP.ADD_PRINT_TEXT(TOPHEIGHT,280,70,23,payType);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		TOPHEIGHT += 20;
		LODOP.ADD_PRINT_LINE(TOPHEIGHT,50,TOPHEIGHT,650,2,1);
		TOPHEIGHT += 10;
		var mmtoPx = $("#divMMHeight").height();
		LODOP.SET_PRINT_PAGESIZE(1,800,TOPHEIGHT * Number(mmtoPx) ,"");		
		if (LODOP.SET_PRINTER_INDEX(printName)){
 			LODOP.PREVIEW();//打印预览
//			LODOP.PRINT(); 	// 指定打印机打印
//			LODOP.PRINT_DESIGN();
		}else{
 //			LODOP.PRINT_DESIGN();
 			LODOP.PREVIEW();//打印预览
//			LODOP.PRINT(); 	// 使用本地默认打印机打印
		}
	}
	
	var formatDate = function(date){
		var day = new Date(date);
		var Year= day.getFullYear(); 
		var Month= day.getMonth()+1; 
		var Day = day.getDate(); 
		var Hour = day.getHours(); 
		var Minute = day.getMinutes(); 
		var CurrentDate = Year + "-"; 
		if (Month >= 10) { 
			CurrentDate += Month + "-"; 
		}else { 
			CurrentDate += "0" + Month + "-"; 
		} 
		if (Day >= 10) { 
			CurrentDate += Day + " "; 
		}else { 
			CurrentDate += "0" + Day + " "; 
		}
		if (Hour >= 10) { 
			CurrentDate += Hour + ":" ; 
		}else { 
			CurrentDate += "0" + Hour + ":" ; 
		} 
		if (Minute >= 10) { 
			CurrentDate += Minute ; 
		}else { 
			CurrentDate += "0" + Minute ; 
		}  
		return CurrentDate;
	}
	
	var getPrinterCount = function(){
				LODOP=getLodop();  
				if(LODOP==undefined ||LODOP==undefined){
					return false;
				}
				return LODOP.GET_PRINTER_COUNT();
	}
	
	var getPrinterName = function(iPrinterNO) {	
		LODOP=getLodop();  
		if(LODOP==undefined ||LODOP==undefined){
			return false;
		}
		return LODOP.GET_PRINTER_NAME(iPrinterNO);	
	}
	

	
	
	
	var test = function(){
		LODOP=getLodop();  
		LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_整页表格");
		LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4");	
		LODOP.SET_PRINT_STYLEA(0,"FontSize",9);
		
		var tab ="<table cellspacing='0' cellpadding='0'>"
      			+"<tbody id='orderList'><tr><th width='25%'>订单号:30201802061148339310505</th>	<td width='25%'>姓名:18768145327</td>	<th width='25%'>电话:18768145327</th>	<td width='25%'>时间:2018-02-06</td>	</tr><tr>		<th width='30%'>商品名称</th>		<th width='30%'>单价(元)</th>		<th width='20%'>数量</th>		<th width='20%''>总价(元)</th></tr><tr><td>可乐</td><td>0.01</td><td>1</td><td>0.01</td></tr></tbody>"
      			+"</table>";
		LODOP.ADD_PRINT_TABLE(5,5,600,400,tab);
		LODOP.PREVIEW();
	}

	
	return {
		test:test,
		printAccounts:printAccounts,
		getprint:getPrinterCount,
		getPrinterName:getPrinterName,
	}
	
});