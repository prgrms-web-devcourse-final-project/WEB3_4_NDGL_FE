import { getLocalStorage } from "@/lib/storage";
import axios from "axios";

type FailedRequestQueue = {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
};

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api/v1"
    : `${import.meta.env.VITE_DATABASE_URL}/api/v1`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequestQueue[] = [];

let parsedAuthData: { email: string } = { email: "" };
const authData = getLocalStorage("authData");
if (authData) {
  parsedAuthData = JSON.parse(authData);
}

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes("/auth/token/refresh")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axiosInstance
          .post("/auth/token/refresh", {
            email: parsedAuthData.email,
          })
          .then(() => {
            processQueue(null);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
            delete originalRequest._retry;
          });
      });
    }

    return Promise.reject(error);
  }
);
