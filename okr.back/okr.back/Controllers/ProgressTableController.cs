using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using okr.back.ApplicationServices;
using okr.back.ApplicationServices.Dto;


namespace okr.back.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ProgressTableController : ControllerBase
    {
        private readonly ProgressTableService _progressTableService;

        public ProgressTableController(ProgressTableService progressTableService)
        {
            _progressTableService = progressTableService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProgressTableDataByUserId([FromQuery] Guid id)
        {
            var result = await _progressTableService.GetProgressTableDataByUserId(id);
            return result.Valid ? Ok(result) : BadRequest(result);
        }
    }
}