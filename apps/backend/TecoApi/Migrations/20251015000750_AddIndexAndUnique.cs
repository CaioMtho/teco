using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TecoApi.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexAndUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_CNPJ",
                table: "Users",
                column: "CNPJ",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_CPF",
                table: "Users",
                column: "CPF",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Requests_CreatedAt",
                table: "Requests",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Requests_Status",
                table: "Requests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Requests_Title",
                table: "Requests",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Proposals_CreatedAt",
                table: "Proposals",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Number",
                table: "Addresses",
                column: "Number");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_Street",
                table: "Addresses",
                column: "Street");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_CNPJ",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_CPF",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Requests_CreatedAt",
                table: "Requests");

            migrationBuilder.DropIndex(
                name: "IX_Requests_Status",
                table: "Requests");

            migrationBuilder.DropIndex(
                name: "IX_Requests_Title",
                table: "Requests");

            migrationBuilder.DropIndex(
                name: "IX_Proposals_CreatedAt",
                table: "Proposals");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Number",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_Street",
                table: "Addresses");
        }
    }
}
