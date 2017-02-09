
require.config(requireConfig);
require([ 'jquery',"component/zSearchComponent","component/curmbs","component/zUtil","layer"],function($,zSearchComponent,curmb,util) {
      layer.config({
          path:'./js/lib/layer/', //layer.js所在的目录，可以是绝对目录，也可以是相对目录
          extend: ['skin/espresso/style.css'] //加载新皮肤
      });
    $(document).ready(function(){
    	
    	
	var result = [];
	var result =[
      {
          "id": "", 
          "name": "互联网流量概览", 
          "pId": "0",
          "url": "default_demo.html",
          "icon": "icon2.png",
          "sonmenu":[
               {
                   "id":"",
                   "name":"全局统计",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"地域统计",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"运营商统计",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"应用统计",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"用户统计",
                   "url":"default_demo.html",
                   "sonmenu":[]
               }
           ] 
      },
      {
          "id": "", 
          "name": "域名安全监测", 
          "pId": "0",
          "url": null,
          "icon": "icon3.png",
          "sonmenu":[
               {
                   "id":"",
                   "name":"恶意域名监测",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"重点域名监测",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"未备案域名监测",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"域名服务器监测",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"综合统计",
                   "url":"default_demo.html",
                   "sonmenu":[]
               }
           ]
      },
      {
          "id": "", 
          "name": "网站安全监测", 
          "pId": "0",
          "url": null,
          "icon": "icon4.png",
          "sonmenu":[
               {
                   "id":"",
                   "name":"网站访问动态监测",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"网站攻击监测",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"恶意网站监测",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"下载监测",
                   "url":"default_demo.html",
                   "sonmenu":[]
               },
               {
                   "id":"",
                   "name":"域名地图",
                   "url":"default_demo.html",
                   "sonmenu":[]
               }
          ]
      },
      {
          "id": "", 
          "name": "DDoS攻击监测分析", 
          "pId": "0",
          "url": null,
          "icon": "icon5.png",
          "sonmenu":[
               {
                  "id":"",
                  "name":"DDoS攻击事件实时监测",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"DDOS-24h攻击详情展示",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"DDoS攻击事件历史详情查询",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"DDoS攻击监测目标设置界面",
                  "url":"default_demo.html",
                  "sonmenu":[]
               }
           ]
      },
      {
          "id": "60000", 
          "name": "异常事件挖掘分析", 
          "pId": "0",
          "url": null,
          "icon": "icon6.png",
          "sonmenu":[
               {
                  "id":"",
                  "name":"域名异常",
                  "url":"ymyc_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"下载异常",
                  "url":"xzyc_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"网站访问异常",
                  "url":"wzfwyc_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"流量异常",
                  "url":"llyc_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"未知应用分析",
                  "url":"wzyyfx.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"异常应用分析",
                  "url":"ycyyfx_demo.html",
                  "sonmenu":[]
               }
           ]
      },
      {
          "id": "60000", 
          "name": "综合查询", 
          "pId": "0",
          "url": null,
          "icon": "icon6.png",
          "sonmenu":[
               {
                  "id":"",
                  "name":"域名查询",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"IP查询",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"其他（QQ、邮箱）",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"安全事件追踪溯源",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"虚拟身份识别监测",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"信息安全管理效果",
                  "url":"default_demo.html",
                  "sonmenu":[]
               }
           ]
      },
      {
          "id": "", 
          "name": "报表导出", 
          "pId": "0",
          "url": null,
          "icon": "icon6.png",
          "sonmenu":[
               {
                  "id":"",
                  "name":"综合报表",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"分类统计报表",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"平均值和峰值统计报表",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"TopN报表",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"趋势报表",
                  "url":"default_demo.html",
                  "sonmenu":[]
               }
          ]
      },
      {
          "id": "", 
          "name": "系统管理", 
          "pId": "0",
          "url": null,
          "icon": "icon6.png",
          "sonmenu":[
               {
                  "id":"",
                  "name":"用户信息管理",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"用户权限管理",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"系统日志管理",
                  "url":"default_demo.html",
                  "sonmenu":[]
               }
           ]
      },
      {
          "id": "", 
          "name": "基础网管", 
          "pId": "0",
          "url": null,
          "icon": "icon6.png",
          "sonmenu":[
               {
                  "id":"",
                  "name":"应用组件运行状态监控",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"系统可用性监控",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"数据库监控",
                  "url":"default_demo.html",
                  "sonmenu":[]
               },
               {
                  "id":"",
                  "name":"服务器运行状态监控",
                  "url":"default_demo.html",
                  "sonmenu":[]
               }
           ]
      }
  ];

     //获取页面初始化地址和面包屑
     var st = [];
     function TraversalObject(obj)
     {
    	 
         st.push({id:obj.id,name:obj.name});
         if(obj["sonmenu"].length > 0){
             TraversalObject(obj["sonmenu"][0]); //递归遍历
         }

         if(obj["sonmenu"].length == 0){
             url = obj["url"];
         }
         return {
        	 st:st,
        	 url:url
         }
     }
     
 	 // $.ajax({  
 	 // 	type: "post", 
 	 // 	async: false,
 	 // 	url: ctx + "/Menu/menuList",
 	 // 	datatype: "json",   		
 	 // 	success: function(result) 
 	 // 	{  
   
 			//console.log(result);
 			createMenu(result);
 			
 			var firstData = result[0];
 			
 			var initStorage = TraversalObject(firstData);
	
 			var stroage = getStorage(initStorage.st);  ///获取面包屑缓存
 			var oop = {
 					el:"curmb",
 					data:stroage
 			}
			var curmb_1=new curmb(oop);
 			window.curmb_1 =curmb_1;
 			
 			$("#nav li.disable_click").mouseover(function(){
 				var curId = $(this).attr("data-id");
 				var stroage = getStorage(initStorage.st);  ///获取面包屑缓存
 				var stFirstId = stroage[0].id;
 				for(var s in stroage){
	 				var dataId = stroage[s].id;
	 				if(curId != stFirstId){
		 				$("#nav li[data-id='"+dataId+"']").trigger("mouseout");	
		 				$("#nav li[data-id='"+dataId+"']").removeClass("sfhover");
	 				}
	 			}
 				var w = $(this).width();
 				$(this).addClass("sfhover");
 				var index = $(this).index();
 				var len = $("#nav >li").length;
 				if(index  > len-3 && len > 12 && $(this).parent().attr("id") == "nav"){
 					$(this).find("ul").eq(0).css({"left":w,"bottom":0});
 				}else{
 					$(this).find("ul").eq(0).css({"left":w,"top":0});
 				}
 				
 			});
 			
 			$("#nav li.disable_click,#nav li.enable_click").mouseout(function(){
 				$(this).removeClass("sfhover");
 				$(this).find("ul").eq(0).css("left","-999em");
 			});
 		
 			$("#nav li.enable_click").mouseover(function(){
 				$(this).addClass("sfhover");
 				$(this).siblings().removeClass("sfhover");
 			});
 			
 			var iframeSrc = localStorage.getItem("iframeSrc");
			if(iframeSrc!=null && iframeSrc!=undefined){
				$("#iframeBox").attr("src", iframeSrc);
			}else{
				$("#iframeBox").attr("src", initStorage.url);
				localStorage.setItem("iframeSrc",initStorage.url);
			}
				
 			//a点击事件 加载iframe
			$("#nav li.enable_click").on('click', function(e) {
				
				e.preventDefault();
				e.stopPropagation();
				$(".history_wrap").hide();
				var href = $(this).find("a").attr("data-href");
				var dataId = $(this).attr("data-id");
				
				var pAs = $(this).parents("li.disable_click");
				var curText = $(this).find("a").text();
				var curId = $(this).attr("data-id");
				var data=[];
				var myStr="";
				for(var i=pAs.length-1;i>=0;i--)
				{
					var text = $(pAs[i]).children("a").text();
					var pId = $(pAs[i]).attr("data-id");
					data.push({id:pId,name:text});
				}
				data.push({id:curId,name:curText});
				myStr = JSON.stringify(data); //转换成字符串
				//console.log(myStr);

				if(href!=undefined || href != ""){ 
					$("#iframeBox").attr("src", href);             
				 	localStorage.setItem("iframeSrc",href);
					$.ajax({
						 type:"post",
						 url:"/history/insertPD",
						 data:{"menuname":curText,"menuurl":href,"pname":myStr,"id":curId},
						 dataType:"json",
						 success: function(result){
							 //查看session是否存在
							 if(result != undefined || result != null)
								{   
								    if(result.isAjax !=undefined){
								    	if(result.isAjax)
										{
											if(result.redirectUrl == null || result.redirectUrl == "" || result.redirectUrl == undefined)
												throw new error("redirectUrl not founds");
											if(result.isLogin)
												parent.location.href = result.redirectUrl;
											else
												location.href = result.redirectUrl;
										}
								    }
								}
							  
						 }
					});
					//}
					                 
				}
				
				$("#nav ul").css("left","-999em");
				window.curmb_1.setBreadcrumb(data);
			});
			
		 	$("#nav_box").mouseleave(function(){
		    	//$("#nav_box").css("left",-$(this).width());
		    	$("#nav_box").stop(true);
			    $("#nav_box").delay(1000).animate({left: -$(this).width()+"px"},'slow',function(){
			    	var stroage = getStorage(initStorage.st);  ///获取面包屑缓存
		 			for(var s in stroage){
		 				var dataId = stroage[s].id;
		 				$("#nav li[data-id='"+dataId+"']").trigger("mouseout");	
		 				$("#nav li[data-id='"+dataId+"']").removeClass("sfhover");
		 				
		 			} 
		 			//$("#nav li").removeClass("sfhover");
			    });
			    
			    
		    });

		    $(".left_space,#nav_box").mouseover(function(){
		    	$("#nav_box").stop(true);
			    $("#nav_box").animate({left: '0px'},'slow');
				   
			    if($(this).hasClass("left_space")){
		 			var stroage = getStorage(initStorage.st);  ///获取面包屑缓存
		 			for(var s in stroage){
		 				var dataId = stroage[s].id;
		 				$("#nav li[data-id='"+dataId+"']").trigger("mouseover");	
		 				$("#nav li[data-id='"+dataId+"']").addClass("sfhover");
		 			}
			    }
				   
		    }); 

	// 	},       
 	//  	error: function() {  
 	//  		alert("失败");
 	//  	}
 	// });

 	 

 	 
    $(window).resize(function(){
    	setRightBox();
    });
    
//    window.onbeforeunload = onbeforeunload_handler;
//    window.onunload = onunload_handler;
//    function onbeforeunload_handler(){  
//        localStorage.clear();
//    }
//       
//    function onunload_handler(){
//        localStorage.clear();
//     } 
    
    $(document).click(function(){
		 $(".history_wrap").hide();
	 });

    util.IframeOnClick.track(document.getElementById("iframeBox"), function() { $(".history_wrap").hide();}); 
    util.IframeOnClick.track(document.getElementById("tu_pie"), function() { alert("1");}); 

	setRightBox();//初始化右侧iframe宽高
	
	//初始化隐藏导航
	$("#nav_box").css("left",-$("#nav_box").width());

      $(".history_icon").on('click',function(e){
    	 e.stopPropagation();
         if(!$(".history_wrap").is(":visible")){
        	 $("#historyUL").empty();
        	  //查询当前用户的菜单历史记录
        	 $.ajax({
        		    type:"post",
        		    url:ctx+"/history/selectlist",
        		    dataType:"json",
        		    async:false,
        		    success: function(result){
        		    	if(result!=null&&result!=undefined&&result.length>0){
        		    		var str="";
        		    		result.forEach(function(m){
        		    			str += "<li class='enable_click'><a data-href='"+m.menuurl+"' data-str ='"+m.pname+"' data-id='"+m.id+"'><span>"+m.menuname+"</span></a></li>"
        		    		});
        		    		 $("#historyUL").append(str);

        		    		//a点击事件 加载iframe
        					$("#historyUL li.enable_click").on('click', function(e) {
        						e.preventDefault();
        						e.stopPropagation();
        						$(this).parents(".history_wrap").hide();
        						var myStr = $(this).find("a").attr("data-str");
        						var myStrObj = JSON.parse(myStr);
        						window.curmb_1.setBreadcrumb(myStrObj);
        						 
        						$("#iframeBox").attr("src", $(this).find("a").attr("data-href"));
        						localStorage.setItem("iframeSrc",$(this).find("a").attr("data-href"));
                                //点击历史记录，在历史记录信息里，再添加一条这个信息
        						$.ajax({
       							 type:"post",
       							 url:ctx+"/history/insertPD",
       							 data:{"menuname":$(this).find("a").text(),"menuurl":$(this).find("a").attr("data-href"),"pname":myStr,"id":$(this).find("a").attr("data-id")},
       							 dataType:"json",
       							 async:false,
       							 success: function(result){
       								 
       							 }
       						});
        					});
        		    		
        		    	}
        		    }
        		    
        	 });
           }
          $(".history_wrap").is(":visible")?$(".history_wrap").hide():$(".history_wrap").show();
         
      });
      $(".history_list a").on('click',function(){
          $(this).addClass("selected");
          $(this).parents("li").siblings().find("a").removeClass("selected");
          var href = $(this).attr("data-href");
          if(href!=undefined || href != ""){           
            $("#iframeBox").attr("src", href);             
            localStorage.setItem("iframeSrc",href);                   
          }
      });
      $(".exit_icon").on('click',function(){
         // alert('退出');
      });
      $(".personal_icon").on('click',function(){
          var pwdModify = "<div id='pwdModify' class='wa_dialog'></div>";
              layer.open({
                  type: 1,
                  title : "修改密码",
                  content:pwdModify,
                  area: ['380px','255px'],
                  shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                  moveType: 1,
                  skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                  btn: ['保存','关闭'],
                  yes:function(index, layero){
                	  var oldPwd=$("#oldPwd").val();
                	  var newPwd=$("#newPwd").val();
                	  var newConfirmPwd=$("#newConfirmPwd").val();
                	  var repass = new RegExp("[a-zA-Z_0-9]{8,16}", "");
                	  var tt=true;
                	  if(oldPwd==""){
                		  var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning' ><p>请输入原密码!</p></div></div>";
                          layer.open({
                              type: 1,
                              title : "提示",
                              content:alarm_tmpl,
                              area: ['300px','210px'],
                              shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                              moveType: 1,
                              skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                              btn: ['确定'],
                              yes:function(index, layero){
                                  layer.close(index);
                              }
                          });
                          return;
                	  }
                	  else if(newPwd==""){
                		  var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning' ><p>请输入新密码!</p></div></div>";
                          layer.open({
                              type: 1,
                              title : "提示",
                              content:alarm_tmpl,
                              area: ['300px','210px'],
                              shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                              moveType: 1,
                              skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                              btn: ['确定'],
                              yes:function(index, layero){
                                  layer.close(index);
                              }
                          });
                          return;
                	  }
                	  else if(!(/^\w{8,32}$/g).test(newPwd)){
                		  var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning' ><p>新密码输入有误，必须由字母、数字、下划线组成，长度为8至32位！</p></div></div>";
                          layer.open({
                              type: 1,
                              title : "提示",
                              content:alarm_tmpl,
                              area: ['350px','230px'],
                              shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                              moveType: 1,
                              skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                              btn: ['确定'],
                              yes:function(index, layero){
                                  layer.close(index);
                              }
                          });
                          return;
                	  }
                	 
                	  else  if(newConfirmPwd==""){
                		  var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning' ><p>请输入新密码确认！</p></div></div>";
                          layer.open({
                              type: 1,
                              title : "提示",
                              content:alarm_tmpl,
                              area: ['350px','210px'],
                              shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                              moveType: 1,
                              skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                              btn: ['确定'],
                              yes:function(index, layero){
                                  layer.close(index);
                              }
                          });
                          return;
                	  }
                      else if(!(/^\w{8,32}$/g).test(newConfirmPwd)){
                    	  var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning' ><p>新密码确认输入有误，必须由字母、数字、下划线组成，长度为8至32位！</p></div></div>";
                          layer.open({
                              type: 1,
                              title : "提示",
                              content:alarm_tmpl,
                              area: ['300px','230px'],
                              shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                              moveType: 1,
                              skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                              btn: ['确定'],
                              yes:function(index, layero){
                                  layer.close(index);
                              }
                          });
                          return;
                	  }
                	  else if(newPwd!=newConfirmPwd){
                		  var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning' ><p>两次输入的新密码不一致！</p></div></div>";
                          layer.open({
                              type: 1,
                              title : "提示",
                              content:alarm_tmpl,
                              area: ['300px','210px'],
                              shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                              moveType: 1,
                              skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                              btn: ['确定'],
                              yes:function(index, layero){
                                  layer.close(index);
                              }
                          });
                          return;
                	  }else{
                		  //保存修改的密码
                		  $.ajax({
              				url : ctx + "/login/changePwd",
              				type : 'post',
              				data:{"oldPassword":oldPwd,"newPassword":newPwd},
              				dataType:"json",
              				async:false,
              				success: function(result) {
              					if(result == true){
              						var alarm_tmpl = "<div class='alarm-message'><div class='alarm-prompt1' ><p>修改密码成功！</p></div></div>";
                                    layer.open({
                                        type: 1,
                                        title : "提示",
                                        content:alarm_tmpl,
                                        area: ['300px','210px'],
                                        shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                                        moveType: 1,
                                        skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                                        btn: ['确定'],
                                        yes:function(index, layero){
                                            layer.close(index);
                                        }
                                    });
              					}else{
              						tt=false;
              						 var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning' ><p>原密码不正确！</p></div></div>";
                                     layer.open({
                                         type: 1,
                                         title : "提示",
                                         content:alarm_tmpl,
                                         area: ['300px','210px'],
                                         shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                                         moveType: 1,
                                         skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                                         btn: ['确定'],
                                         yes:function(index, layero){
                                             layer.close(index);
                                         }
                                     });
                                     return;
              					}
              					
              				}
              				});
                	  }
                	  if(tt){
                		  layer.close(index);
                	  }
                  },
                  cancel: function(index){
                    layer.close(index);
                  }
              });
              $("#pwdModify").css({"width":"360px"});
              var op = {  
                  "component": [
                      {
                          "type": "password", 
                          "id": "oldPwd", 
                          "name" : "oldPwd",
                          "labelTxt": "原密码", 
                          "value": "", 
                          "width" : "200",
                          "key": [ ],
                          "IsWrap":true
                      },
                      {
                          "type": "password", 
                          "id": "newPwd", 
                          "name" : "newPwd",
                          "labelTxt": "新密码", 
                          "value": "", 
                          "width" : "200",
                          "key": [ ],
                          "IsWrap":true
                      },
                      {
                          "type": "password", 
                          "id": "newConfirmPwd", 
                          "name" : "newConfirmPwd",
                          "labelTxt": "新密码确认", 
                          "value": "", 
                          "width" : "200",
                          "key": [ ],
                          "IsWrap":true
                      }
                  ]
              }
              var pwdModify = new zSearchComponent(op);
              pwdModify.render("pwdModify");
      });

    });

    //计算右侧iframe宽高
	function setRightBox(){
	  	var winH = $(window).height();
	  	//初始化样式
	  	$("#right_box").css({
	    	"width" : $("body").width(),
	    	"height" : winH - 81
	  	});
	  	$("#iframeBox").css({
	    	"width" : $("body").width(),
	    	"height" : winH - 81
	  	});
	  	$("#nav_box,.left_space,#nav").css("height",winH - 81);
	}

	function getStorage(st){
    	var stroage = localStorage.getItem("stroage");  ///获取面包屑缓存
		if(stroage == null || stroage == undefined){
			stroage = st;
		}else{
			stroage = eval("("+stroage+")"); 
		}
		//console.log(stroage);
		return stroage
	}

	function createSecondMenu(data){
		var str ="<ul>";
		if(data){
			data.forEach(function(it){
				//console.log(it);
				//TODO 拼二级菜单li enable_click最后一级
				var thirdMenu = it.sonmenu;
				if(thirdMenu.length==0){
					str += "<li class='enable_click' data-id='"+it.id+"'><a data-href='"+it.url+"'><span>"+it.name+"</span></a>"
				}else{
					str += "<li class='disable_click' data-id='"+it.id+"'><a data-href='"+it.url+"'><span>"+it.name+"</span><i></i></a>";
				}
			   
				//创建3级菜单
				//var thirdMenu = it.sonmenu;
				if(thirdMenu.length){
					str += createThirdMenu(thirdMenu);
			}
				
			str += "</li>"
				
			});
		}
		str+="</ul>";
		return str;
	}

	function createThirdMenu(data){
		var str = "<ul>";
		if(data){
			data.forEach(function(m){
				//console.log(m);
				//拼3级菜单li
				var fourthMenu = m.sonmenu;
				if(fourthMenu.length==0){
					str += "<li class='enable_click' data-id='"+m.id+"'><a data-href='"+m.url+"'><span>"+m.name+"</span></a>"
				}else{
					str += "<li class='disable_click' data-id='"+m.id+"'><a data-href='"+m.url+"'><span>"+m.name+"</span><i></i></a>"
				}
				//创建4级菜单
				//var fourthMenu = m.sonmenu;
				if(fourthMenu.length){
					str += createFourthMenu(fourthMenu);
				}
				str += "</li>"
			});
		}
		str+="</ul>";
		return str;
	}

	function createFourthMenu(data){
		var str = "<ul>";
		if(data){
			data.forEach(function(n){
				//console.log(n);
				//拼5级菜单li
				//str += "<li class='disable_click'><a href='"+n.url+"'><span>"+n.name+"</span></a></li>"
				var fiveMenu = n.sonmenu;
				if(fiveMenu.length==0){
					str += "<li class='enable_click' data-id='"+n.id+"'><a data-href='"+n.url+"'><span>"+n.name+"</span></a>"
				}else{
					str += "<li class='disable_click' data-id='"+n.id+"'><a data-href='"+n.url+"'><span>"+n.name+"</span><i></i></a>"
				}
				//创建5级菜单
				//var fourthMenu = m.sonmenu;
				if(fiveMenu.length){
					str += createFiveMenu(fiveMenu);
				}
				str += "</li>"
			});
		}
		str += "</ul>";
		return str;
	}
	function createFiveMenu(data){
		var str = "<ul>";
		if(data){
			data.forEach(function(n){
				//console.log(n);
				//拼5级菜单li
				str += "<li class='enable_click' data-id='"+n.id+"'><a data-href='"+n.url+"'><span>"+n.name+"</span></a></li>"
			});
		}
		str += "</ul>";
		return str;
	}
	function createMenu(menuData){
		
		var menuStr ="";
		//TODO 递归4级菜单
	    menuData.forEach(function(oneData){
		   //console.log(oneData)
		   //拼1级菜单li
	      // if(oneData.sonmenu.length==0){
	      // 	  menuStr += "<li class='enable_click'><em class='nav_icon_" +oneData.id+ "' ></em><a data-href='"+oneData.url+"' ><span class='icon'>"+oneData.name+"</span></a>";
	      // }else{
	    	 //  menuStr += "<li class='disable_click disable_click_h'><em class='nav_icon_" +oneData.id+ "'></em><a data-href='"+oneData.url+"'><span class='icon'>"+oneData.name+"</span></a>";
	      // }
		  
		  if(oneData.sonmenu.length==0){
              menuStr += "<li class='enable_click' data-id='"+oneData.id+"'><em><img src='images/menu/"+oneData.icon+"'/></em><a data-href='"+oneData.url+"' ><span class='icon'>"+oneData.name+"</span></a>";
          }else{
              menuStr += "<li class='disable_click disable_click_h' data-id='"+oneData.id+"'><em><img src='images/menu/"+oneData.icon+"'/></em><a data-href='"+oneData.url+"'><span class='icon'>"+oneData.name+"</span></a>";
          }

		   //TODO 二级
		   var secondMenu = oneData.sonmenu;
		   if(secondMenu.length){
			   // 创建二级菜单
			   menuStr += createSecondMenu(secondMenu);
			   
		   }
		   menuStr +="</li>";
	   });
	   $("#nav").append(menuStr);
	}

});

