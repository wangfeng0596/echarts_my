/**
 * 资源常量
 */
define(function(){
	
	return {
		  // zElement模板
		  ZTMPL: "<div class='zlayoutElement' id='{{zid}}' maxNum='{{maxNum}}'>\
		            <div class='zlayout-eleContent'><div class='zlayout-component'></div>\
		            </div>\
		            <div class='zlayout-rb'>\
		                <span class='z-radius north-west-resize'></span>\
		                <span class='z-radius north-resize'></span>\
		                <span class='z-radius north-east-resize'></span>\
		                <span class='z-radius west-resize'></span>\
		                <span class='z-radius east-resize'></span>\
		                <span class='z-radius south-west-resize'></span>\
		                <span class='z-radius south-resize'></span>\
		                <span class='z-radius south-east-resize'></span>\
		            </div>\
		        </div>",
		 // 组件标题
		 ZTITLE: "<div class='zlayout-eleHeader'></div>",       
    	 ROOT : 'zlayouts',
		 CENTER : 'zlayoutCenter',
		 WAPPER : 'zlayoutWapper',	     
		 
		 // 最小尺寸      
		 ZELEMENT_MINH : 30,
		 ZELEMENT_MINW : 50,
		 // 元素控制拖拽span
		 ZElEMENT_SPAN:"span[class^='z-radius']",	
		 // 元素 选中效果class
		 ZElEMENT_ELE_FOCUS : "ele-focus",		
		 
		 //元素内部content header
		 ZElEMENT_CONTENT_CLS : ".zlayout-eleContent",	
		 ZElEMENT_HEADER_CLS :  ".zlayout-eleHeader",
		 
		 ZELEMENT_COMPONENT_CLS : "zlayout-component",
		 
		 // 级联参数
		 CASCADE_KEYS : ["NAME","XGROUP","YGROUP","VALUE","ID","DATE","XTIME","NAME1","NAME2"],
		 
		 // VIEW
		 VIEW_CENTER_ID : "zlayoutCenterView",
		 
		 // 拖拽属性
		 ZLEFT_DARG_CLS : "#zleftComponent [data-component]",
		 
		 // 组件类型
		 ZCOMP_TYPE : {
			 CHART : "0",			
			 TEXT : "1",
			 TABLE : "2",
			 SEARCH : "3",
			 DATERANGE : "4",
			 OTHER : "9"
		 },
		 
		 // chart图表插件类型
		 CHART_CATEGORY : {
			 ECHART : "z_chart",
			 FUSIONCHART : "f_chart"
		 },
		 // 图表类型
		 CHART_TYPE :{
			 BAR : "bar",
			 LINE : "line",
			 PIE : "pie",
			 MAP : "map",
			 GAUGE :"gauge",
			 FORCE : "force",
			 PYRAMID :"pyramid",
			 HORIZONTAL:"horizontal",
			 HEATMAP : "heatmap",
			 STATUS : "status"
		 },
		 
		 // 查询组件 类型
		 Z_SEARCH_COMPONENT : {
			TEXT : "1",
			DATE : "2",
			SELECT : "3",
			RADIO  : "4",
			CHECKBOX : "5" ,
			BUTTON : "6" ,
			SWITCH_BTN : "7",
			DATA_RANGE : "8",
			TIME_PICKER : "9",
			TIMETYPE : "10"
	     },
		 
		 // 文本组件类型
		 Z_TEXT_COMPONENT : {
			 TITLE_H1 : "1",
			 TITLE_H2 : "2",
			 TEXT_UNDER_NO : "3",
			 TEXT_UNDER_YES : "4",
			 TITLE_HZL : "5",
			 TITLE_H13: "6",
			 TITLE_H14: "7"
		 },
	     
	     //chartType
		 BAR_CHILD_TYPE : {
			 BAR : "1",
			 BAR2 : "2",
			 ZB1 : "zb1",
			 ZB2 : "zb2",
			 BARSTRIP : "3",
			 BAR4 : "4",
			 BAR5 : "5",
			 CY1 : "cq1"
		 },
		 
	     // 属性类型
	     Z_PROPS : {
	    	 //通用属性 图例位置 
	    	 LEGENDALIGN : {
	    		 L_T : "1",
	    		 C_T : "2",
	    		 R_T : "3",
	    		 L_B : "4",
	    		 C_B : "5",
	    		 R_B : "6",
	    		 L_C : "7",
	    		 C_C : "8",
	    		 R_C : "9"
	    	 },
	    	 //通用属性 坐标方向
	    	 AXIS : {
	    		 X : "1",
	    		 Y : "2",
	    		 DEG : "3"
	    	 },
	    	 //专有属性
	    	 BAR_AXIS_TYPE : {
	    		 XY : "1",//单横单纵
	    		 XYY : "2",//单横双纵
	    	 }
	    	 
	     }
	     
		
	}
	
	
});