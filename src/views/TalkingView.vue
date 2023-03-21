<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useCallConfigStore } from '@/stores/callConfig';

import { Web } from "sip.js";

import MicrophoneBtn from "@/components/button/MicrophoneBtn.vue";
import DisconnectCallBtn from "@/components/button/DisconnectCallBtn.vue";
import VideoCallBtn from "@/components/button/VideoCallBtn.vue";
import SpeakerBtn from '@/components/button/SpeakerBtn.vue';


const router = useRouter();
const callConfig = useCallConfigStore();
const isCallLoading = ref(true);

const remoteVideoRef = ref<null | HTMLVideoElement>(null);
const localVideoRef = ref<null | HTMLVideoElement>(null);

let user: any;

const endPhoneCall = () => {
  callConfig.$reset();
  router.push({
    name: "home"
  })
}

const connectCall = async () => {
  try {
    await user.connect();
    // connectButton.disabled = true;
    // disconnectButton.disabled = false;
    // registerButton.disabled = false;
    // beginButton.disabled = false;
  } catch (error: any) {
    console.error(`[${user.value.id}] failed to connect`);
    console.error(error);
    alert(`[${user.value.id}] Failed to connect.\n` + error);
  }
}

const disconnectCall = async () => {
  try {
    await user.disconnect();
    // connectButton.disabled = false;
    // disconnectButton.disabled = true;
    // registerButton.disabled = true;
    // beginButton.disabled = true;
  } catch (error: any) {
    console.error(`[${user.id}] failed to disconnect`);
    console.error(error);
    alert(`[${user.id}] Failed to disconnect.\n` + error);
  }
}

const registerUser = async () => {
  try {
    await user
      .register({
        // An example of how to get access to a SIP response message for custom handling
        requestDelegate: {
          onReject: (response: any) => {
            console.warn(`[${user.id}] REGISTER rejected`);
            let message = `Registration of "${user.id}" rejected.\n`;
            message += `Reason: ${response.message.reasonPhrase}\n`;
            alert(message);
          }
        }
      })

    // registerButton.disabled = true;
  } catch (error: any) {

    console.error(`[${user.id}] failed to register`);
    console.error(error);
    alert(`[${user.id}] Failed to register.\n` + error);
  }
}

const beginCall = async (target: string, targetDisplay: string) => {
  try {
    await user
      .call(target, undefined, {
        // An example of how to get access to a SIP response message for custom handling
        requestDelegate: {
          onReject: (response: any) => {
            console.warn(`[${user.id}] INVITE rejected`);
            let message = `Session invitation to "${targetDisplay}" rejected.\n`;
            message += `Reason: ${response.message.reasonPhrase}\n`;
            message += `Perhaps "${targetDisplay}" is not connected or registered?\n`;
            message += `Or perhaps "${targetDisplay}" did not grant access to video?\n`;
            alert(message);
          }
        },
        withoutSdp: false
      })
  } catch (error: any) {

    console.error(`[${user.id}] failed to begin session`);
    console.error(error);
    alert(`[${user.id}] Failed to begin session.\n` + error);
  }
}

const endCall = async () => {
  try {
    await user.hangup()
  } catch (error: any) {

    console.error(`[${user.id}] failed to end session`);
    console.error(error);
    alert(`[${user.id}] Failed to end session.\n` + error);
  }
}

const holdCall = (holdCheckbox: HTMLInputElement) => {
  if (holdCheckbox.checked) {
    // Checkbox is checked..
    user.hold().catch((error: Error) => {
      holdCheckbox.checked = false;
      console.error(`[${user.id}] failed to hold call`);
      console.error(error);
      alert("Failed to hold call.\n" + error);
    });
  } else {
    // Checkbox is not checked..
    user.unhold().catch((error: Error) => {
      holdCheckbox.checked = true;
      console.error(`[${user.id}] failed to unhold call`);
      console.error(error);
      alert("Failed to unhold call.\n" + error);
    });
  }
}

const mutedCall = (muteCheckbox: HTMLInputElement) => {
  if (muteCheckbox.checked) {
    // Checkbox is checked..
    user.mute();
    if (user.isMuted() === false) {
      muteCheckbox.checked = false;
      console.error(`[${user.id}] failed to mute call`);
      alert("Failed to mute call.\n");
    }
  } else {
    // Checkbox is not checked..
    user.unmute();
    if (user.isMuted() === true) {
      muteCheckbox.checked = true;
      console.error(`[${user.id}] failed to unmute call`);
      alert("Failed to unmute call.\n");
    }
  }
}

function buildUser(
  webSocketServer: string,
  aor: string,
  displayName: string,
  videoLocalElement: HTMLVideoElement,
  videoRemoteElement: HTMLVideoElement
): Web.SimpleUser {
  console.log(`Creating "${name}" <${aor}>...`);

  // SimpleUser options
  const options: Web.SimpleUserOptions = {
    aor,
    media: {
      constraints: {
        // This demo is making "video only" calls
        audio: true,
        video: true
      },
      local: {
        video: videoLocalElement
      },
      remote: {
        video: videoRemoteElement
      }
    },
    userAgentOptions: {
      // logLevel: "debug",
      displayName,
      authorizationUsername: displayName,
      authorizationPassword: '80076327'
    }
  };

  // Create SimpleUser
  const user = new Web.SimpleUser(webSocketServer, options);

  // SimpleUser delegate
  const delegate: Web.SimpleUserDelegate = {
    onCallAnswered: () =>
      console.log(`[${user.id}] call answered`),
    onCallCreated: () =>
      console.log(`[${user.id}] call created`),
    onCallReceived: () => {
      console.log(`[${user.id}] call received`);
      user.answer().catch((error: Error) => {
        console.error(`[${user.id}] failed to answer call`);
        console.error(error);
        alert(`[${user.id}] Failed to answer call.\n` + error);
      });
    },
    onCallHangup: () =>
      console.log(`[${user.id}] call hangup`),
    onCallHold: () =>
      console.log(`[${user.id}] call hold`),
    onRegistered: () => console.log(`[${user.id}] registered`),
    onUnregistered: () => console.log(`[${user.id}] unregistered`),
    onServerConnect: () => console.log(`[${user.id}] connected`),
    onServerDisconnect: (error?: Error) => {
      console.log(`[${user.id}] disconnected`);
      if (error) {
        alert(`[${user.id}] Server disconnected.\n` + error.message);
      }
    }
  };
  user.delegate = delegate;

  // Setup connect button click listeners
  // connectButton.addEventListener(
  //   "click",
  //   makeConnectButtonClickListener(user, connectButton, disconnectButton, registerButton, beginButton)
  // );


  // Setup disconnect button click listeners
  // disconnectButton.addEventListener(
  //   "click",
  //   makeDisconnectButtonClickListener(user, connectButton, disconnectButton, registerButton, beginButton)
  // );

  // Setup register button click listeners
  // registerButton.addEventListener("click", makeRegisterButtonClickListener(user, registerButton));

  // Setup unregister button click listeners
  // unregisterButton.addEventListener("click", makeUnregisterButtonClickListener(user, unregisterButton));

  // Setup begin button click listeners
  // beginButton.addEventListener("click", makeBeginButtonClickListener(user, targetAOR, targetName));

  // Setup end button click listeners
  // endButton.addEventListener("click", makeEndButtonClickListener(user));

  // Setup hold change listeners
  // holdCheckbox.addEventListener("change", makeHoldCheckboxClickListener(user, holdCheckbox));

  // Setup mute change listeners
  // muteCheckbox.addEventListener("change", makeMuteCheckboxClickListener(user, muteCheckbox));

  // Enable connect button
  // connectButton.disabled = false;

  return user;
}

onMounted(async () => {
  if (!remoteVideoRef.value || !localVideoRef.value) return;
  user = buildUser(
    "wss://turn.realtime.tw/ws",
    "sip:601@turn.realtime.tw",
    "601",
    remoteVideoRef.value,
    localVideoRef.value,
  )
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
          <MicrophoneBtn />
          <DisconnectCallBtn @click.prevent="() => endCall()" />
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
