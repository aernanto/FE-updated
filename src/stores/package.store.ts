import { defineStore } from 'pinia';
import axios from 'axios';
import type { CommonResponseInterface } from '@/interface/common.response.interface';
import { toast } from 'vue-sonner';
import { getAuthToken } from '@/lib/auth';

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

export const usePackageStore = defineStore("package", {
  state: () => ({
    packages: [],
    selectedPackage: null,
  }),

  actions: {
    async getAllPackages() {
      try {
        const token = getAuthToken()
        const res = await axios.get<CommonResponseInterface<any>>(baseUrl + "/packages",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        this.packages = res.data.data;

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.status + ": " + res.data.message)
        }
      } catch (err: any) {
        let message = "";

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            message = data;
          } else if (data?.message) {
            message = data.message;
          } else if (data?.error) {
            message = data.error;
          }
        }

        throw new Error(message);
      }
    },

    async getPackageById(id: string) {
      try {
        const token = getAuthToken();
        const res = await axios.get<CommonResponseInterface<any>>(baseUrl + `/packages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.selectedPackage = res.data.data;

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.status + ": " + res.data.message)
        }
      } catch (err: any) {
        let message = "";

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            message = data;
          } else if (data?.message) {
            message = data.message;
          } else if (data?.error) {
            message = data.error;
          }
        }

        throw new Error(message);
      }
    },
    async createPackage(payload: any) {
      try {
        const token = getAuthToken();
        const res = await axios.post<CommonResponseInterface<any>>(baseUrl + "/packages", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.status + ": " + res.data.message)
        }
        return res.data;
      } catch (err: any) {
        let message = "";

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            message = data;
          } else if (data?.message) {
            message = data.message;
          } else if (data?.error) {
            message = data.error;
          }
        }

        throw new Error(message);
      }
    },
    async deletePackage(id: string) {
      try {
        const token = getAuthToken();
        const res = await axios.delete<CommonResponseInterface<any>>(baseUrl + `/packages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.status + ": " + res.data.message)
        }
        return res.data;
      } catch (err: any) {
        let message = "";

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            message = data;
          } else if (data?.message) {
            message = data.message;
          } else if (data?.error) {
            message = data.error;
          }
        }

        throw new Error(message);
      }
    },
    async updatePackage(id: string, payload: any) {
      try {
        const token = getAuthToken();
        const res = await axios.put<CommonResponseInterface<any>>(baseUrl + `/packages/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.status + ": " + res.data.message)
        }
        return res.data.data;
      } catch (err: any) {
        let message = "";

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            message = data;
          } else if (data?.message) {
            message = data.message;
          } else if (data?.error) {
            message = data.error;
          }
        }

        throw new Error(message);
      }
    },
    async processPackage(id: string) {
      try {
        const token = getAuthToken();
        const res = await axios.post<CommonResponseInterface<any>>(baseUrl + `/packages/${id}/process`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.status + ": " + res.data.message)
        }
        return res.data.message;
      } catch (err: any) {
        let message = "";

        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            message = data;
          } else if (data?.message) {
            message = data.message;
          } else if (data?.error) {
            message = data.error;
          }
        }

        throw new Error(message);
      }
    },
  },
});
