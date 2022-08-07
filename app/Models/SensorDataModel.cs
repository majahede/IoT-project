namespace app.Models;

public class SensorDataModel
{
    public string Time { get; init; } = null!;
    public int Temperature { get; init; }
    public int Humidity { get; init; }
    public int HeatIndex { get; init; }
    
    public string DisplayText => $"Temperature = {Temperature} Humidity = {Humidity} and heat index = {HeatIndex} at {Time}.";
}