<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">📋 Master Activities</h1>
      <button @click="$router.push('/activities/create')" class="btn btn-primary">
        <i class="fas fa-plus"></i> Create New Activity
      </button>
    </div>

    <!-- Filters -->
    <div class="card filter-card">
      <div class="filter-grid">
        <div class="input-group">
          <label class="label">Search</label>
          <input v-model="filters.name" type="text" placeholder="Activity Name or Item..." class="input" />
        </div>
        <div class="input-group">
          <label class="label">Type</label>
          <select v-model="filters.type" class="input select">
            <option value="">All Types</option>
            <option value="Flight">Flight</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Vehicle Rental">Vehicle Rental</option>
          </select>
        </div>
        <div class="input-group">
          <label class="label">Start Location</label>
          <LocationSelector v-model="filters.startLocation" />
        </div>
        <div class="input-group">
          <label class="label">End Location</label>
          <LocationSelector v-model="filters.endLocation" />
        </div>
        <div class="input-group">
          <label class="label">Start Date</label>
          <input v-model="filters.startDate" type="date" class="input" />
        </div>
        <div class="input-group">
          <label class="label">End Date</label>
          <input v-model="filters.endDate" type="date" class="input" />
        </div>
        <div class="filter-actions">
          <button @click="clearFilters" class="btn btn-secondary w-full">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Sorting -->
    <div class="filters">
      <div class="sort-control">
        <label for="sort" class="label">Sort by:</label>
        <select id="sort" v-model="sortBy" class="input select">
          <option value="startDateAsc">Start Date (Ascending)</option>
          <option value="startDateDesc">Start Date (Descending)</option>
          <option value="priceAsc">Price (Low to High)</option>
          <option value="priceDesc">Price (High to Low)</option>
        </select>
      </div>
    </div>

    <!-- Activity Grid -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading activities...</p>
    </div>

    <div v-else-if="filteredActivities.length === 0" class="empty-state">
      <i class="fas fa-search empty-icon"></i>
      <p class="empty-text">No activities found</p>
      <p class="empty-subtext">Try adjusting your filters or create a new activity.</p>
    </div>

    <div v-else class="activities-grid">
      <ActivityCard v-for="activity in filteredActivities" :key="activity.id" :activity="activity" @view="viewDetail"
        @edit="editActivity" @delete="deleteActivity" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import type { Activity } from '@/types';
import ActivityCard from '@/components/activity/ActivityCard.vue';
import LocationSelector from '@/components/common/LocationSelector.vue';

const router = useRouter();
const activities = ref<Activity[]>([]);
const loading = ref(true);

const filters = ref({
  name: '',
  type: '',
  startLocation: '',
  endLocation: '',
  startDate: '',
  endDate: ''
});

const sortBy = ref('startDateAsc');

const loadActivities = async () => {
  loading.value = true;
  try {
    const res = await api.getAllActivities();
    activities.value = res.data;
  } catch (err) {
    console.error('Failed to load activities', err);
    alert('Failed to load activities. Please try again.');
  } finally {
    loading.value = false;
  }
};

const filteredActivities = computed(() => {
  let result = activities.value.filter(a => {
    // Filter by isDeleted (assuming backend doesn't filter it or we want to be safe)
    if (a.isDeleted) return false;

    const matchName = !filters.value.name ||
      a.activityName.toLowerCase().includes(filters.value.name.toLowerCase()) ||
      a.activityItem.toLowerCase().includes(filters.value.name.toLowerCase());
    const matchType = !filters.value.type || a.activityType === filters.value.type;
    const matchStartLoc = !filters.value.startLocation || a.startLocation === filters.value.startLocation;
    const matchEndLoc = !filters.value.endLocation || a.endLocation === filters.value.endLocation;

    // Date filtering logic
    const activityStart = new Date(a.startDate).getTime();
    const activityEnd = new Date(a.endDate).getTime();
    const filterStart = filters.value.startDate ? new Date(filters.value.startDate).getTime() : null;
    const filterEnd = filters.value.endDate ? new Date(filters.value.endDate).getTime() : null;

    const matchStartDate = !filterStart || activityStart >= filterStart;
    const matchEndDate = !filterEnd || activityEnd <= filterEnd;

    return matchName && matchType && matchStartLoc && matchEndLoc && matchStartDate && matchEndDate;
  });

  // Sorting
  result.sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();

    switch (sortBy.value) {
      case 'startDateAsc': return dateA - dateB;
      case 'startDateDesc': return dateB - dateA;
      case 'priceAsc': return a.price - b.price;
      case 'priceDesc': return b.price - a.price;
      default: return 0;
    }
  });

  return result;
});

const clearFilters = () => {
  filters.value = {
    name: '',
    type: '',
    startLocation: '',
    endLocation: '',
    startDate: '',
    endDate: ''
  };
};

const viewDetail = (id: string) => {
  router.push(`/activities/${id}`);
};

const editActivity = (id: string) => {
  router.push(`/activities/edit/${id}`);
};

const deleteActivity = async (id: string) => {
  if (confirm('Are you sure you want to delete this activity?')) {
    try {
      await api.deleteActivity(id);
      await loadActivities();
      alert('Activity deleted successfully');
    } catch (err) {
      console.error('Failed to delete activity', err);
      alert('Failed to delete activity. It might be in use.');
    }
  }
};

onMounted(loadActivities);
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.filter-card {
  margin-bottom: var(--spacing-lg);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  align-items: end;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
}

.filters {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-md);
}

.sort-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.select {
  padding: 0.5rem;
  min-width: 200px;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  color: #d1d5db;
}

.empty-text {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-secondary);
}

.empty-subtext {
  color: #9ca3af;
}
</style>
