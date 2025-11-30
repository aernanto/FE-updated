import { defineStore } from "pinia";
import axios from "axios";
import type { CreateOrderedActivityRequest, UpdateOrderedActivityRequest } from "@/interface/ordered.activity.interface";
import type { CommonResponseInterface } from "@/interface/common.response.interface";
import { toast } from "vue-sonner";
import { getAuthToken } from "@/lib/auth";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

export const useOrderedStore = defineStore("ordered", {
  state: () => ({
    availableActivities: [] as any[], // hasil filter activity yang bisa dipilih
  }),

  actions: {
    // 🔹 Get filtered activities untuk Add Activity modal
    async getAvailableActivities(planId: string) {
      try {
        const token = getAuthToken();
        const res = await axios.get<CommonResponseInterface<any[]>>
          (`${baseUrl}/activities/available/${planId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.status + ": " + res.data.message)
        }
        this.availableActivities = res.data.data;
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

    // 🔹 Create new Ordered Activity
    async createOrderedActivity(payload: CreateOrderedActivityRequest) {
      try {
        const token = getAuthToken();
        // Extract planId from payload
        const planId = payload.planId;
        const res = await axios.post<CommonResponseInterface<any>>(
          baseUrl + `/plans/${planId}/ordered-quantities`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
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

    // 🔹 Soft delete Ordered Activity
    async deleteOrderedActivity(id: string) {
      try {
        const token = getAuthToken();
        const res = await axios.delete<CommonResponseInterface<any>>(
          baseUrl + `/ordered-quantities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

    async updateOrderedActivity(id: string, payload: UpdateOrderedActivityRequest) {
      try {
        const token = getAuthToken();
        const newQuota = payload.orderedQuota; // Assuming payload has orderedQuota
        const res = await axios.put<CommonResponseInterface<any>>(
          baseUrl + `/ordered-quantities/${id}?newQuota=${newQuota}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
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
    }
  },
});
