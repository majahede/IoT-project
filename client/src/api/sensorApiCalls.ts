import { fetchHttp } from "./httpApiClient";
import {SensorData} from "./api-interfaces.ts/sensorData";

export const getHumidityValues = async (): Promise<SensorData[]> => {
  return await fetchHttp("Sensor/humidity", "GET");
};

export const getTemperatureValues = async (): Promise<SensorData[]> => {
  return await fetchHttp("Sensor/temperature", "GET");
};

export const getHeatIndexValues = async (): Promise<SensorData[]> => {
  return await fetchHttp("Sensor/heat-index", "GET");
};

export const getCurrentHumidity = async (): Promise<SensorData> => {
  return await fetchHttp("Sensor/humidity/current", "GET");
};

export const getCurrentTemperature = async (): Promise<SensorData> => {
  return await fetchHttp("Sensor/temperature/current", "GET");
};

export const getCurrentHeatIndex = async (): Promise<SensorData> => {
  return await fetchHttp("Sensor/heat-index/current", "GET");
};