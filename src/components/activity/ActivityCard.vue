<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Activity } from '@/services/activityService';

export default defineComponent({
  name: 'ActivityCard',
  props: {
    activity: {
      type: Object as PropType<Activity>,
      required: true
    }
  },
  computed: {
    formatSchedule(): string {
      const start = new Date(this.activity.startDate).toLocaleDateString('id-ID');
      const end = new Date(this.activity.endDate).toLocaleDateString('id-ID');
      return `${start} - ${end}`;
    },
    activityTypeIcon(): string {
      const icons: Record<string, string> = {
        'Flight': 'fa-plane',
        'Accommodation': 'fa-hotel',
        'Vehicle Rental': 'fa-car'
      };
      return icons[this.activity.activityType] || 'fa-calendar';
    },
    activityTypeColor(): string {
      const colors: Record<string, string> = {
        'Flight': '#3b82f6',
        'Accommodation': '#10b981',
        'Vehicle Rental': '#f59e0b'
      };
      return colors[this.activity.activityType] || '#667eea';
    }
  },
  methods: {
    formatPrice(price: number): string {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(price);
    },
    handleView(): void {
      this.$emit('view', this.activity.id);
    },
    handleEdit(): void {
      this.$emit('edit', this.activity.id);
    },
    handleDelete(): void {
      this.$emit('delete', this.activity.id);
    }
  }
});
</script>

<template>
  <div class="activity-card" :style="{ '--type-color': activityTypeColor }">
    <div class="card-header">
      <div class="header-left">
        <div class="icon-wrapper">
          <i class="fas" :class="activityTypeIcon"></i>
        </div>
        <div>
          <h3 class="activity-name">{{ activity.activityName }}</h3>
          <span class="activity-type">{{ activity.activityType }}</span>
        </div>
      </div>
      <div class="header-actions">
        <button @click="handleView" class="btn-icon btn-view" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button @click="handleEdit" class="btn-icon btn-edit" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="handleDelete" class="btn-icon btn-delete" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <div class="info-item">
        <i class="fas fa-tag"></i>
        <div class="info-content">
          <span class="info-label">Item</span>
          <span class="info-value">{{ activity.activityItem }}</span>
        </div>
      </div>

      <div class="info-item">
        <i class="fas fa-calendar-alt"></i>
        <div class="info-content">
          <span class="info-label">Schedule</span>
          <span class="info-value">{{ formatSchedule }}</span>
        </div>
      </div>

      <div class="info-item">
        <i class="fas fa-map-marker-alt"></i>
        <div class="info-content">
          <span class="info-label">Route</span>
          <span class="info-value">{{ activity.startLocation }} → {{ activity.endLocation }}</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <i class="fas fa-users"></i>
          <div class="info-content">
            <span class="info-label">Capacity</span>
            <span class="info-value">{{ activity.capacity }}</span>
          </div>
        </div>

        <div class="info-item price-item">
          <i class="fas fa-money-bill-wave"></i>
          <div class="info-content">
            <span class="info-label">Price</span>
            <span class="info-value price">{{ formatPrice(activity.price) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.activity-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, var(--type-color) 0%, color-mix(in srgb, var(--type-color) 80%, black) 100%);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.activity-name {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.activity-type {
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
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  color: var(--type-color);
  font-size: 1.25rem;
  margin-top: 2px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
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

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.price-item {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 2px solid var(--type-color);
}

.price-item .info-value.price {
  color: var(--type-color);
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .info-row {
    grid-template-columns: 1fr;
  }

  .activity-name {
    font-size: 1.125rem;
  }
}
</style>
