using System;
using Microsoft.Graph;
using System.Threading.Tasks;
using System.Collections.Generic;
using okr.back.ApplicationServices.Dto;
using System.Linq;

namespace okr.back.ApplicationServices
{
    public class AzureUserService : IUserService
    {
        private readonly IGraphServiceClient _client;


        public AzureUserService(IGraphServiceClient client)
        {
            _client = client;
        }

        public async Task<IEnumerable<AzureUserDto>> GetAllUsers()
        {
            var users = await _client.Users
                .Request()
                .Select("id, displayName")
                .GetAsync();

            var azureUsers = users.CurrentPage.Select(x => new AzureUserDto() { Id = new Guid(x.Id), DisplayName = x.DisplayName });

            return azureUsers;
        }
        public async Task<bool> userExistsById(Guid id)
        {
            try
            {
                var user = await _client.Users[id.ToString()].Request().Select("displayName").GetAsync();
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public async Task<string> GetUserNameById(Guid id)
        {
            var user = await _client.Users[id.ToString()].Request().Select("displayName").GetAsync();
            return user.DisplayName;
        }
    }
}