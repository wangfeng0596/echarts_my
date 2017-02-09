
require.config(requireConfig);
require([ 'jquery',"component/zSearchComponent","easyUI/jquery.datagrid","layer"],function($,zSearchComponent) {
        layer.config({
            path:'./js/lib/layer/', //layer.js所在的目录，可以是绝对目录，也可以是相对目录
            extend: ['skin/espresso/style.css'], //加载新皮肤
            shade: [0.5, '#000000'],
            skin: 'layer-ext-espresso' //只对该层采用myskin皮肤
        });
      $(document).ready(function(){
                var zSearch ;
		  	    var op = {  
					 "component": [
						{
							"type": "date", 
							"id": "startDate", 
							"name": "startDate",
							"labelTxt": "开始时间", 
							"laydateOp": {
								"minDate":'{%y-1}-%M-%d %H:00:00', 
								"maxDate":'%y-%M-%d %H:{%m-30}:00', 
								"dateFmt":'yyyy-MM-dd HH:mm:00',
								"isShowToday":false,
								"isShowClear":false
							}, 
							"value": "2015-12-14 12:00:00", 
							"width" : "200",
							"key": []
						},
						{
							"type": "date", 
							"id": "endDate", 
							"name": "date3",
							"labelTxt": "结束时间", 
							"laydateOp": {
								"dateFmt":'yyyy-MM-dd HH:mm:00',
								"isShowToday":false,
								"isShowClear":false
							}, 
							"value": "2015-12-14 12:30:00", 
							"width" : "200",
							"key": []
						},
						{
							"type": "select", 
							"id": "select1", 
							"name" : "select1",
							"labelTxt": "重要等级", 
							"value": "[]", //设置初始默认值，对应 compKey,如果设为[] ,则默认选中第一项
							"multiple":true, //是否是多选
							"checkAll" : true, //单选是否有全部选项，true 有,false 没有
							"width" : "100", 
							"key": [
								{
									"compKey": 1, 
									"compValue": "移动"
								}, 
								{
									"compKey": 3, 
									"compValue": "电信"
								},
								{
									"compKey": 4, 
									"compValue": "联通"
								},
								{
									"compKey": 5, 
									"compValue": "教育网"
								}
							]
						}, 
						{
							"type": "text", 
							"id": "name", 
							"name":"name",
							"labelTxt": "网站名称", 
							"value": "", //设置初始默认值，对应 compKey,如果设为[] ,则没有默认选中项
							"width" : "200"
						}

					], 
					"btn": [
						{
							"name": "查询", 
							"cls": "", 
							"click": function () {
								  var v = zSearch.getValue();
								  var v2 = zSearch.getText();
								  console.table(v);
								  console.table(v2);
								  zSearch.setValue([{id:"select1",value:""}]);
							 }
				
						}, 
                        {
                            "name": "总体报告", 
                            "cls": "", 
                            "click": function () {
                                var reportView = "<div id='reportView' class='wa_dialog'></div>";
                                layer.open({
                                    type: 1,
                                    title : "网站简要报告",
                                    content:reportView,
                                    area: ['670px','255px'],
                                    moveType: 1,
                                    btn: ['下载网站报告'],
                                    yes:function(index, layero){
                                        layer.close(index);
                                    }
                                });
                                $("#reportView").css({"width":"650px"});
                                var op = {  
                                    "component": [
                                        {
                                            "type": "text", 
                                            "id": "webName", 
                                            "name" : "webName",
                                            "labelTxt": "网站名称", 
                                            "value": "", 
                                            "width" : "200",
                                            "key": [ ]
                                        },
                                        {
                                            "type": "date", 
                                            "id": "closeTime", 
                                            "name" : "closeTime",
                                            "labelTxt": "最近扫描时间", 
                                            "laydateOp": {
                                                "dateFmt":'yyyy-MM-dd HH:mm:00'
                                            },
                                            "value": "", 
                                            "width" : "200",
                                            "key": [ ],
                                            "IsWrap":true
                                        },
                                        {
                                            "type": "text", 
                                            "id": "reportIP", 
                                            "name" : "reportIP",
                                            "labelTxt": "IP地址", 
                                            "value": "", 
                                            "width" : "200",
                                            "key": [ ]
                                        },
                                        {
                                            "type": "text", 
                                            "id": "reportAdd", 
                                            "name" : "reportAdd",
                                            "labelTxt": "地址", 
                                            "value": "", 
                                            "width" : "200",
                                            "key": [ ],
                                            "IsWrap":true
                                        },
                                        {
                                            "type": "text", 
                                            "id": "reportLevel", 
                                            "name" : "reportLevel",
                                            "labelTxt": "威胁等级", 
                                            "value": "", 
                                            "width" : "200",
                                            "key": [ ]
                                        },
                                        {
                                            "type": "text", 
                                            "id": "reportScore", 
                                            "name" : "reportScore",
                                            "labelTxt": "得分", 
                                            "value": "", 
                                            "width" : "200",
                                            "key": [ ],
                                            "IsWrap":true
                                        }
                                    ]
                                }
                                var reportView = new zSearchComponent(op);
                                reportView.render("reportView");
                            }
                
                        }
					]
				}

            zSearch = new zSearchComponent(op);
			zSearch.render("search");

			//计算表格高度
			var body_h = $("body").height();
			var search_bar_h = $(".search_bar").outerHeight()+20;
			var main_content_h = body_h-search_bar_h;

			var box =$("#table");  

          	var data = {"total":11,"rows":[
                    {"date":"03/04/2010","unitcost":10.00,"listprice":16.50,"attr1":"Large","itemid":"EST-1"},
                    {"date":"05/04/2009","unitcost":12.00,"listprice":18.50,"attr1":"Spotted Adult Female","itemid":"EST-10"},
                    {"date":"12/31/2005","unitcost":12.00,"listprice":18.50,"attr1":"Venomless","itemid":"EST-11"},
                    {"date":"03/21/2010","unitcost":12.00,"listprice":18.50,"attr1":"Rattleless","itemid":"EST-12"},
                    {"date":"03/06/2003","unitcost":12.00,"listprice":18.50,"attr1":"Green Adult","itemid":"EST-13"},
                    {"date":"07/04/2010","unitcost":12.00,"listprice":58.50,"attr1":"Tailless","itemid":"EST-14"},
                    {"date":"03/04/2010","unitcost":10.00,"listprice":16.50,"attr1":"Large","itemid":"EST-1"},
                    {"date":"05/04/2009","unitcost":12.00,"listprice":18.50,"attr1":"Spotted Adult Female","itemid":"EST-10"},
                    {"date":"12/31/2005","unitcost":12.00,"listprice":18.50,"attr1":"Venomless","itemid":"EST-11"},
                    {"date":"03/21/2010","unitcost":12.00,"listprice":18.50,"attr1":"Rattleless","itemid":"EST-12"},
                    {"date":"03/06/2003","unitcost":12.00,"listprice":18.50,"attr1":"Green Adult","itemid":"EST-13"}
                ]};
      
            var tableConfig = {
                width:"100%",
                height: main_content_h,
                fitColumns: true,
                singleSelect:true,
                rownumbers : false,
                remoteSort:false,
                pageList : [ 5, 10, 20, 30, 40, 50, 100 ],// 可以设置每页记录条数的列表
                pageSize : 5,// 每页显示的记录条数，默认为10
                pagination : true, // 分页工具栏
                columns:[[
                    {field:'itemid',title:'Item ID(%)',width:"200",align:'left',sortable:true},
                    {field:'listprice',title:'List Price',width:"200",align:'left',sortable:true},
                    {field:'unitcost',title:'Unit Cost',width:"200",align:'left',sortable:true},
                    {field:'attr1',title:'Attribute',width:"200",align:'left',sortable:true},
                    {field:'date',title:'Date',sortable:true,width:"200",align:'left'},
                    {field:'id',title:'操作',width:"200",align:'left',sortable:true,
                        formatter:function(value,rec){
                            return '<span style="color:#00baff;" class="data_detail">查看详情</span>';
                        }
                    }
                ]],
                onLoadSuccess: function(data){
                    $(".data_detail").on('click',function(){
                        var detailTmp = "<div class='wa_dialog'>\
                                <div class='view_sep clear'>\
                                    <table class='detail_table' >\
                                        <tr>\
                                            <td width='150' align='right'>样本名称：</td>\
                                            <td>ssssssss</td>\
                                            <td align='right'>样本大小：</td>\
                                            <td>sssssssssssss</td>\
                                        </tr>\
                                        <tr>\
                                            <td align='right'>样本md5：</td>\
                                            <td>sssssssssssss</td>\
                                            <td align='right'>url：</td>\
                                            <td>sssssssssssss</td>\
                                        </tr>\
                                        <tr>\
                                            <td align='right'>协议：</td>\
                                            <td>ssssssssssss</td>\
                                            <td align='right'>返回值：</td>\
                                            <td>sssssssssssssssssss</td>\
                                        </tr>\
                                </table>\
                            </div>\
                            <div id='v_table'></div>\
                        </div>";
                        layer.open({
                            type: 1,
                            title : "网站简要报告",
                            content:detailTmp,
                            area: ['690px','425px'],
                            moveType: 1,
                            btn: ['返回'],
                            yes:function(index, layero){
                                layer.close(index);
                            }
                        });
                        var tableCon = {
                            width:"660px",
                            height: "200px;",
                            fitColumns: true,
                            singleSelect:true,
                            rownumbers : false,
                            remoteSort:false,
                            columns:[[
                                {field:'itemid',title:'Item ID(%)',width:"100",align:'center',sortable:true},
                                {field:'listprice',title:'List Price',width:"100",align:'center',sortable:true},
                                {field:'unitcost',title:'Unit Cost',width:"100",align:'center',sortable:true},
                                {field:'attr1',title:'Attribute',width:"100",align:'center',sortable:true},
                                {field:'date',title:'Date',sortable:true,width:"100",align:'center'},
                                
                            ]]
                        };
                        $("#v_table").datagrid(tableCon).datagrid('loadData', data);
                    });
                      
                }
            };
            box.datagrid(tableConfig).datagrid('loadData', data);

            pageUtil(box);//调用分页样式


             $(".wa_tab li").on('click',function(){
                var index = $(this).index();  
                $(this).addClass("current").siblings().removeClass("current");

                if(index == '0'){
                    tableConfig.url= "";
                    tableConfig.columns = [[ {field:'itemid',title:'Item ID(%)',width:"100",align:'left',sortable:true},
                                {field:'listprice',title:'List Price',width:"100",align:'left',sortable:true},
                                {field:'unitcost',title:'Unit Cost',width:"100",align:'left',sortable:true},
                                {field:'attr1',title:'Attribute',width:"100",align:'left',sortable:true},
                                {field:'date',title:'Date',sortable:true,width:"100",align:'left'}]];
                    box.datagrid(tableConfig).datagrid('loadData', data);
                }
                else if(index == '1'){
                    tableConfig.columns = [[ {field:'itemid',title:'Item ID(%)1',width:"100",align:'left',sortable:true},
                                {field:'listprice',title:'List Price1',width:"100",align:'left',sortable:true},
                                {field:'unitcost',title:'Unit Cost1',width:"100",align:'left',sortable:true},
                                {field:'attr1',title:'Attribute1',width:"100",align:'left',sortable:true},
                                {field:'date',title:'Date1',sortable:true,width:"100",align:'left'}]];
                    box.datagrid(tableConfig).datagrid('loadData', data);
                }
                pageUtil(box);//调用分页样式

            }); 

      });
      

     function pageUtil(box) {
        box.datagrid('getPager').pagination({
            loadMsg: '正在加载数据，请稍后...',
            beforePageText: '第',
            // 页数文本框前显示的汉字
            afterPageText: '页    共 {pages} 页',
            displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
        });
      }
});

