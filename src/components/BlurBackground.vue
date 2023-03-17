<script lang="ts" setup>
import { useCallConfigStore } from '@/stores/callConfig';

const callConfig = useCallConfigStore();
</script>

<template>
  <main class="h-screen w-full bg-black flex justify-center items-center">
    <div :style="{ backgroundImage: `url(${callConfig.callerInfo.image})` }"
      class="h-full w-full bg-center bg-cover bg-no-repeat">
      <div class="backdrop-blur-xl backdrop-brightness-50 h-full w-full">
        <RouterView />
      </div>
    </div>
  </main>
</template>