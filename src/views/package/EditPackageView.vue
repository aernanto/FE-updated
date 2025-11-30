<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePackageStore } from "@/stores/package.store";
import { RouterLink } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();
const packageStore = usePackageStore();

const packageDetail = computed(() => packageStore.selectedPackage);

const form = ref({
  packageName: "",
  userId: "",
  startDate: "",
  endDate: "",
  quota: 0,
});
const isPending = ref(false);
const hasPlans = ref(false);

onMounted(async () => {
  await packageStore.getPackageById(route.params.id);
  const pkg = packageStore.selectedPackage;
  if (!pkg) return;

  form.value = {
    packageName: pkg.packageName,
    userId: pkg.userId,
    startDate: pkg.startDate?.slice(0, 16),
    endDate: pkg.endDate?.slice(0, 16),
    quota: pkg.quota,
  };

  isPending.value = pkg.status === "Pending";
  hasPlans.value = pkg.plans && pkg.plans.length > 0;
});

const handleUpdate = async () => {
  if (!isPending.value) {
    alert("❌ Only packages with status 'Pending' can be updated.");
    return;
  }
  if (hasPlans.value) {
    alert("❌ Cannot update a package that already has plans.");
    return;
  }
  if (new Date(form.value.endDate) < new Date(form.value.startDate)) {
    alert("❌ End Date cannot be before Start Date.");
    return;
  }

  try {
    await packageStore.updatePackage(route.params.id, {
      packageName: form.value.packageName,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      quota: form.value.quota,
    });
    alert("✅ Package updated successfully!");
    router.push(`/packages/${route.params.id}`);
  } catch (err) {
    alert(`Error: ${err.response?.data?.error || err.message}`);
  }
};
</script>

<template>
  <main class="flex flex-col px-20 pt-10">
    <RouterLink to="/packages" class="text-sm text-indigo-700 mb-3 hover:underline">← Back</RouterLink>
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Edit Package</h1>

    <div class="bg-white shadow-md rounded-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 text-lg font-semibold">
        Package Information
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-gray-700 mb-1">Package Name *</label>
          <input v-model="form.packageName" type="text"
                 class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">User ID *</label>
          <input v-model="form.userId" type="text" disabled
                 class="w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-500" />
        </div>

        <div class="flex gap-6">
          <div class="flex-1">
            <label class="block text-gray-700 mb-1">Start Date *</label>
            <input v-model="form.startDate" type="datetime-local"
                   class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="flex-1">
            <label class="block text-gray-700 mb-1">End Date *</label>
            <input v-model="form.endDate" type="datetime-local"
                   class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Quota *</label>
          <input v-model="form.quota" type="number" min="1"
                 class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div class="flex justify-end">
          <button
            @click="handleUpdate"
            :disabled="!isPending || hasPlans"
            class="px-5 py-2 rounded-lg font-semibold transition-all"
            :class="[
              (!isPending || hasPlans)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90',
            ]"
          >
            Update Package
          </button>
        </div>
      </div>
    </div>

    <!-- Manage Plans -->
    <div class="bg-white shadow-md rounded-2xl mt-8 overflow-hidden">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 flex justify-between items-center"
      >
        <span class="font-semibold text-lg">Manage Plans</span>
        <RouterLink v-if="isPending" :to="`/packages/${route.params.id}/plans/create`">
          <button
            class="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-50 transition-all"
          >
            Create New Plan
          </button>
        </RouterLink>
      </div>


      <div class="p-6 text-gray-600">
        <p v-if="!packageStore.selectedPackage?.plans?.length">No plans available.</p>
        <table v-else class="w-full border text-sm">
          <thead class="bg-indigo-50 text-indigo-800">
            <tr>
              <th class="p-2 text-left">Plan Name</th>
              <th class="p-2 text-left">Activity Type</th>
              <th class="p-2 text-left">Price</th>
              <th class="p-2 text-left">Start Date</th>
              <th class="p-2 text-left">End Date</th>
              <th class="p-2 text-left">Start Location</th>
              <th class="p-2 text-left">End Location</th>
              <th class="p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in packageStore.selectedPackage.plans" :key="plan.id" class="border-t">
              <td class="p-2">{{ plan.planName }}</td>
              <td class="p-2">{{ plan.activityType }}</td>
              <td class="p-2">Rp {{ new Intl.NumberFormat("id-ID").format(plan.price) }}</td>
              <td class="p-2">{{ new Date(plan.startDate).toLocaleString("id-ID") }}</td>
              <td class="p-2">{{ new Date(plan.endDate).toLocaleString("id-ID") }}</td>
              <td class="p-2">{{ plan.startLocation }}</td>
              <td class="p-2">{{ plan.endLocation }}</td>
              <td class="p-2 text-center">
                <span class="px-2 py-1 rounded-xl font-semibold"
                      :class="plan.status === 'fulfilled'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'">
                  {{ plan.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
