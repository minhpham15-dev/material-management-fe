import axios from "axios";

const token = "57|HK5iOoX3QHAmX9vrUcCVqMgQ0bVdGldsIFN7nWMI"
export const axiosClient = axios.create({
    baseURL: "http://103.90.227.166:2102", headers: {
        "Authorization": `Bearer ${token}`
    }
})