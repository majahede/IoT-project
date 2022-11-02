using System.Globalization;
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
    public async Task<List<SensorDataModel>> GetSensorDataAsync(string fieldName)
    {
        var query = _client.GetQueryApi();
        
        var flux =$"from(bucket: \"{_bucket}\") " +
                  "|> range(start: -7d, stop: now()) " +
                  $"|> filter(fn: (r) => r[\"_field\"] ==  \"{fieldName}\")" +
                  "|> aggregateWindow(every: 24h, fn: mean, createEmpty: false)" +
                  "|> yield(name: \"mean\")";
        
        var tables = await query.QueryAsync(flux, _org);

        return (
            from r in tables.SelectMany(t => t.Records) 
            let time = (DateTime) r.GetTimeInDateTime() 
            select new SensorDataModel
            {
                Time = time.ToShortDateString(),
                Value = (double) r.GetValue()
            }).ToList();
    }

    public async Task<SensorDataModel> GetCurrentSensorDataAsync(string fieldName)
    {
        var query = _client.GetQueryApi();

        var flux = $"from(bucket: \"{_bucket}\") " +
                   "|> range(start: -1d) " +
                   $"|> filter(fn: (r) => r[\"_field\"] ==  \"{fieldName}\")" +
                   "|> last()";

        var tables = await query.QueryAsync(flux, _org);
        
        return (
            from r in tables.SelectMany(t => t.Records) 
            let time = (DateTime) r.GetTimeInDateTime() 
            select new SensorDataModel
            {
                Time = time.AddHours(1).ToString(CultureInfo.InvariantCulture),
                Value = (double) r.GetValue()
            }).Last();
    }
}