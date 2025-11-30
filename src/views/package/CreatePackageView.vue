<template>
  <main class="flex flex-col px-20 pt-10">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">Create New Package</h1>

    <div class="rounded-2xl overflow-hidden shadow-lg">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Package Information
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white px-8 py-6 space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Package Name *</label>
          <input
            v-model="form.packageName"
            type="text"
            required
            class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div v-if="isSuperAdmin() || isTourPackageVendor()">
          <label class="block text-gray-700 font-medium mb-1">Select User *</label>

          <select
            v-model="form.userId"
            required
            class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="" disabled selected>Select a user</option>

            <option
              v-for="user in userStore.customers"
              :key="user.id"
              :value="user.id"
            >
              {{ user.name }} - {{ user.id }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-700 font-medium mb-1">Start Date *</label>
            <input
              v-model="form.startDate"
              type="datetime-local"
              required
              class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-1">End Date *</label>
            <input
              v-model="form.endDate"
              type="datetime-local"
              required
              class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Quota *</label>
          <input
            v-model.number="form.quota"
            type="number"
            required
            min="1"
            class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="router.push('/packages')"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-xl font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-xl font-semibold hover:opacity-90"
          >
            Create Package
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { usePackageStore } from "@/stores/package.store";
import { useUserStore } from "@/stores/user.store";
import { isSuperAdmin, isTourPackageVendor } from "@/lib/rbac";
import { onMounted } from "vue";

const router = useRouter();
const packageStore = usePackageStore();
const userStore = useUserStore();

const form = reactive({
  packageName: "",
  userId: "",
  startDate: "",
  endDate: "",
  quota: null,
});

const handleSubmit = async () => {
  try {
    // Validasi tanggal
    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date tidak boleh lebih awal dari start date!");
      return;
    }

    // Format hanya sampai menit (yyyy-MM-dd'T'HH:mm)
    const toIsoMinute = (dateStr: string | number | Date) => {
      const d = new Date(dateStr);
      return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0") +
        "T" +
        String(d.getHours()).padStart(2, "0") +
        ":" +
        String(d.getMinutes()).padStart(2, "0")
      );
    };

    const payload = {
      ...form,
      startDate: toIsoMinute(form.startDate),
      endDate: toIsoMinute(form.endDate),
    };

    await packageStore.createPackage(payload);
    alert("✅ Package berhasil dibuat!");
    router.push("/packages");
  } catch (error) {
    alert("❌ Gagal membuat package: " + (error.message || error));
  }
};

onMounted(async () => {
  if (isSuperAdmin() || isTourPackageVendor()) {
    await userStore.fetchCustomers()
  }
});

</script>
