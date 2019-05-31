using System;
using System.Configuration;

namespace com.solace.demos.trading
{
    /// <summary>
    /// Class to manage the Solace connection & service configurations
    /// </summary>
    public class ServiceConfiguration : ConfigurationSection
    {
        
        /// <summary>
        /// Session host name. 
        /// </summary>
        [ConfigurationProperty("sessionHost", DefaultValue = "", IsRequired = true)]
        public string SessionHost
        {
            get { return (string)this["sessionHost"]; }
            set { this["sessionHost"] = value; }
        }

        /// <summary>
        /// Session username
        /// </summary>
        [ConfigurationProperty("sessionUsername", DefaultValue = "", IsRequired = true)]
        public string SessionUsername
        {
            get { return (string)this["sessionUsername"]; }
            set { this["sessionUsername"] = value; }
        }

        /// <summary>
        /// Session password
        /// </summary>
        [ConfigurationProperty("sessionPassword", DefaultValue = "", IsRequired = false)]
        public string SessionPassword
        {
            get { return (string)this["sessionPassword"]; }
            set { this["sessionPassword"] = value; }
        }

        /// <summary>
        /// Sesssion VPN name
        /// </summary>
        [ConfigurationProperty("sessionVpnName", DefaultValue = "", IsRequired = true)]
        public string SessionVpnName
        {
            get { return (string)this["sessionVpnName"]; }
            set { this["sessionVpnName"] = value; }
        }

        /// <summary>
        /// Session Client name. 
        /// </summary>
        [ConfigurationProperty("sessionClientName", DefaultValue = "", IsRequired = false)]
        public string SessionClientName
        {
            get { return (string)this["sessionClientName"]; }
            set { this["sessionClientName"] = value; }
        }

        /// <summary>
        /// Session client description. 
        /// </summary>
        [ConfigurationProperty("sessionClientDescription", DefaultValue = "", IsRequired = false)]
        public string SessionClientDescription
        {
            get { return (string)this["sessionClientDescription"]; }
            set { this["sessionClientDescription"] = value; }
        }

        /// <summary>
        /// Number of initial Solace connection retry attempts when the service is started
        /// </summary>
        [ConfigurationProperty("sessionConnectRetries", DefaultValue = 3, IsRequired = false)]
        public int SessionConnectRetries
        {
            get { return Convert.ToInt32(this["sessionConnectRetries"]); }
            set { this["sessionConnectRetries"] = value; }
        }

        /// <summary>
        /// Session Connect Timeout in MilliSeconds (default in Solace API is 30000 ms)
        /// </summary>
        [ConfigurationProperty("sessionConnectTimeoutInMsecs", DefaultValue = 30000, IsRequired = false)]
        public int SessionConnectTimeoutInMsecs
        {
            get { return Convert.ToInt32(this["sessionConnectTimeoutInMsecs"]); }
            set { this["sessionConnectTimeoutInMsecs"] = value; }
        }

        /// <summary>
        /// Number of Solace connection retry attempts, when a connected session was unexpectedly terminated
        /// </summary>
        [ConfigurationProperty("sessonReconnectRetries", DefaultValue = 45, IsRequired = false)]
        public int SessionReconnectRetries
        {
            get { return Convert.ToInt32(this["sessonReconnectRetries"]); }
            set { this["sessonReconnectRetries"] = value; }
        }

        /// <summary>
        /// Milliseconds to wait in between reconnect retry attempts
        /// </summary>
        [ConfigurationProperty("sessionReconnectRetriesWaitInterval", DefaultValue = 1000, IsRequired = false)]
        public int SessionReconnectRetriesWaitInterval
        {
            get { return Convert.ToInt32(this["sessionReconnectRetriesWaitInterval"]); }
            set { this["sessionReconnectRetriesWaitInterval"] = value; }
        }


        /// <summary>
        /// Exchange Name
        /// </summary>
        [ConfigurationProperty("exchName", DefaultValue = "", IsRequired = true)]
        public string ExchName
        {
            get { return (string)this["exchName"]; }
            set { this["exchName"] = value; }
        }


        /// <summary>
        /// Order Request Topic
        /// </summary>
        [ConfigurationProperty("exchOrdRequestTopic", DefaultValue = "", IsRequired = true)]
        public string ExchOrdRequestTopic
        {
            get { return (string)this["exchOrdRequestTopic"]; }
            set { this["exchOrdRequestTopic"] = value; }
        }

        /// <summary>
        /// Order Response Topic
        /// </summary>
        [ConfigurationProperty("exchOrdResponseTopic", DefaultValue = "", IsRequired = true)]
        public string ExchOrdResponseTopic
        {
            get { return (string)this["exchOrdResponseTopic"]; }
            set { this["exchOrdResponseTopic"] = value; }
        }

        /// Exchange Trade Prefix
        /// </summary>
        [ConfigurationProperty("exchTradeTopicPrefix", DefaultValue = "", IsRequired = true)]
        public string ExchTradeTopicPrefix
        {
            get { return (string)this["exchTradeTopicPrefix"]; }
            set { this["exchTradeTopicPrefix"] = value; }
        }

        /// Exchange Settlement Prefix Request Topic
        /// </summary>
        [ConfigurationProperty("exchSettlementTopicPrefix", DefaultValue = "", IsRequired = true)]
        public string ExchSettlementTopicPrefix
        {
            get { return (string)this["exchSettlementTopicPrefix"]; }
            set { this["exchSettlementTopicPrefix"] = value; }
        }


    }
}