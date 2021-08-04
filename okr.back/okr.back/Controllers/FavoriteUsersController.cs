using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using okr.back.ApplicationServices;
using okr.back.ApplicationServices.Dto;
using okr.back.Domain;

namespace okr.back.Controllers
{
    [Authorize]
    [ApiController]
    [ValidateModel]
    [Route("[controller]")]
    public class FavoriteUsersController : ControllerBase
    {
        private readonly FavoriteUsersService _favoriteUsersService;

        public FavoriteUsersController(FavoriteUsersService favoriteUsersService)
        {
            _favoriteUsersService = favoriteUsersService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var result = await _favoriteUsersService.GetFavoriteUsersByOwnerId(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(FavouriteUserRequest favouriteUserRequest)
        {
            var userId = new Guid(User.FindFirst(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);
            favouriteUserRequest.OwnerId = userId.ToString();
            var result = await _favoriteUsersService.AddFavoriteUser(favouriteUserRequest);
            if (result.Valid)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(List<FavouriteUser> favouriteUsers)
        {
            var userId = new Guid(User.FindFirst(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);
            if (!favouriteUsers.TrueForAll(user => user.OwnerId == userId))
            {
                return Forbid("Incorrect owner id");
            }

            var result =
            favouriteUsers.Count == 1
                ? await _favoriteUsersService.RemoveSingle(favouriteUsers[0])
                : await _favoriteUsersService.RemoveMultiple(favouriteUsers);
            if (result.Valid)
            {
                return Ok(result);
            }
        
            return BadRequest(result);
        }
    }
}