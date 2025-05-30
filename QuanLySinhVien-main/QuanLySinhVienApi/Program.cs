using Microsoft.AspNetCore.Authentication.JwtBearer;
using QuanLySinhVienApi.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "QuanLySinhVienApi", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.\r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
builder.Services.AddSingleton<SinhVienRepository>();
builder.Services.AddSingleton<LopRepository>();
builder.Services.AddSingleton<MonHocRepository>();
builder.Services.AddSingleton<GiaoVienRepository>();
builder.Services.AddSingleton<DiemRepository>();
builder.Services.AddSingleton<AccountRepository>();

builder.Services.AddControllers();

// JWT Authentication configuration
var key = Encoding.ASCII.GetBytes("Nguyenxuananhkiet15052006@1234567890"); 
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JwtBearer";
    options.DefaultChallengeScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    app.Urls.Add($"http://*:{port}");
}

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

app.Run();