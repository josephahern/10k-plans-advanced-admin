using System.Web;
using System.Web.Optimization;

namespace fq540TenK
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                      "~/includes/js/bootstrap.min.js",
                      "~/includes/js/bootstrap-datepicker.min.js",
                      "~/includes/js/jquery.hideseek.min.js",
                      "~/includes/js/scripts.js"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                      "~/includes/css/bootstrap.min.css",
                      "~/includes/css/bootstrap-datepicker.min.css",
                      "~/includes/css/style.css"));
        }
    }
}
