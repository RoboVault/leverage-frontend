<script setup>
import { ref } from "@vue/reactivity";

const props = defineProps({
  modelValue: String | Number,
});

const emits = defineEmits(["update:modelValue"]);

function set(number) {
  localStorage.setItem("user-picked-leverage-loops", number);
  emits("update:modelValue", number);
  console.log("update", number);
}
</script>

<template>
  <div>
    <div class="py-4">Choose Your Loops</div>
    <div>
      <ul class="flex justify-between">
        <li
          v-for="num in 10"
          :key="num"
          :class="props.modelValue === num ? 'text-purple-500' : ''"
        >
          <button @click="set(num)">{{ num }}x</button>
        </li>
      </ul>

      <div class="bg-purple-900 w-full h-2 rounded-full overflow-hidden">
        <div
          class="
            bg-purple-600
            w-full
            h-2
            rounded-full
            transform
            transition
            duration-500
          "
          :style="[
            `--tw-translate-x: -${
              100 - (Number(props.modelValue) - 1) * (100 / 9)
            }%;`,
          ]"
        />
      </div>
    </div>
  </div>
</template>
