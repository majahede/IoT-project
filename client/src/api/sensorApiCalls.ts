import { fetchHttp } from "./httpApiClient";
import {SensorData, SensorDataList} from "./api-interfaces.ts/sensorData";

export const getHumidityValues = async (): Promise<SensorData[]> => {
  return await fetchHttp("Sensor/humidity", "GET");
};

export const getTemperatureValues = async (): Promise<SensorData[]> => {
  return await fetchHttp("Sensor/temperature", "GET");
};