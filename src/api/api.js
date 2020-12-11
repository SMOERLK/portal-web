import axios from 'axios';

export const URL = "http://localhost:8080/";
export const API_URL = "http://localhost:8080/api";

const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})


// Response interceptor for API calls
API.interceptors.response.use((response) => {
  return response
},
async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const response = await API.put('/refresh', {});

    if (response.status === 201) {
      const refreshedToken = response.data.token;
      
      var user = JSON.parse(localStorage.getItem('user'));
      user.token = refreshedToken;
      localStorage.setItem('user', JSON.stringify(user));

      API.defaults.headers.common['Authorization'] = 'Bearer ' + refreshedToken;

      return API(originalRequest);
    }
  }

  return Promise.reject(error);
});


export default API;