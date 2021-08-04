using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace okr.back.DataAccess.Migrations
{
    public partial class AddedFavouriteUsersTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FavouriteUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OwnerId = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    FavouriteUserId = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavouriteUsers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FavouriteUsers_OwnerId_FavouriteUserId",
                table: "FavouriteUsers",
                columns: new[] { "OwnerId", "FavouriteUserId" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavouriteUsers");
        }
    }
}
