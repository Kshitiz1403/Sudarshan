import axios, { AxiosRequestHeaders } from "axios";
import config from "../../config";

const baseConfig = {
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
};

const getUnauthenticatedConfig = (url = "") => {
  const getBaseURL = () => {
    const baseURL = baseConfig.baseURL;
    const updatedBaseURL = `${baseURL}${url}`;
    return updatedBaseURL;
  };
  const configuration = { ...baseConfig };
  configuration.baseURL = getBaseURL();
  return configuration;
};

const getAuthenticatedConfig = (token, url = '') => {
  const configuration = getUnauthenticatedConfig(url);
  configuration['headers']['Authorization'] = token;
  return configuration;
};


export const getUnauthenticatedAxios = (url = '') => {
  const config = getUnauthenticatedConfig(url);
  const unauthenticatedAxios = axios.create(config);
  unauthenticatedAxios.interceptors.response.use(
    response => {
      let res = response.data;
      return res.data;
    },
    error => {
      let err = error.response.data;
      console.error(err);
      throw err;
    },
  );

  return unauthenticatedAxios;
};

export const getAuthenticatedAxios = (url, token) => {
  const config = getAuthenticatedConfig(token, url);
  const authenticatedAxios = axios.create(config);
  authenticatedAxios.interceptors.response.use(
    response => {
      let res = response.data;
      return res.data;
    },
    error => {
      let err = { ...error.response.data, status: error.response.status };
      console.error(err);
      throw err;
    },
  );

  return authenticatedAxios;
}