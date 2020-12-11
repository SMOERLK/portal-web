import axios from 'axios';

export const URL = "http://localhost:8080/";

export const API_URL = "http://localhost:8080/api";

export const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export async function API_GET (url) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = 'Bearer ' + user.token;

  const request = {
    method: 'GET',
    url: url,
    headers: { 'Authorization': token }
  }

  return API(request).then((response) => { return response })
}