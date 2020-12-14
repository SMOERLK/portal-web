import API from './api';

export async function getStudents(institution_id) {
  const url = '/students?limit=10&institution_id=' + institution_id;
  const response = await API.get(url);
  
  return response.data.data;
}

export async function setStudent(data) {
  const url = '/students/' + data.id;
  const response = await API.post(url, data);

  return response;
}