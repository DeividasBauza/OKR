using System;

namespace active_directory_sandbox.Models
{
    public class WeatherForecast
    {
        public Guid Id { get; set; }

        public Guid Author { get; set; }

        public DateTime Date { get; set; }

        public int Temperature { get; set; }

        public string Summary { get; set; }


        public WeatherForecast(Guid id, Guid author, int temperature, string summary)
        {
            Id = id;
            Date = DateTime.Now;
            Author = author;
            Temperature = temperature;
            Summary = summary;
        }
    }
}
