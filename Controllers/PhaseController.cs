using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace fq540TenK.Controllers
{
    public class PhaseController : Controller
    {
        // GET: Phase
        public ActionResult Index(string projectID, string phaseID)
        {
            ViewBag.projectID = projectID;
            ViewBag.phaseID = phaseID;
            return View();
        }

        public ActionResult Add(string projectID, string phaseID)
        {
            ViewBag.projectID = projectID;
            ViewBag.phaseID = phaseID;
            return View();
        }

        public ActionResult Edit(string projectID, string phaseID)
        {
            ViewBag.projectID = projectID;
            ViewBag.phaseID = phaseID;
            return View();
        }
    }
}