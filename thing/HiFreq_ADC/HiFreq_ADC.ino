#include "DHTesp.h"
#include "heltec.h"

#if defined(ESP32)
#include <WiFiMulti.h>
WiFiMulti wifiMulti;
#define DEVICE "ESP32"
#elif defined(ESP8266)
#include <ESP8266WiFiMulti.h>
ESP8266WiFiMulti wifiMulti;
#define DEVICE "ESP8266"
#endif

#include <InfluxDbClient.h>
#include <InfluxDbCloud.h>

#define WIFI_SSID "ssid"
#define WIFI_PASSWORD "password"

#define INFLUXDB_URL "url"
#define INFLUXDB_TOKEN "token"
#define INFLUXDB_ORG "org"
#define INFLUXDB_BUCKET "bucket"
#define TZ_INFO "CET-1CEST,M3.5.0,M10.5.0/3"

InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);

// Data point
Point sensor("wifi_status");

DHTesp dht;
 
float temperature;
float humidity;
float heatIndex;

void displayReadingsOnOled() {
   
  String temperatureDisplay ="Temperature: " + (String)temperature +  "°C";
  String humidityDisplay = "Humidity: " + (String)humidity + "%";
  String heatIndexDisplay = "Heat index: " + (String)heatIndex + "°C";
 
  // Clear the OLED screen
  Heltec.display->clear();
  // Prepare to display temperature
  Heltec.display->drawString(0, 0, temperatureDisplay);
  // Prepare to display humidity
  Heltec.display->drawString(0, 12, humidityDisplay);
  // Prepare to display heat index
  Heltec.display->drawString(0, 24, heatIndexDisplay);
  // Display the readings
  Heltec.display->display();
}
    
void setup()
{
  Serial.begin(115200);
  
  // Setup wifi
  WiFi.mode(WIFI_STA);
  wifiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to wifi");
  while (wifiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();

  // Add tags
  sensor.addTag("device", DEVICE);
  sensor.addTag("SSID", WiFi.SSID());

  timeSync(TZ_INFO, "pool.ntp.org", "time.nis.gov");

  // Check server connection
  if (client.validateConnection()) {
    Serial.print("Connected to InfluxDB: ");
    Serial.println(client.getServerUrl());
  } else {
    Serial.print("InfluxDB connection failed: ");
    Serial.println(client.getLastErrorMessage());
  }
  
  dht.setup(12, DHTesp::DHT11);

  pinMode(LED,OUTPUT);
  digitalWrite(LED,HIGH);
 
  Heltec.begin(true /*DisplayEnable Enable*/, false /*LoRa Enable*/, false /*Serial Enable*/);
}
 
void loop()
{
  sensor.clearFields();
  
  temperature = dht.getTemperature();
  humidity = dht.getHumidity();
  heatIndex = dht.computeHeatIndex(temperature, humidity, false);
  displayReadingsOnOled();

  sensor.addField("humidity", humidity);
  sensor.addField("temperature", temperature);
  sensor.addField("heat_index", heatIndex);
   
  // Print what are we exactly writing
  Serial.print("Writing: ");
  Serial.println(client.pointToLineProtocol(sensor));
  
  // If no Wifi signal, try to reconnect it
  if (wifiMulti.run() != WL_CONNECTED) {
    Serial.println("Wifi connection lost");
  }
  
  // Write point
  if (!client.writePoint(sensor)) {
    Serial.print("InfluxDB write failed: ");
    Serial.println(client.getLastErrorMessage());
  }

  Serial.println(temperature);
  Serial.println("Wait 60s");
  delay(1000);
}
