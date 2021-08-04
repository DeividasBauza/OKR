using System;
using okr.back.Abstractions;
using okr.back.ApplicationServices.Dto;
using okr.back.ApplicationServices.Mappers;
using okr.back.DataAccess;
using okr.back.Domain;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace okr.back.ApplicationServices
{
    public class ObjectiveManagementService
    {
        private readonly ObjectiveRepository objectiveRepository;

        public ObjectiveManagementService(ObjectiveRepository objectiveRepository)
        {
            this.objectiveRepository = objectiveRepository;
        }

        public Result<ObjectiveDto> ValidateDto(IValidateDto dto){
            var result = Result<ObjectiveDto>.Create(null);
             if(dto.HasInvalidDates()){
                result.AddError("Invalid dates supplied");
            }
            if(dto.KeyResultsLimitReached()){
                result.AddError("Max 20 key results allowed");
            }
            return result;
        }

        public async Task<Result<ObjectiveDto>> AddObjective(ObjectiveCreateDto objectiveCreateRequest)
        {
            var result = ValidateDto(objectiveCreateRequest);
            if (!result.Valid)
            {
                return result;
            }
            

            var objective = ObjectiveMapper.MapObjectiveFromObjectiveCreateDto(objectiveCreateRequest);
            var id = objectiveRepository.Add(objective);

            ObjectiveDto objectiveDto;
            try
            {
                await objectiveRepository.SaveChanges();
                objective.Id = id;
                objectiveDto = ObjectiveMapper.MapDtoFromObjective(objective);
                objectiveDto.LastCheckIn = null;
            }
            catch (Exception)
            {
                return Result<ObjectiveDto>.CreateErrorResult("Oops! Something went wrong, please refresh the page and try again.");
            }

            return Result<ObjectiveDto>.Create(objectiveDto);
        }

        public async Task<Result<string>> DeleteObjective(Guid userId, Guid id)
        {
            var objective = await objectiveRepository.Get(id);
            if (objective is null)
            {
                return Result<string>.CreateErrorResult($"objective with id {id} not found.");
            }
            else if (objective.OwnerId != userId)
            {
                return Result<string>.CreateErrorResult("You cannot delete this objective.");
            }

            try
            {
               objectiveRepository.Remove(objective);
               await objectiveRepository.SaveChanges();
            }
            catch (Exception)
            {
                return Result<string>.CreateErrorResult("Oops! Something went wrong, please refresh the page and try again.");
            }

            return Result<string>.Create(id.ToString());
        }

        public async Task<Result<string>> UpdateState(Guid id, Guid userId, bool closed)
        {
            try
            {
                var objective = await objectiveRepository.Get(id);

                if (objective == null)
                {
                    return Result<string>.CreateErrorResult("Invalid id");
                }
                else if (objective.OwnerId != userId)
                {
                    return Result<string>.CreateErrorResult("You do not have access to this objective");
                }

                objective.Closed = closed;

                objectiveRepository.EditObjective(objective);
                await objectiveRepository.SaveChanges();

                return Result<string>.Create("Objective's state was updated successfully.");
            }
            catch(Exception)
            {
                return Result<string>.CreateErrorResult("Something went wrong");
            }
        }

        public async Task<Result<ObjectiveDto>> EditObjective(Guid userId, ObjectiveEditDto objectiveEditDto)
        {
            var previousStartDate = DateTime.Now;
            var result = ValidateDto(objectiveEditDto);
            if (!result.Valid)
            {
                return result;
            }

            var objective = await objectiveRepository.Get(objectiveEditDto.Id);
            if (objective is null)
            {
                return Result<ObjectiveDto>.CreateErrorResult($"Objective with id {objectiveEditDto.Id} was not found.");
            }
            else if (objective.OwnerId != userId)
            {
                return Result<ObjectiveDto>.CreateErrorResult("You do not have access to this objective.");
            }

            objective.Description = objectiveEditDto.Description;
            objective.CheckInEvery = objectiveEditDto.CheckInEvery;
            objective.StartDate = objectiveEditDto.StartDate;
            objective.EndDate = objectiveEditDto.EndDate;

            objective.KeyResults.RemoveAll(o => !objectiveEditDto.KeyResults.Any(oer => oer.Id == o.Id));
            foreach (var keyResult in objectiveEditDto.KeyResults)
            {
                var itemToChange = objective.KeyResults.FirstOrDefault(o => o.Id == keyResult.Id);
                if (itemToChange != null)
                {
                    itemToChange.Description = keyResult.Description;
                    itemToChange.Value = (itemToChange.MaxValue != keyResult.MaxValue || itemToChange.Type != keyResult.Type) ? 0 : itemToChange.Value;
                    itemToChange.Type = keyResult.Type;
                    itemToChange.MaxValue = keyResult.MaxValue;
                }
            }
            objective.KeyResults.AddRange(objectiveEditDto.KeyResults.Where(keyResultDto => keyResultDto.Id.Equals(default(Guid))).Select(keyResultDto => new KeyResult() 
            {
                Description = keyResultDto.Description,
                Type = keyResultDto.Type,
                Value = 0,
                MaxValue = keyResultDto.MaxValue
            }).ToList());
            objective.Progress = CountProgress(objective);

            ObjectiveDto objectiveDto;
            try
            {
                objectiveRepository.EditObjective(objective);
                await objectiveRepository.SaveChanges();

                objective.CheckInHistory = null;
                objectiveDto = ObjectiveMapper.MapDtoFromObjective(objective);
                objectiveDto.LastCheckIn = await GetLastCheckIn(objectiveDto.Id);
            }
            catch (Exception)
            {
                return Result<ObjectiveDto>.CreateErrorResult("Failed to edit objective");
            }

            return Result<ObjectiveDto>.Create(objectiveDto);
        }

        private int CountProgress(Objective objective) 
        {
            var keyResultsCount = objective.KeyResults.Count;
            double progress = 0;
            foreach (var keyResult in objective.KeyResults)
            {
                progress += GetKeyResultPercentage(keyResult.Type, keyResult.Value, keyResult.MaxValue.Value);
            }
            progress /= keyResultsCount;

            return Convert.ToInt32(Math.Round(progress));
        }

        public async Task<Result<string>> CreateCheckIn(Guid userId, CheckInCreateDto checkInCreateDto)
        {
            var objective = await objectiveRepository.Get(checkInCreateDto.ObjectiveId);
            if (objective is null)
            {
                return Result<string>.CreateErrorResult($"Objective with id {checkInCreateDto.ObjectiveId} was not found or it doesn't have any key results.");
            }
            else if (objective.OwnerId != userId)
            {
                return Result<string>.CreateErrorResult("You cannot create checkin for this objective.");
            }

            objective.OnTrack = checkInCreateDto.OnTrack;
            foreach (var keyResultValue in checkInCreateDto.KeyResultValues)
            {
                var keyResultToChange = objective.KeyResults.FirstOrDefault(x => x.Id == keyResultValue.Id);
                if (keyResultToChange != null)
                {
                    keyResultToChange.Value = keyResultValue.Value;
                }
            }
            var checkInHistory = CheckInHistoryMapper.MapCheckInHistoryFromCheckInCreateDto(checkInCreateDto);
            checkInHistory.ContentObject.ProgressChange = CountProgress(objective) - objective.Progress;
            objective.Progress = CountProgress(objective);
            



            try
            {
                objectiveRepository.EditObjective(objective);
                objectiveRepository.AddCheckIn(checkInHistory);
                await objectiveRepository.SaveChanges();
            }
            catch (Exception)
            {
                return Result<string>.CreateErrorResult("Failed to create check-in");
            }

            return Result<string>.Create("Check-in was created successfully.");
        }

        public double GetKeyResultPercentage(string type, int value, int maxValue) 
        {
            switch (type)
            {
                case "Numeric":
                    return (double)100 / maxValue * value;
                case "Percentage":
                    return value;
                case "Completion":
                    return value == 1 ? 100 : 0;
                default:
                    return 0;
            }
        }

        public async Task<Result<ObjectiveDto>> GetObjective(Guid id)
        {
            var objective = await objectiveRepository.Get(id);
            if (objective is null)
            {
                return Result<ObjectiveDto>.CreateErrorResult($"Objective with id {id} was not found.");
            }

            return Result<ObjectiveDto>.Create(ObjectiveMapper.MapDtoFromObjective(objective));
        }

        public async Task<Result<List<ObjectiveDto>>> GetAllUserObjectives(Guid ownerId, int? year, int? quarter)
        {
            Result<List<ObjectiveDto>> result;
            if (year != null && quarter != null
                && 1900 <= year.Value && year.Value <= DateTime.Now.AddYears(10).Year
                && quarter.Value <= 4 && quarter.Value >= 1)
            {
                result = await GetObjectivesByYearAndQuarter(ownerId, year.Value, quarter.Value);
            }
            else if (year == null && quarter == null)
            {
                result = await GetObjectives(ownerId);
            }
            else
            {
                result = Result<List<ObjectiveDto>>.CreateErrorResult($"No objectives were found or bad query parameters.");
            }

            return result;
        }

        private async Task<Result<List<ObjectiveDto>>> GetObjectives(Guid ownerId)
        {
            var objectives = await objectiveRepository
                .GetAll(ownerId)
                .Include(x => x.KeyResults)
                .Select(x => ObjectiveMapper.MapDtoFromObjective(x))
                .ToListAsync();

            if (objectives is null || objectives.Count == 0)
            {
                return Result<List<ObjectiveDto>>.Create(new List<ObjectiveDto>());
            }

            await GetLastCheckIn(ownerId, objectives);

            return Result<List<ObjectiveDto>>.Create(objectives);
        }

        private async Task<Result<List<ObjectiveDto>>> GetObjectivesByYearAndQuarter(Guid ownerId, int year, int quarter)
        {
            int quarterStart = quarter * 3 - 2;
            int quarterEnd = quarter * 3;
            DateTime quarterStartDate = new DateTime(year, quarterStart, 1);
            DateTime quarterEndDate = new DateTime(year, quarterEnd, 1).AddMonths(1).AddDays(-1);

            var objectives = await objectiveRepository
                .GetAll(ownerId)
                .Where(x => (x.StartDate <= quarterEndDate && quarterStartDate <= x.EndDate))
                .Include(x => x.KeyResults)
                .Select(x => ObjectiveMapper.MapDtoFromObjective(x))
                .ToListAsync();

            if (objectives is null || objectives.Count == 0)
            {
                return Result<List<ObjectiveDto>>.Create(new List<ObjectiveDto>());
            }

            await GetLastCheckIn(ownerId, objectives);

            return Result<List<ObjectiveDto>>.Create(objectives);
        }
        private async Task<DateTime?> GetLastCheckIn(Guid id)
        {
            var checkInHistory = await objectiveRepository.GetCheckInHistory(id).ToListAsync();
            var lastCheckIn = checkInHistory.OrderByDescending(x => x.CheckInDate).Select(x => x.CheckInDate).FirstOrDefault();
            return lastCheckIn.Equals(default(DateTime)) ? null : lastCheckIn;
        }

        private async Task GetLastCheckIn(Guid ownerId, List<ObjectiveDto> objectives)
        {
            var objectivesWithCheckInHistory = await objectiveRepository
                .GetAll(ownerId)
                .Include(x => x.CheckInHistory)
                .ToListAsync();

            foreach (var objectiveWithCheckInHistory in objectivesWithCheckInHistory)
            {
                var lastCheckIn = objectiveWithCheckInHistory.CheckInHistory.OrderByDescending(x => x.CheckInDate).Select(x => x.CheckInDate).FirstOrDefault();

                var objectiveToChange = objectives.FirstOrDefault(x => x.Id == objectiveWithCheckInHistory.Id);
                if (objectiveToChange != null)
                {
                    objectiveToChange.LastCheckIn = lastCheckIn.Equals(default(DateTime)) ? null : lastCheckIn;
                }
            }
        }
    }
}
