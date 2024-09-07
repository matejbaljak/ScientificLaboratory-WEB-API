using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScientificLaboratory_new_with_dto.Migrations
{
    /// <inheritdoc />
    public partial class AddedTypeInPublication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Publications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Publications");
        }
    }
}
