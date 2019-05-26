package com.solace.demos.trading;

import java.text.DecimalFormat;
import java.util.Random;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.Properties;

import com.solacesystems.jcsmp.DeliveryMode;
import com.solacesystems.jcsmp.JCSMPChannelProperties;
import com.solacesystems.jcsmp.JCSMPException;
import com.solacesystems.jcsmp.JCSMPFactory;
import com.solacesystems.jcsmp.JCSMPProperties;
import com.solacesystems.jcsmp.JCSMPSession;
import com.solacesystems.jcsmp.JCSMPStreamingPublishEventHandler;
import com.solacesystems.jcsmp.SessionEventArgs;
import com.solacesystems.jcsmp.SessionEventHandler;
import com.solacesystems.jcsmp.Topic;
import com.solacesystems.jcsmp.XMLMessage;
import com.solacesystems.jcsmp.XMLMessageProducer;

import org.apache.log4j.Logger;

public class MDFeedhandler {
	
	// logging interface
	private static Logger log = null;
	
	// logging initialiser
	static
	{
		log = Logger.getLogger(MDFeedhandler.class);
	}
	
	public static double FREQUENCY_IN_SECONDS = 10;

	public static String SOLACE_IP_PORT = null;
	public static String SOLACE_VPN = null;	
	public static String SOLACE_CLIENT_USERNAME = null;
	public static String SOLACE_PASSWORD = null;
	public static String EXCHANGE = null;
	public static String INSTRUMENTS = null;
	
	public static Properties instrumentsList = null;
	public static Properties instrumentsListOriginal = null;
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		MDFeedhandler mdPublisher = new MDFeedhandler();
		if(mdPublisher.parseArgs(args) ==1 || mdPublisher.validateParams() ==1) {
			log.error(mdPublisher.getCommonUsage());
		}
		else {
			MDDStreamerThread hwPubThread = mdPublisher.new MDDStreamerThread();
			hwPubThread.start();
		}
	}
	
	public String getCommonUsage() {
		String str = "Common parameters:\n";
		str += "\t -h HOST[:PORT]  Router IP address [:port, omit for default]\n";
		str += "\t -v VPN          vpn name (omit for default)\n";
		str += "\t -u USER         Authentication username\n";
		str += "\t -e EXCHANGE     Name of Exchange (NSE, BSE, MSE)\n";
		str += "\t -i INSTRUMENTS  Properties file containing instruments\n";
		str += "\t[-p PASSWORD]    Authentication password\n";
		str += "\t[-f FREQUENCY]   Frequency of publish in seconds (default: 10)\n";
		return str;
	}
	
	public int parseArgs(String[] args) {
		try {
			for (int i = 0; i < args.length; i++) {
				if (args[i].equals("-h")) {
					i++;
					SOLACE_IP_PORT = args[i];
				} else if (args[i].equals("-u")) {
					i++;
					SOLACE_CLIENT_USERNAME = args[i];
				} else if (args[i].equals("-p")) {
					i++;
					SOLACE_PASSWORD = args[i];
				} else if (args[i].equals("-e")) {
					i++;
					EXCHANGE = args[i].toUpperCase();	
				} else if (args[i].equals("-i")) {
					i++;
					INSTRUMENTS = args[i];		
				} else if (args[i].equals("-v")) {
					i++;
					SOLACE_VPN = args[i];
				} else if (args[i].equals("-f")) {
					i++;
					try {
					FREQUENCY_IN_SECONDS = Double.parseDouble(args[i]);
					}
					catch (NumberFormatException nfe) {
						return 1; // err: print help
					}
				} else if (args[i].equals("--help")) {
					return 1; // err: print help
				} else {
					return 1; // err: print help
				}
				
			}
		} catch (Exception e) {
			return 1; // err
		}

		return 0; // success
	}
	
	private int validateParams(){
		if (SOLACE_IP_PORT == null) return 1;
		if (SOLACE_VPN == null) SOLACE_VPN = "default";
		if (SOLACE_CLIENT_USERNAME == null) return 1;
		if (EXCHANGE == null) return 1;
		if (INSTRUMENTS == null) return 1;
		return 0;
	}
	
	/**
	 * Thread class to generate pixels to move every "n" seconds, where "n" is the Frequency In Seconds passed
	 * to the thread upon instantiation
	 * @param args
	 */	
	class MDDStreamerThread extends Thread {
		
		JCSMPSession session = null;
	    XMLMessageProducer prod = null;   
		
		public void run() {

			while (true){
				
				try {

					initInstrumentsList();
					initSolace();
					//generate market data updates to a topic of the format:
					// MD/<EXCHANGE-NAME>/<INSTRUMENT>/TRADES
				
					String topicString = null;
					String payload = null;
					
					Random random = new Random();
					
					String directionString = "";
					int directionInt = 0;
					
					double change;
					double price;
					double priceReset;
					double pricePrevious;

					@SuppressWarnings("unchecked")
					Enumeration<String> enumInstruments = (Enumeration<String>) instrumentsList.propertyNames();
					
				    while (enumInstruments.hasMoreElements()) 
				    {
				    	// (1) Iterate through the instruments list
				    	String instrument = enumInstruments.nextElement();
				    	
				    	// (2) Should the price go up or down?
					    directionString = (random.nextBoolean()) ? "+" : "-";
					    directionInt = Integer.parseInt(directionString + "1");
					    
					    // (3) Work out the price change
					    change = directionInt * random.nextDouble();
					    
					    // (4) Create the new price and save that for the next update to calculate new price from
					    price = Double.parseDouble(instrumentsList.getProperty(instrument)) + change;
					    instrumentsList.setProperty(instrument, Double.toString(price));
					    
					    // (4a) Every so often (20% of the time), revert back to the baseline price for a given instrument to ensure multiple exchanges are not drifting apart
					    if (random.nextDouble() < 0.20 ){
					    	// Apply the change to the baseline price
					    	pricePrevious = Double.parseDouble(instrumentsListOriginal.getProperty(instrument));
					    	priceReset = pricePrevious + change;
					    	
					    	
					    	// But also work out what the new change is with this price and the last price sent
					    	directionString = (priceReset > pricePrevious) ? "+" : "-";
					    	
					    	log.debug("Priced back from baseline for instrument: " + instrument + ". " + priceReset + " instead of " + price);

					    	// Now save this price back
					    	instrumentsList.setProperty(instrument, Double.toString(priceReset));
					    	price = priceReset;
					    } 
					      				 
					    // (5) Define the topic for this instrument's update
					    topicString = "MD/" + MDFeedhandler.EXCHANGE + "/" + instrument + "/TRADES";
					      
					    // (6) Create the JSON payload from the instrument, price and the up/down direction
					    payload = createTradeUpdateMessage(instrument, price, directionString);
					      
					    log.debug("topicString="+topicString+"\tmessage="+payload);
							
						// (7) Publish the update message
					    publishToSolace(topicString, payload);
				      
				    }
					
				    log.debug("===============");
					//log.error("Now sleeping for "+(int)(MDDStreamer.FREQUENCY_IN_SECONDS * 1000)+" milliseconds");
					sleep((int)(MDFeedhandler.FREQUENCY_IN_SECONDS * 1000));
					
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			
		}
		
		public String createTradeUpdateMessage (String instrument, double price, String direction){
			
			StringBuffer jsonMsg = new StringBuffer();
			
			DecimalFormat df_3dec = new DecimalFormat("#.###");
			DecimalFormat df_nodec = new DecimalFormat("###,###");
			
			String exchange = MDFeedhandler.EXCHANGE;
			
			jsonMsg.append("[{\"Sec\": \"").append(instrument);
			jsonMsg.append("\", \"Ex\": \"").append(exchange);
			jsonMsg.append("\", \"Price\": \"").append(df_3dec.format(price));
			jsonMsg.append("\", \"Qty\": \"").append(df_nodec.format(Math.random() * 10000));
			jsonMsg.append("\", \"Chg\": \"").append(direction);
			jsonMsg.append("\"}]");
			
			return jsonMsg.toString();
		}
		

		
		public void publishToSolace(String topicString, String payload) {
			
			try {
				if (session!=null && session.isClosed()) {
					log.warn("Session is not ready yet, waiting 5 seconds");
					Thread.sleep(5000);
					session.connect();
					publishToSolace (topicString, payload);
				}
				else if (session == null) {
					initSolace();
					publishToSolace (topicString, payload);
				}
				else { 
					
					Topic topic = JCSMPFactory.onlyInstance().createTopic(topicString);
	
					XMLMessage msg = prod.createBytesXMLMessage();
					msg.writeAttachment(payload.getBytes());
					msg.setDeliveryMode(DeliveryMode.DIRECT);
					prod.send(msg, topic);
					Thread.sleep(100);

					//log.error("Sent message:"+msg.dump());
				}
			} catch (Exception ex) {
				// Normally, we would differentiate the handling of various exceptions, but
				// to keep this sample as simple as possible, we will handle all exceptions
				// in the same way.
				log.error("Encountered an Exception: " + ex.getMessage());
				log.error(ex.getStackTrace());
				finish(1);
			}
		}

		public void initInstrumentsList() {
			
			if (instrumentsList != null) return;

			log.info("About to initialise instruments list from file: " + INSTRUMENTS);
			
			try (InputStream input = new FileInputStream(INSTRUMENTS)) {

				// This version will be updated with new prices
	            instrumentsList = new Properties();
	            instrumentsList.load(input);
	            
	            // This will gold the original price to act as a baseline
	            instrumentsListOriginal = new Properties();
	            instrumentsListOriginal.putAll(instrumentsList);

	            log.info("Loaded " + instrumentsList.size() + " instruments from file.");
	            
	        } catch (IOException ex) {
	        	log.error("Encountered an Exception: " + ex.getMessage());
				log.error(ex.getStackTrace());
				finish(1);
	        }
		}
		
		public void initSolace() {
			
			if (session!=null && !session.isClosed()) return;

			try {
				log.info("About to create session.");
				
				JCSMPProperties properties = new JCSMPProperties();

				properties.setProperty(JCSMPProperties.HOST, SOLACE_IP_PORT);
				properties.setProperty(JCSMPProperties.USERNAME, SOLACE_CLIENT_USERNAME);
				properties.setProperty(JCSMPProperties.VPN_NAME, SOLACE_VPN);
				properties.setProperty(JCSMPProperties.PASSWORD, SOLACE_PASSWORD);
				properties.setBooleanProperty(JCSMPProperties.REAPPLY_SUBSCRIPTIONS, true);
				
			       // Channel properties
		        JCSMPChannelProperties chProperties = (JCSMPChannelProperties) properties
					.getProperty(JCSMPProperties.CLIENT_CHANNEL_PROPERTIES);
		        
		        chProperties.setConnectRetries(10);
		        chProperties.setConnectTimeoutInMillis(1000);
		        chProperties.setReconnectRetries(2);
		        chProperties.setReconnectRetryWaitInMillis(3000);

				session =  JCSMPFactory.onlyInstance().createSession(properties, null, new PrintingSessionEventHandler());			
				session.connect();
				
				// Acquire a message producer.
				prod = session.getMessageProducer(new PrintingPubCallback());
				log.info("Session:"+session.getSessionName());
				log.info("Aquired message producer:"+prod);
			
			} catch (Exception ex) {
				log.error("Encountered an Exception: " + ex.getMessage());
				log.error(ex.getStackTrace());
				finish(1);
			}
		}
		
		protected void finish(final int status) {
			
			if (session != null) {
				session.closeSession();
			}
			System.exit(status);
		}	
		

	}
	
	public class PrintingSessionEventHandler implements SessionEventHandler {
        public void handleEvent(SessionEventArgs event) {
        	log.warn("Received Session Event "+event.getEvent()+ " with info "+event.getInfo());
        }
	}

	public class PrintingPubCallback implements JCSMPStreamingPublishEventHandler {
		public void handleError(String messageID, JCSMPException cause, long timestamp) {
			log.error("Error occurred for message: " + messageID);
			cause.printStackTrace();
		}

		public void responseReceived(String messageID) {
			log.info("Response received for message: " + messageID);
		}
	}

	
		
		
}

