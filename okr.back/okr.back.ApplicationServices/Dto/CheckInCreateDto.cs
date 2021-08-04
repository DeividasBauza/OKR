using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace okr.back.ApplicationServices.Dto
{
    public class CheckInCreateDto
    {
        [Required]
        public Guid ObjectiveId { get; set; }

        public DateTime? CheckInDate { get; set; }

        public bool? OnTrack { get; set; }

        public string Message { get; set; }

        [Required]
        public List<KeyResultValueDto> KeyResultValues { get; set; }
    }
}
