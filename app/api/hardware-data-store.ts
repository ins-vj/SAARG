// In-memory storage for hardware data
// This stores the latest hardware data received from the device

interface HardwareDataStored {
  data: any
  timestamp: number
  sessionId: string
}

let hardwareDataStore: HardwareDataStored | null = null

export function storeHardwareData(data: any, sessionId: string) {
  hardwareDataStore = {
    data,
    timestamp: Date.now(),
    sessionId,
  }
}

export function getLatestHardwareData() {
  // Check if data exists and is not older than 5 minutes
  if (hardwareDataStore && Date.now() - hardwareDataStore.timestamp < 5 * 60 * 1000) {
    return hardwareDataStore.data
  }
  return null
}

export function clearHardwareData() {
  hardwareDataStore = null
}

export function getStorageStatus() {
  if (!hardwareDataStore) {
    return { hasData: false, age: 0 }
  }
  return {
    hasData: true,
    age: Date.now() - hardwareDataStore.timestamp,
    sessionId: hardwareDataStore.sessionId,
  }
}
