<script setup>
import { nextTick, ref } from "vue";

const props = defineProps({
  modelValue: String | Number,
});

const emits = defineEmits(["update:modelValue"]);

const picked = ref(0);
const customValue = ref("custom");

function update() {
  emits("update:modelValue", picked.value);
  console.log(picked);
}

function updateCustom() {
  let number = Math.floor(Math.random() * 10);
  customValue.value = `c_${number}`; // component internally requires a unique key
  picked.value = customValue.value;
  emits("update:modelValue", number); // emit the actual desired number without interfereing with radio state
}
</script>

<template>
  <p class="py-4">Swap Tolerance</p>
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
    <label class="bg-purple-900 px-2 py-1 rounded-full cursor-pointer">
      <input
        type="radio"
        :value="customValue"
        v-model="picked"
        @change="updateCustom"
        class="hidden"
      />
      Custom
    </label>
  </div>
</template>
