using System.Web.Mvc;
using fq540TenK.Models;

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

    }
}