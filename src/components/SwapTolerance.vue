<script setup>
import { computed, nextTick, ref } from "vue";

const props = defineProps({
  modelValue: String | Number,
});

const DEFAULT_USER_INPUT = JSON.parse(
  localStorage.getItem("user-entered-swap-tolerance") ?? "0.8"
);

const emits = defineEmits(["update:modelValue"]);

const picked = ref(props.modelValue);
const userInput = ref(DEFAULT_USER_INPUT);
const customValue = ref(`c_${DEFAULT_USER_INPUT}`);
const isCustom = computed(() => `c_${picked.value}` === customValue.value);

function update() {
  localStorage.setItem("user-picked-swap-tolerance", picked.value);
  emits("update:modelValue", picked.value);
}

function selectCustom() {
  const number = Number(`c_${userInput.value}`.replace("c_", ""));
  picked.value = number;
  update();
}

function updateCustom() {
  if (userInput.value) {
    userInput.value = Math.min(
      100,
      Math.max(0, Math.round(userInput.value * 10) / 10)
    );
  }
  localStorage.setItem("user-entered-swap-tolerance", userInput.value);
  customValue.value = `c_${userInput.value}`;
  picked.value = userInput.value;
  update();
}
</script>

<template>
  <p class="py-4">Slippage</p>
  <div class="flex justify-between gap-2">
    <label
      class="
        border-2
        bg-purple-900
        py-1
        rounded-full
        w-14
        flex
        items-center
        justify-center
        cursor-pointer
      "
      :class="picked === 0.5 ? 'border-purple-500' : 'border-purple-900'"
    >
      <input
        type="radio"
        :value="0.5"
        v-model="picked"
        @change="update"
        class="hidden"
      />
      0.5%
    </label>
    <label
      class="
        border-2
        bg-purple-900
        py-1
        rounded-full
        w-14
        flex
        items-center
        justify-center
        cursor-pointer
      "
      :class="picked === 1 ? 'border-purple-500' : 'border-purple-900'"
    >
      <input
        type="radio"
        :value="1"
        v-model="picked"
        @change="update"
        class="hidden"
      />
      1%
    </label>
    <label
      class="
        border-2
        bg-purple-900
        py-1
        rounded-full
        w-14
        flex
        items-center
        justify-center
        cursor-pointer
      "
      :class="picked === 3 ? 'border-purple-500' : 'border-purple-900'"
    >
      <input
        type="radio"
        :value="3"
        v-model="picked"
        @change="update"
        class="hidden"
      />
      3%
    </label>
    <label
      class="
        border-2
        bg-purple-900
        py-1
        rounded-full
        w-14
        flex
        items-center
        justify-center
        cursor-pointer
      "
      :class="picked === 5 ? 'border-purple-500' : 'border-purple-900'"
    >
      <input
        type="radio"
        :value="5"
        v-model="picked"
        @change="update"
        class="hidden"
      />
      5%
    </label>
    <label
      class="border-2 bg-purple-900 px-2 py-1 rounded-full cursor-pointer"
      :class="isCustom ? 'border-purple-500' : 'border-purple-900'"
    >
      <input
        type="radio"
        :value="customValue"
        v-model="picked"
        @change="selectCustom"
        class="hidden"
      />
      Custom
    </label>
  </div>
  <transition name="fade">
    <div class="overflow-y-hiden">
      <input
        v-if="isCustom"
        type="number"
        class="w-full p-2 rounded bg-purp-mid mt-4"
        min="0"
        max="100"
        step="0.1"
        v-model="userInput"
        @input="updateCustom"
      />
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 5s ease;
  max-height: 25px;
  height: 25px;
}

.fade-enter-from,
.fade-leave-to {
  /* opacity: 0; */
  max-height: 0;
  height: 0;
}
</style>
