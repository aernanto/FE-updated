import { defineStore } from "pinia";
import axios from "axios";
import type { CreatePlanRequest } from "@/interface/plan.interface";
import type { TravelPlan } from "@/interface/plan.interface";
import type { CommonResponseInterface } from "@/interface/common.response.interface";
import { toast } from "vue-sonner";
import { getAuthToken } from "@/lib/auth";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

export const usePlanStore = defineStore("plan", {
  state: () => ({
    plans: [],
    selectedPlan: null as null | TravelPlan,
  }),
  actions: {
    async createPlan(packageId: string, payload: CreatePlanRequest) {
      try {
        const token = getAuthToken();
        const res = await axios.post<CommonResponseInterface<any>>(
          baseUrl + `/packages/${packageId}/plans`,
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

        return res.data;
      } catch (err: any) {
        let message = "Failed to create plan.";

        // 🌟 Tangkap berbagai bentuk pesan dari backend
        if (err.response) {
          const data = err.response.data;

          if (typeof data === "string") {
            message = data; // backend kirim plain string
          } else if (data?.message) {
            message = data.message; // backend kirim { message: "..." }
          } else if (data?.error) {
            message = data.error; // backend kirim { error: "..." }
          }
        }

        throw new Error(message);
      }
    },
    async getPlanById(id: String) {
      try {
        const token = getAuthToken();
        const res = await axios.get<CommonResponseInterface<any>>(
          baseUrl + `/plans/${id}`,
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
        this.selectedPlan = res.data.data;
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
    async deletePlan(id: string) {
      try {
        const token = getAuthToken();
        const res = await axios.delete<CommonResponseInterface<any>>(
          baseUrl + `/plans/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Ikuti pola updatePlan: cek status dari payload (fallback ke HTTP status)
        const ok =
          res.data?.status === 200 ||
          res.data?.status === 201 ||
          res.status === 200 ||
          res.status === 204;

        if (ok) {
          toast.success(res.data?.message ?? "Plan successfully deleted.");
        } else {
          const code = res.data?.status ?? res.status;
          const msg = res.data?.message ?? "Failed to delete plan";
          toast.error(`${code}: ${msg}`);
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
          } else {
            message = `HTTP ${err.response.status}`;
          }
        } else {
          message = err.message ?? "Unknown error";
        }

        throw new Error(message);
      }
    },
    async updatePlan(id: string, payload: any) {
      try {
        const token = getAuthToken();
        const res = await axios.put<CommonResponseInterface<any>>(
          baseUrl + `/plans/${id}`,
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
    async deleteOrderedQuantity(id: string) {
      try {
        const token = getAuthToken();
        const res = await axios.delete<CommonResponseInterface<any>>(
          baseUrl + `/ordered-activities/${id}/delete`,
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

  },
});
