using API.Data;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Services;
using dotenv.net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

var env = builder.Environment;

var connectionString = env.IsDevelopment() ? builder.Configuration.GetConnectionString("Default") 
    : Environment.GetEnvironmentVariable("PRODUCTION_CONNECTION_STRING");

builder.Services.AddControllers();

if (env.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
    });
}
else if (env.IsProduction())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("ProductionPolicy", builder =>
        {
            builder.WithOrigins(Environment.GetEnvironmentVariable("PRODUCTION_FRONTEND_URL"))
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
    });
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(connectionString, 
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure());
});

builder.Services.AddCors();
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
var cloudinaryConfig = builder.Configuration.GetSection("CloudinarySettings");

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

builder.Services.AddHttpContextAccessor();
builder.Services.Configure<CloudinarySettings>(cloudinaryConfig);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(op =>
{
    op.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = key
    };
});

var app = builder.Build();

if (env.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
} else
{
    app.UseCors("ProductionPolicy");
}

app.ConfigureExceptionHandler(env);

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
