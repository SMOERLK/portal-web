import API from './api';

export function getStudents(institution_id) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = 'Bearer ' + user.token;

  const request = {
    method: 'GET',
    url: '/students?limit=10&institution_id=' + institution_id,
    headers: { 'Authorization': token }
  }

  return API(request).then((response) => { return response.data.data })
}