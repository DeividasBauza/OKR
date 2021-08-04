using System;

namespace okr.back.Domain
{
    public class CheckInHistory : DomainEntity
    {
        public Guid ObjectiveId { get; set; }

        public Objective Objective { get; set; }

        public DateTime CheckInDate { get;set; }

        public string Message { get; set; }

        public ContentObject ContentObject { get; set; }
    }
}
