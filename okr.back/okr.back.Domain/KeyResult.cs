using System;

namespace okr.back.Domain
{
    public class KeyResult : DomainEntity
    {
        public Guid ObjectiveId { get; set; }

        public Objective Objective { get; set; }

        public string Description { get; set; }

        public string Type { get; set; }

        public int Value { get; set; }

        public int? MaxValue { get; set; }
    }
}