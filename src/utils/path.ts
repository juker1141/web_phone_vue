const createSIPPath = (displayName: string, baseUrl: string): string => {
  return `sip:${displayName}@${baseUrl}`
}

const createWsPath = (baseUrl: string): string => {
  return `wss://${baseUrl}/ws`
}

export { createSIPPath, createWsPath }
