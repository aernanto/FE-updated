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
  <div class="create-container">
    <div class="create-header">
      <h1>Add Activity to Plan</h1>
      <button @click="handleCancel" class="btn-back">
        <i class="fas fa-arrow-left"></i> Back to Plan
      </button>
    </div>

    <div v-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="create-form">
      <div class="form-group">
        <label for="activityId">Select Activity *</label>
        <select
          id="activityId"
          v-model="formData.activityId"
          @change="onActivityChange"
          required
          class="form-control"
        >
          <option value="">-- Select Activity --</option>
          <option
            v-for="activity in activities"
            :key="activity.id"
            :value="activity.id"
          >
            {{ activity.activityName }} - {{ activity.activityItem }}
          </option>
        </select>
      </div>

      <div v-if="selectedActivity" class="activity-info">
        <h3>Activity Details</h3>
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

      <div class="form-group">
        <label for="orderedQuota">Ordered Quota *</label>
        <input
          id="orderedQuota"
          v-model.number="formData.orderedQuota"
          type="number"
          :min="1"
          :max="maxQuota"
          required
          class="form-control"
          placeholder="Enter quantity"
        />
        <small v-if="selectedActivity">Max: {{ maxQuota }}</small>
      </div>

      <div v-if="selectedActivity && formData.orderedQuota > 0" class="total-price">
        <span>Total Price:</span>
        <span class="price">
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
</template>

<style scoped>
.create-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.create-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f3f4f6;
}

.alert {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.create-form {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.activity-info {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
}

.activity-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-item .value {
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
}

.total-price {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border: 2px solid #667eea;
}

.total-price span:first-child {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.total-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
