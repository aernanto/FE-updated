<template>
  <div class="package-card">
    <div class="package-header">
      <h3>{{ pkg.packageName }}</h3>
      <span class="status-badge" :class="statusClass">
        {{ pkg.status }}
      </span>
    </div>

    <div class="package-body">
      <div class="info-row">
        <span class="label">📅 Duration:</span>
        <span class="value">{{ formatDateRange }}</span>
      </div>

      <div class="info-row">
        <span class="label">👥 Quota:</span>
        <span class="value">{{ pkg.quota }} people</span>
      </div>

      <div class="info-row">
        <span class="label">💰 Price:</span>
        <span class="value price">Rp {{ formatPrice(pkg.price) }}</span>
      </div>

      <div class="info-row">
        <span class="label">📋 Plans:</span>
        <span class="value">{{ pkg.plans?.length || 0 }} plan(s)</span>
      </div>
    </div>

    <div class="package-footer">
      <button @click="$emit('view', pkg.id)" class="btn btn-primary">
        View Details
      </button>
      <button @click="$emit('edit', pkg.id)" class="btn btn-secondary">
        Edit
      </button>
      <button @click="$emit('delete', pkg.id)" class="btn btn-danger">
        Delete
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

type PackagePlan = Record<string, unknown>;

type Package = {
  id: string | number;
  packageName: string;
  status: string;
  startDate: string;
  endDate: string;
  quota: number;
  price?: number;
  plans?: PackagePlan[];
};

export default defineComponent({
  name: 'PackageCard',
  props: {
    pkg: {
      type: Object as PropType<Package>,
      required: true
    }
  },
  computed: {
    statusClass(): string {
      return this.pkg.status === 'Processed' ? 'status-processed' : 'status-pending';
    },
    formatDateRange(): string {
      const start = new Date(this.pkg.startDate).toLocaleDateString('id-ID');
      const end = new Date(this.pkg.endDate).toLocaleDateString('id-ID');
      return `${start} - ${end}`;
    }
  },
  methods: {
    formatPrice(price: number | undefined): string {
      return new Intl.NumberFormat('id-ID').format(price || 0);
    }
  }
});
</script>

<style scoped>
.package-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.package-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.package-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-processed {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.package-body {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-row .label {
  color: #666;
  font-size: 14px;
}

.info-row .value {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.info-row .price {
  color: #10b981;
  font-size: 16px;
}

.package-footer {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>
