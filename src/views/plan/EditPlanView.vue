<template>
    <div class="page-container">
        <div class="page-header">
            <h1 class="heading-1">Edit Plan</h1>
            <button @click="$router.back()" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Back
            </button>
        </div>

        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading plan details...</p>
        </div>

        <div v-else class="card form-card">
            <form @submit.prevent="save" class="form-content">
                <div class="input-group">
                    <label class="label">Plan Name</label>
                    <input v-model="form.planName" class="input" placeholder="e.g., Day 1: Arrival">
                </div>

                <div class="input-group">
                    <label class="label">Activity Type</label>
                    <select v-model="form.activityType" class="input select" disabled>
                        <option value="Flight">Flight</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Vehicle Rental">Vehicle Rental</option>
                    </select>
                    <p class="helper-text">Activity Type cannot be changed.</p>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label class="label">Start Location</label>
                        <LocationSelector :model-value="form.startLocation || ''"
                            @update:model-value="form.startLocation = $event" required />
                    </div>
                    <div class="input-group">
                        <label class="label">End Location</label>
                        <LocationSelector :model-value="form.endLocation || ''"
                            @update:model-value="form.endLocation = $event" required />
                    </div>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label class="label">Start Date</label>
                        <input type="datetime-local" v-model="form.startDate" class="input" required>
                    </div>
                    <div class="input-group">
                        <label class="label">End Date</label>
                        <input type="datetime-local" v-model="form.endDate" class="input" required>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" @click="$router.back()" class="btn btn-secondary">Cancel</button>
                    <button type="submit" :disabled="saving" class="btn btn-primary">
                        <span v-if="saving" class="spinner-sm"></span>
                        Update Plan
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import { useRoute, useRouter } from 'vue-router';
import LocationSelector from '@/components/common/LocationSelector.vue';
import type { CreatePlanRequest } from '@/types';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const saving = ref(false);

const form = ref<CreatePlanRequest>({
    planName: '',
    activityType: '',
    startLocation: '',
    endLocation: '',
    startDate: '',
    endDate: ''
});

onMounted(async () => {
    try {
        const res = await api.getPlanById(route.params.planId as string);
        const data = res.data;
        form.value = {
            ...data,
            startDate: data.startDate ? data.startDate.substring(0, 16) : '',
            endDate: data.endDate ? data.endDate.substring(0, 16) : ''
        };
    } catch (err) {
        console.error(err);
        alert("Failed to load plan");
        router.back();
    } finally {
        loading.value = false;
    }
});

const save = async () => {
    if (new Date(form.value.startDate) >= new Date(form.value.endDate)) return alert("Start date must be before end date");

    saving.value = true;
    try {
        await api.updatePlan(route.params.planId as string, form.value);
        alert("Plan updated successfully");
        router.back();
    } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || 'Error updating plan');
    } finally {
        saving.value = false;
    }
};
</script>

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

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
}

.helper-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: var(--spacing-xs);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-color);
}

.loading-state {
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

.spinner-sm {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-right: var(--spacing-sm);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 640px) {
    .form-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }
}
</style>
