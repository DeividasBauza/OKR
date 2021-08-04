using System;
using okr.back.Abstractions;
using okr.back.ApplicationServices.Dto;
using okr.back.DataAccess;
using okr.back.Domain;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace okr.back.ApplicationServices
{
    public class FavoriteUsersService
    {
        private readonly FavoriteUsersRepository _favoriteUsersRepository;
        private readonly AzureUserService _userService;

        public FavoriteUsersService(FavoriteUsersRepository favoriteUsersRepository, AzureUserService userService)
        {
            _favoriteUsersRepository = favoriteUsersRepository;
            _userService = userService;
        }

        public async Task<List<Guid>> GetFavoriteUsersByOwnerId(Guid ownerId)
        {
            return await _favoriteUsersRepository.GetFavoriteUsersByOwnerId(ownerId);
        }
        public async Task<string> getIdsErrors(FavouriteUser favouriteUser)
        { 
            if (favouriteUser.OwnerId.Equals(favouriteUser.FavouriteUserId))
            {
                return "Adding yourself to favorites is not permitted";
            }
            var exists = await _userService.userExistsById(favouriteUser.FavouriteUserId);
            if (!exists)
            {
                return "User with this ID doesn't exist";
            }
            return "";
        }

        public async Task<Result<string>> AddFavoriteUser(FavouriteUserRequest favouriteUserRequest)
        {
            FavouriteUser favouriteUser;
            try
            {
               favouriteUser = favouriteUserRequest.MapToFavouriteUser();
            }
            catch (Exception)
            {
                return Result<string>.CreateErrorResult("Some value provided can't be parsed to GUID");
            }

            string error = await getIdsErrors(favouriteUser);
            if (!String.IsNullOrEmpty(error))
            {
                return Result<string>.CreateErrorResult(error);
            };
            var existingFavoriteUser =
                _favoriteUsersRepository.GetFavoriteUser(favouriteUser.OwnerId, favouriteUser.FavouriteUserId);
            if (existingFavoriteUser != null)
            {
                return Result<string>.CreateErrorResult("User is already in your favorites!");
            }
            _favoriteUsersRepository.Add(favouriteUser);
            try
            {
                await _favoriteUsersRepository.SaveChanges();
            }
            catch (Exception e)
            {
                return Result<string>.CreateErrorResult(e.Message);
            }

            return Result<string>.Create($"user was successfully added to favorites");
        }

        public async Task<Result<string>> RemoveSingle(FavouriteUser favouriteUser)
        {
            var user = _favoriteUsersRepository.GetFavoriteUser(favouriteUser.OwnerId, favouriteUser.FavouriteUserId);
            if (user == null)
            {
                return Result<string>.CreateErrorResult("User is not in your favorites list!");
            }

            _favoriteUsersRepository.Remove(user);
            try
            {
                await _favoriteUsersRepository.SaveChanges();
            }
            catch (Exception e)
            {
                return Result<string>.CreateErrorResult(e.Message);
            }

            return Result<string>.Create($"user was successfully removed from favorites");
        }

        public async Task<Result<string>> RemoveMultiple(List<FavouriteUser> favouriteUsers)
        {
            List<FavouriteUser> existingFavoriteUsers = favouriteUsers.Select(
                user => _favoriteUsersRepository.GetFavoriteUser(user.OwnerId, user.FavouriteUserId)).ToList();
            if (existingFavoriteUsers.Contains(null))
            {
                return Result<string>.CreateErrorResult("Incorrect list of users supplied, some are not your favorites");
            }
            foreach (var favouriteUser in existingFavoriteUsers)
            {
                var user = _favoriteUsersRepository.GetFavoriteUser(favouriteUser.OwnerId, favouriteUser.FavouriteUserId);
                _favoriteUsersRepository.Remove(user);
            }
            try
            {
                await _favoriteUsersRepository.SaveChanges();
            }
            catch (Exception e)
            {
                return Result<string>.CreateErrorResult(
                    "Oops! Something went wrong, please refresh the page and try again.");
            }
            return Result<string>.Create("Users were removed from favorites");
        }
    }
}