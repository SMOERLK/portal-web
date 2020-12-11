import API from './api';

export function getInstitutions() {
  const url = '/institutions?limit=10&page=1';

  return API.get(url).then((response) => { return response.data.data })
}