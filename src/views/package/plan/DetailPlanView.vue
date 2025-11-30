<template>
  <main class="flex flex-col px-20 pt-10">
    <!-- Back Button -->
    <button
      @click="router.back()"
      class="text-gray-600 hover:text-purple-700 font-semibold mb-4 flex items-center gap-1"
    >
      ← Back
    </button>

    <!-- Title -->
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">View Plan</h1>

    <!-- Plan Information -->
    <div class="rounded-2xl overflow-hidden shadow mb-8">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Plan Information
      </div>

      <div class="bg-white px-6 py-6 grid grid-cols-2 gap-4 text-gray-800">
        <div><b>Plan Name:</b> {{ plan.planName }}</div>
        <div><b>Activity Type:</b> {{ plan.activityType }}</div>
        <div>
          <b>Plan Status:</b>
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full"
            :class="{
              'bg-green-100 text-green-800': plan.status === 'Fulfilled',
              'bg-orange-100 text-orange-800': plan.status === 'Unfulfilled'
            }"
          >
            {{ plan.status }}
          </span>
        </div>
        <div><b>Total Price:</b> Rp {{ formatPrice(plan.totalPrice) }}</div>
        <div><b>Start Date:</b> {{ formatDateTime(plan.startDate) }}</div>
        <div><b>End Date:</b> {{ formatDateTime(plan.endDate) }}</div>
        <div><b>Start Location:</b> {{ plan.startLocation }}</div>
        <div><b>End Location:</b> {{ plan.endLocation }}</div>
        <div class="col-span-2">
          <b>Package:</b>
          <RouterLink
            :to="`/packages/${plan.packageId}`"
            class="text-indigo-600 hover:underline"
          >
            {{ plan.packageName }}
          </RouterLink>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-white border-t px-6 py-4 flex gap-3">
        <RouterLink :to="`/packages/${plan.packageId}`">
          <button
            class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            View Package
          </button>
        </RouterLink>

        <RouterLink :to="`/plans/${route.params.id}/edit`">
          <button
            :to="`/plans/${plan.id}/edit`"
            class="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Edit Plan
          </button>
        </RouterLink>

        <button
          class="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          @click="handleDelete"
        >
          Delete Plan
        </button>
      </div>
    </div>

    <!-- Ordered Activities -->
    <div class="rounded-2xl overflow-hidden shadow">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Ordered Activities
      </div>

      <div class="bg-white p-6">
        <table class="min-w-full text-sm text-left border-collapse">
          <thead class="bg-purple-50 text-purple-800 font-semibold text-sm">
            <tr>
              <th class="px-4 py-2 border-b">Activity Name</th>
              <th class="px-4 py-2 border-b">Activity ID</th>
              <th class="px-4 py-2 border-b">Start Date</th>
              <th class="px-4 py-2 border-b">End Date</th>
              <th class="px-4 py-2 border-b">Price</th>
              <th class="px-4 py-2 border-b">Quota</th>
              <th class="px-4 py-2 border-b">Ordered Quota</th>
              <th class="px-4 py-2 border-b">Total</th>
              <th class="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="act in plan.orderedActivities"
              :key="act.activityId"
              class="hover:bg-gray-50 transition-all"
            >
              <td class="px-4 py-2 border-b">{{ act.activityName }}</td>
              <td class="px-4 py-2 border-b">{{ act.activityId }}</td>
              <td class="px-4 py-2 border-b">{{ formatDateTime(act.startDate) }}</td>
              <td class="px-4 py-2 border-b">{{ formatDateTime(act.endDate) }}</td>
              <td class="px-4 py-2 border-b">Rp {{ formatPrice(act.price) }}</td>
              <td class="px-4 py-2 border-b">{{ act.quota }}</td>
              <td class="px-4 py-2 border-b">{{ act.orderedQuota }}</td>
              <td class="px-4 py-2 border-b font-semibold">
                Rp {{ formatPrice(act.totalPrice) }}
              </td>
              <td class="px-4 py-2 border-b font-semibold">

              </td>
            </tr>

            <tr v-if="!plan.orderedActivities?.length">
              <td colspan="8" class="text-center py-4 text-gray-500">
                No ordered activities for this plan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePlanStore } from "@/stores/plan.store";

const route = useRoute();
const router = useRouter();
const planStore = usePlanStore();

const plan = computed(() => planStore.selectedPlan || { orderedActivities: [] });

onMounted(async () => {
  const id = route.params.id;
  await planStore.getPlanById(id);
});

const formatPrice = (num) =>
  new Intl.NumberFormat("id-ID").format(num || 0);

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleDelete = async () => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this plan?\nThis action cannot be undone."
  );
  if (!confirmDelete) return;

  try {
    await planStore.deletePlan(route.params.id);
    alert("Plan berhasil dihapus (soft delete).");

    // 🟣 gunakan optional chaining agar aman
    if (plan.value?.tourPackage?.id) {
      router.replace(`/packages/${plan.value.tourPackage.id}`);
    } else {
      router.replace("/packages");
    }
  } catch (err) {
    alert(err);
  }
};
</script>

<style scoped>
table th,
table td {
  border-color: #e5e7eb;
}
</style>
