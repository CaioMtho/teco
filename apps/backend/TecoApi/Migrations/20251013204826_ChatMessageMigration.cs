using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TecoApi.Migrations
{
    /// <inheritdoc />
    public partial class ChatMessageMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ChatMessageId",
                table: "Proposals",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequestId = table.Column<long>(type: "bigint", nullable: false),
                    SenderId = table.Column<long>(type: "bigint", nullable: false),
                    Content = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsProposal = table.Column<bool>(type: "boolean", nullable: false),
                    ProposalId = table.Column<long>(type: "bigint", nullable: true),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Requests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "Requests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Proposals_ChatMessageId",
                table: "Proposals",
                column: "ChatMessageId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_RequestId",
                table: "ChatMessages",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_SenderId",
                table: "ChatMessages",
                column: "SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Proposals_ChatMessages_ChatMessageId",
                table: "Proposals",
                column: "ChatMessageId",
                principalTable: "ChatMessages",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Proposals_ChatMessages_ChatMessageId",
                table: "Proposals");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_Proposals_ChatMessageId",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "ChatMessageId",
                table: "Proposals");
        }
    }
}
