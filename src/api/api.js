import axios from 'axios';

export const URL = "https://smoerapi.sisdemo.opensource.lk/";
export const API_URL = "https://smoerapi.sisdemo.opensource.lk/api";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})


// Request interceptor for API calls
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if(user) {
    config.headers = { 
      'Authorization': `Bearer ` + user.token,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  return config;
},
  (error) => { return Promise.reject(error) }
);


// Response interceptor for API calls
API.interceptors.response.use((response) => {
  return response
},
async function (error) {
  const originalRequest = error.config;
  
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    const response = await API.put('/refresh', {});
    const refreshedToken = response.data.token;
      
    var user = JSON.parse(localStorage.getItem('user'));
    user.token = refreshedToken;
    localStorage.setItem('user', JSON.stringify(user));

    API.defaults.headers.common['Authorization'] = 'Bearer ' + refreshedToken;
      
    return API(originalRequest);
  }

  return Promise.reject(error);
});


export default API;