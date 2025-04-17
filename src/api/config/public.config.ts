import axios from "axios";
import { API_ENDPOINTS } from "@/api/config/endpoints";

// Create a public axios instance without auth headers for endpoints that don't require authentication
const publicAxiosInstance = axios.create({
    baseURL: API_ENDPOINTS.RESELLER.BASE_URL,

});

export default publicAxiosInstance;