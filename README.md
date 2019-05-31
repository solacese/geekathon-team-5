# Demo: Multi-Exchange Interoperability for Trading in Indian Equity Markets

## What does this demonstrate?

A trading client connecting to a single PubSub+ Broker to represent their single membership to an exchange (i.e. NSE), yet being able to see trade messages and send orders to all three exchanges (NSE, BSE, MSE).

### Solace PubSub+ features used
- [REST Microgateway](https://docs.solace.com/Features/Microgateway-Concepts/Microgateway-Use-Cases.htm)
- [Request/Reply Messaging](https://docs.solace.com/Messaging-Basics/Core-Concepts-Message-Models.htm#Request-)
- [WebSockets Messaging](https://docs.solace.com/Solace-PubSub-Messaging-APIs/JavaScript-API/Web-Messaging-Concepts/Web-Messaging-Architectures.htm)

**Try the live demo in action here:
http://solace.com**

## Contents

This repository contains:

1. **[website-files](website-files/):** HTML and JavaScript files to run a local version of the website. This will still connect to the Solace PubSub+ broker as hosted at Solace Cloud. 
2. **[server-side](server-side/):** Applications running on the server-side. Such as the simulated Market Data Feedhandler. 

## Checking out

To check out the project, clone this GitHub repository:

```
git clone https://github.com/solacese/geekathon-team-5
cd geekathon-team-5
```

## Running the Demo

To run the demo open the below html file in your default browser:

```
start ./website-files/index.html
```

## Monitoring

The current solution is using RTView Solace Monitor Server. It can be downloaded with a detailed configuration guide from the following SL company link:

Download link: https://sl.com/free-rtviewtrial-solace-monitor/

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

See the list of [contributors](https://github.com/solacese/geekathon-team-5/graphs/contributors) who participated in this project.

## License

This project is licensed under the Apache License, Version 2.0. - See the [LICENSE](LICENSE) file for details.

## Resources

For more information try these resources:

- The Solace Developer Portal website at: http://dev.solace.com
- Get a better understanding of [Solace technology](http://dev.solace.com/tech/).
- Check out the [Solace blog](http://dev.solace.com/blog/) for other interesting discussions around Solace technology
- Ask the [Solace community.](http://dev.solace.com/community/)
