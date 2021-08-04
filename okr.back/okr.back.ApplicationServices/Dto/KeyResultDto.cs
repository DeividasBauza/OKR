using System;
using System.ComponentModel.DataAnnotations;

namespace okr.back.ApplicationServices.Dto
{
    public class KeyResultDto
    {
        public Guid Id { get; set; }

        [Required]
        public Guid ObjectiveId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public int Value { get; set; }

        public int? MaxValue { get; set; }
    }
}