﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;


namespace fq540TenK
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Phase Details",
                url: "project/{projectID}/phase/{phaseID}/{action}",
                defaults: new { controller = "Phase", action = "Details", projectID=" ", phaseID=" "},
                constraints: new { projectID = @"\d+", phaseID = @"\d+" }
            );
            routes.MapRoute(
                name: "Project Details",
                url: "project/{projectID}/{action}",
                defaults: new { controller = "Project", action = "Details", projectID = " "},
                constraints: new { projectID = @"\d+" }
            );
            routes.MapRoute(
                name: "Add Assignment Partial View",
                url: "Assignment/AddAssignmentPartial/{projectId}/{phaseId}",
                defaults: new { controller = "Assignment", action = "AddAssignmentPartial", projectId = " ", phaseId = " "},
                constraints: new { projectId = @"\d+", phaseId = @"\d+" }
            );
            routes.MapRoute(
                name: "Get Assignment By Project Id Partial View",
                url: "Assignment/GetAssignmentsByProjectIdPartial/{projectId}/{phaseId}",
                defaults: new { controller = "Assignment", action = "GetAssignmentsByProjectIdPartial", projectId = " ", phaseId = " " },
                constraints: new { projectId = @"\d+", phaseId = @"\d+" }
            );
            //-- Default Route
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Site Index",
                url: "",
                defaults: new { controller = "Home", action = "Index"}
            );

            routes.MapRoute(
                name: "Catch All",
                url:"{*path}",
                defaults: new { controller = "Home", action = "NotFound" }
            );
        }
    }
}
