﻿// <auto-generated />
using System;
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
    [Migration("20240802185204_AddedPublicationPlusOthers")]
    partial class AddedPublicationPlusOthers
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("ScientificLaboratory.Models.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("ProjectLeaderId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.HasIndex("ProjectLeaderId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Author", b =>
                {
                    b.Property<int>("AuthorId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AuthorId"));

                    b.Property<string>("Institution")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("AuthorId");

                    b.ToTable("Authors");
                });

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

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Pdf", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<byte[]>("Content")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("FileName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PublicationId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PublicationId")
                        .IsUnique();

                    b.ToTable("Pdfs");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.ProjectResearcher", b =>
                {
                    b.Property<int>("ProjectId")
                        .HasColumnType("int");

                    b.Property<int>("ResearcherId")
                        .HasColumnType("int");

                    b.HasKey("ProjectId", "ResearcherId");

                    b.HasIndex("ResearcherId");

                    b.ToTable("ProjectResearchers");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Publication", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Abstract")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DOI")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Field")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ISSN")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Pages")
                        .HasColumnType("int");

                    b.Property<int>("PdfId")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Publications");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.PublicationAuthor", b =>
                {
                    b.Property<int>("PublicationId")
                        .HasColumnType("int");

                    b.Property<int>("AuthorId")
                        .HasColumnType("int");

                    b.HasKey("PublicationId", "AuthorId");

                    b.HasIndex("AuthorId");

                    b.ToTable("PublicationAuthors");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Researcher", b =>
                {
                    b.Property<int>("ResearcherId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ResearcherId"));

                    b.Property<string>("Institution")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("ResearcherId");

                    b.ToTable("Researchers");
                });

            modelBuilder.Entity("ScientificLaboratory.Models.Project", b =>
                {
                    b.HasOne("ScientificLaboratory_new_with_dto.Models.Researcher", "ProjectLeader")
                        .WithMany()
                        .HasForeignKey("ProjectLeaderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ProjectLeader");
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

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Pdf", b =>
                {
                    b.HasOne("ScientificLaboratory_new_with_dto.Models.Publication", "Publication")
                        .WithOne("Pdf")
                        .HasForeignKey("ScientificLaboratory_new_with_dto.Models.Pdf", "PublicationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Publication");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.ProjectResearcher", b =>
                {
                    b.HasOne("ScientificLaboratory.Models.Project", "Project")
                        .WithMany("ProjectResearchers")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ScientificLaboratory_new_with_dto.Models.Researcher", "Researcher")
                        .WithMany("ProjectResearchers")
                        .HasForeignKey("ResearcherId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Project");

                    b.Navigation("Researcher");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.PublicationAuthor", b =>
                {
                    b.HasOne("ScientificLaboratory_new_with_dto.Models.Author", "Author")
                        .WithMany("PublicationAuthors")
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScientificLaboratory_new_with_dto.Models.Publication", "Publication")
                        .WithMany("PublicationAuthors")
                        .HasForeignKey("PublicationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Author");

                    b.Navigation("Publication");
                });

            modelBuilder.Entity("ScientificLaboratory.Models.Project", b =>
                {
                    b.Navigation("ProjectResearchers");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Author", b =>
                {
                    b.Navigation("PublicationAuthors");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Funding", b =>
                {
                    b.Navigation("FundingbyYears");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Publication", b =>
                {
                    b.Navigation("Pdf")
                        .IsRequired();

                    b.Navigation("PublicationAuthors");
                });

            modelBuilder.Entity("ScientificLaboratory_new_with_dto.Models.Researcher", b =>
                {
                    b.Navigation("ProjectResearchers");
                });
#pragma warning restore 612, 618
        }
    }
}
