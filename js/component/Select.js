/**
 * 下拉选择组件
 * Select
 */
define(function (require) {

    var $ = require("jquery");
    var Util = require("./zUtil");
	var S = require("selectize");
	var multiple = require("multiple");
	
	var _TMPL = "<div class='input_box'>\
					{{if txt !=''}}<span class='lbl_txt'>{{txt}}</span>{{/if}}\
					<select id='{{id}}' name='{{name}}' {{if multiple}} multiple='multiple' {{/if}}>\
						{{if isAll && !multiple}}<option value=' '>全部</option> {{/if}}\
						{{each list as value index}}\
							<option value='{{value.compKey}}' {{each defaultValue as dvalue dindex}}{{if dvalue == value.compKey}} selected {{/if}} {{/each}}>{{value.compValue}}</option>\
						{{/each}}\
					</select>\
                    {{if validate}}<span class='tip_star'>*</span>{{else}}<span class='tip_star'></span>{{/if}}\
                    {{if afterTxt !=''}}<span class='after_text'>{{afterTxt}}</span>{{/if}}\
				</div>{{if IsWrap }} <br /> {{/if}}";

	var zDs_SelectClass = Util.Class({

    		init:function(opt){
    			this.option = opt;
    			this.create();
    			return this;
    		},
    		create : function(){
				//var cls = this.option.cls; 
				var me = this;
				var width = this.option.baseOption.width;
				var txt = this.option.txt.length>0?this.option.txt+"：" : this.option.txt;
				var deValue = this.option.baseOption.value;
				if(!(deValue instanceof Array)){
					deValue = JSON.parse(this.option.baseOption.value);
				}
				var data = {
                    txt:txt,
                    id:this.option.id,
                    name:this.option.name,
                    defaultValue:deValue,
                    multiple:this.option.baseOption.multiple,
                    isAll:this.option.baseOption.isAll,
                    list:[],
                    IsWrap : this.option.baseOption.IsWrap,
                    validate : this.option.baseOption.validate
                };
				data.list = this.option.baseOption.key;
				this.box = $(Util.template(_TMPL,data));
                this.singleCom = this.box.find("select");
				this.singleCom.css({width:width});
                
                var fn = function() {
                    return me.option.baseOption.change;
                };

				if(this.option.baseOption.multiple){
					this.singleCom.multipleSelect({
						allSelected:"全部",
						selectAllText:"全部",
						minimumCountSelected:1,
						noMatchesFound: ''
					});
					if(me.option.baseOption.checkAll){
						this.singleCom.multipleSelect("checkAll");
					}
                    if(this.option.baseOption.disabled){
                        this.singleCom.multipleSelect("disable");
                    }
				}
				else{
					var $select = this.singleCom.selectize({
						create: true,
                        valueField: 'compKey',
                        labelField: 'compValue',
                        searchField: 'compValue',
                        onChange : me.eventHandler(fn)
					});
					this.control = $select[0].selectize;
                    if(this.option.baseOption.disabled){
                        this.control.disable(); 
                    }
				}	
    					
    		},
            bindOnBlur:function(opt){
                var me = this;
                //if(me.option.baseOption.validate){
//                    me.singleCom.on('blur',function(){
//                        new validateComponent(me,opt); 
//                    });
                //}
            },
    		setOpList:function(list){
                if (!this.option.baseOption.multiple) {
                    this.control.clearOptions();
                    if(this.option.baseOption.isAll){
                        this.control.addOption({
                            compKey: ' ',
                            compValue: '全部'
                        });
                    }
                   
                    for(var l in list){
                        this.control.addOption({
                            compKey: list[l].compKey,
                            compValue: list[l].compValue
                        });  
                    }
					//修改原因：当list=[]时，list[0].compKey会报错"Cannot read property 'compKey' of undefined"
                    //新增判断是否有全部选项，如果有则默认选择全部
                    if(this.option.baseOption.isAll){
                    	this.setValue(' ');
                    }else{
                    	 if(list!=undefined && list.length > 0){
                         	this.setValue(list[0].compKey);
                         }else{
     						this.setValue(' ');
     					}	
                    }
                   
                    
                }else{
                	 this.singleCom.empty();
                	 for(var l in list){
                    	 var $opt = $("<option />", {
                             value: list[l].compKey,
                             text: list[l].compValue
                         });
                    	 this.singleCom.append($opt);
                	 }
                	 this.singleCom.multipleSelect("refresh");

                };
    			
    		},
    		getValue:function(){
    			//var value = this.getContent("value");
				var value = "";
				if(this.option.baseOption.multiple){
					value = this.box.find("select").multipleSelect("getSelects");
				}else{
					value = this.control.getValue();
				}
    			return value;
    		},
			setValue:function(value){ //value=[1,2]
				if(this.option.baseOption.multiple){
					if (value.length==0) {
                        this.box.find("select").multipleSelect("checkAll");
                    }else{
                       this.box.find("select").multipleSelect("setSelects", value);
                    };
				}else{
					this.control.setValue(value);
				}
			},
			getText:function(){
				var str = "";
				if(this.option.baseOption.multiple){
					str = this.box.find("select").multipleSelect("getSelects", "text");
				}else{
					//this.control.setValue(value);
					var sels = this.box.find("select").children('option:selected');
					str = sels.text();
				}
				return str;
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
            	if(this.option.baseOption.multiple){
            		this.setValue('');
            	}else{
            		//if(this.option.baseOption.isAll){
            			this.setValue(' ');
            		//}else{
            		//	if(this.option.baseOption.key!=undefined){
            		//		this.setValue(this.option.baseOption.key[0].compKey);
            		//	}
            		//}
            		
            	}
				
               
            }

	    });

    return zDs_SelectClass;

});
