<script lang="ts" setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

import RejectCallBtn from "@/components/button/RejectCallBtn.vue";
import SpeakerBtn from '@/components/button/SpeakerBtn.vue';
import VideoCallBtn from "./button/VideoCallBtn.vue";
import ConnectCallBtn from '@/components/button/ConnectCallBtn.vue';
import DisconnectCallBtn from "@/components/button/DisconnectCallBtn.vue";
import MicrophoneBtn from "@/components/button/MicrophoneBtn.vue";

const router = useRouter();
const props = defineProps({
  type: String
})

const endPhoneCall = () => {
  router.push({
    name: "home"
  })
}
</script>

<template>
  <div ref="controller" class="w-full flex items-end justify-between h-24">
    <MicrophoneBtn />
    <DisconnectCallBtn @click.prevent="() => endPhoneCall()" />
    <template v-if="props.type === 'voice'">
      <SpeakerBtn />
    </template>
    <template v-else-if="props.type === 'video'">
      <VideoCallBtn />
    </template>
  </div>
</template>

