<template>
  <main class="flex flex-col px-20 pt-10">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Coupon Management</h1>

    <!-- Create Coupon Button -->
    <div class="mb-6 flex justify-end">
      <button
        @click="showCreateModal = true"
        class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 shadow-lg"
      >
        + Create New Coupon
      </button>
    </div>

    <!-- Coupons List -->
    <div class="rounded-2xl overflow-hidden shadow">
      <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold">
        All Coupons
      </div>
      <div class="bg-white p-6">
        <div v-if="loading" class="text-center py-8 text-gray-500">
          Loading coupons...
        </div>
        <div v-else-if="coupons.length === 0" class="text-center py-8 text-gray-500">
          No coupons created yet.
        </div>
        <table v-else class="w-full text-sm">
          <thead class="bg-purple-50 text-purple-800">
            <tr>
              <th class="px-4 py-3 text-left">Name</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-left">Points</th>
              <th class="px-4 py-3 text-left">Discount</th>
              <th class="px-4 py-3 text-left">Created</th>
              <th class="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="coupon in coupons"
              :key="coupon.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-4 py-3 font-semibold">{{ coupon.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ coupon.description }}</td>
              <td class="px-4 py-3 font-semibold text-indigo-600">{{ coupon.points }}</td>
              <td class="px-4 py-3 font-semibold text-green-600">{{ coupon.percentOff }}%</td>
              <td class="px-4 py-3">{{ formatDate(coupon.createdDate) }}</td>
              <td class="px-4 py-3 text-center">
                <button
                  @click="handleEdit(coupon)"
                  class="text-blue-600 hover:text-blue-800 font-semibold mr-3"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-xl w-[500px] p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ showCreateModal ? 'Create New Coupon' : 'Edit Coupon' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1">Coupon Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Holiday Special"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Description *</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the coupon..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Points Required *</label>
              <input
                v-model.number="form.points"
                type="number"
                required
                min="1"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-1">Discount (%) *</label>
              <input
                v-model.number="form.percentOff"
                type="number"
                required
                min="1"
                max="100"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-200 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              {{ showCreateModal ? 'Create' : 'Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, reactive } from "vue";
import { useLoyaltyStore } from "@/stores/loyalty.store";
import type { CreateCouponRequest, Coupon } from "@/stores/loyalty.store";

const loyaltyStore = useLoyaltyStore();

const coupons = computed(() => loyaltyStore.coupons);
const loading = computed(() => loyaltyStore.loading);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingCouponId = ref<string | null>(null);

const form = reactive<CreateCouponRequest>({
  name: "",
  description: "",
  points: 0,
  percentOff: 0,
});

const resetForm = () => {
  form.name = "";
  form.description = "";
  form.points = 0;
  form.percentOff = 0;
  editingCouponId.value = null;
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const handleEdit = (coupon: Coupon) => {
  form.name = coupon.name;
  form.description = coupon.description;
  form.points = coupon.points;
  form.percentOff = coupon.percentOff;
  editingCouponId.value = coupon.id;
  showEditModal.value = true;
};

const handleSubmit = async () => {
  try {
    if (showCreateModal.value) {
      await loyaltyStore.createCoupon(form);
    } else if (showEditModal.value && editingCouponId.value) {
      await loyaltyStore.updateCoupon(editingCouponId.value, form);
    }

    closeModal();
    await loyaltyStore.fetchCoupons();
  } catch (error) {
    // Error already handled in store
    console.error('Submit error:', error);
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

onMounted(async () => {
  await loyaltyStore.fetchCoupons();
});
</script>
