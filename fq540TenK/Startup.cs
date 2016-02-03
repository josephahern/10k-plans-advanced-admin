using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(fq540TenK.Startup))]
namespace fq540TenK
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
