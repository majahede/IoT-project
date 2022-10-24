using api.Models;
using InfluxDB.Client;
using Microsoft.Extensions.Options;

namespace api.Services;

public class SensorDataService
{
    private readonly InfluxDBClient _client;
    private readonly string _bucket;
    private readonly string _org;

    public SensorDataService(IOptions<InfluxDbSettings> settings)
    {
        _client = InfluxDBClientFactory.Create(settings.Value.Url,settings.Value.Token);
        _bucket = settings.Value.Bucket;
        _org = settings.Value.Org;
    }
    public async Task GetSensorDataAsync(string fieldName)
    {
        var query = _client.GetQueryApi();
        
     //   var flux = $"from(bucket:\"{_bucket}\") |> range(start: 0) |> filter(fn: (r) => r[\"_field\"] == \"{fieldName}\")";

    // var flux =$"from(bucket: \"{_bucket}\") |> range(start: 2022-10-24T11:24:00Z)|> aggregateWindow(every:  1h, fn: mean)|> filter(fn: (r) => r[\"_field\"] == \"{fieldName}\")";
        
    var flux =$" from(bucket: \"{_bucket}\") |> range(start: -1h, stop: now()) |> filter(fn: (r) => r[\"_field\"] == \"temperature\")|> aggregateWindow(every: 10m, fn: mean, createEmpty: false)|> yield(name: \"mean\")";
    
    var tables = await query.QueryAsync(flux, _org);
    
        foreach (var r in tables.SelectMany(t => t.Records))
        {
            Console.WriteLine(r.GetValue());
            Console.WriteLine(r.GetTime());
        }
    }
}