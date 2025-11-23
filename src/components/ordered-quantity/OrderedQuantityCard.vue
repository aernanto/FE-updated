<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { OrderedQuantity } from '@/services/orderedQuantityService';

export default defineComponent({
  name: 'OrderedQuantityCard',
  props: {
    orderedQuantity: {
      type: Object as PropType<OrderedQuantity>,
      required: true
    }
  },
  computed: {
    totalPrice(): number {
      return (this.orderedQuantity.price || 0) * (this.orderedQuantity.orderedQuota || 0);
    },
    formatSchedule(): string {
      if (!this.orderedQuantity.startDate || !this.orderedQuantity.endDate) return 'N/A';
      const start = new Date(this.orderedQuantity.startDate).toLocaleDateString('id-ID');
      const end = new Date(this.orderedQuantity.endDate).toLocaleDateString('id-ID');
      return `${start} - ${end}`;
    }
  },
  methods: {
    formatPrice(price: number): string {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(price || 0);
    },
    handleEdit(): void {
      this.$emit('edit', this.orderedQuantity.id);
    },
    handleDelete(): void {
      this.$emit('delete', this.orderedQuantity.id);
    }
  }
});
</script>

<template>
  <div class="ordered-quantity-card">
    <div class="card-header">
      <div class="header-left">
        <h3 class="activity-name">{{ orderedQuantity.activityName }}</h3>
        <span class="activity-item">{{ orderedQuantity.activityItem }}</span>
      </div>
      <div class="header-actions">
        <button @click="handleEdit" class="btn-icon btn-edit" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="handleDelete" class="btn-icon btn-delete" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <div class="info-row">
        <div class="info-item">
          <i class="fas fa-calendar-alt"></i>
          <div class="info-content">
            <span class="info-label">Schedule</span>
            <span class="info-value">{{ formatSchedule }}</span>
          </div>
        </div>

        <div class="info-item">
          <i class="fas fa-users"></i>
          <div class="info-content">
            <span class="info-label">Ordered Quota</span>
            <span class="info-value">{{ orderedQuantity.orderedQuota }} / {{ orderedQuantity.quota }}</span>
          </div>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <i class="fas fa-tag"></i>
          <div class="info-content">
            <span class="info-label">Unit Price</span>
            <span class="info-value">{{ formatPrice(orderedQuantity.price) }}</span>
          </div>
        </div>

        <div class="info-item total-price">
          <i class="fas fa-money-bill-wave"></i>
          <div class="info-content">
            <span class="info-label">Total Price</span>
            <span class="info-value total">{{ formatPrice(totalPrice) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ordered-quantity-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.ordered-quantity-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  flex: 1;
}

.activity-name {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.activity-item {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.btn-delete:hover {
  background: #ef4444;
}

.card-body {
  padding: 20px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.info-item i {
  color: #667eea;
  font-size: 1.25rem;
  margin-top: 2px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
}

.total-price {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border: 2px solid #667eea;
}

.total-price .info-value.total {
  color: #667eea;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .info-row {
    grid-template-columns: 1fr;
  }

  .activity-name {
    font-size: 1.125rem;
  }

  .card-header {
    padding: 16px;
  }

  .card-body {
    padding: 16px;
  }
}
</style>
