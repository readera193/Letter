import axios from "axios";

export const baseURL = "https://dashboard.heroku.com/apps/letter-backend";

const request = axios.create({
    baseURL: "http://" + baseURL,
    timeout: 5000,
});

export const checkAPI = () => request.get("/");

export const apiJoin = (data) => request.post("/join", data);

