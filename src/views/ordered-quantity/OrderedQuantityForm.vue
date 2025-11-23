<script setup lang="ts">
import { ref, onMounted } from 'vue';
import activityService from '@/services/activityService';
import planService from '@/services/planService';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const activities = ref<any[]>([]);
const form = ref({ activityId: '', orderedQuota: 1 });

onMounted(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await activityService.getAllActivities();
  activities.value = res.data;
});

const save = async () => {
  try {
    // Method ini sudah ada di service yang baru
    await planService.addOrderedQuantity(route.params.planId as string, form.value);
    router.push(`/packages/${route.params.packageId}`);
  } catch(e: any) {
    alert(e.response?.data?.message || 'Error');
  }
};
</script>

<template>
  <div class="form-container">
    <h2>Link Activity</h2>
    <form @submit.prevent="save">
      <label>Activity</label>
      <select v-model="form.activityId" required>
        <option disabled value="">Select...</option>
        <option v-for="a in activities" :key="a.id" :value="a.id">
          {{ a.activityName }} - Rp {{ a.price }}
        </option>
      </select>
      <label>Quota</label>
      <input type="number" v-model="form.orderedQuota" min="1" required>
      <button type="submit">Link</button>
    </form>
  </div>
</template>

<style scoped>
.form-container { max-width: 500px; margin: 20px auto; padding: 20px; background: white; }
input, select { width: 100%; padding: 8px; margin-bottom: 10px; display: block; }
button { width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; cursor: pointer;}
</style>
