using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using Newtonsoft.Json;
using fq540TenK.Models;


namespace fq540TenK
{
    public class APICalls
    {
        private const string baseUrl = "https://api.10000ft.com/api/v1/{0}?&auth=THRlZkczYXQza3QvMTJXdVl5R3JpUUZ1R1I2U3llNlk1WCtOZ1l0TGhCMDhycC9BMUpNV3IxS3M5V0VQCjFPS2d6cTh0Y3Vpd2ZYb0lXNmZiN2FYQkJvNzU5N215L1pYUlQ4eUNRanNmaHo2cXVwanZOVTc2dFRnaApzdWs3Q3Uvdgo=&{1}";

        #region PROJECTS
        public static List<Project> GetAllProjects()
        {
            string requestUrl = string.Format(baseUrl, "projects", "&per_page=200");
            var resultString = RestClient.makeAPICall(requestUrl);
            var resultObject = JsonConvert.DeserializeObject<ProjectListRoot>(resultString);

            List<Project> projects = new List<Project>(resultObject.data);
            return projects;
        }

        public static Project GetProjectById(string projectID) {

            string requestUrl = string.Format(baseUrl, "projects/" + projectID, "&fields=children");
            var resultString = RestClient.makeAPICall(requestUrl);
            Project project = JsonConvert.DeserializeObject<Project>(resultString);
            return project;
        }

        #endregion

        #region USERS
        public static List<User> GetAllUsers()
        {
            string requestUrl = string.Format(baseUrl, "users", "&per_page=200");
            var resultString = RestClient.makeAPICall(requestUrl);
            var resultObject = JsonConvert.DeserializeObject<UserListRoot>(resultString);

            List<User> users = new List<User>(resultObject.data).OrderBy(x => x.first_name).ToList();
            return users;
        }

        public static List<ProjectAssignee> GetCurrentlyAssigned(int projectId)
        {
            string requestUrl = string.Format(baseUrl, "projects/" + projectId.ToString() + "/users", "&per_page=200");
            var resultString = RestClient.makeAPICall(requestUrl);
            var resultObject = JsonConvert.DeserializeObject<ProjectAssigneeListRoot>(resultString);
            List<ProjectAssignee> assignees = new List<ProjectAssignee>(resultObject.data);
            return assignees;
        }

        #endregion

    }
}