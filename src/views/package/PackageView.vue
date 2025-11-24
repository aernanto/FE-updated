<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">📦 Packages</h1>
      <button @click="$router.push('/packages/create')" class="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 font-bold transition">+ New Package</button>
    </div>

    <div v-if="loading" class="text-center py-10 text-gray-500">Loading...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="pkg in packages" :key="pkg.id" class="bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer" @click="$router.push(`/packages/${pkg.id}`)">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-xl font-bold text-gray-900 truncate">{{ pkg.packageName }}</h3>
          <span :class="['text-xs font-bold px-2 py-1 rounded uppercase', pkg.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800']">{{ pkg.status }}</span>
        </div>
        <div class="text-sm text-gray-600 space-y-2">
          <p>📅 {{ formatDate(pkg.startDate) }}</p>
          <p>💰 <span class="font-bold text-green-600">Rp {{ formatMoney(pkg.price) }}</span></p>
        </div>
        <div class="mt-4 pt-3 border-t flex justify-end">
           <button v-if="pkg.status === 'Pending'" @click.stop="del(pkg.id)" class="text-red-500 hover:text-red-700 font-bold text-sm">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import type { Package } from '@/types';

const packages = ref<Package[]>([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try { const res = await api.getAllPackages(); packages.value = res.data; }
  catch { alert("Error connection"); } finally { loading.value = false; }
};

const del = async (id: string) => { if(confirm("Delete?")) { await api.deletePackage(id); load(); } };
const formatDate = (d: string) => new Date(d).toLocaleDateString();
const formatMoney = (n: number) => n.toLocaleString('id-ID');
onMounted(load);
</script>
