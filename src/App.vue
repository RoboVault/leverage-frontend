<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from "@vue/reactivity";
import SwapTolerance from "./components/SwapTolerance.vue";
import LeverageLoops from "./components/LeverageLoops.vue";

const swapTolerance = ref(1);
const leverageLoops = ref(1);
</script>

<template>
  <div class="bg-purp-dark rounded shadow-xl p-8">
    <h1>Change Leverage</h1>

    <SwapTolerance v-model="swapTolerance" />

    <LeverageLoops v-model="leverageLoops" />
  </div>
</template>
