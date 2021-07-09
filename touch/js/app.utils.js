/**
 * 
 */

function isIE(version, ex){
	if (version) {
		version = ' ' + version;
	}
	if (ex) {
		ex = ex + ' ';
	}
    var b = document.createElement('b');
    b.innerHTML = '<!--[if ' + ex + 'IE' + version +']><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
}

//Checks that string starts with the specific string
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
    	if (str != null) {
    		return this.slice(0, str.length) == str;
    	}
        return false;
    };
}

//  Checks that string ends with the specific string...
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
    	if (str != null) {
    		return this.slice(-str.length) == str;
    	}
    	return false;
    };
}

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

if (typeof sprintf == 'function' && typeof String.printf != 'function') {
	String.printf = sprintf;
}

/** * 對Date的擴展，將 Date 轉化為指定格式的String * 月(M)、日(d)、12小時(h)、24小時(H)、分(m)、秒(s)、周(E)、季度(q)
可以用 1-2 個佔位符 * 年(y)可以用 1-4 個佔位符，毫秒(S)只能用 1 個佔位符(是 1-3 位的數字) * eg: * (new
Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
* (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
* (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 週二 08:09:04      
* (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
* (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
*/
if ( ! Date.prototype.format) {
	Date.prototype.format=function(fmt) {         
		var o = {         
			"M+" : this.getMonth()+1, //月份         
			"d+" : this.getDate(), //日         
			"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小時         
			"H+" : this.getHours(), //小時         
			"m+" : this.getMinutes(), //分         
			"s+" : this.getSeconds(), //秒         
			"q+" : Math.floor((this.getMonth()+3)/3), //季度         
			"S" : this.getMilliseconds() //毫秒         
		};         
		var week = {         
			"0" : "/u65e5",         
			"1" : "/u4e00",         
			"2" : "/u4e8c",         
			"3" : "/u4e09",         
			"4" : "/u56db",         
			"5" : "/u4e94",         
			"6" : "/u516d"        
		};         
		if(/(y+)/.test(fmt)){         
		    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
		}         
		if(/(E+)/.test(fmt)){         
		    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
		}         
		for(var k in o){         
		    if(new RegExp("("+ k +")").test(fmt)){         
		        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
		    }         
		}         
		return fmt;         
	} 
}
  
/**
 * 
 */
// 除法函數，用來得到精確的除法結果
// 說明：javascript的除法結果會有誤差，在兩個浮點數相除的時候會比較明顯。這個函數返回較為精確的除法結果。
// 調用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精確結果
function accDiv(arg1, arg2) {
	var result1 = arg1 / arg2;
	var t1 = 0, t2 = 0, r1, r2;
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch (e) {
	}
	with (Math) {
		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		var result2 = Number(r1 / r2).mul(pow(10, t2 - t1));
		if (result1.toString().length > result2.toString().length) {
			return result2;
		} else {
			return result1;
		}
	}
}
// 給Number類型增加一個div方法，調用起來更加方便。
Number.prototype.div = function(arg) {
	return accDiv(this, arg);
};
// 乘法函數，用來得到精確的乘法結果
// 說明：javascript的乘法結果會有誤差，在兩個浮點數相乘的時候會比較明顯。這個函數返回較為精確的乘法結果。
// 調用：accMul(arg1,arg2)
// 返回值：arg1乘以arg2的精確結果
function accMul(arg1, arg2) {
	var result1 = arg1 * arg2;
	
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {
	}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {
	}
	
	var result2 = (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
	
	if (result1.toString().length > result2.toString().length) {
		return result2;
	} else {
		return result1;
	}
}
// 給Number類型增加一個mul方法，調用起來更加方便。
Number.prototype.mul = function(arg) {
	return accMul(arg, this);
};
// 加法函數，用來得到精確的加法結果
// 說明：javascript的加法結果會有誤差，在兩個浮點數相加的時候會比較明顯。這個函數返回較為精確的加法結果。
// 調用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精確結果
function accAdd(arg1, arg2) {
	var result1 = arg1 + arg2;
	
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2));
	var result2 = Number(arg1 * m + arg2 * m).div(m);
	
	if (result1.toString().length > result2.toString().length) {
		return result2;
	} else {
		return result1;
	}
}
// 給Number類型增加一個add方法，調用起來更加方便。
Number.prototype.add = function(arg) {
	return accAdd(arg, this);
}
// 減法函數，用來得到精確的減法結果
// 說明：javascript的減法結果會有誤差，在兩個浮點數相加的時候會比較明顯。這個函數返回較為精確的減法結果。
// 調用：accSubtr(arg1,arg2)
// 返回值：arg1減去arg2的精確結果
function accSubtr(arg1, arg2) {
	var result1 = arg1-arg2;
	
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2));
	// 動態控制精度長度
	n = (r1 >= r2) ? r1 : r2;
	//var result2 = ((arg1 * m - arg2 * m) / m).toFixed(n);
	var result2 = Number(arg1 * m - arg2 * m).div(m);
	if (result1.toString().length > result2.toString().length) {
		return result2;
	} else {
		return result1;
	}
}
// 給Number類型增加一個subtr 方法，調用起來更加方便。
Number.prototype.subtr = function(arg) {
	return accSubtr(this, arg);
}

Number.prototype.format = function () {
    var nStr = '' + this;
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};
Number.prototype.pad = function (width, z) {
	var n = this + '';
	z = z || '0';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
Number.prototype.round = function(n) {
	if (n > 0) {
		n = Math.pow(10, n);
		var num = Math.round(this.mul(n)).div(n);
		return num;
	} else {
		return Math.round(this);
	}
}