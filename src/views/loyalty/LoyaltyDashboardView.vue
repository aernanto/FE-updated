<template>
  <main class="flex flex-col px-20 pt-10 min-h-screen bg-gray-50">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Loyalty Dashboard</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
      <p class="text-gray-500 text-lg">Loading dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loyaltyStore.error" class="text-center py-20">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-600 font-semibold mb-2">Failed to load dashboard</p>
        <p class="text-sm text-gray-600">{{ loyaltyStore.error }}</p>
        <button
          @click="retryLoad"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboard" class="space-y-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Loyalty Points -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">Loyalty Points</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ dashboard.balance?.points || 0 }}</p>
        </div>

        <!-- Total Purchased -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div class="text-sm text-gray-600 mb-2">Total Purchased</div>
          <p class="text-3xl font-bold text-gray-800">{{ dashboard.totalPurchasedCoupons || 0 }}</p>
        </div>

        <!-- Active Coupons -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div class="text-sm text-gray-600 mb-2">Active Coupons</div>
          <p class="text-3xl font-bold text-green-600">{{ dashboard.activeCoupons || 0 }}</p>
        </div>

        <!-- Redeemed Coupons -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div class="text-sm text-gray-600 mb-2">Redeemed</div>
          <p class="text-3xl font-bold text-gray-500">{{ dashboard.redeemedCoupons || 0 }}</p>
        </div>
      </div>

      <!-- Available Coupons -->
      <div class="rounded-2xl overflow-hidden shadow-lg bg-white">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4">
          <h2 class="text-xl font-semibold">Available Coupons</h2>
        </div>
        <div class="p-6">
          <div v-if="!dashboard.availableCoupons || dashboard.availableCoupons.length === 0" class="text-center py-12 text-gray-500">
            No coupons available at the moment.
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="coupon in dashboard.availableCoupons"
              :key="coupon.id"
              class="border-2 border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-purple-300 transition-all"
            >
              <h3 class="font-bold text-lg text-gray-800 mb-2">{{ coupon.name }}</h3>
              <p class="text-sm text-gray-600 mb-4 min-h-[48px]">{{ coupon.description }}</p>

              <div class="space-y-2 mb-4 pb-4 border-b">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Points Required:</span>
                  <span class="text-lg font-bold text-purple-600">{{ coupon.points }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Discount:</span>
                  <span class="text-lg font-bold text-green-600">{{ coupon.percentOff }}%</span>
                </div>
              </div>

              <button
                @click="handlePurchase(coupon)"
                :disabled="dashboard.balance.points < coupon.points"
                class="w-full py-3 rounded-lg font-semibold transition-all"
                :class="
                  dashboard.balance.points >= coupon.points
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-md'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                "
              >
                {{ dashboard.balance.points >= coupon.points ? 'Purchase' : 'Insufficient Points' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- My Coupons -->
      <div class="rounded-2xl overflow-hidden shadow-lg bg-white">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4">
          <h2 class="text-xl font-semibold">My Coupons</h2>
        </div>
        <div class="p-6">
          <div v-if="!dashboard.purchasedCoupons || dashboard.purchasedCoupons.length === 0" class="text-center py-12 text-gray-500">
            You haven't purchased any coupons yet.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-purple-50 text-purple-800">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">Code</th>
                  <th class="px-4 py-3 text-left font-semibold">Coupon Name</th>
                  <th class="px-4 py-3 text-left font-semibold">Discount</th>
                  <th class="px-4 py-3 text-left font-semibold">Purchased Date</th>
                  <th class="px-4 py-3 text-left font-semibold">Status</th>
                  <th class="px-4 py-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="pc in dashboard.purchasedCoupons"
                  :key="pc.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3 font-mono text-xs">{{ pc.code }}</td>
                  <td class="px-4 py-3">{{ pc.couponName }}</td>
                  <td class="px-4 py-3 font-semibold text-green-600">{{ pc.percentOff }}%</td>
                  <td class="px-4 py-3">{{ formatDate(pc.purchasedDate) }}</td>
                  <td class="px-4 py-3">
                    <span
                      v-if="pc.usedDate"
                      class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600"
                    >
                      Used on {{ formatDate(pc.usedDate) }}
                    </span>
                    <span
                      v-else
                      class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
                    >
                      Active
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      @click="copyCouponCode(pc.code)"
                      class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition-colors"
                    >
                      Copy Code
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useLoyaltyStore } from "@/stores/loyalty.store";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "vue-sonner";

const loyaltyStore = useLoyaltyStore();

// 🔥 HARDCODE USER ID - GANTI INI SESUAI USER ID YANG ADA DI DATABASE
const HARDCODED_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

const dashboard = computed(() => loyaltyStore.dashboard);
const loading = computed(() => loyaltyStore.loading);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const copyCouponCode = (code: string) => {
  navigator.clipboard.writeText(code);
  toast.success("Coupon code copied to clipboard!");
};

const handlePurchase = async (coupon: any) => {
  if (!window.confirm(`Purchase "${coupon.name}" for ${coupon.points} points?`)) {
    return;
  }

  try {
    await loyaltyStore.purchaseCoupon({
      customerId: HARDCODED_USER_ID,
      couponId: coupon.id,
    });

    await loyaltyStore.fetchDashboard(HARDCODED_USER_ID);
    toast.success("Coupon purchased successfully!");
  } catch (error: any) {
    console.error("Purchase failed:", error);
    toast.error(error.message || "Failed to purchase coupon");
  }
};

const retryLoad = async () => {
  await loyaltyStore.fetchDashboard(HARDCODED_USER_ID);
};

onMounted(async () => {
  console.log("🚀 Mounting Loyalty Dashboard...");

  // Try to get real user first
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || HARDCODED_USER_ID;

  console.log("👤 Using User ID:", userId);

  try {
    await loyaltyStore.fetchDashboard(userId);
    console.log("✅ Dashboard loaded successfully");
  } catch (error) {
    console.error("❌ Failed to load dashboard:", error);
  }
});
</script>
