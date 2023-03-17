<script setup lang="ts">
import { RouterView } from 'vue-router';
import BlurBackground from '@/components/BlurBackground.vue';
</script>

<template>
  <BlurBackground>
    <RouterView />
  </BlurBackground>
</template>