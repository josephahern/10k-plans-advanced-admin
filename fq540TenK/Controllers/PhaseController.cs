using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using fq540TenK.Models;

namespace fq540TenK.Controllers
{
    public class PhaseController : Controller
    {
        // GET: Phase
        public ActionResult Details(int projectID, int phaseID)
        {
            ViewBag.projectID = projectID;
            ViewBag.phaseID = phaseID;
   
            Project phase = APICalls.GetProjectById(phaseID.ToString());
            return View(phase);
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