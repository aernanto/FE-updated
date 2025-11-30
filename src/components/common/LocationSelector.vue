<template>
  <select :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    class="input select">
    <option value="" disabled>Select Location</option>
    <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
  </select>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits(['update:modelValue']);

const locations = [
  'Jakarta', 'Bali', 'Yogyakarta', 'Surabaya', 'Bandung', 'Lombok', 'Medan', 'Makassar', 'Semarang', 'Palembang'
];
</script>
