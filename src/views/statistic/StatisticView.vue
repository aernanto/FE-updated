<!-- src/views/StatisticView.vue -->
<template>
  <main class="px-20 py-10">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      Revenue Statistics
    </h1>

    <!-- Filter Panel -->
    <div class="bg-white shadow rounded-2xl p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="font-semibold text-sm">Year *</label>
          <select
            v-model="selectedYear"
            class="border rounded-lg px-3 py-2 w-full"
          >
            <option disabled value="">Select year</option>
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div>
          <label class="font-semibold text-sm">Month (optional)</label>
          <select
            v-model="selectedMonth"
            class="border rounded-lg px-3 py-2 w-full"
          >
            <option value="All">All</option>
            <option v-for="m in months" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="handleFetch"
            class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 w-full md:w-auto"
          >
            Show Statistics
          </button>
        </div>
      </div>
    </div>

    <!-- 1. Revenue by Activity Type -->
    <section class="rounded-2xl overflow-hidden shadow bg-white mb-8">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Revenue by Activity Type
        <span v-if="selectedMonthLabel" class="text-xs text-purple-100 ml-2">
          ({{ selectedMonthLabel }} {{ selectedYear }})
        </span>
        <span v-else class="text-xs text-purple-100 ml-2">
          (Per-activity in {{ selectedYear }})
        </span>
      </div>

      <div class="p-6">
        <canvas
          id="activityRevenueChart"
          v-show="activityChartData.labels.length"
        ></canvas>

        <p
          v-if="!activityChartData.labels.length"
          class="text-gray-500 text-center mt-6"
        >
          No data available for selected filter.
        </p>

        <!-- Detail tabel -->
        <table
          v-if="activityChartData.labels.length"
          class="mt-6 w-full text-sm border rounded-xl overflow-hidden"
        >
          <thead class="bg-indigo-50 text-indigo-800">
            <tr>
              <th class="p-2 text-left">Activity Type</th>
              <th class="p-2 text-right">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in statisticsStore.revenueStats"
              :key="row.activityType"
              class="border-t"
            >
              <td class="p-2">{{ row.activityType }}</td>
              <td class="p-2 text-right">
                {{ formatCurrency(row.totalRevenue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 2. Yearly Revenue (Jan-Dec) -->
    <section class="rounded-2xl overflow-hidden shadow bg-white mb-8">
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Yearly Revenue ({{ selectedYear }})
      </div>

      <div class="p-6">
        <canvas id="yearlyRevenueChart" v-show="yearlyChartData.labels.length" />

        <p
          v-if="!yearlyChartData.labels.length"
          class="text-gray-500 text-center mt-6"
        >
          No yearly data available.
        </p>

        <table
          v-if="yearlyChartData.labels.length"
          class="mt-6 w-full text-sm border rounded-xl overflow-hidden"
        >
          <thead class="bg-indigo-50 text-indigo-800">
            <tr>
              <th class="p-2 text-left">Month</th>
              <th class="p-2 text-right">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in statisticsStore.yearlyRevenue"
              :key="row.month"
              class="border-t"
            >
              <td class="p-2">{{ monthLabel(row.month) }}</td>
              <td class="p-2 text-right">
                {{ formatCurrency(row.totalRevenue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 3. Monthly Breakdown (only when month selected) -->
    <section
      v-if="selectedMonth !== 'All'"
      class="rounded-2xl overflow-hidden shadow bg-white mb-8"
    >
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 font-semibold"
      >
        Monthly Revenue Breakdown –
        {{ selectedMonthLabel }} {{ selectedYear }}
      </div>

      <div class="p-6">
        <canvas
          id="monthlyBreakdownChart"
          v-show="monthlyChartData.labels.length"
        />

        <p
          v-if="!monthlyChartData.labels.length"
          class="text-gray-500 text-center mt-6"
        >
          No monthly breakdown data available.
        </p>

        <table
          v-if="monthlyChartData.labels.length"
          class="mt-6 w-full text-sm border rounded-xl overflow-hidden"
        >
          <thead class="bg-indigo-50 text-indigo-800">
            <tr>
              <th class="p-2 text-left">Activity Type</th>
              <th class="p-2 text-right">Revenue</th>
              <th class="p-2 text-right">% of Month Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in statisticsStore.monthlyBreakdown"
              :key="row.activityType"
              class="border-t"
            >
              <td class="p-2">{{ row.activityType }}</td>
              <td class="p-2 text-right">
                {{ formatCurrency(row.totalRevenue) }}
              </td>
              <td class="p-2 text-right">
                {{ percentageOfMonthly(row.totalRevenue).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue";
import Chart from "chart.js/auto";
import { useStatisticsStore } from "@/stores/statistics.store";

const statisticsStore = useStatisticsStore();

const years = [];
for(let i = 1995; i <= 2030; i++){
  years.push(i);
}
const selectedYear = ref<number | "">(2025);
const selectedMonth = ref<number | "All">("All");

const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const monthLabel = (m: number) => {
  const item = months.find((x) => x.value === m);
  return item?.label ?? `Month ${m}`;
};

const selectedMonthLabel = computed(() => {
  if (selectedMonth.value === "All") return "";
  return monthLabel(selectedMonth.value as number);
});

// chart data refs
const activityChartData = ref<{ labels: string[]; values: number[] }>({
  labels: [],
  values: [],
});
const yearlyChartData = ref<{ labels: string[]; values: number[] }>({
  labels: [],
  values: [],
});
const monthlyChartData = ref<{ labels: string[]; values: number[] }>({
  labels: [],
  values: [],
});

// chart instances
const activityChartInstance = ref<any>(null);
const yearlyChartInstance = ref<any>(null);
const monthlyChartInstance = ref<any>(null);

const formatCurrency = (val?: number) =>
  val != null
    ? `Rp ${Number(val).toLocaleString("id-ID")}`
    : "Rp 0";

const totalMonthlyRevenue = () =>
  statisticsStore.monthlyBreakdown.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );

const percentageOfMonthly = (value: number) => {
  const total = totalMonthlyRevenue();
  if (!total) return 0;
  return (value / total) * 100;
};

const handleFetch = async () => {
  if (!selectedYear.value) {
    alert("Year is required.");
    return;
  }

  const year = selectedYear.value as number;
  const month =
    selectedMonth.value === "All" ? undefined : (selectedMonth.value as number);

  // 1. activity revenue (year + optional month)
  await statisticsStore.fetchRevenueStatistics(year, month);
  activityChartData.value = {
    labels: statisticsStore.revenueStats.map((s) => s.activityType),
    values: statisticsStore.revenueStats.map((s) => s.totalRevenue),
  };

  // 2. yearly revenue
  await statisticsStore.fetchYearlyRevenue(year);
  yearlyChartData.value = {
    labels: statisticsStore.yearlyRevenue.map((m) => monthLabel(m.month)),
    values: statisticsStore.yearlyRevenue.map((m) => m.totalRevenue),
  };

  // 3. monthly breakdown (only if month chosen)
  if (month) {
    await statisticsStore.fetchMonthlyRevenue(year, month);
    monthlyChartData.value = {
      labels: statisticsStore.monthlyBreakdown.map((s) => s.activityType),
      values: statisticsStore.monthlyBreakdown.map((s) => s.totalRevenue),
    };
  } else {
    statisticsStore.monthlyBreakdown = [];
    monthlyChartData.value = { labels: [], values: [] };
  }

  await nextTick();
  renderCharts();
};

const renderCharts = () => {
  // 1. Activity by type
  const ctx1 = document.getElementById(
    "activityRevenueChart"
  ) as HTMLCanvasElement | null;
  if (activityChartInstance.value) activityChartInstance.value.destroy();
  if (ctx1 && activityChartData.value.labels.length) {
    activityChartInstance.value = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: activityChartData.value.labels,
        datasets: [
          {
            label: "Revenue",
            data: activityChartData.value.values,
            backgroundColor: ["#6366F1", "#8B5CF6", "#3B82F6", "#A855F7"],
            borderRadius: 12,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ticks: {
              callback: (val: any) =>
                `Rp ${Number(val).toLocaleString("id-ID")}`,
            },
          },
        },
      },
    });
  }

  // 2. Yearly (Jan-Dec)
  const ctx2 = document.getElementById(
    "yearlyRevenueChart"
  ) as HTMLCanvasElement | null;
  if (yearlyChartInstance.value) yearlyChartInstance.value.destroy();
  if (ctx2 && yearlyChartData.value.labels.length) {
    yearlyChartInstance.value = new Chart(ctx2, {
      type: "line",
      data: {
        labels: yearlyChartData.value.labels,
        datasets: [
          {
            label: "Total Revenue",
            data: yearlyChartData.value.values,
            borderColor: "#6366F1",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ticks: {
              callback: (val: any) =>
                `Rp ${Number(val).toLocaleString("id-ID")}`,
            },
          },
        },
      },
    });
  }

  // 3. Monthly breakdown
  const ctx3 = document.getElementById(
    "monthlyBreakdownChart"
  ) as HTMLCanvasElement | null;
  if (monthlyChartInstance.value) monthlyChartInstance.value.destroy();
  if (ctx3 && monthlyChartData.value.labels.length) {
    monthlyChartInstance.value = new Chart(ctx3, {
      type: "bar",
      data: {
        labels: monthlyChartData.value.labels,
        datasets: [
          {
            label: "Revenue",
            data: monthlyChartData.value.values,
            backgroundColor: ["#22C55E", "#F97316", "#EF4444", "#3B82F6"],
            borderRadius: 12,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ticks: {
              callback: (val: any) =>
                `Rp ${Number(val).toLocaleString("id-ID")}`,
            },
          },
        },
      },
    });
  }
};

onMounted(handleFetch);
</script>
