<!-- src/views/users/CustomerListView.vue -->
<template>
  <main class="flex flex-col px-20 pt-10">
    <button
      @click="router.back()"
      class="text-gray-600 hover:text-purple-700 font-semibold mb-4 flex items-center gap-1"
    >
      ← Back
    </button>

    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Customer List</h1>

    <div class="rounded-2xl overflow-hidden shadow mb-6">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Filter Customer
      </div>
      <div class="bg-white px-6 py-4 flex flex-wrap gap-4 items-end">
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Name</label>
          <input
            v-model="nameQuery"
            type="text"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Search by name"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Email</label>
          <input
            v-model="emailQuery"
            type="text"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Search by email"
          />
        </div>

        <button
          @click="handleSearch"
          class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 text-sm"
        >
          Search
        </button>
      </div>
    </div>

    <div class="rounded-2xl overflow-hidden shadow">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Customer Table
      </div>

      <div class="bg-white p-6">
        <table class="min-w-full text-sm text-left border-collapse">
          <thead class="bg-purple-50 text-purple-800 font-semibold text-sm">
            <tr>
              <th class="px-4 py-2 border-b">Username</th>
              <th class="px-4 py-2 border-b">Name</th>
              <th class="px-4 py-2 border-b">Email</th>
              <th class="px-4 py-2 border-b">Registered At</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in customers"
              :key="c.id"
              class="hover:bg-gray-50 transition-all"
            >
              <td class="px-4 py-2 border-b">{{ c.username }}</td>
              <td class="px-4 py-2 border-b">{{ c.name }}</td>
              <td class="px-4 py-2 border-b">{{ c.email }}</td>
              <td class="px-4 py-2 border-b">
                {{ formatDateTime(c.createdAt) }}
              </td>
            </tr>

            <tr v-if="!userStore.loading && customers.length === 0">
              <td colspan="4" class="text-center py-4 text-gray-500">
                No customers found.
              </td>
            </tr>

            <tr v-if="userStore.loading">
              <td colspan="4" class="text-center py-4 text-gray-500">
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
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";

const router = useRouter();
const userStore = useUserStore();

const nameQuery = ref("");
const emailQuery = ref("");

const customers = computed(() => userStore.customers);

const formatDateTime = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleSearch = async () => {
  await userStore.fetchCustomers(nameQuery.value, emailQuery.value);
};

onMounted(async () => {
  await userStore.fetchCustomers();
});
</script>

<style scoped>
table th,
table td {
  border-color: #e5e7eb;
}
</style>
