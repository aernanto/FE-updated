<script setup lang="ts">
import { ref, onMounted } from 'vue';
import statisticsService from '@/services/statisticsService';

const year = ref(2025);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stats = ref<any>(null);

const loadStats = async () => {
  try {
    const res = await statisticsService.getRevenue(year.value);
    stats.value = res.data;
  } catch(e) { console.error(e); }
};

const formatMoney = (v: number) => new Intl.NumberFormat('id-ID').format(v);
onMounted(loadStats);
</script>

<template>
  <div class="container">
    <h1>Revenue Stats</h1>
    <input type="number" v-model="year" @change="loadStats">

    <div v-if="stats" class="card">
      <h2>Total: Rp {{ formatMoney(stats.totalRevenue) }}</h2>
      <div v-for="(val, key) in stats.breakdown" :key="key">
        {{ key }}: Rp {{ formatMoney(val as number) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 800px; margin: 20px auto; padding: 20px; }
.card { border: 1px solid #ddd; padding: 20px; margin-top: 20px; }
</style>
