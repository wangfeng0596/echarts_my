/**
 * 数据配置文本框组件
 * textComponent
 */
define(function (require) {

    var $ = require("jquery");
    var Util = require("./zUtil");
    var validateComponent = require("./validateComponent");
	
    var _TMPL = "<div class='input_box {{hide_cls}}'>\
					{{if txt !=''}}<span class='lbl_txt'>{{txt}}</span>{{/if}}\
					{{if type == 'hidden'}}\
						<input type='hidden' id='{{id}}' name='{{name}}' value='{{value}}' />\
					{{else}}\
						<input type='{{type}}' class='x_form_text {{cls}}' id='{{id}}' name='{{name}}' value='{{value}}' {{if maxLength>0 }} maxlength='{{maxLength}}' {{/if}} {{if disabled}} disabled {{/if}}/>\
                        {{if validate}}<span class='tip_star'>*</span>{{else}}<span class='tip_star'></span>{{/if}}\
					{{/if}}\
					{{if afterTxt !=''}}<span class='after_text'>{{afterTxt}}</span>{{/if}}\
				</div>{{if IsWrap }} <br /> {{/if}}";
	
    var zDs_TextClass = Util.Class({
    		init:function(opt){
				this.option = opt ; 
				this.create();
                this.bindOnClick();
    			return this;
    		},
    		create : function(){
				var cls = this.option.baseOption.cls || ""; 
				var txt = this.option.txt.length>0?this.option.txt+"：" : this.option.txt;
				var width = this.option.baseOption.width;
				var hide_cls = "";
				if(this.option.baseOption.type == "hidden"){
					hide_cls = " hide_input";
				}
                var type = this.option.baseOption.type;
                if(type == 'date') {
                    type = 'text';
                }
				this.box = $(Util.template(_TMPL,{
					txt:txt,
					cls:cls,
					name:this.option.name,
					id:this.option.id,
					type:type,
					value:this.option.baseOption.value,
					hide_cls : hide_cls,
                    IsWrap : this.option.baseOption.IsWrap,
                    validate : this.option.baseOption.validate,
                    disabled:this.option.baseOption.disabled,
                    afterTxt:this.option.baseOption.afterTxt,
                    maxLength:this.option.baseOption.maxLength,
				}));
                this.singleCom = this.box.find("input");
				this.singleCom.css({width:width-2});
    		},
            bindOnBlur:function(opt){
                var me = this;
                //if(me.option.baseOption.validate){
//                    me.singleCom.on('blur',function(){
//                        new validateComponent(me,opt); 
//                    });
                //}
            },
            bindOnClick:function(){
                var me = this;
                var fn = me.option.baseOption.click;
                me.singleCom.on('click',function(){
                    me.eventHandler(fn);
                });
            },
    		setValue:function(value){
    			this.box.find("input").val(value);
    		},
    		getValue:function(){
    			return this.box.find("input").val();
    		},
    		getText:function(){
    			return this.box.find("input").val();
    		},
            setLabelText:function(text){
                this.box.find(".lbl_txt").text(text+"：");
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

    return zDs_TextClass;
});