## Contents
This directory will contain all the server side code/apps.

1. MarketDataFeedhandler - A Java program to simulate trade updates for a given set of instruments from a specified exchange.
2. PortfolioManager - A Java program to simulate a trading portfolio for a given client account. The portfolio is generated and details returned upon a request message being sent to it. 
2. ExchMatchingEngineCore - A C# .NET Core program to simulate an exchange matching engine capable of receiving Order Requests and generating a Response to the Memeber, a MarketData Trade as well as a Settlement message to be processed by the corresponding PortfolioManager

## Checking out

To check out the project, clone this GitHub repository:

```
git clone https://github.com/solacese/geekathon-team-5
cd geekathon-team-5/server-side/
```

## 1. Running the Feed Handler

To run the feedhandler program:

```
cd MarketDataFeedhandler
java -jar MarketDataFeedhandler.jar 

0 [main] ERROR com.solace.demos.trading.MDFeedhandler  - Common parameters:
         -h HOST[:PORT]  Router IP address [:port, omit for default]
         -v VPN          vpn name (omit for default)
         -u USER         Authentication username
         -e EXCHANGE     Name of Exchange (NSE, BSE, MSE)
         -i INSTRUMENTS  Properties file containing instruments
        [-p PASSWORD]    Authentication password
        [-f FREQUENCY]   Frequency of publish in seconds (default: 10)
```

Example command against a demo Solace Cloud instance:
```
java -jar MarketDataFeedhandler.jar -h vmr-mr8v6yiwicdj.messaging.solace.cloud:20512 -v msgvpn-rwtxvklq4sp -u solace-cloud-
client -p kasaov362vnboas6r1oi2v85q8 -e nse -i config/instruments.properties
```
### Topic and Message Example

Messages are of the format:
```
{"Sec": "BHARTIARTL", "Ex": "NSE", "Price": "339.147", "Qty": "3,116", "Chg": "-"}
```
To an example topic:
MD/NSE/BHARTIARTL/TRADES

Where it is made up of: MD/\<exchange-name\>/\<instrument-name\>/TRADES



## 2. Running the Portfolio Manager

To run the portfolio manager program:

```
cd MarketDataFeedhandler
java -jar PortfolioManager.jar

ERROR [com.solace.demos.trading.PortfolioManager] Common parameters:
         -h HOST[:PORT]  Router IP address [:port, omit for default]
         -v VPN          vpn name (omit for default)
         -u USER         Authentication username
         -e EXCHANGE     Name of Exchange (NSE, BSE, MSE)
         -i INSTRUMENTS  Properties file containing instruments
        [-p PASSWORD]    Authentication password
```

Example command against a demo Solace Cloud instance:
```
java -jar PortfolioManager.jar -h vmr-mr8v6yiwicdj.messaging.solace.cloud:20512 -v msgvpn-rwtxvklq4sp -u solace-cloud-
client -p kasaov362vnboas6r1oi2v85q8 -e nse -i config/instruments.properties
```
### Topic and Message Example

Response messages are of the format:
```
{
  "exchange": "NSE",
  "type": "Portfolio Update",
  "account": "008"
  "instruments": [
    {
      "inv_price": "1754", "qty": "28", "instrument": "HINDUNILVR"
    },
    {
      "inv_price": "1221", "qty": "92", "instrument": "TITAN"
    }
  ]
}
```
When the request is sent to an example topic:
PORTFOLIO/NSE/FETCH

Where it is made up of: PORTFOLIO/\<exchange-name\>/FETCH


## 3. Running the Exchange Matching Engine 

To run the matching engine program:

```
cd ExchMatchingEngineCore\publish
dotnet ExchMatchingEngineCore.dll

```

To change instance and connection properties edit the ExchMatchingEngineCore.dll.config file
See below sample configuration values against a demo Solace Cloud instance:
```
<!-- Service Configuration -->
  <MatchingEngineConfiguration sessionHost="tcp://vmr-mr8v6yiwicdj.messaging.solace.cloud:20512"
                               sessionUsername="solace-cloud-client"
                               sessionPassword="kasaov362vnboas6r1oi2v85q8"
                               sessionVpnName="msgvpn-rwtxvklq4sp"
                               sessionClientName=""
                               sessionClientDescription=""
                               exchName="BSE"
                               exchOrdRequestTopic="ORDER/BSE/REQUEST/>"
                               exchOrdResponseTopic="ORDER/BSE/RESPONSE/"
                               exchTradeTopicPrefix="MD/BSE/"
                               exchSettlementTopicPrefix="SETTLEMENT/" 
                               />
							   
```
### Topic and Message Example

Order Request messages are of the format:
```
{   
  "account":"mmoreno",
  "instrument":"KOTAKBANK",
  "price":"1507.075",
  "qty":"100",
  "settlementExch":"NSE",
  "side":"buy"
}
```
When the Order Request is sent to an example topic:
ORDER/NSE/REQUEST/mmoreno/KOTAKBANK

Where it is made up of: ORDER/\<execution-exchange\>/REQUEST/\<account\>/\<instrument-name\>


Order Response messages are of the format:
```
{
  "account":"mmoreno",
  "settlementExch":"NSE",
  "instrument":"KOTAKBANK",
  "qty":"100",
  "price":"1507.075",
  "side":"buy",
  "orderId":"NSE_20190531_0000000002"
}
```

When the Order Request is sent to an example topic:
ORDER/NSE/RESPONSE/mmoreno/KOTAKBANK

Where it is made up of: ORDER/\<execution-exchange\>/RESPONSE/\<account\>/\<instrument-name\>

Settlement messages are of the format:
```
{
  "account":"mmoreno",
  "settlementExch":"NSE",
  "instrument":"KOTAKBANK",
  "qty":"100",
  "price":"1507.075",
  "side":"buy"
}
```

When the settlement is sent to an example topic:
SETTLEMENT/NSE/mmoreno/KOTAKBANK

Where it is made up of: SETTLEMENT/\<settlement-exchange\>/\<account\>/\<instrument-name\>
