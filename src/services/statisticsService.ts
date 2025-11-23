import axios from 'axios';
const API_URL = 'http://localhost:8080/api/statistics';

export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRevenue(year: number) { return axios.get(`${API_URL}/revenue`, { params: { year } }); }
};
