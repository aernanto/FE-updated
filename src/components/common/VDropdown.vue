<script setup lang="ts">
import { ref } from 'vue'

interface DropdownItem {
  label: string
  value: string
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  items: {
    type: Array as () => DropdownItem[],
    required: true
  },
  placeholder: {
    type: String,
    default: 'Pilih...'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)

const selectItem = (item: DropdownItem) => {
  emit('update:modelValue', item.value)
  isOpen.value = false
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}
</script>

<template>
  <div class="relative">
    <!-- Dropdown Trigger -->
    <button
      @click="toggleDropdown"
      :disabled="disabled"
      class="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      :class="{
        'bg-gray-100': disabled
      }"
    >
      <div class="flex justify-between items-center">
        <span class="text-gray-700">
          {{ items.find(item => item.value === modelValue)?.label || placeholder }}
        </span>
        <svg 
          class="w-5 h-5 text-gray-400 transition-transform duration-200" 
          :class="{ 'rotate-180': isOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <div
        v-for="item in items"
        :key="item.value"
        @click="selectItem(item)"
        class="px-4 py-2 cursor-pointer hover:bg-pink-50 transition-colors duration-150"
        :class="{
          'bg-pink-100 text-pink-700': modelValue === item.value
        }"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>