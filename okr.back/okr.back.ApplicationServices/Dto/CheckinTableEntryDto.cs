using System;

namespace okr.back.ApplicationServices.Dto
{
    public class CheckinTableEntryDto
    {
        public string Name { get; set; }

        public string Objective { get; set; }

        public decimal Overall { get; set; }

        public decimal Change { get; set; }

        public DateTime CheckInDate { get; set; }

        public CheckinTableEntryDto(string name, string objective, decimal overall, decimal change, DateTime checkInDate)
        {
            Name = name;
            Objective = objective;
            Overall = overall;
            Change = change;
            CheckInDate = checkInDate;
        }
    }
}