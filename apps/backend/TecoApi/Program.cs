
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using TecoApi.Data;


var builder = WebApplication.CreateBuilder(args);

Env.Load("../../../.env");

var connectionString = Environment.GetEnvironmentVariable("DEFAULT_CONNECTION");
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TecoContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();
app.MapHealthChecks("/health");
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();

app.MapGet("/", () =>
{
    return Results.Ok("Olá Mundo!");
});

app.UseHttpsRedirection();

app.Run();