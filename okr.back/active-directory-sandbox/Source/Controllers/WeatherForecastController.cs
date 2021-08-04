using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using active_directory_sandbox.Services;
using System.Security.Claims;

namespace active_directory_sandbox.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IWeatherService _weatherService;

        public WeatherForecastController(IWeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            var userId = new Guid(User.Claims.First(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);
            var forecasts = _weatherService.GetAll(userId);

            return Ok(forecasts);
        }

        [HttpGet("{id}")]
        public ActionResult GetById(Guid id)
        {
            var userId = new Guid(User.Claims.First(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);
            var forecast = _weatherService.GetById(id, userId);

            if (forecast != null)
            {
                return Ok(forecast);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
