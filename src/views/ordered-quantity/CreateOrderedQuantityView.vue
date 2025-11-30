<script lang="ts">
import { defineComponent } from 'vue';
import orderedQuantityService, { type OrderedQuantityData } from '@/services/orderedQuantityService';
import activityService, { type Activity } from '@/services/activityService';

interface FormData extends OrderedQuantityData {
  activityId: string;
  orderedQuota: number;
}

export default defineComponent({
  name: 'OrderedQuantityCreate',
  data() {
    return {
      planId: '' as string,
      activities: [] as Activity[],
      formData: {
        activityId: '',
        orderedQuota: 1
      } as FormData,
      loading: false,
      error: null as string | null,
      selectedActivity: null as Activity | null
    };
  },
  computed: {
    maxQuota(): number {
      return this.selectedActivity?.capacity || 999;
    }
  },
  async mounted() {
    this.planId = this.$route.params.planId as string;
    if (!this.planId) {
      this.error = 'Plan ID is required';
      return;
    }
    await this.loadActivities();
  },
  methods: {
    async loadActivities(): Promise<void> {
      try {
        const response = await activityService.getAllActivities();
        this.activities = response.data || [];
      } catch (err: any) {
        this.error = err.message || 'Failed to load activities';
      }
    },
    onActivityChange(): void {
      this.selectedActivity = this.activities.find(a => a.id === this.formData.activityId) || null;
    },
    async handleSubmit(): Promise<void> {
      if (!this.formData.activityId || this.formData.orderedQuota <= 0) {
        this.error = 'Please fill all required fields';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        await orderedQuantityService.createOrderedQuantity(this.planId, this.formData);
        this.$router.push(`/plans/${this.planId}`);
      } catch (err: any) {
        this.error = err.message || 'Failed to create ordered quantity';
      } finally {
        this.loading = false;
      }
    },
    handleCancel(): void {
      this.$router.push(`/plans/${this.planId}`);
    }
  }
});
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">Add Activity to Plan</h1>
      <button @click="handleCancel" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Back to Plan
      </button>
    </div>

    <div v-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <div class="card form-card">
      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="input-group">
          <label class="label" for="activityId">Select Activity *</label>
          <select id="activityId" v-model="formData.activityId" @change="onActivityChange" required
            class="input select">
            <option value="">-- Select Activity --</option>
            <option v-for="activity in activities" :key="activity.id" :value="activity.id">
              {{ activity.activityName }} - {{ activity.activityItem }}
            </option>
          </select>
        </div>

        <div v-if="selectedActivity" class="info-section">
          <h3 class="heading-3">Activity Details</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Type:</span>
              <span class="value">{{ selectedActivity.activityType }}</span>
            </div>
            <div class="info-item">
              <span class="label">Available Capacity:</span>
              <span class="value">{{ selectedActivity.capacity }}</span>
            </div>
            <div class="info-item">
              <span class="label">Price per Unit:</span>
              <span class="value">Rp {{ selectedActivity.price.toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label class="label" for="orderedQuota">Ordered Quota *</label>
          <input id="orderedQuota" v-model.number="formData.orderedQuota" type="number" :min="1" :max="maxQuota"
            required class="input" placeholder="Enter quantity" />
          <small class="helper-text" v-if="selectedActivity">Max: {{ maxQuota }}</small>
        </div>

        <div v-if="selectedActivity && formData.orderedQuota > 0" class="total-price-card">
          <span class="total-label">Total Price:</span>
          <span class="total-value">
            Rp {{ (selectedActivity.price * formData.orderedQuota).toLocaleString('id-ID') }}
          </span>
        </div>

        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            {{ loading ? 'Adding...' : 'Add Activity' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

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

.info-section {
  background: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.info-item .value {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.helper-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
  display: block;
}

.total-price-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid var(--primary-color);
}

.total-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}
</style>
