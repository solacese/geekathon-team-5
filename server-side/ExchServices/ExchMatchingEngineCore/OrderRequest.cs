using System;
using System.Collections.Generic;
using System.Text;

namespace com.solace.demos.trading
{
    class OrderRequest
    {
        public string account;
        public string settlementExch;
        public string instrument;
        public string qty;
        public string price;
        public string side;

    }
}
