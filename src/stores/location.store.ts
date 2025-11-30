import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue-sonner";
import type { CommonResponseInterface } from "@/interface/common.response.interface";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

export const useLocationStore = defineStore("location", {
  state: () => ({
    listOfLocations: [] as string[], // ["Aceh - Kabupaten Aceh Barat", ...]
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchLocations() {
      this.loading = true;
      this.error = null;

      try {
        // Backend endpoint — misalnya GET /api/locations/all
        const res = await axios.get<CommonResponseInterface<string[]>>(baseUrl + "/locations");
        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message)
        } else {
          toast.error(res.data.status + ": " + res.data.message)
        }
        this.listOfLocations = res.data.data!; // array of string
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
      } finally {
        this.loading = false;
      }
    },
  },
});
