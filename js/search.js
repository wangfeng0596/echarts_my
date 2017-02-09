
require.config(requireConfig);
require([ 'jquery',"component/zSearchComponent","component/chartComponent","component/zAjaxUtil","layer"],
    function($,zSearchComponent,chartComponent,zAjax) {
      $(document).ready(function(){
                var zSearch;
		  	    var op = {  
					 "component": [
                        //文本框
                        {
                            "type": "text", 
                            "id": "username", 
                            "name" : "textname",
                            "labelTxt": "用户名", 
                            "value": "请输入用户名", 
                            "width" : "200"
                        }, 
                        //密码框
                        {
                            "type": "password", 
                            "id": "userpwd", 
                            "name" : "userpwd",
                            "labelTxt": "密码", 
                            "value": "请输入密码", 
                            "width" : "200"
                        }, 
                        //单选
						{
							"type": "select", 
							"id": "areaId", 
							"name" : "areaId",
							"labelTxt": "地区", 
							"value": ['a3'], //设置初始默认值，对应 compKey,如果设为[] ,则默认选中第一项
							"multiple":false, //是否是多选
							"isAll" : false, //单选是否有全部选项，true 有,false 没有
							"width" : "200",
							"key": [
								{"compKey": 'a1', "compValue": "山东"}, 
								{"compKey": 'a3', "compValue": "北京"},
								{"compKey": 'a4', "compValue": "天津"},
								{"compKey": 'a5', "compValue": "上海"},
								{"compKey": 'a6', "compValue": "广州"},
								{"compKey": 'a7', "compValue": "武汉"},
								{"compKey": 'a8', "compValue": "四川"}
							]
						}, 
                        //多选
						{
							"type": "select", 
							"id": "areaId2", 
							"name":"areaId2",
							"labelTxt": "地区", 
							"value": [1,2], //设置初始默认值，对应 compKey,如果设为[] ,则没有默认选中项
							"multiple":true,
							"checkAll":true, //是否默认选中全部
							"width" : "200",
							"key": [
                                {"compKey": 1, "compValue": "山东"}, 
                                {"compKey": 3, "compValue": "北京"},
                                {"compKey": 4, "compValue": "天津"},
                                {"compKey": 5, "compValue": "上海"},
                                {"compKey": 6, "compValue": "广州"},
                                {"compKey": 7, "compValue": "武汉"},
                                {"compKey": 7, "compValue": "四川"}
							],
                            "IsWrap":true
						},
                        //日期yyyy-MM-dd 格式
						{
							"type": "date", 
							"id": "dateId", 
							"name": "date",
							"labelTxt": "日期", 
							"laydateOp": {
								"dateFmt":"yyyy-MM-dd"
							}, 
							"value": "", 
							"width" : "200"
						},
                        //日期yyyy-MM-dd HH:mm:ss格式 
						{
							"type": "date", 
							"id": "dateId4", 
							"name": "date",
							"labelTxt": "日期", 
							"laydateOp": {
								"dateFmt":"yyyy-MM-dd HH:mm:ss"
							}, 
							"value": "", 
							"width" : "200",
						}, 
                        //日期yyyy-MM格式 
						{
							"type": "date", 
							"id": "dateId2", 
							"name": "date2",
							"labelTxt": "日期", 
							"laydateOp": {
								"dateFmt":"yyyy-MM"
							}, 
							"value": "", 
							"width" : "200"
						}, 
                        //日期yyyy-MM-dd HH时格式 
						{
							"type": "date", 
							"id": "dateId3", 
							"name": "date3",
							"labelTxt": "日期", 
							"laydateOp": {
								"dateFmt":"yyyy-MM-dd HH时"
							}, 
							"value": "", 
							"width" : "200",
							"IsWrap":true
						},
                        {
                            "type" : "radio",
                            "name" : "radioGroup",
                            "id" : "radioGroup",
                            "labelTxt":"粒度",
                            "value" : ['quarter'],
                            "change" : function() {
                                var vGroup = zSearch.getSingleValue("radioGroup");
                                switch (vGroup) {
                                    case "quarter":
                                       
                                        break;
                                    case "hm":
                                        
                                        break;
                                    case "dm":

                                        break;
                                    case "mm":
                                        
                                        break;
                                    default:
                                        break;
                                }
                            },
                            "key": [
                                {"compKey": "quarter", "compValue": "刻"}, 
                                {"compKey": "hm", "compValue": "小时"},
                                {"compKey": "dm", "compValue": "日"},
                                {"compKey": "mm", "compValue": "月"}
                            ]
                        },
                        {
                            "type" : "checkbox",
                            "name" : "checkGroup",
                            "id" : "checkGroup",
                            "labelTxt":"粒度",
                            "value" : ['hm'],
                            "change" : function() {
                                var vGroup = zSearch.getSingleValue("checkGroup");
                                switch (vGroup) {
                                    case "quarter":
                                       console.log('11');
                                        break;
                                    case "hm":
                                         console.log('22');
                                        break;
                                    case "dm":
                                        console.log('33');
                                        break;
                                    case "mm":
                                         console.log('44');
                                        break;
                                    default:
                                        break;
                                }
                            },
                            "key": [
                                {"compKey": "quarter", "compValue": "刻"}, 
                                {"compKey": "hm", "compValue": "小时"},
                                {"compKey": "dm", "compValue": "日"},
                                {"compKey": "mm", "compValue": "月"}
                            ]
                        },
                        {
                            "type": "switch", 
                            "id": "switcher", 
                            "labelTxt": "", 
                            "value": "1", 
                            "width" : "100",
                            "onLabel":"开",
                            "offLabel":"关"
                        },
                        {
                            "type": "switch", 
                            "id": "switcher2", 
                            "labelTxt": "", 
                            "value": "1", 
                            "width" : "100",
                            "onLabel":"流入",
                            "offLabel":"流出"
                        },
                        {
                            "type": "switch", 
                            "id": "switcher3", 
                            "labelTxt": "仅查询移动互联网", 
                            "value": "1", 
                            "width" : "100",
                            "onLabel":"开",
                            "offLabel":"关"
                        },
                        {
                            "type": "switch", 
                            "id": "switcher3", 
                            "labelTxt": "", 
                            "value": "0", 
                            "width" : "100",
                            "onLabel":"按流量",
                            "offLabel":"按访问次数",
                            "IsWrap":true
                        },
                        {
                            "type": "textarea", 
                            "id": "text", 
                            "name" : "text",
                            "labelTxt": "文本域", 
                            "value": "请输入内容", 
                            "width" : "500",
                            "height" : "100"
                        },
                        //隐藏域
						{
							"type": "hidden", 
							"id": "yincang", 
							"name" : "hidden",
							"labelTxt": "", 
							"value": "", 
						}
					], 
                    "validate" : [
                        {
                            "id":"username",
                            "vType":{required:true,minlength:5},
                            "vMessage":{required:"请输入用户名",minlength:"IP地址不能大于5个字符"}
                        }
                    ],
					"btn": [
						{
							"name": "查询数据", 
							"cls": "", 
							"click": function () {
                                 var vGroup = zSearch.getSingleValue("checkGroup");
                                 console.log(vGroup);
								var errLen = zSearch.validate();
                                if(errLen>0){
                                    return false;
                                }
							 }
				
						}, 
						{
							"name": "导出数据", 
							"cls": "", 
							"menu":[{"type":"1","text":"导出word","name":"word_export"},{"type":"2","text":"导出excel","name":"excel_export","onclick":function(){alert('222');}}],
							"click": function(){
								
							}
						}
					]
				}

            zSearch = new zSearchComponent(op);
			zSearch.render("search");


      });
    
      
});

