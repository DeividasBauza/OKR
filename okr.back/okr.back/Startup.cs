using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using okr.back.DataAccess;
using okr.back.Infrastructure;
using Microsoft.Identity.Web;
using okr.back.ApplicationServices;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.Graph.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace okr.back
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMicrosoftIdentityWebApiAuthentication(Configuration, "AzureAd");

            services.AddCors(cors =>
            {
                cors.AddPolicy("dev", builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            });

            services.ConfigureApplicationServices();
            services.AddDbContext<ExampleDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("Database"));
            }, ServiceLifetime.Transient);

            services.AddSingleton<IGraphServiceClient>(provider =>
            {
                var confidentialClientApplication = ConfidentialClientApplicationBuilder
                    .Create(Configuration["AzureAd:ClientId"])
                    .WithTenantId(Configuration["AzureAd:TenantId"])
                    .WithClientSecret(Configuration["AccessSecret"])
                    .Build();

                var credentialProvider = new ClientCredentialProvider(confidentialClientApplication);
                return new GraphServiceClient(credentialProvider);
            });

            services.AddSwaggerDocument();

            services.AddSingleton<IUserService, AzureUserService>();
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("dev");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseOpenApi();
            app.UseSwaggerUi3();

            var dbCtx = app.ApplicationServices.CreateScope().ServiceProvider.GetRequiredService<ExampleDbContext>();
            dbCtx.Database.Migrate();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
