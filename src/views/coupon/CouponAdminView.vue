<template>
  <div class="p-6 max-w-xl mx-auto mt-10 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4">Create New Coupon</h2>
    <form @submit.prevent="save" class="space-y-4">
      <input v-model="form.name" placeholder="Coupon Name" class="w-full border p-2 rounded" required>
      <input v-model="form.description" placeholder="Description" class="w-full border p-2 rounded" required>
      <div class="grid grid-cols-2 gap-4">
        <input type="number" v-model="form.points" placeholder="Points Cost" class="w-full border p-2 rounded" required>
        <input type="number" v-model="form.percentOff" placeholder="% Discount" class="w-full border p-2 rounded" step="0.1" required>
      </div>
      <button class="w-full bg-blue-600 text-white p-2 rounded font-bold">Create</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ name: '', description: '', points: 100, percentOff: 10 });

const save = async () => {
  try { await api.createCoupon(form.value); router.push('/coupons'); }
  catch { alert("Error"); }
};
</script>
