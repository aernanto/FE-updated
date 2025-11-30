<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { usePackageStore } from "@/stores/package.store";
import { useRouter, useRoute } from "vue-router";
import { RouterLink } from "vue-router";

const router = useRouter();
const route = useRoute();
const packageStore = usePackageStore();

let dataTable = null;

// Function to (re)initialize DataTable
const initDataTable = () => {
  if (dataTable) {
    dataTable.destroy(); // prevent duplicate instances
    $("#packageTable").empty(); // clean table DOM
  }

  dataTable = $("#packageTable").DataTable({
    serverSide: false,
    searching: true,
    ordering: true,
    paging: true,
    lengthChange: true,
    pageLength: 10,
    data: packageStore.packages.map((pkg) => ({
      packageName: pkg.packageName,
      period: `${new Date(pkg.startDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })} - ${new Date(pkg.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      quota: pkg.quota,
      price: `Rp ${new Intl.NumberFormat("id-ID").format(pkg.price)}`,
      status: `<span class="px-2 py-1 rounded-xl text-sm font-bold ${
        pkg.status === "Processed"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }">${pkg.status}</span>`,
      userId: pkg.userId,
      action: `<button class="detail-btn px-5 py-2 rounded-xl text-white font-bold border-2
                bg-indigo-600 hover:bg-white border-indigo-600 hover:text-indigo-600">
                View
              </button>`,
    })),
    columns: [
      {
        title: "No",
        orderable: false,
        render: (data, type, row, meta) => meta.row + meta.settings._iDisplayStart + 1,
      },
      { title: "Name", data: "packageName" },
      { title: "Period", data: "period" },
      { title: "Quota", data: "quota" },
      { title: "Price", data: "price" },
      { title: "Status", data: "status" },
      { title: "User ID", data: "userId" },
      { title: "Actions", data: "action", orderable: false, searchable: false },
    ],
  });

  // Attach click handler after DataTable is initialized
  $("#packageTable").on("click", ".detail-btn", function () {
    const row = $(this).closest("tr");
    const rowIndex = dataTable.row(row).index();
    const selectedPkg = packageStore.packages[rowIndex];
    if (selectedPkg?.id) router.push(`/packages/${selectedPkg.id}`);
  });
};

// Fetch and rebuild table
const reloadPackages = async () => {
  await packageStore.getAllPackages();
  initDataTable();
};

// Lifecycle
onMounted(async () => {
  await reloadPackages();
});

// Rebuild table when query param “reload” changes
watch(
  () => route.query.reload,
  async () => {
    await reloadPackages();
  }
);

// Cleanup on unmount
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
    <h1 class="text-3xl font-semibold text-gray-800 mb-4">Packages</h1>

    <div
      class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-2xl px-6 py-3 flex justify-between items-center"
    >
      <h2 class="text-lg font-semibold">All Packages</h2>
      <RouterLink to="/packages/create">
        <button
          class="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-50 transition-all"
        >
          Create New Package
        </button>
      </RouterLink>
    </div>

    <div class="bg-white shadow-md rounded-b-2xl px-6 pb-6">
      <table id="packageTable" class="display w-full"></table>
    </div>
  </main>
</template>
