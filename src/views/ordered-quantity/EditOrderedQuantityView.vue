<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">Edit Quota</h1>
      <button @click="$router.back()" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Back
      </button>
    </div>

    <div class="card form-card">
      <form @submit.prevent="save" class="form-content">
        <div class="input-group">
          <label class="label">Quantity (Quota)</label>
          <input v-model.number="quota" type="number" min="1" class="input" required>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.back()" class="btn btn-secondary">Cancel</button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <span v-if="loading" class="spinner-sm"></span>
            Update Quota
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const quota = ref(1);

onMounted(() => {
  if (route.query.quota) {
    quota.value = parseInt(route.query.quota as string);
  }
});

const save = async () => {
  loading.value = true;
  try {
    await api.updateOrderedQuantity(route.params.oqId as string, quota.value);
    alert("Quota updated successfully");
    router.back();
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to update quota");
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
  max-width: 500px;
  margin: 0 auto;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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
</style>
