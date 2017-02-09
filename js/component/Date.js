/**
 * 数据配置日期组件
 * Data
 * extends 继承 zDs_text
 */
define(function (require) {

    var $ = require("jquery");
    var util = require("./zUtil");
    require("DatePicker");
    var TextComponent = require("./Text");
    

    Date.prototype.format = function(pattern) {
        var fullyear = this.getFullYear(), minyear = fullyear.toString()
                .substring(2), month = this.getMonth() + 1, day = this.getDate(), hour = this
                .getHours(), minute = this.getMinutes(), second = this.getSeconds(), ms = this
                .getMilliseconds();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        if (ms < 10) {
            ms = '00' + ms;
        } else if (ms < 100) {
            ms = '0' + ms;
        }
        if (!pattern) {
            pattern = 'yyyy-MM-dd hh:mm:ss';
        }
        return pattern.replace('yyyy', fullyear).replace('yy', minyear).replace(
                'MM', month).replace('dd', day).replace('hh', hour).replace('mm',
                minute).replace('ss', second).replace('SSS', ms);
    };

    Date.prototype.add = function(interval, value) {
        var d = new Date(this.getTime());
        if (!interval || value === 0)
            return d;

        switch (interval.toLowerCase()) {
            case 'milli' :
                d.setMilliseconds(d.getMilliseconds() + value);
                break;
            case 'second' :
                d.setSeconds(d.getSeconds() + value);
                break;
            case 'minute' :
                d.setMinutes(d.getMinutes() + value);
                break;
            case 'hour' :
                d.setHours(d.getHours() + value);
                break;
            case 'day' :
                d.setDate(d.getDate() + value);
                break;
            case 'month' :
                var new_year = d.getYear();
                var new_month = d.getMonth() + 1 + value;
                if(d.getMonth()>12) {
                    new_month -=12;
                    new_year++;
                }
                var new_date = new Date(new_year,new_month,1);
                var lastDayOfPrevMonth =
                        (new Date(new_date.getTime()-1000*60*60*24)).getDate();
                if(d.getDate() > lastDayOfPrevMonth){
                    d.setDate(lastDayOfPrevMonth);
                }
                var month = d.getMonth() + value;
                d.setMonth(month);
                break;
            case 'year' :
                d.setFullYear(d.getFullYear() + value);
                break;
        }
        return d;
    };


    var zDs_DateClass = TextComponent.extend({
    	init:function(opt){
    		this._super(opt);
    		this.option = opt;
            this.option.laydateOp = opt.baseOption.laydateOp;
    		this.addClass();
    		this.bindEvent();
    		return this;
    	},
    	addClass:function(){
			this.box.find("input").addClass("Wdate");
    	},
    	bindEvent:function(){
    		var me = this;
			me.box.find("input").on('focus',function(){
                me.option.laydateOp.errDealMode = 1;
                me.option.laydateOp.isShowClear = false;
                me.option.laydateOp.readOnly = true;
				WdatePicker(me.option.laydateOp);
			});
    	},
        updateDateFmt:function(newOpt){
            var me = this;
            me.option.laydateOp = newOpt;
        },
        bindOnBlur:function(opt){
            //var me = this;
            //if(me.option.baseOption.validate){
            //    me.singleCom.on('blur',function(){
            //        new validateComponent(me,opt); 
            //    });
            //}
        },
    	
    });
    return zDs_DateClass;
});