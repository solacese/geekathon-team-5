////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Solace Systems Messaging SDK for JavaScript
// Copyright 2010-2012 Solace Systems Inc. All rights reserved.
// http://www.SolaceSystems.com
//
//                              * solUIHelper *
//
// This file contains methods help painting the UI, and methods to aapend inputs to the log text area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//alert("solUIHelper");

var OPERATION_TIMEOUT = 30000;
var REQUEST_TIMEOUT = 5000;
var js_username = "000" ;

function download() {
	//download source
	window.location = "./soldemosrc.zip";
}

function aboutSolace() {
	//About Solace
	window.open("http://www.solacesystems.com");
}

function readme() {
	//New window with documentation
	window.open("./readme.html");
}

function topics_doc() {
	//New window with documentation
	window.open("./topics.html");
}
function documentation() {
	//New window with documentation
	window.open("./api/index.html");
}

function padLeft(str, padChar, length) {
	str = str + "";
	while (str.length < length) {
		str = padChar + str;
	}
	return str;
}

function utils_currentTime() {
	var currentTime = new Date();
	return padLeft(currentTime.getHours(), '0', 2) + ":" +
			padLeft(currentTime.getMinutes(), '0', 2) + ":" +
			padLeft(currentTime.getSeconds(), '0', 2) + "." +
			padLeft(currentTime.getMilliseconds(), '0', 3);
}

function logUtil(line) {
	var message = utils_currentTime() + ":" + line + "\n";
	//alert(message);
	//var txtarea = document.getElementById("txaConsoleLog");
	//txtarea.value = message + txtarea.value;
}

function endsWithEven(str) {
    if(eval(str.substring(str.length-1)) %2 >0) 
    	return false;
    else
    	return true;  	
}

function stringReplaceAll(str, find, replace) {
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

function initSolace() {

	connectSession();
}

function sendTrackRq() {
	//alert("sendTrackRq()");
	var fileNo = document.getElementById("fileNo").value;
	alert("Checking the status of fileNo:"+fileNo);

	
	try {
		var msg = solace.SolclientFactory.createMessage();
		// Set the topic to requestTopic
		msg.setDestination(solace.SolclientFactory.createTopic("req/passport/status/file"));
		// Set delivery mode
		msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
		// Set binary attachment
		msg.setBinaryAttachment("Status~"+fileNo);

		//send the request message and wait for reply
		mySession.sendRequest(msg, REQUEST_TIMEOUT, function(session, message) {
			replyReceivedCb(session, message);
		}, function(session, event) {
			replyFailedCb(session, event);
		}, null);
	} catch (error) {
		
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}
}


function sendNewAppRq() {
//alert("sendNewAppRq()");
	var givenName = document.getElementById("givenName").value;
	var surname = document.getElementById("surname").value;
	var birthDate = document.getElementById("birthDate").value;
	var birthPlace = document.getElementById("birthPlace").value;
	var state = document.getElementById("state").value;
	var district = document.getElementById("district").value;
	var country = document.getElementById("country").value;
	var gender = document.getElementById("gender").value;
	var maritalStatus = document.getElementById("maritalStatus").value;
	var citizenship = document.getElementById("citizenship").value;
	var pan = document.getElementById("pan").value;
	var voterid = document.getElementById("voterid").value;
	var employmentType = document.getElementById("employmentType").value;
	var eduQualification = document.getElementById("eduQualification").value;
	var visibleMark = document.getElementById("visibleMark").value;
	var aadhaarId = document.getElementById("aadhaarId").value;

	var appmsg = "NewApp~"+givenName +"~"+ surname +"~"+ birthDate +"~"+ birthPlace +"~"+ state +"~"+ district +"~"+ country +"~"+ gender +"~"+ maritalStatus +"~"+ citizenship +"~"+ pan
	+"~"+ voterid +"~"+ employmentType +"~"+ eduQualification +"~"+ visibleMark +"~"+ aadhaarId;
	
	//alert("DATA"+":"+ appmsg);

		
	try {
		var msg = solace.SolclientFactory.createMessage();
		// Set the topic to requestTopic
		msg.setDestination(solace.SolclientFactory.createTopic("req/passport/newapp/file"));
		// Set delivery mode
		msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
		// Set binary attachment
		msg.setBinaryAttachment(appmsg);
		//alert("calling reply msg");
		//send the request message and wait for reply
		mySession.sendRequest(msg, REQUEST_TIMEOUT, function(session, message) {
			replyReceivedNewApp(session, message);
		}, function(session, event) {
			replyFailedCb(session, event);
		}, null);
	} catch (error) {
		logUtil("Failed to send request");
		logUtil(error.toString());
	}
}


function sendLoginRq() {
	//alert("sendLoginRq()");
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	if(username == "001"){
		setLoggedInUser(username);
		window.location.hash = 'sec_top20_vol';
		document.getElementById("exchange-banner").src="cssm/images/newsolace_nse.png"; 
	} else if(username == "002"){
		setLoggedInUser(username);
		window.location.hash = 'sec_top20_vol';
		document.getElementById("exchange-banner").src="cssm/images/newsolace_bse.png";
	} else if(username == "003"){
		setLoggedInUser(username);
		window.location.hash = 'sec_top20_vol';
		document.getElementById("exchange-banner").src="cssm/images/newsolace_mse.png";
	} else {
		alert("Invalid User. Please try again.")
	}
	try {

	} catch (error) {
		//logUtil("Failed to send phone request");
		//logUtil(error.toString());
		alert(error.toString());
	}
	
		//alert("Checking the status of username22222:"+username);
}


function sendBuySellStockRq(action) {
//alert("sendBuySellStockRq()"+action);
	var symbol = document.getElementById("stksymbol").value;
	var price = document.getElementById("stkprice").value;
	var volume = document.getElementById("volume").value;
		if(action=="SELL"){
			volume = volume * -1
		}
			//alert(volume);
	
	var appmsg = "AddStock~"+js_username+"~"+symbol +"~"+ price +"~"+ volume;
	
	//alert("DATA"+":"+ appmsg);

		
	try {
		var msg = solace.SolclientFactory.createMessage();
		// Set the topic to requestTopic
		if(action=="BUY"){
		//alert("BUY");
			msg.setDestination(solace.SolclientFactory.createTopic("req/mdd/stock/buy"));
		} else {
		//alert("SELL");
			msg.setDestination(solace.SolclientFactory.createTopic("req/mdd/stock/sell"));
		}
		// Set delivery mode
		msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
		// Set binary attachment
		msg.setBinaryAttachment(appmsg);
		//alert("calling reply msg");
		//send the request message and wait for reply
		mySession.sendRequest(msg, REQUEST_TIMEOUT, function(session, message) {
			replyReceivedNewApp(session, message);
		}, function(session, event) {
			replyFailedCb(session, event);
		}, null);
	} catch (error) {
		logUtil("Failed to send request");
		logUtil(error.toString());
	}
}

function sendPortfolioRq() {
//alert("sendPortfolioRq()");
	
	
	
	var appmsg = {};
			appmsg.account = js_username;
			var requestText = JSON.stringify(appmsg);
	
	
	var appmsg = "username~"+js_username;
	
		
	try {
		var msg = solace.SolclientFactory.createMessage();
		// Set the topic to requestTopic

		msg.setDestination(solace.SolclientFactory.createTopic("PORTFOLIO/NSE/FETCH"));
		msg.setSdtContainer(solace.SDTField.create(solace.SDTFieldType.STRING, requestText));
		// Set delivery mode
		msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
		// Set binary attachment
		msg.setBinaryAttachment(requestText);
		//alert("calling reply msg : "+requestText);
		//send the request message and wait for reply
		mySession.sendRequest(msg, REQUEST_TIMEOUT, function(session, message) {
			replyReceivedPortfolio(session, message);
		}, function(session, event) {
			replyFailedCb(session, event);
		}, null);
	} catch (error) {
		logUtil("Failed to send request");
		logUtil(error.toString());
	}
}


function replyReceivedCb(session, message) {
	//alert("test!!!!!!!!!!!");
	logUtil("reply received");
	
	var text = message.getBinaryAttachment();
	// {"file":"A1234","status":"APPROVED", "dob":"10-04-1975", "fname":"Sumeet", "lname":"Puri", "apptype":"Normal", "recvdate":"12-01-2014"}

	try{
		obj = JSON.parse(text);
		
		document.getElementById("appStatusLine").innerHTML = obj.status;
		document.getElementById("solfile").innerHTML = obj.file;
		document.getElementById("solfname").innerHTML = obj.fname;
		document.getElementById("sollname").innerHTML = obj.lname;
		document.getElementById("soldob").innerHTML = obj.dob;
		document.getElementById("solapptype").innerHTML = obj.apptype;
		document.getElementById("solrecvdate").innerHTML = obj.recvdate;
		//document.getElementById("appstatus").style.display = "block";
		
	} catch (error) {
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}	
	logUtil(text);
}

function replyReceivedNewApp(session, message) {
	
	//alert("in replyReceivedNewApp");
	logUtil("reply received");
	
	var text = message.getBinaryAttachment();
	// {"file":"A1234","status":"APPROVED", "dob":"10-04-1975", "fname":"Sumeet", "lname":"Puri", "apptype":"Normal", "recvdate":"12-01-2014"}

	try{
		obj = JSON.parse(text);
		
		document.getElementById("solfile").innerHTML = obj.file;
		alert("Your application is successfully submitted. For future reference use file no.:"+obj.file);
		
	} catch (error) {
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}	
	logUtil(text);
}

function replyReceivedPortfolio(session, message) {
	var trp_id;
	console.log("replyReceivedPortfolio : "+message);
	
	
	var msgObj = message.getBinaryAttachment();
	console.log("msgObj : "+msgObj);
	var json = msgObj.slice(msgObj.indexOf("{"),msgObj.lastIndexOf("}")+1)
	
	var jsonObj = JSON.parse(json);
	
	console.log("Exchange : "+jsonObj.exchange);
	console.log("Type : "+jsonObj.type);
	console.log("Account : "+jsonObj.account);	
	console.log("Instruments : "+jsonObj.instruments[0].instrument);
	console.log("Instruments : "+jsonObj.instruments.length);
	//var sym = JSON.parse(jsonObj.instruments[0]);
	//console.log("sym : "+sym);

	try{

		for (i = 0; i < jsonObj.instruments.length; i++) {
			var tick = jsonObj.instruments[i];
			var trp_id = tick.instrument;
			
			console.log("tick.instrument : "+trp_id);
		
			var table = document.getElementById("tab_portfolio");
			var row = table.insertRow(-1);
			row.id = trp_id;
			console.log("tick.instrument : "+tick.instrument);
			
			// Add Symbol Label
			var symbolCell = row.insertCell(0);
			symbolCell.style.background = '-webkit-linear-gradient(top, #005713 0%, #02026B 100%)';
			symbolCell.style.color = '#FFFFFF';
			symbolCell.innerHTML = tick.instrument;
			symbolCell.id = trp_id+"_SYM";
			symbolCell.classList.add("symbol");
			
			console.log("tick.inv_price : "+tick.inv_price);
			//Price
			var priceCell = row.insertCell(-1);
			priceCell.style.background = '-webkit-linear-gradient(top, #005713 0%, #02026B 100%)';
			priceCell.style.color = '#FFFFFF';
			priceCell.style.textAlign = 'center';
			priceCell.innerHTML = tick.inv_price;
			priceCell.id = trp_id+"_INV";
			priceCell.classList.add("price");
			
			console.log("tick.qty : "+tick.qty);
			//Volume
			var volumeCell = row.insertCell(-1);
			volumeCell.style.background = '-webkit-linear-gradient(top, #005713 0%, #02026B 100%)';
			volumeCell.style.color = '#FFFFFF';
			volumeCell.style.textAlign = 'center';
			volumeCell.innerHTML = tick.qty;
			volumeCell.id = trp_id+"_VOL";
			volumeCell.classList.add("volume");
			
			console.log("tick.val : "+parseInt(tick.qty)*parseFloat(tick.inv_price))
			//Value
			var valueCell = row.insertCell(-1);
			valueCell.style.background = '-webkit-linear-gradient(top, #005713 0%, #02026B 100%)';
			valueCell.style.color = '#FFFFFF';
			valueCell.style.textAlign = 'center';
			valueCell.innerHTML = (parseInt(tick.qty)*parseFloat(tick.inv_price)).toFixed(2);
			valueCell.id = trp_id+"_VAL";
			valueCell.classList.add("value");
		
		}
		
		//document.getElementById("solfile").innerHTML = obj.file;
		//alert("Portfolio data.:");
		
	} catch (error) {
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}	
	logUtil(text);
	
	
}

function replyReceivedLogin(session, message) {
	
	//alert("in replyReceivedLogin");
		document.getElementById("sec_top20_vol").disabled = false;

	logUtil("reply received");
	
	var text = message.getBinaryAttachment();
	// {"file":"A1234","status":"APPROVED", "dob":"10-04-1975", "fname":"Sumeet", "lname":"Puri", "apptype":"Normal", "recvdate":"12-01-2014"}
	try{
		obj = JSON.parse(text);
		//$('#tab_securities tr:nth-child(2) td:nth-child(1)').html('foo');
		
		//document.getElementById("symbol").innerHTML = obj.symbol;
		//document.getElementById("qty").innerHTML = obj.qty;
		//document.getElementById("price").innerHTML = obj.price;
		//document.getElementById("value").innerHTML = obj.value;
		//alert("Your application is successfully submitted. For future reference use file no.:"+obj.symbol);
		
		//alert($('#someTable tr:nth-child(2) td:nth-child(1)').html());
		
	} catch (error) {
	alert(error.toString());
		logUtil("Failed to send phone request");
		logUtil(error.toString());
	}	
	logUtil(text);
}


function replyFailedCb(session, event) {
alert("Reply Failed!!!");
	logUtil("error callback");
	logUtil(event.infoStr);
	logUtil(event.toString()); 
}

function statusUpdate(statusText, statusColor) {
	
	//repaint divHello
	
	if (statusText == 'Disconnected') {
		document.getElementById("red").src = "img/red-on.png";
		document.getElementById("amber").src = "img/amber-off.png";
		document.getElementById("green").src = "img/green-off.png";
	}
	else if (statusText == 'Connecting') {
		document.getElementById("red").src = "img/red-off.png";
		document.getElementById("amber").src = "img/amber-on.png";
		document.getElementById("green").src = "img/green-off.png";
	}
	else if (statusText == 'Connected') {
		document.getElementById("divSvrStatus").innerHTML = "";
		document.getElementById("red").src = "img/red-off.png";
		document.getElementById("amber").src = "img/amber-off.png";
		document.getElementById("green").src = "img/green-on.png";
	}
			
}




//************************************************************************************






