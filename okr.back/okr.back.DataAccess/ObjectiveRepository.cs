using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using okr.back.Domain;

namespace okr.back.DataAccess
{
    public class ObjectiveRepository
    {
        private readonly ExampleDbContext dbContext;

        public ObjectiveRepository(ExampleDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task SaveChanges()
        {
            await this.dbContext.SaveChangesAsync();
        }

        public Guid Add(Objective objective)
        {
            return dbContext.Objectives.Add(objective).Entity.Id;
        }

        public void Remove(Objective objective)
        {
            dbContext.Objectives.Remove(objective);
        }

        public async Task<Objective> Get(Guid id)
        {
            return await dbContext.Objectives.Include(x => x.KeyResults).Include(x => x.CheckInHistory).AsSingleQuery().FirstOrDefaultAsync(x => x.Id == id);
        }
        
        public async Task<List<Objective>> Get(List<Guid> ids)
        {
            return await dbContext.Objectives.Where(x => ids.Contains(x.OwnerId)).ToListAsync();
        }
        
        public IQueryable<CheckInHistory> GetCheckInHistory(Guid objectiveId)
        {
            return dbContext.CheckInHistory.AsQueryable().Where(x => x.ObjectiveId == objectiveId);
        }

        public IQueryable<Objective> GetAll(Guid ownerId)
        {
            return dbContext.Objectives.AsQueryable().Where(x => x.OwnerId == ownerId);
        }

        public void EditObjective(Objective objective)
        {
            dbContext.Objectives.Update(objective);
        }

        public void AddCheckIn(CheckInHistory checkInHistory)
        {
            dbContext.CheckInHistory.Add(checkInHistory);
        }
    }
}
