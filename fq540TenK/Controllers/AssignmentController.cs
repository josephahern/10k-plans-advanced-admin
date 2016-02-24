using System.Collections.Generic;
using System.Web.Mvc;
using fq540TenK.Models;
using Newtonsoft.Json;
using fq540TenK.ActionFilters;

namespace fq540TenK.Controllers
{
    public class AssignmentController : Controller
    {

        [HttpPost]
        public ActionResult Add(AddAssignmentForm data)
        {
            int assignable_id;

            if (data.phase_id == 0)
            {
                assignable_id = data.project_id;
            } else
            {
                assignable_id = data.phase_id;
            }
            
            string[] users = data.users.Split(',');
            for(int x = 0; x < users.Length; x++)
            {
                var timeToStart = data.start_time.ToString("yyyy-MM-dd");
                var timeToEnd = data.end_time.ToString("yyyy-MM-dd");
                APIController.AddAssignments(int.Parse(users[x]), assignable_id, data.allocation_mode, data.allocation_amount, data.start_time, data.end_time);
            }
            
            if(data.phase_id == 0)
            {
                return RedirectToRoute(new
                {
                    controller = "Project",
                    action = "Details",
                    projectID = data.project_id
                });
            } else
            {
                return RedirectToRoute(new
                {
                    controller = "Phase",
                    action = "Details",
                    projectID = data.project_id,
                    phaseID = data.phase_id
                });
            }
            
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

            if (data.phase_id == 0)
            {
                return RedirectToRoute(new
                {
                    controller = "Project",
                    action = "Details",
                    projectID = data.project_id
                });
            }
            else
            {
                return RedirectToRoute(new
                {
                    controller = "Phase",
                    action = "Details",
                    projectID = data.project_id,
                    phaseID = data.phase_id
                });
            }

        }

        [HttpPost]
        public ActionResult InPageEdit(InPageEditForm data)
        {
            foreach (var assignment in data.assignments)
            {
                APIController.EditAssignmentsInPage(assignment.user_id, assignment.assignment_id, assignment.allocation_mode, assignment.allocation_amount, assignment.start_time, assignment.end_time);
            }

            return Json(new { success = true });

        }

        [HttpGet]
        public ActionResult AddAssignmentPartial(int projectId, int phaseId = 0)
        {
            List<User> users = APIController.GetAllUsers();
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
            return PartialView(users);
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

        public ActionResult DeleteAssignment(DeleteAssignmentForm data) {

            APIController.DeleteAssignment(data.assignment_id, data.user_id);

            if (data.phase_id == 0)
            {
                return RedirectToRoute(new
                {
                    controller = "Project",
                    action = "Details",
                    projectID = data.project_id
                });
            }
            else
            {
                return RedirectToRoute(new
                {
                    controller = "Phase",
                    action = "Details",
                    projectID = data.project_id,
                    phaseID = data.phase_id
                });
            }
        }

    }
}