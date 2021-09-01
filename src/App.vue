<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from "@vue/reactivity";
import SwapTolerance from "./components/SwapTolerance.vue";
import LeverageLoops from "./components/LeverageLoops.vue";
import StatsPanel from "./components/StatsPanel.vue";
import { useAccount } from "./hooks/account";

const { connect, connected } = useAccount();

const swapTolerance = ref(
  JSON.parse(localStorage.getItem("user-picked-swap-tolerance") ?? "1")
);
const leverageLoops = ref(1);
</script>

<template>
  <transition name="component-fade" mode="out-in">
    <div class="bg-purp-dark rounded shadow-xl p-8" v-if="connected">
      <h1>Change Leverage</h1>

      <SwapTolerance v-model="swapTolerance" />
      <LeverageLoops v-model="leverageLoops" />
      <StatsPanel />

      <input
        v-model="tokenAmount"
        class="w-full p-2 rounded bg-purp-mid mt-4"
      />
      <button class="bg-purple-500 px-4 py-2 mt-6 rounded-full">Deposit</button>
    </div>
    <button class="bg-purple-500 p-4 rounded-full" v-else @click="connect">
      Connect Wallet
    </button>
  </transition>
</template>

<style>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
</style>
