////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Solace Systems Messaging SDK for JavaScript
// Copyright 2010-2012 Solace Systems Inc. All rights reserved.
// http://www.SolaceSystems.com
//
//                              * SolPubSubHelper *
//
// This sample demonstrates:
//  - Subscribing to a topic for direct messages.
//  - Receiving messages with callbacks
//
// This is the helper JavaScripts code, where we show the basics of creating a session, connecting a session, subscribing to a topic,
// and publishing direct messages to a topic.
// This script is invoked by wrapper methods from GUI based applications, and correspondingly calls them back upon receiving messages
// from its event callbacks 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//alert("solPubSubHelper");
    var OPERATION_TIMEOUT = 30000;
    var ns = this;
    
  
    /**
    * Change this variable to point it to the host:port of the solace appliance
    * You may have to use a Web Server Reverse Proxy to deal with CORS issues for older browsers
    * E.g. For the Reverse Proxy case, if you are serving your application on apache running on 192.168.0.12 on port 8080 
    * the below url should be
    * http://192.168.0.12:8080/smf
    */
    
    var my_web_server_url = "wss://vmr-mr8v6yiwicdj.messaging.solace.cloud:20516/smf"; //e.g. change this to F5 ip
    var my_client_username = "solace-cloud-client";
    var my_vpn = "msgvpn-rwtxvklq4sp";
    var my_password = "kasaov362vnboas6r1oi2v85q8";     

 	/**
 	* Global variables which control the session (tcp connection)
 	*/           
    var mySessionProperties = null;
    var publishIntervalId = null;
    var statsIntervalId = null;
    var elapsedTimeInSecs = 0;
    var connectedOnce = false;
    var autoReconnect = true;
    var previousTick = 0;
    var mySession = null;
    var symbols = {YES: '100',HDFC:'200',ICICI:'300',AXIS: '100',Airtel:'200',TATA:'300'};

//    var autoReconnect = false;
//    var mySession = null;

    /** Forward declarations of session callback and message callback methods
    * sessionEvenCb - a callback method defined later in this file, 
    * 		which is called by Solace in case a session event such as connect, disconnect, reconnect etc occurs
    *
    * messageEventCb - - a callback method defined later in this file,
    *		which is called by Solace to push messages into, whenever a new message matches the added subscriptions on the session
    */
    var sessionEventCb; // forward declaration
    var messageEventCb; // forward declaration


    // An array of subscriptions that cannot be sent temporarily due to network congestion
    // They will be re-sent upon receiving CAN_ACCEPT_DATA event.
    // The array will be cleared when session is disconnected.
    this.subscriptionsInWaiting = [];

 	
 	/**
     * Creates a session object, to be used for connection later
     * Connectivity parameters such as IP, Port, VPN, Username, Password etc 
     * are used to initialize the session object 
     *
     * Most importantly, as explained above, this method creates the session by associating it with 2 callback methods
     * message event callback method, for Solace to push the messages into 
     * session event callback method, for Solace to push session event messages into
     */
    this.connectSession = function() {
        try {
        	//initialize session properties
        	mySessionProperties = new solace.SessionProperties();
        	mySessionProperties.userName = my_client_username;
            mySessionProperties.vpnName = my_vpn;
           
            mySessionProperties.password = my_password;
            mySessionProperties.url = my_web_server_url; 
            //alert(my_web_server_url+" "+my_client_username+"@"+my_vpn);
            ns.logUtil(my_web_server_url+" "+my_client_username+"@"+my_vpn);
            mySessionProperties.connectTimeoutInMsecs = OPERATION_TIMEOUT;
            mySessionProperties.readTimeoutInMsecs = OPERATION_TIMEOUT;
            mySessionProperties.keepAliveIntervalsLimit = 10;
            mySessionProperties.connectTimeoutInMsecs = 25000;
            mySessionProperties.transportDowngradeTimeoutInMsecs = 5000;
            mySessionProperties.reapplySubscriptions = autoReconnect;
          
            mySession = solace.SolclientFactory.createSession(mySessionProperties,
                    new solace.MessageRxCBInfo(function(session, message) {
                            ns.messageEventCb(session, message);
                    }, this),
                    new solace.SessionEventCBInfo(function(session, event) {
                        ns.sessionEventCb(session, event);
                    }, this));
            
            //connect the session
            autoReconnect = false;
            //alert("connectSession about to be triggered:"+mySessionProperties.url);
            //this is where the actual connection initiation begines. 
            //The connection may not have been established by the time this method returns.
            //Once the connection is established, an event - sessionEventCode=UP_NOTICE is sent to the session callback method
            //So subscriptions etc should only be added after the sessionEventCode=UP_NOTICE event has been received
            mySession.connect();

            //alert("connectSession triggered");
            ns.logUtil("Initiating Connection");
 
 		
 		} catch (error) {
           	ns.logUtil("EXCEPTION: Failed to connect session");
            ns.logUtil(error.toString());
            //alert(error.toString());
        }
    };

    /**
     * Invoked when disconnect button is clicked. Disconnects the session, and then disposes it
     */
    this.disconnectSessionAndCleanup = function() {
        logUtil("About to disconnect session...");
        try {
            mySession.disconnect();
            mySession.dispose();
            mySession = null;
            autoReconnect = false;           
        } catch (error) {
            ns.logUtil("Failed to disconnect session");
            ns.logUtil(error.toString());
        }
    };

    /**
     * send data to the server side
     */
     this.sendData = function(topic, payload) {
     
     	var svrStatus = document.getElementById("divSvrStatus").innerHTML;
     	if (svrStatus != "UP") {
     		ns.logUtil("Failed to send message, Conn not UP");
     		return;
     	}
        var msg = solace.SolclientFactory.createMessage();
        msg.setDestination(solace.SolclientFactory.createTopic(topic));
        msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
        msg.setBinaryAttachment(payload);
        msg.setXmlContent(payload);
        
		try {
			mySession.send(msg);
			ns.logUtil("sent msg:"+payload);
		} catch (error) {
			// failed to send, therefore stop publishing and log the error thrown
			ns.logUtil("Failed to send message '" + msg.toString() + "'");
			ns.logUtil(error.toString() + error.Message);
		}       
     };
          
    /**
     * Invoked when add subscription button is clicked
     * This method injects the passed topic subscriptions into Solace, and ties them to the connected session.
     * Any new message arriving on a topic, which matches any of the injected subscription, in full or via wildcards
     * will be delivered to the message callback method registered with the session
     */
    this.addSubscription = function(topic_string) {
        //alert("test1: "+topic_string);
        ns.logUtil("About to add subscription '" + topic_string + "'");
        if (mySession !== null) {
            try {
            	//Initialize the Topic with the desired topic string. The topic string can contain wildcards
                var topic = solace.SolclientFactory.createTopic(topic_string);
                try {
                	//this method actually adds the subscriptions and can be called multiple times on a session
                    mySession.subscribe(topic, true, topic_string, OPERATION_TIMEOUT);
                    //alert("test123: "+topic_string);
                } catch (e) {
                	//error handling
                	ns.logUtil ("Add Sub ex\n"+e.message+"\n\nsubcode:"+e.subcode+"\n\n"+solace.ErrorSubcode.INVALID_SESSION_OPERATION);
                     if (e instanceof solace.OperationError && e.subcode === solace.ErrorSubcode.INSUFFICIENT_SPACE) {
                        ns.logUtil("Add subscription blocked");
                        //push the erroneous subscriptions to the pending subscriptions array
                        ns.subscriptionsInWaiting.push(
                            {
                                subscription: topic,
                                add: true
                            });
                        return;
                    }
                     if (e instanceof solace.OperationError && e.subcode === solace.ErrorSubcode.INVALID_SESSION_OPERATION) {
                        ns.logUtil("Add subscription WAITING_FOR_TRANSPORT_UP, stacking...");
                        //push the erroneous subscriptions to the pending subscriptions array
                        ns.subscriptionsInWaiting.push(
                            {
                                subscription: topic,
                                add: true
                            });
                        return;
                    }


                    throw e;
                }

            } catch (error) {
                ns.logUtil("Failed to add subscription '" + topic_string + "'");
                ns.logUtil(error.toString());
            }
        }
        
    };

    /**
     * Invoked to remove subscriptions which have been added to a session
     */
    this.removeSubscription = function(topic_string) {
        ns.logUtil("About to remove subscription '" + topic_string + "'");
        if (mySession !== null) {
            try {
                var topic = solace.SolclientFactory.createTopic(topic_string);
                try {
                    mySession.unsubscribe(topic, true, topic_string, OPERATION_TIMEOUT);
                } catch (e) {
                    if (e instanceof solace.OperationError && e.subcode === solace.ErrorSubcode.INSUFFICIENT_SPACE) {
                        ns.logUtil("Remove subscription blocked");
                        ns.subscriptionsInWaiting.push(
                            {
                                subscription: topic,
                                add: false
                            });
                        return;
                    }
                    throw e;
                }

            } catch (error) {
                ns.logUtil("Failed to add subscription '" + topic_string);
                ns.logUtil(error.toString());
            }
        }
    };


    /**
     * Direct message receive callback. Solace pushes messages to this method as and when they are published
     * if they match the added subscriptions. This method should call handler methods to process the message data
     * In this example, this method calls the helloWorldMessageCallback() method and passes it the topic and message payload
     * The helloWorldMessageCallback() which is defined in the index.html file itself, and it modifies the GUI to display the text received in the messages
     * @param session - the session on which the messages are received
     * @param message - the actual message with payload and topic
     */
    this.messageEventCb = function (session, message) {
    //alert("test");
    	//extract the payload and topic from the message
    	var payload = message.getBinaryAttachment();
    	var payloadTxt = message.getXmlContent();
    	var topic_string = message.getDestination().getName();
    
    	if (payload == null) payload = payloadTxt;

    	//ns.logUtil(topic_string+" " + payload);
		
		
		topic_string_1 = topic_string.substr(0,3);
		//alert("topic "+topic_string_1)
		if(topic_string_1==="MD/"){
		//alert("test1"+topic_string_1);
    	this.paintData (topic_string, payload);
    	} else {
		//alert("test2"+topic_string_1);
		//this.paintDataMySec (topic_string, payload);	

    	}
    	//this.paintGraph (topic_string, payload);
    	//pass the payload and topic to the hander method, which will repaint the screen (defined in index.html)
    	//this.helloWorldMessageCallback(topic_string, payload);
		//this.paintGraph (topic_string, payload);

    };
    
    this.paintData = function (topic_string, payload) {

    	try { 
        	
        	objJSON = $.parseJSON(payload);
        	//var tr_id = 123;
        	var tr_id = topic_string.replace(/\//g, '_');
        	//alert("222"+tr_id)
        	var td_id = topic_string.replace(/\//g, '_');
			var str1 = tr_id.substring(0, 3);
			var str2 = tr_id.substring(7);
			var strEx = tr_id.substring(3, 6);
			
			
			var tr_id = str1+str2
        	//alert(strEx);

        	
        	$.each(objJSON, function(index, tick) {
        	var intChange = tick.Chg;
        	//alert("intChange : "+intChange);
        	
        			
         	symbols[tick.CounterName] = tick.TotalValue;
         	//alert(tick.CounterName);
         	if(tick.CounterName == "Yes Bank"){
         		symbols.YES = tick.Value;
         	}else if(tick.CounterName == "HDFC Bank"){
         		symbols.HDFC = tick.Value;
         	}else if(tick.CounterName == "ICICI Bank"){
         		symbols.ICICI= tick.Value;
         	}else if(tick.CounterName == "Axis Bank"){
         		symbols.AXIS = tick.Value;
         	}else if(tick.CounterName == "Airtel"){
         		symbols.Airtel = tick.Value;
         	}else if(tick.CounterName == "Tata Motors"){
         		symbols.TATA = tick.Value;
         	}
         	
         	//alert(symbols.YES + symbols.HDFC + symbols.ICICI + symbols.AXIS + symbols.Airtel + symbols.TATA);
       	
        		if(intChange == "+") {
        			altRow = "background-image: -webkit-linear-gradient(top, #00360C 0%, #010133 100%)";
					txtColor= "color:#00FA37";
					arrow = "<img src='img/up.png' width='15px' height='15px'/>";
        		}
        		else {
        			altRow = "background-image: -webkit-linear-gradient(top, #005713 0%, #02026B 100%)";
					txtColor = "color:#FF0000"
					arrow = "<img src='img/down.png' width='15px' height='15px'/>";
        		}
        	              
				styleColRG= "style='"+txtColor+";"+altRow+";padding:2px;font-weight:normal;'";
				styleCol= "style='color:#FFFFFF;"+altRow+";padding:2px;font-weight:normal;'";

				//alert(styleCol);
			
				//Dynamically create/update market data table
 				var exchanges = ["NSE", "BSE", "MSE"];
 				var symbol = tr_id;
 				var table = document.getElementById("tab_securities");
 				// Add row for new symbol at the end of the table
 				//alert(tr_id);
 				 //alert(document.getElementById(tr_id));

 				if(document.getElementById(tr_id)==null)
 				{
 					var row = table.insertRow(-1);
 					row.id = tr_id;
 
 					// Add Symbol Label
 					var symbolCell = row.insertCell(0);
 					symbolCell.innerHTML = tick.Sec;
 					symbolCell.id = tr_id+"_SEC";
 					symbolCell.classList.add("symbol");
					
					// Loop for creating empty Table Cells for each one of the available exchanges

					for (i = 0; i < exchanges.length; i++) {
	
					//Price
					  var priceCell = row.insertCell(-1);
					  priceCell.innerHTML = tick.Price;
					  priceCell.id = tr_id+"_"+exchanges[i]+"_PRI";
					  priceCell.classList.add("price");
					//Change
					  var chgCell = row.insertCell(-1);
					  chgCell.innerHTML = arrow;
					  chgCell.id = tr_id+"_"+exchanges[i]+"_ARR";
					  chgCell.classList.add("arrow");
 					//Volume
					  var volumeCell = row.insertCell(-1);
					  volumeCell.innerHTML = tick.Qty;
					  volumeCell.id = tr_id+"_"+exchanges[i]+"_QTY";
					  volumeCell.classList.add("volume");
					  
	 				}
 				} else {
 					document.getElementById(tr_id+"_"+strEx+"_PRI").innerHTML = tick.Price;
 					document.getElementById(tr_id+"_"+strEx+"_ARR").innerHTML = arrow;
  					document.getElementById(tr_id+"_"+strEx+"_QTY").innerHTML = tick.Qty;
				}



               });
       		
       		this.paintGraph (symbols);
		} catch (error) {
			alert("JSON PARSE ERROR="+error);
		}
		    	//alert(stockValues);

    
    };

    this.paintGraph = function (symbols) {

//alert(symbols.YES + symbols.HDFC + symbols.ICICI + symbols.AXIS + symbols.Airtel + symbols.TATA);

		var chart = new CanvasJS.Chart("chartContainer",
		{
			theme: "theme4",
			title:{
				text: "My Stocks"
			},
			data: [
			{
				type: "pie",
				showInLegend: true,
				toolTipContent: "{y} - #percent %",
				yValueFormatString: "#0.#,,. Million",
				legendText: "{indexLabel}",
				dataPoints: [
					{  y: symbols.Airtel, indexLabel: "Airtel" },
					{  y: symbols.YES, indexLabel: "Yes Bank" },
					{  y: symbols.ICICI, indexLabel: "ICICI Bank" },
					{  y: symbols.HDFC, indexLabel: "HDFC Bank" },
					{  y: symbols.AXIS, indexLabel: "Axis Bank"},
					{  y: symbols.TATA, indexLabel: "Tata Motors"}
				]
			}
			]
		});
		chart.render();

/*
		var chart1 = new CanvasJS.Chart("chartContainer1",
		{
			theme: "theme4",
			title:{
				text: "Pie Chart"
			},
			data: [
			{
					type: "doughnut",
					startAngle: 0,
					toolTipContent: "{y}",
					legendText: "{indexLabel}",
					showInLegend: true,

				dataPoints: [
					{  y: symbols.Airtel, indexLabel: "Airtel" },
					{  y: symbols.YES, indexLabel: "Yes Bank" },
					{  y: symbols.ICICI, indexLabel: "ICICI Bank" },
					{  y: symbols.HDFC, indexLabel: "HDFC Bank" },
					{  y: symbols.AXIS, indexLabel: "Axis Bank"},
					{  y: symbols.TATA, indexLabel: "Tata Motors"}
				]
			}
			]
		});
		chart1.render();


		
			var chart1 = new CanvasJS.Chart("chartContainer1", {
				theme: "theme4" ,
				title: {
					text: "Column Chart"
				},
				axisX: {
					interval: 1
				},
				dataPointWidth: 30,
				data: [{
					type: "column",
					indexLabelLineThickness: 2,
					dataPoints: [
						  { x: 1, y: 10000000, indexLabel: "Yes Bank" },
						  { x: 2, y: 87687600, indexLabel: "HDFC Bank" },
						  { x: 3, y: 09089900, indexLabel: "ICICI Bank" },
						  { x: 4, y: 43242400, indexLabel: "Axis Bank" },
						  { x: 5, y: 05664600, indexLabel: "Airtel" },
						  { x: 6, y: symbols.TATA, indexLabel: "Tata Motors" }
					]
				}]
			});
			chart1.render();
			
*/

/*	
				var chart = new CanvasJS.Chart("chartContainer1", {
				title: {
					text: "Column Chart with Index Label and Data Point Width"
				},
				axisX: {
					interval: 10
				},
				dataPointWidth: 60,
				data: [{
					type: "column",
					indexLabelLineThickness: 2,
					dataPoints: [
						  { x: 10, y: symbols.YES, indexLabel: "Yes Bank" },
						  { x: 20, y: symbols.HDFC, indexLabel: "HDFC Bank" },
						  { x: 30, y: symbols.ICICI, indexLabel: "ICICI Bank" },
						  { x: 40, y: symbols.AXIS, indexLabel: "Axis Bank" },
						  { x: 50, y: symbols.Airtel, indexLabel: "Airtel" },
						  { x: 60, y: symbols.TATA, indexLabel: "Tata Motors" }
						
					]
				}]
			});
			chart.render();
*/
	
    };


    this.paintDataMySec = function (topic_string, payload) {

    	try { 
        	
        	objJSON = $.parseJSON(payload);
        	var tr_id = topic_string.replace(/\//g, '_');
        	tr_id = tr_id.substring(6)
        	//alert("111"+tr_id)
        	$.each(objJSON, function(index, tick) {
        	var intChange = tick.Change;
        	
        	
        	//alert(intChange);
        		if(intChange > 0) {
        			altRow = "background-image: -webkit-linear-gradient(top, #00360C 0%, #010133 100%)";
					txtColor= "color:#00FA37";
					arrow = "<img src='img/up.png' width='15px' height='15px'/>";
        		}
        		else {
        			altRow = "background-image: -webkit-linear-gradient(top, #005713 0%, #02026B 100%)";
					txtColor = "color:#FF0000"
					arrow = "<img src='img/down.png' width='15px' height='15px'/>";
        		}

               styleColRG= "style='"+txtColor+";"+altRow+";padding:2px;font-weight:normal;'";
               styleCol= "style='color:#FFFFFF;"+altRow+";padding:2px;font-weight:normal;'";
				
				trTick ="<tr id='"+tr_id+"'>";
				trTick += "<td "+styleCol+">"+ tick.CounterName + "</td>";
				trTick += "<td "+styleCol+">"+ arrow + "</td>";
				trTick += "<td "+styleCol+">"+ tick.Quantity + "</td>";
				trTick += "<td "+styleCol+">"+ tick.BuyPrice + "</td>";
				trTick += "<td "+styleColRG+">"+ tick.CurrentPrice + "</td>";
				trTick += "<td "+styleColRG+">"+ tick.Change + "</td>";
				trTick += "<td "+styleColRG+">"+ tick.TotalValue + "</td>";
				trTick += "<td "+styleColRG+">"+ tick.GainLoss + "</td>";
				trTick += "<td "+styleCol+">"+ tick.Status + "</td>";
				trTick +="</tr>";                 
               });
       
			$("#"+tr_id).replaceWith(trTick);
		} catch (error) {
			alert("JSON PARSE ERROR="+error);
		}
    
    };

    
    this.addStackedSubscriptions = function() {
    	
		while (ns.subscriptionsInWaiting.length > 0) {
			var sub = ns.subscriptionsInWaiting[0].subscription;
			var add = ns.subscriptionsInWaiting[0].add;
			ns.logUtil("Resend subscription '" + sub.m_name + "'");
			try {
				if (add) {
					mySession.subscribe(sub, true, sub.m_name, OPERATION_TIMEOUT);
				}
				else {
					mySession.unsubscribe(sub, true, sub.m_name, OPERATION_TIMEOUT);
				}
				ns.subscriptionsInWaiting.shift();
			} catch (e) {
				if (e instanceof solace.OperationError && e.subcode === solace.ErrorSubcode.INSUFFICIENT_SPACE) {
					ns.logUtil("Resend subscription blocked");
					return;
				}
				throw e;
			} 
		}   
    };



    /**
     * Session event callback method. This method is called by Solace to publish session lifecycle events
     * such as Connection UP, disconnect, added subscription etc
     * Any of these events can be handled from this method, e.g. reconnecting in case of a disconnect
     * @param session
     * @param event
     */
    this.sessionEventCb = function (session, event) {
        ns.logUtil(event.toString());
        if (event.sessionEventCode === solace.SessionEventCode.UP_NOTICE) {
            ns.logUtil("Connected to Solace");
            //this calls the UIHelder method to update the status display
            ns.statusUpdate("Connected", "green");
            //add stacked subscriptions
            addStackedSubscriptions();

        } else if (event.sessionEventCode === solace.SessionEventCode.CAN_ACCEPT_DATA) {
        	//this event is generated when the session is able to accept new subscriptions and after a congestion
        	//use this event to send the pending subscriptions
            addStackedSubscriptions();


        } else if (event.sessionEventCode === solace.SessionEventCode.DISCONNECTED) {
            ns.logUtil("Disconnected from Solace");
            //this calls the UIHelder method to update the status display
            ns.statusUpdate("Disconnected", "red");
            
            ns.subscriptionsInWaiting = [];
            // error occurred!
            if (autoReconnect) {
                setTimeout(
                   function(){
                       ns.connectSession();
                   }, 100);
            }
        } else if (event.sessionEventCode === solace.SessionEventCode.SUBSCRIPTION_OK) {
            ns.logUtil("Subscription added/removed: '" + event.correlationKey + "'");
        } else if (event.sessionEventCode === solace.SessionEventCode.SUBSCRIPTION_ERROR) {
            ns.logUtil("Failed to add subscription:  '" + event.correlationKey + "'");
        } else if (event.sessionEventCode === solace.SessionEventCode.LOGIN_FAILURE) {
            ns.logUtil("Login Failure!");
        } else if (event.sessionEventCode === solace.SessionEventCode.CONNECTING) {
            ns.logUtil("Connecting...");
            ns.statusUpdate("Connecting", "orange");
        } else {
            ns.logUtil("Error!");
        }
    };




