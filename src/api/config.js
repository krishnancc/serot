import axios from "axios";

import { logoutUser } from "../utils/logout";

export const attachInterceptors = (axiosClient) => {
  // REQUEST INTERCEPTOR
  axiosClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("serot_token");

      if (!token) {
        logoutUser();
        return Promise.reject(new Error("TOKEN_MISSING"));
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error),
  );

  // RESPONSE INTERCEPTOR
  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // 🔍 DEBUG: inspect backend response
      // console.group("🚨 Axios Auth Error");
      // console.log("URL:", error.config?.url);
      // console.log("METHOD:", error.config?.method);
      // console.log("STATUS:", error.response?.status);
      // console.log("RESPONSE DATA:", error.response?.data);
      // console.log("HEADERS:", error.response?.headers);
      // console.groupEnd();

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (
        status === 401 ||
        status === 403 ||
        message === "TOKEN_EXPIRED" ||
        message === "USER_NOT_FOUND"
      ) {
        logoutUser();
      }

      return Promise.reject(error);
    },
  );
};

export const axiosAuth = () => {
  const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return axiosClient;
};

export const axiosSecured = () => {
  const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  attachInterceptors(axiosClient);

  return axiosClient;
};

export const axiosSecuredForm = () => {
  const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

  attachInterceptors(axiosClient);

  return axiosClient;
};
