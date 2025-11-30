/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { Package, Plan, Activity, OrderedQuantity, RevenueStats, Coupon, PurchasedCoupon } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const api = {
  // --- PACKAGES ---
  getAllPackages() { return apiClient.get<Package[]>(`/packages`); },
  getPackageById(id: string) { return apiClient.get<Package>(`/packages/${id}`); },
  createPackage(data: any) { return apiClient.post(`/packages`, data); },
  updatePackage(id: string, data: any) { return apiClient.put(`/packages/${id}`, data); },
  deletePackage(id: string) { return apiClient.delete(`/packages/${id}`); },
  processPackage(id: string) { return apiClient.post(`/packages/${id}/process`); },

  // --- PLANS ---
  getPlansByPackageId(packageId: string) { return apiClient.get<Plan[]>(`/packages/${packageId}/plans`); },
  getPlanById(planId: string) { return apiClient.get<Plan>(`/plans/${planId}`); },
  createPlan(packageId: string, data: any) { return apiClient.post<Plan>(`/packages/${packageId}/plans`, data); },
  updatePlan(planId: string, data: any) { return apiClient.put<Plan>(`/plans/${planId}`, data); },
  deletePlan(planId: string) { return apiClient.delete(`/plans/${planId}`); },

  // --- ORDERED QUANTITIES (OrderedActivities) ---
  getOrderedActivitiesByPlanId(planId: string) { return apiClient.get<OrderedQuantity[]>(`/plans/${planId}/ordered-quantities`); },
  addOrderedQuantity(planId: string, data: any) { return apiClient.post<OrderedQuantity>(`/plans/${planId}/ordered-quantities`, data); },
  updateOrderedQuantity(id: string, data: any) { return apiClient.put<OrderedQuantity>(`/ordered-quantities/${id}`, data); },
  deleteOrderedQuantity(id: string) { return apiClient.delete(`/ordered-quantities/${id}`); },

  // --- ACTIVITIES ---
  getAllActivities(params?: any) { return apiClient.get<Activity[]>(`/activities`, { params }); },
  getActivityById(id: string) { return apiClient.get<Activity>(`/activities/${id}`); },
  createActivity(data: any) { return apiClient.post<Activity>(`/activities`, data); },
  updateActivity(id: string, data: any) { return apiClient.put<Activity>(`/activities/${id}`, data); },
  deleteActivity(id: string) { return apiClient.delete(`/activities/${id}`); },

  // --- STATISTICS ---
  getRevenue(year: number, month?: number) { return apiClient.get<RevenueStats | RevenueStats[]>(`/statistics/revenue`, { params: { year, month } }); },
  getYearlyRevenue(year: number) { return apiClient.get<RevenueStats[]>(`/statistics/revenue/yearly/${year}`); },
  getMonthlyRevenue(year: number, month: number) { return apiClient.get<RevenueStats>(`/statistics/revenue/monthly/${year}/${month}`); },

  // --- COUPONS ---
  getAllCoupons() { return apiClient.get<Coupon[]>(`/coupons`); },
  getCouponById(id: string) { return apiClient.get<Coupon>(`/coupons/${id}`); },
  getAvailableCoupons() { return apiClient.get<Coupon[]>(`/coupons/available`); },
  getMyCoupons(customerId: string) { return apiClient.get<PurchasedCoupon[]>(`/my-coupons`, { params: { customerId } }); },
  getPoints(customerId: string) { return apiClient.get<number>(`/loyalty-points`, { params: { customerId } }); },
  createCoupon(data: any) { return apiClient.post(`/coupons`, data); },
  updateCoupon(id: string, data: any) { return apiClient.put(`/coupons/${id}`, data); },
  purchaseCoupon(data: { customerId: string, couponId: string }) { return apiClient.post(`/purchase-coupon`, data); }
};


