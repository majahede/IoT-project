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
 
float currentTemp;
float currentHumidity;

void displayReadingsOnOled() {
   
  String temperatureDisplay ="Temperature: " + (String)currentTemp +  "°C";
  String humidityDisplay = "Humidity: " + (String)currentHumidity + "%";
 
  // Clear the OLED screen
  Heltec.display->clear();
  // Prepare to display temperature
  Heltec.display->drawString(0, 0, temperatureDisplay);
  // Prepare to display humidity
  Heltec.display->drawString(0, 12, humidityDisplay);
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
   
  currentTemp = dht.getTemperature();
  currentHumidity = dht.getHumidity();
 
  pinMode(LED,OUTPUT);
  digitalWrite(LED,HIGH);
 
  Heltec.begin(true /*DisplayEnable Enable*/, false /*LoRa Enable*/, false /*Serial Enable*/);
  displayReadingsOnOled();
}
 
void loop()
{
  float temperature = dht.getTemperature();
  float humidity = dht.getHumidity();
 
  if (temperature != currentTemp || humidity != currentHumidity) {
    currentTemp = temperature;
    currentHumidity = humidity;
    displayReadingsOnOled();
  }
   // Store measured value into point
  sensor.clearFields();
  // Report RSSI of currently connected network
  sensor.addField("rssi", WiFi.RSSI());
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

  //Wait 10s
  Serial.println("Wait 10s");
  delay(10000);
}
