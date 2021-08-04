using System;
using System.Collections.Generic;

namespace okr.back.ApplicationServices.Dto
{
    public class CheckInHistoryDto
    {
        public Guid Id { get; set; }

        public Guid ObjectiveId { get; set; }

        public DateTime CheckInDate { get; set; }

        public string Message { get; set; }

        public ContentObjectDto ContentObject { get; set; }
    }
}
