using System;
using System.Collections.Generic;
using active_directory_sandbox.Models;

namespace active_directory_sandbox.Services
{
    public interface IWeatherService
    {
        public IEnumerable<WeatherForecast> GetAll(Guid authorId);

        public WeatherForecast GetById(Guid id, Guid authorId);
    }
}
