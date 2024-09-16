import axios from "axios";

const URL = "https://mern-blog-app-0fes.onrender.com";

const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
});

export default axiosInstance;
