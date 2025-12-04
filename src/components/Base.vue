<template>
  <div class="baseBeverage" :style="{ '--Bcolor': Bcolor }"></div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBeverageStore } from '../stores/beverageStore'

const store = useBeverageStore()
const { Bcolor } = storeToRefs(store)
</script>

<style scoped>
.baseBeverage {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--Bcolor);
  bottom: 0;
  animation: pour-tea 2s;
  z-index: 300;
  /* // border-radius: 0.05em 0.05em 2.2em 2.2em; */
}
</style>