var showlogflag = false;
var DOCUMENTTITLE = document.title || 'NONE';
var userID = window.localStorage.getItem('userID') || null;
var tabID = window.sessionStorage.getItem('tabID') || null;
var ServerSet = window.sessionStorage.getItem('ServerSet') || "";
var KerebroData = window.localStorage.getItem("KerebroData") || "";
if (window.localStorage.getItem('groupServer') != "") {
	window.localStorage.removeItem('groupServer')
}
var hostsubname = "";
var playered = false;
var tag = document.createElement('script');
tag.src = "#";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var scrollifDroped = false;
var scrollFlag = '';
var scrollFlag_data = {};
var pageview = parseInt(window.sessionStorage.getItem('A_pageview') || 0) + 1;
window.sessionStorage.setItem('A_pageview', pageview);
(function() {
	if (navigator.userAgent.match(/MSIE/)) {
		try {
			new Image().doScroll();
			startTrack()
		} catch (e) {
			setTimeout(arguments.callee, 1)
		}
	} else {
		document.addEventListener("DOMContentLoaded", startTrack, false)
	}
})();

function kerebroVer() {
	return "version: 4.2.9"
}
function startTrack() {
	if (typeof JSON === 'object' && typeof JSON.parse === 'function') {
		KerebroInit();
		console.log("[Kerebro " + kerebroVer() + "] initing");
		startBigData();
		console.log("[ BigData ] initing")
	} else {
		showlog("[Kerebro Error] No JSON function found , Kerebro Stoped")
	}
}
var httpReqObj, source;
if (window.XMLHttpRequest) {
	httpReqObj = new XMLHttpRequest()
} else {
	httpReqObj = new ActiveXObject("Microsoft.XMLHTTP")
}
KerebroSerialize = function(obj, prefix) {
	var str = [];
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			var k = prefix ? prefix + "[" + p + "]" : p,
				v = obj[p];
			str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v))
		}
	}
	return str.join("&")
};
KerebroAjax = function(url, parameters, success) {
	httpReqObj.open("POST", url, true);
	httpReqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpReqObj.send(KerebroSerialize(parameters));
	httpReqObj.onreadystatechange = success
};
KerebroAjaxSync = function(url, parameters, success) {
	httpReqObj.open("POST", url, false);
	httpReqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpReqObj.send(KerebroSerialize(parameters));
	httpReqObj.onreadystatechange = success
};
KerebroGET = function(url, parametersString, success) {
	httpReqObj.open("GET", url + "?t=" + Math.random() + "&" + parametersString, false);
	httpReqObj.send()
};

function KerebroInit() {
	if (window != window.top) return;
	if (userID == null) {
		var parameters = {
			method: 'register',
			url: window.location.href,
			title: DOCUMENTTITLE,
			HTTP_REFERER: document.referrer,
			ServerSet: ServerSet,
			KerebroData: KerebroData
		}
	} else if ((userID != null) && (tabID == null)) {
		var parameters = {
			method: 'newtab',
			userID: userID,
			url: window.location.href,
			title: DOCUMENTTITLE,
			HTTP_REFERER: document.referrer,
			ServerSet: ServerSet,
			KerebroData: KerebroData
		}
	} else if ((userID != null) && (tabID != null)) {
		var parameters = {
			method: 'refresh',
			userID: userID,
			tabID: tabID,
			url: window.location.href,
			title: DOCUMENTTITLE,
			HTTP_REFERER: document.referrer,
			ServerSet: ServerSet,
			KerebroData: KerebroData
		}
	}
	KerebroAjax("https://" + hostsubname + "kerebro.com/tracker/newapplication.php", parameters, function(e) {
		return myAjaxResponseHandler.call(e, httpReqObj)
	})
}
function myAjaxResponseHandler(httpReq) {
	if (httpReq.readyState == 4) {
		if (httpReq.status == 200) {
			var responseData = JSON.parse(httpReq.responseText);
			switch (responseData.code) {
			case 0:
				if (responseData.status == 'registed') {
					showlog("[Kerebro][" + responseData.timestamp + "] Registed , Hello " + responseData.user + "_" + responseData.tab);
					window.localStorage.setItem('userID', responseData.user);
					window.sessionStorage.setItem('tabID', responseData.tab);
					if (responseData.KerebroTargetSave != null) window.sessionStorage.setItem('KerebroTargetSave', responseData.KerebroTargetSave);
					if (responseData.KerebroAutosSave != null) window.sessionStorage.setItem('KerebroAutosSave', responseData.KerebroAutosSave);
					if (responseData.KerebroMultiAutosSave != null) window.sessionStorage.setItem('KerebroMultiAutosSave', responseData.KerebroMultiAutosSave)
				} else if (responseData.status == 'newtab') {
					showlog("[Kerebro][" + responseData.timestamp + "] Your Tab Changed , Hello " + responseData.user + "_" + responseData.tab);
					window.localStorage.setItem('userID', responseData.user);
					window.sessionStorage.setItem('tabID', responseData.tab);
					if (responseData.KerebroTargetSave != null) window.sessionStorage.setItem('KerebroTargetSave', responseData.KerebroTargetSave);
					if (responseData.KerebroAutosSave != null) window.sessionStorage.setItem('KerebroAutosSave', responseData.KerebroAutosSave);
					if (responseData.KerebroMultiAutosSave != null) window.sessionStorage.setItem('KerebroMultiAutosSave', responseData.KerebroMultiAutosSave)
				} else if (responseData.status == 'refresh') {
					showlog("[Kerebro][" + responseData.timestamp + "] You Refreshed , Hello " + responseData.user + "_" + responseData.tab);
					window.localStorage.setItem('userID', responseData.user);
					window.sessionStorage.setItem('tabID', responseData.tab);
					if (responseData.KerebroTargetSave != null) window.sessionStorage.setItem('KerebroTargetSave', responseData.KerebroTargetSave);
					if (responseData.KerebroAutosSave != null) window.sessionStorage.setItem('KerebroAutosSave', responseData.KerebroAutosSave);
					if (responseData.KerebroMultiAutosSave != null) window.sessionStorage.setItem('KerebroMultiAutosSave', responseData.KerebroMultiAutosSave)
				}
				userID = window.localStorage.getItem('userID') || null;
				tabID = window.sessionStorage.getItem('tabID') || null;
				if (ServerSet == "" && responseData.group != "") {
					ServerSet = responseData.group;
					window.sessionStorage.setItem('ServerSet', responseData.group)
				}
				KerebroData = responseData.KerebroData;
				window.localStorage.setItem('KerebroData', responseData.KerebroData);
				startSSE(responseData.user, responseData.tab);
				resetMultiData();
				runTargetCheck();
				runMultiAutosCheck();
				previewKerebroInit();
				break;
			default:
				if (responseData.code == -901) window.localStorage.removeItem('KerebroData');
				showlog("[Kerebro Error] Code: " + responseData.code + ", Result: " + responseData.messages);
				break
			}
		}
	}
	return
}
function resetMultiData() {
	if ((window.sessionStorage.getItem('KerebroMultiAutosSave') != null) && (window.sessionStorage.getItem('KerebroMultiAutosSave') != "")) {
		var dataTarget = JSON.parse(Base64.decode(window.sessionStorage.getItem('KerebroMultiAutosSave')))
	} else {
		var dataTarget = {}
	}
	for (I in dataTarget) {
		if (dataTarget[I].and) {
			for (andData in dataTarget[I].and) {
				switch (parseInt(dataTarget[I].and[andData].ruletype)) {
				case 0:
				case 1:
				case 2:
				case 5:
				case 6:
					dataTarget[I].and[andData].pass = 0;
					break
				}
			}
		}
		if (dataTarget[I].not) {
			for (andData in dataTarget[I].not) {
				switch (parseInt(dataTarget[I].not[andData].ruletype)) {
				case 0:
				case 1:
				case 2:
				case 5:
				case 6:
					dataTarget[I].not[andData].pass = 0;
					break
				}
			}
		}
	}
	if (Object.keys(dataTarget).length == 0) window.sessionStorage.removeItem('KerebroMultiAutosSave');
	else window.sessionStorage.setItem('KerebroMultiAutosSave', Base64.encode(JSON.stringify(dataTarget)))
}
function runMultiAutosCheck(passedRuleType, checkI) {
	var passedRuleType = passedRuleType || null;
	var checkI = checkI || null;
	var boundOutofScreen = false,
		boundScroll = false;
	if ((window.sessionStorage.getItem('KerebroMultiAutosSave') != null) && (window.sessionStorage.getItem('KerebroMultiAutosSave') != "")) {
		var dataTarget = JSON.parse(Base64.decode(window.sessionStorage.getItem('KerebroMultiAutosSave')))
	} else {
		var dataTarget = {}
	}
	for (I in dataTarget) {
		if (dataTarget[I].and) {
			for (andData in dataTarget[I].and) {
				if (dataTarget[I].and[andData].pass == 1) continue;
				switch (parseInt(dataTarget[I].and[andData].ruletype)) {
				case 0:
					var windowPath = window.location.pathname;
					var urlstring = dataTarget[I].and[andData].url;
					var urlArray = urlstring.split(",");
					for (urlKey in urlArray) {
						if (!urlArray.hasOwnProperty(urlKey)) continue;
						var url = urlArray[urlKey];
						switch (parseInt(dataTarget[I].and[andData].logictype)) {
						case 0:
							if (window.location.search != '') {
								windowPath = windowPath + sortQuery(window.location.search);
								url = urlQuery(url)
							}
							if (windowPath.toLowerCase() == url.toLowerCase()) {
								dataTarget[I].and[andData].pass = 1;
								showlog('[autos] match page[' + windowPath.toLowerCase() + ']')
							}
							break;
						case 1:
							if (window.location.search != '') {
								windowPath = windowPath + window.location.search
							}
							var myRe = new RegExp("^" + url.replace("?", "\\?"));
							if (myRe.exec(windowPath)) {
								dataTarget[I].and[andData].pass = 1;
								showlog('[autos] match page from[' + windowPath.toLowerCase() + ']')
							}
							break
						}
					}
					break;
				case 1:
					if (passedRuleType == 1 && I == checkI) {
						dataTarget[I].and[andData].pass = 1
					} else {
						showlog("[autos] " + dataTarget[I].and[andData].logictype + " secs check and passing " + I + " ruletype=1 ");
						setTimeout("runMultiAutosCheck(1, '" + I + "')", parseInt(dataTarget[I].and[andData].logictype) * 1000)
					}
					break;
				case 2:
					if (pageview > parseInt(dataTarget[I].and[andData].logictype)) {
						showlog("[autos] match visiting ");
						dataTarget[I].and[andData].pass = 1
					}
					break;
				case 3:
				case 4:
					break;
				case 5:
					if (boundOutofScreen == false) {
						boundOutofScreenCheck();
						boundOutofScreen = true
					}
					break;
				case 6:
					if (boundScroll == false) {
						boundScrollCheck();
						boundScroll = true
					}
					break
				}
			}
		}
		if (dataTarget[I].not) {
			for (andData in dataTarget[I].not) {
				if (dataTarget[I].not[andData].pass == 1) continue;
				switch (parseInt(dataTarget[I].not[andData].ruletype)) {
				case 0:
					var windowPath = window.location.pathname;
					var urlstring = dataTarget[I].not[andData].url;
					var urlArray = urlstring.split(",");
					var passflag = false;
					for (urlKey in urlArray) {
						if (!urlArray.hasOwnProperty(urlKey)) continue;
						var url = urlArray[urlKey];
						switch (parseInt(dataTarget[I].not[andData].logictype)) {
						case 0:
							if (window.location.search != '') {
								windowPath = windowPath + sortQuery(window.location.search);
								url = urlQuery(url)
							}
							if (!(windowPath.toLowerCase() == url.toLowerCase())) {
								passflag = true
							}
							break;
						case 1:
							if (window.location.search != '') {
								windowPath = windowPath + window.location.search
							}
							var myRe = new RegExp("^" + url.replace("?", "\\?"));
							if (!myRe.exec(windowPath)) {
								passflag = true
							}
							break
						}
					}
					if (!passflag) {
						dataTarget[I].not[andData].pass = 1
					}
					break;
				case 1:
					break;
				case 2:
					if (pageview <= parseInt(dataTarget[I].not[andData].logictype)) {
						showlog("[autos] visiting times[not match]。");
						dataTarget[I].not[andData].pass = 1
					}
					break;
				case 3:
				case 4:
					break;
				case 5:
				case 6:
					break
				}
			}
		}
	}
	checkMultiData(dataTarget)
}
function boundOutofScreenCheck() {
	document.onmousemove = function(e) {
		if ((window.sessionStorage.getItem('KerebroMultiAutosSave') != null) && (window.sessionStorage.getItem('KerebroMultiAutosSave') != "")) {
			var dataTarget = JSON.parse(Base64.decode(window.sessionStorage.getItem('KerebroMultiAutosSave')))
		} else {
			var dataTarget = {}
		}
		e = e || window.event;
		if (e.clientY <= 10) {
			for (I in dataTarget) {
				if (dataTarget[I].and) {
					for (andData in dataTarget[I].and) {
						if (dataTarget[I].and[andData].pass == 1) continue;
						if (parseInt(dataTarget[I].and[andData].ruletype) == 5) {
							dataTarget[I].and[andData].pass = 1;
							showlog("[autos] view out of screen " + I)
						}
					}
				}
			}
			checkMultiData(dataTarget)
		}
	}
}
function boundScrollCheck() {
	document.onscroll = function() {
		if ((window.sessionStorage.getItem('KerebroMultiAutosSave') != null) && (window.sessionStorage.getItem('KerebroMultiAutosSave') != "")) {
			var dataTarget = JSON.parse(Base64.decode(window.sessionStorage.getItem('KerebroMultiAutosSave')))
		} else {
			var dataTarget = {}
		}
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
		var body = document.body,
			html = document.documentElement;
		var windowheight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		var changed = false;
		for (I in dataTarget) {
			if (dataTarget[I].and) {
				for (andData in dataTarget[I].and) {
					if (dataTarget[I].and[andData].pass == 1) continue;
					if (parseInt(dataTarget[I].and[andData].ruletype) == 6) {
						if (parseInt(dataTarget[I].and[andData].logictype) == 100) {
							if (height == (scrollTop + windowheight)) {
								showlog("[autos] scroll bottom match");
								dataTarget[I].and[andData].pass = 1;
								changed = true
							}
						} else {
							if (parseInt(100 * ((scrollTop + windowheight / 2) / height)) == parseInt(dataTarget[I].and[andData].logictype)) {
								showlog("[autos] scroll match");
								dataTarget[I].and[andData].pass = 1;
								changed = true
							}
						}
					}
				}
			}
		}
		if (changed) {
			checkMultiData(dataTarget)
		}
	}
}
function checkMultiData(dataTarget) {
	for (I in dataTarget) {
		var AndPassFlag = false;
		var NotPassFlag = false;
		if (dataTarget[I].and) {
			var AndPass = 0;
			for (andData in dataTarget[I].and) {
				if (dataTarget[I].and.hasOwnProperty(andData)) AndPass += parseInt(dataTarget[I].and[andData].pass)
			}
			if (AndPass == Object.keys(dataTarget[I].and).length) {
				AndPassFlag = true
			}
		} else AndPassFlag = true;
		if (dataTarget[I].not) {
			var NotPass = 0;
			for (notData in dataTarget[I].not) {
				if (dataTarget[I].not.hasOwnProperty(notData)) NotPass += parseInt(dataTarget[I].not[notData].pass)
			}
			if (NotPass == Object.keys(dataTarget[I].not).length) {
				NotPassFlag = true
			}
		} else NotPassFlag = true;
		if (AndPassFlag && NotPassFlag) {
			showlog("[Multiautos] " + I + " all match , drop");
			delete dataTarget[I];
			AutosResultCallBack(I)
		}
	}
	if (Object.keys(dataTarget).length == 0) window.sessionStorage.removeItem('KerebroMultiAutosSave');
	else window.sessionStorage.setItem('KerebroMultiAutosSave', Base64.encode(JSON.stringify(dataTarget)))
}
function runTargetCheck() {
	if ((window.sessionStorage.getItem('KerebroTargetSave') != null) && (window.sessionStorage.getItem('KerebroTargetSave') != "")) {
		var dataTarget = JSON.parse(Base64.decode(window.sessionStorage.getItem('KerebroTargetSave')))
	} else {
		var dataTarget = {}
	}
	for (I in dataTarget) {
		switch (parseInt(dataTarget[I].type)) {
		case 0:
			var windowPath = window.location.pathname;
			var url = dataTarget[I].url;
			switch (parseInt(dataTarget[I].logictype)) {
			case 0:
				if (window.location.search != '') {
					windowPath = windowPath + sortQuery(window.location.search);
					url = urlQuery(url)
				}
				if (windowPath.toLowerCase() == url.toLowerCase()) {
					showlog("[Targets] url match。");
					TargetResultCallBack(I)
				}
				break;
			case 1:
				if (window.location.search != '') {
					windowPath = windowPath + window.location.search
				}
				var myRe = new RegExp("^" + url.replace("?", "\\?"));
				if (myRe.exec(windowPath)) {
					showlog("[Targets] url match from");
					TargetResultCallBack(I)
				}
				break
			}
			break;
		case 1:
			var url = dataTarget[I].url;
			var windowPath = window.location.pathname;
			if (window.location.search != '') {
				windowPath = windowPath + sortQuery(window.location.search);
				url = urlQuery(url)
			}
			if (windowPath.toLowerCase() == url.toLowerCase()) {
				showlog("[Targets] url match" + dataTarget[I].timeintval + " secs  and call ");
				setTimeout("TargetResultCallBack('" + I + "')", parseInt(dataTarget[I].timeintval) * 1000)
			}
			break;
		case 2:
			var pageview = parseInt(window.localStorage.getItem('T_pageview') || 0);
			pageview++;
			if (pageview > parseInt(dataTarget[I].visitingpage)) {
				TargetResultCallBack(I);
				showlog("[Targets] match visiting call ");
				window.localStorage.removeItem('T_pageview')
			} else {
				window.localStorage.setItem('T_pageview', pageview)
			}
			break
		}
	}
}
function AutosResultCallBack(tID) {
	KerebroAjax("https://" + hostsubname + "kerebro.com/tracker/recive_autos_response.php", {
		fastMode: 1,
		method: 'autosTrigger',
		tID: tID,
		userid: userID + "_" + tabID,
		url: window.location.href
	}, function(e) {
		return recive_autos_responseResponseHandler.call(e, httpReqObj)
	})
}
function TargetResultCallBack(tID) {
	KerebroAjax("https://" + hostsubname + "kerebro.com/tracker/recive_target_response.php", {
		method: 'targetTrigger',
		tID: tID,
		userid: userID + "_" + tabID,
		url: window.location.href
	}, function(e) {
		return recive_target_responseResponseHandler.call(e, httpReqObj)
	})
}
function recive_autos_responseResponseHandler(httpReq) {
	if (httpReq.readyState == 4) {
		if (httpReq.status == 200) {
			var responseData = JSON.parse(httpReq.responseText);
			if (responseData.code != 0) {
				showlog('[Kerebro error] recive_auto_response code:' + responseData.code)
			} else {
				if (responseData.KerebroTargetSave != null) {
					if (!window.sessionStorage.getItem('KerebroTargetSave')) window.sessionStorage.setItem('KerebroTargetSave', responseData.KerebroTargetSave)
				}
				if ((window.sessionStorage.getItem('KerebroAutosSave') != null) && (window.sessionStorage.getItem('KerebroAutosSave') != "")) {
					var orginalAutosData = JSON.parse(Base64.decode(window.sessionStorage.getItem('KerebroAutosSave')));
					delete orginalAutosData[responseData.tID];
					if (Object.keys(orginalAutosData).length == 0) window.sessionStorage.removeItem('KerebroAutosSave');
					else window.sessionStorage.setItem('KerebroAutosSave', Base64.encode(JSON.stringify(orginalAutosData)))
				}
				if ((window.sessionStorage.getItem('KerebroMultiAutosSave') != null) && (window.sessionStorage.getItem('KerebroMultiAutosSave') != "")) {
					var orginalMultiAutosData = JSON.parse(Base64.decode(window.sessionStorage.getItem('KerebroMultiAutosSave')));
					delete orginalMultiAutosData[responseData.tID];
					if (Object.keys(orginalMultiAutosData).length == 0) window.sessionStorage.removeItem('KerebroMultiAutosSave');
					else window.sessionStorage.setItem('KerebroMultiAutosSave', Base64.encode(JSON.stringify(orginalMultiAutosData)))
				}
				if (responseData.imageDataReturn != null) {
					var imageDataReturn = JSON.parse(Base64.decode(responseData.imageDataReturn));
					showADs(imageDataReturn, false)
				}
			}
		}
	}
	return
}
function recive_target_responseResponseHandler(httpReq) {
	if (httpReq.readyState == 4) {
		if (httpReq.status == 200) {
			var responseData = JSON.parse(httpReq.responseText);
			if (responseData.code != 0) {
				showlog('[Kerebro error] recive_target_response code:' + responseData.code)
			} else {
				var orginalTargetData = JSON.parse(Base64.decode(window.sessionStorage.getItem('KerebroTargetSave')));
				delete orginalTargetData[responseData.tID];
				if (Object.keys(orginalTargetData).length == 0) window.sessionStorage.removeItem('KerebroTargetSave');
				else window.sessionStorage.setItem('KerebroTargetSave', Base64.encode(JSON.stringify(orginalTargetData)))
			}
		}
	}
	return
}
function startSSE(u, t) {
	if (u == null || t == null) {
		showlog("[Kerebro Error] No UserTab, SSE stoped");
		return
	}
	if ( !! window.EventSource) {
		source = new EventSource('https://' + hostsubname + 'kerebro.com/tracker/newserver.php?user=' + u + '_' + t + '&h=' + window.location.hostname + '&gs=' + ServerSet)
	} else {}
	source.addEventListener('message', function(e) {
		if (e.origin != 'https://' + hostsubname + 'kerebro.com') {
			showlog("[Kerebro Error] Origin Error");
			return
		}
		var sseResponse = JSON.parse(e.data);
		if (sseResponse.code == 1) {
			showlog("[Kerebro Error] time out, kickout");
			source.close()
		} else {
			if (sseResponse.saveData != "") {
				KerebroData = sseResponse.saveData;
				showlog("[Kerebro Info] refresh Data " + sseResponse.saveData);
				window.localStorage.setItem('KerebroData', sseResponse.saveData)
			}
			showlog("[" + sseResponse.s + "]:" + sseResponse.usetab)
		}
	}, false);
	source.addEventListener('reciveImages', function(e) {
		if (e.origin != 'https://' + hostsubname + 'kerebro.com') {
			showlog("[Kerebro Error] Origin Error");
			return
		}
		var sseResponse = JSON.parse(e.data);
		var reciveData = JSON.parse(Base64.decode(sseResponse.data));
		showADs(reciveData, false)
	}, false)
}
function showADs(reciveData, previewMode) {
	var KerebroADdiv = document.getElementById("KerebroADdiv");
	var adtype = reciveData.mediatype;
	var positiontype = reciveData.pos;
	var Kerebro_title = reciveData.title || 'unKnown_' + reciveData.adID;
	var imgsize = {
		w: reciveData.w,
		h: reciveData.h
	};
	switch (adtype) {
	case 'image':
		var content = '<img style="max-height: 80vh;height:' + imgsize.h + 'px;" src="' + reciveData.imgsrc + '")">';
		break;
	case 'text':
		var Contents = reciveData.newtextAD;
		var btnHTML = "";
		if (Contents.ifshowbtninText == 1) {
			if (Contents.select_btn_csstype == 'normal') {
				btnHTML = '<div class="textAD_btn" style="background-color:' + Contents.select_btnbg_ad_color + ' ; border:2px solid ' + Contents.select_btnbg_ad_color + '; color:' + Contents.select_btntext_ad_color + ' ; border-radius: ' + Contents.select_btn_radiussize + 'px;">' + Contents.btninTextValue + '</div>'
			} else {
				btnHTML = '<div class="textAD_btn" style="background-color: rgba(0,0,0,0) ; border:2px solid ' + Contents.select_btnbg_ad_color + '; color:' + Contents.select_btnbg_ad_color + ' ; border-radius: ' + Contents.select_btn_radiussize + 'px;">' + Contents.btninTextValue + '</div>'
			}
		}
		if (Contents.uploadTextBg != '') {
			backimgurl = 'background: url(' + Contents.uploadTextBg + '); background-repeat: no-repeat; background-size: 100%;'
		} else {
			backimgurl = ''
		}
		var content = '<div class="kerebroADtext" style="' + backimgurl + ' -webkit-box-sizing: border-box; -moz-box-sizing: border-box;box-sizing: border-box; width:' + imgsize.w + 'px;height:' + imgsize.h + 'px; background-color: ' + Contents.select_text_ad_color + '"> <div class="textcontenter_btnlayer">' + btnHTML + '</div>' + Contents.textcontenter + '</div>';
		break;
	case 'video':
		var content = '<div id="player" d0="' + reciveData.youtube + '" d1="' + reciveData.adID + '" d2="' + reciveData.userid + '" d3="' + reciveData.by + '"></div>';
		break
	}
	if (!KerebroADdiv) {
		var newImg = document.createElement('div');
		newImg.id = "KerebroADdiv";
		newImg.style.opacity = '0';
		newImg.style.maxHeight = '80vh';
		newImg.style.position = 'fixed';
		switch (positiontype) {
		case 'BR':
			newImg.style.bottom = "10px";
			newImg.style.right = '-' + imgsize.w + 'px';
			var params = {
				right: "10px",
				opacity: "1"
			};
			break;
		case 'BL':
			newImg.style.bottom = "10px";
			newImg.style.left = '-' + imgsize.w + 'px';
			var params = {
				left: "10px",
				opacity: "1"
			};
			break;
		case 'TL':
			newImg.style.top = "10px";
			newImg.style.left = '-' + imgsize.w + 'px';
			var params = {
				left: "10px",
				opacity: "1"
			};
			break;
		case 'TR':
			newImg.style.top = "10px";
			newImg.style.right = '-' + imgsize.w + 'px';
			var params = {
				right: "10px",
				opacity: "1"
			};
			break;
		case 'C':
			newImg.style.top = "calc(50vh - " + parseInt(imgsize.h) / 2 + "px)";
			newImg.style.right = "calc(50vw - " + parseInt(imgsize.w) / 2 + "px)";
			var params = {
				opacity: "1"
			};
			break;
		case 'B':
			newImg.style.bottom = "20px";
			newImg.style.right = "calc(50vw - " + parseInt(imgsize.w) / 2 + "px)";
			var params = {
				opacity: "1"
			};
			break;
		case 'T':
			newImg.style.top = "20px";
			newImg.style.right = "calc(50vw - " + parseInt(imgsize.w) / 2 + "px)";
			var params = {
				opacity: "1"
			};
			break
		}
		newImg.style.zIndex = '100000';
		newImg.style.transition = 'all 1s';
		newImg.style.boxShadow = "0px 0px 3px 2px rgba(0,0,0,0.1)";
		if (reciveData.hitbuilder == 1) {
			var a = document.createAttribute("kerebro_hitbuilder");
			a.value = Kerebro_title;
			newImg.setAttributeNode(a)
		}
		if (adtype != 'video') {
			if (reciveData.url == '') {
				newImg.innerHTML = '<link rel="stylesheet" href="https://' + hostsubname + 'kerebro.com/tracker/kerebroAD.css" type="text/css" /> <div style="position:absolute; right:0px; top:0px ; background-color:#eee; width:25px; height:25px;line-height:25px; text-align:center;font-size:25px;cursor:pointer;z-index: 100000" onClick="closeADs(\'' + reciveData.adID + '\', \'' + reciveData.userid + '\', \'' + reciveData.by + '\', ' + previewMode + ' )">&#10006;</div><div id="KerebroNOIMG" style="outline:none" onClick="clickADs(\'' + reciveData.adID + '\', \'' + reciveData.userid + '\', \'' + reciveData.by + '\', 0, ' + previewMode + ')";>' + content + '</div>'
			} else {
				newImg.innerHTML = '<link rel="stylesheet" href="https://' + hostsubname + 'kerebro.com/tracker/kerebroAD.css" type="text/css" /> <div style="position:absolute; right:0px; top:0px ; background-color:#eee; width:25px; height:25px;line-height:25px; text-align:center;font-size:25px;cursor:pointer;z-index: 100000" onClick="closeADs(\'' + reciveData.adID + '\', \'' + reciveData.userid + '\', \'' + reciveData.by + '\', ' + previewMode + ')">&#10006;</div><a href="' + reciveData.url + '" target="_blank" style="outline:none" onClick="clickADs(\'' + reciveData.adID + '\', \'' + reciveData.userid + '\', \'' + reciveData.by + '\', 1, ' + previewMode + ')";>' + content + '</a>'
			}
		} else {
			if (reciveData.showvideoURL == 1) {
				switch (positiontype) {
				case 'BR':
				case 'BL':
				case 'B':
					var buttonDIV = '<div style="position: absolute;top: -60px;left: 0px;width: 100%;height: 50px;padding: 0px 15px 0px 15px;line-height: 50px;box-sizing: border-box;box-shadow: rgba(0, 0, 0, 0.0980392) 0px 0px 3px 2px;background-color: white;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"><a href="' + reciveData.url + '" target="_blank">' + reciveData.url_text + '</a></div>';
					break;
				case 'TL':
				case 'TR':
				case 'C':
				case 'T':
					var buttonDIV = '<div style="position: absolute;bottom: -60px;left: 0px;width: 100%;height: 50px;padding: 0px 15px 0px 15px;line-height: 50px;box-sizing: border-box;box-shadow: rgba(0, 0, 0, 0.0980392) 0px 0px 3px 2px;background-color: white;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"><a href="' + reciveData.url + '" target="_blank">' + reciveData.url_text + '</a></div>';
					break
				}
			} else {
				var buttonDIV = ''
			}
			newImg.innerHTML = '<link rel="stylesheet" href="https://' + hostsubname + 'kerebro.com/tracker/kerebroAD.css" type="text/css" /> <div style="position:absolute; right:0px; top:0px ; background-color:#eee; width:25px; height:25px;line-height:25px; text-align:center;font-size:25px;cursor:pointer;z-index: 100000" onClick="closeADs(\'' + reciveData.adID + '\', \'' + reciveData.userid + '\', \'' + reciveData.by + '\', ' + previewMode + ' )">&#10006;</div>' + buttonDIV + content
		}
		document.body.appendChild(newImg);
		Object.keys(params).forEach(function(key) {
			setTimeout('document.getElementById("KerebroADdiv").style.' + key + ' = "' + params[key] + '";', 100)
		});
		if (adtype == 'video') KerebroonYouTubeIframeAPIReady(previewMode)
	}
}
function KerebroonYouTubeIframeAPIReady(previewMode) {
	if (YT) {
		window.player = new YT.Player('player', {
			height: '225',
			width: '300',
			videoId: document.getElementById('player') ? document.getElementById('player').getAttribute('d0') : "",
			playerVars: {
				rel: 0
			},
			events: {
				'onStateChange': function(event) {
					if (event.data == 3) {
						var d1 = document.getElementById('player').getAttribute('d1') ? document.getElementById('player').getAttribute('d1') : "";
						var d2 = document.getElementById('player').getAttribute('d2') ? document.getElementById('player').getAttribute('d2') : "";
						var d3 = document.getElementById('player').getAttribute('d3') ? document.getElementById('player').getAttribute('d3') : "";
						clickADs(d1, d2, d3, 0, previewMode);
						playered = true
					}
				}
			}
		})
	} else {
		console.log('Kerebro: NO YT')
	}
}
function closeADs(adID, userid, autosid, previewMode) {
	if (previewMode == true) {
		document.getElementById('KerebroADdiv').parentNode.removeChild(document.getElementById('KerebroADdiv'));
		return
	}
	if (playered) {
		document.getElementById('KerebroADdiv').parentNode.removeChild(document.getElementById('KerebroADdiv'))
	} else {
		document.getElementById('KerebroADdiv').parentNode.removeChild(document.getElementById('KerebroADdiv'));
		KerebroAjax("https://" + hostsubname + "kerebro.com/tracker/recive_ads_response.php", {
			method: 'closeAD',
			adID: adID,
			userid: userid,
			url: window.location.href,
			autosid: autosid
		}, function(e) {
			return recive_ads_responseResponseHandler.call(e, httpReqObj)
		})
	}
	if (scrollifDroped) {
		scrollifDroped = false
	}
}
function clickADs(adID, userid, autosid, haveimage, previewMode) {
	if (previewMode == true) return;
	if (haveimage == 1) {
		KerebroAjax("https://" + hostsubname + "kerebro.com/tracker/recive_ads_response.php", {
			method: 'clickAD',
			adID: adID,
			userid: userid,
			url: window.location.href,
			autosid: autosid
		}, function(e) {
			return recive_ads_responseResponseHandler.call(e, httpReqObj, 1)
		})
	} else {
		if (document.getElementById('KerebroNOIMG')) {
			document.getElementById('KerebroNOIMG').onclick = function() {}
		}
		KerebroAjax("https://" + hostsubname + "kerebro.com/tracker/recive_ads_response.php", {
			method: 'clickAD',
			adID: adID,
			userid: userid,
			url: window.location.href,
			autosid: autosid
		}, function(e) {
			return recive_ads_responseResponseHandler.call(e, httpReqObj)
		})
	}
}
function recive_ads_responseResponseHandler(httpReq, haveimage) {
	if (httpReq.readyState == 4) {
		if (httpReq.status == 200) {
			var responseData = JSON.parse(httpReq.responseText);
			if (document.getElementById('KerebroADdiv').getAttribute('kerebro_hitbuilder')) {
				showlog("[kerebro] hitbuilder init");
				var trackID = '';
				var cid = '';
				if (typeof ga !== 'undefined') {
					if (typeof ga.getAll()[0].b !== 'undefined') {
						trackID = ga.getAll()[0].b.data.values[':trackingId'];
						cid = ga.getAll()[0].b.data.values[":clientId"]
					}
				}
				if (trackID != "") {
					var hitbuilder_responsedata = {
						"v": 1,
						"t": 'event',
						"tid": trackID,
						"cid": cid,
						"ec": "kerebro",
						"ea": "clickAD",
						"el": document.getElementById('KerebroADdiv').getAttribute('kerebro_hitbuilder')
					};
					showlog("[kerebro] hitbuilder senting");
					KerebroAjax("https://www.google-analytics.com/collect", hitbuilder_responsedata, function(e) {
						return hitbuilder_response.call(e, httpReqObj)
					})
				} else {
					showlog("[kerebro] hitbuilder error , cant find GA code")
				}
			}
			if (haveimage === 1) {
				document.getElementById('KerebroADdiv').parentNode.removeChild(document.getElementById('KerebroADdiv'))
			}
			if (responseData.code != 0) showlog('[Kerebro error] ' + responseData.code)
		}
	}
	return
}
function hitbuilder_response(httpReq) {
	if (httpReq.readyState == 4) {
		if (httpReq.status == 200) {
			showlog(httpReq.responseText)
		}
	}
	return
}
var Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function(e) {
		var t = "";
		var n, r, i, s, o, u, a;
		var f = 0;
		e = Base64._utf8_encode(e);
		while (f < e.length) {
			n = e.charCodeAt(f++);
			r = e.charCodeAt(f++);
			i = e.charCodeAt(f++);
			s = n >> 2;
			o = (n & 3) << 4 | r >> 4;
			u = (r & 15) << 2 | i >> 6;
			a = i & 63;
			if (isNaN(r)) {
				u = a = 64
			} else if (isNaN(i)) {
				a = 64
			}
			t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
		}
		return t
	},
	decode: function(e) {
		var t = "";
		var n, r, i;
		var s, o, u, a;
		var f = 0;
		e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (f < e.length) {
			s = this._keyStr.indexOf(e.charAt(f++));
			o = this._keyStr.indexOf(e.charAt(f++));
			u = this._keyStr.indexOf(e.charAt(f++));
			a = this._keyStr.indexOf(e.charAt(f++));
			n = s << 2 | o >> 4;
			r = (o & 15) << 4 | u >> 2;
			i = (u & 3) << 6 | a;
			t = t + String.fromCharCode(n);
			if (u != 64) {
				t = t + String.fromCharCode(r)
			}
			if (a != 64) {
				t = t + String.fromCharCode(i)
			}
		}
		t = Base64._utf8_decode(t);
		return t
	},
	_utf8_encode: function(e) {
		e = e.replace(/\r\n/g, "\n");
		var t = "";
		for (var n = 0; n < e.length; n++) {
			var r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r)
			} else if (r > 127 && r < 2048) {
				t += String.fromCharCode(r >> 6 | 192);
				t += String.fromCharCode(r & 63 | 128)
			} else {
				t += String.fromCharCode(r >> 12 | 224);
				t += String.fromCharCode(r >> 6 & 63 | 128);
				t += String.fromCharCode(r & 63 | 128)
			}
		}
		return t
	},
	_utf8_decode: function(e) {
		var t = "";
		var n = 0;
		var r = c1 = c2 = 0;
		while (n < e.length) {
			r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r);
				n++
			} else if (r > 191 && r < 224) {
				c2 = e.charCodeAt(n + 1);
				t += String.fromCharCode((r & 31) << 6 | c2 & 63);
				n += 2
			} else {
				c2 = e.charCodeAt(n + 1);
				c3 = e.charCodeAt(n + 2);
				t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
				n += 3
			}
		}
		return t
	}
};

function kerebrodebug() {
	console.log('version :' + kerebroVer());
	showlogflag = true
}
function showlog(string) {
	if (showlogflag == false) return;
	console.log(string)
}
function sortQuery(queryParam) {
	KeyValue.prototype = {
		toString: function() {
			return encodeURIComponent(this.key) + '=' + encodeURIComponent(this.value)
		}
	};
	var obj1 = {};
	queryParam.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function($0, $1, $2, $3) {
		obj1[$1] = $3
	});
	var query = [];
	for (key in obj1) {
		if (obj1.hasOwnProperty(key)) {
			var myUTM = new RegExp("^utm_");
			if (!myUTM.exec(key)) {
				query.push(new KeyValue(key, obj1[key]))
			}
		}
	}
	query.sort(function(a, b) {
		return a.key < b.key ? -1 : 1
	});
	var queryString = query.join('&');
	return queryString ? "?" + queryString : ""
}
function KeyValue(key, value) {
	this.key = key;
	this.value = value
}
function urlQuery(strings) {
	var partsOfStr = strings.split('?');
	if (partsOfStr.length == 2) {
		if (partsOfStr[1] != "") {
			strings = partsOfStr[0] + sortQuery(partsOfStr[1])
		}
	}
	return strings
}
Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--
		}
	}
	return this
};
var keywordscontents = "";
for (var I in document.head.getElementsByTagName("meta")) {
	if (Object.prototype.hasOwnProperty.call(document.head.getElementsByTagName("meta"), parseInt(I))) {
		if (document.head.getElementsByTagName("meta")[I].name.toString().toLowerCase() == 'keywords') {
			keywordscontents = keywordscontents + "," + document.head.getElementsByTagName("meta").item(I).content
		}
	}
}
keywordscontents = keywordscontents.replace(/,/gi, " ");
var res = keywordscontents.split(" ").clean("");
var BigDatahttpReqObj;
if (window.XMLHttpRequest) {
	BigDatahttpReqObj = new XMLHttpRequest()
} else {
	BigDatahttpReqObj = new ActiveXObject("Microsoft.XMLHTTP")
}
KerebroAjaxBigData = function(url, parameters, success, ontimeout) {
	BigDatahttpReqObj.open("POST", url, true);
	BigDatahttpReqObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	BigDatahttpReqObj.withCredentials = true;
	BigDatahttpReqObj.timeout = 3000;
	BigDatahttpReqObj.send(BigDataSerialize(parameters));
	BigDatahttpReqObj.onreadystatechange = success;
	BigDatahttpReqObj.ontimeout = ontimeout
};
BigDataSerialize = function(obj, prefix) {
	var str = [];
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			var k = prefix ? prefix + "[" + p + "]" : p,
				v = obj[p];
			str.push(typeof v == "object" ? BigDataSerialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v))
		}
	}
	return str.join("&")
};

function startBigData() {
	var parameters = {
		k: res,
		t: DOCUMENTTITLE,
		scr: {
			width: screen.width,
			height: screen.height
		},
		ref: document.referrer
	};
	KerebroAjaxBigData("#", parameters, function(e) {
		return myBigDataHandler.call(e, BigDatahttpReqObj)
	}, function(e) {
		console.log('timeout')
	});
	heartbeat()
}
function krot(ets, name, content) {
	KerebroAjaxBigData("#", {
		event: ets,
		name: name,
		content: content
	}, function(e) {}, function(e) {
		console.log('timeout')
	})
}
function myBigDataHandler(httpReq) {
	if (httpReq.readyState == 4) {
		if (httpReq.status == 200) {
			console.log(httpReq.responseText)
		}
	}
	return
}
KerebroAjaxBigDataGET = function(url, parametersString, success, ontimeout) {
	BigDatahttpReqObj.open("GET", url + "?t=" + Math.random() + "&" + parametersString, true);
	BigDatahttpReqObj.onreadystatechange = success;
	BigDatahttpReqObj.timeout = 3000;
	BigDatahttpReqObj.ontimeout = ontimeout;
	BigDatahttpReqObj.send()
};

function heartbeat() {
	setTimeout(function() {
		KerebroAjaxBigDataGET("https://analysis.kerebro.com/heartbeat/index.php", "", function(e) {
			return heartbeatHandler.call(e, BigDatahttpReqObj)
		}, function(e) {
			console.log('timeout')
		})
	}, 3000)
}
function heartbeatHandler(httpReq) {
	if (httpReq.readyState == 4) {
		if (httpReq.status == 200) {
			var responseData = JSON.parse(httpReq.responseText);
			console.log(responseData.t);
			if (responseData.code == 0) heartbeat();
			else console.log('You had offline!')
		}
	}
}
function previewKerebroInit() {
	var hashtag = window.location.hash.replace(/#/, "").split("=", 2);
	if (hashtag.length == 2 && hashtag[0] == 'kerebropreview') {
		KerebroAjaxBigData("#", {
			u: userID,
			t: tabID,
			a: hashtag[1]
		}, function(e) {
			return kerebroPreviewHandler.call(e, BigDatahttpReqObj)
		})
	}
}
function kerebroPreviewHandler(httpReq) {
	if (httpReq.readyState == 4) {
		if (httpReq.status == 200) {
			var responseData = JSON.parse(httpReq.responseText);
			switch (parseInt(responseData.t)) {
			case 0:
				showADs(responseData.d, true);
				break;
			case 1:
				alert('Kerebro Notify: Please login First');
				break;
			case 3:
				alert('Kerebro Notify:  different site on browser with backsite');
				break;
			case 4:
				alert('Kerebro Notify:  Error');
				break;
			default:
				console.log(responseData.t);
				break
			}
		}
	}
}