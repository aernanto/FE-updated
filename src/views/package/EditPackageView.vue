<template>
    <div class="page-container">
        <div class="page-header">
            <h1 class="heading-1">Edit Package</h1>
            <button @click="$router.push('/packages')" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Back
            </button>
        </div>

        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading package details...</p>
        </div>

        <div v-else class="card form-card">
            <form @submit.prevent="save" class="form-content">
                <div class="input-group">
                    <label class="label">Package Name</label>
                    <input v-model="form.packageName" class="input" required>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label class="label">Quota</label>
                        <input v-model.number="form.quota" type="number" min="1" class="input" required>
                    </div>
                    <div class="input-group">
                        <label class="label">Base Price (IDR)</label>
                        <input v-model.number="form.price" type="number" min="0" class="input" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label class="label">Start Date</label>
                        <input v-model="form.startDate" type="date" class="input" required>
                    </div>
                    <div class="input-group">
                        <label class="label">End Date</label>
                        <input v-model="form.endDate" type="date" class="input" required>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" @click="$router.push('/packages')" class="btn btn-secondary">Cancel</button>
                    <button type="submit" :disabled="saving" class="btn btn-primary">
                        <span v-if="saving" class="spinner-sm"></span>
                        Update Package
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

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const saving = ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = ref<any>({
    packageName: '',
    quota: 10,
    price: 0,
    startDate: '',
    endDate: ''
});

onMounted(async () => {
    try {
        const res = await api.getPackageById(route.params.id as string);
        const data = res.data;
        form.value = {
            ...data,
            startDate: data.startDate ? data.startDate.substring(0, 10) : '',
            endDate: data.endDate ? data.endDate.substring(0, 10) : ''
        };
    } catch (err) {
        console.error(err);
        alert("Failed to load package");
        router.push('/packages');
    } finally {
        loading.value = false;
    }
});

const save = async () => {
    if (form.value.price < 0) return alert("Price must be >= 0");
    if (form.value.quota <= 0) return alert("Quota must be > 0");
    if (new Date(form.value.startDate) >= new Date(form.value.endDate)) return alert("Start date must be before end date");
    if (new Date(form.value.startDate) < new Date()) return alert("Start date must be in the future");

    saving.value = true;
    try {
        await api.updatePackage(route.params.id as string, form.value);
        alert("Package updated successfully");
        router.push('/packages');
    } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || 'Error updating package');
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
