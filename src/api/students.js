import API from './api';

export function getStudents(institution_id) {
  const url = '/students?limit=10&institution_id=' + institution_id;

  return API.get(url).then((response) => { return response.data.data })
}