<script setup>
import SwapTolerance from "./components/SwapTolerance.vue";
import LeverageLoops from "./components/LeverageLoops.vue";
import StatsPanel from "./components/StatsPanel.vue";

import { useRoboVault } from "./hooks/robovault";
import { currency } from "./utils/formatters";
import { inject } from "vue";

const {
  // Auth
  login,
  logout,
  initialise,
  connected,

  // inputs
  slippage,
  loops,
  collatRatio,

  // user
  account,
  tokenAmount,
  stats,

  // position
  positionAddress,
  open,
  close,
  deposit,
} = useRoboVault({ toast: inject("$toast") });
</script>

<template>
  <transition name="component-fade" mode="out-in">
    <div class="bg-purp-dark rounded shadow-xl p-8" v-if="connected">
      <p class="text-xs pb-2 cursor-pointer" @click="logout">
        {{ account }} -- {{ currency(stats.usdcBalance) }}
      </p>
      <h1 class="text-lg font-bold">Change Leverage</h1>

      <SwapTolerance v-model="slippage" />
      <LeverageLoops v-model="loops" />
      <StatsPanel :stats="stats" />

      <template v-if="positionAddress">
        <p class="my-4">Position: {{ positionAddress }}</p>
        <input
          v-model="tokenAmount"
          placeholder="$0.00"
          class="w-full p-2 rounded bg-purp-mid"
        />

        <button
          class="bg-purple-500 px-4 py-2 mt-6 rounded-full"
          @click="open"
          v-if="!stats.collateral"
        >
          Open Long
        </button>
        <template v-else>
          <div class="flex justify-between">
            <button
              class="bg-purple-500 px-4 py-2 mt-6 rounded-full"
              @click="deposit"
            >
              Increase Collateral
            </button>
            <button
              class="bg-purple-500 px-4 py-2 mt-6 rounded-full"
              @click="close"
            >
              Close
            </button>
          </div>
        </template>
      </template>
      <template v-else>
        <button
          class="bg-purple-500 px-4 py-2 mt-6 rounded-full"
          @click="initializePosition"
        >
          Create Position
        </button>
      </template>
    </div>
    <button class="bg-purple-500 p-4 rounded-full" v-else @click="login">
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
