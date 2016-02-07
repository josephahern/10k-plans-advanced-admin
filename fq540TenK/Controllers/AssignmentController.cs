using System.Collections.Generic;
using System.Web.Mvc;
using fq540TenK.Models;

namespace fq540TenK.Controllers
{
    public class AssignmentController : Controller
    {

        [HttpPost]
        public ActionResult Add(AddAssignmentForm data)
        {
            string[] users = data.users.Split(',');
            for(int x = 0; x < users.Length; x++)
            {
                APIController.AddAssignments(int.Parse(users[x]), data.assignable_id, data.allocation_mode, data.allocation_amount, data.start_time, data.end_time);
            }

            return Redirect("Home/Success");
        }

        [HttpPost]
        public ActionResult Edit(EditAssignmentForm data)
        {
            string[] users = data.users.Split(',');
            string[] assignments = data.assignments.Split(',');
            for(int x = 0; x < assignments.Length; x++)
            {
                APIController.EditAssignments(int.Parse(users[x]), int.Parse(assignments[x]), data.allocation_mode, data.allocation_amount, data.start_time, data.end_time);
            }
            return Redirect("Home/Success");
        }

        [ChildActionOnly]
        public ActionResult AddAssignmentPartial(int projectId, int phaseId = 0)
        {
            List<User> users = APIController.GetAllUsers();
            ViewBag.projectId = projectId;
            ViewBag.phaseId = phaseId;
            return PartialView(users);
        }

        [ChildActionOnly]
        public ActionResult AddAssignmentFormModalPartial(int projectId, int phaseId = 0)
        {
            ViewBag.projectId = projectId;
            ViewBag.phaseId = phaseId;
            if (phaseId == 0)
            {
                ViewBag.assignableId = projectId;
            }
            else
            {
                ViewBag.assignableId = phaseId;
            }
            return PartialView();
        }

        public ActionResult GetAssignmentsByProjectIdPartial(int projectId, int phaseId = 0)
        {
            int assignableId;

            if (phaseId == 0)
            {
                assignableId = projectId;
            }
            else
            {
                assignableId = phaseId;
            }
            List<ProjectAssignee> assignees = APIController.GetAssignmentsByProjectId(assignableId);
            ViewBag.projectId = projectId;
            ViewBag.phaseId = phaseId;
            ViewBag.assignableId = assignableId;
            return PartialView(assignees);
        }

        public ActionResult GetAssignmentsFormModalPartial(int projectId, int phaseId = 0)
        {
            ViewBag.projectId = projectId;
            ViewBag.phaseId = phaseId;
            if (phaseId == 0)
            {
                ViewBag.assignableId = projectId;
            }
            else
            {
                ViewBag.assignableId = phaseId;
            }
            return PartialView();
        }

    }
}