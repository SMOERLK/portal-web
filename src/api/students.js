import API from './api';

export async function getStudents(institution_id) {
  const url = '/students?limit=10&institution_id=' + institution_id;
  const response = await API.get(url);
  
  return response.data.data;
}