<template>
  <!-- Main Page -->
  <main class="flex flex-col px-20 pt-10">
    <!-- Back Button -->
    <button
      @click="router.back()"
      class="text-gray-600 hover:text-purple-700 font-semibold mb-4 flex items-center gap-1"
    >
      ← Back
    </button>

    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      Edit Plan
    </h1>

    <!-- Plan Info -->
    <div class="rounded-2xl overflow-hidden shadow mb-8">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Plan Information
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="bg-white px-6 py-6 grid grid-cols-2 gap-4 text-gray-800"
      >
        <div>
          <label class="font-semibold">Plan Name *</label>
          <input
            v-model="form.planName"
            type="text"
            class="border rounded-lg px-3 py-2 w-full"
            :disabled="isPlanLocked"
          />
        </div>

        <div>
          <label class="font-semibold">Activity Type</label>
          <input
            v-model="plan.activityType"
            disabled
            class="border rounded-lg px-3 py-2 w-full bg-gray-100"
          />
        </div>

        <div>
          <label class="font-semibold">Start Date *</label>
          <input
            v-model="form.startDate"
            type="datetime-local"
            class="border rounded-lg px-3 py-2 w-full"
            :disabled="isPlanLocked"
          />
        </div>

        <div>
          <label class="font-semibold">End Date *</label>
          <input
            v-model="form.endDate"
            type="datetime-local"
            class="border rounded-lg px-3 py-2 w-full"
            :disabled="isPlanLocked"
          />
        </div>

        <!-- Start Location -->
        <div>
          <label class="font-semibold">Start Location *</label>
          <select
            v-model="form.startLocation"
            class="border rounded-lg px-3 py-2 w-full"
            :disabled="locationStore.loading"
          >
            <option value="">Select start location</option>
            <option
              v-for="loc in locationStore.listOfLocations"
              :key="loc"
              :value="loc"
            >
              {{ loc }}
            </option>
          </select>
        </div>

        <!-- End Location -->
        <div>
          <label class="font-semibold">End Location *</label>
          <select
            v-model="form.endLocation"
            class="border rounded-lg px-3 py-2 w-full"
            :disabled="locationStore.loading"
          >
            <option value="">Select end location</option>
            <option
              v-for="loc in locationStore.listOfLocations"
              :key="loc"
              :value="loc"
            >
              {{ loc }}
            </option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="col-span-2 flex gap-3 mt-6">
          <button
            type="submit"
            class="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
            :disabled="isPlanLocked"
          >
            Update Plan
          </button>

          <RouterLink :to="`/plans/${route.params.id}`">
            <button
              type="button"
              class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </RouterLink>
        </div>
      </form>

      <div
        v-if="isPlanLocked"
        class="bg-yellow-50 text-yellow-800 px-6 py-3 text-sm border-t"
      >
        ⚠️ Plan details are locked because this <b>package is Processed</b> or this plan already has
        <b>ordered activities</b>.
      </div>
    </div>

    <!-- Ordered Activities -->
    <div class="rounded-2xl overflow-hidden shadow">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold flex justify-between items-center"
      >
        <span>Ordered Activities</span>

        <button
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
          :disabled="!isPackagePending"
          @click="handleAddActivity"
        >
          + Add Activity
        </button>
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
              <th class="px-4 py-2 border-b text-center">Actions</th>
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
              <td class="px-4 py-2 border-b text-center">
                <button
                  class="bg-yellow-400 text-white px-3 py-1 rounded-lg text-sm hover:opacity-90"
                  :disabled="!isPackagePending"
                  @click="handleEditOrderedQuantity(act)"
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:opacity-90"
                  :disabled="!isPackagePending"
                  @click="handleRemoveOrderedQuantity(act)"
                >
                  Remove
                </button>
              </td>
            </tr>

            <tr v-if="!plan.orderedActivities?.length">
              <td colspan="9" class="text-center py-4 text-gray-500">
                No ordered activities yet.
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="!isPackagePending"
          class="bg-yellow-50 text-yellow-800 px-4 py-2 mt-3 text-sm rounded-lg"
        >
          ⚠️ You can only remove or add ordered activities when the package is
          <b>Pending</b>.
        </div>
      </div>
    </div>
  </main>


  <!-- Add Activity Modal -->
  <div
    v-if="showAddModal"
    class="fixed inset-0 bg-gray-900/30 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-lg w-[480px] p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Add Activity to Plan</h2>
        <button @click="showAddModal = false" class="text-gray-500 hover:text-gray-700 text-xl">×</button>
      </div>

      <!-- Dropdown Activity -->
      <label class="block font-semibold mb-1 text-sm">Activity *</label>
      <select
        v-model="selectedActivityId"
        class="border rounded-lg w-full px-3 py-2 mb-4"
      >
        <option value="">Select an activity</option>
        <option
          v-for="act in availableActivities"
          :key="act.id"
          :value="act.id"
        >
          {{ act.activityName }} - {{ act.activityType }} (Rp {{ formatPrice(act.price) }})
        </option>
      </select>

      <!-- Selected Activity Detail -->
      <div v-if="selectedActivity" class="bg-purple-50 p-3 rounded-lg text-sm mb-4">
        <p><b>Name:</b> {{ selectedActivity.activityName }}</p>
        <p><b>Type:</b> {{ selectedActivity.activityType }}</p>
        <p><b>Price:</b> Rp {{ formatPrice(selectedActivity.price) }}</p>
        <p><b>Capacity:</b> {{ selectedActivity.capacity }}</p>
        <p><b>Start:</b> {{ formatDateTime(selectedActivity.startDate) }}</p>
        <p><b>End:</b> {{ formatDateTime(selectedActivity.endDate) }}</p>
      </div>

      <!-- Ordered Quantity -->
      <label class="block font-semibold mb-1 text-sm">Ordered Quantity *</label>
      <input
        v-model.number="orderedQty"
        type="number"
        min="1"
        :max="selectedActivity?.capacity || 1"
        class="border rounded-lg px-3 py-2 w-full mb-4"
      />

      <div class="text-sm text-gray-600 mb-4">
        Maximum: {{ selectedActivity?.capacity || 0 }}
      </div>

      <div v-if="selectedActivity" class="bg-green-50 p-3 rounded-lg text-center text-green-700 font-semibold">
        Total Price: Rp {{ formatPrice(selectedActivity.price * (orderedQty || 0)) }}
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3 mt-5">
        <button
          @click="showAddModal = false"
          class="bg-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          @click="handleConfirmAddActivity"
          class="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
          :disabled="!selectedActivityId || !orderedQty"
        >
          Add Activity
        </button>
      </div>
    </div>
  </div>


  <!-- Edit Ordered Activity Modal -->
  <div
    v-if="showEditModal"
    class="fixed inset-0 bg-gray-900/30 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-lg w-[480px] p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Edit Ordered Activity</h2>
        <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700 text-xl">×</button>
      </div>

      <!-- Activity Details -->
      <div v-if="selectedOrderedActivity" class="space-y-2 text-sm mb-4">
        <p><b>Activity Name:</b> {{ selectedOrderedActivity.activityName }}</p>
        <p><b>Unit Price:</b> Rp {{ formatPrice(selectedOrderedActivity.price) }}</p>
        <p><b>Activity Capacity:</b> {{ selectedOrderedActivity.quota }}</p>
        <p><b>Current Ordered Quantity:</b> {{ selectedOrderedActivity.orderedQuota }}</p>
      </div>

      <!-- Ordered Quantity -->
      <label class="block font-semibold mb-1 text-sm">Ordered Quantity *</label>
      <input
        v-model.number="editOrderedQty"
        type="number"
        min="1"
        :max="selectedOrderedActivity?.quota || 1"
        class="border rounded-lg px-3 py-2 w-full mb-3"
      />

      <div class="text-sm text-gray-600 mb-4">
        Maximum: {{ selectedOrderedActivity?.quota || 0 }}
      </div>

      <div v-if="selectedOrderedActivity" class="bg-green-50 p-3 rounded-lg text-center text-green-700 font-semibold">
        Total Price: Rp {{ formatPrice(selectedOrderedActivity.price * (editOrderedQty || 0)) }}
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3 mt-5">
        <button
          @click="showEditModal = false"
          class="bg-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          @click="handleConfirmEditActivity"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
          :disabled="!editOrderedQty"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePlanStore } from "@/stores/plan.store";

const route = useRoute();
const router = useRouter();
const planStore = usePlanStore();
const locationStore = useLocationStore();

const emptyPlan: TravelPlan = {
  id: "", planName: "", activityType: "", status: "",
  totalPrice: 0, startDate: "", endDate: "",
  startLocation: "", endLocation: "",
  packageId: "", packageName: "", packageStatus: "",
  orderedActivities: [], // ⬅️ penting
};

const plan = ref<TravelPlan>(emptyPlan);
const form = ref({
  planName: "",
  startDate: "",
  endDate: "",
  startLocation: "",
  endLocation: "",
});

onMounted(async () => {
  await locationStore.fetchLocations();
  await planStore.getPlanById(route.params.id as string);
  if (!planStore.selectedPlan) {
    router.back();
    return;
  }
  plan.value = planStore.selectedPlan;

  form.value.planName = plan.value.planName;
  form.value.startDate = plan.value.startDate?.slice(0, 16) || "";
  form.value.endDate = plan.value.endDate?.slice(0, 16) || "";
  form.value.startLocation = plan.value.startLocation;
  form.value.endLocation = plan.value.endLocation;
});

const isProcessed = computed(() => {
  const s = (plan.value?.packageStatus || "").toLowerCase();
  return s === "processed" || s === "proccessed";
});

const hasOrderedQty = computed(
  () => (plan.value?.orderedActivities?.length ?? 0) > 0
);

// 🔒 Kunci edit plan detail hanya ketika package Processed & ada ordered activities
const isPlanLocked = computed(() => isProcessed.value || hasOrderedQty.value);

// (opsional) tetap dipakai di tempat lain jika perlu
const isPackagePending = computed(() => (plan.value?.packageStatus || "") === "Pending");

const handleSubmit = async () => {
  if (isPlanLocked.value) return alert("Plan cannot be edited.");

  try {
    const payload = {
      ...form.value,
      startDate: new Date(form.value.startDate).toISOString(),
      endDate: new Date(form.value.endDate).toISOString(),
    };

    await planStore.updatePlan(route.params.id as string, payload);
    alert("Plan updated successfully!");
    router.push(`/plans/${route.params.id}`);
  } catch (err: any) {
    alert(err.message || "Failed to update plan.");
  }
};

const handleRemoveOrderedQuantity = async (act: any) => {
  const confirmDelete = confirm(
    `Are you sure you want to remove "${act.activityName}" from this plan?`
  );
  if (!confirmDelete) return;

  try {
    await planStore.deleteOrderedQuantity(act.id);
    alert("Ordered activity successfully removed.");
    await planStore.getPlanById(route.params.id as string);
    plan.value = planStore.selectedPlan!;
  } catch (err: any) {
    alert(err.message || "Failed to remove ordered activity.");
  }
};

const formatPrice = (num: any) => new Intl.NumberFormat("id-ID").format(num || 0);
const formatDateTime = (dateStr: any) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

import { useOrderedStore } from "@/stores/ordered.store";

const orderedStore = useOrderedStore();

const showAddModal = ref(false);
const availableActivities = ref<any[]>([]);
const selectedActivityId = ref("");
const selectedActivity = computed(() =>
  availableActivities.value.find((a) => a.id === selectedActivityId.value)
);
const orderedQty = ref<number>(0);

// Open modal
const handleAddActivity = async () => {
  try {
    availableActivities.value = await orderedStore.getAvailableActivities(route.params.id as string);
    showAddModal.value = true;
  } catch (err: any) {
    alert(err.message || "Failed to load available activities.");
  }
};

// Confirm add activity
const handleConfirmAddActivity = async () => {
  if (!selectedActivityId.value || !orderedQty.value) {
    return alert("Please select activity and enter ordered quantity.");
  }

  try {
    await orderedStore.createOrderedActivity({
      activityId: selectedActivityId.value,
      planId: route.params.id as string,
      orderedQuota: orderedQty.value,
    });

    alert("Activity added successfully!");
    showAddModal.value = false;
    await planStore.getPlanById(route.params.id as string);
    plan.value = planStore.selectedPlan!;
  } catch (err: any) {
    alert(err.message || "Failed to add activity.");
  }
};



import type { UpdateOrderedActivityRequest } from "@/interface/ordered.activity.interface";
import type { TravelPlan } from "@/interface/plan.interface";
import { toast } from "vue-sonner";
import { useLocationStore } from "@/stores/location.store";

const showEditModal = ref(false);
const selectedOrderedActivity = ref<any>(null);
const editOrderedQty = ref<number>(0);

const handleEditOrderedQuantity = (act: any) => {
  selectedOrderedActivity.value = act;
  editOrderedQty.value = act.orderedQuota;
  showEditModal.value = true;
};

const handleConfirmEditActivity = async () => {
  if (!selectedOrderedActivity.value) return;

  try {
    await orderedStore.updateOrderedActivity(selectedOrderedActivity.value.id, {
      orderedQuota: editOrderedQty.value,
    } as UpdateOrderedActivityRequest);

    alert("Ordered activity updated successfully!");
    showEditModal.value = false;
    await planStore.getPlanById(route.params.id as string);
    plan.value = planStore.selectedPlan!;
  } catch (err: any) {
    alert(err.message || "Failed to update ordered activity.");
  }
};

</script>

<style scoped>
input[disabled] {
  cursor: not-allowed;
  background-color: #f3f4f6;
}
</style>
