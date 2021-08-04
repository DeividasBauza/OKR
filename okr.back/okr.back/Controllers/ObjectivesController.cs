using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using okr.back.ApplicationServices;
using okr.back.ApplicationServices.Dto;

namespace okr.back.Controllers
{
    [Authorize]
    [ApiController]
    [ValidateModel]
    [Route("[controller]")]
    public class ObjectivesController : ControllerBase
    {
        private readonly ObjectiveManagementService objectiveManagementService;

        public ObjectivesController(ObjectiveManagementService objectiveManagementService)
        {
            this.objectiveManagementService = objectiveManagementService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var result = await objectiveManagementService.GetObjective(id);
            if (result.Valid)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllByUser([FromQuery] Guid ownerId, [FromQuery] int? year = null, [FromQuery] int? quarter = null)
        {
            var result = await objectiveManagementService.GetAllUserObjectives(ownerId, year, quarter);
            if (result.Valid)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(ObjectiveCreateDto objectiveCreateDto)
        {
            var userId = new Guid(User.FindFirst(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);
            objectiveCreateDto.OwnerId = userId;

            var result = await objectiveManagementService.AddObjective(objectiveCreateDto);
            if (result.Valid)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        
        [HttpPut("{id}/state")]
        public async Task<IActionResult> ChangeState(Guid id, [FromQuery] bool closed)
        {
            var userId = new Guid(User.FindFirst(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);
            var result = await objectiveManagementService.UpdateState(id, userId, closed);

            return result.Valid ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(Guid id, [FromBody]ObjectiveEditDto objectiveEditDto)
        {
            var userId = new Guid(User.FindFirst(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);

            objectiveEditDto.Id = id;
            var result = await objectiveManagementService.EditObjective(userId, objectiveEditDto);

            return result.Valid ? Ok(result) : BadRequest(result);
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = new Guid(User.FindFirst(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);

            var result = await objectiveManagementService.DeleteObjective(userId, id);
            if (result.Valid)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost("{id}/checkin")]
        public async Task<IActionResult> AddCheckIn(Guid id, [FromBody]CheckInCreateDto checkInCreateDto)
        {
            var userId = new Guid(User.FindFirst(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);

            checkInCreateDto.ObjectiveId = id;
            var result = await objectiveManagementService.CreateCheckIn(userId, checkInCreateDto);
            if (result.Valid)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
