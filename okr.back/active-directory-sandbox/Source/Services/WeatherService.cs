using System;
using System.Linq;
using System.Collections.Generic;
using active_directory_sandbox.Models;

namespace active_directory_sandbox.Services
{
    public class WeatherService : IWeatherService
    {
	    // Not threadsafe, if modifications are necessary, use different container
        private IEnumerable<WeatherForecast> _forecasts;

        public WeatherService()
        {
            _forecasts = new List<WeatherForecast>
            {
                new WeatherForecast(new Guid("8b4462af-a6d3-4422-a86d-1294bbff09ca"), new Guid("d668cba9-74a0-4cb8-8144-f0d11a6b75b0"), 50, "Freezing"), // user1
                new WeatherForecast(new Guid("2beb6943-a2e5-42ac-bc33-9f07528c832c"), new Guid("d668cba9-74a0-4cb8-8144-f0d11a6b75b0"), 70, "Mild"), // user1
                new WeatherForecast(new Guid("edecf07d-b3d4-4593-a357-fd928907c983"), new Guid("d668cba9-74a0-4cb8-8144-f0d11a6b75b0"), 90, "Balmy"), // user1

                new WeatherForecast(new Guid("a1614f64-5edf-45af-ad53-740af66cf795"), new Guid("2d6e85ab-d013-46c1-a1ec-204c350bd165"), 110, "Bracing"), // user2
                new WeatherForecast(new Guid("5b1328f2-7173-4ac2-821c-048f2e2c66c7"), new Guid("2d6e85ab-d013-46c1-a1ec-204c350bd165"), 130, "Cool"), // user2
                new WeatherForecast(new Guid("5582904c-3bfa-4881-aa79-ee77a5403bea"), new Guid("2d6e85ab-d013-46c1-a1ec-204c350bd165"), 150, "Scorching"), // user2
            };
        }

        public IEnumerable<WeatherForecast> GetAll(Guid authorId)
        {
            var forecasts = _forecasts
                .Where(f => f.Author == authorId);

            return forecasts;
        }

        public WeatherForecast GetById(Guid id, Guid authorId)
        {
            var forecast = _forecasts
                .FirstOrDefault(f => f.Id == id && f.Author == authorId);

            return forecast;
        }
    }
}
