<template>
  <div class="page-container">
    <div class="page-header">
      <button @click="$router.push('/activities')" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Back to List
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading activity details...</p>
    </div>

    <div v-else-if="activity" class="card detail-card">
      <!-- Header with Type Color -->
      <div class="detail-header">
        <div class="header-content">
          <div>
            <span class="badge badge-light">
              {{ activity.activityType }}
            </span>
            <h1 class="heading-1 mt-2">{{ activity.activityName }}</h1>
            <p class="subtitle">{{ activity.activityItem }}</p>
          </div>
          <div class="price-section">
            <p class="price-label">Price per person</p>
            <p class="price-value">Rp {{ activity.price.toLocaleString('id-ID') }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="detail-body">
        <div class="detail-grid">
          <!-- Route Info -->
          <div class="info-section">
            <h3 class="heading-3 section-title">Route Information</h3>
            <div class="info-item">
              <div class="icon-circle icon-blue">
                <i class="fas fa-plane-departure"></i>
              </div>
              <div>
                <p class="label">Start Location</p>
                <p class="value">{{ activity.startLocation }}</p>
                <p class="sub-value">{{ formatDate(activity.startDate) }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-circle icon-orange">
                <i class="fas fa-plane-arrival"></i>
              </div>
              <div>
                <p class="label">End Location</p>
                <p class="value">{{ activity.endLocation }}</p>
                <p class="sub-value">{{ formatDate(activity.endDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="info-section">
            <h3 class="heading-3 section-title">Details</h3>

            <div class="stats-grid">
              <div class="stat-card">
                <p class="label">Capacity</p>
                <p class="value flex-center">
                  <i class="fas fa-users icon-gray"></i>
                  {{ activity.capacity }}
                </p>
              </div>
              <div class="stat-card">
                <p class="label">Status</p>
                <p class="value text-success flex-center">
                  <i class="fas fa-check-circle"></i>
                  Active
                </p>
              </div>
            </div>

            <div class="stat-card mt-4">
              <p class="label">Activity ID</p>
              <p class="value font-mono">{{ activity.id }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="detail-actions">
          <button @click="editActivity" class="btn btn-warning">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button @click="deleteActivity" class="btn btn-danger">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p class="empty-text">Activity not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import type { Activity } from '@/types';

const route = useRoute();
const router = useRouter();
const activity = ref<Activity | null>(null);
const loading = ref(true);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadActivity = async () => {
  try {
    const res = await api.getActivityById(route.params.id as string);
    activity.value = res.data;
  } catch (err) {
    console.error('Failed to load activity', err);
  } finally {
    loading.value = false;
  }
};

const editActivity = () => {
  if (activity.value) {
    router.push(`/activities/edit/${activity.value.id}`);
  }
};

const deleteActivity = async () => {
  if (activity.value && confirm('Are you sure you want to delete this activity?')) {
    try {
      await api.deleteActivity(activity.value.id);
      alert('Activity deleted successfully');
      router.push('/activities');
    } catch (err: any) {
      console.error('Failed to delete activity', err);
      alert(err.response?.data?.message || 'Failed to delete activity');
    }
  }
};

onMounted(loadActivity);
</script>

<style scoped>
.page-header {
  margin-bottom: var(--spacing-lg);
}

.detail-card {
  padding: 0;
  overflow: hidden;
}

.detail-header {
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  padding: var(--spacing-xl);
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.badge-light {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  margin-top: var(--spacing-xs);
}

.price-section {
  text-align: right;
}

.price-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.price-value {
  font-size: 1.875rem;
  font-weight: 700;
}

.detail-body {
  padding: var(--spacing-xl);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.section-title {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.icon-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.icon-blue {
  background-color: #eff6ff;
  color: var(--primary-color);
}

.icon-orange {
  background-color: #fff7ed;
  color: #ea580c;
}

.label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.value {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.sub-value {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.stat-card {
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.flex-center {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.icon-gray {
  color: var(--text-secondary);
}

.text-success {
  color: var(--success-color);
}

.font-mono {
  font-family: monospace;
  font-size: 0.875rem;
  word-break: break-all;
}

.detail-actions {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.loading-state,
.empty-state {
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
  to {
    transform: rotate(360deg);
  }
}

.empty-text {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .price-section {
    text-align: left;
  }
}
</style>
