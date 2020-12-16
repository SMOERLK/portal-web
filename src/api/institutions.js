import API from './api';

export async function getInstitutions() {
  const url = '/institutions';
  const response = await API.get(url);
  
  return response.data.data;
}

export async function setInstitution(data) {
  const url = '/institutions/' + data.id;
  const response = await API.post(url, data);

  return response;
}