#include "DHTesp.h"
#include "heltec.h"
#include "WiFi.h"

#define WIFI_NETWORK "wifi"
#define WIFI_PASSWORD "password"
#define WIFI_TIMEOUT_MS 20000

DHTesp dht;
 
float currentTemp;
float currentHumidity;

void connectToWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_NETWORK, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");

  unsigned long startAttemptTime = millis();

  while(WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_TIMEOUT_MS){
    Serial.print(".");
    delay(100);
  }

  if(WiFi.status()!= WL_CONNECTED) {
    Serial.print("Failed!");
    Serial.print(WiFi.status());
    // take action
  } else {
    Serial.print("Connected!");
    Serial.println(WiFi.localIP());
  }
}

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
  
  connectToWifi();
 
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
    
  delay(300000);
}
