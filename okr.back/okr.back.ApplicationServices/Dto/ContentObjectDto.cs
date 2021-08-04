using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace okr.back.ApplicationServices.Dto
{
    public class ContentObjectDto
    {
        public bool? OnTrack { get; set; }

        [Required]
        public int ProgressChange { get; set; }

        [Required]
        public List<KeyResultValueDto> Values { get; set; }
    }

    public class KeyResultValueDto
    {
        public bool ShouldSerializeId()
        {
            return false;
        }

        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Value { get; set; }

        [Required]
        public string Type { get; set; }
    }
}