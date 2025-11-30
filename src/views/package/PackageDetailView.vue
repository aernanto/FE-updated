<template>
   <div class="page-container" v-if="pkg">
      <button @click="$router.push('/packages')" class="btn btn-secondary back-btn">
         <i class="fas fa-arrow-left"></i> Back to Packages
      </button>

      <div class="card detail-card">
         <div class="detail-header">
            <div>
               <h1 class="heading-1 mb-1">{{ pkg.packageName }}</h1>
               <p class="text-secondary">ID: {{ pkg.id }}</p>
            </div>
            <div class="status-container">
               <span :class="['status-badge', getStatusClass(pkg.status)]">
                  {{ pkg.status }}
               </span>
               <span class="text-secondary text-sm">Customer: {{ pkg.userId }}</span>
            </div>
         </div>

         <div class="stats-grid">
            <div class="stat-item">
               <p class="stat-label">Total Price</p>
               <p class="stat-value price">Rp {{ formatMoney(pkg.price) }}</p>
            </div>
            <div class="stat-item">
               <p class="stat-label">Quota</p>
               <p class="stat-value">{{ pkg.quota }}</p>
            </div>
            <div class="stat-item">
               <p class="stat-label">Start Date</p>
               <p class="stat-value">{{ formatDate(pkg.startDate) }}</p>
            </div>
            <div class="stat-item">
               <p class="stat-label">End Date</p>
               <p class="stat-value">{{ formatDate(pkg.endDate) }}</p>
            </div>
         </div>

         <div v-if="pkg.status === 'Pending'" class="actions-bar">
            <button @click="editPackage" class="btn btn-secondary">
               <i class="fas fa-edit"></i> Edit Package
            </button>
            <button @click="process" :disabled="!canProcess"
               :class="['btn', canProcess ? 'btn-success' : 'btn-disabled']">
               <i class="fas fa-check-circle"></i> Process Package
            </button>
            <button @click="$router.push(`/packages/${pkg.id}/plans/create`)" class="btn btn-primary">
               <i class="fas fa-plus"></i> Add Plan
            </button>
         </div>
      </div>

      <div class="section-header">
         <h2 class="heading-2">🗓️ Plans & Activities</h2>
      </div>

      <div v-if="!pkg.plans || pkg.plans.length === 0" class="empty-state">
         <i class="fas fa-calendar-times empty-icon"></i>
         <p class="empty-text">No plans added yet.</p>
         <button v-if="pkg.status === 'Pending'" @click="$router.push(`/packages/${pkg.id}/plans/create`)"
            class="btn-link">Add your first plan</button>
      </div>

      <div class="plans-list">
         <div v-for="plan in pkg.plans" :key="plan.id" class="card plan-card">
            <div class="plan-header">
               <div class="plan-info">
                  <div class="plan-icon">
                     <i :class="getIconForType(plan.activityType)"></i>
                  </div>
                  <div>
                     <h3 class="plan-title">{{ plan.planName || plan.activityType }}</h3>
                     <p class="plan-route">{{ plan.startLocation }} ➔ {{ plan.endLocation }}</p>
                  </div>
               </div>
               <div class="plan-actions">
                  <span class="plan-price">Rp {{ formatMoney(plan.price) }}</span>
                  <div v-if="pkg.status === 'Pending'" class="action-buttons">
                     <button @click="editPlan(plan.id)" class="btn-icon" title="Edit Plan"><i
                           class="fas fa-edit"></i></button>
                     <button @click="delPlan(plan.id)" class="btn-icon danger" title="Delete Plan"><i
                           class="fas fa-trash"></i></button>
                  </div>
               </div>
            </div>

            <div class="plan-body">
               <div class="activities-header">
                  <h4 class="subheading">Ordered Activities</h4>
                  <button v-if="pkg.status === 'Pending'" @click="linkAct(plan.id)" class="btn-link-sm">
                     <i class="fas fa-plus-circle"></i> Add Activity
                  </button>
               </div>

               <div v-if="plan.orderedActivities && plan.orderedActivities.length > 0" class="activities-list">
                  <div v-for="oq in plan.orderedActivities" :key="oq.id" class="activity-item">
                     <div class="activity-info">
                        <p class="activity-name">{{ oq.activityName }}</p>
                        <p class="activity-detail">{{ oq.activityItem }}</p>
                     </div>
                     <div class="activity-meta">
                        <div class="activity-cost">
                           <p class="activity-qty">x{{ oq.orderedQuota }}</p>
                           <p class="activity-total">Rp {{ formatMoney(oq.price * oq.orderedQuota) }}</p>
                        </div>
                        <div v-if="pkg.status === 'Pending'" class="activity-actions">
                           <button @click="editOq(oq)" class="btn-icon-sm" title="Edit Quota"><i
                                 class="fas fa-edit"></i></button>
                           <button @click="delOq(oq.id)" class="btn-icon-sm danger" title="Remove"><i
                                 class="fas fa-times"></i></button>
                        </div>
                     </div>
                  </div>
               </div>
               <div v-else class="no-activities">
                  No activities linked to this plan.
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import type { Package } from '@/types';

const route = useRoute();
const router = useRouter();
const pkg = ref<Package | null>(null);

const load = async () => {
   try {
      const res = await api.getPackageById(route.params.id as string);
      pkg.value = (res.data as any).data || [];

   } catch (err) {
      console.error(err);
      alert("Failed to load package details");
      router.push('/packages');
   }
};

const canProcess = computed(() => {
   if (!pkg.value) return false;
   return pkg.value.plans && pkg.value.plans.length > 0;
});

const process = async () => {
   if (confirm("Are you sure you want to process this package? This action cannot be undone.")) {
      try {
         await api.processPackage(pkg.value!.id);
         alert("Package processed successfully!");
         load();
      } catch (err: any) {
         alert(err.response?.data?.message || "Failed to process package");
      }
   }
};

const delPlan = async (id: string) => {
   if (confirm("Delete this plan? All linked activities will be removed.")) {
      try {
         await api.deletePlan(id);
         load();
      } catch (err) {
         alert("Failed to delete plan");
      }
   }
};

const delOq = async (id: string) => {
   if (confirm("Remove this activity from plan?")) {
      try {
         await api.deleteOrderedQuantity(id);
         load();
      } catch (err) {
         alert("Failed to remove activity");
      }
   }
};

const editPackage = () => {
   router.push(`/packages/${pkg.value!.id}/edit`);
};

const editPlan = (id: string) => {
   router.push(`/packages/${pkg.value!.id}/plans/${id}/edit`);
};

const editOq = (oq: any) => {
   router.push({
      path: `/packages/${pkg.value!.id}/plans/${pkg.value!.plans.find((p: any) => p.orderedActivities?.some((o: any) => o.id === oq.id))?.id}/ordered-quantity/${oq.id}/edit`,
      query: { quota: oq.orderedQuota }
   });
};

const linkAct = (pid: string) => router.push(`/packages/${pkg.value!.id}/plans/${pid}/ordered-quantity/create`);

const formatMoney = (n: number) => n.toLocaleString('id-ID');
const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const getStatusClass = (status: string) => {
   switch (status) {
      case 'Pending': return 'status-pending';
      case 'Processed': return 'status-processed';
      default: return 'status-default';
   }
};

const getIconForType = (type: string) => {
   switch (type) {
      case 'Flight': return 'fas fa-plane';
      case 'Accommodation': return 'fas fa-hotel';
      case 'Vehicle Rental': return 'fas fa-car';
      default: return 'fas fa-calendar-check';
   }
};

onMounted(load);
</script>

<style scoped>
.back-btn {
   margin-bottom: var(--spacing-md);
}

.detail-card {
   margin-bottom: var(--spacing-xl);
}

.detail-header {
   display: flex;
   justify-content: space-between;
   align-items: flex-start;
   margin-bottom: var(--spacing-lg);
   border-bottom: 1px solid var(--border-color);
   padding-bottom: var(--spacing-md);
}

.status-container {
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: var(--spacing-xs);
}

.status-badge {
   font-size: 0.875rem;
   font-weight: 700;
   padding: 0.25rem 0.75rem;
   border-radius: var(--radius-full);
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

.stats-grid {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
   gap: var(--spacing-lg);
   background-color: var(--background-color);
   padding: var(--spacing-lg);
   border-radius: var(--radius-md);
   margin-bottom: var(--spacing-lg);
}

.stat-label {
   font-size: 0.75rem;
   text-transform: uppercase;
   font-weight: 700;
   color: var(--text-secondary);
   margin-bottom: var(--spacing-xs);
}

.stat-value {
   font-size: 1.125rem;
   font-weight: 600;
   color: var(--text-primary);
}

.price {
   color: var(--success-color);
}

.actions-bar {
   display: flex;
   justify-content: flex-end;
   gap: var(--spacing-sm);
   padding-top: var(--spacing-md);
   border-top: 1px solid var(--border-color);
}

.btn-success {
   background-color: var(--success-color);
   color: white;
}

.btn-success:hover {
   background-color: #16a34a;
}

.btn-disabled {
   background-color: #9ca3af;
   cursor: not-allowed;
   color: white;
}

.section-header {
   margin-bottom: var(--spacing-lg);
}

.heading-2 {
   font-size: 1.5rem;
   font-weight: 700;
   color: var(--text-primary);
}

.plans-list {
   display: flex;
   flex-direction: column;
   gap: var(--spacing-lg);
}

.plan-card {
   padding: 0;
   overflow: hidden;
}

.plan-header {
   padding: var(--spacing-md);
   background-color: #f8fafc;
   border-bottom: 1px solid var(--border-color);
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.plan-info {
   display: flex;
   align-items: center;
   gap: var(--spacing-md);
}

.plan-icon {
   width: 40px;
   height: 40px;
   border-radius: 50%;
   background-color: #e0e7ff;
   color: var(--primary-color);
   display: flex;
   align-items: center;
   justify-content: center;
}

.plan-title {
   font-weight: 700;
   font-size: 1.125rem;
   color: var(--text-primary);
}

.plan-route {
   font-size: 0.875rem;
   color: var(--text-secondary);
}

.plan-actions {
   display: flex;
   align-items: center;
   gap: var(--spacing-md);
}

.plan-price {
   font-weight: 700;
   color: var(--success-color);
   font-size: 1.125rem;
}

.action-buttons {
   display: flex;
   gap: var(--spacing-xs);
}

.btn-icon {
   background: none;
   border: none;
   color: var(--text-secondary);
   padding: 0.5rem;
   cursor: pointer;
   transition: color 0.2s;
}

.btn-icon:hover {
   color: var(--primary-color);
}

.btn-icon.danger:hover {
   color: var(--error-color);
}

.plan-body {
   padding: var(--spacing-md);
}

.activities-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: var(--spacing-md);
}

.subheading {
   font-size: 0.875rem;
   font-weight: 700;
   text-transform: uppercase;
   color: var(--text-secondary);
}

.btn-link,
.btn-link-sm {
   background: none;
   border: none;
   color: var(--primary-color);
   font-weight: 600;
   cursor: pointer;
}

.btn-link:hover,
.btn-link-sm:hover {
   text-decoration: underline;
}

.btn-link-sm {
   font-size: 0.875rem;
}

.activities-list {
   background-color: var(--background-color);
   border-radius: var(--radius-md);
   border: 1px solid var(--border-color);
}

.activity-item {
   padding: var(--spacing-md);
   display: flex;
   justify-content: space-between;
   align-items: center;
   border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
   border-bottom: none;
}

.activity-name {
   font-weight: 600;
   color: var(--text-primary);
}

.activity-detail {
   font-size: 0.875rem;
   color: var(--text-secondary);
}

.activity-meta {
   display: flex;
   align-items: center;
   gap: var(--spacing-lg);
}

.activity-cost {
   text-align: right;
}

.activity-qty {
   font-size: 0.875rem;
   color: var(--text-secondary);
}

.activity-total {
   font-weight: 700;
   color: var(--text-primary);
}

.activity-actions {
   display: flex;
   gap: var(--spacing-xs);
}

.btn-icon-sm {
   background: none;
   border: none;
   padding: 0.25rem;
   cursor: pointer;
   color: #93c5fd;
   transition: color 0.2s;
}

.btn-icon-sm:hover {
   color: var(--primary-color);
}

.btn-icon-sm.danger {
   color: #fca5a5;
}

.btn-icon-sm.danger:hover {
   color: var(--error-color);
}

.no-activities {
   text-align: center;
   padding: var(--spacing-md);
   color: var(--text-secondary);
   font-style: italic;
   font-size: 0.875rem;
}

.empty-state {
   text-align: center;
   padding: var(--spacing-xl);
   background-color: white;
   border: 2px dashed var(--border-color);
   border-radius: var(--radius-lg);
}

.empty-icon {
   font-size: 2.5rem;
   color: #d1d5db;
   margin-bottom: var(--spacing-md);
}

.empty-text {
   color: var(--text-secondary);
   margin-bottom: var(--spacing-sm);
}
</style>
