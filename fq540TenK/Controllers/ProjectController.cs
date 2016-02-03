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
        // GET: Project
        public ActionResult Index()
        {
            List<Project> projects = APICalls.GetAllProjects();
            return View(projects);
        }

        public ActionResult Details(int projectID)
        {
            Project project = APICalls.GetProjectById(projectID.ToString());
            return View(project);
        }

        public ActionResult Add(string projectID)
        {
            ViewBag.projectID = projectID;
            return View();
        }

        public ActionResult Edit(string projectID)
        {
            ViewBag.projectID = projectID;
            return View();
        }

        [ChildActionOnly]
        public ActionResult NavbarProjectSelectPartial()
        {
            List<Project> projects = APICalls.GetAllProjects();
            return PartialView(projects);
        }

    }
}