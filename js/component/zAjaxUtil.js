
/**
 * zAjaxUtil ajax工具类
 * 
 * 封装接口处理方法
 * 
 * @author xiaofan
 */
define(function(require){
	var $ = require("jquery"); 
	var layer = require("layer");
	
	var PATH  = {
		getBase : function(){
			return this.getRootPath();
		},
		getRootPath : function(){
		    var curWwwPath=window.document.location.href;
		    var pathName=window.document.location.pathname;
		    var pos=curWwwPath.indexOf(pathName);
		    var localhostPaht=curWwwPath.substring(0,pos);
		    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		    return localhostPaht + projectName + "/";
		}
	};
	
	
	var emptyFN = function(){};
	
	var ajaxUtils = (function(me){
		return me = {
			/**
			 * getUrl
			 * @returns
			 */	
			getUrl : function(){
				return PATH.getBase();
			},
			
			ajax2 : function(bizName,option,successfn,errorfn,type){
								
				me.ajax(bizName,option,successfn,errorfn,type);
				
			},

			https : function(bizName,option,successfn){
			   return me.ajax(bizName,option,successfn,emptyFN,"post");
			},
				
			/**
			 * @param bizName 业务名称
			 * @param option 参数
			 * @param successfn 回调函数
			 * @param errorfn 错误回调
			 * @param type POST/GET
			 */	
			ajax : function(bizName,option,successfn,errorfn,type){
				
				if(!option){
					return layer.alert("请求参数错误,请设置参数");
				}
				if(bizName ==undefined || bizName == '' ){
					return layer.alert("没有配置业务请求名称bizName");
				}
				//module/previewChart
				
				var url = PATH.getBase() +  bizName ; 
				$.ajax({  
					url : url,
					type : type,
					async : option.async == undefined ? true : false  ,
					data : option,
					dataType : "json",
			        beforeSend : function(){
			        	//loadingFn.show("数据加载中");
			        }
				}).done(function(data){
					if(data != undefined || data != null){
						if(data.isAjax){
							if(data.redirectUrl == null || data.redirectUrl == "" || data.redirectUrl == undefined)
								throw new error("redirectUrl not founds");
							window.location.href = data.redirectUrl;
						}
					}

					(successfn && typeof(successfn) === "function") && successfn(data);

					
				}).fail(function(xhr,status,e){
					try {
			    		errorfn(xhr, status, e);
						console.log(xhr,e);
						return false;
	     			} 
					catch(e){
						layer.alert("Ajax请求数据失败!");
	     				console.log("ajax request fail:" + e);
	     			}	
	     			finally{
	     				//loadingFn.hide();
	     			}
				}).always(function(xhr,status,e){
					try {
						return false;
	     			} 
					catch(e){
	     				console.log("ajax request complete:" + e);
	     			}	
	     			finally{
	     				//loadingFn.hide();
	     			}
				});
			},	
			
			
			/**
			 * @param myurl 模块名
			 * @param datax 
			 * @param type
			 * @param onsucc
			 * @param onerr
			 * @returns
			 */
			onRemoteCall : function( myurl, datax, type, onsucc, onerr){
				me.ajax(myurl,datax,onsucc,emptyFN,type);
			},

		}
		
		
	})();
			
			
			
	
	
	
	return ajaxUtils;
});