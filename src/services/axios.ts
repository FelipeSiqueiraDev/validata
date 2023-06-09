import axios from "axios";

export const api = axios.create({
  baseURL: "http://gestaovarejo.faridnet.com.br/",
  timeout: 10000,
});
