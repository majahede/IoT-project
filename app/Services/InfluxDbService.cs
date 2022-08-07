namespace app.Services;

using System;
using System.Threading.Tasks;
using InfluxDB.Client;
using Microsoft.Extensions.Configuration;

public class InfluxDbService
{
    private readonly string _token;

    public InfluxDbService(IConfiguration configuration)
    {
        _token = "";
    }
    
    public async Task<T> QueryAsync<T>(Func<QueryApi, Task<T>> action)
    {
        using var client = InfluxDBClientFactory.Create("http://localhost:8086", _token);
        var query = client.GetQueryApi();
        return await action(query);
    }
}
