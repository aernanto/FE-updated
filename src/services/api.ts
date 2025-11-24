/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { Package, Plan, Activity, OrderedQuantity, RevenueStats, Coupon, PurchasedCoupon } from '@/types';

const API_URL = 'http://localhost:8080/api';

export const api = {
  // --- PACKAGES ---
  getAllPackages() { return axios.get<Package[]>(`${API_URL}/packages`); },
  getPackageById(id: string) { return axios.get<Package>(`${API_URL}/packages/${id}`); },
  createPackage(data: any) { return axios.post(`${API_URL}/packages`, data); },
  updatePackage(id: string, data: any) { return axios.put(`${API_URL}/packages/${id}`, data); },
  deletePackage(id: string) { return axios.delete(`${API_URL}/packages/${id}`); },
  processPackage(id: string) { return axios.post(`${API_URL}/packages/${id}/process`); },

  // --- PLANS ---
  createPlan(packageId: string, data: any) { return axios.post<Plan>(`${API_URL}/packages/${packageId}/plans`, data); },
  deletePlan(planId: string) { return axios.delete(`${API_URL}/plans/${planId}`); },

  // --- ORDERED QUANTITIES ---
  addOrderedQuantity(planId: string, data: any) { return axios.post<OrderedQuantity>(`${API_URL}/plans/${planId}/ordered-quantities`, data); },
  deleteOrderedQuantity(id: string) { return axios.delete(`${API_URL}/ordered-quantities/${id}`); },

  // --- ACTIVITIES ---
  getAllActivities() { return axios.get<Activity[]>(`${API_URL}/activities`); },
  createActivity(data: any) { return axios.post<Activity>(`${API_URL}/activities`, data); },
  deleteActivity(id: string) { return axios.delete(`${API_URL}/activities/${id}`); },

  // --- STATISTICS ---
  getRevenue(year: number) { return axios.get<RevenueStats>(`${API_URL}/statistics/revenue`, { params: { year } }); },

  // --- COUPONS ---
  getAllCoupons() { return axios.get<Coupon[]>(`${API_URL}/coupons`); },
  getMyCoupons(customerId: string) { return axios.get<PurchasedCoupon[]>(`${API_URL}/my-coupons`, { params: { customerId } }); },
  getPoints(customerId: string) { return axios.get<number>(`${API_URL}/loyalty-points`, { params: { customerId } }); },
  createCoupon(data: any) { return axios.post(`${API_URL}/coupons`, data); },
  purchaseCoupon(data: {customerId: string, couponId: string}) { return axios.post(`${API_URL}/purchase-coupon`, data); }
};


