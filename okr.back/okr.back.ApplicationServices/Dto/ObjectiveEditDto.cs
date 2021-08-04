using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace okr.back.ApplicationServices.Dto
{
    public class ObjectiveEditDto : IValidateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string CheckInEvery { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        public List<KeyResultDto> KeyResults { get; set; }

        public bool KeyResultsLimitReached(){
            return KeyResults.Count > 20;
        }
        public bool HasInvalidDates()
        {
           return EndDate == null ? StartDate.Date < DateTime.Now.Date : StartDate > EndDate;      
        }
    }
}
