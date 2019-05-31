using System;
using System.Collections.Generic;
using System.Text;

namespace com.solace.demos.trading
{
    class OrderResponse
    {
        public string account;
        public string settlementExch;
        public string instrument;
        public string qty;
        public string price;
        public string side;
        public string orderId;


        public OrderResponse()
        {

        }
        public OrderResponse(OrderRequest request)
        {
            this.account = request.account;
            this.settlementExch = request.settlementExch;
            this.instrument = request.instrument;
            this.qty = request.qty;
            this.price = request.price;
            this.side = request.side;
        }

    }
}
