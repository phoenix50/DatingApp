
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        protected override void OnModelCreating(ModelBuilder builder) 
        {
            base.OnModelCreating(builder);
            builder.Entity<UserLike>()
                .HasKey(k => new { k.SourceUserId, k.LikedUserId });//�ƦX Primary Key

            builder.Entity<UserLike>()
                .HasOne(k => k.SourceUser)
                .WithMany(k => k.LikedUsers)
                .HasForeignKey(k => k.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>()
                .HasOne(k => k.LikedUser)
                .WithMany(k => k.LikedByUsers)
                .HasForeignKey(k => k.LikedUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}