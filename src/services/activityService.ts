import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ActivityData {
  activityName: string;
  activityType: string;
  activityItem: string;
  capacity: number;
  price: number;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
}

export interface Activity extends ActivityData {
  id: string;
  isDeleted?: boolean;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  id?: string;
  message?: string;
}

const activityService = {
  getAllActivities: async (): Promise<ApiResponse<Activity[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/activities`, {
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

  getActivityById: async (id: string): Promise<ApiResponse<Activity>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/activities/${id}`, {
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

  createActivity: async (activityData: ActivityData): Promise<ApiResponse<Activity>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/activities`, activityData, {
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

  updateActivity: async (
    id: string,
    activityData: ActivityData
  ): Promise<ApiResponse<Activity>> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/activities/${id}`,
        activityData,
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

  deleteActivity: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/activities/${id}`, {
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

  getActivitiesByType: async (type: string): Promise<ApiResponse<Activity[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/activities`, {
        params: { activityType: type },
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

export default activityService;
