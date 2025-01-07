import axios from "axios";
import omdbConfig from "../config/config";

const axiosInstance = axios.create({
  baseURL: omdbConfig.OMDB_API_URL,
  params: {
    apikey: omdbConfig.OMDB_API_KEY,
  },
});

export default axiosInstance;
