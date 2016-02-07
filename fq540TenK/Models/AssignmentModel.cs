using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Newtonsoft.Json;
using System.Runtime.InteropServices;

namespace fq540TenK.Models
{
    public class AssignmentListRoot
    {
        public List<Assignment> data { get; set; }
        public bool empty
        {
            get
            {
                if (data.Count == 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

    }

    public class Assignment
    {
        public int id { get; set; }
        public string allocation_mode { get; set; }
        public double hours_per_day { get; set; }
        public int user_id { get; set; }
        public int assignable_id { get; set; }
        public DateTime ends_at { get; set; }
        public DateTime starts_at { get; set; }
        public double bill_rate { get; set; }
        public int bill_rate_id { get; set; }
        public object repetition_id { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public bool all_day_assignment { get; set; }
        public double? fixed_hours { get; set; }
        public double? percent { get; set; }
    }

    public class AddAssignmentForm
    {
        public string users { get; set; }
        public int project_id { get; set; }
        public int phase_id { get; set; }
        public int assignable_id { get; set; }
        public string allocation_mode { get; set; }
        public string allocation_amount { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
    }

    public class EditAssignmentForm
    {
        public string users { get; set; }
        public string assignments { get; set; }
        public int project_id { get; set; }
        public int phase_id { get; set; }
        public string allocation_mode { get; set; }
        public string allocation_amount { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
    }

}