/**
 * [echart 封装类]
 * @param  {[type]} require){} [description]
 * @return {[type]}              [description]
 */
define(['jquery','./zUtil', 'lodash','cqGeoCoord',"component/ResourcesConfig","lib/zrender/tool/color",],function($,Utils,_,cqGeoCoord,RC,zrColor){
    //var map_path = "/echarts/echarts-map";//配置地图的请求路径  

	// 返回重庆地图空的option
	function getEmptyCqOption(){
		var _emptyOP = { 
            tooltip: { 
            	trigger: 'item',
                formatter: function(params){
                	var str = params.name;
                	return str;
                },
                textStyle : {
                	fontSize :12,
                	align : "left"
                }
            }, 
           series: [{
	            name: '',
	            type: 'map',
	            mapType: 'chongqing',
	            data:[],
	            itemStyle :{
	            	 normal:{
                        borderColor:'rgba(100,149,237,1)',
                        borderWidth:1,
                        areaStyle:{
                            color: '#1b1b1b'
                        },
                        textStyle:{
	       				    	fontSize :12
	       				    }
                    }
	            }
             }]  
            };  
		return _emptyOP;
	}


	/**
	 * 替换datas里面 category和datas里的 xAxis替换成无数据
	 * @param datas group返回的数据
     * 暂时未用到
	 */
	function replacexAxisName(datas){
		var category = datas.category;
		var series = datas.series;
		var empty ="无数据";
		var arr= [];
		if(category.length){
			category.forEach(function(it){
				if(it == "xAxis"){
					arr.push(empty);
				}else{
					arr.push(it);
				}
			})
		}
		if(series){
			series.forEach(function(it){
				if(it.name == "xAxis" ){
					it.name = empty;
				}
			});
		}
		datas.category = arr;
		datas.series = series
		return datas;
	}
	
	/**
	 * 获取地图range,只在map地图用到
	 */
	//TODO
	function getRangeOption(data){
		
		if(data && data.length){
			var dataRange ={};
			var arr = [];
			var max,min;
			var range = Utils.getMaxmin(data);
			max = range.max;
			min = range.min
			dataRange.color =['#ff0100', '#ffa800', '#ffff00', '#14c8ec'];
			dataRange.show = true;
			dataRange.splitNumber = 4;
			dataRange.formatter = function(x){
				var f_x = parseFloat(x);
				if (isNaN(f_x)){
					return false;
				}
				f_x = Math.round(f_x *100)/100;
				return f_x;
			}
			dataRange.calculable =true;
			dataRange.max  = max;
			dataRange.min = min;
			dataRange.textStyle ={color: "#ffffff"};
			
			return dataRange;
		}

	}
	
	
	
	/**
	 * 获取空圈大小值的方法
	 * @param v 当前值
	 * @param maxmin 整体值 
	 * 世界地图  和 迁徙地图 用到
	 */
	function getMakerEmptyCircleV(v,maxmin){
		var config = {
    		max : 50,
    		min : 10
    	}
    	var min = maxmin.min;
    	var max = maxmin.max;
    	if(v > config.max){
    		v = Math.round( parseFloat(v /max  )* config.max);
    	}
    	
    	if( v < config.min){
    		v = 10 + v*2;
    	}
    	v = parseInt(v,10);
		
    	return v;
	}
	
	
	var Echarts = {
		/**
		 * [config description]
		 * @param  {[type]} container [echarts要渲染图表的容器]
		 * @param  {[type]} option    [配置项]
		 * @return {[type]}           [description]
		 */
		config : function(container, option){
		  
	        this.option = { chart: {}, option: option, container: container }; 	

	        return this.option; 
		},

		/**
		 * Result1=[{name:XXX,value:XXX},{name:XXX,value:XXX}….]
       	 *	Result2=[{name:XXX,group:XXX,value:XXX},{name:XXX,group:XXX,value:XXX]
		 * [dataFormat description]
		 * @return {[type]} [description]
		 */
		dataFormat : {

			// 格式化没有分组类型的图表 Result1，目前饼图用到
			noGroupData : function(data) {
				var categories = [];  
	            var datas = [];
	            for (var i = 0; i < data.length; i++) {
	                categories.push(data[i].name || "");
	                datas.push({ name: data[i].name, value: data[i].value || 0 });
	            }
	            return { category: categories, data: datas };
			},

			//data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，
			//is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图  
			groupData: function (data, type, is_stack) {
				var emptyData = {category: [], xAxis: [],series:[]};
				if(data == null || (data.length== 1 &&data[0].name == "" ) ){
					return emptyData;
				}
	            var chart_type = 'line';
	            if (type) 
	                chart_type = type || 'line';


	            var mapType = "china";
	            if(chart_type == "map"){
	            	mapType = is_stack;
	            }
	            var xAxis = [];	  
	            var group = [];
	            var series = []; 
	            var isBizxAxis = false;
	            
	            
	            // 与后台业务约定的 如果category是xAxis，则把xAxis的name当xAxis数据 否则正常 
	           var xAxisArr = _.chain(data)
				           .filter(function(data){
				        	   return data.category =="xAxis";
				           })
				           .map(function(it){
				        	   return it.name;
				           })
				           .value();
	            // 存在固定横轴坐标系
	           if(xAxisArr.length > 0){
	        	   isBizxAxis = true;
		           var groupKey = {};
	        	   xAxis = xAxisArr;
	        	   group = _.chain(data)
              			  .filter(function(it){
			            	  return it.category != "" && it.category !=null && it.category !="xAxis" ;
			               })
			              .map(function(it){
			            	  return it.category;
			              })
			              .uniq()
			              .value();
	        	   
	        	   if(group.length==0){
	        		   group.push("xAxis");
	        	   }
	        	   
	        	   var xKeys = {};
	        	   xAxisArr.forEach(function(it){
	        		   xKeys[it.name] = 1;
		           });
	           }else{
	        	   
	        	   for (var i = 0; i < data.length; i++) { 	  
		                for (var j = 0; j < xAxis.length && xAxis[j] != data[i].name; j++);  	  
		                if (j == xAxis.length)  	  
		                    xAxis.push(data[i].name); 
		  
		                for (var k = 0; k < group.length && group[k] != data[i].category; k++);	  
		                if (k == group.length ) 	  
		                    group.push(data[i].category);  
		            }   
	        	   
	           }	    
        	   // 查询找指定组内 是否有指定x坐标的值
        	   function lookGroupValue(groupName , xAxis){
        		  var val = _.chain(data).filter(function(it){
		            	return it.name == xAxis  && it.category !=null && it.category == groupName 
	               }).map(function(data){
	            	   return data.value;
	               }).toString();
        		  
        		  return val;
        	   }
	        	   
	           
	           for (var i = 0; i < group.length; i++) {	  
	                var temp = [];  
	                
	                //是否业务自己控制x轴
		            if(isBizxAxis){
		            	xAxis.forEach(function(x){
		            		var val = lookGroupValue(group[i],x);
		            		if(val == ""){
		            			temp.push(0);
		            		}else{
		            			temp.push(val);
		            		}
		            	 
		            	});
		            	 
		            }else{
		            	for (var j = 0; j < data.length; j++) {	
		                    if (group[i] == data[j].category) { 
		                        if (type == "map") {
		                             temp.push({ name: data[j].name, value: data[j].value, dataObj:data[j],tooltip : { 
		                                 formatter: data[j].info
		                             }});
		                        }	  
		                        else {
		                        	 temp.push(data[j].value);	  
		                        }
		                    }	  
			           	}  
		            }

	                switch (type) { 

	                	// 柱形图 	  
	                    case 'bar': 	  
	                        var series_temp = { name: group[i], data: temp, type: chart_type }; 	  
	                        if (is_stack)  	  

	                            series_temp = $.extend({}, { stack: 'stack' }, series_temp); 	  
	                       
	                        break; 	
	                    // 地图
	                    case 'map': 
	                    	 var series_temp = {
	                            type: 'map',
	                            mapType : mapType, 
	                            //selectedMode: 'single',
	                            itemStyle:{
	                                normal:{label:{show:false}},
	                                emphasis:{label:{show:true}}
	                            },
	                            data: temp 	  
	                         };
	                        break; 
	                    // 折线图
	                    case 'line':  
	                        var series_temp = { name: group[i], data: temp, type: chart_type };
	                        if (is_stack) 	  
	                            series_temp = $.extend({}, { 
                                stack: 'stack',
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                 smooth:true 
                                 } , series_temp); 	  
	                        break;  	  
	                    default:  
	                        var series_temp = { name: group[i], data: temp, type: chart_type };
	                }
	                series.push(series_temp);
	            }
	            return { category: group, xAxis: xAxis, series: series };
	        },

	        // 处理 世界地图 迁徙地图  后台数据 转换成 ECHART识别的数据
	        filterMapData : function(data){
	        	if(data && data.length){
	        		
	        		var legendKey = {};
	        		data.forEach(function(row){
	        			legendKey[row.legend] = 1;
	        		});
	        		
	        		var dataSource= [];
	        		for(var legend in legendKey){
	        			var obj = {};
	        			obj.legend = legend;
	        			var _data = [];
	        			var _point = [];
	        			data.forEach(function(row){
	        				if(row.legend == legend){
	        					var __data = [];
	        					// 起点
	        					__data.push({
	        						name : row.name,
	        					});
	        					var targetObj = {name : row.targetname,	value : row.value};
	        					// 目标
	        					__data.push(targetObj);
	        					_data.push(__data);
	        					// 目标点
	        					_point.push(targetObj);
	        				}
		        		});
	        			obj.data = _data;
	        			obj.point = _point;
	        			dataSource.push(obj);
	        		}
	        		return dataSource;
	        	}

	        	
	        },
	        
	        /**
	         * 设置底层地图格式，世界地图，迁徙地图
	         * @param option
	         */
	        getGaData : function(option){
	        	
	        	var Garr = [];
	        	var GData ;
	        	
	        	if(option.data){
	        		option.data.forEach(function(it){
		        		it.data.forEach(function(d){
		        			Garr.push(d);
		        		});
		        	});
	        		
	        		GData = {
	                    type: 'map',
	                    roam: option.roam || false,
	                    nameMap : option.nameMap,
	                    mapType: option.mapType,
	                    hoverable: false,
	                    itemStyle:{
	                        normal:{
	                            borderColor:'rgba(100,149,237,1)',
	                            borderWidth:1,
	                            areaStyle:{
	                                color: '#1b1b1b'
	                            },
	                            textStyle:{
	   	       				    	fontSize :12
	   	       				    }
	                        }
	                    },
	                    data : [],
	                    markLine : {
	                        smooth:true,
	                        symbol: ['none', 'circle'],  
	                        symbolSize : 1,
	                        itemStyle : {
	                            normal: {
	                                color:'#fff',
	                                borderWidth:1,
	                                textStyle:{
		   	       				    	fontSize :12
		   	       				    },
	                                borderColor:'rgba(30,144,255,0.5)'
	                            }
	                        },
	                        data : Garr
	                    },
	                    geoCoord:option.geoCoord
	                };
	        	}
	        	
	        	return GData;
	        },

	        // 格式化世界地图
	        ftWorld :function(data){
	        	var data = this.filterMapData(data);
	        	var GData = this.getGaData({
	        		mapType :"world",
	        		nameMap : {'Afghanistan':'阿富汗','Angola':'安哥拉','Albania':'阿尔巴尼亚','United Arab Emirates':'阿联酋','Argentina':'阿根廷',
	                'Armenia':'亚美尼亚','French Southern and Antarctic Lands':'法属南半球和南极领地','Australia':'澳大利亚','Austria':'奥地利','Azerbaijan':'阿塞拜疆',
	                'Burundi':'布隆迪','Belgium':'比利时','Benin':'贝宁','Burkina Faso':'布基纳法索','Bangladesh':'孟加拉国','Bulgaria':'保加利亚','The Bahamas':'巴哈马', 
	                'Bosnia and Herzegovina':'波斯尼亚和黑塞哥维那','Belarus':'白俄罗斯','Belize':'伯利兹','Bermuda':'百慕大','Bolivia':'玻利维亚','Brazil':'巴西', 
	                'Brunei':'文莱','Bhutan':'不丹','Botswana':'博茨瓦纳','Central African Republic':'中非共和国','Canada':'加拿大','Switzerland':'瑞士', 
	                'Chile':'智利','China':'中国','Ivory Coast':'象牙海岸','Cameroon':'喀麦隆','Democratic Republic of the Congo':'刚果民主共和国','Republic of the Congo':'刚果共和国', 
	                'Colombia':'哥伦比亚','Costa Rica':'哥斯达黎加','Cuba':'古巴','Northern Cyprus':'北塞浦路斯','Cyprus':'塞浦路斯','Czech Republic':'捷克共和国','Germany':'德国', 
	                'Djibouti':'吉布提','Denmark':'丹麦','Dominican Republic':'多明尼加共和国','Algeria':'阿尔及利亚','Ecuador':'厄瓜多尔','Egypt':'埃及','Eritrea':'厄立特里亚','Spain':'西班牙','Estonia':'爱沙尼亚', 
	                'Ethiopia':'埃塞俄比亚','Finland':'芬兰','Fiji':'斐','Falkland Islands':'福克兰群岛','France':'法国','Gabon':'加蓬','United Kingdom':'英国','Georgia':'格鲁吉亚','Ghana':'加纳','Guinea':'几内亚', 
	                'Gambia':'冈比亚','Guinea Bissau':'几内亚比绍','Equatorial Guinea':'赤道几内亚','Greece':'希腊','Greenland':'格陵兰','Guatemala':'危地马拉', 
	                'French Guiana':'法属圭亚那','Guyana':'圭亚那','Honduras':'洪都拉斯','Croatia':'克罗地亚','Haiti':'海地','Hungary':'匈牙利','Indonesia':'印尼','India':'印度','Ireland':'爱尔兰','Iran':'伊朗', 
	                'Iraq':'伊拉克','Iceland':'冰岛','Israel':'以色列','Italy':'意大利','Jamaica':'牙买加','Jordan':'约旦','Japan':'日本','Kazakhstan':'哈萨克斯坦','Kenya':'肯尼亚','Kyrgyzstan':'吉尔吉斯斯坦','Cambodia':'柬埔寨', 
	                'South Korea':'韩国','Kosovo':'科索沃','Kuwait':'科威特','Laos':'老挝','Lebanon':'黎巴嫩','Liberia':'利比里亚','Libya':'利比亚','Sri Lanka':'斯里兰卡','Lesotho':'莱索托','Lithuania':'立陶宛','Luxembourg':'卢森堡', 
	                'Latvia':'拉脱维亚','Morocco':'摩洛哥','Moldova':'摩尔多瓦','Madagascar':'马达加斯加','Mexico':'墨西哥','Macedonia':'马其顿','Mali':'马里','Myanmar':'缅甸','Montenegro':'黑山','Mongolia':'蒙古','Mozambique':'莫桑比克', 
	                'Mauritania':'毛里塔尼亚','Malawi':'马拉维','Malaysia':'马来西亚','Namibia':'纳米比亚','New Caledonia':'新喀里多尼亚','Niger':'尼日尔','Nigeria':'尼日利亚','Nicaragua':'尼加拉瓜','Netherlands':'荷兰','Norway':'挪威','Nepal':'尼泊尔', 
	                'New Zealand':'新西兰','Oman':'阿曼','Pakistan':'巴基斯坦','Panama':'巴拿马','Peru':'秘鲁','Philippines':'菲律宾','Papua New Guinea':'巴布亚新几内亚','Poland':'波兰','Puerto Rico':'波多黎各','North Korea':'北朝鲜', 
	                'Portugal':'葡萄牙','Paraguay':'巴拉圭','Qatar':'卡塔尔','Romania':'罗马尼亚','Russia':'俄罗斯','Rwanda':'卢旺达','Western Sahara':'西撒哈拉','Saudi Arabia':'沙特阿拉伯','Sudan':'苏丹','South Sudan':'南苏丹', 
	                'Senegal':'塞内加尔','Solomon Islands':'所罗门群岛','Sierra Leone':'塞拉利昂','El Salvador':'萨尔瓦多','Somaliland':'索马里兰','Somalia':'索马里','Republic of Serbia':'塞尔维亚共和国','Suriname':'苏里南','Slovakia':'斯洛伐克', 
	                'Slovenia':'斯洛文尼亚','Sweden':'瑞典','Swaziland':'斯威士兰','Syria':'叙利亚','Chad':'乍得','Togo':'多哥','Thailand':'泰国','Tajikistan':'塔吉克斯坦','Turkmenistan':'土库曼斯坦','East Timor':'东帝汶', 
	                'Trinidad and Tobago':'特里尼达和多巴哥','Tunisia':'突尼斯','Turkey':'土耳其','United Republic of Tanzania':'坦桑尼亚联合共和国','Uganda':'乌干达','Ukraine':'乌克兰','Uruguay':'乌拉圭', 
	                'United States of America':'美国','Uzbekistan':'乌兹别克斯坦','Venezuela':'委内瑞拉', 
	                'Vietnam':'越南','Vanuatu':'瓦努阿图','West Bank':'西岸','Yemen':'也门','South Africa':'南非', 
	                'Zambia':'赞比亚','Zimbabwe':'津巴布韦','Republic of Singapore':'新加坡','Taiwan':'中国台湾','Hong Kong':'中国香港'},
	        		data : data,
	        		geoCoord : {'新加坡':[120,-5],'中国台湾':[121.525,25.0392],'中国香港':[114.1667,22.25],'阿富汗':[67.709953,33.93911],'安哥拉':[17.873887,-11.202692],'阿尔巴尼亚':[20.168331,41.153332],'阿联酋':[53.847818,23.424076],'阿根廷':[-63.61667199999999,-38.416097],'亚美尼亚':[45.038189,40.069099],'法属南半球和南极领地':[69.348557,-49.280366],'澳大利亚':[133.775136,-25.274398],'奥地利':[14.550072,47.516231],'阿塞拜疆':[47.576927,40.143105],'布隆迪':[29.918886,-3.373056],'比利时':[4.469936,50.503887],'贝宁':[2.315834,9.30769],'布基纳法索':[-1.561593,12.238333],'孟加拉国':[91.48,22.2],'保加利亚':[25.48583,42.733883],'巴哈马':[-77.39627999999999,25.03428],'波斯尼亚和黑塞哥维那':[17.679076,43.915886],'白俄罗斯':[27.953389,53.709807],'伯利兹':[-88.49765,17.189877],'百慕大':[-64.7505,32.3078],'玻利维亚':[-63.58865299999999,-16.290154],'巴西':[-51.92528,-14.235004],'文莱':[114.727669,4.535277],'不丹':[90.433601,27.514162],'博茨瓦纳':[24.684866,-22.328474],'中非共和国':[20.939444,6.611110999999999],'加拿大':[-106.346771,56.130366],'瑞士':[8.227511999999999,46.818188],'智利':[-71.542969,-35.675147],'中国':[112.5571832844, 37.8908104256],'象牙海岸':[-5.547079999999999,7.539988999999999],'喀麦隆':[12.354722,7.369721999999999],'刚果民主共和国':[21.758664,-4.038333],'刚果共和国':[15.827659,-0.228021],'哥伦比亚':[-74.297333,4.570868],'哥斯达黎加':[-83.753428,9.748916999999999],'古巴':[-77.781167,21.521757],'北塞浦路斯':[33.429859,35.126413],'塞浦路斯':[33.429859,35.126413],'捷克共和国':[15.472962,49.81749199999999],'德国':[10.451526,51.165691],'吉布提':[42.590275,11.825138],'丹麦':[9.501785,56.26392],'多明尼加共和国':[-70.162651,18.735693],'阿尔及利亚':[1.659626,28.033886],'厄瓜多尔':[-78.18340599999999,-1.831239],'埃及':[30.802498,26.820553],'厄立特里亚':[39.782334,15.179384],'西班牙':[-3.74922,40.46366700000001],'爱沙尼亚':[25.013607,58.595272],'埃塞俄比亚':[40.489673,9.145000000000001],'芬兰':[25.748151,61.92410999999999],'斐':[178.065032,-17.713371],'福克兰群岛':[-59.523613,-51.796253],'法国':[2.213749,46.227638],'加蓬':[11.609444,-0.803689],'英国':[-3.435973,55.378051],'格鲁吉亚':[-82.9000751,32.1656221],'加纳':[-1.023194,7.946527],'几内亚':[-9.696645,9.945587],'冈比亚':[-15.310139,13.443182],'几内亚比绍':[-15.180413,11.803749],'赤道几内亚':[10.267895,1.650801],'希腊':[21.824312,39.074208],'格陵兰':[-42.604303,71.706936],'危地马拉':[-90.23075899999999,15.783471],'法属圭亚那':[-53.125782,3.933889],'圭亚那':[-58.93018,4.860416],'洪都拉斯':[-86.241905,15.199999],'克罗地亚':[15.2,45.1],'海地':[-72.285215,18.971187],'匈牙利':[19.503304,47.162494],'印尼':[113.921327,-0.789275],'印度':[78.96288,20.593684],'爱尔兰':[-8.24389,53.41291],'伊朗':[53.688046,32.427908],'伊拉克':[43.679291,33.223191],'冰岛':[-19.020835,64.963051],'以色列':[34.851612,31.046051],'意大利':[12.56738,41.87194],'牙买加':[-77.297508,18.109581],'约旦':[36.238414,30.585164],'日本':[138.252924,36.204824],'哈萨克斯坦':[66.923684,48.019573],'肯尼亚':[37.906193,-0.023559],'吉尔吉斯斯坦':[74.766098,41.20438],'柬埔寨':[104.990963,12.565679],'韩国':[127.766922,35.907757],'科索沃':[20.902977,42.6026359],'科威特':[47.481766,29.31166],'老挝':[102.495496,19.85627],'黎巴嫩':[35.862285,33.854721],'利比里亚':[-9.429499000000002,6.428055],'利比亚':[17.228331,26.3351],'斯里兰卡':[80.77179699999999,7.873053999999999],'莱索托':[28.233608,-29.609988],'立陶宛':[23.881275,55.169438],'卢森堡':[6.129582999999999,49.815273],'拉脱维亚':[24.603189,56.879635],'摩洛哥':[-7.092619999999999,31.791702],'摩尔多瓦':[28.369885,47.411631],'马达加斯加':[46.869107,-18.766947],'墨西哥':[-102.552784,23.634501],'马其顿':[21.745275,41.608635],'马里':[-3.996166,17.570692],'缅甸':[95.956223,21.913965],'黑山':[19.37439,42.708678],'蒙古':[103.846656,46.862496],'莫桑比克':[35.529562,-18.665695],'毛里塔尼亚':[-10.940835,21.00789],'马拉维':[34.301525,-13.254308],'马来西亚':[101.975766,4.210484],'纳米比亚':[18.49041,-22.95764],'新喀里多尼亚':[165.618042,-20.904305],'尼日尔':[8.081666,17.607789],'尼日利亚':[8.675277,9.081999],'尼加拉瓜':[-85.207229,12.865416],'荷兰':[5.291265999999999,52.132633],'挪威':[8.468945999999999,60.47202399999999],'尼泊尔':[84.12400799999999,28.394857],'新西兰':[174.885971,-40.900557],'阿曼':[55.923255,21.512583],'巴基斯坦':[69.34511599999999,30.375321],'巴拿马':[-80.782127,8.537981],'秘鲁':[-75.015152,-9.189967],'菲律宾':[121.774017,12.879721],'巴布亚新几内亚':[143.95555,-6.314992999999999],'波兰':[19.145136,51.919438],'波多黎各':[-66.590149,18.220833],'北朝鲜':[127.510093,40.339852],'葡萄牙':[-8.224454,39.39987199999999],'巴拉圭':[-58.443832,-23.442503],'卡塔尔':[51.183884,25.354826],'罗马尼亚':[24.96676,45.943161],'俄罗斯':[105.318756,61.52401],'卢旺达':[29.873888,-1.940278],'西撒哈拉':[-12.885834,24.215527],'沙特阿拉伯':[45.079162,23.885942],'苏丹':[30.217636,12.862807],'南苏丹':[31.3069788,6.876991899999999],'塞内加尔':[-14.452362,14.497401],'所罗门群岛':[160.156194,-9.64571],'塞拉利昂':[-11.779889,8.460555],'萨尔瓦多':[-88.89653,13.794185],'索马里兰':[46.8252838,9.411743399999999],'索马里':[46.199616,5.152149],'塞尔维亚共和国':[21.005859,44.016521],'苏里南':[-56.027783,3.919305],'斯洛伐克':[19.699024,48.669026],'斯洛文尼亚':[14.995463,46.151241],'瑞典':[18.643501,60.12816100000001],'斯威士兰':[31.465866,-26.522503],'叙利亚':[38.996815,34.80207499999999],'乍得':[18.732207,15.454166],'多哥':[0.824782,8.619543],'泰国':[100.992541,15.870032],'塔吉克斯坦':[71.276093,38.861034],'土库曼斯坦':[59.556278,38.969719],'东帝汶':[125.727539,-8.874217],'特里尼达和多巴哥':[-61.222503,10.691803],'突尼斯':[9.537499,33.886917],'土耳其':[35.243322,38.963745],'坦桑尼亚联合共和国':[34.888822,-6.369028],'乌干达':[32.290275,1.373333],'乌克兰':[31.16558,48.379433],'乌拉圭':[-55.765835,-32.522779],'美国':[-95.712891,37.09024],'乌兹别克斯坦':[64.585262,41.377491],'委内瑞拉':[-66.58973,6.42375],'越南':[108.277199,14.058324],'瓦努阿图':[166.959158,-15.376706],'西岸':[35.3027226,31.9465703],'也门':[48.516388,15.552727],'南非':[22.937506,-30.559482],'赞比亚':[27.849332,-13.133897],'津巴布韦':[29.154857,-19.015438]}
	        	});
	        	
	        	
	        	var legendData = [];
	        	var series = [];
	        	
	        	series.push(GData);
	        	
	        	var maxmin = Echarts.getMaxMin(data);
	        	
	        	if(data !=null && data.length){
	        		data.forEach(function(it){
	        			legendData.push(it.legend);
	        			var option= {
	        				name: it.legend,
	        	            type: 'map',
	        	            mapType: 'world',
	        	            data:[],
	        	            markLine : {
	        	                smooth:true,
	        	                effect : {
	        	                    show: true,
	        	                    scaleSize: 1,
	        	                    period: 30,
	        	                    color: '#fff',
	        	                    shadowBlur: 10
	        	                },
	        	                itemStyle : {
	        	                    normal: {
	        	                        borderWidth:1,
	        	                        lineStyle: {
	        	                            type: 'solid',
	        	                            shadowBlur: 10
	        	                        }
	        	                    }
	        	                },
	        	                data : it.data
	        	            },
	        	            markPoint : {
	        	                symbol:'emptyCircle',
	        	                symbolSize : function (v){
	        	                    var v=  getMakerEmptyCircleV(v,maxmin);
 	        	                    return v;
	        	                },
	        	                effect : {
	        	                    show: true,
	        	                    scaleSize : 0.5,
	        	                    shadowBlur : 0
	        	                },
	        	                itemStyle:{
	        	                    normal:{
	        	                        label:{show:false}
	        	                    },
	        	                    emphasis: {
	        	                        label:{position:'top'}
	        	                    }
	        	                },
	        	                data : it.point
	        	            }
	        	        }
	        			series.push(option);
	        		});
	        		
	        		return { legend: legendData, series:series};
	        	}
	        },
	        

	        //TODO
	        // 格式化迁徙地图数据
	        ftQianXi : function(data){
	        	var data = this.filterMapData(data);
	        	
	        	
	        	var GData = this.getGaData({
	        		mapType :"china",
	        		data : data,
	        		geoCoord : {
                        '上海': [121.4648,31.2891],
                        '朔州' :[112.43,39.33],
                        '阳曲' :[ 112.65 , 38.05 ],
                        '晋中' : [112.75,37.68],
                        '吕梁' : [111.13,37.52],
                        '十堰' : [110.78 ,32.65],
                        '娄烦' :[ 111.78 , 38.05 ],
                        '清徐' :[ 112.33 , 37.62 ],
                        '阳泉' :[ 113.57 , 37.85 ],
                        '天镇' :[ 114.08 , 40.42 ],
                        '灵丘' :[ 114.2  , 39.47 ],
                        '怀仁' :[ 113.1  , 39.82 ],
                        '山阴' :[ 112.82 , 39.52 ],
                        '平鲁' :[ 112.12 , 39.53 ],
                        '右玉' :[ 112.33 , 40.18 ],
                        '阳高' :[ 113.72 , 40.38 ],
                        '广灵' :[ 113.27 , 39.75 ],
                        '浑源' :[ 113.68,  39.7],
                        '应县' :[ 113.18 , 39.58], 
                        '朔县' :[ 112.42 , 39.32 ],
                        '左云' :[ 112.67 , 40.02 ],
                        '忻县' :[ 112.7 ,  38.38 ],
                        '代县' :[ 112.97 , 39.07 ],
                        '五台' :[ 113.32 , 38.72 ],
                        '静乐' :[ 111.9  , 38.37 ],
                        '保德' :[ 111.09 , 38.01 ],
                        '河曲' :[ 111.17 , 39.38 ],
                        '神池' :[ 112.17 , 39.1],
                        '原平' :[ 112.7  , 38.73], 
                        '繁峙' :[ 113.28 , 39.2],
                        '定襄' :[ 112.95 , 38.5],
                        '岢岚' :[ 111.58 , 38.7],
                        '五寨' :[ 111.82 ,38.93] ,
                        '偏关' :[ 111.47 , 39.45 ],
                        '宁武' :[ 112.28 , 39],
                        '榆次' :[ 112.72 , 37.68], 
                        '孟县' :[ 113.37 , 38.01],
                        '昔阳' :[ 113.68 , 37.62],
                        '左权' :[ 113.35 , 37.07],
                        '太谷' :[ 112.53 , 37.42 ],
                        '平遥' :[ 112.18 , 37.2],
                        '灵石' :[ 111.77 , 36.83],
                        '寿阳' :[ 113.17 , 37.88 ],
                        '平定' :[ 113.62 , 37.79 ],
                        '和顺' :[ 113.55 , 37.33 ],
                        '榆社' :[ 112.97 , 37.08 ],
                        '祁县' :[ 112.33 , 37.36 ],
                        '介休' :[ 111.88 , 37.03 ],
                        '离石' :[ 111.13 , 37.53 ],
                        '兴县' :[ 111.22 , 38.47 ],
                        '方由' :[ 111.24 , 37.86 ],
                        '岚县' :[ 111.62 , 38.28 ],
                        '交城' :[ 112.14 , 37.55 ],
                        '文水' :[ 112.02 , 37.42 ],
                        '汾阳' :[ 111.75 , 37.27 ],
                        '孝义' :[ 111.8  , 37.12 ],
                        '交口' :[ 111.2  , 36.97 ],
                        '石楼' :[ 110.83 , 37],
                        '中阳' :[ 111.17 , 37.37], 
                        '临县' :[ 110.95 , 37.95 ],
                        '柳林' :[ 110.85 , 37.45 ],
                        '襄垣' :[ 113.02 , 36.55 ],
                        '黎城' :[ 113.4  , 36.56 ],
                        '壶关' :[ 113.23 , 35.11 ],
                        '高平' :[ 112.88 , 35.48 ],
                        '阳城' :[ 112.38 , 35.84 ],
                        '长子' :[ 112.87 , 36.13 ],
                        '沁源' :[ 112.32 , 36.5],
                        '潞城' :[ 113.22 , 36.33], 
                        '武乡' :[ 112.83 , 36.83 ],
                        '平顺' :[ 113.43 , 36.19 ],
                        '陵川' :[ 113.27 , 35.78 ],
                        '晋城' :[ 112.83 , 35.52 ],
                        '沁水' :[ 112.15 , 35.67 ],
                        '屯留' :[ 112.87 , 36.32 ],
                        '沁县' :[ 112.68 , 36.75 ],
                        '临汾' :[ 111.5  , 36.08 ],
                        '汾西' :[ 111.53 , 36.63 ],
                        '安泽' :[ 112.2  , 36.15 ],
                        '古县' :[ 111.9  , 36.29 ],
                        '翼城' :[ 111.68 , 35.73 ],
                        '曲沃' :[ 111.33 , 35.63 ],
                        '吉县' :[ 110.65 , 36.12 ],
                        '大宁' :[ 110.72 , 36.47 ],
                        '侯马' :[ 111.45 , 35.03 ],
                        '永和' :[ 110.64 , 36.62 ],
                        '洪洞' :[ 111.68 , 36.25 ],
                        '霍县' :[ 111.72 , 36.57 ],
                        '浮山' :[ 111.83 , 35.97 ],
                        '襄汾' :[ 111.43 , 35.86 ],
                        '乡宁' :[ 110.8  , 35.97 ],
                        '蒲县' :[ 111.07 , 36.42 ],
                        '运城' :[ 110.97 , 35.03 ],
                        '闻喜' :[ 111.2  , 35.37 ],
                        '垣曲' :[ 111.63 , 35.3],
                        '芮城' :[ 110.68 , 34.71] ,
                        '临猗' :[ 110.78 , 35.15 ],
                        '新绛' :[ 111.22 , 35.62 ],
                        '河津' :[ 110.7  , 35.58 ],
                        '夏县' :[ 111.22 , 35.12 ],
                        '绛县' :[ 111.58 , 35.48 ],
                        '平陆' :[ 111.2  , 34.12 ],
                        '永济' :[ 110.42 , 34.88 ],
                        '万荣' :[ 110.83 , 35.42 ],
                        '稷山' :[ 110.97 , 35.6],
                        '东莞': [113.8953,22.901],
                        '东营': [118.7073,37.5513],
                        '中山': [113.4229,22.478],
                        '临汾': [111.4783,36.1615],
                        '晋城': [112.8480,35.5018],
                        '临沂': [118.3118,35.2936],
                        '丹东': [124.541,40.4242],
                        '忻州': [112.43,38.24],
                        '丽水': [119.5642,28.1854],
                        '台湾' : [121.5365, 25.0192],
                        '香港' :[114.1000, 22.2000],
                        '乌鲁木齐': [87.9236,43.5883],
                        '佛山': [112.8955,23.1097],
                        '保定': [115.0488,39.0948],
                        '兰州': [103.5901,36.3043],
                        '包头': [110.3467,41.4899],
                        '北京': [116.4551,40.2539],
                        '北海': [109.314,21.6211],
                        '南京': [118.8062,31.9208],
                        '南宁': [108.479,23.1152],
                        '南昌': [116.0046,28.6633],
                        '南通': [121.1023,32.1625],
                        '厦门': [118.1689,24.6478],
                        '台州': [121.1353,28.6688],
                        '合肥': [117.29,32.0581],
                        '呼和浩特': [111.4124,40.4901],
                        '咸阳': [108.4131,34.8706],
                        '哈尔滨': [127.9688,45.368],
                        '唐山': [118.4766,39.6826],
                        '嘉兴': [120.9155,30.6354],
                        '大同': [113.7854,39.8035],
                        '大连': [122.2229,39.4409],
                        '天津': [117.4219,39.4189],
                        '太原': [112.3352,37.9413],
                        '威海': [121.9482,37.1393],
                        '宁波': [121.5967,29.6466],
                        '宝鸡': [107.1826,34.3433],
                        '宿迁': [118.5535,33.7775],
                        '常州': [119.4543,31.5582],
                        '广州': [113.5107,23.2196],
                        '廊坊': [116.521,39.0509],
                        '延安': [109.1052,36.4252],
                        '张家口': [115.1477,40.8527],
                        '徐州': [117.5208,34.3268],
                        '德州': [116.6858,37.2107],
                        '惠州': [114.6204,23.1647],
                        '成都': [103.9526,30.7617],
                        '扬州': [119.4653,32.8162],
                        '承德': [117.5757,41.4075],
                        '拉萨': [91.1865,30.1465],
                        '无锡': [120.3442,31.5527],
                        '日照': [119.2786,35.5023],
                        '昆明': [102.9199,25.4663],
                        '杭州': [119.5313,29.8773],
                        '枣庄': [117.323,34.8926],
                        '柳州': [109.3799,24.9774],
                        '株洲': [113.5327,27.0319],
                        '武汉': [114.3896,30.6628],
                        '汕头': [117.1692,23.3405],
                        '江门': [112.6318,22.1484],
                        '沈阳': [123.1238,42.1216],
                        '沧州': [116.8286,38.2104],
                        '河源': [114.917,23.9722],
                        '泉州': [118.3228,25.1147],
                        '泰安': [117.0264,36.0516],
                        '泰州': [120.0586,32.5525],
                        '济南': [117.1582,36.8701],
                        '济宁': [116.8286,35.3375],
                        '海口': [110.3893,19.8516],
                        '淄博': [118.0371,36.6064],
                        '淮安': [118.927,33.4039],
                        '深圳': [114.5435,22.5439],
                        '清远': [112.9175,24.3292],
                        '温州': [120.498,27.8119],
                        '渭南': [109.7864,35.0299],
                        '湖州': [119.8608,30.7782],
                        '湘潭': [112.5439,27.7075],
                        '滨州': [117.8174,37.4963],
                        '潍坊': [119.0918,36.524],
                        '烟台': [120.7397,37.5128],
                        '玉溪': [101.9312,23.8898],
                        '珠海': [113.7305,22.1155],
                        '盐城': [120.2234,33.5577],
                        '盘锦': [121.9482,41.0449],
                        '石家庄': [114.4995,38.1006],
                        '福州': [119.4543,25.9222],
                        '秦皇岛': [119.2126,40.0232],
                        '绍兴': [120.564,29.7565],
                        '聊城': [115.9167,36.4032],
                        '肇庆': [112.1265,23.5822],
                        '舟山': [122.2559,30.2234],
                        '苏州': [120.6519,31.3989],
                        '莱芜': [117.6526,36.2714],
                        '菏泽': [115.6201,35.2057],
                        '营口': [122.4316,40.4297],
                        '葫芦岛': [120.1575,40.578],
                        '衡水': [115.8838,37.7161],
                        '衢州': [118.6853,28.8666],
                        '西宁': [101.4038,36.8207],
                        '西安': [109.1162,34.2004],
                        '贵阳': [106.6992,26.7682],
                        '连云港': [119.1248,34.552],
                        '邢台': [114.8071,37.2821],
                        '邯郸': [114.4775,36.535],
                        '郑州': [113.4668,34.6234],
                        '鄂尔多斯': [108.9734,39.2487],
                        '重庆': [107.7539,30.1904],
                        '金华': [120.0037,29.1028],
                        '铜川': [109.0393,35.1947],
                        '银川': [106.3586,38.1775],
                        '镇江': [119.4763,31.9702],
                        '长春': [125.8154,44.2584],
                        '长沙': [113.0823,28.2568],
                        '长治': [112.8625,36.4746],
                        '阳泉': [113.4778,38.0951],
                        '青岛': [120.4651,36.3373],
                        '韶关': [113.7964,24.7028],
                        '桂林': [110.290195,25.273566]
                    }
	        	});
	        	
	        	var legendData = [];
	        	var series = [];
	        	//TODO
	        	series.push(GData);
	        	
	        	var maxmin = Echarts.getMaxMin(data);

	        	
	        	if(data !=null && data.length){
	        		data.forEach(function(it){
	        			legendData.push(it.legend);
	        			var option= {
	        				name: it.legend,
	        	            type: 'map',
	        	            mapType: 'china',
	        	            data:[],
	        	            markLine : {
	        	                smooth:true,
	        	                effect : {
	        	                    show: true,
	        	                    scaleSize: 1,
	        	                    period: 30,
	        	                    color: '#fff',
	        	                    shadowBlur: 10
	        	                },
	        	                itemStyle : {
	        	                    normal: {
	        	                        borderWidth:1,
	        	                        lineStyle: {
	        	                            type: 'solid',
	        	                            shadowBlur: 10
	        	                        }
	        	                    }
	        	                },
	        	                data : it.data
	        	            },
	        	            markPoint : {
	        	                symbol:'emptyCircle',
	        	                symbolSize : function (v){
	        	                	 var v=  getMakerEmptyCircleV(v,maxmin);
		        	                 return v;
	        	                },
	        	                effect : {
	        	                    show: true,
	        	                    scaleSize : 1,
	        	                    shadowBlur : 0
	        	                },
	        	                itemStyle:{
	        	                    normal:{
	        	                        label:{show:false}
	        	                    },
	        	                    emphasis: {
	        	                        label:{position:'top'}
	        	                    }
	        	                },
	        	                data : it.point
	        	            }
	        	        }
	        			series.push(option);
	        		});
	        		
	        		return { legend: legendData, series:series};
	        	}
	        	
	        	
	        },
	        	        //TODO
	        /**
	         * 格式化关系图
	         * @param data
	         */
	        ftForce : function(data,op){
	        	
	        	var type = op.childType;
	        	var wh = op.wh;
	        	
	        	 // 力导向关系图 Util类
	            var common = (function(me){
	                  return me = {
	                    // 获取imageUrl 
	                    getImageUrl : function(type){
	                      var imgURl ="image://image/";
	                      switch(type){
	                         case "0": imgURl += "Home_Server_72px.png";break;
	                         case "1": imgURl += "computer_48px_.png";break;
	                         case "2": imgURl += "adminGreen.png";break;
	                         case "3": imgURl += "admin4.png";break;
	                         default:break;
	                      }
	                      return imgURl;
	                    },
	                    // 获取imageUrl 
	                    getImageUrlByStatus : function(status){
	                      var imgURl ="image://image/";
	                      switch(status){
	                         case "0": imgURl += "green.png";break;
	                         case "1": imgURl += "red.png";break;
	                         default:break;
	                      }
	                      return imgURl;
	                    },
	                 
	                    // 构建数据项   
	                    buildOption: function(op){
	                       var option;
	                       if(type == 1){
	                    	 option = {
	                    			 tooltip : {
	                    				 trigger: 'item',
		  	                             formatter: '{b}',
		  	                             enterable: true,
		  	                            textStyle:{
			   	       				    	fontSize :12
			   	       				    }
		  	                         },
	  	                            toolbox: {
	  	                                show : false,
	  	                                feature : {
	  	                                    restore : {show: true},
	  	                                    // magicType: {show: true, type: ['force', 'chord']}                    
	  	                                }
	  	                            },
	  	                            legend: {
	  	                                show : false,
	  	                                x: 'left',
	  	                                data:['1','2','3']
	  	                            },
	  	                            series : [
	  	                                {
	  	                                    type:'force',
	  	                                    ribbonType: false,
	  	                                    center:["50%","50%"],
	  	                                    categories : [
	  	                                      {
	  	                                          name: '1'
	  	                                      } ,
	  	                                      {
	  	                                          name: '2'
	  	                                      },
	  	                                      {
	  	                                          name: '3'
	  	                                      } 
	  	                                    ],
	  	                                    itemStyle: {
	  	                                        normal: {
	  	                                            label: {
	  	                                                show: true,
	  	                                                textStyle: {
	  	                                                    color: '#fff'
	  	                                                }
	  	                                            },
	  	                                            nodeStyle : {
	  	                                                //brushType : 'both',
	  	                                                //borderColor : 'rgba(255,215,0,0.4)',
	  	                                                //borderWidth : 1
	  	                                            }
	  	                                        },
	  	                                        emphasis: {
	  	                                            label: {
	  	                                                show: false
	  	                                            },
	  	                                            nodeStyle : {
	  	                                                //r: 30
	  	                                            },
	  	                                            linkStyle : {}
	  	                                        }
	  	                                    },
		  	                                useWorker: false,
								            minRadius : 15,
								            maxRadius : 35,
								            gravity: 1.1,
								            scaling: 1.1,
								            roam: 'move',
	  	                                    linkSymbol : 'arrow',//arrow  'circle', 'rectangle', 'triangle', 'diamond',  'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond' 
		  	                                //draggable: false,
		  	                                //steps: 10,
		  	                                //coolDown: 0.9,
	  	                                    nodes:op.nodes,
	  	                                    links:op.links
	  	                              }]
	  	                          };
	                    	 
	                    	 
	                     }else if(type ==2){
	                    	 option = {
	  	                            tooltip : {
	  	                                trigger: 'item',
	  	                                formatter: '{a} : {b}',
		  	                            position : function(p) {
		  	                                return [p[0] + 10, p[1] - 20];
		  	                            },
		  	                            enterable: true,
		  	                            textStyle:{
			   	       				    	fontSize :12
			   	       				    }
	  	                            },
	  	                            legend: {
	  	                                show : false,
	  	                                x: 'left',
	  	                                data:['1','2','3']
	  	                            },
	  	                            series : [
	  	                                {
	  	                                    type:'force',
	  	                                    ribbonType: false,
	  	                                    center:["50%","50%"],
	  	                                    //categories : [
	  	                                    //  {
	  	                                    //      name: '1'
	  	                                    //  } ,
	  	                                    //  {
	  	                                    //     name: '2'
	  	                                    //  },
	  	                                    //  {
	  	                                    //      name: '3'
	  	                                    //  } 
	  	                                    //],
	  	                                    itemStyle: {
	  	                                        normal: {
	  	                                            label: {
	  	                                                show: true,
	  	                                                textStyle: {
	  	                                                    color: '#fff'
	  	                                                }
	  	                                            },
	  	                                            nodeStyle : {
	  	                                                brushType : 'both',
	  	                                                borderColor : 'rgba(255,215,0,0.4)',
	  	                                                borderWidth : 1
	  	                                            }
	  	                                        },
	  	                                        emphasis: {
	  	                                            label: {
	  	                                                show: false
	  	                                            }
	  	                                        }
	  	                                    },
	  	                                    linkSymbol : 'none',//arrow
	  	                                    draggable: true,                    
	  	                                    nodes:op.nodes,
	  	                                    links : op.links
	  	                              }]
	  	                          }; 
	                    	 
	                        }	
	                    	
	                    
	                        return option;
	                    },
	                    
	                    // 处理树形结构数据	
	                    handlerTreeData : function(data){
	                    	var root = {};
	                    	root.child = [];
	                    	if(data && data.length){
	                    		data.forEach(function(it){
	                    			if(it.pid == null || it.pid == ''){
	                    				root = it;
	                    			}
	                    		});
	                    	}
	                    	getNode(root);
	                    	
	              
	                    	function getNode(pnode){
                    			data.forEach(function(it){
	                    			if(pnode.id!=="" && it.id!=="" &&it.pid == pnode.id && it.pid !=null ){
	                    				var child = pnode.child || [];
	                    				child.push(it);
	                    				pnode.child = child;
	                    				getNode(it);
	                    			}
	                    		});
	                    	}
	                    	
	                    	return root;
	                    	
	                    },
	                    
	                    
	                    // 格式化数据
	                    formatData : function(data){
	                    	
	                    	var DATA = me.handlerTreeData(data);
	                    	
	                    	var nodes = [];
	                    	var links = [];
	                    	var constMaxDepth = 2;
	                    	
	                    	function createNode(node,depth,isRoot) {
	                    	    var obj = {
	                    	        name : node.name,
	                    	        label : "",
	                    	        value : node.value,
	                    	        relname : node.relname,
	                    	        id : node.id,
	                    	        depth : depth,
		                            draggable: true,
		                            itemStyle: {
		                                normal: {
		                                    label: {
		                                        position: 'bottom',
		                                        textStyle: {
		                                            color: '#ffffff'
		                                        }
		                                    }
		                                }
		                            }, 
		                            tooltip : { 
	   	                                 formatter: function(){
	   	                                	 return node.info || node.name; 
	   	                                 },
	   	                                textStyle:{
			   	       				    	fontSize :12
			   	       				    }
	   	                            },
		                            //initial : [0, 0],
		                            //initial : node.xy,
		                            child : node.child,
	                    	        category : depth
	                    	    }
	                    	    if(node.phototype!==undefined){
	                    	    	obj.symbol = me.getImageUrl(node.phototype);
	                    	    	obj.symbolSize = isRoot ?  [25, 25] : [14, 14];
	                    	    }
	                    	    return obj;
	                    	}

	                    	function forceMockThreeData(node) {
	                    	    var depth = 0;
	                    	    var rootNode = createNode(node,0,true);
	                    	   
	                    	    nodes.push(rootNode);
	                    	    mock(rootNode, 0);
	                    	    
	                    	    function mock(parentNode, depth) {
	                    	        var nChildren = parentNode.child || [];
	                    	        nChildren.forEach(function(node){
	                    	        	var childNode = createNode(node,depth,false);
	                    	        	nodes.push(childNode);
	                    	            links.push({
	                    	                source : parentNode.name,
	                    	                target : childNode.name,
	                    	                weight : 1 ,
	                    	                name : childNode.relname,
	                    	                itemStyle: {
	                    	                    normal: {
	                    	                        width: 1,
	                    	                        color: '#cccccc'
	                    	                    }
	                    	                }
	                    	            });
	                    	            if (depth < constMaxDepth) {
	                    	                mock(childNode, depth + 1);
	                    	            }
	                    	        })
	                    	    }
	                    	}

	                    	forceMockThreeData(DATA);
	                    	return {nodes:nodes,links:links};
	                    	
	                    },
	                    // 格式化数据
	                    formatDataType : function(data){
                    		var w = wh.w;
                    		var h = wh.h;
                    		var _w = 45;
                    		var _h = 45;
                    		var n = parseInt(Math.floor(w / _w),10); 
                    		var m = parseInt(Math.floor(h / _h),10);
                    		
                    		data = unique(data);
                    		
                    		for(var k in data){
                    			var index = parseInt(k)+1;
                    			var y_d = parseInt(Math.ceil(index / n),10);  //Y轴深度
                    			//y_d = y_d > 0 ? y_d-1:y_d;
                    			y_d = y_d - 1;
                    			var x_d = parseInt(k) % n; //X轴深度
                    			var x = x_d * _w + 50;
                    			var y = y_d * _h + 30;
                    			data[k].xy = [x,y];
                    		}     		
	                    	
	                    	var nodes = [];
	                    	
	                    	function unique(arr){
	                			
	               			 var res = [];
	               			 var json = {};
	               			 
	               			 for(var i = 0; i < arr.length; i++){
	               				 
	               				 if(!json[arr[i].name]){
	               					 res.push(arr[i]);
	               					 json[arr[i].name] = 1;
	               				 }
	               			 }
	               			 return res;
	                    	};
	                    	
	                    	function createNode(node,depth,isRoot,i) {
	                    		//console.log(node.xy);
	                    	    var obj = {
	                    	        name : node.name,
	                    	        label : '',
	                    	        value : node.value,
	                    	        id : node.id,
	                    	        depth : depth,
		                            draggable: true,
		                            relname : node.relname,
		                            itemStyle: {
		                                normal: {
		                                    label: {
		                                        position: 'bottom',
		                                        textStyle: {
		                                            color: '#ffffff'
		                                        }
		                                    }
		                                }
		                            },
		                            tooltip : { 
	   	                                 formatter: node.info
	   	                            },
		                            //initial : [0, 0],
		                            initial : node.xy,
		                            child : node.child,
	                    	        category : depth,
	                    	        fixY : true,
	                    	        fixX : true
	                    	    }
	                    	    if(node.status !== undefined){
	                    	    	obj.symbol = me.getImageUrlByStatus(node.status);
	                    	    	obj.symbolSize = [20, 20];
	                    	    }
	                    	    
	                    	    return obj;
	                    	}

	                    	function forceMockThreeData2(data){
	                    		var depth = 0;
	                    		data.forEach(function(node,i){
                    	        	var childNode = createNode(node,depth,false,i);
                    	        	nodes.push(childNode);
                    	        });
	                    	}
	
	                    	forceMockThreeData2(data);
	                    	return {nodes:nodes,links:[]};
	                    	
	                    },
	                    initforce : function(data,fn){
	                    	if(type == 2){
	                    		 var option = me.buildOption(me.formatDataType(data))
	                    	}else{
	                    		 var option = me.buildOption(me.formatData(data));
	                    	}
	                     
	                    	return option;
	                    }
	                 
	                  };

	            })();

	        	return common.initforce(data);
	        }
	        
		},
		optionTmpl :{

			// 通用图表基本配置
			base : {
				tooltip: {  
	                trigger: 'axis'//tooltip触发方式:axis以X轴线触发,item以每一个数据项触发	  
	            },	  
	            toolbox: {  
	                show: false, //是否显示工具栏  	  
	                feature: {	  
	                    dataView: { readOnly: true,show: true }, //数据预览  	  
	                    restore:  {show: true}, //复原  
	                    saveAsImage: {show: true}, //是否保存图片  
	                    mark: {show : true}, 
	                }  
	            }
			},

			//通用的折线图表的基本配置
			lineOption: { 
	            tooltip: {  
	                trigger: 'axis'//tooltip触发方式:axis以X轴线触发,item以每一个数据项触发	  
	            },	  
	            toolbox: {  
	                show: false, //是否显示工具栏  	  
	                feature: {	  
	                    dataView: { readOnly: false,show: true }, //数据预览  	  
	                    restore:  {show: true}, //复原  
	                    saveAsImage: {show: true}, //是否保存图片  
	                    mark: {show : true}, 
	                    magicType: {show: true, type: ['line', 'bar']}//支持柱形图和折线图的切换  	  
	                }  
	            }
	        },
	        //通用的地图的基本配置
	        mapOption : {
        	    tooltip : {
			        trigger: 'item',
//			        formatter: '{b}:{c}',
			        position : function(p) {
			            // 位置回调
				        // console.log && console.log(p);
				        return [p[0] + 10, p[1] - 35];
				    },
				    textStyle:{
				    	fontSize :12
				    },
				    enterable: true,
				    trigger: 'item',
    		        formatter: function(params, ticket, callback){
    		        	var str ="";
    		        	var name = params.name;
    		        	var value = params.value;
    		        	if(value!=""){
    		        		str = name ;
    		        	}
    		        	if(str.indexOf("-")>-1){
    		        		str = str.substring(0, str.indexOf("-")-1);
    		        	}
    		        	return str;
    		        }
			    },
			    toolbox: {  
	                show:false, //是否显示工具栏  ,
	                color : ["#ffffff"],
	                textStyle : {
	                	 color : "#ffffff"
	                },
	                feature: {	  
	                    dataView: { readOnly: false,show: false }, //数据预览  	  
	                    restore:  { show: false}, //复原  
	                    saveAsImage: {show: true}, //是否保存图片  
	                    mark: {show : false}, 
	                }  
	            }
	        },

	        // 
	        /**
	         * [Pie 饼图]
	         * @param {[type]} data [description]
	         * @param {[type]} title [description]
	         *
	        */
	        //TODO
	        Pie: function (data, opt) {//data:数据格式：{name：xxx,value:xxx}...
	        	
	        	var me = this;
	        	var showPiePercent = Echarts.getPieShowPercent(opt);
	        	var grapTextSize = Echarts.getGrapText(opt) || 12;
	        	var legend = Echarts.getLegend(opt);
	        	var showLegend, legendPositonX, legendPositonY;
	        	if(legend){
	        		showLegend = legend.showLegend || false;
	        		legendPositonX=legend.X  || 'left';
	        		legendPositonY=legend.Y || 'top';
	        	}
	        	
	        	
	        	if(data == null || data == undefined ||data.length == 0){
	        		return {};
	        	}
        	
	        	if(data.length == 1 && data[0].value == "" ){

	        		var _emptyOP = { 
	 	                tooltip: { 
	 	                	 trigger: 'item',
    	                    formatter: function(params){
    	                    	//"{b}<br/>{a} ：{c}GB<br/>占比  ：{d}%",
    	                    	var str = params.name;
    	                    	str +="<br/>";
    	                    	//str += params.seriesName + "："+params.value +"GB";
    	                    	str +="<br/>";
    	                    	//str += "占比："+params.percent + "%";
    	                    	return str;
    	                    },
	 	                	 
    	                    textStyle : {
    	                    	fontSize :12,
    	                    	align : "left"
    	                    }
	 	                }, 
	 	                series: [  	  
	 	                    {  
	 	                    	name:"流量",
    	                        type:'pie',
    	                        radius : '50%',
    	                        center: ['45%', '50%'],
	 	                        data: [{value:360,name:'无数据'}] 
	 	                    }  
	 	                ]  
	 	            };  
	        		
        			return _emptyOP;
        		}
	        	
	  			
	        	var props = opt.chartStyle ;
	        	var chartType = opt.childType;
	        	
	        	// 直连点饼图01
	        	if(chartType == "zp1"){
	        		var pieList = [];
	        		var pieShowPercent = showPiePercent; 
	        		
	        		var totalValue = 0 ;
	        		var lengthArr = [];
	        		data.forEach(function(it){
	        			if(it.name!=""){
	        				totalValue += parseFloat(it.value);
	        				lengthArr.push(it.name);
	        			}
	        		});
	        		data.forEach(function(it){
	        			if(it.name!=""){
	        				 pieList.push({
	        				 	 name:it.name,
		                         value:parseFloat(it.value),
		                         itemStyle:{
		                             normal:{
		                                 label:{
		                                	 textStyle : {
			                                   	//fontSize: grapTextSize,
			                                 },
		                                     show:(function(){
		                                         if(parseFloat(it.value)/totalValue>pieShowPercent)
		                                             return true;
		                                         else
		                                             return false;
		                                     })()
		                                 },
		                                 labelLine:{
		                                	 length:0,
		                                     show:(function(){
		                                         if(parseFloat(it.value)/totalValue>pieShowPercent)
		                                             return true;
		                                         else
		                                             return false;
		                                     })()
		                                 }
		                             }
		                         }   
		                     });
	        			}
	        		});
					
		            var colorV1 = [
		        		           	"#1e90ff",
		        		           	"#e9573f",
		        		           	"#fa9f44",
		        		           	"#e4d33b",
		        		           	"#8cc152",
		        		           	"#94d9f2",
		        		           	"#967adc",
		        		           	"#de8c71",
		        		           	"#48cfad",
		        		           	"#fde2aa",
		        		           	"#ec87c0",
		        		           	"#cdcbfc",  
		        		           	"#00a4cc",
		        		           	"#de59d1",
		        		           	"#43a08d"                                                        
		        		           ];
		        	var colorArr = [];
		        	if(props != undefined){
						if(props.colorArr == undefined){
			        		colorArr = colorV1;
			        	}else{
			        		colorArr = props.colorArr;
			        	}
		        	}else{
		        		colorArr = colorV1;
		        	}
		        	
	        		var pieOpts = {
	        				color : colorArr,
	        				legend: {
        					show:showLegend,
        	                orient : 'vertical',
        	                x: legendPositonX,
        	                y: legendPositonY,
        	    	 	    // x:  opt.legendPosition ? opt.legenPosition : 'right',
        	                //show : props.showLegend ? props.showLegend : false,
        	                data :lengthArr,
        	                selectedMode : false,
        	                textStyle : {
        	                	color:"#fff"
        	                }
        	            },
    	                tooltip : {
    	                    trigger: 'item',
    	                    formatter: function(params){
    	                    	//"{b}<br/>{a} ：{c}GB<br/>占比  ：{d}%",
    	                    	var str = params.name;
    	                    	str +="<br/>";
    	                    	str += params.seriesName + "："+params.value +"GB";
    	                    	str +="<br/>";
    	                    	str += "占比："+params.percent + "%";
    	                    	return str;
    	                    },
    	                    textStyle : {
    	                    	fontSize :12,
    	                    	align : "left"
    	                    }
    	                },
    	                series : [
    	                    {
    	                        name:"流量",
    	                        type:'pie',
    	                        radius : '50%',
    	                        center: ['45%', '50%'],
    	                        data:pieList
    	                    }
    	                ]
    	            };

	        		return pieOpts;
	        		
	        	}
	        	// 环形饼图
	        	else if(chartType == "zp2"){
    				var legend = {
    	                orient : 'vertical',
    	                show : showLegend,
    	                x: legendPositonX,
    	                //show : opt.showLegend ?  opt.showLegend : true,
    	 	            //x:  opt.legendPosition ? opt.legenPosition : 'right',  
    	                y : legendPositonY || 30,
    	                data : [],
    	                textStyle : {
    	                	color:"#fff"
    	                }
    	            }
    	            var series = [];
    	            var seriesObj = {};
    	            seriesObj.data = [];
    	            seriesObj.type = 'pie';
    	            seriesObj.center = ['45%', '50%'];
    	            seriesObj.radius = ['40%', '60%'];
    	            seriesObj.itemStyle = {
    	                normal : {
    	                    label : {
    	                        show : false,
    	                        textStyle : {
                                   	//fontSize: grapTextSize,
                                },
    	                    },
    	                    labelLine : {
    	                        show : false
    	                    }
    	                },
    	                emphasis : {
    	                    label : {
    	                        show : true,
    	                        position : 'center',
    	                        textStyle : {
    	                            fontSize : '14',
    	                            fontWeight : 'bold'
    	                        }
    	                    }
    	                }
    	            }
    	            data.forEach(function(d){
    	            	var tempObj = {}
    	                tempObj.name = d.name;
    	                legend.data.push(tempObj);
    	                tempObj = {};
    	                tempObj.value = d.value;
    	                tempObj.name = d.name;
    	                seriesObj.data.push(tempObj);
    	            });
    	                
    	            series.push(seriesObj);
    	            var option = {
    	            	//color : [ "#107E37","#B8C22B","#EDCE11","#CE6C23","#9F181F","#44D67D","#008EE4","#008EE4","#D244D6","#008EE4","#6495ED"],
    	            	color : ["#1e90ff","#e9573f","#fa9f44","#e4d33b","#8cc152","#94d9f2","#967adc","#de8c71","#48cfad","#fde2aa","#ec87c0",
    	            	         "#cdcbfc","#00a4cc","#de59d1","#43a08d"],
	                    tooltip : {
	                        trigger: 'item',
	                        formatter: function(params){
	                        	//"{b} ：<br/>{c}MB ({d}%)",
	                        	var str = params.name;
    	                    	str +="<br/>";
    	                    	str +="流量："+params.value + "MB";
    	                    	str +="<br/>";
    	                    	str +="占比："+params.percent + "%";
    	                    	return str;
	                        },
	                        textStyle : {
	                        	fontSize : 12,
	                        	align : "left"
	                        },
	                     
	                    },
	                    legend: legend,
	                    series : series
	                };
    	            return option;
	        	}
	        	else {
	        		
	        		 var pie_datas = Echarts.dataFormat.noGroupData(data);
	 	            
	 	            var option = { 
	 	                tooltip: { 
	 	                    trigger: 'item',  
	 	                    formatter: '{b} ：{c} ({d}/%)'
	 	                },  
	 	                legend: {  
	 	                    orient: 'vertical', 
	 	                    show : opt.showLegend ?  opt.showLegend : false,
	 	                    x:  opt.legendPosition ? opt.legenPosition : 'left',  
	 	                    data: pie_datas.category 
	 	                },  
	 	                series: [  	  
	 	                    {  
	 	                        name: name || "",	  
	 	                        type: 'pie',  	  
	 	                        radius: '55%', 	  
	 	                        center: ['50%', '50%'], 	  
	 	                        data: pie_datas.data  
	 	                    }  
	 	                ]  
	 	            };  
	 	            
	 	            if(opt && opt.title){
	 	            	option.title = opt.title;
	 	            }
	 	            
	 	  			
	 	            return $.extend({}, Echarts.optionTmpl.base, option);  
	        		
	        	}
	  
	        },

	        //TODO
	        /**
	         * [折线图]
	         * @param {[type]}  data     [description]
	         * @param {[type]}  title     [description]
	         * @param {Boolean} is_stack [description]
	         */
	        Lines: function (data, opt) { 
	        	
	        	var me = this;
				var props = opt.props ||{};
				// 属性配置
				var ylUnit = props['ylUnit'] ||"";
				var xUnit = props['xUnit'] ||"";
				var ylName = props['ylName'] || "";
				var xName = props['xName']|| "";
				var xLabelRotate = props['xLabelRotate']|| 0;
				var yLabelRotate = props['yLabelRotate']|| 0;
				var singleColorList =["#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114","#77D011","#14D13E","#15D184","#17CECF", "#179AD0", "#1566D2", "#121AC8","#6F3FBC","#9D39BB","#4F438C","#C96565","#CD8366","#CA9D6C"];
				//var colorList =["#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114","#77D011","#14D13E","#15D184","#17CECF", "#179AD0", "#1566D2", "#121AC8","#6F3FBC","#9D39BB","#4F438C","#C96565","#CD8366","#CA9D6C","#ffc98f","#fad3a9","#f85327","#e77658","#b15b44","#b57767","#d0a79c","#af37a8","#ea44e0","#f464ec","#f28cec","#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114","#77D011","#14D13E","#15D184","#17CECF", "#179AD0", "#1566D2","#121AC8","#6F3FBC","#9D39BB","#4F438C","#C96565","#CD8366","#CA9D6C","#ffc98f","#fad3a9","#f85327","#e77658","#b15b44","#b57767","#d0a79c","#af37a8","#ea44e0","#f464ec","#f28cec","#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114","#77D011","#14D13E"];
				var colorList = [];
	        
	        	//获取图例信息
	        	var legend = Echarts.getLegend(opt);
	        	var showLegend, legendPositonX, legendPositonY;
	        	if(legend){
	        		showLegend = legend.showLegend;
	        		legendPositonX=legend.X  || 'left';
	        		legendPositonY=legend.Y || 'top';
	        	}
	        	
            var childType = opt.childType;

            // 重庆线图1
            if(childType == "cq-1"){
              return Echarts.getCQline01(data,opt);
            }
            // 重庆线图2
            if(childType == "cq-2"){
              return Echarts.getCQline02(data,opt);
            }
            var stackline_datas = Echarts.dataFormat.groupData(data, 'line', opt.is_stack);

        	var isNullxAxis = false;
        	if(stackline_datas.category.length == 1 && stackline_datas.category[0] == "xAxis"){
        		isNullxAxis = true;
        	}
        	var chartProps = opt.chartStyle;
        	
        	var unit = chartProps.unit || "%";
        	var unitNameY = chartProps.unitNameY || "流量";
        	var unit2 = chartProps.unit2 || "次";
        	var unitNameY2 = chartProps.unitNameY2 || "流量排名";
	        	

	        //获取专有属性  左纵坐标名称及单位ylName ylUnit  右纵坐标名称及单位yrName yrUnit
        	var specialPros = Echarts.getSpecialPros(opt);
        	if( specialPros ){
        		var defaultYlName = '', 
	        		defaultYrName= '', 
	        		defaultYlUnit= '', 
	        		defaultYrUnit= '',
	        		efaultYlUnit1= '', 
	        		defaultYrUnit1= '',
	        		defaultXUnit= '',
	        		defaultXName='';
        		    defaultYlUnit6='';
        		    defaultYlUnit5='';
        		    defaultYrUnit7='';
        		if(childType == "5"){
        		        defaultYlName = "占比";
	        			defaultYlUnit = "%";
	        			defaultYlUnit5 = "（%）";
	        			defaultXName = "";
	        			defaultXUnit = "";
        		}else if(childType == "6"){
        			defaultYlName = "流量";
        			defaultYlUnit = "（GB）";
        			defaultYlUnit6 = "GB";
        			defaultXName = "";
        			defaultXUnit = "";
        		}
        		var ylUnit = specialPros.ylUnit == undefined || specialPros.ylUnit == "" ?  defaultYlUnit : "（"+specialPros.ylUnit+"）";
        		var ylUnit5 = specialPros.ylUnit == undefined || specialPros.ylUnit == "" ?  defaultYlUnit5 : specialPros.ylUnit;
        		var ylUnit6 = specialPros.ylUnit == undefined || specialPros.ylUnit == "" ?  defaultYlUnit6 : specialPros.ylUnit;
        		var xUnit = specialPros.xUnit == undefined || specialPros.xUnit == "" ?  defaultXUnit : "（"+specialPros.xUnit+"）";
        		var yrUnit7 = specialPros.yrUnit == undefined || specialPros.yrUnit == "" ?  defaultYrUnit7 : "（"+specialPros.yrUnit+"）";
        		var yrUnit = specialPros.yrUnit == undefined || specialPros.yrUnit == "" ?  defaultYrUnit : specialPros.yrUnit;
        		var ylName = specialPros.ylName || defaultYlName;
        		var yrName = specialPros.yrName || defaultYrName;
        		var xName = specialPros.xName || defaultXName; 
        	}else{
        		if(childType == "5"){
        			var ylUnit = "%";
	        		var ylName = "占比";
	        		var xName = "";
        			var xUnit = "";
        		}else if(childType == "6"){
        			var ylName = "流量";
        			var ylUnit = "GB";
        			var ylUnit6 = "GB";
        			var xName = "";
        			var xUnit = "";
        		}
        	}	
	        	
	        	// 上下双折线图
	        	if(childType == "z1"){	
	        		
	        		return Echarts.getZldLine04(data,opt);
	        	}
	        	// 上下双折线面积图
	        	else if(childType == "z2"){
	        		return Echarts.getZldLine05(data,opt);
	        	}
	        	// 分组折线图百分比
	        	else if(childType == "5"){
	        		
	        		 var maxin = Utils.getMaxmin(data);
	        		
	        		 var seriesData = stackline_datas.series;
	        		 seriesData.forEach(function(item){
	        			 item.smooth = true;
	        			 item.symbol = "circle";
	        		 })
	        		 
	        		 var maxNum = maxin.max;
	        		 var minNum = maxin.min;
	        		 
        		     var min =  minNum  - ( maxNum -  minNum) * 0.05;
                     var max =  maxNum + ( maxNum -  minNum) * 0.05;
                     max = max == 0 ? 100 : max;
                     min = min < 0 ? 0 : min; 
                     var legendData = stackline_datas.category;
	        		 var lineOP = {
	        			legend : {
	        				show : isNullxAxis? false  : showLegend,
		        			 x : legendPositonX,
		        		 	 y : legendPositonY,
		        		 	 data : legendData,
		        		 	 textStyle:{
		        		 		 color : "#fff"
		        		 	 }
		        		 } ,
	        			series : isNullxAxis ?[{type : 'line', data : ['无数据']}] : (seriesData.length ? seriesData : [{type : 'line', data : []}]),
	        			grid : {
	                        borderWidth :0,
	                        borderColor :'#fff',
	                        x2 : 10,
	                        y2 : 25
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        textStyle : {
	                        	fontSize : "12",
	                        	align:"left"
	                        },
	                        formatter : function(v){
	                            var content = v[0].name + '<br/>';
	                            var nv = _.chain(v).sortBy(function(o) { return parseFloat(o.value,10); }).reverse().value();
	                            nv.forEach(function(it){
	                            	content += it.seriesName +"："+it.data + ylUnit + '<br/>';
	                            })
	                            
	                            window._echart_line_hoverData_X = { xtime : v[0].name,name:v[0].name};
	                            
//	                            chart2TimePoint = v[0].name;
//	                            triggerFlag = true;
	                            return content;
	                        }
	                    },
	                    xAxis : [ {
	                    		name:xName + xUnit,
 	                            type : 'category',
 	                            axisLine : {    // 轴线
 	                                show: true,
 	                                lineStyle: {
 	                                    color: 'white',
 	                                    type: 'solid',
 	                                    width: 2
 	                                }
 	                            },
 	                            boundaryGap : false,
 	                            axisTick: {onGap:false},
 	                            splitLine: {show:false},
 	                            data : stackline_datas.xAxis,
 	                            axisLabel: {
 	                                textStyle : {
 	                                    color: '#fff',
 	                                    //fontSize :grapTextSize || 12 
 	                                }
 	                            }
 	                        }
 	                    ],
 	                    yAxis : [
 	                        {
 	                            name: ylName + ylUnit5, //'占比(%)',
 	                            axisLine : {    // 轴线
 	                                show: true,
 	                                lineStyle: {
 	                                    color: 'white',
 	                                    type: 'solid',
 	                                    width: 2
 	                                }
 	                            },
 	                            type : 'value',
 	                            axisLabel: {
 	                                formatter: function (v) {
 	                                    return v.toFixed(2) + '%';
 	                                },
 	                                textStyle : {
 	                                    color: 'white',
 	                                    //fontSize : grapTextSize 
 	                                }
 	                            },
 	                            scale:true,
 	                            splitNumber: 10,
 	                            boundaryGap: [0,0],
 	                            splitLine: {show:false},
 	                            min:seriesData.length ? min : 0,
 	                            max:seriesData.length ? max : 100
 	                            
 	                        }
 	                    ]
 	                }
	        		 
	        		 //return ;
	        		
	                return  lineOP;
	        		
	        	}
	        	// 普通折线图
	        	else if(childType == '6'){
	        		
	        		 var option = {
	        				 legend : {
	        					 show :  isNullxAxis? false  : showLegend,
			        			 x : legendPositonX,
			        		 	 y : legendPositonY,
	        					 data : stackline_datas.category
	        				 },
	                         grid : {
	                             x2:60,
	                             y2:40,
	                             x:60,
	                             y:30,
	                             borderWidth: 1
	                         },
	                         tooltip : {
	                             trigger: 'axis',
	                             formatter: function(params){
	                            	 window._echart_line_hoverData_X = { xtime :params[0].name,name:params[0].name};
	                                 var unit = params[0].seriesName.substring(params[0].seriesName.indexOf("(")+1,params[0].seriesName.indexOf(")"));
	                                 var res = params[0].name + '<br/>'
	                                         + params[0].seriesName.substring(0,params[0].seriesName.indexOf("(")) + '：' + params[0].value+ylUnit6;//unit;
	                                 return res;
	                                 
	                             },
	                             textStyle:{
	                            	 fontSize : 12,
	                            	 align : "left"
	                             }
	                         },
	                         xAxis : [
	                             {
	                            	 name: xName + xUnit, //'占比(%)',
	                                 type : 'category',
	                                 boundaryGap : false,
	                                 splitLine: {
	                                     show:true,
	                                     lineStyle:{
	                                         type : 'dashed'
	                                     }
	                                 },
	                                 data:stackline_datas.xAxis,
	                                 axisLabel : {
	                                     textStyle : {
	                                         color : '#fff',
	                                         //fontSize : grapTextSize
	                                     }
	                                 }
	                             }
	                         ],
	                         yAxis : [
	                             {
	                                 name:ylName + ylUnit,//'流量(GB)',
	                                 type : 'value',
	                                 splitLine: {
	                                     show:true,
	                                     lineStyle:{
	                                         type : 'dashed'
	                                     }
	                                 },
	                                 axisLabel : {
	                                     textStyle : {
	                                         color : '#fff',
	                                         //fontSize : grapTextSize
	                                     }
	                                 }
	                             }
	                         ],
	                         series : [
	                             {
	                                 name:'流量(GB)',
	                                 type:'line',
	                                 smooth:true,
	                                 data:stackline_datas.series[0].data
	                             }
	                         ]
	                     };
	        		return option;
	        	} 
	        	//TODO
	        	else if(childType == "7"){
	        		 var color1 = "#ff8251";
	    			 var color2 = "#1fb9f7";
	    			
	        		 var legendName1 = stackline_datas.category[0] ;
	        		 var legendName2 = stackline_datas.category[1] ;
	        		 
	        		 if(stackline_datas.series[1]){
	        			 stackline_datas.series[1].yAxisIndex = 1;
	        		 }
	        		 stackline_datas.series.forEach(function(it){
	        			 it.smooth = true;
	        		 });
	        		 // 右终
	        		 var yData2 =stackline_datas.series[1].data;
	        		 // 左纵
        			 var yData1 =stackline_datas.series[0].data;
	        		 
        			 // 处理最大最小值
        			 var getMaxMinData = function(data){
        				 var _max = parseFloat(_.max(data));
        				 var _min = parseFloat(_.min(data));
        				
        				 var min = _min - (_min * 0.1);
        				 var max = _max + (_max * 0.1);
        				 
        				 if(min < 1 && min >0 ) min = 0;
        				 
        				 if((max < 1 && max >0 )|| (max == 1 && min == 1)){
        					 max = 1;
        					 min = 0;
        				 }
        				 
        				 return {
        					 max : Math.round(max),
        					 min : Math.round(min)
        				 }
        			 }
        			 
        			 
        			 
        			 
        			 var M1 = getMaxMinData(yData1);
        			 var M2 = getMaxMinData(yData2)
        			 var max1 = M1.max;
        			 var min1 = M1.min;
        			 
        			 var max = M2.max;
        			 var min = M2.min;
        			 var snum = 5 ; 
        			 if(max1 < 5 && max1 > 0){
        				 snum = Math.round(max1)  ;
        				 snum = /1|2|3/.test(snum) ? 1 : snum;
        			 }
        			 
        			 var snumRight = 5;
        			 if(max < 5 && max > 0){
        				 snumRight = Math.round(max) 
        				 snumRight = /1|2|3/.test(snumRight) ? 1 : snumRight;
        			 }
        			 
        			 
        			 var calSplitnum = function(max , min){
        				 // 取最大最小值差值
        				 var tmp = Math.ceil(max - min);
        				 var sn = 5;
        				 if(max == 1 && min ==0 ){
        					 return sn;
        				 }
        				 if(max == 0 && min ==0){
        					 return 1;
        				 }
        				 if(tmp < 5){
        					 sn = tmp <= 1 ?  1 : tmp -1  ;
        				 }
        				 
        				 return sn;
        			 }
        			 snum = calSplitnum(max1,min1)
        			 snumRight = calSplitnum(max,min);
        			 if(max == min){
        				 max += 1;
        				 min -= min >=1 ? 1 : min;
        			 }
        			 if(max1 == min1){
        				 max1 += 1;
        				 min1 -= min1 >=1 ? 1 : min1;
        			 }


//        			 
	        		 var option = {
	        				 color:[color1,color2],
	        				 legend : {
	        					 show:  isNullxAxis? false  : showLegend,
	        					 itemHeight:14,
	        					 selectedMode : false,
	        					 data: [
                    	            {
                    	                name:ylName || legendName1,//legendName1,
                    	                //icon : './image/legend1.png',
                    	                textStyle:{
                    	                	fontWeight:'bold',
                    	                	color: color1
                    	                }
                    	            },
                    	            {
                    	                name:yrName || legendName2 ,//legendName2,
                    	                textStyle:{
                    	                	fontWeight:'bold',
                    	                	color: color2
                    	                },
                    	               // icon : './image/legend2.png',
                    	            }
                    	         ],
	        					 orient: 'horizontal', 
	                             x: legendPositonX || 'right', 
	                             y: legendPositonY || 'top', 
	        				 },
	                         grid : {
	                             x2:60,
	                             y2:20,
	                             x:60,
	                             y:50,
	                             borderWidth:0
	                         },
	                         tooltip : {
	                             trigger: 'axis',
	                             formatter: function(params){
	                            	 if(ylName){
	                            		 params[0].seriesName = ylName; 
	                            	 }
	                            	 if(yrName){
	                            		 params[1].seriesName = yrName; 
	                            	 }
	                            	 var str = params[0].name +"<br/>";
	                            	 //str +=params[0].seriesName +":"+params[0].data+ "("+unit+")" + "<br/>";
	                            	 //str +=params[1].seriesName +":"+params[1].data+"("+unit2+")";
	                            	 //str +=ylName||legendName1 +":"+params[0].data+ ylUnit + "<br/>";
	                            	 //str +=yrName||legendName2+":"+params[1].data+ yrUnit;
	                            	 str +=params[0].seriesName +"："+params[0].data+ ylUnit6 + "<br/>";
	                            	 str +=params[1].seriesName +"："+params[1].data+yrUnit;
	                            	 window._echart_line_hoverData_X = { xtime :params[0].name,name:params[0].name};
		                              return str;
	                             },
	                             textStyle:{
	                            	 fontSize : 12,
	                            	 align : "left"
	                             }
	                         },
	                         xAxis : [
	                             {
	                            	 type : 'category',
	                                 boundaryGap : false,
	                                 splitLine: {
	                                     show:false,
//	                                     lineStyle:{
//	                                         type : 'dashed'
//	                                     }
	                                 },
	                                 data:stackline_datas.xAxis,
	                                 axisLabel : {
	                                     textStyle : {
	                                         color : '#fff',
	                                         //fontSize : grapTextSize
	                                     }
	                                 }
	                             }
	                         ],
	                         yAxis : [
	                             {
	                                 name: (ylName||legendName1) + ylUnit,//legendName1,
	                                 type : 'value',
	                                 splitLine: {
	                                	 show:false,
	                                 },
	                                 splitNumber: snum,
	                                 axisLine : {    // 轴线
	                 	                show: true,
	                 	                lineStyle: {
	                 	                    color: color1,
	                 	                }
	                 	             },
	                                 axisLabel : {
	                                	 formatter: function (v) {
	                                		 if(v<=1 && v>0){
	                                			 return _.round(v, 2) ; 	
	                                		 }else{
	                                			 return _.round(v);
	                                		 }
	                 	                    
	                 	                 },
	                                     textStyle : {
	                                         color : color1,
	                                         //fontSize : grapTextSize
	                                     }
	                                 },
	                                 max :max1,
	                                 min : min1

	                             },
	                             {
	                                 name: (yrName||legendName2) + yrUnit7,//legendName2,
	                                 type : 'value',
	                                 axisLine : {    // 轴线
	                 	                show: true,
	                 	                lineStyle: {
	                 	                    color: color2,
	                 	                }
	                 	             },
	                                 splitNumber: snumRight,
	                 	             boundaryGap: [0,0],
	                 	             splitLine: {show:false},
	                 	             axisLabel: {
	                 	                formatter: function (v) {
	                 	                    return Math.round(v)
	                 	                },
	                 	                textStyle : {
	                 	                	 color : color2,
	                 	                	//fontSize : grapTextSize
	                 	                }
	                 	             },
	                                 max :  max ,
	                                 min : min 
	                             }
	                         ],
	                         series : stackline_datas.series
	                     };
	        		
	        		return option;
	        		
	        	}
	        	else{
	        		
		            var option = {  
		            	//title: title,
		                legend: {  
		                	show: showLegend,
                            x: legendPositonX || 'left', 
                            y: legendPositonY || 'top',
		                    data: stackline_datas.category 
		                },  
		  
		                xAxis: [{  	  
		                    type: 'category', //X轴均为category，Y轴均为value  	  
		                    data: stackline_datas.xAxis,
		                    axisLabel : {
                                textStyle : {
                                    color : color2,
                                    //fontSize : grapTextSize
                                }
                            },
		                   // boundaryGap: false//数值轴两端的空白策略 	  
		                }],  
		  
		                yAxis: opt.yAxis || [{  	  
		                    name: name || '',  	  
		                    type: 'value',  	  
		                    splitArea: { show: false } ,
		                    axisLabel : {
                                textStyle : {
                                    color : color2,
                                    //fontSize : grapTextSize
                                }
                            },
		                }],  
		  
		                series: stackline_datas.series  
		  
		            }; 
		            
		            if(opt.title){
		            	option.title = opt.title;
		            }
		            return $.extend({}, Echarts.optionTmpl.lineOption, option);  
		      	  
	        	}
	  
	           
	        }, 
	       
	        /**
	         * [Bars 柱图]
	         * @param {[type]}  data     [description]
	         * @param {[type]}  title     [description]
	         * @param {Boolean} is_stack [description]
	         * 
	         * data:数据格式：{name：xxx,group:xxx,value:xxx}...  
	         */
	        //TODO
	        Bars: function (data, opt) {
	        	
	        	var me = this;
				var childType = opt.childType;
				var props = opt.props ||{};
				// 属性配置
				var ylUnit = props['ylUnit'] ||"";
				var xUnit = props['xUnit'] ||"";
				var ylName = props['ylName'] || "";
				var xName = props['xName']|| "";
				var xLabelRotate = props['xLabelRotate']|| 0;
				var yLabelRotate = props['yLabelRotate']|| 0;
				
				var singleColorList =["#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114","#77D011","#14D13E","#15D184","#17CECF", "#179AD0", "#1566D2", "#121AC8","#6F3FBC","#9D39BB","#4F438C","#C96565","#CD8366","#CA9D6C"];
				//var colorList =["#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114","#77D011","#14D13E","#15D184","#17CECF", "#179AD0", "#1566D2", "#121AC8","#6F3FBC","#9D39BB","#4F438C","#C96565","#CD8366","#CA9D6C","#ffc98f","#fad3a9","#f85327","#e77658","#b15b44","#b57767","#d0a79c","#af37a8","#ea44e0","#f464ec","#f28cec","#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114","#77D011","#14D13E","#15D184","#17CECF", "#179AD0", "#1566D2","#121AC8","#6F3FBC","#9D39BB","#4F438C","#C96565","#CD8366","#CA9D6C","#ffc98f","#fad3a9","#f85327","#e77658","#b15b44","#b57767","#d0a79c","#af37a8","#ea44e0","#f464ec","#f28cec","#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114","#77D011","#14D13E"];
				var colorList = [];
				var len  = Math.ceil(data.length/20);
				for(var i=0;i<len;i++){
					colorList = colorList.concat(singleColorList);
				}
				// 普通柱图
				if(childType =="cq_bar01"){
					opt.data = data;
					var __option = propsUtil.getVerticalBar(opt);
//					if(__option.tooltip){
//						__option.tooltip.formatter =  function (params) {
//							var info = "类型："+ params.name + "<br/>数量：" + params.value +ylUnit;
//							return info;
//						}
//					}
					
					return __option;
				}

				if(childType  == "horiz_bar"){
					opt.data = data;
					var __option = propsUtil.getHorizontalBar(opt);
					return __option;
				}


				// 普通柱图
				if(childType == "cqbase"){
					var xAxis = [];
					var series = [];
					var sData = [];
					data.forEach(function(it){
						xAxis.push(it.name);
						sData.push({value : it.value,name : it.name, info:it.info || ""});
					})

					series.push({
						type : "bar",
						data : sData,
						itemStyle: {
							normal: {
								color: function(params) {
									return colorList[params.dataIndex]
								}
							}
						}
					})
					var option = {
						grid : {
							y:80,
							x:50,
							borderWidth: 0
						},
						xAxis: [{
							name : xName + xUnit,
							type: 'category',
							data: xAxis,
							axisLabel : {
								textStyle : {
									color : '#fff',
								},
								rotate :xLabelRotate
							},
							splitLine:false,
							axisLine : {
								lineStyle :{
									color: "#fff",
									width: 1,
								}
							},
							axisTick :{
								show :false
							}
						}],
						tooltip : {
							trigger: 'item',
							textStyle:{
								fontSize : 12,
								align : "left"
							},
							formatter: function (params) {
								var info = params.data.info;
								if(info){
									return info;
								}else{
									return params.name + "<br/>" + params.value;
								}
							}
						},
						yAxis: [{
							name : ylName + ylUnit,
							type: 'value',
							splitLine:false,
							axisLabel : {
								textStyle : {
									color : '#fff',
								},
								rotate :option.props.yLabelRotate || ""
							},
							axisLine : {
								lineStyle :{
									color: "#fff",
									width : 1
								}
							},
							axisTick :{
								show :false
							}
						}],
						series: series

					};
					return option;
				}

				
				var stack_bars = Echarts.dataFormat.groupData(data,'bar',opt.props.is_stack);
				if(childType == "stack_bar"){
					var option = { 
        				 grid : {
                             borderWidth :0,
                             borderColor :'#fff',
                             x:65,
                             y:20,
                             y2:20,
                             x2: 35
                         },
      	                legend: {
      	                	//show: isNullxAxis ? false : showLegend,
      	                	show: true,
      	                	orient: 'horizontal', 
                            x: 'right', 
                            y: 'top',
                            padding:[0, 28, 0, 0],
                            textStyle : {
                            	color : "#fff"
                            },
      	                	data :stack_bars.category
      	                },  
      	                tooltip : {
                          trigger: 'axis',
                          textStyle:{
                        	  fontSize : 12,
                        	  align : "left",
                        	  
                          }
                        },
                        calculable : false,
                        xAxis : [
                            {
                                name:xName + xUnit,
                            	type : 'category',
                                splitLine: {show:false},
                                axisLabel: {
                                    textStyle : { 
                                    	color: '#fff',
                                    	//fontSize : grapTextSize
                                    },
                                    rotate :xLabelRotate
                                },
                                splitLine : {show : false},
 	                            splitArea : {show : false},
                                data : stack_bars.xAxis	  
                            }
                        ],
      	                yAxis: [{
  	                    	show:true,
  	                    	name:ylName + ylUnit,
  	                    	//name:unitNameY + "("+unit+")",
      	                    type : 'value',
      	                    splitLine: {show:false},
      	                    axisLabel: {
      	                    	textStyle : {
      	                    		color: "white",
      	                    		//fontSize : grapTextSize
      	                    	},
      	                    	rotate :opt.props.yLabelRotate || "",
      	                    	formatter : function(param){
	  	      	                	return param;  
	  	      	                }
      	                    },
  	                    }],  
      	                series: stack_bars.series  
      	            }; 
	        		
	        		return option;
	        	}




	        	
	        	var bars_dates = Echarts.dataFormat.groupData(data,'bar',opt.is_stack);
	        	// 正常组图(直连点)
	        	
	        	if(childType == "zb2"){

	        		 var option = { 
	        		 	 color:opt.props.colorList,
        				 grid : {
                             borderWidth :0,
                             borderColor :'#fff',
                             x:65,
                             y:20,
                             y2:20,
                             x2: 35
                         },
      	                legend: {
      	                	//show: isNullxAxis ? false : showLegend,
      	                	show: true,
      	                	orient: 'horizontal', 
                            x: 'right', 
                            y: 'top',
                            padding:[0, 28, 0, 0],
                            textStyle : {
                            	color : "#fff"
                            },
      	                	data :bars_dates.category
      	                },  
      	                tooltip : {
                          trigger: 'axis',
                          formatter:function(v){
                              var res = v[0].name + "<br/>";
                              $.each(v,function(i,d){
                                  if(d.value != "-" && d.value!='' &&  d.seriesName!='' && d.seriesName !="xAxis")
                                      res += d.seriesName+"："+d.value + ylUnitZb2 +"<br/>";
                              })
                              return res;
                          },
                          textStyle:{
                        	  fontSize : 12,
                        	  align : "left",
                        	  
                          }
                        },
                        calculable : false,
                        xAxis : [
                            {
                                name:xName + xUnit,
                            	type : 'category',
                                splitLine: {show:false},
                                axisLabel: {
                                    textStyle : { 
                                    	color: '#fff',
                                    	//fontSize : grapTextSize
                                    },
                                },
                                splitLine : {show : false},
 	                            splitArea : {show : false},
                                data : bars_dates.xAxis	  
                            }
                        ],
      	                yAxis: [{
  	                    	show:true,
  	                    	name:ylName + ylUnit,
  	                    	//name:unitNameY + "("+unit+")",
      	                    type : 'value',
      	                    splitLine: {show:false},
      	                    axisLabel: {
      	                    	textStyle : {
      	                    		color: "white",
      	                    		//fontSize : grapTextSize
      	                    	},
      	                    	formatter : function(param){
	  	      	                	return param;  
	  	      	                }
      	                    },
  	                    }],  
      	                series: bars_dates.series  
      	            }; 
	        		
	        		return option;
	        	}
	        	else {
        		   var option = {  
      	                legend: {
      	                	data :bars_dates.category
      	                },  
      	                xAxis: [{  	  
      	                    type: 'category',  	  
      	                    data: bars_dates.xAxis	  
      	                }],  
      	  
      	                yAxis: [{ 
      	                    type: 'value',
      	                    splitNumber: 2 
      	                }],  
      	  
      	                series: bars_dates.series  
      	  
      	            }; 
        		  return $.extend({}, Echarts.optionTmpl.base, option);
	        	}
	        	
	             
	            
	          
	            
	            
	           
	  
	        },
	        /**
	         * [Gauge 仪表盘]
	         * @param {[Object]} data  [description]
	         * @param { Object} option 
	         */
	        Gauge : function(data ,opt){
	        	
	        	if(data == null || data == undefined || data.length==0){
	        		return {};
	        	}
	        	var DATA = {};
	        	if(data.length>0){
	        		for(var i=0;i<data.length;i++){
	        			if(i==0){
	        				DATA.name = data[i].name || data[i].label;
		        			DATA.value = data[i].value;
		        			DATA.tooltip = {
		        				formatter : data[i].info
		        			}
	        			}
	        		}
	        	}
	        	var option ={
//	        			 backgroundColor: '#1b1b1b',
	        			    tooltip : {
	        			        formatter: "{a} <br/>{c} {b}"
	        			    },
	        			    toolbox: {
	        			        show : false,
	        			        feature : {
	        			            mark : {show: true},
	        			            restore : {show: true},
	        			            saveAsImage : {show: true}
	        			        }
	        			    },
	        			    series : [
	        			        {
	        			            name:'速度',
	        			            type:'gauge',
	        			            min:0,
	        			            max:100,
	        			            splitNumber:4,
	        			            axisLine: {            // 坐标轴线
	        			                lineStyle: {       // 属性lineStyle控制线条样式
	        			                    color: [[0.7, '#ff0000'],[0.85, '#ffcc00'],[1, 'lime']],
	        			                    width: 3,
	        			                    shadowColor : '#fff', //默认透明
	        			                    shadowBlur: 5
	        			                }
	        			            },
	        			            axisLabel: {            // 坐标轴小标记
	        			                textStyle: {       // 属性lineStyle控制线条样式
	        			                    fontWeight: 'bolder',
	        			                    color: '#fff',
	        			                    shadowColor : '#fff', //默认透明
	        			                    shadowBlur: 5
	        			                }
	        			            },
	        			            axisTick: {            // 坐标轴小标记
	        			                length :10,        // 属性length控制线长
	        			                lineStyle: {       // 属性lineStyle控制线条样式
	        			                    color: 'auto',
	        			                    shadowColor : '#fff', //默认透明
	        			                    shadowBlur: 5
	        			                }
	        			            },
	        			            splitLine: {           // 分隔线
	        			                length :20,         // 属性length控制线长
	        			                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
	        			                    width:3,
	        			                    color: '#fff',
	        			                    shadowColor : '#fff', //默认透明
	        			                    shadowBlur: 5
	        			                }
	        			            },
	        			            pointer: {           // 分隔线
	        			                shadowColor : '#fff', //默认透明
	        			                shadowBlur: 3
	        			            },
	        			            title : {
	        			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
//	        			                    fontWeight: 'bolder',
	        			                    fontSize: 14,
//	        			                    fontStyle: 'italic',
	        			                    color: '#fff',
	        			                    shadowColor : '#fff', //默认透明
	        			                    shadowBlur: 5
	        			                }
	        			            },
	        			            detail : {
//	        			                backgroundColor: 'rgba(30,144,255,0.8)',
//	        			                borderWidth: 1,
//	        			                borderColor: '#fff',
//	        			                shadowColor : '#fff', //默认透明
//	        			                shadowBlur: 5,
//	        			                offsetCenter: [0, '50%'],       // x, y，单位px
	        			                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
//	        			                    fontWeight: 'bolder',
	        			                    color: '#fff'
	        			                }
	        			            },
	        			            data:[DATA]
	        			        }
	        			      
	        			       
	        			    ]	
	        			
	        	}
	        	
	        	
	        	return option;
	        	
	        },
	        
	        /**
	         * 关系图
	         * @param data
	         * @param opt
	         */
	        Force : function(data,opt){
	        	if(data == null || data == undefined || data.length==0){
	        		return {};
	        	}
	        	var option = Echarts.dataFormat.ftForce(data,opt);
	        	return option;
	        },
	        
	        /**
	         * [Map 地图]
	         * @param {[Object]} data  [description]
	         * @param { Object} option 
	         */
	        //TODO
	        Map : function(data , opt){
	        	
	        	if(data.length == 0  && opt.childType =='cq'){
	        		return getEmptyCqOption();
	        	}
	        	
	        	
	        	if(data == null || data == undefined || data.length==0){
	        		return {};
	        	}



	        	if(data.length == 1 && data[0].ordernum == "" ){
	        		var _emptyOP = { 
	 	                tooltip: { 
	 	                	 trigger: 'item',
    	                    formatter: function(params){
    	                    	//"{b}<br/>{a} ：{c}GB<br/>占比  ：{d}%",
    	                    	var str = params.name;
    	                    	str +="<br/>";
    	                    	//str += params.seriesName + "："+params.value +"GB";
    	                    	str +="<br/>";
    	                    	//str += "占比："+params.percent + "%";
    	                    	return str;
    	                    },
	 	                	 
    	                    textStyle : {
    	                    	fontSize :12,
    	                    	align : "left"
    	                    }
	 	                }, 
	 	                series: [  	  
	 	                         {
						            name: '',
						            type: 'map',
						            mapType: opt.chartStyle.mapType,
						            data:[]
	 	                         }
	 	                ]  
	 	            };  
	        		
        			return _emptyOP;
        		}
	        	var rangeOption = getRangeOption(data);
	        	var chartStyle = opt.chartStyle;
	        	var mapType = chartStyle.mapType;
	        	var childType =opt.childType;
	        	var option = {};
	        	
	        	//设置图例及 地图文字
	        	var grapText = Echarts.getGrapText(opt);
	        	var legend = Echarts.getLegend(opt);
	        	var showLegend, legendPositonX, legendPositonY, showGVal;
	        	if(legend){
	        		showLegend = legend.showLegend;
	        		legendPositonX=legend.X  || 'left';
	        		legendPositonY=legend.Y || 'top';
	        		showGVal = legend.showGVal;
	        	}
	        	
	        	// 迁徙地图处理
	        	if(mapType == "qianxi"){
	        		var mapData = Echarts.dataFormat.ftQianXi(data);	
	        		rangeOption.show = false;
	        		option = {
//        				backgroundColor: '#1b1b1b',
//    	        	    color: ['gold','aqua','lime'],
    	        	    color: ["#22f0c6","#ddff00","#2bcc00","#5057d9","#cc50c2","#ff6624","#39b372","#0066a6","#e5209d","#ffe600","#57cce9","#c054ff","#cb7c3c","#008ee4","#60ff00","#dd7171","#bfb239","#ff9d00","#8032cb","#e53030"],
    	        	    legend :{
    	        	    	show:false,
	        		        orient: 'vertical',
	        		        x:'left',
	        		        data: mapData.legend,
	        		        selectedMode: 'multiple',
	        		        textStyle : {
	        		            color: '#fff'
	        		        }
	        		    },
	        		    dataRange : rangeOption,
	        		    tooltip : {
	        		        trigger: 'item',
	        		        formatter:  function(params, ticket, callback){
	        		        	var str ="";
	        		        	var name = params.name;
	        		        	var value = params.value;
	        		        	if(value!=""){
	        		        		str = name ;
	        		        	}
	        		        	if(str.indexOf("-")>-1){
	        		        		str = str.substring(0, str.indexOf("-")-1)
	        		        	}
	        		        	return str;
	        		        },
	        		        textStyle:{
   	       				    	fontSize :12
   	       				    }
	        		    },
	        		    series :  mapData.series
	        		}
	        		
	        		return $.extend({}, Echarts.optionTmpl.mapOption,option);
	        			
	        	}else if(mapType == "world"){
	        		var mapData = Echarts.dataFormat.ftWorld(data);	
	        		rangeOption.show = false;
	        		option = {
//	        			backgroundColor: '#1b1b1b',
    	        	    color: ["#22f0c6","#ddff00","#2bcc00","#5057d9","#cc50c2","#ff6624","#39b372","#0066a6","#e5209d","#ffe600","#57cce9","#c054ff","#cb7c3c","#008ee4","#60ff00","#dd7171","#bfb239","#ff9d00","#8032cb","#e53030"],
    	        	    legend :{
	        		        orient: 'vertical',
	        		        x:'left',
	        		        data: mapData.legend,
	        		        selectedMode: 'multiple',
	        		        textStyle : {
	        		            color: '#fff'
	        		        }
	        		    },
	        		    dataRange : rangeOption,
	        		    tooltip : {
	        		        trigger: 'item',
	        		        formatter: function(params, ticket, callback){
	        		        	var str ="";
	        		        	var name = params.name;
	        		        	var value = params.value;
	        		        	if(value!=""){
	        		        		str = name ;
	        		        	}
	        		        	if(str.indexOf("-")>-1){
	        		        		str = str.substring(0, str.indexOf("-")-1);
	        		        	}
	        		        	return str;
	        		        },
	        		        textStyle : {
	        		            color: '#fff',
	        		            fontSize :12
	        		        }
	        		    },
	        		    series :  mapData.series
	        		}
	        		
	        		return $.extend({}, Echarts.optionTmpl.mapOption,option);
	        	}else if(mapType =="3dworld"){
	        		
	        		var option = Echarts.dataFormat.ft3DWorld(data);	
	        		return option;
	        	}
	        	else{
	        		
	        		var map_datas = Echarts.dataFormat.groupData(data,'map',mapType);	
	        		
	        		var maxin = Utils.getMaxmin(data);
	        		
	        		
		        	option.series = map_datas.series;
		        	//显示地图文字值
		        	//option.series[0].itemStyle.normal.label.show = showGVal || false;
		        	if(option.series[0]){
						option.backgroundColor = "rgba(0,0,0,0)";
		        		option.series[0].itemStyle = {
							normal : {
								borderColor: "rgba(100,149,237,1)",
								borderWidth: 0.5,
								label : {
									show:false,
									textStyle:{
										//fontSize:grapText
									}
								},
								areaStyle: {
									color: "rgba(45,45,90,0.5)"
								}
							},
							emphasis : {
								label: {
									color : "rgba(240,255,240,0.4)",
									show: false
								}
							}
						}
		        	}
		        	
		        	// 重庆地图
		        	if(childType =="cq"){


						var mapDataObj = {};

						data.forEach(function(it){
							mapDataObj[it.name] = it.items || [];
						})

	        	        option.dataRange = {
			                x: 'left',
			                y: '30',
			                calculable: true,
			                color: ['#d94e5d','#eac736','#50a3ba'],
			                min: maxin.min,//0,
			                max: maxin.max,//1000,
			                textStyle:{
			                    color: '#fff'
			                }
			            };

						var getPointData = function(data){
							var obj = Object.create(null);
							var areaData = [];
							data.forEach(function(d){
								areaData.push({
									name : d.name,
									value : d.value
								})
							})
							obj.markPoint = {
								clickable:false,
								symbolSize: 12,
								itemStyle: {
									normal: {
										label: {
											show: false //去掉地图水滴效果上的文字
										}
									},
									emphasis: {
										label: {
											show: false
										}
									}
								},
								data :areaData
							}

							return obj;
						};

						var seriesObj = getPointData(data);
						option.series[0].data = [];
						option.series[0].markPoint = seriesObj.markPoint;
						option.series[0].geoCoord = cqGeoCoord;
						option.series[0].roam = true;	
							
						option.tooltip = {
							trigger: 'item',
							position : function(p) {

								return [p[0] +5, p[1] - 40];
							},
							formatter: function(params, ticket, callback){

								var items = mapDataObj[params.name] || {name:params.name};
								var str ="";
								if(params.name){
									str += params.name + "<br/>";
								}
								if(items && items.length) {
									items.forEach(function(it){
										str += it.name + "："+it.num + it.unit + "<br/>";
									})
								}
								return str;
							},
							textStyle : {
								color: '#fff',
								fontSize :12,
								align:"left"
							}
						};
						return option;

		        	}else{
		        		//地图值域选择
			        	option.dataRange = {
			                x: 'left',
			                y: 'top',
			                orient: 'horizontal',
			                text:['大','小'],
			                range:null,
			                splitNumber:rangeOption.splitNumber,//4,
			                color: rangeOption.color,//['#ff0100', '#ffa800', '#ffff00', '#14c8ec'],
			                min: rangeOption.min,//0,
			                max: rangeOption.max,//1000,
			                textStyle:rangeOption.textStyle
			            };
		        	}
		        	
		        	
		        	option.tooltip = {
        		        trigger: 'item',
        		        enterable: true,
        		        position : function(p) {
    			            // 位置回调
    				        // console.log && console.log(p);
    				        return [p[0] +5, p[1] - 40];
    				    },
        		        formatter: function(params, ticket, callback){
        		        	
        		        	var data = params.data.dataObj || {name:params.name};
        		        	var str ="";
        		        	if(data.name){
        		        		str += data.name + "<br/>";
        		        	}
        		        	if(childType =="cq"){
        		        		return str ;
        		        	}
        		        	
        		        	
        		        	if(data.ordernum){
        		        		str += "排名："+data.ordernum + "<br/>";
        		        	}
        		        	if(data.value){
        		        		str += "流量："+data.value + "GB <br/>";
        		        	}
        		        	if(data.percent){
        		        		str += "占比："+data.percent + "%<br/>";
        		        	}
        		        	if(data.value == undefined){
        		        		str = "暂无数据";
        		        	}        		        	
//        		        	var name = params.name;
//        		        	var value = params.value;
//        		        	if(value!=""){
//        		        		str = name ;
//        		        	}
//        		        	if(str.indexOf("-")>-1){
//        		        		str = str.substring(0, str.indexOf("-")-1);
//        		        	}
        		        	return str;
        		        },
        		        textStyle : {
        		            color: '#fff',
        		            fontSize :12,
        		            align:"left"
        		        }
        		    };	        	
		        	
		        	return $.extend({}, Echarts.optionTmpl.mapOption,option); 
	        	}
	        	
				 
	        },
	        /**
         * 混合 双图 同步图 (特例图) 折柱混搭
         * @param {[type]} data   [description]
         * @param {[type]} option [description]
         */
	     //TODO
	      ComboDailyOne : function(data,option){
                var lrZoom = 10;
                var xAxisData = [];
                var lData = [];
                var rData = [];         
                var maxL=0,maxR=0;
                for(var id in data){
                    xAxisData.push(data[id].name);
                    if(!isNaN(parseFloat(data[id].value_1))){
                        lData.push({value: parseFloat(data[id].value_1)});
                    }
                    if(!isNaN(parseFloat(data[id].value_2))){
                        rData.push({value: parseFloat(data[id].value_2) * lrZoom});
                    }
                    if(data[id].value_1>maxL){
                        maxL = parseFloat(data[id].value_1);
                    }
                    if(data[id].value_2>maxR){
                        maxR = parseFloat(data[id].value_2);
                    }
                }
                //  maxL *= 1.2;
                //  maxR *=  1.2;
                //  maxR = maxR > 100 ? 100 : maxR;
                
                // if(maxR > 0.5){
                //     maxR = Math.ceil(maxR * lrZoom);
                // }
                
                var delayItemStyle = { 
                    normal: {
                        color: '#00eef1',
                        label: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                fontFamily: '微软雅黑',
                                fontWeight: 'normal'
                            },
                            formatter: function(params,ticket,callback) {
                                return params.value+option.chartStyle.unit_L;
                            }
                        }
                    }
                };
                var lrItemStyle = {
                    normal: {
                        lineStyle: {
                            width: 2,
                            color: '#ff0000'
                        }
                    }
                };
                var axisLine = {
                    lineStyle: {
                        color: '#fff', 
                        width: 1, 
                        type: 'solid'
                    }
                };
                var axisLabel = {
                    textStyle: {
                        color: '#fff',
                        fontFamily :'Microsoft YaHei'
                    }
                };
                var axisTick = {
                    lineStyle: {
                        color: '#fff'
                    }
                };
                 var config = {
                        legend: {
                            itemWidth: 15,
                            itemHeight: 10,
                            textStyle: {
                                color: '#fff'
                            },
                            data: [option.props.ylName_L, option.props.ylName_R]
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            },
                            formatter: function(params){
                                var res = params[0][1];
                                res += '<br/>' + params[0][0] + '：' + params[0][2] + option.chartStyle.unit_L;
                                res += '<br/>' + params[1][0] + '：' + parseFloat((parseFloat(params[1][2]) / lrZoom).toFixed(3)) + option.chartStyle.unit_R ;
                                return res;
                            }
                        },
                        calculable: false,
                        xAxis: [{
                            type: 'category',
                            data: xAxisData,
                            show: true,
                            axisLine: axisLine,
                            splitLine: {
                                show: false
                            },
                            axisLabel: axisLabel,
                            axisTick: axisTick
                        }],
                        yAxis: [{
                            name: option.props.ylName_L || "",
                            type: 'value',
                            //max: maxL,
                            axisLine: axisLine,
                            axisLabel: axisLabel,
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    type: 'dashed'
                                }
                            },
                            axisTick: axisTick
                        },{
                            name: option.props.ylName_R || "",
                            type: 'value',
                            //max: maxR,
                            yAxisIndex: 1,
                            axisLine: axisLine,
                            axisLabel: axisLabel,
                            splitLine: {
                                show: false
                            },
                            axisLabel : {
                                textStyle: {
                                    color: '#fff'
                                },
                                formatter: function(v){
                                    return (v / lrZoom).toFixed(2);
                                }
                            },
                            axisTick: axisTick
                        }],
                        grid: {
                            borderWidth: 0,
							x: 60,
							x2: 60,
							y: 50,
							y2: 70
                        },
                        series: [{
                            name: option.props.ylName_L,
                            type: 'bar',
                            data: lData,
                            barCategoryGap: '40%',
                            itemStyle: delayItemStyle,
                            // markLine: {
                            //     itemStyle: delayItemStyle,
                            //     data: [{
                            //         type: 'average',
                            //         name: '平均值'
                            //     }]
                            // }
                        }, {
                            name: option.props.ylName_R,
                            type: 'line',
                            //symbol: 'none',
                            smooth: true,
                            yAxisIndex: 1,
                            data: rData,
                            itemStyle: {
                                normal: {
                                    lineStyle: { // 系列级个性化折线样式，横向渐变描边
                                        width: 2,
                                        // color: (function (){    
                                        //     var zrColor = zrender.tool.color;                                       
                                        //     return zrColor.getLinearGradient(
                                        //         0, 0, 1000, 0,
                                        //         [[0, 'rgba(31,185,247,0.8)'],[0.8, 'rgba(255,130,81,0.8)']]
                                        //     )
                                        // })()
                                        color:'#ff8251'
                                    }
                                },
                                emphasis: {
                                    label: {show: false}
                                }
                            }
                        }]
                    };

                    return config;
            }, 
 

		},

	    //获取专有属性  左纵坐标名称及单位ylName ylUnit  右纵坐标名称及单位yrName yrUnit
        getSpecialPros : function(opt){
        	if(opt == undefined)return;
        	var props = opt.props;
			var specialProp = props == undefined ? {} : props.specialProp;
			if(specialProp != undefined){
				return specialProp;
			}
        },
        //暂时未用
        getAxisMM : function(opt){
        	var axisMmVal = {};
        	if(opt == undefined)return;
        	var props = opt.props;
        	var specialProp = opt.props == undefined ? {} : opt.props.specialProp;
        	if(specialProp != undefined){
        		axisMmVal['xMin'] = specialProp.xMin == undefined ? "" :specialProp.xMin;
        		axisMmVal['xMax'] = specialProp.xMax == undefined ? "" :specialProp.xMax;
        		axisMmVal['ylMin'] = specialProp.ylMin == undefined ? "" :specialProp.ylMin;
        		axisMmVal['ylMax'] = specialProp.ylMax == undefined ? "" :specialProp.ylMax;
        	}
        	return axisMmVal;
        },
        //获取饼图的显示百分比小数
        getPieShowPercent : function(opt){
        	//
        	var pieSpecialProp = "";
        	if(opt == undefined)return;
        	var props = opt.props;
			var specialProp = opt.props == undefined ? {} : opt.props.specialProp;

			if(specialProp){
				if(specialProp.pieShowPercent =="" || specialProp.pieShowPercent == undefined){
					pieSpecialProp = 0.02;
				}else{
					pieSpecialProp = parseInt(specialProp.pieShowPercent)/100;
				}
				//pieSpecialProp = specialProp.pieShowPercent == 0 || specialProp.pieShowPercent !="" && specialProp.pieShowPercent != undefined ? parseInt(specialProp.pieShowPercent)/100 : 0.02;
			}else{
				pieSpecialProp = 0.02;
			}

        	return pieSpecialProp;
        },
        //处理图例及图例位置
        getLegend : function(opt){
        	var legend = {};  	
        	var legendPositon;
        	
        	if(opt == undefined)return;
        	var props = opt.props;
			var commonProp = opt.props == undefined ? {} : opt.props.commonProp;

			if(commonProp != undefined){
				legend["showLegend"] = commonProp.showLegend == "true" ? true : false;
				legendPositon = commonProp.legendPositon;
				legend["showGVal"] = commonProp.showGVal == "true" ? true : false;
				
				if( legendPositon ){
					switch( legendPositon ){
						case RC.Z_PROPS.LEGENDALIGN.L_T:
							legend["X"] = 'left';
							legend["Y"] = 'top';
							break;
						case RC.Z_PROPS.LEGENDALIGN.C_T:
							legend["X"] = 'center';
							legend["Y"] = 'top';						
							break;
						case RC.Z_PROPS.LEGENDALIGN.R_T:
							legend["X"] = 'right';
							legend["Y"] = 'top';
							break;
						case RC.Z_PROPS.LEGENDALIGN.L_B:
							legend["X"] = "left";
							legend["Y"] = 'bottom';
							break;
						case RC.Z_PROPS.LEGENDALIGN.C_B:
							legend["X"] = 'center';
							legend["Y"] = 'bottom';
							break;
						case RC.Z_PROPS.LEGENDALIGN.R_B:
							legend["X"] = 'right';
							legend["Y"] = 'bottom';
							break;
						case RC.Z_PROPS.LEGENDALIGN.L_C:
							legend["X"] = "left";
							legend["Y"] = 'center';
							break;
						case RC.Z_PROPS.LEGENDALIGN.C_C:
							legend["X"] = 'center';
							legend["Y"] = 'center';
							break;
						case RC.Z_PROPS.LEGENDALIGN.R_C:
							legend["X"] = 'right';
							legend["Y"] = 'center';
							break;
					    default:;
					}
				}
				
			}
        	
        	return legend;
        },
        getGrapText : function(opt){
        	var grapText;
        	
        	if(opt == undefined)return ;
        	//处理图例及图例位置
        	var props = opt.props || {};
			var commonProp = props == undefined ? {} : props.commonProp;
			if(commonProp != undefined){
				grapText = commonProp.commonft;
			}
        	return grapText;
        	
        },
		/**
		 * [getMaxMin 获取最大最小值]
		 * @param  {[type]} datas [description]
		 * @return {[type]}       [description]
		 */
		getMaxMin : function(datas){
			
			var _d = [];
			datas.forEach(function(it){
				var ar = it.point;
				if(ar.length){
					ar.forEach(function(dd){
						_d.push(dd);
					})
				}
			});

			var min = 0, max = 0 ,arr = [];
			for(var i = 0;i<_d.length ; i++){
				if(_d[i].value){
					arr.push(_d[i].value);
				}
			}
			if(arr.length){
				min = Math.min.apply(Math,arr);
				max = Math.max.apply(Math,arr);
			}
			return {min : min ,max : max};

		},

		/**
		 * [getDataFilter 过滤下数据格式]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		getDataFilter : function(data){
			var arr = [];
			if( data == null  || data.length==0){
                data = [{name: '', value:''}];
            }

			if(data && data.length){
				for(var i =0 ;i<data.length ; i++){
					if(data[i].category !== ""){
						arr.push(data[i]);
					}
				}
			}
			return arr ;

		},
		
    	// 重庆折线图1
    	getCQline01 : function(data,option){

        	var stackline_datas = Echarts.dataFormat.groupData(data, 'line', true)

	        var option = {
	               legend : {
	                    data : stackline_datas.category,
	                    orient : 'horizontal',
	                    x : "right",
	                    y : "top",
	                    textStyle : {
	                      color : "#fff"
	                    },
	                    padding : 5
	               },
	               grid : {
	                   x2:60,
	                   y2:50,
	                   x:120,
	                   y:100,
	                   borderWidth: 0
	               },
	               tooltip : {
	                   trigger: 'axis',
	                   textStyle:{
	                     fontSize : 12,
	                     align : "left"
	                   }
	                },
	                 xAxis : [
	                     {
	                         type : 'category',
	                         boundaryGap : false,
	                         scale: true,
	                         splitLine: {
	                             show:true,
	                             lineStyle:{
	                                 color: 'rgba(50, 130, 193, 0.39)',
	                                 type : 'dashed'
	                             }
	                         },
	                         data:stackline_datas.xAxis,
	                         axisLabel : {
	                             textStyle : {
	                                 color : '#fff',
	                                 //fontSize : grapTextSize
	                             },
	                             rotate :option.props.xLabelRotate || ""
	                         },
	                         axisLine : {
	                           lineStyle :{
	                              color: "#fff",
	                              width : 1
	                           }
	                         },
	                         axisTick :{
	                          show :false
	                         }
	                     }
	                 ],
	                 yAxis : [
	                     {
	                         name:option.props.ylName || "",
	                         type : 'value',
	                         scale: true,
	                         splitLine: {
	                             show:true,
	                             lineStyle:{
	                                 color: 'rgba(50, 130, 193, 0.39)',
	                                 type : 'dashed'
	                             }
	                         },
	                         axisLabel : {
	                             textStyle : {
	                                 color : '#fff',
	                                 //fontSize : grapTextSize
	                             },
	                             rotate :option.props.yLabelRotate || ""
	                         },
	                         axisLine : {
	                           lineStyle :{
	                              color: "#fff",
	                              width: 1,
	                           }
	                         },
	                         axisTick :{
	                          show :false
	                         }
	                     }
	                 ],
	                 series : stackline_datas.series
	             };
	         console.log(option);
	        return option;         
	    },
		// 重庆折线图2
		getCQline02 : function(data,option){

			var stackline_datas = Echarts.dataFormat.groupData(data, 'line', false)

			stackline_datas.series.forEach(function(it){
				it.smooth=true;
			})
			var option = {
				legend : {
					data : stackline_datas.category,
					orient : 'horizontal',
					x : "right",
                    y : "top",
					textStyle : {
						color : "#fff"
					},
					padding : 5
				},
				grid : {
					x2:60,
					y2:50,
					x:80,
					y:30,
					borderWidth: 0
				},
				tooltip : {
					trigger: 'axis',
					textStyle:{
						fontSize : 12,
						align : "left"
					}
				},
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						scale: true,
						splitLine: {
							show:true,
							lineStyle:{
								color: 'rgba(50, 130, 193, 0.39)',
								type : 'dashed'
							}
						},
						data:stackline_datas.xAxis,
						axisLabel : {
							textStyle : {
								color : '#fff',
								//fontSize : grapTextSize
							},
							rotate :option.props.xLabelRotate || ""
						},
						axisLine : {
							lineStyle :{
								color: "#fff",
								width : 1
							}
						},
						axisTick :{
							show :false
						}
					}
				],
				yAxis : [
					{
						name:option.props.ylName || "",
						type : 'value',
						scale: true,
						splitLine: {
							show:true,
							lineStyle:{
								color: 'rgba(50, 130, 193, 0.39)',
								type : 'dashed'
							}
						},
						axisLabel : {
							textStyle : {
								color : '#fff',
								//fontSize : grapTextSize
							},
							rotate :option.props.yLabelRotate || ""
						},
						axisLine : {
							lineStyle :{
								color: "#fff",
								width: 1,
							}
						},
						axisTick :{
							show :false
						}
					}
				],
				series : stackline_datas.series
			};

			return option;
		},

		//TODO
		/**
		 * 直连点 上下折线图
		 * @param data
		 * @param opton
		 */
		getZldLine04 : function(data , option){
			
        	var grapTextSize = Echarts.getGrapText(option) || 12;
        	var legend = Echarts.getLegend(option);
        	var showLegend, legendPositonX, legendPositonY;
        	if(legend){
        		showLegend = legend.showLegend;
        		legendPositonX=legend.X  || 'left';
        		legendPositonY=legend.Y || 'top';
        	}
			
        	//获取专有属性  左纵坐标名称及单位ylName ylUnit  右纵坐标名称及单位yrName yrUnit
        	var specialPros = Echarts.getSpecialPros(option);
        	if( specialPros ){
        		var ylUnit = specialPros.ylUnit == undefined || specialPros.ylUnit == "" ?  "（GB）" : "（"+specialPros.ylUnit+"）";
        		var ylUnitZ1 = specialPros.ylUnit == undefined || specialPros.ylUnit == "" ?  "GB" : specialPros.ylUnit;
        		var xUnit = specialPros.xUnit == undefined || specialPros.xUnit == "" ?  "" : "（"+specialPros.xUnit+"）";
        		var ylName = specialPros.ylName || "流量";  
        		var xName = specialPros.xName || ""; 
        	}else{
        		var ylUnit = "（GB）";
        		var ylName = "流量"; 
        		var xUnit = "";
        		var xName = "";
        	}
        	
			if(data == null || data.length == 0){
				return getEmptyChartOption("zldline4", option);
			}
			if(data[0].flowin == null && data[0].xtime == null){
				return getEmptyChartOption("zldline4", option);
			}
			
			
			var flowInOutTrendOpts;
		   	var dataArr = data;
		   	var axisValueRangeFlow;
		    // 流入
	    	var flowIn = [];
	    	// 流出
	    	var flowOutAbs = [];
	    	// 流出
	    	var flowOut = [];
	    	var timeTicker = [];
	    	$.each(dataArr,function(i,d){
	    		var data = {
	    			value : d.flowin==null?0:parseFloat(d.flowin),
	    			txt : d.name || ""
	    		}
	    		flowIn.push(data);
	    		flowOutAbs.push(d.flowout==null?0:Math.abs(d.flowout));
	    		flowOut.push(d.flowout==null?0:-parseFloat(d.flowout));
	    		timeTicker.push(d.xtime);
	    	})
	    	var ticker = timeTicker[timeTicker.length-1];
	    	if(flowIn[timeTicker.length-1]!=0){
	    		flagIn = true;
	    	}
	    		
	    	if(flowOut[timeTicker.length-1]!=0){
	    		flagOut = true;
	    	}
	    	
	    	
	    	//计算最大值
	    	var calcMaxFlow = function(flowIn,flowOutAbs){
	    		var _outAbsMax = _.max(flowOutAbs);
	    		var _inMax = _.max(flowIn, function(v) {
	    			  return v.value;
	    		}).value;
	    		var max = _inMax > _outAbsMax ? _.ceil(_inMax) :  _.ceil(_outAbsMax)  ;
	    		return max+100 - max%100;
	    	} 
	    	axisValueRangeFlow = calcMaxFlow(flowIn,flowOutAbs);
	    	//流入流出流量趋势线图
	        flowInOutTrendOpts = {
	        	    grid : {
	        	    	borderWidth :0,
	        	    	borderColor :'#fff',
	        	    	//y:40,
	        	    	//y2:30,
	        	    	//x2:70
	        	    },
	        	    tooltip : {
	        	        trigger: 'axis',
	        	        formatter: function (params,ticket) {
	        	        	
	        	            ticker = params[0].name;
	        	        	var res = params[0].name;
	        	        	$.each(params,function(i,d){
	        	        		var val = d.data == null ? 0 : d.data;
	        	        		//res += "<br/>" + d.seriesName +"流量 :" + Math.abs(parseFloat(val)) + "GB";
	        	        		if(val.value!=undefined){
	        	        			val = val.value;
	        	        		}
	        	        		res += "<br/>" + d.seriesName + ylName+ " ：" + Math.abs(parseFloat(val)) + ylUnitZ1;
	        	        	})
	        	        	var _name = params[0].data.txt ; 
	        	        	
	        	        	var data = {
	        	        		xtime : params[0].name,
	        	        		name : _name
	        	        	}
	        	        	window._echart_line_hoverData_X = data;
	        	        	
	        	            return res;
	        	        },
	        	        textStyle:{
            	        	fontSize : 12,
            	        	align:"left"
            	        }
	        	    },
	        	    legend: {
	        	    	show : showLegend,
            	        orient: 'horizontal', 
            	        x: legendPositonX, 
            	        y: legendPositonY,
            	        selectedMode:false,
            	        padding: [0, 70, 0, 0],
	        	        data:[{
    		                name:'流入',
    		                textStyle:{fontWeight:'bold', color:'auto'}
    		            },
    		            {
    		                name:'流出',
    		                textStyle:{fontWeight:'bold', color:'auto'}
    		            }]
	        	    },
	        	    calculable : false,
	        	    xAxis : [
	        	        {
	        	        	name:xName + xUnit,
	        	            type : 'category',
	        	            boundaryGap : false,
	        	            splitLine: {show:false},
	        	            axisLabel: {
	        	                textStyle : {
	        	                	color: '#fff',
	        	                	//fontSize : grapTextSize
	        	                }
	        	            },
	        	            data : timeTicker,
	        	            boundaryGap:false,
	        	            axisLine : {    // 轴线
	        	                show: true,
	        	                lineStyle: {
	        	                	color: 'white',
	        	                    type: 'solid',
	        	                    width: 1
	        	                }
	        	            }
	        	        }
	        	    ],
	        	    yAxis : [
	       	            {
	           	        	name: ylName + ylUnit,//'流量(GB)',
	           	        	axisLine : {    // 轴线
	           	                show: true,
	           	                lineStyle: {
	           	                    color: 'white',
	           	                    type: 'solid',
	           	                    width: 2
	           	                }
	           	            },
	           	            type : 'value',
	           	         	boundaryGap:false,
	           	            scale:true,
	           	            splitNumber: 8,
	           	            boundaryGap: [0,0.1],
	           	            splitLine: {show:false},
	           	            axisLabel: {
	           	                formatter: function (v) {
	           	                    return Math.abs(v)
	           	                },
	           	                textStyle : {
	           	                	color: 'white',
	           	                	//fontSize : grapTextSize
	           	                }
	           	            },
	           	            min:-axisValueRangeFlow,
	           	            max:axisValueRangeFlow
	           	        }
	        	    ],
	        	    series : [
	        	        {
	        	            name:'流入',
	        	            type:'line',
	        	            smooth:true,
	        	            data:flowIn
	        	        },
	        	        {
	        	            name:'流出',
	        	            type:'line',
	        	            smooth:true,
	        	            data:flowOut
	        	        }
	        	    ]
	        	};
	    	return flowInOutTrendOpts;
		},
		/**
		 * 直连点 上下折线面积图
		 * @param data
		 * @param opton
		 */
		//TODO
		getZldLine05 : function(data , option){

			var grapTextSize = Echarts.getGrapText(option) || 12;
        	var legend = Echarts.getLegend(option);
        	var showLegend, legendPositonX, legendPositonY;
        	if(legend){
        		showLegend = legend.showLegend;
        		legendPositonX=legend.X  || 'left';
        		legendPositonY=legend.Y || 'top';
        	}
			
        	//获取专有属性  左纵坐标名称及单位ylName ylUnit  右纵坐标名称及单位yrName yrUnit
        	var specialPros = Echarts.getSpecialPros(option);
        	if( specialPros ){
        		var ylUnit = specialPros.ylUnit == undefined || specialPros.ylUnit == "" ?  "（Gbps）" : "（"+specialPros.ylUnit+"）";
        		var yrUnit = specialPros.yrUnit == undefined || specialPros.yrUnit == "" ?  "（%）" : "（"+specialPros.yrUnit+"）";
        		var xUnit = specialPros.xUnit == undefined || specialPros.xUnit == "" ?  "" : "（"+specialPros.xUnit+"）";
        		var ylName = specialPros.ylName || "速率";
        		var yrName = specialPros.yrName || "带宽利用率";
        		var xName = specialPros.xName || "";
        	}else{
        		var ylUnit = "（Gbps）";
        		var yrUnit = "（%）";
        		var ylName = "速率";
        		var yrName = "带宽利用率"; 
        		var xName = "";
        		var xUnit = "";
        	}
        	
			if(data == null || data.length == 0){
				return ;
			}
			//var _Param = option.queryParam || {link_name:"移动竹山路—电信鼓楼",link_name_reverse:"电信鼓楼—移动竹山路"};
			var _Param = {link_name : data[0].name1||"",link_name_reverse : data[0].name2||""};
			if(_Param.link_name == '' && _Param.link_name_reverse==''){
				return getEmptyChartOption("zldline5",option);
			}
			
			//取坐标轴范围
	    	var axisValueRangeSpeed = 0;
	    	var axisValueRangeUsage = 0;
	    	var timetiker = [];
	    	var speedUp = [];
	    	var speedDown = [];//注意[1]取反
	    	var speedDownAbs = [];
	    	var usageUp = [];
	    	var usageDown = [];//注意[1]取反
	    	var usageDownAbs = [];
	    	//根据resp进行数据准备
	    	$.each(data,function(i,d){
				timetiker.push(d.xtime);
				speedUp.push(parseFloat(d.llinkspeed_up));
				speedDownAbs.push(parseFloat(d.llinkspeed_down));
				speedDown.push(-parseFloat(d.llinkspeed_down));
				usageUp.push(parseFloat(d.bd_usage_rate_up));
				usageDownAbs.push(parseFloat(d.bd_usage_rate_down));
				usageDown.push(-parseFloat(d.bd_usage_rate_down));
			})
			axisValueRangeSpeed = Math.max.apply(null, speedUp) > Math.max.apply(null, speedDownAbs)?Math.ceil(Math.max.apply(null, speedUp)):Math.ceil(Math.max.apply(null, speedDownAbs));
			axisValueRangeUsage = Math.max.apply(null, usageUp) > Math.max.apply(null, usageDownAbs)?Math.ceil(Math.max.apply(null, usageUp)):Math.ceil(Math.max.apply(null, usageDownAbs));
			//axisValueRangeSpeed和axisValueRangeUsage需要取整
			axisValueRangeSpeed = axisValueRangeSpeed+20-axisValueRangeSpeed%10;
			axisValueRangeUsage = axisValueRangeUsage+10-axisValueRangeUsage%10;
			
			var speedColor = "#ff8251";
			var usageColor = "#1fb9f7";
			
	        var optioninfo = {
            	    title : {
            	        show:false
            	    },
            	    grid : {
            	    	borderWidth :0,
            	    	borderColor :'#fff'
            	    },
            	    tooltip : {
            	        trigger: 'axis',
            	        formatter: function (params) {
            	            var res = params[0].name;
            	            var _val  ="" ;
            	            var table ;
	                         if(params.length){
	                        	  table = '<table width="360px" border="1" cellpadding="0" cellspacing="0" class="tip_table">';
		                          table += '<tr height="25px"><td colspan="3" style="color:#fff;font-weight:bold;border: rgba(57,152,236,0.5) 1px solid;">&nbsp;【'+ params[0].name+'】</td></tr>';
		                          table += '<tr align="center" height="25px">'+// style="color:#0098f8"
		                                      '<td width="50%">互联链路信息</td>'+
		                          			  '<td width="20%" style="color:'+speedColor+'">速率</td>'+
		                                      '<td width="30%" style="color:'+usageColor+'">带宽利用率</td>'+
		                                    '</tr>';
		                          var trstr = "";
	                        	  if(params.length == 4){
	                        		      trstr += '<tr align="center" height="25px">';
		                        		  trstr +=  '<td  >'+ _Param.link_name || "" +'</td>';
		                        		  trstr +=   '<td style="color:'+speedColor+'" >'+ Math.abs(params[0].value||0) + "Gbps"+'</td>';
		                        		  trstr +=   '<td style="color:'+usageColor+'">'+ Math.abs(params[1].value||0) + "%"+'</td>';
		                        		  trstr +="</tr/>";
		                        		  trstr += '<tr align="center" height="25px">';
		                        		  trstr +=  '<td >'+ _Param.link_name_reverse || "" +'</td>';
		                        		  trstr +=   '<td style="color:'+speedColor+'">'+ Math.abs(params[2].value||0) + "Gbps"+'</td>';
		                        		  trstr +=   '<td style="color:'+usageColor+'">'+ Math.abs(params[3].value||0) + "%"+'</td>';
		                        		  trstr +="</tr/>";
	                        	  }else if(params.length ==2){
	                        		  
	                        		  if(params[0].seriesName.indexOf("速率")>-1){
	                        			  trstr += '<tr align="center" height="25px">';
		                        		  trstr +=  '<td >'+ _Param.link_name || "" +'</td>';
		                        		  trstr +=   '<td style="color:'+speedColor+'">'+ Math.abs(params[0].value||0) + "Gbps"+'</td>';
		                        		  trstr +=   '<td style="color:'+usageColor+'">0%</td>';
		                        		  trstr +="</tr/>";
		                        		  trstr += '<tr align="center" height="25px">';
		                        		  trstr +=  '<td >'+ _Param.link_name_reverse || "" +'</td>';
		                        		  trstr +=   '<td style="color:'+speedColor+'">'+ Math.abs(params[1].value||0) + "Gbps"+'</td>';
		                        		  trstr +=   '<td style="color:'+usageColor+'">0%</td>';
		                        		  trstr +="</tr/>";
	                        		  }else{
	                        			  trstr += '<tr align="center" height="25px">';
	                        			  trstr +=  '<td>'+ _Param.link_name || "" +'</td>';
		                        		  trstr +=  '<td style="color:'+speedColor+'">0Gbps</td>';
		                        		  trstr +=   '<td style="color:'+usageColor+'">'+ Math.abs(params[0].value||0) + "%"+'</td>';
		                        		  trstr +=  "</tr/>";
		                        		  trstr += '<tr align="center" height="25px">';
		                        		  trstr +=  '<td >'+ _Param.link_name_reverse || "" +'</td>';
		                        		  trstr +=  '<td style="color:'+speedColor+'">0Gbps</td>';
		                        		  trstr +=   '<td style="color:'+usageColor+'">'+ Math.abs(params[1].value||0) + "%"+'</td>';
		                        		  trstr +="</tr/>";
	                        		  }
	                        	  }else{
	                        		  trstr += '<tr align="center" height="25px"><td colspan="3">无</td></tr>';
	                        	  }
	                        	  table +=trstr;
	                        	  table +="<table/>";
	                          }
	                          var data = {
	              	            	name1 : _Param.link_name,
	              	            	name2 : _Param.link_name_reverse,
	              	            	xtime : params[0].name
	              	          }
	              	          window._echart_line_hoverData_X = data;	                          
	                          return table;
//            	            for(i = 0; i <= params.length - 1; i++){
//            	            	if(i==0)
//            	            		res +=	'<br/>' + _Param.link_name;
//            	            	if(i==2)
//            	            		res +=	'<br/>' + _Param.link_name_reverse;
//            	            	//处理tooltip单位问题
//            	            	var unit = params[i].seriesName.substring(params[i].seriesName.indexOf("(")+1,params[i].seriesName.indexOf(")"));
//            	            	var val = params[i].value != null ? params[i].value : 0;
//            	            	res += '<br/>' + params[i].seriesName.substring(0,params[i].seriesName.indexOf("(")) + ': ' + Math.abs(val)+unit;
//            	            	_val = val;
//            	            }
            	            
            	        },
            	        textStyle:{
            	        	fontSize : 12,
            	        	align:"left"
            	        }
            	    },
            	    legend: {
            	    	show : showLegend,
            	        orient: 'horizontal', 
            	        x: legendPositonX, 
            	        y: legendPositonY, 
            	        data: [
            	            {
            	                name:ylName + ylUnit,//'速率(Gbps)',
            	                textStyle:{fontWeight:'bold', color:speedColor}
            	            },
            	            {
            	                name:yrName + yrUnit,//'带宽利用率(%)',
            	                textStyle:{fontWeight:'bold', color:usageColor}
            	            }
            	        ]
            	    },
            	    dataZoom : {
            	        show : false,
            	        realtime: true,
            	        start : 0,
            	        end : 100
            	    },
            	    xAxis : [
            	        {
            	        	name:xName + xUnit,
            	            type : 'category',
            	            boundaryGap : false,
            	            axisLine : {    // 轴线
            	                show: true,
            	                lineStyle: {
            	                    color: 'white',
            	                    type: 'solid',
            	                    width: 2
            	                }
            	            },
            	            axisTick: {onGap:false},
            	            splitLine: {show:false},
            	            data : timetiker,
            	            axisLabel: {
            	                textStyle : {
            	                	color: '#fff',
            	                	//fontSize : grapTextSize
            	                }
            	            }
            	        }
            	    ],
            	    yAxis : [
            	        {
            	        	name:ylName + ylUnit,//'速率(Gbps)',
            	        	axisLine : {    // 轴线
            	                show: true,
            	                lineStyle: {
            	                    color: speedColor,
            	                    type: 'solid',
            	                    width: 2
            	                }
            	            },
            	            type : 'value',
            	            scale:true,
            	            splitNumber: 5,
            	            boundaryGap: [0,0],
            	            splitLine: {show:false},
            	            axisLabel: {
            	                formatter: function (v) {
            	                    return Math.abs(v)
            	                },
            	                textStyle : {
            	                	color: speedColor,
            	                	//fontSize : grapTextSize
            	                }
            	            },
            	            min:-axisValueRangeSpeed,
            	            max:axisValueRangeSpeed
            	        },
            	        {
            	        	name:yrName + yrUnit,//'带宽利用率(%)',
            	        	boundaryGap : false,
            	        	axisLine : {    // 轴线
            	                show: true,
            	                lineStyle: {
            	                    color: usageColor,
            	                    type: 'solid',
            	                    width: 2
            	                }
            	            },
            	            type : 'value',
            	            scale:true,
            	            splitNumber: 5,
            	            splitLine: {show:false},
            	            boundaryGap: [0,0],
            	            axisLabel: {
            	                formatter: function (v) {
            	                    return Math.abs(v)
            	                },
            	                textStyle : {
            	                	color: usageColor,
            	                	//fontSize : grapTextSize
            	                }
            	            },
            	            min:-axisValueRangeUsage,
            	            max:axisValueRangeUsage
            	        }
            	    ],
            	    series : [
            	        {
            	            name:ylName + ylUnit,//'速率(Gbps)',
            	            type:'line',
            	            yAxisIndex: 0,
            	            symbol: 'none',
            	            smooth:true,
            	            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            	            data:speedUp
            	        },
            	        {
            	            name:yrName + yrUnit,//'带宽利用率(%)',
            	            type:'line',
            	            yAxisIndex: 1,
            	            symbol: 'none',
            	            smooth:true,
            	            data:usageUp
            	        },
            	        {
            	            name:ylName + ylUnit,//'速率(Gbps)',
            	            type:'line',
            	            yAxisIndex: 0,
            	            symbol: 'none',
            	            smooth:true,
            	            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            	            data:speedDown
            	        },
            	        {
            	            name:yrName + yrUnit,//'带宽利用率(%)',
            	            type:'line',
            	            yAxisIndex: 1,
            	            symbol: 'none',
            	            smooth:true,
            	            data:usageDown
            	        }
            	    ]
            	};
	        return optioninfo;
		}

	};



	// 属性方法工具类
	var propsUtil = (function (me){

		var axisCommon = {
			getLabel : function(op){
				return  {
					textStyle : {
						color : '#03b5ff',
					}
				}
			},
			getLine : function(op){
				return {
					lineStyle :{
						color: "rgba(255,255,255,.5)",
						width: 1
					}
				}
			},
			getName : function(name , unit){
				return name + unit ;
			}

		}
		var getTooltip = function(){
			return  {
				trigger: 'item',
				position : function(p) {
			            // 位置回调
			            // console.log && console.log(p);
			            return [p[0] - 100, p[1] - 40];
			    },
				textStyle:{
					fontSize : 12,
					align : "left"
				},
				formatter: function (params) {
					var info = params.data.info;
					if(info){
						return info;
					}else{
						return params.name + "<br/>" + params.value;
					}
				}
			}
		}

		var colorList =["#C96565","#CD8366","#CA9D6C","#CE9451","#D9A126","#D1B814","#B1D114",
			"#77D011","#14D13E","#15D184","#17CECF", "#179AD0", "#1566D2", "#121AC8","#6F3FBC","#9D39BB","#4F438C","#C96565","#CD8366","#CA9D6C"];



		return me = {
			// 普通柱图(非分组)
			getVerticalBar : function(op){

				var dd = me.getBarSeriesData(op.data);
				op.props = op.props || {};
				var yConfig = me.getYAxis({
					yName :op.props.yName||"",
					yUnit :op.props.yUnit||"",
					nameTextStyle:op.nameTextStyle||"",
					type : "value",
				});
				var xConfig = me.getXAxis({
					xName : op.props.xName||"",
					xUnit : op.props.xUnit||"",
					type : "category",
					data : dd.xAxis
				})
				if(op.data.length ==0){
					return me._getBarNull(xConfig,yConfig);
				}
				return me._getBar(xConfig,yConfig,dd.series);
			},


			// 横向柱图(非分组)
			getHorizontalBar : function(op){
				var dd = me.getBarSeriesData(op.data);
				op.props = op.props || {};
				var yConfig = me.getYAxis({
					yName :op.props.yName||"",
					yUnit :op.props.yUnit||"",
					nameTextStyle:op.nameTextStyle||"",
					type : "category",
					data : dd.xAxis
				});
				var xConfig = me.getXAxis({
					xName : op.props.xName||"",
					xUnit : op.props.xUnit||"",
					type : "value",
				})
				return me._getBar(xConfig,yConfig,dd.series);
			},
			//柱图无数据
			_getBarNull:function(xConfig,yConfig){
				xConfig.data = ['无数据'];
				return  {
					grid : {
						borderWidth: 0,
						x2:50,
						x:50,
						y:40,
						y2:50
					},
					xAxis : [xConfig],
                    yAxis : [yConfig],
					series: [{type:'bar',data:[0]}]
				}
			},

			_getBar : function(xConfig,yConfig,series){
				return  {
					colors:colorList,
					grid : {
						borderWidth: 0,
						x2:50,
						x:50,
						y:40,
						y2:50
					},
					yAxis: [yConfig],
					tooltip : getTooltip(),
					xAxis:[xConfig],
					series: series
				}
			},

			getBarSeriesData : function(data,op){
				var xAxis = [];
				var series = [];
				var sData = [];
				data.forEach(function(it){
					xAxis.push(it.name);
					sData.push({value : it.value,name : it.name, info:it.info || ""});
				})

				series.push({
					type : "bar",
					data : sData,
					itemStyle: {
						normal: {
							color: function(params) {
								return colorList[params.dataIndex] ? colorList[params.dataIndex] :colorList[0];
							}
						}
					}
				})
				return {
					series:series,
					xAxis: xAxis
				};
			},
			// yAxis
			getYAxis : function(op){
				var _o =$.extend({
					name : op.yName,
					unit : op.yUnit,
					nameTextStyle:op.nameTextStyle,
				},_.omit(op, ['yName', 'yUnit','nameTextStyle']));
				return  me._getAxis(_o);
			},
			// xAxis
			getXAxis : function(op){
				var _o =$.extend({
					name : op.xName,
					unit : op.xUnit
				},_.omit(op, ['xName', 'xUnit']));
				return  me._getAxis(_o);
			},

			// 获取bar的yAxis
			_getAxis : function(op){
				var obj = {
					name : axisCommon.getName(op.name,op.unit),
					axisLabel :axisCommon.getLabel(),
					splitLine:false,
					nameTextStyle:{color:"#03b5ff"},
					axisLine : axisCommon.getLine(),
					axisTick :{ show :false }
				}
				if(op.type){
					obj.type = op.type || 'category';
				}
				if(op.data){
					obj.data = op.data || [0];
				}
				return obj;
			}

		}

	})();

	//获取空数据图表
	function getEmptyChartOption(type, options){
		var option ;
		options = options == null ? {} : options;
		var grapTextSize = Echarts.getGrapText(options) || 12;
    	var legend = Echarts.getLegend(options);
    	var showLegend, legendPositonX, legendPositonY;
    	if(legend){
    		showLegend = legend.showLegend;
    		legendPositonX=legend.X  || 'right';
    		legendPositonY=legend.Y || 'top';
    	}
    	
    	
    	var defaultYlName = '', defaultYlUnit = '', defaultYlUnit0 = '';;
    	if(type == "zldline5"){
    		defaultYlName = "速率";
    		defaultYlUnit = "（Gbps）";
    		defaultYlUnit0 = "Gbps";
    	}else if(type == "zldline4"){
    		defaultYlName = "流量";
    		defaultYlUnit = "（GB）";
    		defaultYlUnit0 = "GB";
    	}
    	
    	//获取专有属性  左纵坐标名称及单位ylName ylUnit  右纵坐标名称及单位yrName yrUnit
    	var specialPros = Echarts.getSpecialPros(option);
    	if( specialPros ){
    		var ylUnit = specialPros.ylUnit == undefined || specialPros.ylUnit == "" ?  defaultYlUnit : "（"+specialPros.ylUnit+"）";
    		var ylUnit0 = specialPros.ylUnit == undefined || specialPros.ylUnit == "" ?  defaultYlUnit0 : specialPros.ylUnit;
    		var yrUnit = specialPros.yrUnit == undefined || specialPros.yrUnit == "" ?  "（%）" : "（"+specialPros.yrUnit+"）";
    		var xUnit = specialPros.xUnit == undefined || specialPros.xUnit == "" ?  "" : "（"+specialPros.xUnit+"）";
    		var ylName = specialPros.ylName || defaultYlName;
    		var yrName = specialPros.yrName || "带宽利用率";
    		var xName = specialPros.xName || "";
    	}else{
    		var ylUnit = defaultYlUnit;
    		var ylUnit0 = defaultYlUnit0;
    		var yrUnit = "（%）";
    		var ylName = defaultYlName;
    		var yrName = "带宽利用率"; 
    		var xName = "";
    		var xUnit = "";
    	}
    	
    	// cq3折线图
    	if( type =="cq3"){
    		return propsUtil.getBaseLine(options);
    	}
		
		// 直连点上下面积折线图
    	else if(type == "zldline5"){
			var speedColor = "#ff8251";
			var usageColor = "#1fb9f7";
			option = {
        	    grid : {
        	    	borderWidth :0,
        	    	borderColor :'#fff'
        	    },
        	    tooltip : {
        	        trigger: 'axis',
        	        textStyle:{
        	        	fontSize : 12,
        	        	align:"left"
        	        }
        	    },
        	    legend: {
        	    	show:showLegend,
        	        orient: 'horizontal',
        	        x: legendPositonX, 
        	        y: legendPositonY, 
        	        data: [ 
        	            {
        	                name:ylName + ylUnit,//'速率(Gbps)',
        	                textStyle:{fontWeight:'bold', color:speedColor}
        	            },
        	            {
        	                name:yrName + yrUnit,//'带宽利用率(%)',
        	                textStyle:{fontWeight:'bold', color:usageColor}
        	            }
        	        ]
        	    },
            	 xAxis : [
        	        {
        	            type : 'category',
        	            boundaryGap : false,
        	            axisLine : {    // 轴线
        	                show: true,
        	                lineStyle: {
        	                    color: 'white',
        	                    type: 'solid',
        	                    width: 1
        	                }
        	            },
        	            axisTick: {onGap:false},
        	            splitLine: {show:false},
        	            data : ['无数据'],
        	            axisLabel: {
        	                textStyle : {
        	                	color: '#fff',
        	                	//fontSize : grapTextSize
        	                }
        	            }
        	        }
        	    ],
        	    yAxis : [
        	        {
        	        	name:ylName + ylUnit,//'速率(Gbps)',
        	        	axisLine : {    // 轴线
        	                show: true,
        	                lineStyle: {
        	                    color: speedColor,
        	                    type: 'solid',
        	                    width: 1
        	                }
        	            },
        	            type : 'value',
        	            scale:true,
        	            splitNumber: 5,
        	            boundaryGap: [0,0],
        	            splitLine: {show:false},
        	            axisLabel: {
        	                formatter: function (v) {
        	                    return Math.abs(v)
        	                },
        	                textStyle : {
        	                	color: speedColor,
        	                	//fontSize : grapTextSize
        	                }
        	            },
        	            min:-100,
        	            max:100
        	        },
        	        {
        	        	name:yrName + yrUnit,//'带宽利用率(%)',
        	        	boundaryGap : false,
        	        	axisLine : {    // 轴线
        	                show: true,
        	                lineStyle: {
        	                    color: usageColor,
        	                    type: 'solid',
        	                    width: 1
        	                }
        	            },
        	            type : 'value',
        	            scale:true,
        	            splitNumber: 5,
        	            splitLine: {show:false},
        	            boundaryGap: [0,0],
        	            axisLabel: {
        	                formatter: function (v) {
        	                    return Math.abs(v)
        	                },
        	                textStyle : {
        	                	color: usageColor
        	                }
        	            },
        	            min:-100,
        	            max:100
        	        }
        	    ],
        	    series : [
        	        {
        	            name:ylName + ylUnit,//'速率(Gbps)',
        	            type:'line',
        	            yAxisIndex: 0,
        	            symbol: 'none',
        	            smooth:true,
        	            itemStyle: {normal: {areaStyle: {type: 'default'}}},
        	            data:[0]
        	        },
        	        {
        	            name:yrName + yrUnit,//'带宽利用率(%)',
        	            type:'line',
        	            yAxisIndex: 1,
        	            symbol: 'none',
        	            smooth:true,
        	            data:[0]
        	        },
        	        {
        	            name:ylName + ylUnit,//'速率(Gbps)',
        	            type:'line',
        	            yAxisIndex: 0,
        	            symbol: 'none',
        	            smooth:true,
        	            itemStyle: {normal: {areaStyle: {type: 'default'}}},
        	            data:[0]
        	        },
        	        {
        	            name:yrName + yrUnit,//'带宽利用率(%)',
        	            type:'line',
        	            yAxisIndex: 1,
        	            symbol: 'none',
        	            smooth:true,
        	            data:[0]
        	        }
        	    ]
        	};
			
		}
		else if(type == "zldline4"){
			option = {
        	    grid : {
        	    	borderWidth :0,borderColor :'#fff',
        	    	//y:40,y2:30,x2:20
        	    },
        	    tooltip : {
        	        trigger: 'axis',
        	        formatter: function (params,ticket) {
        	        	var res = params[0].name;
        	        	$.each(params,function(i,d){
        	        		var val = d.data == null ? 0 : d.data;
        	        		//res += "<br/>" + d.seriesName + "流量 :" + Math.abs(parseFloat(val)) + "GB";
        	        		res += "<br/>" + d.seriesName + ylName +" ：" + Math.abs(parseFloat(val)) + defaultYlUnit0;//"GB";
        	        	})
        	            return res;
        	        },
        	        textStyle:{
        	        	fontSize : 12,
        	        	align:"left"
        	        }
        	    },
        	    legend: {
        	    	show:showLegend,
        	        orient: 'horizontal',
        	        x: legendPositonX, 
        	        y: legendPositonY, 
        	        padding: [0, 70, 0, 0],
        	        data:[{
		                name:'流入',
		                textStyle:{fontWeight:'bold', color:'auto'}
		            },
		            {
		                name:'流出',
		                textStyle:{fontWeight:'bold', color:'auto'}
		            }]
        	    },
        	    calculable : false,
        	    xAxis : [
        	        {
        	            type : 'category',
        	            boundaryGap : false,
        	            splitLine: {show:false},
        	            axisLabel: {
        	                textStyle : {
        	                	color: '#fff',
        	                	//fontSize : grapTextSize
        	                }
        	            },
        	            data : ['无数据'],
        	            boundaryGap:false,
        	            axisLine : {    // 轴线
        	                show: true,
        	                lineStyle: {
        	                	color: 'white',
        	                    type: 'solid',
        	                    width: 1
        	                }
        	            }
        	        }
        	    ],
        	    yAxis : [
       	            {
           	        	name:ylName + ylUnit,//'流量(GB)',
           	        	axisLine : {    // 轴线
           	                show: true,
           	                lineStyle: {
           	                    color: 'white',
           	                    type: 'solid',
           	                    width: 2
           	                }
           	            },
           	            type : 'value',
           	         	boundaryGap:false,
           	            scale:true,
           	            splitNumber: 5,
           	            boundaryGap: [0,0.1],
           	            splitLine: {show:false},
           	            axisLabel: {
           	                formatter: function (v) {
           	                    return Math.abs(v)
           	                },
           	                textStyle : {
           	                	color: 'white',
           	                	//fontSize : grapTextSize
           	                }
           	            },
           	            min:-100,
           	            max:100
           	        }
        	    ],
        	    series : [
        	        {
        	            name:'流入',
        	            type:'line',
        	            smooth:true,
        	            data:['0']
        	        },
        	        {
        	            name:'流出',
        	            type:'line',
        	            smooth:true,
        	            data:['0']
        	        }
        	    ]
        	}
			
		}
		else if(type == "zldbar2"){
			var ylName1 = ylName ? ylName : "连接成功率";
			var ylUnit1 = ylUnit ? ylUnit : "（%）";
			var ylUnit0 = ylUnit ? ylUnit : "%";
					
			var option = { 
   				    grid : {
                        borderWidth :0,
                        borderColor :'#fff',
                        x:65,
                        y:30,
                        y2:35,
                        x2:35 
                    },
 	                legend: {
 	                	show: showLegend,
 	                	orient: 'horizontal', 
                       x: legendPositonX, 
                       y: legendPositonY, 
                       textStyle : {
                       	color : "#fff"
                       },
 	                	data :[]
 	                },  
 	                tooltip : {
                     trigger: 'axis',
                     formatter:function(v){
                         var res = v[0].name + "<br/>";
                         res += ylName1+"："+ v[0].value + ylUnit0 +"<br/>";
                         return res;
                     },
                     textStyle:{
                   	  fontSize : 12,
                   	  align : "left",
                   	  
                     }
                   },
                   calculable : false,
                   xAxis : [
                       {
                        name:xName + xUnit,
                       	type : 'category',
                           splitLine: {show:false},
                           axisLabel: {
                               textStyle : { 
                               	color: '#fff',
                               	//fontSize : grapTextSize
                               }
                           },
                           splitLine : {show : false},
                           splitArea : {show : false},
                           data : ['无数据']//bars_dates.xAxis	  
                       }
                   ],
 	                yAxis: [{
	                    	show:true,
	                    	name:ylName + ylUnit,
	                    	//name:unitNameY + "("+unit+")",
	 	                    type : 'value',
	 	                    splitLine: {show:false},
	 	                    axisLabel: {
	 	                    	textStyle : {
	 	                    		color: "white",
	 	                    		//fontSize : grapTextSize
	 	                    	}
	 	                    },
	                    }],  
 	                //series: data[0]//bars_dates.series 
                   series : [{
                       type:'bar',
                       data:[0]
                   }]
 	            }; 
		}
		else if(type == "zldbar1"){
			var option = {
	    		  	tooltip : {
	                    show : false,
	                    trigger: 'item',
	                    axisPointer : {
	                        type : 'none'
	                    }
	                },
	                legend: {
	                    show : false,
	                    data : []
	                }, 
  	                grid : {
  	                    borderWidth :0,
  	                    borderColor :'#fff',
  	                    x : 22,
  	                    y : 30,
  	                    y2 : 25
  	                },
  	                xAxis : [{
                           name:'',
                           axisLine : {    // 轴线
                               show: true,
                               lineStyle: {
                                   color: 'white',
                                   type: 'solid',
                                   width: 2
                               }
                           },
                           type : 'value',
                           axisLabel: {
                               formatter: function (v) {
                                   return (1 * v).toFixed(2);
                               },
                               textStyle : {
                                   color: 'white',
                                   //fontSize : grapTextSize
                               }
                           },
                           scale:true,
                           splitLine : {
                               show : false
                           },
                           splitArea : {
                               show : false
                           },
                           data : ['无数据'],
                           splitNumber: 10,
                           boundaryGap: [0,0.1],
                           splitLine: {show:false},
                           min:0,
                           max:100
                      }],
                    yAxis : [{
                       type : 'category',
                       axisLine : {    // 轴线
                           show: true,
                           lineStyle: {
                               color: 'white',
                               type: 'solid',
                               width: 2
                           }
                       },
                       boundaryGap : true,
                       axisTick: {onGap:false},
                       splitLine: {show:false},
                       data : [' '],
                       axisLabel: {
                           interval : 0,
                           textStyle : {
                               color: '#fff',
                               //fontSize : grapTextSize
                           }
                       }
                   }],
                   series : [{
                       type:'bar',
                       data:[0]
                   }]
    		    }
		}
		else if(type == "7"){
			var color1 = "#ff8251";
			var color2 = "#1fb9f7";
	   		var ylName1 = ylName ? ylName : "速率";
	   		var ylUnit1 = ylUnit ? ylUnit : "（Gbps）";
	   		var ylUnit0 = ylUnit ? ylUnit : "Gbps";
   		 	var option = {
   				 color:[color1,color2],
   				 legend : {
   					 show: showLegend,
   					 data: [
           	            {
           	                name:ylName1,//legendName1,
           	                textStyle:{
           	                	fontWeight:'bold',
           	                	color: color1
           	                }
           	            },
           	            {
           	                name:yrName,//legendName2,
           	                textStyle:{
           	                	fontWeight:'bold',
           	                	color: color2
           	                }
           	            }
           	         ],
   					 orient: 'horizontal', 
                        x: legendPositonX || 'right', 
                        y: legendPositonY || 'top', 
   				 },
                    grid : {
                        x2:60,
//                        y2:40,
                        x:60,
//                        y:30,
                        borderWidth:0
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: function(params){
                       	 var str = params[0].name +"<br/>";
                       	 str +=ylName1 +"："+params[0].data+ ylUnit0 + "<br/>";
                       	 str +=yrName+"："+params[1].data+ yrUnit;
                       	 window._echart_line_hoverData_X = { xtime :params[0].name,name:params[0].name};
                             return str;
                        },
                        textStyle:{
                       	 fontSize : 12,
                       	 align : "left"
                        }
                    },
                    xAxis : [
                        {
                       	 type : 'category',
                            boundaryGap : false,
                            splitLine: {
                                show:false,
                            },
                            data:['无数据'],//stackline_datas.xAxis,
                            axisLabel : {
                                textStyle : {
                                    color : '#fff'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name: ylName1,//legendName1,
                            type : 'value',
                            splitLine: {
                           	 show:false,
                            },
                            axisLine : {    // 轴线
            	                show: true,
            	                lineStyle: {
            	                    color: color1,
            	                }
            	             },
                            axisLabel : {
                                textStyle : {
                                    color : color1,
                                    //fontSize : grapTextSize
                                }
                            }
                        },
                        {
                            name: yrName,//legendName2,
                            type : 'value',
                            splitLine: {
                                show:false,
                            },
                            axisLine : {    // 轴线
            	                show: true,
            	                lineStyle: {
            	                    color: color2,
            	                }
            	             },
                            axisLabel : {
                                textStyle : {
                                    color : color2
                                }
                            },
                            max: 100,
                            min : 0
                        }
                    ],
                    series : [
                  	        {
                	            name:ylName + ylUnit,//'速率(Gbps)',
                	            type:'line',
                	            yAxisIndex: 0,
                	            symbol: 'none',
                	            smooth:true,
                	            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                	            data:[0]
                	        },
                	        {
                	            name:yrName + yrUnit,//'带宽利用率(%)',
                	            type:'line',
                	            yAxisIndex: 1,
                	            symbol: 'none',
                	            smooth:true,
                	            data:[0]
                	        }
                    ]//stackline_datas.series
                };
		}
		else if(type == "6"){
			var ylName1 = ylName ? ylName : "流量";
			var ylUnit1 = ylUnit ? ylUnit : "（GB）";
			var ylUnittip = ylUnit ? ylUnit : "GB";
			var option = {
   				 legend : {
   					 show : showLegend,
	        			 x : legendPositonX,
	        		 	 y : legendPositonY,
   					 data : [0]//stackline_datas.category
   				 },
                    grid : {
                        x2:60,
                        y2:40,
                        x:60,
                        y:30,
                        borderWidth: 1
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: function(params){
                       	 window._echart_line_hoverData_X = { xtime :params[0].name,name:params[0].name};
                            var unit = params[0].seriesName.substring(params[0].seriesName.indexOf("（")+1,params[0].seriesName.indexOf("）"));
                            var res = params[0].name + '<br/>'
                                    + params[0].seriesName.substring(0,params[0].seriesName.indexOf("（")) + ': ' + params[0].value+ylUnittip;//unit;
                                    /*+ params[0].seriesName.substring(0,params[0].seriesName.indexOf("(")) + '：' + params[0].value+ylUnit1;//unit;*/

                            return res;
                            
                            
                        },
                        textStyle:{
                       	 fontSize : 12,
                       	 align : "left"
                        }
                    },
                    xAxis : [
                        {
                       	 //name: xName + xUnit, //'占比(%)',
                            type : 'category',
                            boundaryGap : false,
                            splitLine: {
                                show:true,
                                lineStyle:{
                                    type : 'dashed'
                                }
                            },
                            data:["无数据"],//stackline_datas.xAxis,
                            axisLabel : {
                                textStyle : {
                                    color : '#fff',
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name:ylName1 + ylUnit1,//'流量(GB)',
                            type : 'value',
                            splitLine: {
                                show:true,
                                lineStyle:{
                                    type : 'dashed'
                                }
                            },
                            axisLabel : {
                                textStyle : {
                                    color : '#fff',
                                    //fontSize : grapTextSize
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name:'流量（GB）',
                            type:'line',
                            smooth:true,
                            data:[0]
                        }
                    ]
                };
		}
		else if(type == "5"){
			var ylName1 = ylName ? ylName : "占比";
			var ylUnit1 = ylUnit ? ylUnit : "（%）";
			var ylUnit0 = ylUnit ? ylUnit : "%";
   		 	var option = {
     			legend : {
     				show : showLegend,
	        			 x : legendPositonX,
	        		 	 y : legendPositonY,
	        		 	 data : [0],
	        		 	 textStyle:{
	        		 		 color : "#fff"
	        		 	 }
	        	} ,
     			series : [{
     				type : 'line', 
     				data : [0]
     			}],
     			grid : {
                     borderWidth :0,
                     borderColor :'#fff',
                     x2 : 10,
                     y2 : 25
                 },
                 tooltip : {
                     trigger: 'axis',
                     textStyle : {
                     	fontSize : "12",
                     	align:"left"
                     },
                     formatter : function(v){
                         var content = v[0].name + '<br/>';
                         content += ylName1  + " ： " + v[0].value +ylUnit0;
                         return content;
                     }
                 },
                 xAxis : [ {
                          type : 'category',
                          axisLine : {    // 轴线
                              show: true,
                              lineStyle: {
                                  color: 'white',
                                  type: 'solid',
                                  width: 2
                              }
                          },
                          boundaryGap : false,
                          axisTick: {onGap:false},
                          splitLine: {show:false},
                          data : ['无数据'],//stackline_datas.xAxis,
                          axisLabel: {
                              textStyle : {
                                  color: '#fff',
                              }
                          }
                      }
                  ],
                  yAxis : [
                      {
                          name: ylName1 + ylUnit1, //'占比(%)',
                          axisLine : {    // 轴线
                              show: true,
                              lineStyle: {
                                  color: 'white',
                                  type: 'solid',
                                  width: 2
                              }
                          },
                          type : 'value',
                          axisLabel: {
                              formatter: function (v) {
                                  return v.toFixed(2) + '%';
                              },
                              textStyle : {
                                  color: 'white',
                                  //fontSize : grapTextSize 
                              }
                          },
                          scale:true,
                          splitNumber: 10,
                          boundaryGap: [0,0],
                          splitLine: {show:false},
                          min:0,
                          max:100
                      }
                  ]
              }
		}
		
		return option;
		
	}




	return Echarts;
});