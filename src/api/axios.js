
import axios from "axios";

// Create a reusable Axios instance for the backend API.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
