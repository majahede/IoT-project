using api.Models;
using api.Services;

var builder = WebApplication.CreateBuilder(args);

var configurationBuilder = builder.Configuration.SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
    .AddJsonFile("Properties/appsettings.json")
    .AddJsonFile($"Properties/appsettings.{builder.Environment.EnvironmentName}.json")
    .AddEnvironmentVariables()
    .Build();

var services = builder.Services;

var settingsSection = configurationBuilder.GetSection("InfluxDb");

services.Configure<InfluxDbSettings>(settingsSection);

services.AddSingleton<SensorDataService>();

// Add services to the container.
services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapGet("/", () => "Welcome to this temperature api!");
app.Run();