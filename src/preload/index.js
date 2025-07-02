import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getComPorts: async () => {
    try {
      return await ipcRenderer.invoke('get-com-ports')
    } catch (error) {
      console.error('Error fetching COM ports:', error)
      return []
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      serialOpen: (port, baud) => ipcRenderer.invoke('serial-open', port, baud),
      serialSendCommand: (command) => ipcRenderer.invoke('serial-send-command', command),
      serialReadAllValues: () => ipcRenderer.invoke('serial-read-all-values'),
      serialGetDeviceModel: () => ipcRenderer.invoke('serial-get-device-model'),
      serialClose: () => ipcRenderer.invoke('serial-close'),
      onSerialData: (callback) => {
        // Remove any existing listeners first to prevent duplicates
        ipcRenderer.removeAllListeners('serial-data')
        // Add the new listener
        ipcRenderer.on('serial-data', (_, data) => callback(data))
      },
      removeSerialDataListener: () => ipcRenderer.removeAllListeners('serial-data')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
