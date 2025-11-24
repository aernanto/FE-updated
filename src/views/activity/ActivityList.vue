<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between mb-6">
       <h1 class="text-2xl font-bold">📋 Master Activities</h1>
       <button @click="$router.push('/activities/create')" class="bg-blue-600 text-white px-4 py-2 rounded font-bold">+ New</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div v-for="a in activities" :key="a.id" class="bg-white p-4 rounded shadow border hover:shadow-md">
          <h3 class="font-bold text-lg">{{ a.activityName }}</h3>
          <span class="bg-gray-100 text-xs px-2 py-1 rounded uppercase font-bold text-gray-600">{{ a.activityType }}</span>
          <p class="text-sm mt-2">{{ a.activityItem }}</p>
          <p class="text-green-600 font-bold mt-2">Rp {{ a.price.toLocaleString() }}</p>
          <button @click="del(a.id)" class="text-red-500 text-sm mt-2 hover:underline">Delete</button>
       </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const activities = ref<any[]>([]);
const load = async () => { const res = await api.getAllActivities(); activities.value = res.data; };
const del = async (id: string) => { if(confirm('Delete?')) { await api.deleteActivity(id); load(); } };
onMounted(load);
</script>
