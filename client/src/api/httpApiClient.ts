import axios , { Method } from "axios";

const baseUrl = `${process.env.REACT_APP_API_BASEURL}/api`;

export const fetchHttp = async <TResponse, TPayload>(
  url: string,
  method: Method,
  reqBody?: TPayload
): Promise<TResponse> => {
  try {
    const response = await axios(`${baseUrl}/${url}`, {
      method: method,
      headers: {
        "content-type": "application/json"
      },
      data: {
        ...(reqBody && reqBody)
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response);
  }
};