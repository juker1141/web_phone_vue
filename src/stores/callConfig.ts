import { defineStore } from 'pinia'

interface CallConfig {
  callType: 'voice' | 'video'
  callerInfo: {
    name: string
    UID: string
    image: string
  }
}

export const useCallConfigStore = defineStore('counter', {
  state: (): CallConfig => ({
    callType: 'voice',
    callerInfo: {
      name: '兎田ぺこら',
      UID: 'Hololive 3期生',
      image: '/src/assets/image/pekora_avatar.png'
    }
  }),
  actions: {
    updateCallType(type: 'voice' | 'video') {
      this.callType = type
    },
    updateCallerInfo(callerInfo: { name: string; UID: string; image: string }) {
      this.callerInfo = { ...callerInfo }
    }
  }
})
