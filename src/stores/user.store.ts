import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue-sonner";
import type { CommonResponseInterface } from "@/interface/common.response.interface";
import type {
  UserProfile,
  AddUserProfileRequest,
  UpdateUserProfileRequest,
} from "@/interface/user.interface";
import { getAuthToken } from "@/lib/auth";
import type { TopUpResponseDTO } from "@/interface/topup.interface";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [] as UserProfile[],
    customers: [] as UserProfile[],
    selectedUser: null as UserProfile | null,
    customerTopUps: [] as TopUpResponseDTO[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    resetError() {
      this.error = null;
    },

    parseError(err: any): string {
      let message = "Something went wrong";

      if (err?.response) {
        const data = err.response.data;
        if (typeof data === "string") {
          message = data;
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        }
      }

      this.error = message;
      toast.error(message);
      return message;
    },

    async fetchUsers(roleFilter?: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken()
        const res = await axios.get<CommonResponseInterface<UserProfile[]>>(
          `${baseUrl}/profile`,
          {
            params: roleFilter ? { role: roleFilter } : undefined,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.users = res.data.data ?? [];
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async fetchUserById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken()
        const res = await axios.get<CommonResponseInterface<UserProfile>>(
          `${baseUrl}/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.selectedUser = res.data.data ?? null;
        return this.selectedUser;
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
    async fetchTopUpsByCustomerId(customerId: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();

        const res = await axios.get<
          CommonResponseInterface<TopUpResponseDTO[]>
        >(`${baseUrl}/profile/${customerId}/top-up`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.customerTopUps = res.data.data ?? [];
        return this.customerTopUps;

      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async fetchCustomers(name?: string, email?: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken()
        const res = await axios.get<CommonResponseInterface<UserProfile[]>>(
          `${baseUrl}/profile/get-customer`,
          {
            params: {
              name: name ?? "",
              email: email ?? "",
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.customers = res.data.data ?? [];
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async createUser(payload: AddUserProfileRequest) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken()
        const res = await axios.post<CommonResponseInterface<UserProfile>>(
          `${baseUrl}/profile/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === 200 || res.data.status === 201 || res.status === 201) {
          toast.success(res.data.message || "Account successfully created.");
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        if (res.data.data) {
          this.users.push(res.data.data);
        }

        return res.data.data;
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async updateUser(payload: UpdateUserProfileRequest) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken()
        const res = await axios.put<CommonResponseInterface<UserProfile>>(
          `${baseUrl}/profile/update`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message || "Account successfully updated.");
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        const updated = res.data.data;
        if (updated) {
          this.selectedUser = updated;
          // sync ke list users kalau ada
          const idx = this.users.findIndex((u) => u.id === updated.id);
          if (idx !== -1) {
            this.users[idx] = updated;
          }
        }

        return updated;
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
  },
});
