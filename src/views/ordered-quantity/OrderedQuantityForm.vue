<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow border mt-10">
    <h2 class="text-xl font-bold mb-4">Link Activity</h2>
    <form @submit.prevent="save" class="space-y-4">
      <select v-model="form.activityId" class="w-full border p-3 rounded" required>
        <option disabled value="">Select Activity</option>
        <option v-for="a in activities" :key="a.id" :value="a.id">{{ a.activityName }} - Rp {{ a.price }}</option>
      </select>
      <input v-model="form.orderedQuota" type="number" min="1" class="w-full border p-3 rounded" required placeholder="Quota">
      <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded font-bold">Link Activity</button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';

const route = useRoute(); const router = useRouter();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const activities = ref<any[]>([]);
const form = ref({ activityId: '', orderedQuota: 1 });

onMounted(async () => {
  const res = await api.getAllActivities();
  activities.value = res.data;
});

const save = async () => {
  try { await api.addOrderedQuantity(route.params.planId as string, form.value); router.push(`/packages/${route.params.packageId}`); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(e: any) { alert(e.response?.data?.message || "Failed"); }
};
</script>
