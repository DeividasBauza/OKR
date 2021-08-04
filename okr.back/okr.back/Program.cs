using System;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace okr.back
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                    .ConfigureAppConfiguration((context, config) =>
                    {
                        var builtConfiguration = config.Build();
                        var env = context.HostingEnvironment;

                        if (env.IsDevelopment()) {
                            config.AddJsonFile("appsettings.json").AddJsonFile($"appsettings.{env.EnvironmentName}.json");
                            config.AddEnvironmentVariables();
                        }
                        if (!env.IsDevelopment())
                        {
                            string kvURL = builtConfiguration["KeyVaultConfig:KVUrl"];
                            string tenantId = builtConfiguration["KeyVaultConfig:TenantId"];
                            string clientId = builtConfiguration["KeyVaultConfig:clientId"];
                            string clientSecrets = builtConfiguration["KeyVaultConfig:ClientSecretId"];

                            var credential = new ClientSecretCredential(tenantId, clientId, clientSecrets);

                            var client = new SecretClient(new Uri(kvURL), credential);
                            config.AddAzureKeyVault(client, new AzureKeyVaultConfigurationOptions());
                        }
                    })
                   .UseStartup<Startup>();
                });
    }
}
