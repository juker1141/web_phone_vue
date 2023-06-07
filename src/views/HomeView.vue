<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useCallConfigStore } from '@/stores/callConfig';

const router = useRouter();
const callConfig = useCallConfigStore();

const startPhoneCall = (type: "voice" | "video") => {
  callConfig.updateCallType(type)
  callConfig.updateCallerInfo({
    name: "兎田ぺこら",
    UID: "Hololive 3期生",
    image: "/src/assets/image/pekora_avatar.png",
  })
  router.push({
    name: 'beforeTalk'
  })
}

const startPickUpPhone = (type: "voice" | "video") => {
  callConfig.updateCallType(type)
  callConfig.updateCallerInfo({
    name: "さくらみこ",
    UID: "全 lost 魔王",
    image: "/src/assets/image/miko_avatar.png",
  })
  router.push({
    name: 'waitpickup'
  })
}
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="relative flex flex-col items-center justify-center w-full xl:w-1/3 2xl:w-1/2">
      <!-- <div
          class="absolute top-8 left-1/2 -translate-x-1/2 w-11/12 xl:mx-0 xl:w-1/2 bg-white rounded-lg p-4 flex justify-between items-center z-20 shadow shadow-gray-300">
          <div class="flex items-center">
            <div
              class="bg-[url('/src/assets/image/miko_avatar.png')] bg-center bg-cover bg-no-repeat h-14 w-14 rounded-full shadow-sm shadow-black">
            </div>
            <div class="flex flex-col pl-3">
              <p>さくらみこ</p>
              <p class="text-xs mt-1">全 lost 魔王</p>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <button type="button" @click.prevent="() => startPickUpPhone('voice')"
              class="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center">
              <i class="las la-phone text-2xl text-white"></i>
            </button>
            <button type="button" @click.prevent="() => startPickUpPhone('video')"
              class="w-10 h-10 bg-teal-400 rounded-full ml-3">
              <i class="las la-video text-2xl text-white"></i>
            </button>
          </div>
        </div> -->
      <div class="w-full h-screen flex flex-col items-center justify-center z-10 py-16 px-12 xl:px-24 relative">
        <!-- 對方的用戶頭像 -->
        <div class="grow w-full flex flex-col items-center justify-center">
          <div ref="user-avatar" class="w-full flex flex-col items-center justify-center mb-5">
            <div
              class="bg-[url('/src/assets/image/pekora_avatar.png')] bg-center bg-cover bg-no-repeat h-40 w-40 rounded-full">
            </div>
            <p class="text-white mt-5">兎田ぺこら</p>
            <p class="text-white text-xs mt-1">hololive 3期生</p>
          </div>
        </div>
        <!-- 下方的通話控制 -->
        <div ref="controller" class="w-full flex items-end justify-between h-24">
          <div class="flex flex-col items-center justify-center w-16 h-16">
            <button type="button" @click.prevent="() => startPhoneCall('voice')"
              class=" w-14 h-14 bg-teal-400 rounded-full">
              <i class="las la-phone text-3xl text-white"></i>
            </button>
          </div>
          <div class="flex flex-col items-center justify-center w-16 h-16">
            <button type="button" @click.prevent="() => startPhoneCall('video')"
              class="w-14 h-14 bg-teal-400 rounded-full">
              <i class="las la-video text-3xl text-white"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
