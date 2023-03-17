<script lang="ts" setup>
import { ref } from "vue";

const isCloseBtn = ref(false);
</script>

<template>
  <div class="flex flex-col items-center justify-center w-16">
    <button @click.prevent="isCloseBtn = !isCloseBtn" type="button" ref="pickupBtn" class="relative">
      <i class="las la-volume-up text-3xl text-white"></i>
      <i v-if="isCloseBtn"
        class="las la-slash text-4xl text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
    </button>
    <p class="text-xs text-white pt-1">
      {{ isCloseBtn ? "開啟擴音" : "關閉擴音" }}
    </p>
  </div>
</template>