<script lang="ts" setup>
import { ref, defineEmits } from "vue";

const isMuted = ref(false);

const emit = defineEmits(['switchMuted']);

const onSwitchMuted = () => {
  isMuted.value = !isMuted.value;
  console.log(isMuted.value)
  emit('switchMuted', isMuted.value);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center relative w-16 ">
    <button @click.prevent="onSwitchMuted" type="button" ref="microphoneBtn" class="relative">
      <i class="las la-microphone text-3xl text-white"></i>
      <i v-if="isMuted"
        class="las la-slash text-4xl text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
    </button>
    <p class="text-xs text-white pt-1">
      {{ isMuted ? "開啟麥克風" : "關閉麥克風" }}
    </p>
  </div>
</template>