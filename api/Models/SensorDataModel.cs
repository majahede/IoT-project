namespace api.Models;

public class SensorDataModel
{
    public string Time { get; set; } = null!;
    public int Temperature { get; set; }
    public int Humidity { get; set; }
    public int HeatIndex { get; set; }
}