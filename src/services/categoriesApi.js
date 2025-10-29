import axios from "axios";

const categoriesApi = axios.create({
  baseURL: "https://localhost:7286/api",
});

categoriesApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default categoriesApi;