<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useCallConfigStore } from '@/stores/callConfig';

import MicrophoneBtn from "@/components/button/MicrophoneBtn.vue";
import DisconnectCallBtn from "@/components/button/DisconnectCallBtn.vue";
import VideoCallBtn from "@/components/button/VideoCallBtn.vue";
import SpeakerBtn from '@/components/button/SpeakerBtn.vue';
import useSipUser from '@/utils/sipModal';


const router = useRouter();
const callConfig = useCallConfigStore();
const isCallLoading = ref(true);

const remoteVideoRef = ref<null | HTMLVideoElement>(null);
const localVideoRef = ref<null | HTMLVideoElement>(null);
const {
  user,
  connectCall,
  disconnectCall,
  registerUser,
  beginCall,
  endCall,
  holdCall,
  mutedCall, refreshUser } = useSipUser(
    "wss://turn.realtime.tw/ws",
    "sip:601@turn.realtime.tw",
    "601",
    "80076327",
  )

const endPhoneCall = () => {
  endCall()
  callConfig.$reset()
  router.push({
    name: 'home'
  })
}

onMounted(async () => {
  if (localVideoRef.value && remoteVideoRef.value) {
    refreshUser(localVideoRef.value, remoteVideoRef.value);
  }
  await connectCall();
  await registerUser();
  await beginCall("sip:600@turn.realtime.tw", '600');
})

</script>

<template>
  <div class="w-full flex justify-center">
    <div class="flex flex-col items-center justify-center w-full xl:w-1/3 2xl:w-1/2">
      <div class="w-full h-screen flex flex-col items-center justify-center z-10 py-16 px-12 xl:px-24 relative">
        <!-- 對方的用戶頭像 -->
        <div class="grow w-full flex flex-col items-center justify-center opacity-0">
          <div ref="user-avatar" class="w-full flex flex-col items-center justify-center mb-5">
            <div
              class="bg-[url('/src/assets/image/miko_avatar.png')] bg-center bg-cover bg-no-repeat h-40 w-40 rounded-full">
            </div>
            <p class="text-white mt-5">さくらみこ</p>
            <p class="text-white text-xs mt-1">全 lost 魔王</p>
          </div>
          <DotLoading />
        </div>
        <!-- 下方的通話控制 -->
        <div ref="controller" class="w-full flex items-end justify-between h-24">
          <MicrophoneBtn @switch-muted="(isMuted: boolean) => mutedCall(isMuted)" />
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
        class="absolute h-full w-full xl:w-1/3 2xl:w-1/2 top-0 left-1/2 -translate-x-1/2 bg-black z-0">
        <video ref="remoteVideoRef" class="object-cover w-full h-full">
          <p>Your browser doesn't support HTML5 video.</p>
        </video>
        <video ref="localVideoRef" class=" object-cover absolute w-1/3 h-1/3 top-0 left-0">
          <p>Your browser doesn't support HTML5 video.</p>
        </video>
      </div>
    </div>
  </div>
</template>
