using System;
using System.Net;
using System.Diagnostics;

namespace fq540TenK
{

    public static class RestClient
    {
        public static string makeAPICall(string requestUrl)
        {
            var syncClient = new WebClient();
            var content = syncClient.DownloadString(requestUrl);
            Trace.WriteLine(content.ToString());
            return content;
        }
    }

}
