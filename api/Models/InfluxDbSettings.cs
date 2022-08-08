namespace api.Models;

public class InfluxDbSettings
{
    public string Bucket { get; set; } = null!;
    public string Org { get; set; } = null!;
    public string Url { get; set; } = null!;
    public string Token { get; set; } = null!;

}