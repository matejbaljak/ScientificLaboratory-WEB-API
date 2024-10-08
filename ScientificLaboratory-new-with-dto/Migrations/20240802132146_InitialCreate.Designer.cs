﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ScientificLaboratory_new_with_dto.Data;

#nullable disable

namespace ScientificLaboratory_new_with_dto.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240802132146_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Funding", b =>
                {
                    b.Property<int>("FundingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("FundingId"));

                    b.Property<string>("Source")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SponsorName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("FundingId");

                    b.ToTable("Fundings");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.FundingByYear", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<decimal>("Amount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("FundingId")
                        .HasColumnType("int");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FundingId");

                    b.ToTable("FundingByYears");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.FundingByYear", b =>
                {
                    b.HasOne("ScientificLaboratory_new_with_dto.Models.Funding", "Funding")
                        .WithMany("FundingbyYears")
                        .HasForeignKey("FundingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Funding");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Funding", b =>
                {
                    b.Navigation("FundingbyYears");
                });
#pragma warning restore 612, 618
        }
    }
}
