<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">Add Plan to Package</h1>
      <button @click="$router.back()" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Back
      </button>
    </div>

    <div class="card form-card">
      <form @submit.prevent="save" class="form-content">
        <div class="input-group">
          <label class="label">Plan Name (Optional)</label>
          <input v-model="form.planName" class="input" placeholder="e.g., Day 1: Arrival">
        </div>

        <div class="input-group">
          <label class="label">Activity Type</label>
          <select v-model="form.activityType" class="input select" required>
            <option value="Flight">Flight</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Vehicle Rental">Vehicle Rental</option>
          </select>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label">Start Location</label>
            <LocationSelector v-model="form.startLocation" required />
          </div>
          <div class="input-group">
            <label class="label">End Location</label>
            <LocationSelector v-model="form.endLocation" required />
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label">Start Date</label>
            <input type="datetime-local" v-model="form.startDate" class="input" required>
          </div>
          <div class="input-group">
            <label class="label">End Date</label>
            <input type="datetime-local" v-model="form.endDate" class="input" required>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.back()" class="btn btn-secondary">Cancel</button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <span v-if="loading" class="spinner-sm"></span>
            Create Plan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/services/api';
import { useRoute, useRouter } from 'vue-router';
import LocationSelector from '@/components/common/LocationSelector.vue';
import type { CreatePlanRequest } from '@/types';

const route = useRoute();
const router = useRouter();
const loading = ref(false);

const form = ref<CreatePlanRequest>({
  planName: '',
  activityType: 'Flight',
  startLocation: '',
  endLocation: '',
  startDate: '',
  endDate: ''
});

const save = async () => {
  if (new Date(form.value.startDate) >= new Date(form.value.endDate)) return alert("Start date must be before end date");

  loading.value = true;
  try {
    await api.createPlan(route.params.packageId as string, form.value);
    router.push(`/packages/${route.params.packageId}`);
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || 'Error creating plan');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.spinner-sm {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: var(--spacing-sm);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
</style>
