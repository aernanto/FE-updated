import type { LoginRequest, RegisterRequest } from '@/types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PROFILE_URL || 'http://localhost:8082/api';

export const authService = {
    login(data: LoginRequest) {
        return axios.post<any>(`${API_URL}/auth/login`, data);
    },

    register(data: RegisterRequest) {
        return axios.post<any>(`${API_URL}/auth/register`, data);
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user) return { Authorization: `Bearer ${user.accessToken}` };
        return {};
    }
};
