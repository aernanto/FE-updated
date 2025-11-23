import axios from 'axios';

const API_URL = 'http://localhost:8080/api/packages';

export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllPackages(userRole: string = 'SUPERADMIN', userId: string = 'user-1') {
    return axios.get(API_URL, { params: { userRole, userId } });
  },
  getPackageById(id: string) {
    return axios.get(`${API_URL}/${id}`);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createPackage(data: any) {
    return axios.post(API_URL, data);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatePackage(id: string, data: any) {
    return axios.put(`${API_URL}/${id}`, data);
  },
  deletePackage(id: string) {
    return axios.delete(`${API_URL}/${id}`);
  },
  processPackage(id: string) {
    return axios.post(`${API_URL}/${id}/process`);
  }
};
