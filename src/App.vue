<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    <nav class="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
      <div class="font-bold text-xl tracking-wide">✈️ TourPackage App</div>
      <div class="space-x-6 font-medium">
        <RouterLink to="/packages" active-class="text-blue-400">Packages</RouterLink>
        <RouterLink to="/activities" active-class="text-blue-400">Activities</RouterLink>
        <RouterLink to="/statistics" active-class="text-blue-400">Statistics</RouterLink>
      </div>
    </nav>

    <main class="container mx-auto p-6">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* CSS Minimal biar ga hancur kalau Tailwind ga load */
nav { display: flex; padding: 1rem; background: #333; color: white; gap: 20px; }
nav a { color: white; text-decoration: none; margin-right: 15px; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
</style>
