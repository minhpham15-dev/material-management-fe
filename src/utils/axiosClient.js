import axios from "axios";

const token = localStorage.getItem("token") ?localStorage.getItem("token") : ""
export const axiosClient = axios.create({
    baseURL: "http://103.90.227.166:2102", headers: {
        "Authorization": `Bearer ${token}`
    }
})