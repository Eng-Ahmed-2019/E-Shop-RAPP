import axios from "axios";

const productsApi = axios.create({
  baseURL: "https://localhost:7035/api",
});

productsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default productsApi;