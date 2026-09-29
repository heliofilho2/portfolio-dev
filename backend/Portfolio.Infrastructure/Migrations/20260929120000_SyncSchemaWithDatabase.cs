using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Portfolio.Infrastructure.Data;

#nullable disable

namespace Portfolio.Infrastructure.Migrations
{
    /// <summary>
    /// Registra no EF as mudanças que foram aplicadas direto no banco (AboutText, Languages(200)
    /// e campos de case study). Idempotente: roda sem erro em bancos que já têm essas colunas.
    /// </summary>
    [DbContext(typeof(PortfolioDbContext))]
    [Migration("20260929120000_SyncSchemaWithDatabase")]
    public partial class SyncSchemaWithDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS "AboutText" character varying(3000);
                ALTER TABLE "Profiles" ALTER COLUMN "Languages" TYPE character varying(200);
                ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "BusinessProblem" text;
                ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "TechnicalSolution" text;
                ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "TechnicalDecisions" text;
                ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "TradeOffs" text;
                ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "ArchitectureNotes" text;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Projects" DROP COLUMN IF EXISTS "ArchitectureNotes";
                ALTER TABLE "Projects" DROP COLUMN IF EXISTS "TradeOffs";
                ALTER TABLE "Projects" DROP COLUMN IF EXISTS "TechnicalDecisions";
                ALTER TABLE "Projects" DROP COLUMN IF EXISTS "TechnicalSolution";
                ALTER TABLE "Projects" DROP COLUMN IF EXISTS "BusinessProblem";
                ALTER TABLE "Profiles" DROP COLUMN IF EXISTS "AboutText";
                """);
        }
    }
}
