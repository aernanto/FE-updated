<template>
  <main class="flex flex-col px-20 pt-10">
    <button
      @click="router.back()"
      class="text-gray-600 hover:text-purple-700 font-semibold mb-4 flex items-center gap-1"
    >
      ← Back
    </button>

    <h1 class="text-3xl font-semibold text-gray-800 mb-6">User Management</h1>

    <div class="rounded-2xl overflow-hidden shadow">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold flex items-center justify-between gap-4"
      >
        <span>All End Users</span>

        <div class="flex items-center gap-3">
          <span class="text-sm text-white/80">Filter by Role:</span>
          <select
            v-model="selectedRole"
            class="text-gray-800 rounded-lg px-3 py-1 text-sm focus:outline-none"
            @change="handleFilter"
          >
            <option value="">All Roles</option>
            <option
              v-for="r in roleOptions"
              :key="r.value"
              :value="r.value"
            >
              {{ r.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="bg-white p-6">
        <table class="min-w-full text-sm text-left border-collapse">
          <thead class="bg-purple-50 text-purple-800 font-semibold text-sm">
            <tr>
              <th class="px-4 py-2 border-b">ID</th>
              <th class="px-4 py-2 border-b">Full Name</th>
              <th class="px-4 py-2 border-b">Username</th>
              <th class="px-4 py-2 border-b">Email</th>
              <th class="px-4 py-2 border-b">Role</th>
              <th class="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="u in filteredUsers"
              :key="u.id"
              class="hover:bg-gray-50 transition-all"
            >
              <td class="px-4 py-2 border-b">{{ u.id }}</td>
              <td class="px-4 py-2 border-b">{{ u.name }}</td>
              <td class="px-4 py-2 border-b">{{ u.username }}</td>
              <td class="px-4 py-2 border-b">{{ u.email }}</td>
              <td class="px-4 py-2 border-b">{{ u.roleName }}</td>
              <td class="px-4 py-2 border-b">
                <RouterLink
                  :to="`/users/${u.id}`"
                  class="text-indigo-600 hover:underline font-semibold text-sm"
                >
                  Detail
                </RouterLink>
              </td>
            </tr>

            <tr v-if="!userStore.loading && filteredUsers.length === 0">
              <td colspan="6" class="text-center py-4 text-gray-500">
                No users found.
              </td>
            </tr>

            <tr v-if="userStore.loading">
              <td colspan="6" class="text-center py-4 text-gray-500">
                Loading...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";

const router = useRouter();
const userStore = useUserStore();

const selectedRole = ref<string>("");

const roleOptions = [
  { value: "SuperAdmin", label: "SuperAdmin" },
  { value: "AccommodationOwner", label: "Accommodation Owner" },
  { value: "FlightAirline", label: "Flight Airline" },
  { value: "Customer", label: "Customer" },
  { value: "InsuranceProvider", label: "Insurance Provider" },
  { value: "TourPackageVendor", label: "Tour Package Vendor" },
  { value: "RentalVendor", label: "Rental Vendor" },
];

const users = computed(() => userStore.users);

const filteredUsers = computed(() => {
  if (!selectedRole.value) return users.value;
  return users.value.filter((u) => u.roleName === selectedRole.value);
});

const handleFilter = async () => {
  // bisa pakai filter di FE saja; kalau mau trigger BE:
  await userStore.fetchUsers(selectedRole.value || undefined);
};

onMounted(async () => {
  await userStore.fetchUsers();
});
</script>

<style scoped>
table th,
table td {
  border-color: #e5e7eb;
}
</style>
