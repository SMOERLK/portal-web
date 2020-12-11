import axios from 'axios';

export const URL = "http://localhost:8080/";
export const API_URL = "http://localhost:8080/api";

const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export default API;