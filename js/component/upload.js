define(function (require) {

    var $ = require("jquery");    
    var Util = require("./zUtil");
    var layer = require("layer");
    var uploadify = require("uploadify");

    layer.config({
        path:'../js/lib/layer/', //layer.js所在的目录，可以是绝对目录，也可以是相对目录
        extend: ['skin/espresso/style.css'] //加载新皮肤
    });

    var uploadComponent = Util.Class({
        init : function(option){
          this.option = option ; 
          this.saveData = [];
          this.editData = this.option.editData || [];
          this.IAMGE_NUM = 0;//每上传一张文件IAMGE_NUM+1
          this.FILE_COUNT = 0;
          this.container = this.option.id;
          this.upload();
        },
        upload : function(){
          var _this = this;
          _this.uploadifyList = $("<table class='uploadifyList'></table>");
          $("#"+_this.container).parent().append(_this.uploadifyList);
          
          $("#"+_this.container).uploadify({     
                'debug' : false,
                //是否自动上传
                'auto':true,
                //超时时间
                'successTimeout':99999,
                //不执行默认的onSelect事件
                'overrideEvents' : ['onDialogClose'],
                //文件选择后的容器ID
                'queueID':'uploadfileQueue',
                //服务器端脚本使用的文件对象的名称 $_FILES个['upload']
                'fileObjName':'upload',
                'swf':'../js/lib/uploadify/uploadify.swf',
                //上传处理程序
                'uploader':_this.option.uploaderUrl,
                //浏览按钮的背景图片路径
                'buttonImage':'../js/lib/uploadify/select.png',
                //浏览按钮的宽度
                'width':'100',
                //浏览按钮的高度
                'height':'30',
                //是否自动上传
                'auto': true,
                //在浏览窗口底部的文件类型下拉菜单中显示的文本
                'fileTypeDesc':'文件类型',
                //允许上传的文件后缀
                'fileTypeExts':'*.jpg;*.jpeg;*.gif;*.png;*.bmp;*.rar;*.zip;*.7z;*.doc;*.docx;*.xls;*.xlsx',
                //上传文件的大小限制
                'fileSizeLimit': _this.option.fileMaxSize,
                //上传数量
                'queueSizeLimit' : 10,
                //每次更新上载的文件的进展
                'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                     //有时候上传进度什么想自己个性化控制，可以利用这个方法
                     //使用方法见官方说明
                },
                'onInit':function(){
                	var editData = _this.editData;
                	if(editData!=null && editData != undefined){
                		var index = 0;
                		editData.forEach(function(it){
                    		_this.saveData.push(it);
                    		_this.addFile(index,it.fileName);
                    		index++;
                    	});
                		_this.IAMGE_NUM = index;
                	}
                	
                	_this.uploadifyList.on("click",'.fileDel',function(){
                         var num = $(this).attr("data-value");
                         _this.removeTr(num);
                    });
                },
                //选择上传文件后调用
                'onSelect': function (file) {
                	
                	console.log(file);
//                	console.log(this.queueData.files);
//                	console.log(_this.saveData);
                	for (var n in _this.saveData)
                	{
                		var fileName = _this.saveData[n].fileName;
                		if(fileName == file.name){
                			var mess = '请不要重复上传文件！';
                			var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning'><p>"+mess+"</p></div></div>";
                            layer.open({
                                type: 1,
                                title : "提示",
                                content:alarm_tmpl,
                                area: ['300px','220px'],
                                shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                                moveType: 1,
                                skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                                btn: ['确定'],
                                yes:function(index, layero){	
                                    layer.close(index);
                                }
                            });
                			this.cancelUpload(file.id);
                			return false;
                		}
                	}
                	
                	//layer.msg('正在上传，请稍后...!');
                	
                },
                //单个文件上传成功触发
                'onUploadSuccess': function (file , data, response) {//alert(IAMGE_NUM);

                    // if(FILE_COUNT > 1){
                    //     layer.msg('已经添加附件，如果附件有误，请删除以后再添加!');
                    //     FILE_COUNT--;
                    //     if(IAMGE_NUM > 0){
                    //         IAMGE_NUM--;
                    //     }
                    //     return ;
                    // }
                	
                	var mess  = "";
                	
                	if(_this.IAMGE_NUM >= $('#'+_this.container).uploadify('settings','queueSizeLimit')){
                		mess = "添加附件总数不能超过"+$('#'+_this.container).uploadify('settings','queueSizeLimit')+"个文件！";
	            	}
                	if(mess != ""){
                		var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning'><p>"+mess+"</p></div></div>";
                        layer.open({
                            type: 1,
                            title : "提示",
                            content:alarm_tmpl,
                            area: ['300px','220px'],
                            shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                            moveType: 1,
                            skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                            btn: ['确定'],
                            yes:function(index, layero){	
                                layer.close(index);
                            }
                        });
                        return;
                	}
            		
                	
                    //成功上传一张文件i就加一
                    _this.FILE_COUNT++;
                    
                    _this.json = eval("(" + data + ")");
                    
                    _this.addFile(_this.IAMGE_NUM,_this.json.fileName);
                    _this.json.index = _this.IAMGE_NUM;
                    _this.saveData.push(_this.json);

                    _this.IAMGE_NUM++;

                },
                //当队列中的所有文件全部完成上传时触发
                'onComplete':function(stats){
                	//layer.msg('文件上传成功!');
                	var alarm_tmpl = "<div class='alarm-message'><div class='alarm-prompt1' ><p>添加附件成功！</p></div></div>";
                    layer.open({
                        type: 1,
                        title : "提示",
                        content:alarm_tmpl,
                        area: ['300px','200px'],
                        shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                        moveType: 1,
                        skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                        btn: ['确定'],
                        yes:function(index, layero){	
                            layer.close(index);
                        }
                    });
                },
                //返回一个错误，选择文件的时候触发
                'onSelectError':function(file, errorCode, errorMsg){
                	var mess = "";
                    switch(errorCode) {
                        case -100:
                            mess = "上传的文件数量已经超出系统限制的"+$('#'+_this.container).uploadify('settings','queueSizeLimit')+"个文件！";
                            break;
                        case -110:
                            mess = "文件 ["+file.name+"] 大小超出系统限制的"+$('#'+_this.container).uploadify('settings','fileSizeLimit')/1024+"M大小！";
                            break;
                        case -120:
                            mess = "文件 ["+file.name+"] 大小异常！";
                            break;
                        case -130:
                            mess = "文件 ["+file.name+"] 类型不正确！";
                            break;
                    }
                    var alarm_tmpl = "<div class='alarm-message'><div class='alarm-warning'><p>"+mess+"</p></div></div>";
                    layer.open({
                        type: 1,
                        title : "提示",
                        content:alarm_tmpl,
                        area: ['300px','250px'],
                        shade: [0.3, 'url('+ctx+'/js/lib/layer/skin/espresso/ui-bg_hexagon_75_aaaaaa_12x10.png) 50% 50% repeat'],
                        moveType: 1,
                        skin: 'layer-ext-espresso', //只对该层采用myskin皮肤
                        btn: ['确定'],
                        yes:function(index, layero){	
                            layer.close(index);
                        }
                    });
                },
                //检测FLASH失败调用
                'onFallback':function(){
                    alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
                }
            });
        },
        addFile:function(num,fileName){
            var str = "<tr class='count' id='trId1"+num+"'>\
                            <td align='right'  valign='top' width='90'>文件名称：&nbsp</td>\
                            <td align='left'  valign='top'>"+fileName+"</td>\
                            <td align='left'  valign='top' width='15%'>\
                                <a href='javascript:void(0)' data-value='"+num+"' class='fileDel'>删除</a>\
                            </td>\
                       </tr>";
            this.uploadifyList.append(str);

        },
        removeTr:function(num){
            var delUrl = this.option.delUrl;
            $.post(delUrl, { id:this.saveData[num].id,absPath:this.saveData[num].absPath});
            //删除行
            $("#trId1"+num).remove();
            this.saveData.splice(num,1);

            if(this.IAMGE_NUM > 0){
                this.IAMGE_NUM--;
            }
            if(this.FILE_COUNT > 0){
                this.FILE_COUNT--;
            }
            
            //重置上传队列个数,解决删除后上传队列中文件个数bug
             var swfu = $('#'+this.option.id).data('uploadify');
             var stats = swfu.getStats();
             stats.successful_uploads--;
             swfu.setStats(stats);

        }
       
    });
    
    return uploadComponent;
});
                