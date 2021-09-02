<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from "@vue/reactivity";
import SwapTolerance from "./components/SwapTolerance.vue";
import LeverageLoops from "./components/LeverageLoops.vue";
import StatsPanel from "./components/StatsPanel.vue";
import { ethers, Contract } from "ethers";

import { useAccount } from "./hooks/account";

const { connect, connected, account } = useAccount();

const swapTolerance = ref(
  JSON.parse(localStorage.getItem("user-picked-swap-tolerance") ?? "1")
);
const leverageLoops = ref(1);
const positionAddress = ref("");
const usdcBalance = ref(0);
async function initializePosition() {
  let provider = new ethers.providers.Web3Provider(window.ethereum);

  const usdcContract = new Contract(
    "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    ["function balanceOf(address owner) view returns (uint balance)"],
    provider
  );
  const leveragerContract = new Contract(
    "0x8Cb11D692bdC1720B3e346c856BA74201bAb38Bc",
    ["function initializePosition() returns (address)"],
    provider.getSigner()
  );

  // get usdc balance
  usdcBalance.value = Number(await usdcContract.balanceOf(account.value)) / 1e6;
  console.log({ usdcBalance: usdcBalance.value });

  // this fails with metamask internal JSON-RPC error -32603
  positionAddress.value = await leveragerContract.initializePosition();
  console.log({ positionAddress: positionAddress.value });
}
</script>

<template>
  <transition name="component-fade" mode="out-in">
    <div class="bg-purp-dark rounded shadow-xl p-8" v-if="connected">
      <p class="text-xs pb-2">{{ account }}</p>
      <h1 class="text-lg font-bold">Change Leverage</h1>

      <SwapTolerance v-model="swapTolerance" />
      <LeverageLoops v-model="leverageLoops" />
      <StatsPanel />

      <template v-if="positionAddress">
        <p class="my-4">Position: {{ positionAddress }}</p>
        <input v-model="tokenAmount" class="w-full p-2 rounded bg-purp-mid" />
        <button class="bg-purple-500 px-4 py-2 mt-6 rounded-full">
          Deposit
        </button>
      </template>
      <template v-else>
        <button
          class="bg-purple-500 px-4 py-2 mt-6 rounded-full"
          @click="initializePosition"
        >
          Initialize Position
        </button>
      </template>
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
