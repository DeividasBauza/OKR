using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using okr.back.DataAccess;

namespace okr.back.Infrastructure
{
    public static class ConfigureDatabase
    {
        public static void AddDatabase(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<ExampleDbContext>(builder => builder.UseSqlServer(connectionString));
        }
    }
}
