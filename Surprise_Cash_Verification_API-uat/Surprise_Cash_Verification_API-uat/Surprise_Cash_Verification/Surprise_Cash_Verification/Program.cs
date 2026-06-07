using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OnlineAcOpening.Interface;
using Serilog;
using Surprise_Cash_Verification.Core;
using Surprise_Cash_Verification.Core.DbConn;
using Surprise_Cash_Verification.DbConn;
using Surprise_Cash_Verification.Interface;
using Surprise_Cash_Verification.Middleware;
using Surprise_Cash_Verification.Services;
using System.Globalization;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
////JWT configuration
var jwtissuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
    options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtissuer,
            ValidAudience = jwtissuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))

        };

    });

builder.Services.AddAuthorization();

//builder.Services.AddControllers(options =>
//{
//    options.Filters.Add(new AuthorizeFilter());
//});

// Add services to the container.
builder.Services.AddScoped<IUserManagementServices, UserManagementServices>();
builder.Services.AddScoped<ISurpriseCashVerificationService, SurpriseCashVerificationService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllers();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddHttpContextAccessor();

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

string Connstr = EncryptoData.DecryptAes(builder.Configuration.GetConnectionString("Connstr").Replace(" ", "+"));
string ConnStrOrganisations = EncryptoData.DecryptAes(builder.Configuration.GetConnectionString("ConnStrOrganisations").Replace(" ", "+"));


builder.Services.AddDbContext<SurpriseCashDbContext>
    (options =>
    {
        options.UseOracle(Connstr);
        //options.UseOracle(builder.Configuration.GetConnectionString("Connstr"));
    });
builder.Services.AddDbContext<OrganisationsDbContext>
    (options =>
    {
        options.UseSqlServer(ConnStrOrganisations);
        //options.UseSqlServer(builder.Configuration.GetConnectionString("ConnStrOrganisations"));

    });
builder.Services.AddSingleton<HttpClient>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var logger = new LoggerConfiguration()
        .ReadFrom.Configuration(builder.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.File(path: @"Log/ErrorLog" + DateTime.Now.ToString("ddMMyyyy HH mm ss") + ".txt")
        .CreateLogger();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "MyAllowSpecificOrigins",
                      builder =>
                      {
                          builder.WithOrigins("http://localhost:4200","https://scvuiuat.unionbankofindia.co.in","https://scvuidev.unionbankofindia.co.in","https://scv.unionbankofindia.co.in").AllowAnyHeader().WithMethods("GET", "POST", "PUT", "DELETE").AllowCredentials();
                          //builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                      });
});

//var bindJwtSettings = new JwtSettings();
//builder.Configuration.Bind("JsonWebTokenKeys", bindJwtSettings);
//builder.Services.AddSingleton(bindJwtSettings);
//builder.Services.AddAuthentication(option =>
//{
//    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//}).AddJwtBearer(options =>
//{
//    options.RequireHttpsMetadata = false;
//    options.SaveToken = true;
//    options.TokenValidationParameters = new TokenValidationParameters()
//    {
//        ValidateIssuerSigningKey = bindJwtSettings.ValidateIssuerSigningKey,
//        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(bindJwtSettings.IssuerSigningKey)),
//        ValidateIssuer = bindJwtSettings.ValidateIssuer,
//        ValidIssuer = bindJwtSettings.ValidIssuer,
//        ValidateAudience = bindJwtSettings.ValidateAudience,
//        ValidAudience = bindJwtSettings.ValidAudience,
//        RequireExpirationTime = bindJwtSettings.RequireExpirationTime,
//        ValidateLifetime = bindJwtSettings.RequireExpirationTime,
//        ClockSkew = TimeSpan.FromDays(1),
//    };
//});
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture("en-GB");//en-ES
    options.SupportedCultures = new List<CultureInfo> { new CultureInfo("en-GB") };
    options.RequestCultureProviders.Clear();

});
builder.Services.ConfigureCors();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
//app.UseStaticFiles();
//app.UseAuthentication();
//app.UseAuthorization();
//app.UseSession();
//app.UseRouting();
////app.UseMiddleware<JWTMiddleware>();
//app.UseCors("MyAllowSpecificOrigins");
//app.UseEndpoints(endpoints => endpoints.MapControllers());
//app.MapControllers();
//app.Run();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseCors("MyAllowSpecificOrigins");
app.UseSession();
app.UseRouting();
app.UseAuthorization();
app.UseEndpoints(endpoints => endpoints.MapControllers());
app.UseResponseCompression();
app.Run();
