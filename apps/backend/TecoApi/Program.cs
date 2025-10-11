
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using TecoApi.Data;
using TecoApi.Helpers;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

Env.Load("../../../.env");

var jwtKey = builder.Configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("JWT_KEY");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE");

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

builder.Services.AddScoped<IJwtGenerator, JwtGenerator>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.FromMinutes(2)
    };
});

builder.Services.AddAuthorization();


var app = builder.Build();
app.MapHealthChecks("/health");
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () =>
{
    return Results.Ok("API rodando...");
});

app.UseHttpsRedirection();

app.Run();