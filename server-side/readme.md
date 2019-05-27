## Contents
This directory will contain all the server side code/apps.

1. MarketDataFeedhandler - A Java program to simulate trade updates for a given set of instruments from a specified exchange.


## Checking out

To check out the project, clone this GitHub repository:

```
git clone https://github.com/solacese/geekathon-team-5
cd geekathon-team-5/server-side/
```

## Running the Feed Handler

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
## Topic and Message Example

Messages are of the format:
{"Sec": "BHARTIARTL", "Ex": "NSE", "Price": "339.147", "Qty": "3,116", "Chg": "-"}

To an example topic:
MD/NSE/BHARTIARTL/TRADES

Where it is made up of: MD/\<exchange-name\>/\<instrument-name\>/TRADES
