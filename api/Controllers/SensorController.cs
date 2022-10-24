using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class SensorController : ControllerBase
{
    private readonly SensorDataService _sensorDataService;
    
    public SensorController(SensorDataService sensorDataService)
    {
        _sensorDataService = sensorDataService;
    }

    [HttpGet]
    [Route("temperature")]
    public async Task<List<SensorDataModel>> GetTemperatures()
    {    
       return await _sensorDataService.GetSensorDataAsync("temperature");

    }
    
    [HttpGet]
    [Route("humidity")]
    public async Task<List<SensorDataModel>> GetHumidityValues()
    {    
        return await _sensorDataService.GetSensorDataAsync("humidity");
    }
}