<template>
  <div class="plan-card">
    <div class="plan-header">
      <h4>{{ plan.planName }}</h4>
      <span class="plan-price">Rp {{ formatPrice(plan.price) }}</span>
    </div>

    <div class="plan-body">
      <div class="info-item">
        <span class="icon">📅</span>
        <span>{{ formatDateRange }}</span>
      </div>

      <div class="info-item">
        <span class="icon">⏱️</span>
        <span>{{ calculateDuration }} days</span>
      </div>

      <p class="description" v-if="plan.description">
        {{ plan.description }}
      </p>
    </div>

    <div class="plan-footer">
      <button @click="$emit('edit', plan.id)" class="btn btn-edit">
        Edit
      </button>
      <button @click="$emit('delete', plan.id)" class="btn btn-delete">
        Delete
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlanCard',
  props: {
    plan: {
      type: Object,
      required: true
    }
  },
  computed: {
    formatDateRange() {
      const start = new Date(this.plan.startDate).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short'
      });
      const end = new Date(this.plan.endDate).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      return `${start} - ${end}`;
    },
    calculateDuration() {
      const start = new Date(this.plan.startDate);
      const end = new Date(this.plan.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    }
  },
  methods: {
    formatPrice(price: number | null | undefined): string {
      return new Intl.NumberFormat('id-ID').format(price ?? 0);
    }
  }
});
</script>

<style scoped>
.plan-card {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s;
}

.plan-card:hover {
  border-color: #3b82f6;
  background: white;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-header h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.plan-price {
  font-size: 18px;
  font-weight: 700;
  color: #10b981;
}

.plan-body {
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.icon {
  font-size: 16px;
}

.description {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.plan-footer {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}
</style>
