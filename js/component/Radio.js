/**
 * 数据配置单选钮组件
 * radioComponent
 */
define(function (require) {

    var $ = require("jquery");
    var Util = require("./zUtil");
    
    var _TMPL = "<div class='input_box'>\
                    <span class='lbl_txt'>{{txt}}</span>\
                    <div id={{id}} class='radio_wrap'>\
                        {{each list as value index}}\
                            <input type='radio' name='{{name}}' value='{{value.compKey}}' {{if defaultValue.indexOf(value.compKey)  > 0 }} checked {{/if}} {{if disabled}} disabled {{/if}}/>\
                            <span class='r_txt'>{{value.compValue}}</span>\
                        {{/each}}\
                    </div>\
                </div>{{if IsWrap }} <br> {{/if}}";
    
    var zDs_RadioClass = Util.Class({
            init:function(opt){
                this.option = opt ; 
                this.create(); 
                this.bindChange();
                return this;
            },
            create : function(){
                var cls = this.option.cls || "x_form_text"; 
                var txt = this.option.txt.length>0?this.option.txt+"：" : this.option.txt;
                var width = this.option.baseOption.width;
                var data = {
                    txt:txt,id:this.option.id,
                    name:this.option.name,
                    defaultValue:this.option.baseOption.value,
                    list:[],
                    IsWrap : this.option.baseOption.IsWrap,
                    disabled:this.option.baseOption.disabled
                };
                data.list = this.option.baseOption.key;

                this.box = $(Util.template(_TMPL,data));
                this.singleCom = this.box.find(".radio_wrap");
                this.singleCom.css({width:width-2});
            },
            setValue:function(value){
                this.box.find("input[value="+ value +"]").prop("checked",true);
            },
            getValue:function(){
                return this.box.find("input[type=radio]:checked").val();
            },
            getText:function(){
                //return this.box.find("input").val();
            },
            bindChange:function(){
                var me = this;
                var fn = me.option.baseOption.change;
                me.box.find("input[type=radio]").on('click',function(){
                    me.eventHandler(fn);
                });
                
            },
            setHidden:function(){
                this.box.hide();
            },
            setVisible:function(){
                this.box.show();
            },
            eventHandler:function(fn){
                var me = this;
                if($.isFunction(fn)){
                     return fn && fn(me);
                }
            },
            clear : function(){
                this.setValue("");
            }
    });

    return zDs_RadioClass;
});