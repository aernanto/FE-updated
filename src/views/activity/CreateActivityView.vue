<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">Create New Activity</h1>
      <button @click="handleCancel" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Back to Activities
      </button>
    </div>

    <div v-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <div class="card form-card">
      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-row">
          <div class="input-group">
            <label class="label" for="activityName">Activity Name *</label>
            <input id="activityName" v-model="formData.activityName" type="text" required class="input"
              placeholder="e.g., Jakarta to Bali Flight" />
          </div>

          <div class="input-group">
            <label class="label" for="activityType">Activity Type *</label>
            <select id="activityType" v-model="formData.activityType" required class="input select">
              <option value="">-- Select Type --</option>
              <option v-for="type in activityTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <label class="label" for="activityItem">Activity Item *</label>
          <input id="activityItem" v-model="formData.activityItem" type="text" required class="input"
            placeholder="e.g., Garuda Indonesia GA123" />
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label" for="capacity">Capacity *</label>
            <input id="capacity" v-model.number="formData.capacity" type="number" min="1" required class="input" />
          </div>

          <div class="input-group">
            <label class="label" for="price">Price (IDR) *</label>
            <input id="price" v-model.number="formData.price" type="number" min="0" required class="input" />
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label" for="startDate">Start Date *</label>
            <input id="startDate" v-model="formData.startDate" type="datetime-local" required class="input" />
          </div>

          <div class="input-group">
            <label class="label" for="endDate">End Date *</label>
            <input id="endDate" v-model="formData.endDate" type="datetime-local" required class="input" />
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label" for="startLocation">Start Location *</label>
            <LocationSelector v-model="formData.startLocation" class="input" required />
          </div>

          <div class="input-group">
            <label class="label" for="endLocation">End Location *</label>
            <LocationSelector v-model="formData.endLocation" class="input" required />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <span v-if="loading" class="spinner-sm"></span>
            {{ loading ? 'Creating...' : 'Create Activity' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import type { CreateActivityRequest } from '@/types';
import LocationSelector from '@/components/common/LocationSelector.vue';

const router = useRouter();
const loading = ref(false);
const error = ref<string | null>(null);
const activityTypes = ['Flight', 'Accommodation', 'Vehicle Rental'];

const formData = ref<CreateActivityRequest>({
  activityName: '',
  activityType: '',
  activityItem: '',
  capacity: 1,
  price: 0,
  startDate: '',
  endDate: '',
  startLocation: '',
  endLocation: ''
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  // Client-side validation
  if (formData.value.price <= 0) {
    error.value = 'Price must be greater than 0';
    loading.value = false;
    return;
  }
  if (formData.value.capacity <= 0) {
    error.value = 'Capacity must be greater than 0';
    loading.value = false;
    return;
  }
  if (new Date(formData.value.startDate) >= new Date(formData.value.endDate)) {
    error.value = 'Start date must be before end date';
    loading.value = false;
    return;
  }
  if (new Date(formData.value.startDate) < new Date()) {
    error.value = 'Start date must be in the future';
    loading.value = false;
    return;
  }

  try {
    await api.createActivity(formData.value);
    alert('Activity created successfully');
    router.push('/activities');
  } catch (err: any) {
    console.error('Failed to create activity', err);
    error.value = err.response?.data?.message || 'Failed to create activity';
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push('/activities');
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
  max-width: 900px;
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

.alert {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
</style>
