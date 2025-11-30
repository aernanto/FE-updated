<template>
  <div class="page-container">
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="heading-1 text-primary">🎫 Loyalty & Coupons</h1>
        <p class="text-primary-light">Welcome, {{ customerId }}</p>
      </div>
      <div class="points-display">
        <span class="points-label">Your Points</span>
        <span class="points-value">{{ points }}</span>
      </div>
    </div>

    <div class="grid-layout">
      <div class="column">
        <h2 class="heading-2 mb-md flex-center">🛍️ Available to Buy</h2>
        <div v-if="coupons.length === 0" class="empty-text">No coupons available.</div>
        <div v-else class="card-list">
          <div v-for="c in coupons" :key="c.id" class="card coupon-card">
            <div class="coupon-info">
              <h3 class="heading-3">{{ c.name }}</h3>
              <p class="description">{{ c.description }}</p>
              <div class="discount-badge">{{ c.percentOff }}% OFF</div>
            </div>
            <div class="coupon-actions">
              <button @click="buy(c)" class="btn btn-primary buy-btn">
                <span>Buy</span>
                <span class="points-cost">{{ c.points }} Pts</span>
              </button>
              <button @click="$router.push(`/coupons/${c.id}/edit`)" class="btn btn-secondary btn-sm w-full">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="column">
        <h2 class="heading-2 mb-md flex-center">🎒 My Wallet</h2>
        <div v-if="myCoupons.length === 0" class="empty-text">You haven't bought any coupons.</div>
        <div v-else class="card-list">
          <div v-for="mc in myCoupons" :key="mc.id" class="card wallet-card">
            <div v-if="mc.isUsed" class="used-overlay">
              <span class="used-badge">USED</span>
            </div>
            <div class="wallet-content">
              <div>
                <h3 class="heading-3 text-dark">{{ mc.coupon.name }}</h3>
                <p class="discount-text">{{ mc.coupon.percentOff }}% OFF</p>
              </div>
              <div class="code-section">
                <span class="code-label">CODE:</span>
                <span class="code-value">{{ mc.uniqueCode }}</span>
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

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  background-color: #eff6ff;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid #dbeafe;
}

.text-primary {
  color: #1e3a8a;
}

.text-primary-light {
  color: #2563eb;
}

.points-display {
  text-align: right;
}

.points-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 700;
}

.points-value {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--primary-color);
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

@media (min-width: 1024px) {
  .grid-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.flex-center {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.empty-text {
  color: var(--text-secondary);
  font-style: italic;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.coupon-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
}

.coupon-info {
  flex: 1;
}

.description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.discount-badge {
  color: var(--success-color);
  font-weight: 700;
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}

.coupon-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 100px;
}

.buy-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.points-cost {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.9;
}

.wallet-card {
  position: relative;
  overflow: hidden;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
}

.used-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(243, 244, 246, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.used-badge {
  background-color: #4b5563;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.875rem;
  transform: rotate(-12deg);
}

.wallet-content {
  display: flex;
  justify-content: space-between;
}

.text-dark {
  color: var(--text-primary);
}

.discount-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.code-section {
  text-align: right;
}

.code-label {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
}

.code-value {
  font-family: monospace;
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.125rem;
  letter-spacing: 0.05em;
}

.w-full {
  width: 100%;
}
</style>
