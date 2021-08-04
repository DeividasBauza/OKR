using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace okr.back.ApplicationServices.Dto
{
    public class ObjectiveCreateDto : IValidateDto
    {
        public Guid OwnerId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string CheckInEvery { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int Progress { get; set; }

        public bool Closed { get; set; }

        [Required]
        public List<KeyResultDto> KeyResults { get; set; }

        public bool KeyResultsLimitReached()
        {
            return KeyResults.Count > 20;
        }

        public bool HasInvalidDates()
        {
            if (EndDate == null)
            {
                return StartDate.Date < DateTime.Now.Date;
            }
            return
                StartDate > EndDate ||
                StartDate.Date < DateTime.Now.Date;
        }
    }
}
