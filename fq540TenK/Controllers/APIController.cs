using System;
using System.Collections.Generic;
using MoreLinq;
using System.Linq;
using RestSharp;
using fq540TenK.Models;

namespace fq540TenK
{
    public class APIController
    {
        #region AUTHENTICATION

        private static string baseUrl = System.Configuration.ConfigurationManager.AppSettings["TenKPlansBaseURL"];
        private static string authToken = System.Configuration.ConfigurationManager.AppSettings["TenKPlansAPIKey"];

        #endregion

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

        public static Project GetProjectById(int projectID)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("projects/"+ projectID.ToString(), Method.GET);
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

        #endregion

        #region ASSIGNMENTS

        public static List<ProjectAssignee> GetAssignmentsByProjectId(int projectID)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("projects/" + projectID.ToString() + "/users", Method.GET);
            request.AddParameter("auth", authToken);
            request.AddParameter("fields", "assignments");
            request.AddParameter("per_page", "200");
            List<ProjectAssignee> assignees = client.Execute<ProjectAssigneeListRoot>(request).Data.data.DistinctBy(x => x.display_name).ToList();
            return assignees;
        }

        public static void AddAssignments(int user_id, int assignable_id, string allocation_mode, string allocation_amount, DateTime start_time, DateTime end_time)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("users/" + user_id.ToString() + "/assignments", Method.POST);
            request.AddParameter("auth", authToken);
            request.AddParameter("assignable_id", assignable_id);
            request.AddParameter("allocation_mode", allocation_mode);
            if (allocation_mode == "fixed") { request.AddParameter("fixed_hours", allocation_amount); }
            else if (allocation_mode == "percent") { request.AddParameter("percent", (decimal.Parse(allocation_amount)/100).ToString()); }
            else { request.AddParameter("hours_per_day", allocation_amount); }
            request.AddParameter("starts_at", start_time.ToString("yyyy-MM-dd"));
            request.AddParameter("ends_at", end_time.ToString("yyyy-MM-dd"));
            client.Execute(request);
        }

        public static void EditAssignments(int user_id, int assignment_id, string allocation_mode, string allocation_amount, DateTime start_time, DateTime end_time)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("users/" + user_id.ToString() + "/assignments/" + assignment_id.ToString(), Method.PUT);
            request.AddParameter("auth", authToken);

            if (!string.IsNullOrEmpty(allocation_mode) && !string.IsNullOrEmpty(allocation_amount))
            {
                request.AddParameter("allocation_mode", allocation_mode);
                if (allocation_mode == "fixed") { request.AddParameter("fixed_hours", allocation_amount); }
                else if (allocation_mode == "percent") { request.AddParameter("percent", (decimal.Parse(allocation_amount) / 100)); }
                else { request.AddParameter("hours_per_day", allocation_amount); }
            }
            if (start_time != null)
            {
                request.AddParameter("starts_at", start_time.ToString("yyyy-MM-dd"));
            }
            if (end_time != null)
            {
                request.AddParameter("ends_at", end_time.ToString("yyyy-MM-dd"));
            }

            client.Execute(request);
        }

        public static void DeleteAssignment (int assignment_id, int user_id)
        {
            var client = new RestClient(baseUrl);
            var request = new RestRequest("users/" + user_id.ToString() + "/assignments/" + assignment_id.ToString(), Method.DELETE);
            request.AddParameter("auth", authToken);
            client.Execute(request);
        }

        #endregion

        #region Google API

        public static ExternalLoginConfirmationViewModel getUserEmail(string auth_token)
        {
            var client = new RestClient("https://www.googleapis.com");
            var request = new RestRequest(Method.GET);
            request.Resource = "plus/v1/people/me?key={key}";
            request.AddParameter("key", auth_token, ParameterType.UrlSegment);
            request.AddHeader("Authorization", "Bearer " + auth_token);
            request.AddHeader("Content-Type", "application/json; charset=utf-8");

            var response = client.Execute(request);
            Console.WriteLine(response.Content);

            ExternalLoginConfirmationViewModel users = new ExternalLoginConfirmationViewModel();

            return users;

        }

        #endregion

    }
}