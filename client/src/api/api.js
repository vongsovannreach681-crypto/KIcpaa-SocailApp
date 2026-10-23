import axios from "axios";

const api = axios.create({
  baseURL: "https://kicpaa-socailapp-1.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
