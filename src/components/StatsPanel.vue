<script setup>
import { currency, number } from "../utils/formatters";
const props = defineProps({
  stats: Object,
});
</script>

<template>
  <ul class="pt-4 flex flex-col gap-4">
    <li class="flex justify-between">
      <div>Expected MIM amount</div>
      <div>~ 0.0000</div>
    </li>
    <li class="flex justify-between">
      <div>Expected APY</div>
      <div>~ 0.00%</div>
    </li>
    <li class="flex justify-between">
      <div>Expected Leverage</div>
      <div>~ {{ number(props.stats.leverage) }}</div>
    </li>
    <li class="flex justify-between">
      <div>Expected Liquidation Price</div>
      <div>~ {{ currency(props.stats.liquidationPrice) }}</div>
    </li>
    <li class="flex justify-between">
      <div>Current Price</div>
      <div>~ {{ currency(props.stats.price) }}</div>
    </li>
    <li class="flex justify-between">
      <div>Current Profit</div>
      <div>~ {{ currency(props.stats.profit) }}</div>
    </li>

    <li class="flex justify-between">
      <div>Current Collateral</div>
      <div>~ {{ currency(props.stats.collateral) }}</div>
    </li>
  </ul>
</template>
