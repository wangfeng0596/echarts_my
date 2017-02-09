/**
 * 
 * curmb.js
 */
define(function (require) {

    var $ = require("jquery");    
    var Util = require("./zUtil");

    var curmbsComponent = Util.Class({
        init : function(option){
          this.option = option ; 
          this.create();   
        },
        create : function(){
        	this.setBreadcrumb(this.option.data);
        },       
        setBreadcrumb :function(data){ 
    		var newsStr="<ol class='Breadcrumb'>";
    		for(var i=0;i<=data.length-1;i++)
			{

    			if(i == data.length-1){
    				newsStr += "<li>"+data[i].name+"</li>";
    			}else{
    				newsStr += "<li>"+data[i].name+"&gt;</li>";
    			}
			}		
    		newsStr += "</ol>";
    		$("#"+this.option.el).find('.Breadcrumb').remove();
            $("#"+this.option.el).append($(newsStr));
	        this.setStorage(data);    
       },
       setStorage:function(data){
    	   var stroageStr = "";
    	   data.forEach(function(it){
    		   stroageStr += "{id:'"+it.id+"',name:'"+it.name+"'},";
    	   });
    	   stroageStr = stroageStr.substr(0,stroageStr.length-1);
    	   stroageStr = '[' + stroageStr + ']';
    	   localStorage.setItem("stroage",stroageStr); 
       }
    })  
    return curmbsComponent;
});