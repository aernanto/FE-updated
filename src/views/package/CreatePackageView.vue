<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow border">
    <h2 class="text-2xl font-bold mb-6">Create New Package</h2>
    <form @submit.prevent="save" class="space-y-4">
      <input v-model="form.userId" placeholder="User ID (e.g. admin)" class="w-full border p-3 rounded" required>
      <input v-model="form.packageName" placeholder="Package Name" class="w-full border p-3 rounded" required>
      <div class="grid grid-cols-2 gap-4">
        <input v-model="form.quota" type="number" placeholder="Quota" class="border p-3 rounded" required>
        <input v-model="form.price" type="number" placeholder="Base Price" class="border p-3 rounded" required>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label>Start</label><input type="date" v-model="form.startDate" class="w-full border p-3 rounded" required></div>
        <div><label>End</label><input type="date" v-model="form.endDate" class="w-full border p-3 rounded" required></div>
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 mt-4">Save</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ userId: 'admin', packageName: '', quota: 10, price: 0, startDate: '', endDate: '' });

const save = async () => {
  try { await api.createPackage(form.value); router.push('/packages'); }
  catch { alert('Error creating package'); }
};
</script>
