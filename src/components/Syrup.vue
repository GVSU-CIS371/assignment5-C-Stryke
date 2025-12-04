<template>
  <div class="syrup" :style="{ '--SColor': SColor }"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBeverageStore } from '../stores/beverageStore'

const store = useBeverageStore()
const { Scolor, Bcolor } = storeToRefs(store)
const SColor = computed(() =>
  Scolor.value === '#c6c6c6' ? Bcolor.value : Scolor.value
)
</script>

<style lang="scss" scoped>
.syrup {
  transform: translateY(400%);
  background-color: var(--SColor);
  position: relative;
  width: 100%;
  height: 20%;
  animation: pour-tea 2s 1s forwards;
  z-index: 2;
}
</style>