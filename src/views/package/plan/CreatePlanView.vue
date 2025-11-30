<template>
  <main class="flex flex-col px-20 pt-10">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Create New Plan</h1>

    <div class="rounded-2xl overflow-hidden shadow">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold">
        Plan Information
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white px-6 py-6 space-y-5">
        <!-- Plan Name -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Plan Name *</label>
          <input
            v-model="form.planName"
            type="text"
            class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
            placeholder="e.g. Jakarta-Bali Flight Plan"
            required
          />
        </div>

        <!-- Activity Type -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Activity Type *</label>
          <select
            v-model="form.activityType"
            class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
            required
          >
            <option value="" disabled>Select activity type</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Vehicle Rental">Vehicle Rental</option>
            <option value="Flight">Flight</option>
          </select>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 font-medium mb-1">Start Date *</label>
            <input
              v-model="form.startDate"
              type="datetime-local"
              class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-1">End Date *</label>
            <input
              v-model="form.endDate"
              type="datetime-local"
              class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
              required
            />
          </div>
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
        <div class="flex gap-4 justify-end pt-3">
          <button
            type="button"
            @click="router.back()"
            class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:opacity-90 font-semibold"
          >
            Create Plan
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePlanStore } from "@/stores/plan.store";
import type { CreatePlanRequest } from "@/interface/plan.interface";
import { useLocationStore } from "@/stores/location.store";

const router = useRouter();
const route = useRoute();
const planStore = usePlanStore();
const locationStore = useLocationStore();

onMounted(async () => {
  await locationStore.fetchLocations();
})


const form = ref<CreatePlanRequest>({
  planName: "",
  activityType: "",
  startDate: "",
  endDate: "",
  startLocation: "",
  endLocation: "",
});

// Dummy daftar lokasi (bisa diganti API lokasi)
const locations = [
  "DKI Jakarta (Provinsi)",
  "Bali (Provinsi)",
  "Jawa Barat (Provinsi)",
  "Jawa Timur (Provinsi)",
  "Sumatera Utara (Provinsi)",
];

const handleSubmit = async () => {
  try {
    const payload = {
      planName: form.value.planName,
      activityType: form.value.activityType,
      startDate: new Date(form.value.startDate).toISOString().slice(0, 19),
      endDate: new Date(form.value.endDate).toISOString().slice(0, 19),
      startLocation: form.value.startLocation,
      endLocation: form.value.endLocation
    };

    await planStore.createPlan(route.params.id as string, payload);
    alert("✅ Plan created successfully!");
    router.push(`/packages/${route.params.id}`);
  } catch (err: any) {
    alert("❌ " + err.message);
  }
};
</script>

<style scoped>
select,
input {
  transition: all 0.2s ease-in-out;
}
</style>
