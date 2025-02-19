import axios from "axios";

const api = axios.create();

const getAccessToken = () => {
  const state = store.getState();
  return state.authToken?.access_token;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
