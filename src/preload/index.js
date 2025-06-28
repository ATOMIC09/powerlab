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
  },
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
      serialSend: (msg) => ipcRenderer.invoke('serial-send', msg),
      serialClose: () => ipcRenderer.invoke('serial-close'),
      onSerialData: (callback) => ipcRenderer.on('serial-data', (_, data) => callback(data)),
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
