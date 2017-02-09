// 获取当前时间 dateTime 时间，num 几个月
function getStringDate(dateTime,num) {
	var preDate = new Date(dateTime.getTime() - num*24*60*60*1000);
    		var year = preDate.getFullYear();
    		var month = preDate.getMonth()+1 ;
    		var day = preDate.getDate();
    		var hour = preDate.getHours();
    		var minutes = preDate.getMinutes();
    		var seconds = preDate.getSeconds();
    		if (month < 10) {
    			month = "0" + month;
    		}
    		if (day < 10) {
    			day = "0" + day;
    		}
    		if (hour < 10) {
    			hour = "0" + hour;
    		}
    		if (minutes < 10) {
    			minutes = "0" + minutes;
    		}
    		if (seconds < 10) {
    			seconds = "0" + seconds;
    		}
    		return year + "-" + month + "-" + day + " " + hour + ":" + minutes
    				+ ":" + seconds;
  }

function getStringMonth(dateTime,num) {
	var preDate = new Date(dateTime.getTime() - num*24*60*60*1000);
	var year = preDate.getFullYear();
	var month = preDate.getMonth() + 1;
	var day = preDate.getDate();
	var hour = preDate.getHours();
	var minutes = preDate.getMinutes();
	var seconds = preDate.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return year + "-" + month + "-" + day + "";
}

function getStringMonth2(dateTime,num) {
	var preDate = new Date(dateTime.getTime() - num*24*60*60*1000);
	var year = preDate.getFullYear();
	var month = preDate.getMonth() + 1;
	var day = preDate.getDate();
	var hour = preDate.getHours();
	var minutes = preDate.getMinutes();
	var seconds = preDate.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	return year + "-" + month + "";
}

function getStringDay(dateTime,num) {
	var year = dateTime.getFullYear();
	var month = dateTime.getMonth() + 1;
	var day = dateTime.getDate()+num;
	var hour = dateTime.getHours();
	var minutes = dateTime.getMinutes();
	var seconds = dateTime.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return year + "-" + month + "-" + day + " " + hour + ":" + minutes
			+ ":" + seconds;
}