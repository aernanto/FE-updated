<!-- src/views/users/UserEditView.vue -->
<template>
  <main class="flex flex-col px-20 pt-10">
    <button
      @click="router.back()"
      class="text-gray-600 hover:text-purple-700 font-semibold mb-4 flex items-center gap-1"
    >
      ← Back
    </button>

    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      Edit User Profile
    </h1>

    <div class="rounded-2xl overflow-hidden shadow">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Update Information
      </div>

      <form class="bg-white px-6 py-6 grid grid-cols-2 gap-4" @submit.prevent="handleSubmit">
        <div class="col-span-2 text-sm text-gray-500 mb-2">
          <p>
            Semua field wajib diisi. Untuk SuperAdmin, perubahan password tidak akan diterapkan oleh sistem.
          </p>
        </div>

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

        <div v-if="!isSuperAdminUser" class="flex flex-col col-span-2">
          <label class="font-semibold text-sm mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter new password"
          />
          <p class="text-xs text-gray-500 mt-1">
            SuperAdmin tidak dapat mengubah password di server, walaupun field ini diisi.
          </p>
        </div>

        <!-- Saldo - hanya Customer, hanya SuperAdmin yang boleh mengubah -->
        <div
          v-if="isCustomerUser"
          class="flex flex-col"
        >
          <label class="font-semibold text-sm mb-1">Saldo</label>
          <input
            v-model.number="form.saldo"
            type="number"
            min="0"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            :disabled="!isSuperAdminUser"
          />
          <p class="text-xs text-gray-500 mt-1" v-if="!isSuperAdminUser">
            Saldo hanya dapat diubah oleh SuperAdmin.
          </p>
        </div>

        <!-- Phone & Provinces - hanya RentalVendor -->
        <div v-if="isRentalVendorUser" class="flex flex-col">
          <label class="font-semibold text-sm mb-1">Phone</label>
          <input
            v-model="form.phone"
            type="text"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div
          v-if="isRentalVendorUser"
          class="flex flex-col col-span-2"
        >
          <label class="font-semibold text-sm mb-1">Service Provinces</label>
          <select
            v-model="form.listOfLocations"
            multiple
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
            Pilih satu atau lebih provinsi. Data harus valid sesuai daftar provinsi.
          </p>
        </div>

        <div class="col-span-2 flex gap-3 mt-4">
          <button
            type="submit"
            class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Save Changes
          </button>

          <button
            type="button"
            @click="router.back()"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { useLocationStore } from "@/stores/location.store";
import { getCurrentUser, isSuperAdmin } from "@/lib/rbac";
import type { UpdateUserProfileRequest } from "@/interface/user.interface";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const locationStore = useLocationStore();
const currentUser = getCurrentUser();

const form = reactive<UpdateUserProfileRequest>({
  id: "",
  username: "",
  name: "",
  password: "",
  gender: true,
  email: "",
  saldo: undefined,
  phone: undefined,
  listOfLocations: [],
});

const isSuperAdminUser = computed(() => isSuperAdmin());

const isCustomerUser = computed(
  () => userStore.selectedUser?.roleName === "Customer"
);
const isRentalVendorUser = computed(
  () => userStore.selectedUser?.roleName === "RentalVendor"
);

const provinceOptions = computed(() => {
  // ambil dari locationStore.listOfLocations -> "Provinsi - Kabupaten"
  const set = new Set<string>();
  locationStore.listOfLocations.forEach((loc) => {
    const [prov] = loc.split(" - ");
    if (prov) set.add(prov.trim());
  });
  return Array.from(set);
});

const loadUser = async () => {
  const paramId = route.params.id as string | undefined;
  const targetId = paramId || currentUser?.id;
  if (!targetId) return;

  await userStore.fetchUserById(targetId);
  const u = userStore.selectedUser;
  if (!u) return;

  form.id = u.id;
  form.username = u.username;
  form.name = u.name;
  form.email = u.email;
  form.gender = u.gender ?? true;
  form.saldo = u.saldo ?? undefined;
  form.phone = u.phone ?? undefined;
  form.listOfLocations = u.listOfLocations ? [...u.listOfLocations] : [];
};

const handleSubmit = async () => {
  // build payload yang akan dikirim
  const payload: any = {
    id: form.id,
    username: form.username,
    name: form.name,
    email: form.email,
    gender: form.gender,
    password: form.password, // default
  };

  // SUPERADMIN tidak boleh update password
  if (isSuperAdminUser.value) {
    payload.password = undefined;
  }

  // Jika target Customer
  if (isCustomerUser.value) {
    // saldo hanya dikirim jika SuperAdmin
    if (isSuperAdminUser.value) {
      payload.saldo = form.saldo ?? 0;
    }

    // remove phone & locations
    payload.phone = undefined;
    payload.listOfLocations = undefined;
  }

  // Jika target RentalVendor
  else if (isRentalVendorUser.value) {
    payload.phone = form.phone;
    payload.listOfLocations = form.listOfLocations;
    payload.saldo = undefined; // tidak boleh punya saldo
  }

  // Role lain
  else {
    payload.saldo = undefined;
    payload.phone = undefined;
    payload.listOfLocations = undefined;
  }

  // Kirim ke store
  await userStore.updateUser(payload);

  router.push(`/users/${form.id}`);
};


onMounted(async () => {
  if (!locationStore.listOfLocations.length) {
    try {
      await locationStore.fetchLocations();
    } catch {
      // error sudah di-toast di store
    }
  }
  await loadUser();
});
</script>

<style scoped>
table th,
table td {
  border-color: #e5e7eb;
}
</style>
