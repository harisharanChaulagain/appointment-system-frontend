import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://appointment-system-backend-o12e.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
