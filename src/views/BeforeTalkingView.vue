<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useCallConfigStore } from '@/stores/callConfig';

import SpeakerBtn from '@/components/button/SpeakerBtn.vue';
import VideoCallBtn from "@/components/button/VideoCallBtn.vue";
import DisconnectCallBtn from "@/components/button/DisconnectCallBtn.vue";
import MicrophoneBtn from "@/components/button/MicrophoneBtn.vue";

import DotLoading from "@/components/DotLoading.vue";

const router = useRouter();
const callConfig = useCallConfigStore();
const isCallLoading = ref(true);

const endPhoneCall = () => {
  callConfig.$reset();
  router.push({
    name: "home"
  })
}

</script>

<template>
  <div class="w-full flex justify-center">
    <div class="flex flex-col items-center justify-center w-full xl:w-1/3 2xl:w-1/2">
      <div class="w-full h-screen flex flex-col items-center justify-center z-10 py-16 px-12 xl:px-24 relative">
        <!-- 對方的用戶頭像 -->
        <div class="grow w-full flex flex-col items-center justify-center">
          <div ref="user-avatar" class="w-full flex flex-col items-center justify-center mb-5">
            <div :style="{ backgroundImage: `url(${callConfig.callerInfo.image})` }"
              class="bg-center bg-cover bg-no-repeat h-40 w-40 rounded-full">
            </div>
            <p class="text-white mt-5">{{ callConfig.callerInfo.name }}</p>
            <p class="text-white text-xs mt-1">{{ callConfig.callerInfo.UID }}</p>
          </div>
          <DotLoading />
        </div>
        <!-- 下方的通話控制 -->
        <div ref="controller" class="w-full flex items-end justify-between h-24">
          <MicrophoneBtn />
          <DisconnectCallBtn @click.prevent="() => endPhoneCall()" />
          <template v-if="callConfig.callType === 'voice'">
            <SpeakerBtn />
          </template>
          <template v-else>
            <VideoCallBtn />
          </template>
        </div>
      </div>
      <!-- 視訊通話 -->
      <div ref="video-telephony"
        class="absolute h-full w-full xl:w-1/4 top-0 left-1/2 -translate-x-1/2 bg-black opacity-0 z-0">
      </div>
    </div>
  </div>
</template>
