using System;
using System.Collections.Generic;
using System.Text;

namespace com.solace.demos.trading
{
    class Trade
    {
        public string Sec;
        public string Ex;
        public string Qty;
        public string Price;
        public string Chg;

        public Trade()
        {

        }
        public Trade(OrderRequest request)
        {

            this.Ex = request.settlementExch;
            this.Sec = request.instrument;
            this.Qty = request.qty;
            this.Price = request.price;
            this.Chg = "+";
        }

    }
}
