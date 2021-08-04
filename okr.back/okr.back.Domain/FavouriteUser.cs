using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace okr.back.Domain
{
    public class FavouriteUser : DomainEntity
    {
        public FavouriteUser(Guid ownerId, Guid favouriteUserId)
        {
            OwnerId = ownerId;
            FavouriteUserId = favouriteUserId;
        }

        public Guid OwnerId { get; set; }

        public Guid FavouriteUserId { get; set; }
    }
}
