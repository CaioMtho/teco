using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using DotNetEnv;
namespace TecoApi.Data;

public class TecoContextFactory : IDesignTimeDbContextFactory<TecoContext>
{
    public TecoContext CreateDbContext(string[] args)
    {
        Env.Load("../../../.env");

        var connectionString = Environment.GetEnvironmentVariable("DEFAULT_CONNECTION");


        var optionsBuilder = new DbContextOptionsBuilder<TecoContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new TecoContext(optionsBuilder.Options);
    }
}
