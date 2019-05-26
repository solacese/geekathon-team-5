This directory will contain all the server side code/apps.

1. MarketDataFeedhandler - A Java program to simulate trades updates for a given set of instruments from a specified exchange.

Messages are of the format:
topicString=MD/NSE/BHARTIARTL/TRADES  message=[{"Sec": "BHARTIARTL", "Ex": "NSE", "Price": "339.147", "Qty": "3,116", "Chg": "-"}]

Program is executed as:
java -jar .\MarketDataFeedhandler.jar -h vmr-mr8v6yiwicdj.messaging.solace.cloud:20512 -v msgvpn-rwtxvklq4sp -u solace-cloud-
client -p password -e nse -i config/instruments.properties

