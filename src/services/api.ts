import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/v1`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
