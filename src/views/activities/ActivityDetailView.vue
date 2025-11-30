<!-- src/views/activities/ActivityDetailView.vue -->
<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useActivityStore } from "@/stores/activity.store";
import {
  isSuperAdmin,
  isTourPackageVendor,
  isAccommodationOwner,
  isFlightAirline,
  isRentalVendor,
} from "@/lib/rbac";

const route = useRoute();
const router = useRouter();
const activityStore = useActivityStore();

const activity = computed(() => activityStore.selectedActivity);

const canEditOrDelete = computed(
  () =>
    isSuperAdmin() ||
    isTourPackageVendor() ||
    isAccommodationOwner() ||
    isFlightAirline() ||
    isRentalVendor()
);

onMounted(async () => {
  const id = route.params.id as string;
  if (id) await activityStore.getActivityById(id);
});

const formatCurrency = (value?: number) =>
  value != null
    ? `Rp ${new Intl.NumberFormat("id-ID").format(value)}`
    : "-";

const handleEdit = () => {
  if (activity.value?.id) {
    router.push(`/activities/${activity.value.id}/edit`);
  }
};

const handleDelete = async () => {
  if (!activity.value?.id) return;

  if (
    !confirm(
      "Are you sure you want to delete this activity? This action cannot be undone."
    )
  ) {
    return;
  }

  await activityStore.deleteActivity(activity.value.id);
  router.push("/activities");
};
</script>

<template>
  <main class="flex flex-col px-20 pt-10">
    <RouterLink
      to="/activities"
      class="text-sm text-indigo-700 mb-3 hover:underline"
      >← Back to Activities</RouterLink
    >
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      Activity Detail
    </h1>

    <div v-if="!activity" class="text-gray-500">Loading...</div>

    <div
      v-else
      class="bg-white shadow-md rounded-2xl overflow-hidden mb-8"
    >
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 flex justify-between items-center"
      >
        <div>
          <h2 class="text-lg font-semibold">
            {{ activity.activityName }}
          </h2>
          <p class="text-sm text-purple-100">
            {{ activity.activityType }} •
            {{ activity.activityItem }}
          </p>
        </div>

        <div class="flex gap-2" v-if="canEditOrDelete">
          <button
            @click="handleEdit"
            class="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-50 transition-all text-sm"
          >
            Edit
          </button>
          <button
            @click="handleDelete"
            class="bg-transparent border border-white/70 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-red-600 transition-all text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">Activity Item</p>
          <p class="font-semibold text-gray-800">
            {{ activity.activityItem }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Price</p>
          <p class="font-semibold text-gray-800">
            {{ formatCurrency(activity.price) }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Capacity</p>
          <p class="font-semibold text-gray-800">
            {{ activity.capacity }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Status</p>
          <p class="font-semibold">
            <span
              class="px-2 py-1 rounded-xl text-xs font-bold"
              :class="
                activity.deletedAt == null
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              {{ activity.deletedAt == null ? "Active" : "Deleted" }}
            </span>
          </p>
        </div>

        <div>
          <p class="text-gray-500">Start Date</p>
          <p class="font-semibold text-gray-800">
            {{ new Date(activity.startDate).toLocaleString("id-ID") }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">End Date</p>
          <p class="font-semibold text-gray-800">
            {{ new Date(activity.endDate).toLocaleString("id-ID") }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Start Location</p>
          <p class="font-semibold text-gray-800">
            {{ activity.startLocation }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">End Location</p>
          <p class="font-semibold text-gray-800">
            {{ activity.endLocation }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
