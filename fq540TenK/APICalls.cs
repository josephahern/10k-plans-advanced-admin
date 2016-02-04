using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using MoreLinq;
using System.Linq;
using System.Net;
using System.Web;
using RestSharp;
using Newtonsoft.Json;
using fq540TenK.Models;


namespace fq540TenK
{
    public class APICalls
    {

        private static string baseUrl = System.Configuration.ConfigurationManager.AppSettings["TenKPlansBaseURL"];
        private static string authToken = System.Configuration.ConfigurationManager.AppSettings["TenKPlansAPIKey"];

        #region PROJECTS
        public static List<Project> GetAllProjects()
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("projects", Method.GET);
            request.AddParameter("auth", authToken);
            request.AddParameter("fields", "children,phase_count");
            request.AddParameter("per_page", "200");
            List<Project> projects = client.Execute<ProjectListRoot>(request).Data.data;
            return projects;
        }

        public static Project GetProjectById(string projectID)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("projects/"+projectID, Method.GET);
            request.AddParameter("auth", authToken);
            request.AddParameter("fields", "children");
            request.AddParameter("per_page", "200");
            Project project = client.Execute<Project>(request).Data;
            return project;
        }

        #endregion

        #region USERS
        public static List<User> GetAllUsers()
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("users", Method.GET);
            request.AddParameter("auth", authToken);
            request.AddParameter("per_page", "200");
            List<User> users = client.Execute<UserListRoot>(request).Data.data.OrderBy(x => x.first_name).ToList();
            return users;
        }

        public static List<ProjectAssignee> GetCurrentlyAssigned(int projectID)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("projects/" + projectID.ToString() + "/users", Method.GET);
            request.AddParameter("auth", authToken);
            request.AddParameter("fields", "assignments");
            request.AddParameter("per_page", "200");
            List<ProjectAssignee> assignees = client.Execute<ProjectAssigneeListRoot>(request).Data.data.DistinctBy(x => x.display_name).ToList();
            return assignees;
        }

        public static void BatchAddUsers(string userId, string projectId, string allocationMode, string allocationAmount, DateTime startTime, DateTime endTime)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("users/" + userId + "/assignments", Method.POST);
            request.AddParameter("auth", authToken);
            request.AddParameter("assignable_id", projectId);
            request.AddParameter("allocation_mode", allocationMode);
            if(allocationMode == "fixed") { request.AddParameter("fixed_hours", allocationAmount);}
            else if(allocationMode == "percent"){ request.AddParameter("percent", allocationAmount);}
            else { request.AddParameter("hours_per_day", allocationAmount); }
            request.AddParameter("starts_at", startTime);
            request.AddParameter("ends_at", endTime);
            client.Execute(request);
        }

        public static void BatchEditUsers(string userId, string assignmentId, string allocationMode, string allocationAmount, DateTime startTime, DateTime endTime)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("users/" + userId + "/assignments/" + assignmentId, Method.PUT);
            request.AddParameter("auth", authToken);
            //request.AddParameter("id", assignmentId);
            //request.AddParameter("user_id", userId);
            request.AddParameter("allocation_mode", allocationMode);
            if (allocationMode == "fixed") { request.AddParameter("fixed_hours", allocationAmount); }
            else if (allocationMode == "percent") { request.AddParameter("percent", allocationAmount); }
            else { request.AddParameter("hours_per_day", allocationAmount); }
            request.AddParameter("starts_at", startTime);
            request.AddParameter("ends_at", endTime);
            client.Execute(request);
        }

        #endregion

    }
}