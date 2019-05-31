using System;
using System.Configuration;
using log4net;
using SolaceSystems.Solclient.Messaging;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using log4net.Config;
using System.Reflection;
using System.IO;

namespace com.solace.demos.trading
{
    public class MatchingEngine
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(MatchingEngine));
        private ServiceConfiguration _config = null;


        public ServiceConfiguration ServiceConfig
        {
            get { return _config; }
        }

        public CommunicationState State
        {
            get { return SolaceConnManager.Instance.State; }
        }


        public MatchingEngine(ServiceConfiguration config)
        {
            this._config = config;
            //InitializeComponent();
        }

        protected void OnStart(string[] args)
        {
            log.Info("Service is starting...");
            InitializeAndStartService();
        }

        public void InitializeAndStartService()
        {

            //Initialize Log4net
            var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
            XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));


            //Initialize and Connect to Solace
            SolaceConnManager.Instance.Initialize(this);
            SolaceConnManager.Instance.Connect();

            SolaceConnManager.Instance.Subscribe(_config.ExchOrdRequestTopic);

        }

        public void Stop()
        {

            //Shutdown HttpServer
            //HttpServer.Instance.ShutDownHttp();

            //Disconect from Solace
            //TODO: d

        }

        public static void Main(string[] args)
        {
            // Load the config
            var config = ConfigurationManager.GetSection("MatchingEngineConfiguration") as ServiceConfiguration;

            // Allow to debug this service through Visual Studio or run it from
            // a command line.

            MatchingEngine service = new MatchingEngine(config);
            service.OnStart(null);

            while (true)
            {
                Thread.Sleep(50);
            }

            service.Stop();
        }

    }
}
