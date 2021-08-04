using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace okr.back.Domain
{
    public class Objective : DomainEntity
    {
        public Guid OwnerId { get; set; }

        public string Description { get; set; }

        public string CheckInEvery { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool? OnTrack { get; set; }

        public int Progress { get; set; }

        public bool Closed { set; get; }

        //public DateTime? LastCheckInDate { get; set; }

        public virtual List<KeyResult> KeyResults { get; set; }

        public virtual List<CheckInHistory> CheckInHistory { get; set; }
    }
}
