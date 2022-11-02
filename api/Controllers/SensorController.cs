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
    [Route("temperature/current")]
    public async Task<SensorDataModel> GetCurrentTemperature()
    {    
        return await _sensorDataService.GetCurrentSensorDataAsync("temperature");
    }
    
    [HttpGet]
    [Route("humidity")]
    public async Task<List<SensorDataModel>> GetHumidityValues()
    {    
        return await _sensorDataService.GetSensorDataAsync("humidity");
    }
    
    [HttpGet]
    [Route("humidity/current")]
    public async Task<SensorDataModel> GetCurrentHumidity()
    {    
        return await _sensorDataService.GetCurrentSensorDataAsync("humidity");
    }
    
    [HttpGet]
    [Route("heat-index")]
    public async Task<List<SensorDataModel>> GetHeatIndexValues()
    {    
        return await _sensorDataService.GetSensorDataAsync("heat_index");
    }
    
    [HttpGet]
    [Route("heat-index/current")]
    public async Task<SensorDataModel> GetCurrentHeatIndex()
    {    
        return await _sensorDataService.GetCurrentSensorDataAsync("heat_index");
    }
}