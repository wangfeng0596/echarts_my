define(function(require){
	
	var uitl = require("./zUtil");
	
	var InterRoute = uitl.Class({
		 init : function(option){          
            this.option = option;
            this.renderLogicView();
            return this;
        },
		renderLogicView: function(){
			var data = this.option.data;
			var overData = this.option.overData;
			this.viewId = this.option.viewId;
			this.viewDiv = document.getElementById(this.viewId);
			var bgCssArr = {'1':'interRoute-dianxin', '2':'interRoute-liantong', '3':'interRoute-yidong', '9': 'interRoute-tietong', '11':'interRoute-jiaoyuwang', '14': 'interRoute-pengboshi'};
			var width = data.route.length * 168;
			var table = '<div style="width:'+width+'px;color:white">';
			
			table += '<table width="'+width+'" border="0" cellpadding="0" cellspacing="0">';
			
			//第一行
			var line1 = '<tr>';
			var line2 = '<tr class="interRoute-table-info">';
			
			for(var i = 0; i<data.route.length; i++){
				var dPre, dNext;
				var d = data.route[i];
				if(i > 0){
					dPre = data.route[i-1];
				}else{
					dPre = {IP:""};
				}
				if(i < (data.route.length-1))
				{
					dNext = data.route[i+1];
				}else{
					dNext = {IP:""};
				}
				
				if(i > 0){
					var line = 'interRoute';
					if(i == data.route.length - 1){
						line += '-arrow';
					}else{
						line += '-line';
					}
					line1 += '<td class="'+line+'" width="68" height="68">&nbsp;</td>';
				}else{
					line1 += '<td width="68" height="68">&nbsp;</td>';
				}
				
				var css = bgCssArr[d.OPERID.toString()];
				if(!css){
					css = 'interRoute-unknow';
				}
//				if(overData.SINTERIP == d.IP || overData.DINTERIP == d.IP){
//					css += '-red';
//				}
				
				if((overData.SINTERIP == d.IP && overData.DINTERIP== dNext.IP) || (overData.SINTERIP == dPre.IP && overData.DINTERIP== d.IP)){
					css += '-red';
				}
				line1 += '<td class="'+css+'" width="68" height="68">&nbsp;</td>';
				
				var pos = '未知';
				if(d.DESCR){
					var pos = d.DESCR.split(' ')[0];
					if(pos.length > 7){
						var s1 = pos.substr(0,6);
						var s2 = pos.substr(6, pos.length);
						pos = s1 + '<br>' + s2;
					}
				}
				
				var dPOS  = '未知';
				var dDESCR = '未知';
				if(d.POS!=null){
					dPOS = d.POS;
				}
				
				if(d.DESCR != null){
					dDESCR = d.DESCR;
				}
				
				
				line2 += '<td colspan="2" align="right">' +
						'<table width="95%" border="0" cellpadding="0" cellspacing="0">' +
							'<tr>' +
								'<td width="60" align="right">跳数：</td>' +
								'<td width="96">'+d.HOP+'</td>' +
							'</tr>' +
							'<tr>' +
								'<td valign="top" align="right">IP：</td>' +
								'<td>'+d.IP+'</td>' +
							'</tr>' +
							'<tr>' +
								'<td valign="top" align="right">位置：</td>' +
								'<td>'+dPOS+'</td>' +
							'</tr>' +
							'<tr>' +
								'<td valign="top" align="right">运营商：</td>' +
								'<td>'+dDESCR+'</td>' +
							'</tr>' +
							'<tr>' +
								'<td align="right">时延：</td>' +
								'<td>'+d.RTT+'ms</td>' +
							'</tr>' +
						'</table>' +
					'</td>';
				
			}
			
			line1 += '</tr>';
			line2 += '</tr>';
			
			table = table + line1 + line2;
			
			table += '</table>';
			table += '</div>';
			this.viewDiv.innerHTML = table;
			
		},
		destoryComponent:function(){
			this.viewDiv.innerHTML = "";
		}

	});
	
	return InterRoute;
});