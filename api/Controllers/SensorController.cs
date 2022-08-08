using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]

public class SensorController : ControllerBase
{
    private readonly SensorDataService _sensorDataService;
    
    public SensorController(SensorDataService sensorDataService)
    {
        _sensorDataService = sensorDataService;
    }

    [HttpGet]
    public async Task GetAll()
    {    
        await _sensorDataService.GetAsync();
    } 
}