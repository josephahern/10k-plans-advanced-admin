using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Newtonsoft.Json;

namespace fq540TenK.Models
{

    public class UserListRoot
    {
        public Paging paging { get; set; }
        public List<User> data { get; set; }
    }

    public class User
    {
        public int id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public bool archived { get; set; }
        public string display_name { get; set; }
        public string email { get; set; }
        public int user_type_id { get; set; }
        public bool billable { get; set; }
        public string hire_date { get; set; }
        public string termination_date { get; set; }
        public string mobile_phone { get; set; }
        public object office_phone { get; set; }
        public object deleted_at { get; set; }
        public bool deleted { get; set; }
        public bool account_owner { get; set; }
        public bool invitation_pending { get; set; }
        public int user_settings { get; set; }
        public string guid { get; set; }
        public object employee_number { get; set; }
        public double billability_target { get; set; }
        public double billrate { get; set; }
        public string role { get; set; }
        public string discipline { get; set; }
        public string location { get; set; }
        public string created_at { get; set; }
        public bool has_login { get; set; }
        public object archived_at { get; set; }
        public string thumbnail { get; set; }
    }

    public class ProjectAssigneeListRoot
    {
        public List<ProjectAssignee> data { get; set; }
    }

    public class ProjectAssignee
    {
        public int id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public bool archived { get; set; }
        public string display_name { get; set; }
        public string email { get; set; }
        public int user_type_id { get; set; }
        public bool billable { get; set; }
        public object hire_date { get; set; }
        public object termination_date { get; set; }
        public object mobile_phone { get; set; }
        public object office_phone { get; set; }
        public object deleted_at { get; set; }
        public bool deleted { get; set; }
        public bool account_owner { get; set; }
        public bool invitation_pending { get; set; }
        public int user_settings { get; set; }
        public string guid { get; set; }
        public object employee_number { get; set; }
        public double billability_target { get; set; }
        public double billrate { get; set; }
        public string role { get; set; }
        public string discipline { get; set; }
        public object location { get; set; }
        public string created_at { get; set; }
        public bool has_login { get; set; }
        public object archived_at { get; set; }
        public AssignmentListRoot assignments { get; set; }
        public string thumbnail { get; set; }
    }

}