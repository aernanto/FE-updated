<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">Link Activity to Plan</h1>
      <button @click="$router.back()" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Back
      </button>
    </div>

    <div class="card form-card">
      <form @submit.prevent="save" class="form-content">

        <!-- Filter Section -->
        <div class="filter-section">
          <h3 class="subheading">Filter Activities</h3>
          <div class="filter-grid">
            <input v-model="filters.search" placeholder="Search name..." class="input input-sm">
            <select v-model="filters.type" class="input input-sm select">
              <option value="">All Types</option>
              <option value="Flight">Flight</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Vehicle Rental">Vehicle Rental</option>
            </select>
            <LocationSelector v-model="filters.location" placeholder="Location" class="input-sm" />
          </div>
        </div>

        <div class="input-group">
          <label class="label">Select Activity</label>
          <div class="activity-selector">
            <div v-for="a in filteredActivities" :key="a.id" @click="form.activityId = a.id"
              :class="['activity-option', form.activityId === a.id ? 'selected' : '']">
              <div class="option-info">
                <p class="option-title">{{ a.activityName }}</p>
                <p class="option-subtitle">{{ a.activityType }} • {{ a.startLocation }} ➔ {{ a.endLocation }}</p>
              </div>
              <div class="option-meta">
                <p class="option-price">Rp {{ a.price.toLocaleString() }}</p>
                <p class="option-cap">Cap: {{ a.capacity }}</p>
              </div>
            </div>
            <div v-if="filteredActivities.length === 0" class="empty-options">
              No activities match your filters.
            </div>
          </div>
          <p v-if="!form.activityId" class="error-text">Please select an activity.</p>
        </div>

        <div class="input-group">
          <label class="label">Quantity (Quota)</label>
          <input v-model.number="form.orderedQuota" type="number" min="1" class="input" required>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.back()" class="btn btn-secondary">Cancel</button>
          <button type="submit" :disabled="loading || !form.activityId" class="btn btn-primary">
            <span v-if="loading" class="spinner-sm"></span>
            Link Activity
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import LocationSelector from '@/components/common/LocationSelector.vue';
import type { Activity } from '@/types';

const route = useRoute();
const router = useRouter();
const activities = ref<Activity[]>([]);
const loading = ref(false);
const form = ref({ activityId: '', orderedQuota: 1 });

const filters = ref({
  search: '',
  type: '',
  location: ''
});

onMounted(async () => {
  try {
    const res = await api.getAllActivities();
    activities.value = res.data;
  } catch (err) {
    console.error(err);
  }
});

const filteredActivities = computed(() => {
  return activities.value.filter(a => {
    const matchSearch = a.activityName.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchType = !filters.value.type || a.activityType === filters.value.type;
    const matchLocation = !filters.value.location || a.startLocation === filters.value.location || a.endLocation === filters.value.location;
    return matchSearch && matchType && matchLocation;
  });
});

const save = async () => {
  if (!form.value.activityId) return;

  loading.value = true;
  try {
    await api.addOrderedQuantity(route.params.planId as string, form.value);
    router.push(`/packages/${route.params.packageId}`);
  } catch (e: any) {
    alert(e.response?.data?.message || "Failed to link activity");
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

.filter-section {
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  margin-bottom: var(--spacing-sm);
}

.subheading {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.input-sm {
  font-size: 0.875rem;
  padding: 0.4rem 0.6rem;
}

.activity-selector {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.activity-option {
  padding: var(--spacing-md);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.activity-option:last-child {
  border-bottom: none;
}

.activity-option:hover {
  background-color: #f0f9ff;
}

.activity-option.selected {
  background-color: #eff6ff;
  border-left: 4px solid var(--primary-color);
}

.option-title {
  font-weight: 700;
  color: var(--text-primary);
}

.option-subtitle {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.option-meta {
  text-align: right;
}

.option-price {
  font-weight: 700;
  color: var(--success-color);
}

.option-cap {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.empty-options {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--text-secondary);
}

.error-text {
  font-size: 0.75rem;
  color: var(--error-color);
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
</style>
