<script lang="ts">
import { defineComponent } from 'vue';
import activityService, { type Activity } from '@/services/activityService';
import ActivityCard from '@/components/activity/ActivityCard.vue';

export default defineComponent({
  name: 'ActivityList',
  components: {
    ActivityCard
  },
  data() {
    return {
      activities: [] as Activity[],
      filteredActivities: [] as Activity[],
      loading: false,
      error: null as string | null,
      searchQuery: '',
      selectedType: 'All',
      activityTypes: ['All', 'Flight', 'Accommodation', 'Vehicle Rental']
    };
  },
  async mounted() {
    await this.loadActivities();
  },
  watch: {
    searchQuery() {
      this.filterActivities();
    },
    selectedType() {
      this.filterActivities();
    }
  },
  methods: {
    async loadActivities(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const response = await activityService.getAllActivities();
        this.activities = response.data || [];
        this.filterActivities();
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'message' in err) {
          this.error = (err as { message?: string }).message || 'Failed to load activities';
        } else {
          this.error = 'Failed to load activities';
        }
      } finally {
        this.loading = false;
      }
    },
    filterActivities(): void {
      let filtered = [...this.activities];

      if (this.selectedType !== 'All') {
        filtered = filtered.filter(a => a.activityType === this.selectedType);
      }

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(a =>
          a.activityName.toLowerCase().includes(query) ||
          a.activityItem.toLowerCase().includes(query) ||
          a.startLocation.toLowerCase().includes(query) ||
          a.endLocation.toLowerCase().includes(query)
        );
      }

      this.filteredActivities = filtered;
    },
    handleView(id: string): void {
      this.$router.push(`/activities/${id}`);
    },
    handleEdit(id: string): void {
      this.$router.push(`/activities/${id}/edit`);
    },
    async handleDelete(id: string): Promise<void> {
      if (!confirm('Are you sure you want to delete this activity?')) return;

      try {
        await activityService.deleteActivity(id);
        await this.loadActivities();
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'message' in err) {
          alert((err as { message?: string }).message || 'Failed to delete activity');
        } else {
          alert('Failed to delete activity');
        }
      }
    },
    goToCreate(): void {
      this.$router.push('/activities/create');
    }
  }
});
</script>

<template>
  <div class="activity-list-container">
    <div class="page-header">
      <div>
        <h1>Activities</h1>
        <p class="subtitle">Manage all travel activities</p>
      </div>
      <button @click="goToCreate" class="btn-primary">
        <i class="fas fa-plus"></i> Add Activity
      </button>
    </div>

    <div class="filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search activities..."
          class="search-input"
        />
      </div>

      <div class="type-filters">
        <button
          v-for="type in activityTypes"
          :key="type"
          @click="selectedType = type"
          :class="['filter-btn', { active: selectedType === type }]"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading activities...</p>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <div v-else-if="filteredActivities.length === 0" class="empty-state">
      <i class="fas fa-inbox"></i>
      <h3>No activities found</h3>
      <p>{{ searchQuery ? 'Try adjusting your search' : 'Start by creating a new activity' }}</p>
      <button v-if="!searchQuery" @click="goToCreate" class="btn-primary">
        <i class="fas fa-plus"></i> Create Activity
      </button>
    </div>

    <div v-else class="activities-grid">
      <ActivityCard
        v-for="activity in filteredActivities"
        :key="activity.id"
        :activity="activity"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<style scoped>
.activity-list-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.filters {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 48px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.type-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #e5e7eb;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.loading {
  text-align: center;
  padding: 64px 24px;
  color: #6b7280;
}

.loading i {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #667eea;
}

.loading p {
  font-size: 1.125rem;
}

.alert {
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-state i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 24px 0;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .activities-grid {
    grid-template-columns: 1fr;
  }

  .type-filters {
    justify-content: center;
  }
}
</style>
