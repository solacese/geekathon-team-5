
    var OPERATION_TIMEOUT = 30000;
    var REQUEST_TIMEOUT = 5000;


    // Solace Order Request connections parameters for NSE
    var EME_NSE_Url = "wss://mrrwtxvklp4gn.messaging.solace.cloud/smf"; 
    var EME_NSE_Vpn = "msgvpn-rwtxvklp4ft";
    var EME_NSE_ClientUsername = "solace-cloud-client";
    var EME_NSE_Password = "Jtmn839koj5pl083d1e49akrq7";

    // Solace Order Request connections parameters for BSE
    var EME_BSE_Url = "wss://mr-rwtxvklrgr3.messaging.solace.cloud/smf"; 
    var EME_BSE_Vpn = "msgvpn-rwtxvklrgq9";
    var EME_BSE_ClientUsername = "solace-cloud-client";
    var EME_BSE_Password = "oojbvdvsc5lm8meeu2v7ogbv7b";

    // Solace Order Request connections parameters for MSE
    var EME_MSE_Url = "wss://mrrwtxvklrgob.messaging.solace.cloud/smf"; 
    var EME_MSE_Vpn = "msgvpn-rwtxvklrgnh";
    var EME_MSE_ClientUsername = "solace-cloud-client";
    var EME_MSE_Password = "6cb7nosf2p788oftshf0s7vp60";

    
    //Solace Cloud Monitor and Portfolio connection
/*    var my_web_server_url = "wss://mrrwtxvklp4gn.messaging.solace.cloud/smf"; 
    var my_vpn = "msgvpn-rwtxvklp4ft";
    var my_client_username = "solace-cloud-client";
    var my_password = "Jtmn839koj5pl083d1e49akrq7";*/

 	/**
 	* Global variables which control the session (tcp connection)
 	*/           

     var publishIntervalId = null;
     var statsIntervalId = null;
     var elapsedTimeInSecs = 0;
     var connectedOnce = false;
     var previousTick = 0;
 
      	/**
 	* Global variables which control the session (tcp connection)
     */           
