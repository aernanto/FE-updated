<script lang="ts">
import { defineComponent } from 'vue';
import orderedQuantityService, { type OrderedQuantity } from '@/services/orderedQuantityService';

export default defineComponent({
  name: 'OrderedQuantityEdit',
  data() {
    return {
      orderedQuantityId: '' as string,
      orderedQuantity: null as OrderedQuantity | null,
      newQuota: 1,
      loading: false,
      error: null as string | null
    };
  },
  computed: {
    maxQuota(): number {
      return this.orderedQuantity?.quota || 999;
    },
    totalPrice(): number {
      if (!this.orderedQuantity) return 0;
      return this.orderedQuantity.price * this.newQuota;
    }
  },
  async mounted() {
    this.orderedQuantityId = this.$route.params.id as string;
    await this.loadOrderedQuantity();
  },
  methods: {
    async loadOrderedQuantity(): Promise<void> {
      try {
        const response = await orderedQuantityService.getOrderedQuantityById(this.orderedQuantityId);
        this.orderedQuantity = response.data!;
        this.newQuota = this.orderedQuantity.orderedQuota;
      } catch (err: any) {
        this.error = err.message || 'Failed to load ordered quantity';
      }
    },
    async handleSubmit(): Promise<void> {
      if (this.newQuota <= 0 || this.newQuota > this.maxQuota) {
        this.error = `Quota must be between 1 and ${this.maxQuota}`;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        await orderedQuantityService.updateOrderedQuantity(this.orderedQuantityId, this.newQuota);
        this.$router.push(`/plans/${this.orderedQuantity!.planId}`);
      } catch (err: any) {
        this.error = err.message || 'Failed to update ordered quantity';
      } finally {
        this.loading = false;
      }
    },
    handleCancel(): void {
      if (this.orderedQuantity) {
        this.$router.push(`/plans/${this.orderedQuantity.planId}`);
      } else {
        this.$router.back();
      }
    }
  }
});
</script>

<template>
  <div class="edit-container">
    <div class="edit-header">
      <h1>Edit Ordered Quantity</h1>
      <button @click="handleCancel" class="btn-back">
        <i class="fas fa-arrow-left"></i> Back
      </button>
    </div>

    <div v-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <div v-if="!orderedQuantity" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading...
    </div>

    <form v-else @submit.prevent="handleSubmit" class="edit-form">
      <div class="activity-info">
        <h3>Activity Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Activity Name:</span>
            <span class="value">{{ orderedQuantity.activityName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Item:</span>
            <span class="value">{{ orderedQuantity.activityItem }}</span>
          </div>
          <div class="info-item">
            <span class="label">Available Capacity:</span>
            <span class="value">{{ orderedQuantity.quota }}</span>
          </div>
          <div class="info-item">
            <span class="label">Price per Unit:</span>
            <span class="value">Rp {{ orderedQuantity.price.toLocaleString('id-ID') }}</span>
          </div>
          <div class="info-item">
            <span class="label">Current Quota:</span>
            <span class="value highlight">{{ orderedQuantity.orderedQuota }}</span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="newQuota">New Ordered Quota *</label>
        <input
          id="newQuota"
          v-model.number="newQuota"
          type="number"
          :min="1"
          :max="maxQuota"
          required
          class="form-control"
        />
        <small>Max: {{ maxQuota }}</small>
      </div>

      <div class="total-price">
        <span>New Total Price:</span>
        <span class="price">Rp {{ totalPrice.toLocaleString('id-ID') }}</span>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" :disabled="loading" class="btn btn-primary">
          <i class="fas fa-save"></i>
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.edit-header h1 {
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

.loading {
  text-align: center;
  padding: 48px;
  color: #6b7280;
  font-size: 1.125rem;
}

.edit-form {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.info-item .value.highlight {
  color: #667eea;
  font-size: 1.125rem;
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
