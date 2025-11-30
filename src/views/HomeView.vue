<template>
  <main class="text-center pt-16 pb-20 px-6 pt-30">
    <!-- Title -->
    <h1 class="text-4xl font-bold text-purple-600 mb-4">
      Tour Package Management System
    </h1>
    <p class="text-gray-600 text-lg mb-12">
      Manage your tour packages, activities, and plans efficiently.
    </p>

    <!-- Cards -->
    <div class="flex justify-center flex-wrap gap-8">
      <!-- Activities -->
      <div class="w-72 bg-white rounded-2xl shadow hover:shadow-lg transition-all p-6">
        <h2 class="text-xl font-semibold mb-2 text-gray-800">Activities</h2>
        <p class="text-gray-500 text-sm mb-6">
          Create and manage tour activities with pricing and participant limits.
        </p>
        <RouterLink
          to="/activities"
          class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          Manage Activities
        </RouterLink>
      </div>

      <!-- Packages -->
      <div class="w-72 bg-white rounded-2xl shadow hover:shadow-lg transition-all p-6">
        <h2 class="text-xl font-semibold mb-2 text-gray-800">Packages</h2>
        <p class="text-gray-500 text-sm mb-6">
          Create tour packages and organize them with plans.
        </p>
        <RouterLink
          to="/packages"
          class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          Manage Packages
        </RouterLink>
      </div>

      <!-- Reports -->
      <div class="w-72 bg-white rounded-2xl shadow hover:shadow-lg transition-all p-6">
        <h2 class="text-xl font-semibold mb-2 text-gray-800">Reports</h2>
        <p class="text-gray-500 text-sm mb-6">
          View reports and analytics for your tour packages.
        </p>
        <RouterLink
          to="/statistics"
          class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          Manage Reports
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
// No special logic needed here
</script>
