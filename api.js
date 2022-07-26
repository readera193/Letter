import axios from "axios";

export const baseURL = "192.168.0.195:1956";

const request = axios.create({
    baseURL: "http://" + baseURL,
    timeout: 5000,
});

export const checkAPI = () => request.get("/");

export const apiJoin = (data) => request.post("/join", data);

