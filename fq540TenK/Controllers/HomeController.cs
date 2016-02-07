using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using fq540TenK.Models;

namespace fq540TenK.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            List<Project> projects = APIController.GetAllProjects();
            return View(projects);
        }
    }
}