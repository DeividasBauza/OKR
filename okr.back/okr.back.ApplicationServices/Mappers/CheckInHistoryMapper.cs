using System.Linq;
using okr.back.Domain;
using okr.back.ApplicationServices.Dto;
using System;

namespace okr.back.ApplicationServices.Mappers
{
    public static class CheckInHistoryMapper
    {
        public static CheckInHistory MapCheckInHistoryFromCheckInHistoryDto(CheckInHistoryDto checkInHistoryDto)
        {
            return new CheckInHistory
            {
                ObjectiveId = checkInHistoryDto.ObjectiveId,
                CheckInDate = checkInHistoryDto.CheckInDate,
                Message = checkInHistoryDto.Message,
                ContentObject = new ContentObject()
                {
                    OnTrack = checkInHistoryDto.ContentObject.OnTrack,
                    ProgressChange = checkInHistoryDto.ContentObject.ProgressChange,
                    Values = checkInHistoryDto.ContentObject.Values.Select(keyResultValueDto => new KeyResultValue()
                    {
                        Description = keyResultValueDto.Description,
                        Value = keyResultValueDto.Value,
                        Type = keyResultValueDto.Type
                    }).ToList()
                }
            };
        }

        public static CheckInHistoryDto MapCheckInHistoryDtoFromCheckInHistory(CheckInHistory checkInHistory)
        {
            return new CheckInHistoryDto
            {
                Id = checkInHistory.Id,
                ObjectiveId = checkInHistory.ObjectiveId,
                CheckInDate = checkInHistory.CheckInDate,
                Message = checkInHistory.Message,
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
                }
            };
        }

        public static CheckInHistory MapCheckInHistoryFromCheckInCreateDto(CheckInCreateDto checkInCreateDto)
        {
            return new CheckInHistory
            {
                ObjectiveId = checkInCreateDto.ObjectiveId,
                CheckInDate = DateTime.Now,
                Message = checkInCreateDto.Message,
                ContentObject = new ContentObject()
                {
                    OnTrack = checkInCreateDto.OnTrack,
                    ProgressChange = 0,
                    Values = checkInCreateDto.KeyResultValues.Select(keyResultValueDto => new KeyResultValue()
                    {
                        Description = keyResultValueDto.Description,
                        Value = keyResultValueDto.Value,
                        Type = keyResultValueDto.Type
                    }).ToList()
                }
            };
        }
    }
}
