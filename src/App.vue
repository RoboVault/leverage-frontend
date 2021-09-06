<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { reactive, ref } from "@vue/reactivity";
import SwapTolerance from "./components/SwapTolerance.vue";
import LeverageLoops from "./components/LeverageLoops.vue";
import StatsPanel from "./components/StatsPanel.vue";
import { ethers, Contract } from "ethers";

import { useAccount } from "./hooks/account";
import { useLeverage } from "./hooks/leverage";
import { usePosition } from "./hooks/position";

const { connect, connected, disconnect, account, getProvider, getSigner } =
  useAccount();

const { initialisePosition, getPositionAddress, positionAddress } = useLeverage(
  {
    account,
    getProvider,
    getSigner,
  }
);

const { openLong } = usePosition({ positionAddress, getProvider, getSigner });

const swapTolerance = ref(
  JSON.parse(localStorage.getItem("user-picked-swap-tolerance") ?? "1")
);
const leverageLoops = ref(1);
const usdcBalance = ref(0);
const tokenAmount = ref(0.01);

async function logout() {
  disconnect();
  leverageLoops.value = 1;
  usdcBalance.value = 0;
  tokenAmount.value = 0;
}

async function login() {
  await connect();
  try {
    await getPositionAddress();
  } catch {}
}

async function initialise() {
  await connect();
  try {
    await getPositionAddress();
  } catch {
    await initialisePosition();
    await getPositionAddress();
  }
}

async function deposit() {
  console.log({ amt: tokenAmount.value, loops: leverageLoops.value });
  const resp = await openLong(tokenAmount.value, leverageLoops.value);
  console.log(resp);
}

if (account.value) {
  initialise();
}
</script>

<template>
  <transition name="component-fade" mode="out-in">
    <div class="bg-purp-dark rounded shadow-xl p-8" v-if="connected">
      <p class="text-xs pb-2 cursor-pointer" @click="logout">{{ account }}</p>
      <h1 class="text-lg font-bold">Change Leverage</h1>

      <SwapTolerance v-model="swapTolerance" />
      <LeverageLoops v-model="leverageLoops" />
      <StatsPanel />

      <template v-if="positionAddress">
        <p class="my-4">Position: {{ positionAddress }}</p>
        <input v-model="tokenAmount" class="w-full p-2 rounded bg-purp-mid" />
        <button
          class="bg-purple-500 px-4 py-2 mt-6 rounded-full"
          @click="deposit"
        >
          Open Long
        </button>
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
