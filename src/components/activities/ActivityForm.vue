<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { CreateActivityRequest, UpdateActivityRequest } from "@/interface/activity.interface";
import { isSuperAdmin, isAccommodationOwner, isFlightAirline, isRentalVendor, isTourPackageVendor } from "@/lib/rbac";

type Mode = "create" | "edit";

interface ActivityFormModel {
  activityName: string;
  activityType: string;
  activityItem: string;
  capacity: number | null;
  price: number | null;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
}

const props = defineProps<{
  mode: Mode;
  initialValue?: Partial<ActivityFormModel>;
}>();

const emit = defineEmits<{
  (e: "submit", payload: CreateActivityRequest | UpdateActivityRequest): void;
}>();

const form = ref<ActivityFormModel>({
  activityName: "",
  activityType: "",
  activityItem: "",
  capacity: null,
  price: null,
  startDate: "",
  endDate: "",
  startLocation: "",
  endLocation: "",
});

watch(
  () => props.initialValue,
  (val) => {
    form.value = {
      ...form.value,
      ...val,
    };
  },
  { immediate: true }
);

const isEdit = computed(() => props.mode === "edit");

// RBAC: who can choose which type (selectnya tetap client-side, backend juga validasi)
const activityTypeOptions = [
  { label: "Flight", value: "Flight" },
  { label: "Accommodation", value: "Accommodation" },
  { label: "Vehicle Rental", value: "Vehicle Rental" },
];

const canCreateFlight = computed(
  () => isSuperAdmin() || isTourPackageVendor() || isFlightAirline()
);
const canCreateAccommodation = computed(
  () => isSuperAdmin() || isTourPackageVendor() || isAccommodationOwner()
);
const canCreateVehicleRental = computed(
  () => isSuperAdmin() || isTourPackageVendor() || isRentalVendor()
);

const filteredActivityTypes = computed(() =>
  activityTypeOptions.filter((opt) => {
    if (opt.value === "Flight") return canCreateFlight.value;
    if (opt.value === "Accommodation") return canCreateAccommodation.value;
    if (opt.value === "Vehicle Rental") return canCreateVehicleRental.value;
    return false;
  })
);

const handleSubmit = () => {
  if (!form.value.activityName || !form.value.activityItem) {
    alert("Activity Name and Activity Item are required.");
    return;
  }
  if (!isEdit.value && !form.value.activityType) {
    alert("Activity Type is required.");
    return;
  }
  if (
    form.value.price == null ||
    form.value.capacity == null ||
    form.value.price <= 0 ||
    form.value.capacity <= 0
  ) {
    alert("Price and Capacity must be greater than 0.");
    return;
  }
  if (!form.value.startDate || !form.value.endDate) {
    alert("Start Date and End Date are required.");
    return;
  }
  if (new Date(form.value.endDate) <= new Date(form.value.startDate)) {
    alert("End Date must be after Start Date.");
    return;
  }
  if (new Date(form.value.startDate) < new Date()) {
    alert("Start Date must be in the future.");
    return;
  }
  if (!form.value.startLocation || !form.value.endLocation) {
    alert("Start Location and End Location are required.");
    return;
  }

  if (isEdit.value) {
    const payload: UpdateActivityRequest = {
      activityName: form.value.activityName,
      activityItem: form.value.activityItem,
      capacity: form.value.capacity!,
      price: form.value.price!,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      startLocation: form.value.startLocation,
      endLocation: form.value.endLocation,
    };
    emit("submit", payload);
  } else {
    const payload: CreateActivityRequest = {
      activityName: form.value.activityName,
      activityType: form.value.activityType,
      activityItem: form.value.activityItem,
      capacity: form.value.capacity!,
      price: form.value.price!,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      startLocation: form.value.startLocation,
      endLocation: form.value.endLocation,
    };
    emit("submit", payload);
  }
};
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="md:col-span-2">
        <label class="block text-gray-700 mb-1">Activity Name *</label>
        <input
          v-model="form.activityName"
          type="text"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Activity Type *</label>
        <select
          v-model="form.activityType"
          :disabled="isEdit"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-100"
        >
          <option value="" disabled>Select Type</option>
          <option
            v-for="opt in filteredActivityTypes"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Activity Item *</label>
        <input
          v-model="form.activityItem"
          type="text"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Price (IDR) *</label>
        <input
          v-model.number="form.price"
          type="number"
          min="1"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Capacity *</label>
        <input
          v-model.number="form.capacity"
          type="number"
          min="1"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Start Date *</label>
        <input
          v-model="form.startDate"
          type="datetime-local"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1">End Date *</label>
        <input
          v-model="form.endDate"
          type="datetime-local"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1">Start Location *</label>
        <input
          v-model="form.startLocation"
          type="text"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1">End Location *</label>
        <input
          v-model="form.endLocation"
          type="text"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>

    <div class="flex justify-end pt-4">
      <button
        type="button"
        @click="handleSubmit"
        class="px-5 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
      >
        {{ isEdit ? "Update Activity" : "Create Activity" }}
      </button>
    </div>
  </div>
</template>
