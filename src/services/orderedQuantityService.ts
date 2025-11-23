import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface OrderedQuantityData {
  activityId: string;
  orderedQuota: number;
}

export interface OrderedQuantity {
  id: string;
  planId: string;
  activityId: string;
  orderedQuota: number;
  quota: number;
  price: number;
  activityName: string;
  activityItem: string;
  startDate: string;
  endDate: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  id?: string;
  message?: string;
}

const orderedQuantityService = {
  getOrderedQuantityById: async (id: string): Promise<ApiResponse<OrderedQuantity>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ordered-quantities/${id}`, {
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

  createOrderedQuantity: async (
    planId: string,
    data: OrderedQuantityData
  ): Promise<ApiResponse<OrderedQuantity>> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/plans/${planId}/ordered-quantities`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  updateOrderedQuantity: async (
    id: string,
    newQuota: number
  ): Promise<ApiResponse<OrderedQuantity>> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/ordered-quantities/${id}`,
        null,
        {
          params: { newQuota },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  deleteOrderedQuantity: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/ordered-quantities/${id}`, {
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

export default orderedQuantityService;
