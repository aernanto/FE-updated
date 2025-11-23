<template>
  <div class="container" v-if="pkg">
    <div class="head-section">
      <button @click="$router.push('/packages')" class="back">← Packages</button>
      <div class="title-area">
         <h1>{{ pkg.packageName }}</h1>
         <span :class="['badge', pkg.status]">{{ pkg.status }}</span>
      </div>
      <div class="meta-grid">
         <div><strong>Start:</strong> {{ pkg.startDate }}</div>
         <div><strong>End:</strong> {{ pkg.endDate }}</div>
         <div><strong>Quota:</strong> {{ pkg.quota }} pax</div>
         <div class="price"><strong>Price:</strong> Rp {{ formatMoney(pkg.price) }}</div>
      </div>

      <div v-if="pkg.status === 'Pending'" class="pkg-actions">
         <button @click="processPkg" class="btn-proc">✅ Process Package</button>
         <button @click="$router.push(`/packages/${pkg.id}/plans/create`)" class="btn-add">+ Add Plan</button>
      </div>
    </div>

    <hr class="divider"/>

    <h3>🗓️ Plans & Activities</h3>
    <div v-if="!pkg.plans || pkg.plans.length === 0" class="empty">No plans yet. Add one above.</div>

    <div v-else class="plans-container">
      <div v-for="plan in pkg.plans" :key="plan.id" class="plan-card">
         <div class="plan-header">
            <h4>{{ plan.activityType }} <span class="tiny-badge">{{ plan.status }}</span></h4>
            <span class="plan-price">Rp {{ formatMoney(plan.price) }}</span>
         </div>
         <p class="loc">📍 {{ plan.startLocation }} ➔ {{ plan.endLocation }}</p>

         <div v-if="plan.status === 'Pending'" class="plan-ctrl">
            <button @click="goToLinkActivity(plan.id)" class="btn-sm link">🔗 Link Activity</button>
            <button @click="delPlan(plan.id)" class="btn-sm del">🗑️</button>
         </div>

         <div v-if="plan.orderedQuantities?.length > 0" class="activities-list">
            <div v-for="oq in plan.orderedQuantities" :key="oq.id" class="activity-row">
               <span>🔹 {{ oq.activityName }} ({{ oq.activityItem }})</span>
               <span>x{{ oq.orderedQuota }}</span>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import packageService from '@/services/packageService';
import planService from '@/services/planService';

const route = useRoute();
const router = useRouter();
const pkg = ref<any>(null);

const load = async () => {
  try {
    // Fetch detail package include plans & OQ
    const res = await packageService.getPackageById(route.params.id as string);
    pkg.value = res.data;
  } catch { alert("Failed to load package detail."); }
};

const processPkg = async () => {
  if(!confirm('Are you sure you want to PROCESS this package? Bill will be generated.')) return;
  try {
    await packageService.processPackage(pkg.value.id);
    alert("Success! Package Processed.");
    load();
  } catch(e: any) {
    alert("Failed: " + (e.response?.data?.message || "Plans not fulfilled?"));
  }
};

const delPlan = async (id: string) => {
  if(confirm('Delete this plan?')) {
    await planService.deletePlan(id);
    load();
  }
};

const goToLinkActivity = (planId: string) => {
    router.push(`/packages/${pkg.value.id}/plans/${planId}/ordered-quantity/create`);
};

const formatMoney = (v: number) => new Intl.NumberFormat('id-ID').format(v || 0);
onMounted(load);
</script>

<style scoped>
.container { max-width: 900px; margin: 20px auto; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); font-family: sans-serif; }
.head-section { margin-bottom: 20px; }
.title-area { display: flex; align-items: center; justify-content: space-between; }
.badge { padding: 6px 12px; border-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 0.9rem;}
.badge.Pending { background: #fff7ed; color: #c2410c; }
.badge.Processed { background: #dcfce7; color: #15803d; }
.meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; }
.price { color: #2563eb; font-size: 1.1rem; }
.pkg-actions { margin-top: 20px; display: flex; gap: 10px; }
.btn-proc { background: #059669; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.btn-add { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.divider { margin: 30px 0; border: 0; border-top: 1px solid #eee; }
.plans-container { display: grid; gap: 20px; }
.plan-card { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; background: white; }
.plan-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px; }
.tiny-badge { font-size: 0.7rem; background: #eee; padding: 2px 6px; border-radius: 4px; font-weight: normal; margin-left: 5px; }
.plan-price { color: #10b981; }
.loc { color: #64748b; margin: 5px 0; font-size: 0.9rem; }
.plan-ctrl { margin: 10px 0; display: flex; gap: 10px; }
.btn-sm { padding: 5px 10px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.btn-sm.link { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.btn-sm.del { background: #fef2f2; color: #ef4444; border-color: #fecaca; }
.activities-list { margin-top: 15px; background: #f1f5f9; padding: 10px; border-radius: 6px; }
.activity-row { display: flex; justify-content: space-between; font-size: 0.9rem; padding: 4px 0; border-bottom: 1px solid #e2e8f0; }
.back { background: none; border: none; color: #64748b; cursor: pointer; font-weight: bold; margin-bottom: 10px; }
</style>
