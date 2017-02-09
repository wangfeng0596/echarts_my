/**
 * 数据配置文本框组件
 * textComponent
 */
define(function (require) {

    var $ = require("jquery");
    var Util = require("./zUtil");
    require("tooltipster");
    require("./Date");

    var _TMPL = "<div class='htmleaf-container'>\
                    <div class='container'>\
                        <div class='timeline'>\
                            {{each list as item index}}\
                                <div class='timeline-item'>\
                                    <div class='timeline-icon'></div>\
                                    <div class='timeline-content {{if (index+1)%2==0 }} right {{/if}}'>\
                                        <ol>\
                                            <li>{{index+1}}：{{item.time}}</li>\
                                            {{each item.fields as value index2}}\
                                                <li><span>{{value.name}}:</span><b {{if index2 == item.fields.length-1}} class='mytip' {{/if}} >{{value.value}}</b></li>\
                                            {{/each}}\
                                        </ol>\
                                        <p class='{{if (index+1)%2==0 }} p2 {{else}} p1 {{/if}}'>{{item.time.split(' ')[0]}}</p>\
                                    </div>\
                                </div>\
                            {{/each}}\
                        </div>\
                    </div>\
                </div>";
	
    var timeSpan = Util.Class({
    		init:function(opt){
				this.option = opt ; 
				this.create();
				this.bindTip();
    			return this;
    		},
    		create : function(){
				var time = this.option.time;
				var data = {
                    list : []
                };
                data.list = this.option.fieldList;
				this.box = $(Util.template(_TMPL,data));	
				
				var items = this.box.find(".timeline-item");
				var line_T = 112*items.length+50;
				var total_H = 0;
				for(var i=0;i<items.length;i++){
					var curObj = items[i];
					var h = $(curObj).find(".timeline-content li").length*18 + 58;
					total_H = total_H + h;
					if(i%2==0){
						
						$(curObj).css({"left":"0px","top":-(40*i)+"px"});
					}else{
						$(curObj).css({"right":"0px","top":-(40*i)+"px"});
					}
				}
			
				//奇数个item 和 偶数个item 线的长度
				/*
				if(items.length%2 == 0){
					this.box.find(".timeline").css("height",total_H+50+"px");
				}else{
					this.box.find(".timeline").css("height",total_H+"px");
				}*/
				this.box.find(".timeline").css("height",line_T+"px");
				

    		},
            bindTip:function(){
            	var me = this;
            	me.box.find('.mytip').each(function(){
            		var con = $(this).text();
					//$(this).addClass("hint--top");
					//$(this).attr("data-hint",con);
					$(this).tooltipster({
						tipOptanimation: 'fade',
			            touchDevices: false,
					    position:'top-left',
					    //offsetX:'-70px',
			            arrow:true,
						content:con,
					    trigger: 'hover',
						theme: 'tooltipster-light'							
					});	
		
            	});
            },
            eventHandler:function(fn){
                var me = this;
                if($.isFunction(fn)){
                     return fn && fn(me);
                }
            },
            clear : function(){

            }
    });

    return timeSpan;
});