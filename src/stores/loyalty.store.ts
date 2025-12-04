import { defineStore } from "pinia";
import axios from "axios";
import { toast } from "vue-sonner";
import type { CommonResponseInterface } from "@/interface/common.response.interface";
import { getAuthToken } from "@/lib/auth";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface LoyaltyDashboard {
  customerId: string;
  balance: {
    customerId: string;
    points: number;
  };
  purchasedCoupons: PurchasedCoupon[];
  availableCoupons: Coupon[];
  totalPurchasedCoupons: number;
  activeCoupons: number;
  redeemedCoupons: number;
  availableCouponCount: number;
}

export interface Coupon {
  id: string;
  name: string;
  description: string;
  points: number;
  percentOff: number;
  createdDate: string;
  updatedDate: string;
}

export interface PurchasedCoupon {
  id: string;
  code: string;
  couponId: string;
  couponName: string;
  points: number;
  percentOff: number;
  customerId: string;
  purchasedDate: string;
  usedDate: string | null;
}

export interface CreateCouponRequest {
  name: string;
  description: string;
  points: number;
  percentOff: number;
}

export interface PurchaseCouponRequest {
  customerId: string;
  couponId: string;
}

export const useLoyaltyStore = defineStore("loyalty", {
  state: () => ({
    dashboard: null as LoyaltyDashboard | null,
    coupons: [] as Coupon[],
    purchasedCoupons: [] as PurchasedCoupon[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    resetError() {
      this.error = null;
    },

    parseError(error: unknown): string {
      let message = "Something went wrong";

      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: unknown } };
        const data = err.response?.data;

        if (typeof data === "string") {
          message = data;
        } else if (data && typeof data === 'object') {
          if ('message' in data && typeof data.message === 'string') {
            message = data.message;
          } else if ('error' in data && typeof data.error === 'string') {
            message = data.error;
          }
        }
      }

      this.error = message;
      toast.error(message);
      return message;
    },

    async fetchDashboard(userId: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.get<CommonResponseInterface<LoyaltyDashboard>>(
          `${baseUrl}/loyalty/dashboard/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        }

        this.dashboard = res.data.data;
        return this.dashboard;
      } catch (error: unknown) {
        const message = this.parseError(error);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async fetchCoupons() {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.get<CommonResponseInterface<Coupon[]>>(
          `${baseUrl}/loyalty/coupons`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        }

        this.coupons = res.data.data ?? [];
        return this.coupons;
      } catch (error: unknown) {
        const message = this.parseError(error);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async createCoupon(payload: CreateCouponRequest) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.post<CommonResponseInterface<Coupon>>(
          `${baseUrl}/loyalty/coupons`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201 || res.status === 201) {
          toast.success(res.data.message || "Coupon created successfully.");
        }

        if (res.data.data) {
          this.coupons.push(res.data.data);
        }

        return res.data.data;
      } catch (error: unknown) {
        const message = this.parseError(error);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async updateCoupon(id: string, payload: CreateCouponRequest) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.put<CommonResponseInterface<Coupon>>(
          `${baseUrl}/loyalty/coupons/${id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message || "Coupon updated successfully.");
        }

        const updated = res.data.data;
        if (updated) {
          const idx = this.coupons.findIndex((c) => c.id === updated.id);
          if (idx !== -1) this.coupons[idx] = updated;
        }

        return updated;
      } catch (error: unknown) {
        const message = this.parseError(error);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async purchaseCoupon(payload: PurchaseCouponRequest) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.post<CommonResponseInterface<PurchasedCoupon>>(
          `${baseUrl}/loyalty/coupons/purchase`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message || "Coupon purchased successfully.");
        }

        return res.data.data;
      } catch (error: unknown) {
        const message = this.parseError(error);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async fetchPurchasedCoupons(userId: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = getAuthToken();
        const res = await axios.get<CommonResponseInterface<PurchasedCoupon[]>>(
          `${baseUrl}/loyalty/coupons/purchased/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
        }

        this.purchasedCoupons = res.data.data ?? [];
        return this.purchasedCoupons;
      } catch (error: unknown) {
        const message = this.parseError(error);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
  },
});
