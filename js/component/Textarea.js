/**
 * 数据配置文本域组件
 * textComponent 包含 btnScoller
 */
define(function (require) {

    var $ = require("jquery");
    var Util = require("./zUtil");
    var validateComponent = require("./validateComponent");
	var _TMPL = "<div class='input_box'>\
					{{if txt !=''}}<span class='lbl_txt'>{{txt}}</span>{{/if}}\
					<textarea class='{{cls}}' id='{{id}}' name='{{name}}' {{if disabled}} disabled {{/if}}>{{content}}</textarea>\
                    {{if validate}}<span class='tip_star'>*</span>{{else}}<span class='tip_star'></span>{{/if}}\
                    {{if afterTxt !=''}}<span class='after_text'>{{afterTxt}}</span>{{/if}}\
				</div>{{if IsWrap }} <br /> {{/if}}";
	
	
	var zDs_TextareaClass = Util.Class({

    		init:function(opt){
    			this.option = opt;
    			this.create();
    			return this;
    		},
    		create : function(){
				var cls = this.option.cls || "x_area_text"; 
				var width = this.option.baseOption.width;
				var height = this.option.baseOption.height;
				var txt = this.option.txt.length>0?this.option.txt+"：" : this.option.txt;
				var data = {
                    txt:txt,
                    cls:cls,
                    id:this.option.id,
                    name:this.option.name,
                    disabled:this.option.baseOption.disabled,
                    content:this.option.baseOption.value,
                    IsWrap : this.option.baseOption.IsWrap,
                    afterTxt:this.option.baseOption.afterTxt,
                    validate : this.option.baseOption.validate
                };
				this.box = $(Util.template(_TMPL,data));
                this.singleCom = this.box.find("textarea");
				this.singleCom.css({width:width,height:height});
				
    		},
            bindOnBlur:function(opt){
            	var me = this;
               // if(me.option.baseOption.validate){
//                    me.singleCom.on('blur',function(){
//                        new validateComponent(me,opt); 
//                    });
                //}
            },
    		setValue:function(value){
    			this.box.find("textarea").val(value);	
    		},
    		getValue:function(){
    			return this.box.find("textarea").val();
    		},
            getText:function(){
                return this.box.find("textarea").val();
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
			clear : function(){
                this.setValue("");
            },
    		// 在光标处插入字符串
    		// myField 文本框对象
    		// 要插入的值
    		insertAtCursor:function(myValue){
    			var myField = this.area[0];
    			//IE support
    			if (document.selection)
    			{
    				myField.focus();
    				var sel = document.selection.createRange();
    				sel.text = myValue;
    				sel.select();
    			} //MOZILLA/NETSCAPE support
    			else if (myField.selectionStart || myField.selectionStart == '0')
    			{
    				var startPos = myField.selectionStart;
    				var endPos = myField.selectionEnd;
    			// save scrollTop before insert
    				var restoreTop = myField.scrollTop;
    				myField.value = this.getValue().substring(0, startPos) + myValue + this.getValue().substring(endPos,this.getValue().length);
    				if (restoreTop > 0)
    				{
    					// restore previous scrollTop
    					myField.scrollTop = restoreTop;
    				} 
    				myField.focus();
    				myField.selectionStart = startPos + myValue.length;
    				myField.selectionEnd = startPos + myValue.length;
    			} 
    			else {
    				
    				myField.value += myValue;
    				myField.focus();
    			}

    		}
	    });

	
    
    return zDs_TextareaClass;
});