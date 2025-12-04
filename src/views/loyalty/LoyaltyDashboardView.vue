<template>
  <main class="flex flex-col px-20 pt-10">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Loyalty Dashboard</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Loading dashboard...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboard">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Loyalty Points -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">Loyalty Points</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ dashboard.balance.points }}</p>
        </div>

        <!-- Total Purchased -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div class="text-sm text-gray-600 mb-2">Total Purchased</div>
          <p class="text-3xl font-bold text-gray-800">{{ dashboard.totalPurchasedCoupons }}</p>
        </div>

        <!-- Active Coupons -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div class="text-sm text-gray-600 mb-2">Active Coupons</div>
          <p class="text-3xl font-bold text-green-600">{{ dashboard.activeCoupons }}</p>
        </div>

        <!-- Redeemed Coupons -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div class="text-sm text-gray-600 mb-2">Redeemed</div>
          <p class="text-3xl font-bold text-gray-500">{{ dashboard.redeemedCoupons }}</p>
        </div>
      </div>

      <!-- Available Coupons -->
      <div class="rounded-2xl overflow-hidden shadow mb-8">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold">
          Available Coupons
        </div>
        <div class="bg-white p-6">
          <div v-if="dashboard.availableCoupons.length === 0" class="text-center py-8 text-gray-500">
            No coupons available at the moment.
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="coupon in dashboard.availableCoupons"
              :key="coupon.id"
              class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
            >
              <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ coupon.name }}</h3>
              <p class="text-sm text-gray-600 mb-3">{{ coupon.description }}</p>
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-600">Points Required:</span>
                <span class="font-bold text-indigo-600">{{ coupon.points }}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-gray-600">Discount:</span>
                <span class="font-bold text-green-600">{{ coupon.percentOff }}%</span>
              </div>
              <button
                @click="handlePurchase(coupon)"
                :disabled="dashboard.balance.points < coupon.points"
                class="w-full py-2 rounded-lg font-semibold transition-all"
                :class="
                  dashboard.balance.points >= coupon.points
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90'
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
      <div class="rounded-2xl overflow-hidden shadow">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold">
          My Coupons
        </div>
        <div class="bg-white p-6">
          <div v-if="dashboard.purchasedCoupons.length === 0" class="text-center py-8 text-gray-500">
            You haven't purchased any coupons yet.
          </div>
          <table v-else class="w-full text-sm">
            <thead class="bg-purple-50 text-purple-800">
              <tr>
                <th class="px-4 py-3 text-left">Code</th>
                <th class="px-4 py-3 text-left">Coupon Name</th>
                <th class="px-4 py-3 text-left">Discount</th>
                <th class="px-4 py-3 text-left">Purchased Date</th>
                <th class="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="pc in dashboard.purchasedCoupons"
                :key="pc.id"
                class="border-b hover:bg-gray-50"
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
              </tr>
            </tbody>
          </table>
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
const currentUser = getCurrentUser();

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

const handlePurchase = async (coupon: any) => {
  if (!currentUser?.id) {
    toast.error("User not found");
    return;
  }

  if (!window.confirm(`Purchase "${coupon.name}" for ${coupon.points} points?`)) {
    return;
  }

  try {
    await loyaltyStore.purchaseCoupon({
      customerId: currentUser.id,
      couponId: coupon.id,
    });

    await loyaltyStore.fetchDashboard(currentUser.id);
  } catch (error) {
    console.error("Purchase failed:", error);
  }
};

onMounted(async () => {
  if (currentUser?.id) {
    await loyaltyStore.fetchDashboard(currentUser.id);
  }
});
</script>
