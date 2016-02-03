using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace fq540TenK.Models
{
    public class Paging
    {
        public int per_page { get; set; }
        public int page { get; set; }
        public object previous { get; set; }
        public string self { get; set; }
        public string next { get; set; }
    }
}

