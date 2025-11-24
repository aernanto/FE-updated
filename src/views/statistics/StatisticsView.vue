<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">📊 Revenue</h1>
    <div class="mb-6">
       <label class="font-bold">Year: </label>
       <input type="number" v-model="year" @change="load" class="border p-2 rounded w-24 ml-2">
    </div>
    <div v-if="stats" class="bg-white p-8 rounded shadow border text-center">
       <h2 class="text-gray-500 uppercase text-sm font-bold">Total Revenue ({{ stats.period }})</h2>
       <h1 class="text-5xl font-extrabold text-green-600 mt-2">Rp {{ stats.totalRevenue.toLocaleString('id-ID') }}</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
const year = ref(2025);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stats = ref<any>(null);
const load = async () => { try { const res = await api.getRevenue(year.value); stats.value = res.data; } catch {} };
onMounted(load);
</script>
