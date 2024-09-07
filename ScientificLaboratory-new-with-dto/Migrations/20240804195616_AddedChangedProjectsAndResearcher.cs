using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScientificLaboratory_new_with_dto.Migrations
{
    /// <inheritdoc />
    public partial class AddedChangedProjectsAndResearcher : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectResearchers_Projects_ProjectId",
                table: "ProjectResearchers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectResearchers_Researchers_ResearcherId",
                table: "ProjectResearchers");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Researchers_ProjectLeaderId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ProjectLeaderId",
                table: "Projects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectResearchers",
                table: "ProjectResearchers");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "ProjectLeaderId",
                table: "Projects",
                newName: "StartYear");

            migrationBuilder.AddColumn<int>(
                name: "EndMonth",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EndYear",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ProjectLeader",
                table: "Projects",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "StartMonth",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "ProjectResearchers",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<string>(
                name: "Author",
                table: "News",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectResearchers",
                table: "ProjectResearchers",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectResearchers_ProjectId_ResearcherId",
                table: "ProjectResearchers",
                columns: new[] { "ProjectId", "ResearcherId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectResearchers_Projects_ProjectId",
                table: "ProjectResearchers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectResearchers_Researchers_ResearcherId",
                table: "ProjectResearchers",
                column: "ResearcherId",
                principalTable: "Researchers",
                principalColumn: "ResearcherId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectResearchers_Projects_ProjectId",
                table: "ProjectResearchers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectResearchers_Researchers_ResearcherId",
                table: "ProjectResearchers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectResearchers",
                table: "ProjectResearchers");

            migrationBuilder.DropIndex(
                name: "IX_ProjectResearchers_ProjectId_ResearcherId",
                table: "ProjectResearchers");

            migrationBuilder.DropColumn(
                name: "EndMonth",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "EndYear",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProjectLeader",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "StartMonth",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ProjectResearchers");

            migrationBuilder.RenameColumn(
                name: "StartYear",
                table: "Projects",
                newName: "ProjectLeaderId");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "Projects",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartTime",
                table: "Projects",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Author",
                table: "News",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectResearchers",
                table: "ProjectResearchers",
                columns: new[] { "ProjectId", "ResearcherId" });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectLeaderId",
                table: "Projects",
                column: "ProjectLeaderId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectResearchers_Projects_ProjectId",
                table: "ProjectResearchers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectResearchers_Researchers_ResearcherId",
                table: "ProjectResearchers",
                column: "ResearcherId",
                principalTable: "Researchers",
                principalColumn: "ResearcherId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Researchers_ProjectLeaderId",
                table: "Projects",
                column: "ProjectLeaderId",
                principalTable: "Researchers",
                principalColumn: "ResearcherId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
