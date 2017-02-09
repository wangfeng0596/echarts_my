/**
 * 查询组件 直连点
 * zSearchComponent
 * creater wf
 */
define(function (require) {

    var $ = require("jquery");
    var util = require("./zUtil");
    var TextComponent = require("./Text");
    var DateComponent = require("./Date");
    var TextNumberComponent = require("./TextNumber");
    var TextareaComponent = require("./Textarea");
    var SelectComponent = require("./Select");
    var ButtonComponent = require("./Button");
    var RadioComponent = require("./Radio");
	var CheckboxComponent=require("./Checkbox");
    var SwitchBtnComponent = require("./SwitchBtn");
    var validateComponent = require("./validateComponent");

    var MainCls = "searchContainer",
        ComponentCls = "searchComponent",
        BtnCls = "searchBtn",
        TMPL ="<div class='{{MainCls}} clear'>\
                    <div class='{{ComponentCls}}'></div>\
                    <div class='{{BtnCls}}'></div>\
                </div>"; 
   
    var SearchComponent = util.Class({
        init : function(opt){
            this.option = opt;
            this.create();
        },
        create : function(){
            this.components = [];
            this.box = $(util.template(TMPL,{
                MainCls:MainCls,
                ComponentCls: ComponentCls,
                BtnCls:BtnCls       
            }));
            this.componentBox = $("."+ComponentCls,this.box);
            this.btnBox  = $("."+BtnCls,this.box);
            // 添加组件
            this.addComponent();
            // 添加按钮
            this.addBtns();
            // 
            this.build();

            this.bindOnBlur();
        },
        build: function(){
            var me = this;
            if(me.components){
               me.components.forEach(function(_comp){
                   me.componentBox.append(_comp.box)
               });     
            }
            if(me.btns){
                me.btns.forEach(function(_btn){
                    me.btnBox.append(_btn.box);     
                });
            }   
        },
        addComponent : function(){
            var me = this,_comp;
            if(this.option.component){
                this.option.component.forEach(function(item){
                    var op = {
                        id : item.id,
                        txt : item.labelTxt,
						name : item.name,
                        optList : item.key,
                        baseOption : item
                    }
                    _comp = me.createComponent(item.type,op);
                    me.components.push(_comp);     
                });
            }
        },
        //动态增加查询条件
        addOtherComponent:function(otherComponent){
        	 var me = this,_comp,otherComponents=[];
             if(otherComponent){
            	 otherComponent.forEach(function(item){
                     var op = {
                         id : item.id,
                         txt : item.labelTxt,
 						 name : item.name,
                         optList : item.key,
                         baseOption : item
                     }
                     _comp = me.createComponent(item.type,op);
                     otherComponents.push(_comp);    
                 });
             }
             if(otherComponents){
            	 otherComponents.forEach(function(_comp){
                     me.componentBox.append(_comp.box)
                 });     
             }
        },
        //生成查询组件
        createComponent:function(type,opt){
        	var componentObj;
        	switch(type){
	            case "select" :                                
	                componentObj = new SelectComponent(opt);
	                break;       
	            case "text" : 
	            	componentObj = new TextComponent(opt);
	                break; 
	            case "textNumber" : 
	            	componentObj = new TextNumberComponent(opt);
	                break;  
	            case "password" : 
	            	componentObj = new TextComponent(opt);
	                break;                   
	            case "date" : 
	            	componentObj = new DateComponent(opt);
	                break;                        
	            case "checkbox" : 
	            	componentObj = new CheckboxComponent(opt);
	                break;                        
	            case "radio" : 
	            	componentObj = new RadioComponent(opt);
	                break;
				case "hidden":
					opt.type = "hidden";
					componentObj = new TextComponent(opt);
	                break; 
				case "textarea":
					componentObj = new TextareaComponent(opt);
	                break; 
	            case "switch":
	            	componentObj = new SwitchBtnComponent(opt);
	                break;
	            default : break;
	        } 
        	return componentObj;
        },
        //添加按钮
        addBtns:function(){
            var me =this;
            me.btns = [];
            if(this.option.btn){
                this.option.btn.forEach(function(btnConfig){
                     me.btns.push(new ButtonComponent(btnConfig));
                });
            }
        },
        //渲染查询区
        render : function(container){
            if(container !=null && typeof container =="string"){
                $("#"+container).append(this.box);
                $("#"+container).css("height",$("#"+container).height());
                //console.log($("#"+container).height());
                var  w = this.componentBox.width();
                this.btnBox.css("left",w);
            }
        },
        clear : function(){
            if(this.components){
                this.components.forEach(function(item){
                   item.clear();
                }) 
            }
        },
        //获取单个组件的值
        getSingleValue : function(id){
            var val="";
            if(this.components){
                this.components.forEach(function(item){
                     if(item.option.id == id){
                        val = item.getValue();
                    }
                }) 
            }
            return val;
        },
        //获取单个组件的文本
        getSingleText : function(id){
            var text="";
            if(this.components){
                this.components.forEach(function(item){
                     if(item.option.id == id){
                        text = item.getText();
                    }
                }) 
            }
            return text;
        },
        //获取所有查询组件的值，返回数组对象
        getValue : function(){
            var data = [];
            if(this.components){
                this.components.forEach(function(item){
                    data.push({
                        id : item.option.id,
                        value : item.getValue()
                    })
                }) 
            }
            return data;
        },
        //批量设置组件的值 传入参数数组对象
		setValue : function(data){
			if(this.components){
				 this.components.forEach(function(item){
                     for(var d in data){
					 	if(data[d].id == item.option.id){
							item.setValue(data[d].value);
						}
					 }
                }) 
			}
		},
        //批量设置组件前面的文字 即label
        setLabelText:function(data){
            if(this.components){
                 this.components.forEach(function(item){
                     for(var d in data){
                        if(data[d].id == item.option.id){
                            item.setLabelText(data[d].text);
                        }
                     }
                }) 
            } 
        },
        //获取所有组件选中项的text 返回数组对象
        getText : function(){
            var data = [];
            if(this.components){
                this.components.forEach(function(item){
                    data.push({
                        id : item.option.id,
                        text : item.getText()
                    })
                }) 
            }
            return data;
        },
        //设置select下拉框内容
        setOpList:function(id,list){
            //console.log(id);
            if(this.components){
                this.components.forEach(function(item){
                    if(item.option.id == id){
                        item.setOpList(list);
                    }
                }) 
            }
        },
        //获取单个组件对象
        getComObj:function(id){
            var curObj;
            if(this.components){
                this.components.forEach(function(item){
                    if(item.option.id == id){
                        curObj = item;
                    }
                }); 
            } 
            return curObj;
        },
        //隐藏查询组件,传入id数组
        setSingleComHidden:function(data){
            if(this.components){
                 this.components.forEach(function(item){
                     for(var d in data){
                        if(data[d] == item.option.id){
                            item.setHidden();
                        }
                     }
                }) 
            }
        },
        //显示查询组件,传入id数组
        setSingleComVisible:function(data){
            if(this.components){
                 this.components.forEach(function(item){
                     for(var d in data){
                        if(data[d] == item.option.id){
                            item.setVisible();
                        }
                     }
                }) 
            }
        },
        //全部区域隐藏
        setAllHidden:function(){
            this.box.hide();
        },
        //全部区域显示
        setAllVisible:function(){
            this.box.show();
        },
        //表单区域隐藏
        setComponentHidden:function(){
            this.componentBox.hide();
        },
        //表单区域显示
        setComponentVisible:function(){
            this.componentBox.show();
        },
        //按钮单个隐藏 传入name数组
        setSingleBtnHidden:function(data){
            if(this.btns){
                this.btns.forEach(function(item){
                    for(var d in data){
                       if(data[d] == item.option.name){
                           item.setHidden();
                       }
                    }
               }) 
           }
        },
        //按钮单个显示 传入name数组
        setSingleBtnVisible:function(data){
            if(this.btns){
                this.btns.forEach(function(item){
                    for(var d in data){
                       if(data[d] == item.option.name){
                           item.setVisible();
                       }
                    }
               }) 
           }
        },
        //按钮区域隐藏
        setBtnHidden:function(){
            this.btnBox.hide();
        },
        //按钮区域显示
        setBtnVisible:function(){
            this.btnBox.show();
        },
        //绑定失去焦点事件
        bindOnBlur:function(){
            var vOpt = this.option.validate;
            if(this.components){
                this.components.forEach(function(item){
                    for(var v in vOpt){
                        if(vOpt[v].id == item.option.id){
                            item.bindOnBlur(vOpt[v]);
                        }
                    }
                    
                }) 
            } 
        },
        //表单验证，不验证隐藏的区域，只验证（visible）区域
        validate:function(){
            var vOpt = this.option.validate;
            var errorLength = 0;
            if(this.components){
                this.components.forEach(function(item){
                    for(var v in vOpt){
                        if(vOpt[v].id == item.option.id){
                        	if(item.box.is(":visible")){
                        		var valid = new validateComponent(item,vOpt[v]);
                                if (valid.errLen > 0) {
                                    errorLength += 1;
                                };
                        	}
                            
                        }
                    }
                    
                }) 
            }
            return errorLength;
        },
        //表单验证,包含隐藏的区域（hidden）也进行验证
        validateAll:function(){
            var vOpt = this.option.validate;
            var errorLength = 0;
            if(this.components){
                this.components.forEach(function(item){
                    for(var v in vOpt){
                        if(vOpt[v].id == item.option.id){
                                var valid = new validateComponent(item,vOpt[v]);
                                if (valid.errLen > 0) {
                                    errorLength += 1;
                                };
                            
                        }
                    }
                    
                }) 
            }
            return errorLength;
        }
    });


    return SearchComponent;
});