using Microsoft.Extensions.DependencyInjection;
using okr.back.ApplicationServices;
using okr.back.DataAccess;

namespace okr.back.Infrastructure
{
    public static class ConfigureServices
    {
        public static void ConfigureApplicationServices(this IServiceCollection services)
        {
            

            services.AddScoped<ObjectiveRepository>()
                .AddScoped<ObjectiveManagementService>()
                .AddScoped<ProgressTableService>();
                
            services.AddScoped<FavoriteUsersRepository>()
                .AddScoped<FavoriteUsersService>();
            services.AddScoped<ProgressTableService>()
                .AddScoped<AzureUserService>();
            services.AddScoped<CheckinTableService>();
        }
    }
}
