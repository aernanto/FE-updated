<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
    <div class="font-bold text-xl tracking-wide">✈️ Tour Package</div>
    <div class="space-x-6 font-medium">
      <router-link to="/packages" active-class="text-blue-400">Packages</router-link>
      <router-link to="/activities" active-class="text-blue-400">Activities</router-link>
      <router-link to="/statistics" active-class="text-blue-400">Statistics</router-link>
    </div>
  </nav>
</template>
