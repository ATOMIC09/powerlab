import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { SerialPort } from 'serialport'

let mainWindow
let port
let serialBuffer = '' // Buffer to accumulate serial data

// Command queue system
class SerialCommandQueue {
  constructor() {
    this.queue = []
    this.isProcessing = false
    this.currentCommand = null
    this.commandTimeout = 1000 // Reduced from 2000ms to 1000ms for faster polling
    this.timeoutId = null
  }

  enqueue(command, resolve, reject) {
    this.queue.push({ command, resolve, reject, timestamp: Date.now() })
    this.processQueue()
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0 || !port || !port.isOpen) {
      return
    }

    this.isProcessing = true
    this.currentCommand = this.queue.shift()

    try {
      // Clear any existing timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }

      // Set command timeout
      this.timeoutId = setTimeout(() => {
        if (this.currentCommand) {
          this.currentCommand.reject(new Error('Command timeout'))
          this.currentCommand = null
          this.isProcessing = false
          this.processQueue() // Process next command
        }
      }, this.commandTimeout)

      // Send the command
      port.write(this.currentCommand.command + '\n')
      // console.log('Sent command:', this.currentCommand.command)
    } catch (error) {
      this.currentCommand.reject(error)
      this.currentCommand = null
      this.isProcessing = false
      this.processQueue()
    }
  }

  handleResponse(data) {
    if (this.currentCommand) {
      // Clear timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }

      // Resolve the current command with the response
      this.currentCommand.resolve(data.trim())
      this.currentCommand = null
      this.isProcessing = false

      // Process next command in queue
      this.processQueue()
    } else {
      // Received response but no command waiting - log it
      console.warn('Received unexpected response:', data.trim())
    }
  }

  clear() {
    // Reject all pending commands
    this.queue.forEach((item) => {
      item.reject(new Error('Queue cleared'))
    })
    this.queue = []

    if (this.currentCommand) {
      this.currentCommand.reject(new Error('Queue cleared'))
      this.currentCommand = null
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    this.isProcessing = false
  }
}

const commandQueue = new SerialCommandQueue()

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Handle COM ports request
  ipcMain.handle('get-com-ports', async () => {
    try {
      const ports = await SerialPort.list()
      const portPaths = ports.map((port) => port.path)
      // console.log('Available COM ports:', portPaths)
      return portPaths
    } catch (error) {
      console.error('Error fetching COM ports:', error)
      return [] // Return empty array on error
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('serial-open', async (_, portPath, baudRate = 9600) => {
  try {
    // Close existing port if open
    if (port && port.isOpen) {
      port.removeAllListeners() // Remove all listeners
      port.close()
      port = null
    }

    // Clear the serial buffer
    serialBuffer = ''

    port = new SerialPort({ path: portPath, baudRate: parseInt(baudRate), autoOpen: true })

    port.on('data', (data) => {
      const chunk = data.toString()
      serialBuffer += chunk

      // Check if we have complete lines (ending with \n or \r\n)
      let lines = serialBuffer.split(/\r?\n/)

      // Keep the last incomplete line in the buffer
      serialBuffer = lines.pop() || ''

      // Process each complete line
      lines.forEach((line) => {
        if (line.trim().length > 0) {
          const response = line.trim()
          // console.log('Main process received complete response:', response)

          // Handle command queue response
          commandQueue.handleResponse(response)

          // Also send to renderer for any listeners
          mainWindow.webContents.send('serial-data', response)
        }
      })
    })

    return 'opened'
  } catch (err) {
    return 'error: ' + err.message
  }
})

ipcMain.handle('serial-send', async (_, message) => {
  if (port && port.isOpen) {
    port.write(message + '\n')
    return 'sent'
  }
  return 'port not open'
})

// New queue-based command handler
ipcMain.handle('serial-send-command', async (_, command) => {
  return new Promise((resolve, reject) => {
    if (!port || !port.isOpen) {
      reject(new Error('Port not open'))
      return
    }

    commandQueue.enqueue(command, resolve, reject)
  })
})

// Batch command handler for reading all values
ipcMain.handle('serial-read-all-values', async () => {
  const commands = [
    { key: 'ch1Voltage', command: 'rv' },
    { key: 'ch1Current', command: 'ra' },
    { key: 'ch1PresetVoltage', command: 'ru' },
    { key: 'ch1PresetCurrent', command: 'ri' },
    { key: 'ch2Voltage', command: 'rh' },
    { key: 'ch2Current', command: 'rj' },
    { key: 'ch2PresetVoltage', command: 'rk' },
    { key: 'ch2PresetCurrent', command: 'rq' },
    { key: 'workingMode', command: 'rm' },
    { key: 'ch1State', command: 'rs' },
    { key: 'ch2State', command: 'rp' }
  ]

  const results = {}

  try {
    for (const cmd of commands) {
      const response = await new Promise((resolve, reject) => {
        if (!port || !port.isOpen) {
          reject(new Error('Port not open'))
          return
        }
        commandQueue.enqueue(cmd.command, resolve, reject)
      })

      // Parse the response
      if (cmd.key === 'workingMode' || cmd.key.includes('State')) {
        // For working mode and channel states, keep the response as is (e.g., "0000", "0001", "0016")
        results[cmd.key] = response.trim()
      } else {
        // Parse numeric values for voltage/current
        const numValue = parseInt(response)
        if (!isNaN(numValue)) {
          if (cmd.key.includes('Current')) {
            results[cmd.key] = numValue / 1000 // Convert to Amps (e.g., 2500 -> 2.500A)
          } else {
            results[cmd.key] = numValue / 100 // Convert to Volts (e.g., 1200 -> 12.00V)
          }
        } else {
          results[cmd.key] = response // Keep original response if not numeric
        }
      }
    }

    return results
  } catch (error) {
    throw new Error('Failed to read values: ' + error.message)
  }
})

ipcMain.handle('serial-close', async () => {
  try {
    // Clear the command queue and buffer
    commandQueue.clear()
    serialBuffer = ''

    if (port && port.isOpen) {
      port.removeAllListeners() // Remove all listeners before closing
      port.close()
      port = null
      return 'closed'
    }
    return 'port not open'
  } catch (err) {
    return 'error: ' + err.message
  }
})

// Handler to get device model
ipcMain.handle('serial-get-device-model', async () => {
  return new Promise((resolve, reject) => {
    if (!port || !port.isOpen) {
      reject(new Error('Port not open'))
      return
    }

    commandQueue.enqueue('a', resolve, reject)
  })
})
