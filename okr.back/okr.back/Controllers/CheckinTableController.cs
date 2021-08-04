using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using okr.back.ApplicationServices;
using okr.back.ApplicationServices.Dto;



namespace okr.back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CheckinTableController : ControllerBase
    {
        private readonly CheckinTableService _checkinTableService;

        public CheckinTableController(CheckinTableService checkinTableService)
        {
            _checkinTableService = checkinTableService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCheckinTableDataByUserId([FromQuery] Guid id)
        {
            var result = await _checkinTableService.GetCheckinTableDataByUserId(id);
            return result.Valid ? Ok(result) : BadRequest(result);
        }
    }
}