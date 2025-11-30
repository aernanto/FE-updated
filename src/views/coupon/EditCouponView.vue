<template>
    <div class="page-container">
        <div class="card form-card">
            <div class="page-header">
                <h2 class="heading-2">Edit Coupon</h2>
                <button @click="$router.push('/coupons')" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
            </div>

            <form v-else @submit.prevent="save" class="form-content">
                <div class="input-group">
                    <label class="label">Coupon Name</label>
                    <input v-model="form.name" placeholder="Coupon Name" class="input" required>
                </div>
                <div class="input-group">
                    <label class="label">Description</label>
                    <input v-model="form.description" placeholder="Description" class="input" required>
                </div>
                <div class="form-row">
                    <div class="input-group">
                        <label class="label">Points Cost</label>
                        <input type="number" v-model="form.points" placeholder="Points Cost" class="input" required>
                    </div>
                    <div class="input-group">
                        <label class="label">% Discount</label>
                        <input type="number" v-model="form.percentOff" placeholder="% Discount" class="input" step="0.1"
                            required>
                    </div>
                </div>
                <button type="submit" :disabled="saving" class="btn btn-primary w-full">
                    <span v-if="saving" class="spinner-sm"></span>
                    Update Coupon
                </button>
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
const form = ref({ name: '', description: '', points: 100, percentOff: 10 });

onMounted(async () => {
    try {
        const res = await api.getCouponById(route.params.id as string);
        form.value = res.data;
    } catch (err) {
        console.error(err);
        alert("Failed to load coupon");
        router.push('/coupons');
    } finally {
        loading.value = false;
    }
});

const save = async () => {
    saving.value = true;
    try {
        await api.updateCoupon(route.params.id as string, form.value);
        alert("Coupon updated successfully");
        router.push('/coupons');
    } catch (err) {
        alert("Error updating coupon");
    } finally {
        saving.value = false;
    }
};
</script>

<style scoped>
.form-card {
    max-width: 600px;
    margin: 2.5rem auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

.w-full {
    width: 100%;
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
    margin: 0 auto;
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
</style>
