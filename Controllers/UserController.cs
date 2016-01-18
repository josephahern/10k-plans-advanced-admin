using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using fq540TenK.Models;

namespace fq540TenK.Controllers
{
    public class UserController : Controller
    {
        [ChildActionOnly]
        public ActionResult AddUserPartial()
        {
            List<User> users = APICalls.GetAllUsers();
            return PartialView(users);
        }
        [ChildActionOnly]
        public ActionResult CurrentlyAssignedPartial(int projectID)
        {
            List<ProjectAssignee> assignees = APICalls.GetCurrentlyAssigned(projectID);
            return PartialView(assignees);
        }
    }
}