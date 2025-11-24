<template>
  <div class="max-w-5xl mx-auto" v-if="pkg">
    <button @click="$router.push('/packages')" class="mb-4 text-blue-600 font-bold">← Back</button>

    <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">{{ pkg.packageName }}</h1>
        <span :class="['px-3 py-1 rounded font-bold', pkg.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800']">{{ pkg.status }}</span>
      </div>
      <div class="grid grid-cols-2 gap-4 text-gray-600">
         <p>💰 Total: <span class="text-green-600 font-bold">Rp {{ formatMoney(pkg.price) }}</span></p>
         <p>👥 Quota: {{ pkg.quota }}</p>
         <p>📅 Start: {{ formatDate(pkg.startDate) }}</p>
         <p>🏁 End: {{ formatDate(pkg.endDate) }}</p>
      </div>
      <div v-if="pkg.status === 'Pending'" class="mt-6 flex gap-3">
         <button @click="process" class="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Process Package</button>
         <button @click="$router.push(`/packages/${pkg.id}/plans/create`)" class="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">+ Add Plan</button>
      </div>
    </div>

    <h2 class="text-2xl font-bold mb-4">🗓️ Plans & Activities</h2>
    <div v-if="pkg.plans.length === 0" class="text-center p-8 bg-gray-100 rounded text-gray-500">No plans yet.</div>

    <div class="space-y-4">
      <div v-for="plan in pkg.plans" :key="plan.id" class="bg-white p-5 rounded-lg shadow border">
        <div class="flex justify-between border-b pb-2 mb-3">
           <h3 class="font-bold text-lg text-blue-800">{{ plan.activityType }}</h3>
           <span class="text-green-600 font-bold">Rp {{ formatMoney(plan.price) }}</span>
        </div>
        <p class="text-sm mb-3">📍 {{ plan.startLocation }} ➔ {{ plan.endLocation }}</p>

        <div v-if="plan.status === 'Pending'" class="flex gap-2 mb-3">
           <button @click="linkAct(plan.id)" class="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm border border-blue-200 font-bold">🔗 Add Activity</button>
           <button @click="delPlan(plan.id)" class="bg-red-50 text-red-700 px-3 py-1 rounded text-sm border border-red-200 font-bold">Delete Plan</button>
        </div>

        <div v-if="plan.orderedQuantities.length > 0" class="bg-gray-50 p-3 rounded">
           <div v-for="oq in plan.orderedQuantities" :key="oq.id" class="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
              <span>{{ oq.activityName }} (x{{ oq.orderedQuota }})</span>
              <div class="flex items-center gap-2">
                 <span>Rp {{ formatMoney(oq.price * oq.orderedQuota) }}</span>
                 <button v-if="plan.status === 'Pending'" @click="delOq(oq.id)" class="text-red-500 font-bold">×</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import type { Package } from '@/types';

const route = useRoute(); const router = useRouter();
const pkg = ref<Package | null>(null);

const load = async () => { try { const res = await api.getPackageById(route.params.id as string); pkg.value = res.data; } catch { alert("Error"); } };
const process = async () => { if(confirm("Process?")) { await api.processPackage(pkg.value!.id); load(); } };
const delPlan = async (id: string) => { if(confirm("Delete plan?")) { await api.deletePlan(id); load(); } };
const delOq = async (id: string) => { if(confirm("Remove activity?")) { await api.deleteOrderedQuantity(id); load(); } };
const linkAct = (pid: string) => router.push(`/packages/${pkg.value!.id}/plans/${pid}/ordered-quantity/create`);
const formatMoney = (n: number) => n.toLocaleString('id-ID');
const formatDate = (d: string) => new Date(d).toLocaleDateString();

onMounted(load);
</script>
