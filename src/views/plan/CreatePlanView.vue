<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-xl shadow border mt-10">
    <h2 class="text-xl font-bold mb-4">Add Plan to Package</h2>
    <form @submit.prevent="save" class="space-y-4">
      <select v-model="form.activityType" class="w-full border p-3 rounded" required>
         <option>Flight</option><option>Accommodation</option><option>Vehicle Rental</option>
      </select>
      <input v-model="form.startLocation" placeholder="Start Location" class="w-full border p-3 rounded" required>
      <input v-model="form.endLocation" placeholder="End Location" class="w-full border p-3 rounded" required>
      <div class="grid grid-cols-2 gap-4">
        <input type="datetime-local" v-model="form.startDate" class="border p-3 rounded" required>
        <input type="datetime-local" v-model="form.endDate" class="border p-3 rounded" required>
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded font-bold">Create Plan</button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/services/api';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute(); const router = useRouter();
const form = ref({ activityType: 'Flight', startLocation: '', endLocation: '', startDate: '', endDate: '', price: 0 });
const save = async () => {
  try { await api.createPlan(route.params.packageId as string, form.value); router.push(`/packages/${route.params.packageId}`); }
  catch { alert('Error creating plan'); }
};
</script>
