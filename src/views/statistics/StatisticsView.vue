<template>
  <div class="page-container">
    <h1 class="heading-1 mb-lg">📊 Revenue Statistics</h1>

    <!-- Filters -->
    <div class="card filter-card">
      <div class="filter-group">
        <label class="label">Year</label>
        <select v-model="year" @change="load" class="input select">
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="label">Month</label>
        <select v-model="month" @change="load" class="input select">
          <option :value="null">All Months</option>
          <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
        </select>
      </div>
      <button @click="load" class="btn btn-primary refresh-btn">
        <i class="fas fa-sync-alt"></i> Refresh
      </button>
    </div>

    <!-- Summary Cards -->
    <div v-if="stats" class="stats-grid">
      <div class="stat-card revenue-card">
        <p class="stat-label">Total Revenue</p>
        <h2 class="stat-value">Rp {{ formatMoney(stats.totalRevenue) }}</h2>
        <p class="stat-period">{{ stats.period }}</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else-if="breakdown.length > 0" class="card chart-card">
      <h3 class="heading-3 mb-md">Monthly Breakdown ({{ year }})</h3>
      <div class="chart-container">
        <div v-for="(item, index) in breakdown" :key="index" class="chart-bar-wrapper group">
          <!-- Tooltip -->
          <div class="chart-tooltip">
            {{ months[index] }}: Rp {{ formatMoney(item) }}
          </div>
          <!-- Bar -->
          <div class="chart-bar" :style="{ height: `${(item / maxRevenue) * 100}%` }"></div>
          <!-- Label -->
          <span class="chart-label">{{ months[index]?.substring(0, 3) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import type { RevenueStats } from '@/types';

const year = ref(new Date().getFullYear());
const month = ref<number | null>(null);
const stats = ref<RevenueStats | null>(null);
const loading = ref(false);
const breakdown = ref<number[]>([]); // Stores revenue for each month 1-12
const maxRevenue = ref(1);

const years = [2023, 2024, 2025, 2026];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const load = async () => {
  loading.value = true;
  breakdown.value = [];
  try {
    // Fetch main stat
    const res = await api.getRevenue(year.value, month.value || undefined);
    // Handle potential array return or single object
    if (Array.isArray(res.data)) {
      stats.value = res.data[0] || null;
    } else {
      stats.value = res.data;
    }

    // If viewing a whole year, fetch monthly breakdown for chart
    if (!month.value) {
      const promises = [];
      for (let m = 1; m <= 12; m++) {
        promises.push(api.getRevenue(year.value, m).then(r => {
          const d = r.data;
          return Array.isArray(d) ? (d[0]?.totalRevenue || 0) : d.totalRevenue;
        }).catch(() => 0));
      }
      const results = await Promise.all(promises);
      breakdown.value = results;
      maxRevenue.value = Math.max(...results, 1);
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatMoney = (n: number) => n.toLocaleString('id-ID');

onMounted(load);
</script>

<style scoped>
.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.filter-card {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: flex-end;
  margin-bottom: var(--spacing-xl);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.refresh-btn {
  height: 42px;
  /* Match input height */
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  color: white;
  box-shadow: var(--shadow-md);
}

.revenue-card {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  margin-top: var(--spacing-xs);
}

.stat-period {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: var(--spacing-xs);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-xl);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chart-card {
  padding: var(--spacing-lg);
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.chart-container {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-xs);
  height: 300px;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
  padding-left: var(--spacing-md);
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  height: 100%;
}

.chart-tooltip {
  position: absolute;
  bottom: 100%;
  margin-bottom: var(--spacing-xs);
  background-color: #1f2937;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 10;
}

.chart-bar-wrapper:hover .chart-tooltip {
  opacity: 1;
}

.chart-bar {
  width: 100%;
  background-color: var(--primary-color);
  border-top-left-radius: var(--radius-sm);
  border-top-right-radius: var(--radius-sm);
  transition: height 0.3s ease, background-color 0.2s;
}

.chart-bar:hover {
  background-color: var(--primary-dark);
}

.chart-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
  transform: rotate(-45deg);
  transform-origin: top left;
  white-space: nowrap;
}
</style>
