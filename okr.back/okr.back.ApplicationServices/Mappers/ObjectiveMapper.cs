using okr.back.ApplicationServices.Dto;
using okr.back.Domain;
using System.Linq;

namespace okr.back.ApplicationServices.Mappers
{
    public static class ObjectiveMapper
    {
        public static Objective MapObjectiveFromDto(ObjectiveDto objectiveDto)
        {
            return new Objective
            {
                OwnerId = objectiveDto.OwnerId,
                Description = objectiveDto.Description,
                CheckInEvery = objectiveDto.CheckInEvery,
                StartDate = objectiveDto.StartDate,
                EndDate = objectiveDto.EndDate,
                OnTrack = objectiveDto.OnTrack,
                Progress = objectiveDto.Progress,
                Closed = objectiveDto.Closed,
                KeyResults = objectiveDto.KeyResults.Select(keyResultDto => new KeyResult(){
                    Description = keyResultDto.Description,
                    Type = keyResultDto.Type,
                    Value = keyResultDto.Value,
                    MaxValue = keyResultDto.MaxValue
                }).ToList(),
                CheckInHistory = objectiveDto.CheckInHistory?.Select(checkInHistoryDto => new CheckInHistory() {
                    CheckInDate = checkInHistoryDto.CheckInDate,
                    ContentObject = new ContentObject() { 
                        OnTrack = checkInHistoryDto.ContentObject.OnTrack,
                        ProgressChange = checkInHistoryDto.ContentObject.ProgressChange,
                        Values = checkInHistoryDto.ContentObject.Values.Select(keyResultValueDto => new KeyResultValue() {
                            Description = keyResultValueDto.Description,
                            Value = keyResultValueDto.Value
                        }).ToList()
                    },
                    Message = checkInHistoryDto.Message
                }).ToList()
            };
        }

        public static ObjectiveDto MapDtoFromObjective(Objective objective)
        {

            return new ObjectiveDto
            {
                Id = objective.Id,
                OwnerId = objective.OwnerId,
                Description = objective.Description,
                CheckInEvery = objective.CheckInEvery,
                StartDate = objective.StartDate,
                EndDate = objective.EndDate,
                OnTrack = objective.OnTrack,
                Progress = objective.Progress,
                Closed = objective.Closed,
                KeyResults = objective.KeyResults.Select(keyResult => new KeyResultDto()
                {
                    Id = keyResult.Id,
                    ObjectiveId = keyResult.ObjectiveId,
                    Description = keyResult.Description,
                    Type = keyResult.Type,
                    Value = keyResult.Value,
                    MaxValue = keyResult.MaxValue
                }).ToList(),
                CheckInHistory = objective.CheckInHistory?.Select(checkInHistory => new CheckInHistoryDto()
                {
                    Id = checkInHistory.Id,
                    ObjectiveId = checkInHistory.ObjectiveId,
                    CheckInDate = checkInHistory.CheckInDate,
                    ContentObject = new ContentObjectDto()
                    {
                        OnTrack = checkInHistory.ContentObject.OnTrack,
                        ProgressChange = checkInHistory.ContentObject.ProgressChange,
                        Values = checkInHistory.ContentObject.Values.Select(keyResultValue => new KeyResultValueDto()
                        {
                            Description = keyResultValue.Description,
                            Value = keyResultValue.Value,
                            Type = keyResultValue.Type
                        }).ToList()
                    },
                    Message = checkInHistory.Message
                }).ToList()
            };
        }

        public static Objective MapObjectiveFromObjectiveCreateDto(ObjectiveCreateDto objectiveCreateDto)
        {
            return new Objective
            {
                OwnerId = objectiveCreateDto.OwnerId,
                Description = objectiveCreateDto.Description,
                CheckInEvery = objectiveCreateDto.CheckInEvery,
                StartDate = objectiveCreateDto.StartDate,
                EndDate = objectiveCreateDto.EndDate,
                Progress = 0,
                Closed = false,
                KeyResults = objectiveCreateDto.KeyResults.Select(keyResultDto => new KeyResult()
                {
                    Description = keyResultDto.Description,
                    Type = keyResultDto.Type,
                    Value = 0,
                    MaxValue = keyResultDto.MaxValue
                }).ToList()
            };
        }
    }
}
