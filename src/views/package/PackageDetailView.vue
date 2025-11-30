<template>
  <main class="flex flex-col px-20 pt-10">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-semibold text-gray-800">
        {{ packageDetail.packageName }}
      </h1>

      <div class="flex gap-3">
        <button
          v-if="packageDetail.status === 'Pending'"
          @click="handleEdit"
          class="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Edit Package
        </button>
        <button
          v-if="packageDetail.status === 'Pending'"
          @click="handleDelete"
          class="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Delete Package
        </button>
        <button
          v-if="packageDetail.status === 'Pending'"
          @click="handleProcess"
          class="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Process Package
        </button>
      </div>
    </div>

    <!-- Package Info -->
    <div class="rounded-2xl overflow-hidden shadow mb-8">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Package Information
      </div>

      <div class="bg-white px-6 py-4 grid grid-cols-2 gap-4 text-gray-800">
        <div><b>Package Name:</b> {{ packageDetail.packageName }}</div>
        <div><b>User ID:</b> {{ packageDetail.userId }}</div>
        <div><b>Start Date:</b> {{ formatDateTime(packageDetail.startDate) }}</div>
        <div><b>End Date:</b> {{ formatDateTime(packageDetail.endDate) }}</div>
        <div><b>Quota:</b> {{ packageDetail.quota }}</div>
        <div>
          <b>Status:</b>
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full"
            :class="{
              'bg-green-100 text-green-800': packageDetail.status === 'Processed',
              'bg-orange-100 text-orange-800': packageDetail.status === 'Pending'
            }"
          >
            {{ packageDetail.status }}
          </span>
        </div>
        <div><b>Total Price:</b> Rp {{ formatPrice(packageDetail.price) }}</div>
      </div>
    </div>

    <!-- Plans Table -->
    <div class="rounded-2xl overflow-hidden shadow">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Plans for Package
      </div>

      <div class="bg-white p-6">
        <table class="min-w-full text-sm text-left border-collapse">
          <thead class="bg-purple-50 text-purple-800 font-semibold text-sm">
            <tr>
              <th class="px-4 py-2 border-b">Plan ID</th>
              <th class="px-4 py-2 border-b">Activity Type</th>
              <th class="px-4 py-2 border-b">Price</th>
              <th class="px-4 py-2 border-b">Start Date</th>
              <th class="px-4 py-2 border-b">End Date</th>
              <th class="px-4 py-2 border-b">Start Location</th>
              <th class="px-4 py-2 border-b">End Location</th>
              <th class="px-4 py-2 border-b">Status</th>
              <th class="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="plan in packageDetail.plans"
              :key="plan.id"
              class="hover:bg-gray-50 transition-all"
            >
              <td class="px-4 py-2 border-b">{{ plan.id }}</td>
              <td class="px-4 py-2 border-b">{{ plan.activityType }}</td>
              <td class="px-4 py-2 border-b">Rp {{ formatPrice(plan.price) }}</td>
              <td class="px-4 py-2 border-b">{{ formatDateTime(plan.startDate) }}</td>
              <td class="px-4 py-2 border-b">{{ formatDateTime(plan.endDate) }}</td>
              <td class="px-4 py-2 border-b">{{ plan.startLocation }}</td>
              <td class="px-4 py-2 border-b">{{ plan.endLocation }}</td>
              <td class="px-4 py-2 border-b">
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': plan.status === 'Fulfilled',
                    'bg-orange-100 text-orange-800': plan.status === 'Unfulfilled'
                  }"
                >
                  {{ plan.status }}
                </span>
              </td>
              <td class="px-4 py-2 border-b text-center">
                <button
                  @click="viewPlan(plan.id)"
                  class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:opacity-90"
                >
                  View
                </button>
              </td>
            </tr>
            <tr v-if="!packageDetail.plans.length">
              <td colspan="9" class="text-center py-4 text-gray-500">
                No plans available for this package.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePackageStore } from "@/stores/package.store";
import { toast } from "vue-sonner";
import { getCurrentUser } from "@/lib/auth";

const route = useRoute();
const router = useRouter();
const packageStore = usePackageStore();

const packageDetail = computed(() => packageStore.selectedPackage || { plans: [] });

const viewPlan = (planId) => {
  router.push(`/plans/${planId}`);
};

onMounted(async () => {
  const id = route.params.id;
  await packageStore.getPackageById(id);
});

const handleDelete = async () => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this package?\nThis action cannot be undone and will also delete all associated plans."
  );
  if (!confirmDelete) return;

  try {
    await packageStore.deletePackage(route.params.id);
    alert("Package berhasil dihapus!");
    await router.replace({ path: "/packages", query: { reload: Date.now() } });
  } catch (err) {
    alert(err);
  }
};

const handleEdit = () => {
  const pkg = packageDetail.value;
  if (pkg.status !== "Pending") {
    alert("❌ Only packages with status 'Pending' can be edited.");
    return;
  }
  router.push(`/packages/${pkg.id}/edit`);
};

const handleProcess = async () => {
  const confirmProcess = confirm("Are you sure you want to process this package?");
  if (!confirmProcess) return;

  try {
    const msg = await packageStore.processPackage(route.params.id);
    alert("✅ " + msg);
    window.location.reload();
  } catch (err) {
    alert("❌ " + err);
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (num) => new Intl.NumberFormat("id-ID").format(num || 0);

</script>

<style scoped>
table th,
table td {
  border-color: #e5e7eb;
}
</style>
