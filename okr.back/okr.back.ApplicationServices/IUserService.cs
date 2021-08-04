using System;
using Microsoft.Graph;
using System.Threading.Tasks;
using System.Collections.Generic;
using okr.back.ApplicationServices.Dto;

namespace okr.back.ApplicationServices
{
    public interface IUserService
    {
        Task<IEnumerable<AzureUserDto>> GetAllUsers();

        Task<string> GetUserNameById(Guid id);
    }
}
