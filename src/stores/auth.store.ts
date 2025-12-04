import type { LoginRequest } from '@/interface/auth.interface';
import type { CommonResponseInterface } from '@/interface/common.response.interface';
import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';
import { setLocalStorage, clearLocalStorage } from '@/lib/auth';
import type { CurrentUser } from '@/interface/auth.interface';

const apiBase = "http://localhost:8082/api"; // ← PORT 8082!
const basePostUrl = `${apiBase}/auth`;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as CurrentUser | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async login(payload: LoginRequest) {
      this.loading = true;
      try {
        // KIRIM LANGSUNG email & password (jangan di-map!)
        const response = await axios.post<CommonResponseInterface<{ token: string } & CurrentUser>>(
          `${basePostUrl}/login`,
          {
            email: payload.email,  // ← LANGSUNG email
            password: payload.password
          }
        );

        const respData = response.data.data;
        this.token = respData.token;
        const { token, ...userFields } = respData;
        this.user = userFields as CurrentUser;

        toast.success(response.data.message || 'Login successful');
        setLocalStorage('token', this.token);
        setLocalStorage('user', this.user);
        this.error = null;

      } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Unknown error';
        this.error = message;
        toast.error(`Login Gagal: ${message}`);
        console.error('Login error:', error.response?.data); // ← Debug log
      } finally {
        this.loading = false;
      }
    },

    async logout() {
       this.loading = true;
       try {
         clearLocalStorage();
         this.user = null;
         this.token = null;
         toast.success('Logout successful');
         this.error = null;
       } catch (error: any) {
         this.error = error instanceof Error ? error.message : 'Unknown error';
         toast.error(`Error saat logout: ${this.error}`);
       } finally {
         this.loading = false;
       }
    }
  },
});
