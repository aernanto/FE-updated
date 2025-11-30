<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">Edit Activity</h1>
      <button @click="$router.push('/activities')" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Back
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading activity details...</p>
    </div>

    <div v-else class="card form-card">
      <form @submit.prevent="save" class="form-content">
        <div class="form-row">
          <div class="input-group">
            <label class="label">Activity Name</label>
            <input v-model="form.activityName" class="input" required>
          </div>
          <div class="input-group">
            <label class="label">Activity Type</label>
            <input v-model="form.activityType" class="input disabled" disabled>
            <p class="helper-text">Activity Type cannot be changed.</p>
          </div>
        </div>

        <div class="input-group">
          <label class="label">Activity Item</label>
          <input v-model="form.activityItem" class="input" required>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label">Price (IDR)</label>
            <input v-model.number="form.price" type="number" min="0" class="input" required>
          </div>
          <div class="input-group">
            <label class="label">Capacity</label>
            <input v-model.number="form.capacity" type="number" min="1" class="input" required>
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label">Start Date</label>
            <input v-model="form.startDate" type="datetime-local" class="input" required>
          </div>
          <div class="input-group">
            <label class="label">End Date</label>
            <input v-model="form.endDate" type="datetime-local" class="input" required>
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label">Start Location</label>
            <LocationSelector :model-value="form.startLocation || ''" @update:model-value="form.startLocation = $event" />
          </div>
          <div class="input-group">
            <label class="label">End Location</label>
            <LocationSelector :model-value="form.endLocation || ''" @update:model-value="form.endLocation = $event" />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.push('/activities')" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Activity</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import { useRoute, useRouter } from 'vue-router';
import LocationSelector from '@/components/common/LocationSelector.vue';
import type { UpdateActivityRequest } from '@/types';

const route = useRoute();
const router = useRouter();
const loading = ref(true);

const form = ref<UpdateActivityRequest>({
    activityName: '', activityType: '', activityItem: '', price: 0, capacity: 0,
    startDate: '', endDate: '', startLocation: '', endLocation: ''
});

onMounted(async () => {
  try {
    const res = await api.getActivityById(route.params.id as string);
    const data = res.data;
    form.value = {
        ...data,
        startDate: data.startDate ? data.startDate.substring(0, 16) : '',
        endDate: data.endDate ? data.endDate.substring(0, 16) : ''
    };
  } catch (err) {
    console.error('Failed to load activity', err);
    alert('Failed to load activity details.');
    router.push('/activities');
  } finally {
    loading.value = false;
  }
});

const save = async () => {
    // Validation
    if ((form.value.price || 0) <= 0) return alert('Price must be > 0');
    if ((form.value.capacity || 0) <= 0) return alert('Capacity must be > 0');
    if (new Date(form.value.startDate!) >= new Date(form.value.endDate!)) return alert('Start date must be before end date');
    if (new Date(form.value.startDate!) < new Date()) return alert('Start date must be in the future');

    try {
      await api.updateActivity(route.params.id as string, form.value);
      alert('Activity updated successfully');
      router.push('/activities');
    } catch (err: any) {
      console.error('Failed to update activity', err);
      alert(err.response?.data?.message || 'Failed to update activity');
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

.input.disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.helper-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-xl);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
</style>
