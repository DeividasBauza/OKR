using okr.back.Domain;
using System;
using System.ComponentModel.DataAnnotations;

namespace okr.back.ApplicationServices.Dto
{
   public class FavouriteUserRequest
    {
        [Required]
        public string OwnerId { get; set; }

        [Required]
        public string FavouriteUserId { get; set; }

        public FavouriteUser MapToFavouriteUser()
        {
            return new FavouriteUser(Guid.Parse(OwnerId), Guid.Parse(FavouriteUserId));
        }
    }
}
