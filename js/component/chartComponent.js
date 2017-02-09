define(function(require){
    var $ = require("jquery");
    var utils = require("./zUtil");
    var echartCommon = require("./zEChartCommon");
    var echart = require("echart");

    var fn = function(){};
    var zChartComponent = utils.Class({
        init: function(option){
            this.component = {};
            this.option = option;
            this.renderComponent();
            this.bindComponent();
            return this;
        },
        renderComponent: function(){
            var buildConfig = {
                data : this.option.data ,
                chartStyle : this.option.dataOption,
                chartType : this.option.chartType,
                childType : this.option.childType ,
                props : this.option.props,
                renderAt : document.getElementById(this.option.el)
            }
            this.createEchart(buildConfig);
        },

        // 创建Echart组件
        createEchart : function(option){
            var buildOption;
            switch(option.chartType){
                case 'bar' :                    
                    buildOption = echartCommon.optionTmpl.Bars(option.data,option);
                    break ;
                case 'line' : 
                    buildOption = echartCommon.optionTmpl.Lines(option.data,option);
                    break ; 
                case 'pie' : 
                    buildOption = echartCommon.optionTmpl.Pie(option.data,option);
                    break;
                case 'map' :
                    buildOption = echartCommon.optionTmpl.Map(option.data,option);
                    break;
                case 'force' : 
                    buildOption = echartCommon.optionTmpl.Force(option.data,option);
                    break;
                case 'gauge' :
                    buildOption = echartCommon.optionTmpl.Gauge(option.data,option);
                    break;
                //混搭
                case 'comboDailyOne' :
                    buildOption = echartCommon.optionTmpl.ComboDailyOne(option.data,option);
                    break;
                default:;
            };
            if(this.component && this.component.chart){
                this.component.chart.clear();
                this.component.chart.setOption(buildOption);
            }else{
                this.loadChart(option.renderAt,buildOption);
            }
        },
        
        loadChart : function(box , option){
           var echartObj = echartCommon.config(box, option);
           echartObj.chartType =this.option.chartType;  
//             var themeStyle = "macarons";
           var themeStyle = "";
           if(this.option.chartType == "map"){
              themeStyle = "sakura";
           }else if(this.option.chartType =="line"){
           }else{
              //themeStyle = "macarons";
           }
           echartObj.chart = echarts.init(echartObj.container,themeStyle);
           this.component = echartObj;
           this.component.chart.setOption(echartObj.option);
        },
        
        updateComponent:function(data){
            this.option.data = data;
            this.renderComponent();
        },
        
        bindComponent: function(){
            var me = this;
            if(me.component){
                var ecConfig  = echarts.config;
                me.component.chart.on(ecConfig.EVENT.CLICK,  me.callbackHandler.bind(me));
                me.component.chart.on(ecConfig.EVENT.PIE_SELECTED, me.callbackHandler.bind(me));
            }
//            // 绑定折线图点击事件
//            if(me.option.chartType == "line"){
//                me.contentBox.on('click',function(e){
//                    me.clickEchartLine();
//                    //e.preventDefault();
//                })
//            }
        },
        
        //折线图触发事件方法
        clickEchartLine : function(){
            if(window._echart_line_hoverData_X){
                // 定义全局遍历
                var d = window._echart_line_hoverData_X;
                var op = this.getCasacdeOption({
                    data : d,
                    value:d.value || "",
                    name:d.name || ""
                },RC.CHART_CATEGORY.ECHART);
                Zlay.comboCascade(this.getName(),op);
            }
        },
        // 图表滑过事件
        tooltipHoverHandler :function(p1,p2){
            var dataIndex = p1.dataIndex;
            this.curHoverData = this.option.data[dataIndex];
        },
        
        chartEventHandler:function(instance, method) {
            return function(arg1,arg2) { 
                return instance[method](arg1,arg2);
            };
        },
        
        callbackHandler : function(arg1,arg2){
        	if(this.option.clickHandler){
        		this.option.clickHandler(arg1,arg2);
        	}
        },
        
        // 子类实现loader
        componentDidLoader : function(reply,type){
            var me = this;
            var r = echartCommon.getDataFilter(reply);
            me.updateComponent(r);
            if(me.option.chartCategory == RC.CHART_CATEGORY.ECHART){
                me.realtimeUpdateData()
            }
        },

        refrashData : function(isRun){
            this.component.chart.setOption(this.component.option);
        },
        
        onClick:function(e){
            
        },
        // 同步属性到编辑区
        syncAttrToEditor: function(){
            var me = this;
        },
        resize: function(){
            var me = this;
            if(me.component && this.component.chart){
                 me.component.chart.resize();
            }
        },
        destory: function(){
            if(this.component.chart){
                this.component.chart.dispose();
            }
        }   
    })
    
    return zChartComponent;
})