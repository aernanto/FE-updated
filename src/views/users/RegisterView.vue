<!-- src/views/RegisterView.vue -->
<template>
  <main class="flex flex-col px-20 pt-10">
    <button
      @click="router.back()"
      class="text-gray-600 hover:text-purple-700 font-semibold mb-4 flex items-center gap-1"
    >
      ← Back
    </button>

    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      Register Account
    </h1>

    <div class="rounded-2xl overflow-hidden shadow max-w-3xl">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Registration Form
      </div>

      <form class="bg-white px-6 py-6 grid grid-cols-2 gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">Username</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">Gender</label>
          <select
            v-model="form.gender"
            required
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option :value="true">Male</option>
            <option :value="false">Female</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="font-semibold text-sm mb-1">Role</label>
          <select
            v-model="form.roleName"
            required
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option disabled value="">Select role</option>
            <option v-for="r in roleOptions" :key="r.value" :value="r.value">
              {{ r.label }}
            </option>
          </select>
        </div>

        <!-- Phone & Provinces untuk RentalVendor -->
        <div v-if="form.roleName === 'RentalVendor'" class="flex flex-col">
          <label class="font-semibold text-sm mb-1">Phone</label>
          <input
            v-model="form.phone"
            type="text"
            required
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div
          v-if="form.roleName === 'RentalVendor'"
          class="flex flex-col col-span-2"
        >
          <label class="font-semibold text-sm mb-1">Service Provinces</label>
          <select
            v-model="form.listOfLocations"
            multiple
            required
            class="border rounded-lg px-3 py-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option
              v-for="prov in provinceOptions"
              :key="prov"
              :value="prov"
            >
              {{ prov }}
            </option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            Pilih satu atau lebih provinsi. Tidak perlu kabupaten/kota.
          </p>
        </div>

        <div class="col-span-2 flex gap-3 mt-4">
          <button
            type="submit"
            class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Register
          </button>

          <button
            type="button"
            @click="router.push('/login')"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useUserStore } from "@/stores/user.store";
import { useLocationStore } from "@/stores/location.store";
import type { AddUserProfileRequest } from "@/interface/user.interface";

const router = useRouter();
const userStore = useUserStore();
const locationStore = useLocationStore();

const form = reactive<AddUserProfileRequest>({
  username: "",
  password: "",
  roleName: "",
  name: "",
  gender: true,
  email: "",
  phone: "",
  listOfLocations: [],
});

const roleOptions = [
  { value: "Customer", label: "Customer" },
  { value: "AccommodationOwner", label: "Accommodation Owner" },
  { value: "FlightAirline", label: "Flight Airline" },
  { value: "InsuranceProvider", label: "Insurance Provider" },
  { value: "TourPackageVendor", label: "Tour Package Vendor" },
  { value: "RentalVendor", label: "Rental Vendor" },
  // SuperAdmin TIDAK boleh dipilih dari FE
];

const provinceOptions = computed(() => {
  const set = new Set<string>();
  locationStore.listOfLocations.forEach((loc) => {
    const [prov] = loc.split(" - ");
    if (prov) set.add(prov.trim());
  });
  return Array.from(set);
});

const handleSubmit = async () => {
  if (form.roleName === "SuperAdmin") {
    toast.error("You are not authorized to register this role.");
    return;
  }

  const payload: AddUserProfileRequest = {
    username: form.username,
    password: form.password,
    roleName: form.roleName,
    name: form.name,
    gender: form.gender,
    email: form.email,
  };

  if (form.roleName === "RentalVendor") {
    payload.phone = form.phone;
    payload.listOfLocations = form.listOfLocations;
  }

  await userStore.createUser(payload);
  // kalau berhasil, store sudah nge-toast; FE redirect ke login
  router.push("/login");
};

onMounted(async () => {
  if (!locationStore.listOfLocations.length) {
    try {
      await locationStore.fetchLocations();
    } catch {
      // error sudah di-toast di store
    }
  }
});
</script>

<style scoped>
table th,
table td {
  border-color: #e5e7eb;
}
</style>
