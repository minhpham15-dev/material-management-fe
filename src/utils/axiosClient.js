import axios from "axios";

const token = "12|WB4O2u2huECG0c42WvPRYY9Nhag6IuM9GbatrZmq"
export const axiosClient = axios.create({
    baseURL: "http://103.90.227.166:2102", headers: {
        "Authorization": `Bearer ${token}`
    }
})