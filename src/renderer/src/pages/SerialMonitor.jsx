import React, { useState, useEffect, useRef } from 'react'

export default function SerialMonitor() {
  const [logs, setLogs] = useState([])
  const [message, setMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const logsEndRef = useRef(null)
  const dataBufferRef = useRef('') // Buffer to accumulate incoming data

  // Function to add a log entry with timestamp
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      message,
      type // 'sent', 'received', 'info', 'error'
    }
    setLogs((prevLogs) => [...prevLogs, logEntry])
  }

  // Function to clear the data buffer
  const clearBuffer = () => {
    dataBufferRef.current = ''
    addLog('Serial buffer cleared', 'info')
  }

  // Function to send message via serial port
  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      const result = await window.electronAPI.serialSend(message)
      if (result === 'sent') {
        addLog(message, 'sent')
        setMessage('')
      } else {
        addLog(`Failed to send: ${result}`, 'error')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      addLog(`Error sending message: ${error.message}`, 'error')
    }
  }

  // Handle Enter key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  // Auto-scroll to bottom when new logs are added
  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  // Set up serial data listener when component mounts
  useEffect(() => {
    let isListenerActive = true // Flag to prevent processing after cleanup

    // Listen for incoming serial data
    const handleSerialData = (data) => {
      if (!isListenerActive) return // Ignore if listener was cleaned up

      console.log('Received raw serial data:', data) // Debug log

      // Add the incoming data to the buffer
      dataBufferRef.current += data

      // Split by newlines to get complete messages
      const lines = dataBufferRef.current.split('\n')

      // Keep the last incomplete line in the buffer
      dataBufferRef.current = lines.pop() || ''

      // Process each complete line
      lines.forEach((line) => {
        const trimmedLine = line.trim()
        if (trimmedLine) {
          // Only log non-empty lines
          console.log('Processing complete message:', trimmedLine)
          addLog(trimmedLine, 'received')
        }
      })
    }

    // Set up the listener
    if (window.electronAPI && window.electronAPI.onSerialData) {
      console.log('Setting up serial data listener') // Debug log
      window.electronAPI.onSerialData(handleSerialData)
      addLog('Serial data listener established', 'info')
    } else {
      addLog('Failed to establish serial data listener', 'error')
      console.error('electronAPI.onSerialData not available')
    }

    // Add initial connection status log
    addLog('Serial Monitor initialized', 'info')

    // Cleanup function
    return () => {
      console.log('Cleaning up serial data listener') // Debug log
      isListenerActive = false // Deactivate the listener
      // Properly remove the serial data listener
      if (window.electronAPI && window.electronAPI.removeSerialDataListener) {
        window.electronAPI.removeSerialDataListener()
      }
    }
  }, [])

  // Function to get log entry styling based on type
  const getLogStyle = (type) => {
    switch (type) {
      case 'sent':
        return 'text-blue-600 bg-blue-50'
      case 'received':
        return 'text-green-600 bg-green-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      case 'info':
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  // Function to get log prefix based on type
  const getLogPrefix = (type) => {
    switch (type) {
      case 'sent':
        return '→ TX:'
      case 'received':
        return '← RX:'
      case 'error':
        return '⚠ ERR:'
      case 'info':
      default:
        return 'ℹ INFO:'
    }
  }

  return (
    <div className="serial-monitor p-4">
      <div className="logs bg-gray-100 p-4 rounded h-screen overflow-y-auto border border-gray-300">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log.id}
              className={`mb-2 p-2 rounded text-sm font-mono ${getLogStyle(log.type)}`}
            >
              <span className="text-gray-400 mr-2">[{log.timestamp}]</span>
              <span className="font-semibold mr-2">{getLogPrefix(log.type)}</span>
              <span>{log.message}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg">No serial data received yet</p>
            <p className="text-sm">Connect to a device to start monitoring serial communication</p>
          </div>
        )}
        <div ref={logsEndRef} />
      </div>

      <div className="send-message mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here and press Enter or click Send..."
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        <div className="mt-2 flex gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Sent (TX)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Received (RX)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Error</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Info</span>
          </div>
          <button
            onClick={() => addLog('Test received message', 'received')}
            className="ml-4 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-all cursor-pointer"
          >
            Test RX
          </button>
          <button
            onClick={() => setLogs([])}
            className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-all cursor-pointer"
          >
            Clear Logs
          </button>
          <button
            onClick={clearBuffer}
            className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-all cursor-pointer"
          >
            Clear Buffer
          </button>
        </div>
      </div>
    </div>
  )
}
