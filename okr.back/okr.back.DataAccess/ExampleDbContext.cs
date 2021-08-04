using okr.back.Domain;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace okr.back.DataAccess
{
    public class ExampleDbContext : DbContext
    {
        public ExampleDbContext(DbContextOptions<ExampleDbContext> options): base(options)
        {
            
        }

        public virtual DbSet<Objective> Objectives { get; set; }

        public virtual DbSet<KeyResult> KeyResults { get; set; }

        public virtual DbSet<CheckInHistory> CheckInHistory { get; set; }

        public virtual DbSet<FavouriteUser> FavouriteUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Objective
            modelBuilder.Entity<Objective>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<Objective>().Property(x => x.OwnerId)
                .IsRequired();

            modelBuilder.Entity<Objective>().Property(x => x.Description)
                .HasMaxLength(150)
                .IsRequired();

            modelBuilder.Entity<Objective>().Property(x => x.CheckInEvery)
                .HasMaxLength(20)
                .IsRequired();

            modelBuilder.Entity<Objective>().Property(x => x.StartDate)
                .IsRequired();

            modelBuilder.Entity<Objective>().Property(x => x.EndDate);

            modelBuilder.Entity<Objective>().Property(x => x.OnTrack);

            modelBuilder.Entity<Objective>().Property(x => x.Progress)
                .IsRequired();


            //Key Result
            modelBuilder.Entity<KeyResult>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<KeyResult>()
                .HasOne<Objective>(k => k.Objective)
                .WithMany(o => o.KeyResults)
                .HasForeignKey(k => k.ObjectiveId)
                .IsRequired();

            modelBuilder.Entity<KeyResult>().Property(x => x.Description)
                .HasMaxLength(150)
                .IsRequired();

            modelBuilder.Entity<KeyResult>().Property(x => x.Type)
                .HasMaxLength(20)
                .IsRequired();

            modelBuilder.Entity<KeyResult>().Property(x => x.Value)
                .IsRequired();

            modelBuilder.Entity<KeyResult>().Property(x => x.MaxValue);


            //Check-in history
            modelBuilder.Entity<CheckInHistory>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<CheckInHistory>()
                .HasOne<Objective>(c => c.Objective)
                .WithMany(o => o.CheckInHistory)
                .HasForeignKey(c => c.ObjectiveId)
                .IsRequired();

            modelBuilder.Entity<CheckInHistory>().Property(x => x.CheckInDate)
                .IsRequired();

            modelBuilder.Entity<CheckInHistory>().Property(x => x.Message)
                .HasMaxLength(300);

            modelBuilder.Entity<CheckInHistory>().Property(x => x.ContentObject)
                .IsRequired()
                .HasConversion(
                    x => JsonConvert.SerializeObject(x, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Include }),
                    x => JsonConvert.DeserializeObject<ContentObject>(x, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Include })); ;

            modelBuilder.Entity<FavouriteUser>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<FavouriteUser>().Property(x => x.OwnerId)
                .HasMaxLength(40)
                .IsRequired();

            modelBuilder.Entity<FavouriteUser>().Property(x => x.FavouriteUserId)
                .HasMaxLength(40)
                .IsRequired();

            modelBuilder.Entity<FavouriteUser>()
                .HasIndex(x => new { x.OwnerId, x.FavouriteUserId }).IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}
