using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ScientificLaboratory.Models;
using ScientificLaboratory_new_with_dto.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ScientificLaboratory_new_with_dto.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<News> News { get; set; }

        public DbSet<Funding> Fundings { get; set; }
        public DbSet<FundingByYear> FundingByYears { get; set; }

        public DbSet<Publication> Publications { get; set; }
        public DbSet<Pdf> Pdfs { get; set; }

        public DbSet<Author> Authors { get; set; }
        public DbSet<PublicationAuthor> PublicationAuthors { get; set; }
         

        public DbSet<Project> Projects { get; set; }

        public DbSet<Researcher> Researchers { get; set; }

        public DbSet<ProjectResearcher> ProjectResearchers { get; set; }

        public DbSet<Member> Members { get; set; }






        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Funding>()
                .HasMany(f => f.FundingbyYears)
                .WithOne(fy => fy.Funding)
                .HasForeignKey(fy => fy.FundingId);

            modelBuilder.Entity<Project>()
    .HasOne(p => p.Funding)
    .WithOne(f => f.Project)
    .HasForeignKey<Funding>(f => f.ProjectId);

            modelBuilder.Entity<ProjectResearcher>()
            .HasIndex(pr => new { pr.ProjectId, pr.ResearcherId })
            .IsUnique();

            modelBuilder.Entity<ProjectResearcher>()
                .HasOne(pr => pr.Project)
                .WithMany(p => p.ProjectResearchers)
                .HasForeignKey(pr => pr.ProjectId);

            modelBuilder.Entity<ProjectResearcher>()
                .HasOne(pr => pr.Researcher)
                .WithMany(r => r.ProjectResearchers)
                .HasForeignKey(pr => pr.ResearcherId);

            modelBuilder.Entity<PublicationAuthor>()
              .HasKey(pa => new { pa.PublicationId, pa.AuthorId });

            // Configuring the many-to-many relationship between Publication and Author through PublicationAuthor
            modelBuilder.Entity<PublicationAuthor>()
                .HasOne(pa => pa.Publication)
                .WithMany(p => p.PublicationAuthors)
                .HasForeignKey(pa => pa.PublicationId);

            modelBuilder.Entity<PublicationAuthor>()
                .HasOne(pa => pa.Author)
                .WithMany(a => a.PublicationAuthors)
                .HasForeignKey(pa => pa.AuthorId);

            // Configuring the one-to-one relationship between Publication and Pdf
            modelBuilder.Entity<Publication>()
                .HasOne(p => p.Pdf)
                .WithOne(p => p.Publication)
                .HasForeignKey<Pdf>(p => p.PublicationId);

            // Configuring the Keywords property with a value converter and value comparer
            var stringListComparer = new ValueComparer<List<string>>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            modelBuilder.Entity<Publication>()
                .Property(p => p.Keywords)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList())
                .Metadata.SetValueComparer(stringListComparer);

        }
}
}
