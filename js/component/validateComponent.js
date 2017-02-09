/**
 * 验证组件
 * 
 */
define(function (require) {

    var $ = require("jquery");
    var util = require("./zUtil");

    var MainCls = "my_tooltip",
        TipCls = "my_content";
        TMPL =  "<div class='{{MainCls}}'>\
                    <div class='{{TipCls}}'>\
                        <font class='tip_star' style='vertical-align:middle;'><img style='margin-top:-2.6px'; src='./images/cook1.png'></font>\
                        <span>{{message}}</span>\
                    </div>\
                </div>"; 
   
    var ValidateComponent = util.Class({
        init : function(zS,opt){
            this.zS = zS;
            this.option = opt;
            this.create();
        },
        create : function(){
        	var me = this;
            var typeList = me.option.vType;
            var messageList = me.option.vMessage;
            var message = "";
            var specialCharacterPatrn = /^[^\~!@#$%^&*《》<>:{}]*$/;
            var urlExpression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            var emailExpression = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            var userExpression = /^[a-zA-Z]{1}\w{1,20}$/g;
            var pwdExpression = /^\w{8,20}$/g;
            var numberExpression = /^\d*$/;
            var phoneExpression = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
            me.errLen = 0;
            for(var t in typeList){
                var typeVal = typeList[t];
                var comVal = me.zS.getValue();
                /**
                 * required:true 验证是否为空
                 * minlength:30 长度英文字数不得超过30位，中文字数不得超过15位
                 * url:true 验证网址
                 * ip:true 验证IP地址
                 * email:true 验证邮箱
                 * specialChar:true 不能包含特殊字符
                 * userLegal:true 登录名称必须以字母开头，由字母、数字、下划线组成，长度2至20位。
                 * pwdLegal:true 登录密码必须由字母、数字、下划线组成，长度8至20位
                 * numberLegal:true 只能是数字
                 * equalTo:"password" 验证密码是否一致,password为密码输入框的id属性
                 * minNumber:300 大于300
                 * minNumberRemoveEequl:300 大于等于300
                 */
                message = "";
                if(t == "required" && typeVal){ 
                    if(comVal == "" || comVal == " " || comVal == null){
                    	message = messageList[t];
                        break;
                    }else{
                         message = ""; 
                    }
                }
                if(t == "minlength" && comVal.length>0){ 
                    if(comVal.replace(/[^\x00-\xff]/g,"aa").length > typeVal){
                	//if(comVal.length > typeVal){
                    	message = messageList[t];
                        break;
                    }else{
                        message = ""; 
                    } 
                }
                if(t == "email" && typeVal && comVal.length>0){
                    if(!emailExpression.test(comVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "url" && typeVal && comVal.length>0){
                    if(!urlExpression.test(comVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "ip" && typeVal && comVal.length>0){ 
                	var lastStr = comVal.substring(comVal.length-1,comVal.length);
                	if(lastStr == ","){
                		comVal =  comVal.substring(0,comVal.length-1);
                	}
                	//console.log(comVal.indexOf(","));
                    if(comVal.indexOf(",") > 0){
                        var comValArr = comVal.split(",");
                        for(var c in comValArr){
                        	 if(!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(comValArr[c])){
                                 message = messageList[t];
                                 break;
                             }else{
                                 message = "";
                             }
                        }
                        if(message!="") break;
                    }else{
                        //if(!/\b(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\b/gi.test(comVal)){
                        if(!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(comVal)){
                            message = messageList[t];
                            break;
                        }else{
                            message = "";
                        }
                    }
                }
                if(t == "specialChar" && typeVal && comVal.length>0){ 
                    if(!specialCharacterPatrn.test(comVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "userLegal" && typeVal && comVal.length>0){ 
                    if(!userExpression.test(comVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "pwdLegal" && typeVal && comVal.length>0){ 
                    if(!pwdExpression.test(comVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "numberLegal" && typeVal && comVal.length>0){ 
                    if(!numberExpression.test(comVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "phoneLegal" && typeVal && comVal.length>0){ 
                    if(!phoneExpression.test(comVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                
                if(t == "equalTo"){ 
                    if(comVal!= $("#"+typeVal).val()){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "minNumber" && comVal.length>0){ 
                    if(parseInt(comVal) <=  parseInt(typeVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "minNumberRemoveEequl" && comVal.length>0){ 
                    if(parseInt(comVal) <  parseInt(typeVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "maxNumber" && comVal.length>0){ 
                    if(parseInt(comVal) >=  parseInt(typeVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "maxNumberRemoveEequl" && comVal.length>0){ 
                    if(parseInt(comVal) >  parseInt(typeVal)){
                    	 message = messageList[t];
                        break;
                    }else{
                        message = "";
                    }
                }
                if(t == "customRule"){ 
                	var fn = typeVal;
                    if($.isFunction(fn)){
                    	if(fn && fn(me)){
                    		 message = messageList[t];
                    		break;
                    	}else{
                    		message = "";
                    	}
                    }
                }
            }

            //this.zS.box.find(".tip_star").remove();
            me.zS.box.find("."+MainCls).remove();
            var lastChild = me.zS.box.children().last();
            if(message!=""){
                me.box = $(util.template(TMPL,{
                    MainCls:MainCls,
                    TipCls: TipCls,
                    message:message    
                }));
                lastChild.after(me.box);
                var w = (util.getByteLen(message)/2 * 12) + 45 + "px";
                var l = parseInt(me.zS.box.css("width"));
                l = l - parseInt(me.zS.box.find(".after_text").width());
                if(me.zS.box.find(".after_text")){
                	l = l - 5;
                }
                me.box.css({
                		"left":(l+10)+"px",
                		"width":w
                });
                me.errLen +=1;
                me.box.on('click',function(){
               	 	me.box.remove();
                }); 
            }else{
                //lastChild.after("<span class='tip_star'>*</span>");
            }
           
           
        }
    });


    return ValidateComponent;
});