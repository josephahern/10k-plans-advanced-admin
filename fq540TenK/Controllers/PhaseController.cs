using System.Web.Mvc;
using fq540TenK.Models;
using System;

namespace fq540TenK.Controllers
{
    public class PhaseController : Controller
    {
        // GET: Phase
        public ActionResult Details(int projectId, int phaseId)
        {
            ViewBag.projectID = projectId;
            ViewBag.phaseID = phaseId;
            int assignableId;

            if (phaseId == 0)
            {
                assignableId = projectId;
            }
            else
            {
                assignableId = phaseId;
            }
            
            Project phase = APIController.GetProjectById(assignableId);
            return View(phase);
        }

        public ActionResult AddPhasePartial(int project_id)
        {
            ViewBag.project_id = project_id;
            return PartialView();

        }

        [HttpPost]
        public ActionResult AddPhase(string phase_name, int project_id, DateTime start_time, DateTime end_time)
        {
                APIController.AddPhase(phase_name, project_id, start_time.ToString("yyyy-MM-dd"), end_time.ToString("yyyy-MM-dd"));
                return RedirectToRoute(new
                {
                    controller = "Project",
                    action = "Details",
                    projectID = project_id
                });

        }

    }
}