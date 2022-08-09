import { HttpMethod } from "./api-interfaces.ts/httpMethod";
import { fetchHttp } from "./httpApiClient";

export const getAllSensorData = async (): Promise<string> => {
  return await fetchHttp("Sensor", HttpMethod.GET);
};