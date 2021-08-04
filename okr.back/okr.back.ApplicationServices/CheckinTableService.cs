using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using okr.back.Abstractions;
using okr.back.ApplicationServices.Dto;
using okr.back.DataAccess;

namespace okr.back.ApplicationServices
{
    public class CheckinTableService
    {
        private readonly FavoriteUsersService _favoriteUsersService;
        private readonly AzureUserService _azureUserService;
        private readonly ObjectiveRepository _objectiveRepository;

        private readonly ObjectiveManagementService _objectiveManagementService;

        public CheckinTableService(
            FavoriteUsersService favoriteUsersService, 
            AzureUserService azureUserService,
            ObjectiveManagementService objectiveManagementService,
            ObjectiveRepository objectiveRepository
        )
        {
            _favoriteUsersService = favoriteUsersService;
            _azureUserService = azureUserService;
            _objectiveManagementService = objectiveManagementService;
            _objectiveRepository = objectiveRepository;
        }

        public int CountObjectiveProgress(List<KeyResultDto> keyResults)
        {
            var keyResultsCount = keyResults.Count;
            double progress = 0;
            foreach (var result in keyResults)
            {
                progress += _objectiveManagementService.GetKeyResultPercentage(result.Type, result.Value, result.MaxValue.Value);
            }
            progress /= keyResultsCount;

            return Convert.ToInt32(Math.Round(progress));
        }

        public async Task<Result<List<CheckinTableEntryDto>>> GetCheckinTableDataByUserId(Guid id)
        {
            var favoriteUserIds = await _favoriteUsersService.GetFavoriteUsersByOwnerId(id);
            var rows = new List<CheckinTableEntryDto>();
            try
            {
                foreach(var userId in favoriteUserIds)
                {
                    var name = await _azureUserService.GetUserNameById(userId);
                    var userObjectives = await _objectiveManagementService.GetAllUserObjectives(userId, null, null);
                    foreach (var objective in userObjectives.Value)
                    {
                        var checkInHistory = _objectiveRepository.GetCheckInHistory(objective.Id).ToList();
                        
                        foreach (var checkin in checkInHistory)
                        {
                            var entry = new CheckinTableEntryDto(
                                name,
                                objective: objective.Description,
                                overall: objective.Progress,
                                change: checkin.ContentObject.ProgressChange,
                                checkInDate: checkin.CheckInDate
                            );
                            rows.Add(entry);
                        }
                    }
                }
                return Result<List<CheckinTableEntryDto>>.Create(rows.OrderByDescending(x=>x.CheckInDate).Take(100).ToList());
            }
            catch
            {
                return Result<List<CheckinTableEntryDto>>.CreateErrorResult("Something wrong has happened");
            }
        }
    }
}