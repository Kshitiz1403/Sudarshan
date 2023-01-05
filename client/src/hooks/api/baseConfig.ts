import axios from "axios";
import config from "../../config";

interface Options {
  headers?: {
    "Content-Type"?: "application/json" | "multipart/form-data";
  };
}

const baseConfig = {
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
};

const getUnauthenticatedConfig = (url = "", options: Options = {}) => {
  const getBaseURL = () => {
    const baseURL = baseConfig.baseURL;
    const updatedBaseURL = `${baseURL}${url}`;
    return updatedBaseURL;
  };

  let configuration = { ...baseConfig };
  if (options && options.headers) {
    configuration.headers = { ...configuration.headers, ...options.headers };
  }
  configuration.baseURL = getBaseURL();
  return configuration;
};

const getAuthenticatedConfig = (token, url = "", options: Options) => {
  const configuration = getUnauthenticatedConfig(url, options);
  configuration["headers"]["Authorization"] = token;
  return configuration;
};

export const getUnauthenticatedAxios = (url = "", options: Options = {}) => {
  const config = getUnauthenticatedConfig(url, options);
  const unauthenticatedAxios = axios.create(config);
  unauthenticatedAxios.interceptors.response.use(
    (response) => {
      let res = response.data;
      return res.data;
    },
    (error) => {
      let err = error.response.data;
      console.error(err);
      throw err;
    }
  );

  return unauthenticatedAxios;
};

export const getAuthenticatedAxios = (url, token, options: Options = {}) => {
  const config = getAuthenticatedConfig(token, url, options);
  const authenticatedAxios = axios.create(config);
  authenticatedAxios.interceptors.response.use(
    (response) => {
      let res = response.data;
      return res.data;
    },
    (error) => {
      console.log(error)
      let err = { ...error.response.data, status: error.response.status };
      console.error(err);
      throw err;
    }
  );

  return authenticatedAxios;
};
