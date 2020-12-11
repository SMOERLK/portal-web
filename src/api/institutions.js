import API from './api';

export function getInstitutions() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = 'Bearer ' + user.token;

  const request = {
    method: 'GET',
    url: '/institutions?limit=10&page=1',
    headers: { 'Authorization': token }
  }

  return API(request).then((response) => { return response.data.data })
}