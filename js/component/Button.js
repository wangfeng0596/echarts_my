/**
 * 
 * button.js
 */
define(function (require) {

    var $ = require("jquery");    
    var Util = require("./zUtil");
    var _TMPL = "<div class='btn_box'>\
					<div class='{{cls}}'>\
                        {{if type == 'file'}}<input type='file' name='{{fileId}}' id='{{fileId}}' class='importfile' value='' />{{/if}}\
						<span>{{name}}</span>\
						{{if list}}\
							<em class='x-btn-arrow'></em>\
						{{/if}}\
					</div>\
					{{if list}}\
						<ul class='export_list'>\
							{{each list as value index}}\
								<li value='{{value.type}}' name='{{value.name}}'>{{value.text}}</li>\
							{{/each}}\
						</ul>\
					{{/if}}\
				</div>{{if IsWrap }} <br> {{/if}}";

    var buttonComponent = Util.Class({
        init : function(option){
          this.option = option ; 
          this.create();
          this.bind();     
        },
        create : function(){
          var cls = this.option.cls || "btn"; 
		  var menu = this.option.menu;
		  var data = {
                cls:cls,
                type:this.option.type,
                fileId:this.option.fileId,
                name:this.option.name,
                id:this.option.id,
                list:[]
            };
		  data.list = menu;
          this.box = $(Util.template(_TMPL,data));
        },
        bind : function(){
        	var me = this;
			var menu = this.option.menu;
			var callback = this.option.click;

            this.box.find('div').on('click',function(e){
				e.stopPropagation();
				//e.preventDefault();
            	var _this = this;
				var showFlg = $(_this).hasClass("btn_selected");
				var export_list = me.box.find(".export_list");
	
				if($.isFunction(callback)){
					callback && callback();
					//return;
				}
				if(menu!=undefined){
					if(!showFlg){
						$(_this).addClass("btn_selected");
						export_list.show();
						if(menu!=undefined){
							export_list.find("li").unbind('click');
							export_list.find("li").on('click',function(e){
								e.stopPropagation();
								e.preventDefault();
								var name = $(this).attr("name");
								var type = $(this).attr("value");
								for(var k in menu){
									if(menu[k].type == type && menu[k].name == name ){
										var callback = menu[k].onclick;
										if($.isFunction(callback)){
											callback && callback();
											$(_this).removeClass("btn_selected");
											export_list.hide();
											return;
										}
									}
								}
								$(_this).removeClass("btn_selected");
								export_list.hide();
								
							});
							$(document).click(function(){
								$(_this).removeClass("btn_selected");
								export_list.hide();
							});
						}

					}else{
						$(_this).removeClass("btn_selected");
						export_list.hide();
					}
				}
				
            });

        },
        setHidden:function(){
            this.box.hide();
        },
        setVisible:function(){
            this.box.show();
        },
    })
    
    return buttonComponent;
});