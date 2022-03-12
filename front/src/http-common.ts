import axios, { AxiosInstance } from "axios";
import ResponseData from "@/types/ResponseData";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

apiClient.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: ResponseData) => {
    return response;
  },
  (error) => {
    if (error !== undefined && error.response) {
      if (error.response.status == 401) {
        localStorage.removeItem("user-token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
