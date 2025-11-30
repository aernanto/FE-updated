<!-- src/views/activities/CreateActivityView.vue -->
<script setup lang="ts">
import { useRouter } from "vue-router";
import ActivityForm from "@/components/activities/ActivityForm.vue";
import { useActivityStore } from "@/stores/activity.store";

const router = useRouter();
const activityStore = useActivityStore();

const handleSubmit = async (payload: any) => {
  try {
    const created = await activityStore.createActivity(payload);
    if (created?.id) {
      alert("✅ Activity created successfully!");
      router.push("/activities");
    }
  } catch (err: any) {
    alert(err?.message || "Failed to create activity.");
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
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Create Activity</h1>

    <div class="bg-white shadow-md rounded-2xl overflow-hidden">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 text-lg font-semibold"
      >
        Activity Information
      </div>

      <ActivityForm mode="create" @submit="handleSubmit" />
    </div>
  </main>
</template>
