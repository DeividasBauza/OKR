using System;

namespace okr.back.ApplicationServices.Dto
{
   public interface IValidateDto
    {
        public bool HasInvalidDates();
        public bool KeyResultsLimitReached();
    }
}
