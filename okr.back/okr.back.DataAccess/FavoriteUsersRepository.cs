using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using okr.back.Domain;

namespace okr.back.DataAccess
{
    public class FavoriteUsersRepository
    {
        private readonly ExampleDbContext _dbContext;

        public FavoriteUsersRepository(ExampleDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task SaveChanges()
        {
            await _dbContext.SaveChangesAsync();
        }
        public void Add(FavouriteUser favouriteUser)
        {
            _dbContext .FavouriteUsers.Add(favouriteUser);
        }
        public void Remove(FavouriteUser favouriteUser)
        {
            _dbContext.FavouriteUsers.Remove(favouriteUser);
        }

        public FavouriteUser GetFavoriteUser(Guid ownerId, Guid id)
        {
            return _dbContext.FavouriteUsers.FirstOrDefault(u => u.OwnerId == ownerId && u.FavouriteUserId == id);
        }

        public async Task<List<Guid>> GetFavoriteUsersByOwnerId(Guid ownerId)
        {
            return await _dbContext.FavouriteUsers.Where(s => s.OwnerId == ownerId).Select(x=>x.FavouriteUserId).ToListAsync();
        }
    }
}
