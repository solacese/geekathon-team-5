using log4net;
using SolaceSystems.Solclient.Messaging;
using SolaceSystems.Solclient.Messaging.SDT;
using System;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace com.solace.demos.trading
{
    public enum CommunicationState
    {
        Created = 0,
        Opening,
        Opened,
        Closing,
        Closed,
        Faulted
    }

    /// <summary>
    /// Singleton class to manage connection and publish messages to the Solace Messaging Router.
    /// </summary>
    public sealed class SolaceConnManager
    {
        #region Members
        private static readonly ILog log = LogManager.GetLogger(typeof(SolaceConnManager));
        private static readonly SolaceConnManager _instance = new SolaceConnManager();
        private IContext _context = null;
        private ISession _session = null;
        private CommunicationState _state = CommunicationState.Created;
        private bool _isInitialized = false;
        private ServiceConfiguration _config = null;
        private MatchingEngine _parent = null;
        private long sequenceNumber = 1;


        #endregion

        private SolaceConnManager() { }

        public static SolaceConnManager Instance
        {
            get { return _instance; }
        }

        public CommunicationState State
        {
            get { return _state; }
        }

        /// <summary>
        /// Initialize the Solace .NET API
        /// </summary>
        /// <param name="service"></param>
        public void Initialize(MatchingEngine service)
        {
            // Ignore call if we are already initialized
            if (this._isInitialized)
                return;

            this._parent = service;
            this._config = this._parent.ServiceConfig;

            // Initialize the API
            log.Info("Initializing Solace .NET API");
            var cfp = new ContextFactoryProperties();
            cfp.SolClientLogLevel = SolLogLevel.Warning;
            ContextFactory.Instance.Init(cfp);

            // Flag we are initialized
            this._isInitialized = true;
        }

        internal void Subscribe(string topic)
        {

            if (_state != CommunicationState.Opened)
            {
                log.Debug("Ignoring call - Solace transport channel is not connected");
                return;
            }

            _session.Subscribe(ContextFactory.Instance.CreateTopic(topic) , true);

        }

        /// <summary>
        /// Performs cleanup on the Solace .NET API
        /// </summary>
        public void Cleanup()
        {
            // API Cleanup only if initialized
            if (this._isInitialized)
                ContextFactory.Instance.Cleanup();
            this._isInitialized = false;
        }

        /// <summary>
        /// Connects to Solace. Ignores call if already connected.
        /// </summary>
        /// <param name="config">The configuration to establish a Solace connection</param>
        public void Connect()
        {
            if (_state == CommunicationState.Opened || _state == CommunicationState.Opening)
            {
                log.Debug("Ignoring call - the Solace transport channel is in state: " + _state.ToString());
                return;
            }

            // Indicate we are opening
            this._state = CommunicationState.Opening;
            log.Debug("Connecting to Solace");

            try
            {
                // Context & Session Properties
                var contextProps = new ContextProperties();
                SessionProperties sessionProps = new SessionProperties();
                sessionProps.Host = this._config.SessionHost;
                sessionProps.VPNName = this._config.SessionVpnName;
                sessionProps.UserName = this._config.SessionUsername;
                sessionProps.Password = this._config.SessionPassword;
                sessionProps.ClientName = this._config.SessionClientName;
                sessionProps.ClientDescription = this._config.SessionClientDescription;
                sessionProps.ConnectRetries = this._config.SessionConnectRetries;
                sessionProps.ConnectTimeoutInMsecs = this._config.SessionConnectTimeoutInMsecs;
                sessionProps.ReconnectRetries = this._config.SessionReconnectRetries;
                sessionProps.ReconnectRetriesWaitInMsecs = this._config.SessionReconnectRetriesWaitInterval;
                sessionProps.ReapplySubscriptions = true;

                // Context
                _context = ContextFactory.Instance.CreateContext(contextProps, null);

                // Session
                _session = _context.CreateSession(sessionProps, HandleMessageEvent, HandleSessionEvent);

                // Connect
                ReturnCode rc = _session.Connect();

                if (rc != ReturnCode.SOLCLIENT_OK)
                {
                    // throw exception to caller
                    throw new Exception("Unable to connect Solace session. Solace ReturnCode: " + rc.ToString());
                }

                // Update state
                this._state = CommunicationState.Opened;
                log.InfoFormat("Service is connected to Solace on: {0}", this._config.SessionHost);

            }
            catch (OperationErrorException ex)
            {
                throw new Exception("Unable to connect Solace session. See inner exception for details.", ex);
            }
        }

        public void Disconnect()
        {
            this._state = CommunicationState.Closing;
            log.Debug("Disconnecting Solace session");
            if (_session != null)
            {
                _session.Dispose();
                _session = null;
            }
            if (_context != null)
            {
                _context.Dispose();
                _context = null;
            }

            // Update state
            this._state = CommunicationState.Closed;
            log.Info("Service gracefully disconnected from Solace");
        }

        /// <summary>
        /// Sends the provided messages to the connected Session. 
        /// </summary>
        /// <param name="message"></param>
        /// <exception cref="InvalidOperationException">If the session is in any state other than Opened</exception>
        public void SendMessage(IMessage message)
        {
            if (_state != CommunicationState.Opened)
            {
                throw new InvalidOperationException("Service not connected to Solace and is in the state: " + _state.ToString());
            }

            try
            {
                ReturnCode returnCode = _session.Send(message);
                if (returnCode != ReturnCode.SOLCLIENT_OK)
                {
                    log.ErrorFormat("SendMessage failed, return code: {0}", returnCode);
                }
            }
            catch (OperationErrorException ex)
            {
                throw new Exception("Unable to send message to Solace. Reason: " + ex.Message, ex);
            }
        }


        #region Event Handlers
        private void HandleMessageEvent(Object source, MessageEventArgs args)
        {
            using (IMessage requestMsg = args.Message)
            {
                try
                {
                    string requestJSON = Encoding.ASCII.GetString(requestMsg.BinaryAttachment);
                    log.DebugFormat("OrderRequest Received. Topic: {0} - Contents: {1}", requestMsg.Destination.Name, requestJSON);

                    OrderRequest request = JsonConvert.DeserializeObject<OrderRequest>(requestJSON);

                    #region create settlement message
                    IMessage settlementMsg = ContextFactory.Instance.CreateMessage();
                    settlementMsg.Destination = ContextFactory.Instance.CreateTopic(_config.ExchSettlementTopicPrefix + request.settlementExch + "/" + request.account + "/" + request.instrument);

                    Settlement settlement = new Settlement(request);
                    settlement.executionExch = _config.ExchName;

                    string settlementJSON = JsonConvert.SerializeObject(settlement);
                    //settlementMsg.BinaryAttachment = Encoding.ASCII.GetBytes(settlementJSON);
                    SDTUtils.SetText(settlementMsg, settlementJSON);


                    log.DebugFormat("Publishing Settlement message. Topic: {0} - Contents: {1}", settlementMsg.Destination.Name, settlementJSON);
                    SendMessage(settlementMsg);
                    #endregion

                    #region create MD trade message
                    Trade trade = new Trade(request);

                    IMessage tradeMsg = ContextFactory.Instance.CreateMessage();
                    tradeMsg.Destination = ContextFactory.Instance.CreateTopic(_config.ExchTradeTopicPrefix + trade.Sec + "/TRADES");

                    string tradeJSON = "[" + JsonConvert.SerializeObject(trade) +"]";
                    tradeMsg.BinaryAttachment = Encoding.ASCII.GetBytes(tradeJSON);

                    log.DebugFormat("Publishing Trade message. Topic: {0} - Contents: {1}", tradeMsg.Destination.Name, tradeJSON);
                    SendMessage(tradeMsg);
                    #endregion

                    #region create OrderRequest Response 
                    OrderResponse response = new OrderResponse(request);
                    response.executionExch = _config.ExchName;
                    response.orderId = _config.ExchName + "_" + DateTime.Now.ToString("yyyyMMdd") + "_"+ (sequenceNumber++).ToString().PadLeft(10, '0'); 

                    //Prepare Response for OrderRequest message by reusing the Request message

                    string responseJSON = JsonConvert.SerializeObject(response);
                    requestMsg.BinaryAttachment = Encoding.ASCII.GetBytes(responseJSON);

                    requestMsg.Destination = ContextFactory.Instance.CreateTopic(_config.ExchOrdResponseTopic + response.account + "/"+ response.instrument );

                    log.DebugFormat("Publishing Response message. Topic: {0} - Contents: {1}", requestMsg.Destination.Name, responseJSON);
                    SendMessage(requestMsg);
                    #endregion


                    settlementMsg.Dispose();
                    requestMsg.Dispose();
                }
                catch(Exception e)
                {
                    log.ErrorFormat("Error", e);
                }
            }
        }

        private void HandleSessionEvent(Object sender, SessionEventArgs args)
        {
            var sessionEvent = args.Event;
            string logMessage = string.Format("Solace Session Event Received: '{0}'; details: '{1}'", args.Event, args.Info);

            switch (sessionEvent)
            {
                case SessionEvent.ConnectFailedError:
                case SessionEvent.DownError:
                    log.Warn(logMessage);
                    _state = CommunicationState.Faulted;
                    // We need to shutdown
                    _parent.Stop();
                    break;
                case SessionEvent.UpNotice:
                    _state = CommunicationState.Opened;
                    break;
                case SessionEvent.MessageTooBigError:
                case SessionEvent.RejectedMessageError:
                    log.Warn(logMessage);
                    break;
                case SessionEvent.Acknowledgement:
                    break;
                default:
                    break;
            }
        }
        #endregion
    }
}
