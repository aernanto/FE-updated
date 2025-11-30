<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">Create New Package</h1>
      <button @click="$router.push('/packages')" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Back
      </button>
    </div>

    <div class="card form-card">
      <form @submit.prevent="save" class="form-content">
        <div class="input-group">
          <label class="label">Package Name</label>
          <input v-model="form.packageName" class="input" placeholder="e.g., Bali Summer Vacation" required>
        </div>

        <div class="input-group">
          <label class="label">Customer ID (User ID)</label>
          <input v-model="form.userId" class="input" placeholder="e.g., customer-123" required>
          <p class="helper-text">In a real app, this might be auto-filled or selected from a user list.</p>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label">Quota</label>
            <input v-model.number="form.quota" type="number" min="1" class="input" required>
          </div>
          <div class="input-group">
            <label class="label">Base Price (IDR)</label>
            <input v-model.number="form.price" type="number" min="0" class="input" required>
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label class="label">Start Date</label>
            <input v-model="form.startDate" type="date" class="input" required>
          </div>
          <div class="input-group">
            <label class="label">End Date</label>
            <input v-model="form.endDate" type="date" class="input" required>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.push('/packages')" class="btn btn-secondary">Cancel</button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <span v-if="loading" class="spinner-sm"></span>
            Create Package
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/services/api';
import { useRouter } from 'vue-router';
import type { CreatePackageRequest } from '@/types';

const router = useRouter();
const loading = ref(false);
const form = ref<CreatePackageRequest>({
  packageName: '',
  userId: 'customer-1',
  quota: 10,
  price: 0,
  startDate: '',
  endDate: '',
});

const save = async () => {
  if (form.value.price < 0) return alert("Price must be >= 0");
  if (form.value.quota <= 0) return alert("Quota must be > 0");
  if (new Date(form.value.startDate) >= new Date(form.value.endDate)) return alert("Start date must be before end date");
  if (new Date(form.value.startDate) < new Date()) return alert("Start date must be in the future");

  loading.value = true;
  try {
    await api.createPackage(form.value);
    alert("Package created successfully");
    router.push('/packages');
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || 'Error creating package');
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
