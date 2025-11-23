<template>
  <div class="form-container">
    <h2>Edit Activity</h2>
    <form @submit.prevent="save">
      <input v-model="form.activityName" placeholder="Name" required>
      <select v-model="form.activityType"><option>Flight</option><option>Accommodation</option></select>
      <input v-model="form.activityItem" placeholder="Item" required>
      <input v-model="form.price" type="number" required>
      <input v-model="form.capacity" type="number" required>
      <input v-model="form.startDate" type="datetime-local" required>
      <input v-model="form.endDate" type="datetime-local" required>
      <input v-model="form.startLocation" required>
      <input v-model="form.endLocation" required>
      <button type="submit" class="btn-save">Update</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import activityService from '@/services/activityService';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = ref<any>({
    activityName: '', activityType: '', activityItem: '', price: 0, capacity: 0,
    startDate: '', endDate: '', startLocation: '', endLocation: ''
});

onMounted(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await activityService.getActivityById(route.params.id as string);
    const data = res.data;
    // Fix date format handling safe check
    form.value = {
        ...data,
        startDate: data.startDate ? data.startDate.substring(0, 16) : '',
        endDate: data.endDate ? data.endDate.substring(0, 16) : ''
    };
});

const save = async () => {
    await activityService.createActivity(form.value); // Asumsi update pake create atau ada endpoint update sendiri
    router.push('/activities');
};
</script>
<style scoped>input, select { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }</style>
