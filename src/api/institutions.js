import { API_GET } from './api';

export function getInstitutions() {
  const url = '/institutions?limit=10&page=1';

  return API_GET(url).then((response) => { return response.data.data })
}