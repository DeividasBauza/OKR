using Microsoft.EntityFrameworkCore.Migrations;

namespace okr.back.DataAccess.Migrations
{
    public partial class AddedMessageToCheckInHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "CheckInHistory",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Message",
                table: "CheckInHistory");
        }
    }
}
