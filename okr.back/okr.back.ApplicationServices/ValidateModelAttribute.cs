using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using okr.back.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace okr.back.ApplicationServices
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                if (context.ModelState.ErrorCount == 1)
                {
                    context.Result = new BadRequestObjectResult(Result<string>.CreateErrorResult(context.ModelState.Values.First().Errors.First().ErrorMessage));
                }
                else
                {
                    Result<string> result = Result<string>.Create(null);
                    IEnumerable<string> allErrorMessages = context.ModelState.Values.SelectMany(v => v.Errors).Select(v => v.ErrorMessage);
                    foreach (var error in allErrorMessages)
                    {
                        result.AddError(error);
                    }
                    context.Result = new BadRequestObjectResult(result);
                }
            }
        }
    }
}