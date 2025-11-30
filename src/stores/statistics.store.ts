import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue-sonner";
import type {
  RevenueStatisticResponse,
  MonthlyRevenueResponse,
} from "@/interface/revenue.statistic.interface";
import type { CommonResponseInterface } from "@/interface/common.response.interface";
import { getAuthToken } from "@/lib/auth";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const useStatisticsStore = defineStore("statistics", {
  state: () => ({
    // /statistics/revenue?year=&month=
    revenueStats: [] as RevenueStatisticResponse[],
    // /statistics/revenue/yearly/{year}
    yearlyRevenue: [] as MonthlyRevenueResponse[],
    // /statistics/revenue/monthly/{year}/{month}
    monthlyBreakdown: [] as RevenueStatisticResponse[],
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

    async fetchRevenueStatistics(year: number, month?: number) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const params: any = { year };
        if (month) params.month = month;

        const res = await axios.get<
          CommonResponseInterface<RevenueStatisticResponse[]>
        >(`${baseUrl}/statistics/revenue`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.revenueStats = res.data.data ?? [];
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async fetchYearlyRevenue(year: number) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();

        const res = await axios.get<
          CommonResponseInterface<MonthlyRevenueResponse[]>
        >(`${baseUrl}/statistics/revenue/yearly/${year}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.yearlyRevenue = res.data.data ?? [];
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async fetchMonthlyRevenue(year: number, month: number) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();

        const res = await axios.get<
          CommonResponseInterface<RevenueStatisticResponse[]>
        >(`${baseUrl}/statistics/revenue/monthly/${year}/${month}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(`${res.data.status}: ${res.data.message}`);
        }

        this.monthlyBreakdown = res.data.data ?? [];
      } catch (err: any) {
        const message = this.parseError(err);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
  },
});
