import axios from "axios";

// Separate Axios instance for Orders microservice
const ordersApi = axios.create({
  baseURL: "https://localhost:7234/api",
});

// Attach access token automatically
ordersApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchOrders = async () => {
  const res = await ordersApi.get("/orders");
  return res.data;
};

export const fetchOrderById = async (id) => {
  const res = await ordersApi.get(`/orders/${id}`);
  return res.data;
};

export const createOrder = async (payload) => {
  const res = await ordersApi.post("/orders", payload);
  return res.data;
};

export const updateOrderStatus = async (id, newStatus) => {
  await ordersApi.put(`/orders/${id}`, { newStatus });
};

export const deleteOrder = async (id) => {
  await ordersApi.delete(`/orders/${id}`);
};

export default ordersApi;