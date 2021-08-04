using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace okr.back.ApplicationServices.Dto
{
    public class ProgressTableEntry
    {
        public string DisplayName { get; set; }
        public int Objectives { get; set; }
        public decimal Progress { get; set; }
        public DateTime? LastCheckIn { get; set; }

        public ProgressTableEntry(string displayName, int objectives, decimal progress, DateTime? lastCheckIn)
        {
            DisplayName = displayName;
            Objectives = objectives;
            Progress = progress;
            LastCheckIn = lastCheckIn;
        }
    }
}