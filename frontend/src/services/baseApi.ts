// /services/baseApi.ts
import axios from "axios";

const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // change it later to correct port
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //  send and receive cookies
});

// Global error handling
baseApi.interceptors.response.use(
  (response) => {
    console.log("response", response);
    return response; // if response is successful, return the response
  },
  (error) => { // if response is not successful, return the full error object
    console.log("error", error);
    return Promise.reject(error);
  }
);

export default baseApi;
