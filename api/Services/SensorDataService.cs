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
    public async Task GetAsync()
    {
        Console.WriteLine(_org);
        var query = _client.GetQueryApi();
        var flux = $"from(bucket:\"{_bucket}\") |> range(start: 0)";
        var tables = await query.QueryAsync(flux, _org);
        
        foreach (var t in tables)
        {
            foreach (var r in t.Records)
            {
                Console.WriteLine(r.GetField);
            }
        }
    }
}