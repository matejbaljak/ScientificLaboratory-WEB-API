using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScientificLaboratory_new_with_dto.Migrations
{
    /// <inheritdoc />
    public partial class NewsImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "URL",
                table: "News",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "URL",
                table: "News");
        }
    }
}
