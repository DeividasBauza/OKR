using System;
using System.Collections.Generic;

namespace okr.back.ApplicationServices.Dto
{
    public class ObjectiveDto
    {
        public Guid Id { get; set; }

        public Guid OwnerId { get; set; }

        public string Description { get; set; }

        public string CheckInEvery { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool? OnTrack { get; set; }

        public int Progress { get; set; }

        public bool Closed { get; set; }

        public DateTime? LastCheckIn { get; set; }

        public List<KeyResultDto> KeyResults { get; set; }

        public List<CheckInHistoryDto> CheckInHistory { get; set; }
    }
}
