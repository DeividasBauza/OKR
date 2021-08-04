using System.Collections.Generic;

namespace okr.back.Domain
{
    public class ContentObject
    {
        public bool? OnTrack { get; set; }

        public int ProgressChange { get; set; }

        public List<KeyResultValue> Values { get; set; }
    }

    public class KeyResultValue
    {
        public string Description { get; set; }

        public int Value { get; set; }

        public string Type { get; set; }
    }
}