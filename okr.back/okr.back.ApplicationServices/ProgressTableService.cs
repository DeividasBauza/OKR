using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using okr.back.Abstractions;
using okr.back.ApplicationServices.Dto;

namespace okr.back.ApplicationServices
{
    public class ProgressTableService
    {
        private readonly ObjectiveManagementService _objectiveManagementService;
        private readonly IUserService _userService;

        private readonly FavoriteUsersService _favoriteUsersService;

        public ProgressTableService(
            ObjectiveManagementService objectiveManagementService,
            IUserService userService,
            FavoriteUsersService favoriteUsersService
        )
        {
            _objectiveManagementService = objectiveManagementService;
            _userService = userService;
            _favoriteUsersService = favoriteUsersService;
        }

        private decimal CalculateProgress(List<ObjectiveDto> objectives)
        {
            decimal progress = 0;
            foreach (var objective in objectives)
            {
                progress += objective.Progress;
            }
            return objectives.Any() 
                ? decimal.Round(progress / objectives.Count(), 2, MidpointRounding.AwayFromZero)
                : 0;
        }

        private DateTime? GetLastCheckInDate(List<ObjectiveDto> objectives)
        {
            DateTime? maxDate = new DateTime();
            foreach (var objective in objectives)
            {
                maxDate = (objective.LastCheckIn > maxDate ? objective.LastCheckIn : maxDate) ?? maxDate;
            }
            if (maxDate == new DateTime())
            {
                return null;
            }
            return maxDate;
        }
        
        public async Task<Result<List<ProgressTableEntry>>> GetProgressTableDataByUserId(Guid id)
        {
            var favoriteUserIds = await _favoriteUsersService.GetFavoriteUsersByOwnerId(id);
            var rows = new List<ProgressTableEntry>();
            try
            {
                foreach(var userId in favoriteUserIds)
                {
                    var displayName = await _userService.GetUserNameById(userId);
                    var userObjectives = await _objectiveManagementService.GetAllUserObjectives(userId, null, null);
                    var objectives = userObjectives.Value.Count;

                    var entry = new ProgressTableEntry(
                        displayName, 
                        objectives, 
                        CalculateProgress(userObjectives.Value),
                        GetLastCheckInDate(userObjectives.Value)
                    );
                    rows.Add(entry);
                }
                return Result<List<ProgressTableEntry>>.Create(rows);
            }
            catch
            {
                return Result<List<ProgressTableEntry>>.CreateErrorResult("Something wrong has happened");
            }
        }
    }
}