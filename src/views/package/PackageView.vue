<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="heading-1">📦 Packages</h1>
      <button @click="$router.push('/packages/create')" class="btn btn-primary">
        <i class="fas fa-plus"></i> New Package
      </button>
    </div>

    <div class="filters">
      <div class="sort-control">
        <label for="sort" class="label">Sort by:</label>
        <select id="sort" v-model="sortBy" class="input select">
          <option value="startDateAsc">Start Date (Ascending)</option>
          <option value="startDateDesc">Start Date (Descending)</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading packages...</p>
    </div>

    <div v-else-if="sortedPackages.length === 0" class="empty-state">
      <div class="empty-icon">📦</div>
      <p class="empty-text">No packages found</p>
      <p class="empty-subtext">Create a new package to get started.</p>
    </div>

    <div v-else class="packages-grid">
      <div v-for="pkg in sortedPackages" :key="pkg.id" class="card package-card"
        @click="$router.push(`/packages/${pkg.id}`)">
        <div class="card-header">
          <h3 class="card-title">{{ pkg.packageName }}</h3>
          <span :class="['status-badge', getStatusClass(pkg.status)]">{{ pkg.status }}</span>
        </div>
        <div class="card-body">
          <p class="info-row"><i class="fas fa-calendar-alt icon"></i> {{ formatDate(pkg.startDate) }} - {{
            formatDate(pkg.endDate) }}</p>
          <p class="info-row"><i class="fas fa-users icon"></i> Quota: {{ pkg.quota }}</p>
          <p class="info-row"><i class="fas fa-money-bill-wave icon"></i> <span class="price">Rp {{
            formatMoney(pkg.price) }}</span></p>
        </div>
        <div class="card-footer">
          <button v-if="pkg.status === 'Pending'" @click.stop="del(pkg.id)" class="btn btn-danger-text">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '@/services/api';
import type { Package } from '@/types';

const packages = ref<Package[]>([]);
const loading = ref(false);
const sortBy = ref('startDateAsc');

const load = async () => {
  loading.value = true;
  try {
    const res = await api.getAllPackages();
    packages.value = (res.data as any).data || [];

  } catch (err) {
    console.error(err);
    alert("Failed to load packages");
  } finally {
    loading.value = false;
  }
};

const sortedPackages = computed(() => {
  return [...packages.value].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return sortBy.value === 'startDateAsc' ? dateA - dateB : dateB - dateA;
  });
});

const del = async (id: string) => {
  if (confirm("Are you sure you want to delete this package?")) {
    try {
      await api.deletePackage(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete package");
    }
  }
};

const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID');
const formatMoney = (n: number) => n.toLocaleString('id-ID');

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Pending': return 'status-pending';
    case 'Processed': return 'status-processed';
    default: return 'status-default';
  }
};

onMounted(load);
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
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

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.package-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.package-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-right: var(--spacing-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-processed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-default {
  background-color: #f3f4f6;
  color: #1f2937;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-row {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.icon {
  width: 20px;
  margin-right: var(--spacing-xs);
  text-align: center;
}

.price {
  font-weight: 700;
  color: var(--success-color);
}

.card-footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.btn-danger-text {
  background: none;
  border: none;
  color: var(--error-color);
  padding: 0;
  font-size: var(--font-size-sm);
}

.btn-danger-text:hover {
  text-decoration: underline;
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
