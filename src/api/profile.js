import API from './api';

export async function getProfile() {
    const url = '/profile';
    const response = await API.get(url);
    
    return response.data;
  }