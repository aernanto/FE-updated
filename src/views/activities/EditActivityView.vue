<!-- src/views/activities/EditActivityView.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import ActivityForm from "@/components/activities/ActivityForm.vue";
import { useActivityStore } from "@/stores/activity.store";

const route = useRoute();
const router = useRouter();
const activityStore = useActivityStore();

const initialForm = ref<any | null>(null);

const isLoading = computed(() => activityStore.loading);

onMounted(async () => {
  const id = route.params.id as string;
  if (!id) return;

  const act = await activityStore.getActivityById(id);
  if (!act) return;

  initialForm.value = {
    activityName: act.activityName,
    activityType: act.activityType,
    activityItem: act.activityItem,
    capacity: act.capacity,
    price: act.price,
    startDate: act.startDate?.slice(0, 16),
    endDate: act.endDate?.slice(0, 16),
    startLocation: act.startLocation,
    endLocation: act.endLocation,
  };
});

const handleSubmit = async (payload: any) => {
  const id = route.params.id as string;
  try {
    await activityStore.updateActivity(id, payload);
    alert("✅ Activity updated successfully!");
    router.push(`/activities/${id}`);
  } catch (err: any) {
    alert(err?.message || "Failed to update activity.");
  }
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
      Edit Activity
    </h1>

    <div class="bg-white shadow-md rounded-2xl overflow-hidden">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 text-lg font-semibold"
      >
        Activity Information
      </div>

      <div v-if="isLoading && !initialForm" class="p-6 text-gray-500">
        Loading...
      </div>
      <ActivityForm
        v-else-if="initialForm"
        mode="edit"
        :initial-value="initialForm"
        @submit="handleSubmit"
      />
      <div v-else class="p-6 text-red-500">
        Activity not found.
      </div>
    </div>
  </main>
</template>
