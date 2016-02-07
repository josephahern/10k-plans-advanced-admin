using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using fq540TenK.Models;

namespace fq540TenK.Controllers
{
    public class ProjectController : Controller
    {
        
        public ActionResult Details(int projectId)
        {
            ViewBag.projectId = projectId;
            ViewBag.phaseId = 0;

            Project project = APIController.GetProjectById(projectId);
            return View(project);
        }

    }
}