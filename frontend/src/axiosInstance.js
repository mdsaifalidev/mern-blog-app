import axios from "axios";

const URL = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
});

export default axiosInstance;
