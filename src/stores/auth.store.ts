import type { LoginRequest } from '@/interface/auth.interface';
import type { CommonResponseInterface } from '@/interface/common.response.interface';
import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';

import {
  setLocalStorage,
  clearLocalStorage
} from '@/lib/auth';
import type { CurrentUser } from '@/interface/auth.interface';

const basePostUrl = import.meta.env.VITE_API_URL || "http://localhost:8082/api" + '/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as CurrentUser | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // User Login
    async login(payload: LoginRequest) {
      this.loading = true;
      try {
        const response = await axios.post<CommonResponseInterface<{ token: string } & CurrentUser>>(
          `${basePostUrl}/login`,
          payload
        );

        const respData = response.data.data;
        this.token = respData.token;
        const { token, ...userFields } = respData;
        this.user = userFields as CurrentUser;

        toast.success(response.data.message || 'Login successful');
        this.error = null;

        // Store token and user in LocalStorage
        setLocalStorage('token', this.token);
        setLocalStorage('user', this.user);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Error saat memuat profil: ${this.error}`);
      } finally {
        this.loading = false;
      }
    },

    // User Logout
    async logout() {
      this.loading = true;
      try {
        clearLocalStorage();
        this.user = null;
        this.token = null;
        toast.success('Logout successful');
        this.error = null;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Error saat logout: ${this.error}`);
      } finally {
        this.loading = false;
      }
    },
  },
});
