using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Newtonsoft.Json;
using System.Runtime.InteropServices;

namespace fq540TenK.Models
{
    
    public class ProjectListRoot
    {
        public List<Project> data { get; set; }
    }

    public class Project
    {
        public int id { get; set; }
        public bool archived { get; set; }
        public object archived_at { get; set; }
        public string description { get; set; }
        public string guid { get; set; }
        public string name { get; set; }
        public object parent_id { get; set; }
        public object phase_name { get; set; }
        public string project_code { get; set; }
        public string secureurl { get; set; }
        public string secureurl_expiration { get; set; }
        public int settings { get; set; }
        public int timeentry_lockout { get; set; }
        public string ends_at { get; set; }
        public string starts_at { get; set; }
        public object deleted_at { get; set; }
        public string created_at { get; set; }
        public string updated_at { get; set; }
        public bool use_parent_bill_rates { get; set; }
        public string thumbnail { get; set; }
        public string type { get; set; }
        public bool has_pending_updates { get; set; }
        public string client { get; set; }
        public string project_state { get; set; }
        public ChildListRoot children { get; set; }
    }

    public class ChildListRoot {
        public List<Child> data { get; set; }
        public bool empty
        {
            get  {
                if (data.Count == 0)
                {
                    return true;
                } else
                {
                    return false;
                }
            } 
        }
    }


    public class Child {
        public int id { get; set; }
        public bool archived { get; set; }
        public object archived_at { get; set; }
        public object description { get; set; }
        public string guid { get; set; }
        public string name { get; set; }
        public int parent_id { get; set; }
        public string phase_name { get; set; }
        public object project_code { get; set; }
        public object secureurl { get; set; }
        public object secureurl_expiration { get; set; }
        public int settings { get; set; }
        public int timeentry_lockout { get; set; }
        public string ends_at { get; set; }
        public string starts_at { get; set; }
        public object deleted_at { get; set; }
        public string created_at { get; set; }
        public string updated_at { get; set; }
        public bool use_parent_bill_rates { get; set; }
        public object thumbnail { get; set; }
        public string type { get; set; }
        public bool has_pending_updates { get; set; }
        public string client { get; set; }
        public string project_state { get; set; }
    }

}