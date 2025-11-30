<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useRouter } from "vue-router";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.min.css";

import { useActivityStore } from "@/stores/activity.store";
import type { ActivityFilterRequest } from "@/interface/activity.interface";
import {
  isSuperAdmin,
  isTourPackageVendor,
  isAccommodationOwner,
  isFlightAirline,
  isRentalVendor,
  isCustomer,
} from "@/lib/rbac";

const router = useRouter();
const activityStore = useActivityStore();

let dataTable: any = null;

const filterForm = ref<ActivityFilterRequest>({
  name: "",
  activityType: "",
  startLocation: "",
  endLocation: "",
  startDateFrom: "",
  startDateTo: "",
  endDateFrom: "",
  endDateTo: "",
  includeDeleted: false,
});

const canToggleDeleted = computed(
  () => true
);

const canCreateActivity = computed(
  () =>
    isSuperAdmin() ||
    isTourPackageVendor() ||
    isFlightAirline() ||
    isAccommodationOwner() ||
    isRentalVendor()
);

const canEditOrDelete = computed(
  () =>
    isSuperAdmin() ||
    isTourPackageVendor() ||
    isFlightAirline() ||
    isAccommodationOwner() ||
    isRentalVendor()
);

const canUseFilter = computed(() =>
  isSuperAdmin() || isTourPackageVendor() || isCustomer()
);

const canViewDetail = computed(
  () =>
    true
);

const initDataTable = () => {
  if (dataTable) {
    dataTable.destroy();
    $("#activityTable").empty();
  }

  const rows = activityStore.activities.map((act) => ({
    id: act.id,
    activityName: act.activityName,
    activityType: act.activityType,
    activityItem: act.activityItem,
    startDate: new Date(act.startDate).toLocaleString("id-ID"),
    endDate: new Date(act.endDate).toLocaleString("id-ID"),
    startLocation: act.startLocation,
    endLocation: act.endLocation,
    capacity: act.capacity,
    price: `Rp ${new Intl.NumberFormat("id-ID").format(act.price)}`,
    deletedAt: act.deletedAt,
    status:
      act.deletedAt == null
        ? `<span class="px-2 py-1 rounded-xl text-xs font-bold bg-green-100 text-green-800">Active</span>`
        : `<span class="px-2 py-1 rounded-xl text-xs font-bold bg-red-100 text-red-800">Deleted</span>`,
  }));

  const canEditDeleteVal = canEditOrDelete.value;
  const canViewDetailVal = canViewDetail.value;

  dataTable = ($("#activityTable") as any).DataTable({
    serverSide: false,
    searching: true,
    ordering: true,
    paging: true,
    lengthChange: true,
    pageLength: 10,
    data: rows,
    columns: [
      {
        title: "No",
        orderable: false,
        render: (data: any, type: any, row: any, meta: any) =>
          meta.row + meta.settings._iDisplayStart + 1,
      },
      { title: "Name", data: "activityName" },
      { title: "Type", data: "activityType" },
      { title: "Item", data: "activityItem" },
      { title: "Start Date", data: "startDate" },
      { title: "End Date", data: "endDate" },
      { title: "Start Location", data: "startLocation" },
      { title: "End Location", data: "endLocation" },
      { title: "Capacity", data: "capacity" },
      { title: "Price", data: "price" },
      { title: "Status", data: "status" },
      {
        title: "Actions",
        data: null,
        orderable: false,
        searchable: false,
        render: (data: any, type: any, row: any) => {
          let html = "";

          if (canViewDetailVal && row.deletedAt == null) {
            html += `<button data-id="${row.id}" class="detail-btn px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white border-2 border-indigo-600 hover:bg-white hover:text-indigo-600 mr-2">View</button>`;
          }

          if (canEditDeleteVal) {
            html += `<button data-id="${row.id}" class="edit-btn px-3 py-1 rounded-xl text-xs font-bold bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-white hover:text-yellow-600 mr-2">Edit</button>`;
            html += `<button data-id="${row.id}" class="delete-btn px-3 py-1 rounded-xl text-xs font-bold bg-red-500 text-white border-2 border-red-500 hover:bg-white hover:text-red-600">Delete</button>`;
          }

          return html || "-";
        },
      },
    ],
    order: [[4, "asc"]], // startDate ascending
    language: {
      emptyTable: "No activities found.",
    },
  });

  $("#activityTable").off("click", ".detail-btn");
  $("#activityTable").off("click", ".edit-btn");
  $("#activityTable").off("click", ".delete-btn");

  $("#activityTable").on("click", ".detail-btn", function () {
    const id = $(this).data("id");
    if (id) router.push(`/activities/${id}`);
  });

  $("#activityTable").on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    if (id) router.push(`/activities/${id}/edit`);
  });

  $("#activityTable").on("click", ".delete-btn", async function () {
    const id = $(this).data("id") as string | undefined;
    if (!id) return;

    if (
      !confirm(
        "Are you sure you want to delete this activity? This action cannot be undone."
      )
    ) {
      return;
    }

    await activityStore.deleteActivity(id);
    await reloadActivities(); // destroy + fetch + rebuild
  });
};

const reloadActivities = async () => {
  const includeDeleted =
    canToggleDeleted.value && !!filterForm.value.includeDeleted;

  await activityStore.fetchActivities(includeDeleted);
  initDataTable();
};

const handleApplyFilter = async () => {
  await activityStore.filterActivities(filterForm.value);
  initDataTable();
};

const handleResetFilter = async () => {
  filterForm.value = {
    name: "",
    activityType: "",
    startLocation: "",
    endLocation: "",
    startDateFrom: "",
    startDateTo: "",
    endDateFrom: "",
    endDateTo: "",
    includeDeleted: false,
  };
  await reloadActivities();
};

onMounted(async () => {
  await reloadActivities();
});

onBeforeUnmount(() => {
  if (dataTable) {
    dataTable.destroy();
    dataTable = null;
  }
});
</script>

<style scoped>
table.dataTable thead {
  background-color: #ede9fe;
}
table.dataTable thead th {
  color: #4c1d95;
  font-weight: 600;
}
table.dataTable {
  border-radius: 0.75rem;
  overflow: hidden;
}
</style>

<template>
  <main class="flex flex-col px-20 pt-10">
    <h1 class="text-3xl font-semibold text-gray-800 mb-4">Activities</h1>

    <!-- Filter Bar -->
    <div
      class="bg-white shadow-md rounded-2xl mb-6 border border-indigo-100 overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 flex justify-between items-center"
      >
        <h2 class="text-lg font-semibold">Filter Activities</h2>
        <div class="flex gap-2">
          <button
            @click="handleApplyFilter"
            class="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-50 transition-all text-sm"
          >
            Apply Filter
          </button>
          <button
            @click="handleResetFilter"
            class="bg-transparent border border-white/70 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition-all text-sm"
          >
            Clear Filter
          </button>
        </div>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div v-if="canUseFilter">
          <label class="block text-gray-700 mb-1">Search Name / Item</label>
          <input
            v-model="filterForm.name"
            type="text"
            placeholder="Activity name or item..."
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="canUseFilter">
          <label class="block text-gray-700 mb-1">Activity Type</label>
          <select
            v-model="filterForm.activityType"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Types</option>
            <option value="Flight">Flight</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Vehicle Rental">Vehicle Rental</option>
          </select>
        </div>

        <div class="flex items-center mt-6 md:mt-7">
          <input
            id="toggle-deleted"
            v-model="filterForm.includeDeleted"
            type="checkbox"
            class="mr-2"
          />
          <label for="toggle-deleted" class="text-gray-700 text-sm">
            Show deleted activities
            <span class="text-xs text-gray-500">(Superadmin & Vendor only)</span>
          </label>
        </div>

        <div v-if="canUseFilter">
          <label class="block text-gray-700 mb-1">Start Location</label>
          <input
            v-model="filterForm.startLocation"
            type="text"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="canUseFilter">
          <label class="block text-gray-700 mb-1">End Location</label>
          <input
            v-model="filterForm.endLocation"
            type="text"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="canUseFilter">
          <label class="block text-gray-700 mb-1">Start Date From</label>
          <input
            v-model="filterForm.startDateFrom"
            type="datetime-local"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="canUseFilter">
          <label class="block text-gray-700 mb-1">Start Date To</label>
          <input
            v-model="filterForm.startDateTo"
            type="datetime-local"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="canUseFilter">
          <label class="block text-gray-700 mb-1">End Date From</label>
          <input
            v-model="filterForm.endDateFrom"
            type="datetime-local"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="canUseFilter">
          <label class="block text-gray-700 mb-1">End Date To</label>
          <input
            v-model="filterForm.endDateTo"
            type="datetime-local"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    <!-- Header + Create button -->
    <div
      class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-2xl px-6 py-3 flex justify-between items-center"
    >
      <h2 class="text-lg font-semibold">All Activities</h2>
      <button
        v-if="canCreateActivity"
        @click="router.push('/activities/create')"
        class="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-50 transition-all"
      >
        Create New Activity
      </button>
    </div>

    <div class="bg-white shadow-md rounded-b-2xl px-6 pb-6">
      <table id="activityTable" class="display w-full"></table>
    </div>
  </main>
</template>
