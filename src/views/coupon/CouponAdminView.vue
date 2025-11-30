<template>
  <div class="page-container">
    <div class="card form-card">
      <h2 class="heading-2 mb-md">Create New Coupon</h2>
      <form @submit.prevent="save" class="form-content">
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
            <input type="number" v-model="form.percentOff" placeholder="% Discount" class="input" step="0.1" required>
          </div>
        </div>
        <button class="btn btn-primary w-full">Create</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ name: '', description: '', points: 100, percentOff: 10 });

const save = async () => {
  try { await api.createCoupon(form.value); router.push('/coupons'); }
  catch { alert("Error"); }
};
</script>

<style scoped>
.form-card {
  max-width: 600px;
  margin: 2.5rem auto;
}

.mb-md {
  margin-bottom: var(--spacing-md);
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
</style>
