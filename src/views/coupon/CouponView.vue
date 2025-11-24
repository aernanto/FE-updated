<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
      <div>
        <h1 class="text-2xl font-bold text-blue-900">🎫 Loyalty & Coupons</h1>
        <p class="text-blue-600">Welcome, {{ customerId }}</p>
      </div>
      <div class="text-right">
        <span class="block text-sm text-gray-500 uppercase font-bold">Your Points</span>
        <span class="text-4xl font-extrabold text-blue-600">{{ points }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">🛍️ Available to Buy</h2>
        <div v-if="coupons.length === 0" class="text-gray-500 italic">No coupons available.</div>
        <div v-else class="space-y-4">
          <div v-for="c in coupons" :key="c.id" class="bg-white border p-4 rounded shadow hover:shadow-md transition flex justify-between items-center">
            <div>
              <h3 class="font-bold text-lg">{{ c.name }}</h3>
              <p class="text-sm text-gray-600">{{ c.description }}</p>
              <div class="mt-2 text-green-600 font-bold text-sm">{{ c.percentOff }}% OFF</div>
            </div>
            <button @click="buy(c)" class="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-700 transition flex flex-col items-center min-w-[80px]">
              <span>Buy</span>
              <span class="text-xs font-normal opacity-90">{{ c.points }} Pts</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">🎒 My Wallet</h2>
        <div v-if="myCoupons.length === 0" class="text-gray-500 italic">You haven't bought any coupons.</div>
        <div v-else class="space-y-4">
          <div v-for="mc in myCoupons" :key="mc.id" class="bg-white border border-gray-200 p-4 rounded shadow-sm relative overflow-hidden">
            <div v-if="mc.isUsed" class="absolute inset-0 bg-gray-100/80 flex items-center justify-center z-10">
              <span class="bg-gray-600 text-white px-3 py-1 rounded font-bold text-sm transform -rotate-12">USED</span>
            </div>
            <div class="flex justify-between">
              <div>
                <h3 class="font-bold text-gray-800">{{ mc.coupon.name }}</h3>
                <p class="text-xs text-gray-500">{{ mc.coupon.percentOff }}% OFF</p>
              </div>
              <div class="text-right">
                <span class="block text-xs text-gray-400">CODE:</span>
                <span class="font-mono font-bold text-blue-600 text-lg tracking-wider">{{ mc.uniqueCode }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import type { Coupon, PurchasedCoupon } from '@/types';

const customerId = 'user-1'; // Hardcode sesuai dummy data
const points = ref(0);
const coupons = ref<Coupon[]>([]);
const myCoupons = ref<PurchasedCoupon[]>([]);

const load = async () => {
  try {
    const [ptsRes, cpnRes, myRes] = await Promise.all([
      api.getPoints(customerId),
      api.getAllCoupons(),
      api.getMyCoupons(customerId)
    ]);
    points.value = ptsRes.data;
    coupons.value = cpnRes.data;
    myCoupons.value = myRes.data;
  } catch { alert("Error loading data"); }
};

const buy = async (c: Coupon) => {
  if (points.value < c.points) {
    alert("Not enough points!");
    return;
  }
  if (confirm(`Buy ${c.name} for ${c.points} points?`)) {
    try {
      await api.purchaseCoupon({ customerId, couponId: c.id });
      alert("Success!");
      load();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      alert("Failed: " + e.response?.data);
    }
  }
};

onMounted(load);
</script>
