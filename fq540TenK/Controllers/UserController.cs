using System;
using System.Collections.Generic;
using System.Linq;
using MoreLinq;
using System.Web;
using System.Web.Mvc;
using fq540TenK.Models;
using fq540TenK.ActionFilters;

namespace fq540TenK.Controllers
{
    public class UserController : Controller
    {
        public ActionResult AddUserPartial(int projectID)
        {
            List<User> users = APICalls.GetAllUsers();
            ViewBag.parentID = projectID;
            return PartialView(users);
        }
        public ActionResult CurrentlyAssignedPartial(int projectID)
        {
            List<ProjectAssignee> assignees = APICalls.GetCurrentlyAssigned(projectID);
            ViewBag.parentID = projectID;
            return PartialView(assignees);
        }
        [AjaxOnly]
        [HttpPost]
        public JsonResult AddUsersToProject(AddUsersModel data)
        {
            foreach (var user in data.users)
            {
                APICalls.BatchAddUsers(user, data.project_id, data.allocation_mode, data.allocation_amount, data.start_time, data.end_time);
            }
            return Json(new { response = 0 });
        }
        [AjaxOnly]
        [HttpPost]
        public JsonResult EditUsersOnProject(EditAssignmentModel data)
        {
            for(int i=0; i < data.assignments.Count; i++)
            {
                APICalls.BatchEditUsers(data.users[i], data.assignments[i], data.allocation_mode, data.allocation_amount, data.start_time, data.end_time);
            }       
            return Json(new { response = 0 });
        }
    }
}