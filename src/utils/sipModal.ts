import { ref, onMounted } from 'vue'

import { Web } from 'sip.js'

export default function useSipUser(
  wsServer: string,
  userUri: string,
  userName: string,
  password: string
) {
  const user = ref<null | Web.SimpleUser>(null)

  const connectCall = async () => {
    try {
      await user.value?.connect()
      // connectButton.disabled = true;
      // disconnectButton.disabled = false;
      // registerButton.disabled = false;
      // beginButton.disabled = false;
    } catch (error: any) {
      console.error(`[${user.value?.id}] failed to connect`)
      console.error(error)
      alert(`[${user.value?.id}] Failed to connect.\n` + error)
    }
  }

  const disconnectCall = async () => {
    try {
      await user.value?.disconnect()
      // connectButton.disabled = false;
      // disconnectButton.disabled = true;
      // registerButton.disabled = true;
      // beginButton.disabled = true;
    } catch (error: any) {
      console.error(`[${user.value?.id}] failed to disconnect`)
      console.error(error)
      alert(`[${user.value?.id}] Failed to disconnect.\n` + error)
    }
  }

  const registerUser = async () => {
    try {
      await user.value?.register({
        // An example of how to get access to a SIP response message for custom handling
        requestDelegate: {
          onReject: (response: any) => {
            console.warn(`[${user.value?.id}] REGISTER rejected`)
            let message = `Registration of "${user.value?.id}" rejected.\n`
            message += `Reason: ${response.message.reasonPhrase}\n`
            alert(message)
          }
        }
      })

      // registerButton.disabled = true;
    } catch (error: any) {
      console.error(`[${user.value?.id}] failed to register`)
      console.error(error)
      alert(`[${user.value?.id}] Failed to register.\n` + error)
    }
  }

  const beginCall = async (target: string, targetDisplay: string) => {
    try {
      await user.value?.call(target, undefined, {
        // An example of how to get access to a SIP response message for custom handling
        requestDelegate: {
          onReject: (response: any) => {
            console.warn(`[${user.value?.id}] INVITE rejected`)
            let message = `Session invitation to "${targetDisplay}" rejected.\n`
            message += `Reason: ${response.message.reasonPhrase}\n`
            message += `Perhaps "${targetDisplay}" is not connected or registered?\n`
            message += `Or perhaps "${targetDisplay}" did not grant access to video?\n`
            alert(message)
          }
        },
        withoutSdp: false
      })
    } catch (error: any) {
      console.error(`[${user.value?.id}] failed to begin session`)
      console.error(error)
      alert(`[${user.value?.id}] Failed to begin session.\n` + error)
    }
  }

  const endCall = async () => {
    try {
      await user.value?.hangup()
    } catch (error: any) {
      console.error(`[${user.value?.id}] failed to end session`)
      console.error(error)
      alert(`[${user.value?.id}] Failed to end session.\n` + error)
    }
  }

  const holdCall = (holdCheckbox: HTMLInputElement) => {
    if (holdCheckbox.checked) {
      // Checkbox is checked..
      user.value?.hold().catch((error: Error) => {
        holdCheckbox.checked = false
        console.error(`[${user.value?.id}] failed to hold call`)
        console.error(error)
        alert('Failed to hold call.\n' + error)
      })
    } else {
      // Checkbox is not checked..
      user.value?.unhold().catch((error: Error) => {
        holdCheckbox.checked = true
        console.error(`[${user.value?.id}] failed to unhold call`)
        console.error(error)
        alert('Failed to unhold call.\n' + error)
      })
    }
  }

  const mutedCall = (muteCheckbox: HTMLInputElement) => {
    if (muteCheckbox.checked) {
      // Checkbox is checked..
      user.value?.mute()
      if (user.value?.isMuted() === false) {
        muteCheckbox.checked = false
        console.error(`[${user.value?.id}] failed to mute call`)
        alert('Failed to mute call.\n')
      }
    } else {
      // Checkbox is not checked..
      user.value?.unmute()
      if (user.value?.isMuted() === true) {
        muteCheckbox.checked = true
        console.error(`[${user.value?.id}] failed to unmute call`)
        alert('Failed to unmute call.\n')
      }
    }
  }

  function buildUser(
    webSocketServer: string,
    aor: string,
    displayName: string,
    password: string,
    videoLocalElement: HTMLVideoElement,
    videoRemoteElement: HTMLVideoElement
  ): Web.SimpleUser {
    console.log(`Creating "${displayName}" <${aor}>...`)

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
        authorizationPassword: password
      }
    }

    // Create SimpleUser
    const user = new Web.SimpleUser(webSocketServer, options)

    // SimpleUser delegate
    const delegate: Web.SimpleUserDelegate = {
      onCallAnswered: () => console.log(`[${user.id}] call answered`),
      onCallCreated: () => console.log(`[${user.id}] call created`),
      onCallReceived: () => {
        console.log(`[${user.id}] call received`)
        user.answer().catch((error: Error) => {
          console.error(`[${user.id}] failed to answer call`)
          console.error(error)
          alert(`[${user.id}] Failed to answer call.\n` + error)
        })
      },
      onCallHangup: () => console.log(`[${user.id}] call hangup`),
      onCallHold: () => console.log(`[${user.id}] call hold`),
      onRegistered: () => console.log(`[${user.id}] registered`),
      onUnregistered: () => console.log(`[${user.id}] unregistered`),
      onServerConnect: () => console.log(`[${user.id}] connected`),
      onServerDisconnect: (error?: Error) => {
        console.log(`[${user.id}] disconnected`)
        if (error) {
          alert(`[${user.id}] Server disconnected.\n` + error.message)
        }
      }
    }
    user.delegate = delegate

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

    return user
  }

  function refreshUser(videoLocalElement: HTMLVideoElement, videoRemoteElement: HTMLVideoElement) {
    if (!videoLocalElement || !videoRemoteElement) {
      console.error('no video element')
      return
    }
    user.value = buildUser(
      wsServer,
      userUri,
      userName,
      password,
      videoLocalElement,
      videoRemoteElement
    )
  }

  // onMounted(() => {
  //   user.value = buildUser(
  //     wsServer,
  //     userUri,
  //     userName,
  //     password,
  //     videoLocalElement,
  //     videoRemoteElement
  //   )
  // })

  return {
    user,
    connectCall,
    disconnectCall,
    registerUser,
    beginCall,
    endCall,
    holdCall,
    mutedCall,
    refreshUser
  }
}
