import API from './api';

export async function getInstitutions() {
  const url = '/institutions?limit=10&page=1';
  const response = await API.get(url);
  
  return response.data.data;
}