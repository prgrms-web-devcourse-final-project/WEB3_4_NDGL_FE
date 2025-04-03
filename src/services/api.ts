import axios from 'axios';
import https from 'https';

const BASE_URL = `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/v1`;

const agent = new https.Agent({ rejectUnauthorized: false });

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  httpsAgent: agent,
});
