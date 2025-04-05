import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api/api/v1"
    : `${import.meta.env.VITE_DATABASE_URL}/api/v1`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// let isRefreshing = false;

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (originalRequest.baseURL === "/auth/token/refresh") {
//         return Promise.reject(error);
//       }

//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           await axiosInstance.post("/auth/token/refresh");
//           isRefreshing = false;

//           originalRequest._retry = true;

//           const result = await axiosInstance(originalRequest);
//           delete originalRequest._retry;

//           return result;
//         } catch (refreshError) {
//           isRefreshing = false;
//           delete originalRequest._retry;

//           return Promise.reject(refreshError);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );
