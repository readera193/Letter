import axios from "axios";

export const baseURL = "letter-backend.herokuapp.com";

const request = axios.create({
    baseURL: "https://" + baseURL,
    timeout: 5000,
});

export const checkAPI = () => request.get("/");

export const apiJoin = (data) => request.post("/game/join", data);

