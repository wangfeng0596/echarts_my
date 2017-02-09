/**
 * 
 * button.js
 */
define(function (require) {

    var $ = require("jquery");    
    var Util = require("./zUtil");
    var _TMPL = "<div class='input_box' id={{id}}>\
					<span class='searchLabel'>{{txt}}</span>\
                    <div class='lcs_label lcs_label_on'>{{onLabel}}</div>\
					<div class='lcs_switch  lcs_checkbox_switch {{switchFlag}}'>\
    					<div class='inner_lcs_label_on'></div>\
                        <div class='lcs_cursor'></div>\
    					<div class='inner_lcs_label_off'></div>\
                    </div>\
                    <div class='lcs_label lcs_label_off'>{{offLabel}}</div>\
				</div>{{if IsWrap }} <br> {{/if}}";

    var switchBtnComponent = Util.Class({
        init : function(opt){
                this.option = opt;
                this.create();
                //this.addComponent(this);
               // this.hideTitle(); 
                this.bind();  
                return this;
        },
        create : function(){
		    var data = {
                id:this.option.id,
                txt:this.option.txt,
                onLabel:this.option.baseOption.onLabel || "是",
                offLabel:this.option.baseOption.offLabel || "否",
                switchFlag:this.option.baseOption.value == "1" ? "lcs_on":"lcs_off",
                IsWrap : this.option.baseOption.IsWrap
            };
            this.box = $(Util.template(_TMPL,data));
            this.switchBtn = this.box.find(".lcs_switch");
            this.switchBtn.css("width",this.option.baseOption.width);

            this.option.leftVal = parseInt(this.switchBtn.css("width")) - 19 + "px";
            if(this.option.baseOption.value == "1"){
                this.switchBtn.find(".lcs_cursor").css({"left":"3px"});
            }else{
                this.switchBtn.find(".lcs_cursor").css({"left":this.option.leftVal})
            }
        },
        getValue : function(){
            var isOn = this.switchBtn.hasClass('lcs_on') ;
            return isOn ? "1" : "0";
        },
        bind : function(){
            var me = this;
            var fn = me.option.baseOption.change;
            if(me.box){
                me.switchBtn.find("div").on("click", function(){
                    if( me.switchBtn.hasClass('lcs_on') ){
                        me.switchBtn.removeClass('lcs_on').addClass('lcs_off');
                        me.switchBtn.find(".lcs_cursor").css({"left":me.option.leftVal});
                        me.eventHandler(fn);
                    }else{
                        me.switchBtn.removeClass('lcs_off').addClass('lcs_on');
                        me.switchBtn.find(".lcs_cursor").css({"left":"3px"});
                        me.eventHandler(fn);
                    }
                });
            }
        },
        eventHandler:function(fn){
            var me = this;
            if($.isFunction(fn)){
                 return fn && fn(me);
            }
        },
        getText:function(){

        },
        setValue:function(value){
            var me = this;
            if (value == "1") {
                me.switchBtn.removeClass('lcs_off').addClass('lcs_on');
                me.switchBtn.find(".lcs_cursor").css({"left":"3px"});
            }else{

                me.switchBtn.removeClass('lcs_on').addClass('lcs_off');
                me.switchBtn.find(".lcs_cursor").css({"left":me.option.leftVal});
            }

        }
    })
    
    return switchBtnComponent;
});