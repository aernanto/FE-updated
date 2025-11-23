import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface PlanData {
  packageId?: string;
  planName: string;
  planDate: string;
  planTime: string;
  planDescription: string;
  planLocation: string;
}

export interface Plan extends PlanData {
  id: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  id?: string;
  message?: string;
}

const planService = {
  // Get all plans
  getAllPlans: async (): Promise<ApiResponse<Plan[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get plan by ID
  getPlanById: async (id: string | null): Promise<ApiResponse<Plan>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get plans by package ID
  getPlansByPackageId: async (packageId: string | null): Promise<ApiResponse<Plan[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans/package/${packageId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Create plan
  createPlan: async (planData: PlanData): Promise<ApiResponse<Plan>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/plans`, planData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Update plan
  updatePlan: async (id: string | null, planData: PlanData): Promise<ApiResponse<Plan>> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/plans/${id}`, planData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Delete plan
  deletePlan: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/plans/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  }
};

export default planService;
