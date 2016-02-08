using System.Collections.Generic;
using System.Web.Mvc;
using fq540TenK.Models;

namespace fq540TenK.Controllers
{
    public class ComponentsController : Controller
    {
        [AllowAnonymous]
        [ChildActionOnly]
        public ActionResult NavProjectDropdownPartial()
        {
            List<Project> projects = APIController.GetAllProjects();
            return PartialView(projects);
        }
    }
}