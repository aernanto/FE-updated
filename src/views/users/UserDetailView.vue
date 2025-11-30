<!-- src/views/users/UserDetailView.vue -->
<template>
  <main class="flex flex-col px-20 pt-10">
    <button
      @click="router.back()"
      class="text-gray-600 hover:text-purple-700 font-semibold mb-4 flex items-center gap-1"
    >
      ← Back
    </button>

    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      User Profile
    </h1>

    <div class="rounded-2xl overflow-hidden shadow mb-8">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold flex justify-between items-center"
      >
        <span>Profile Information</span>

        <button
          v-if="canEdit"
          @click="goToEdit"
          class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Edit Profile
        </button>
      </div>

      <div class="bg-white px-6 py-6 grid grid-cols-2 gap-4 text-gray-800">
        <div><b>Full Name:</b> {{ user?.name }}</div>
        <div><b>Username:</b> {{ user?.username }}</div>
        <div><b>Email:</b> {{ user?.email }}</div>
        <div><b>Role:</b> {{ user?.roleName }}</div>
        <div><b>Gender:</b> {{ genderLabel }}</div>
        <div><b>Created At:</b> {{ formatDate(user?.createdAt) }}</div>
        <div><b>Updated At:</b> {{ user?.updatedAt != null ? formatDate(user?.updatedAt) : "- / null" }}</div>

        <div v-if="user?.saldo !== null">
          <b>Saldo:</b> Rp {{ formatPrice(user?.saldo || 0) }}
        </div>

        <div v-if="user?.phone">
          <b>Phone:</b> {{ user.phone }}
        </div>

        <div v-if="user?.listOfLocations?.length" class="col-span-2">
          <b>Service Provinces:</b>
          <ul class="list-disc ml-5 mt-1">
            <li v-for="loc in user.listOfLocations" :key="loc">{{ loc }}</li>
          </ul>
        </div>
      </div>

      <!-- Optional Top-Up section (stub, bisa dihubungkan ke service lain) -->
      <div class="bg-white border-t px-6 py-4 flex gap-3">
        <button
          class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          @click="goToTopUp"
        >
          Top-Up
        </button>
        <button
          class="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          @click="showTopUpHistory = true"
        >
          Past Top-Up Transactions
        </button>
      </div>
    </div>
  </main>

  <!-- 🌟 Modal Top-Up History -->
  <div
    v-if="showTopUpHistory"
    class="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-xl w-[700px] max-h-[80vh] overflow-auto">

      <!-- Header -->
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold">Past Top-Up Transactions</h2>
        <button
          @click="showTopUpHistory = false"
          class="text-gray-600 hover:text-red-500 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        <table class="w-full border-collapse text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-3 py-2 border">Date</th>
              <th class="px-3 py-2 border">Amount</th>
              <th class="px-3 py-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="t in userStore.customerTopUps" :key="t.id" class="border">
              <td class="px-3 py-2 border">
                {{ formatDate(t.createdAt) }}
              </td>
              <td class="px-3 py-2 border">
                Rp {{ formatPrice(t.amount) }}
              </td>
              <td class="px-3 py-2 border">
                <span
                  :class="[
                    'px-2 py-1 rounded text-white text-sm',
                    t.status === 'Success' ? 'bg-green-600' : 'bg-red-600'
                  ]"
                >
                  {{ t.status }}
                </span>
              </td>
            </tr>

            <tr v-if="userStore.customerTopUps.length === 0">
              <td colspan="3" class="text-center text-gray-500 py-4">
                No top-up history found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { getCurrentUser, isCustomer, isSuperAdmin } from "@/lib/rbac";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const currentUser = getCurrentUser();

const user = computed(() => userStore.selectedUser);

const genderLabel = computed(() => {
  if (user.value?.gender === null || user.value?.gender === undefined) return "-";
  return user.value.gender ? "Male" : "Female";
});

const formatDate = (d?: string | null) => {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (num: number) =>
  new Intl.NumberFormat("id-ID").format(num || 0);

const canEdit = computed(() => {
  const paramId = route.params.id as string | undefined;
  if (isSuperAdmin()) return true;
  if (!currentUser) return false;
  if (!paramId) return true; // /profile → always self
  return paramId === currentUser.id;
});

const goToEdit = () => {
  const paramId = route.params.id as string | undefined;
  const targetId = paramId || currentUser?.id;
  if (targetId) {
    router.push(`/users/${targetId}/edit`);
  }
};

const goToTopUp = () => {
  window.location.href = import.meta.env.VITE_TOPUP_FE_URL + "/topup"
};

const showTopUpHistory = ref(false);

onMounted(async () => {
  const paramId = route.params.id as string | undefined;
  const targetId = paramId || currentUser?.id;

  if (!targetId) return;

  await userStore.fetchUserById(targetId);

  if (
    userStore.selectedUser?.id === getCurrentUser()?.id ||
    (isSuperAdmin() && userStore.selectedUser?.roleName?.toUpperCase() === "CUSTOMER")
  ) {
      await userStore.fetchTopUpsByCustomerId(targetId)
  }

});
</script>

<style scoped>
table th,
table td {
  border-color: #e5e7eb;
}
</style>
