/**
 * 数据配置文本框组件
 * numberComponent  extends 继承 zDs_text
 */
define(function (require) {

    var $ = require("jquery");
    var Util = require("./zUtil");
    var TextComponent = require("./Text");
    
    var zDs_TextNumberClass = TextComponent.extend({
    	init:function(opt){
    		this._super(opt);
    		this.bindEvent();
    		return this;
    	},
    	bindEvent:function(){
    		var _this = this;
    		Util.checkIsNumber(this.box.find("input"));
    	}
    });
    
    return zDs_TextNumberClass;
});