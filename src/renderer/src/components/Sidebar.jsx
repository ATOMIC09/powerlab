import ReplayIcon from '@mui/icons-material/Replay'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useState, useEffect } from 'react'

export default function Sidebar({ isConnected, setIsConnected, selectedPort, setSelectedPort }) {
  const [comPorts, setComPorts] = useState([])
  const [portsError, setPortsError] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Power supply state
  const [ch1Voltage, setCh1Voltage] = useState(0)
  const [ch1Current, setCh1Current] = useState(0)
  const [ch2Voltage, setCh2Voltage] = useState(0)
  const [ch2Current, setCh2Current] = useState(0)
  const [ch3Voltage, setCh3Voltage] = useState('3.3')

  // Live readings
  const [ch1ActualVoltage, setCh1ActualVoltage] = useState(0)
  const [ch1ActualCurrent, setCh1ActualCurrent] = useState(0)
  const [ch2ActualVoltage, setCh2ActualVoltage] = useState(0)
  const [ch2ActualCurrent, setCh2ActualCurrent] = useState(0)

  // Status states
  const [outputMode, setOutputMode] = useState('independent')
  const [isOutputOn, setIsOutputOn] = useState(false)
  const [deviceStatus, setDeviceStatus] = useState({
    ch1Status: 'OFF',
    ch2Status: 'OFF',
    ch3Status: 'OFF',
    workingMode: 'independent',
    lockState: false
  })

  // Communication state
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const [lastResponseTime, setLastResponseTime] = useState(Date.now())
  const [connectionStatus, setConnectionStatus] = useState('disconnected') // 'connected', 'timeout', 'disconnected'
  const [commandQueue, setCommandQueue] = useState([])
  const [currentCommand, setCurrentCommand] = useState(null)

  // Function to fetch COM ports
  const fetchComPorts = async () => {
    try {
      setPortsError(null)
      const ports = await window.api.getComPorts()
      setComPorts(ports)
      if (ports.length === 0) {
        setPortsError('No COM ports available')
      }
    } catch (error) {
      console.error('Error fetching COM ports:', error)
      setPortsError('Failed to fetch COM ports')
      setComPorts([])
    }
  }

  // Function to handle port connection
  const handleConnect = async () => {
    if (!selectedPort) {
      alert('Please select a COM port first')
      return
    }

    if (isConnected) {
      // Disconnect
      try {
        setIsConnecting(true)
        await window.electronAPI.serialClose()
        setIsConnected(false)
        setConnectionStatus('disconnected')
        setIsWaitingForResponse(false)
        setCurrentCommand(null)
        setCommandQueue([])
      } catch (error) {
        console.error('Error disconnecting:', error)
        alert('Failed to disconnect from port')
      } finally {
        setIsConnecting(false)
      }
    } else {
      // Connect
      try {
        setIsConnecting(true)
        const result = await window.electronAPI.serialOpen(selectedPort, 9600)
        if (result === 'opened') {
          setIsConnected(true)
          setConnectionStatus('connected')
          setLastResponseTime(Date.now())
        } else {
          alert('Failed to connect: ' + result)
        }
      } catch (error) {
        console.error('Error connecting:', error)
        alert('Failed to connect to port')
      } finally {
        setIsConnecting(false)
      }
    }
  }

  // Power supply command functions with response handling
  const sendCommand = async (command, timeout = 5000) => {
    if (!isConnected) {
      console.error('Not connected to power supply')
      return null
    }

    return new Promise((resolve) => {
      // Set waiting state
      setIsWaitingForResponse(true)
      setCurrentCommand(command)

      // Set timeout
      const timeoutId = setTimeout(() => {
        setIsWaitingForResponse(false)
        setCurrentCommand(null)
        setConnectionStatus('timeout')
        console.error(`Command timeout: ${command}`)
        resolve(false)
      }, timeout)

      // Send command
      window.electronAPI
        .serialSend(command)
        .then((result) => {
          if (result === 'sent') {
            console.log(`Command sent: ${command}`)
            // Wait for response - will be handled by serial data listener
            // For now, just set a shorter timeout for query commands
            if (command.startsWith('r')) {
              // Query commands - expect data response
              setTimeout(() => {
                clearTimeout(timeoutId)
                setIsWaitingForResponse(false)
                setCurrentCommand(null)
                setLastResponseTime(Date.now())
                setConnectionStatus('connected')
                resolve(true)
              }, 1000) // Shorter timeout for queries
            } else {
              // Control commands - expect "ok" response
              setTimeout(() => {
                clearTimeout(timeoutId)
                setIsWaitingForResponse(false)
                setCurrentCommand(null)
                setLastResponseTime(Date.now())
                setConnectionStatus('connected')
                resolve(true)
              }, 2000) // Longer timeout for control commands
            }
          } else {
            clearTimeout(timeoutId)
            setIsWaitingForResponse(false)
            setCurrentCommand(null)
            console.error(`Failed to send command: ${result}`)
            resolve(false)
          }
        })
        .catch((error) => {
          clearTimeout(timeoutId)
          setIsWaitingForResponse(false)
          setCurrentCommand(null)
          console.error('Error sending command:', error)
          resolve(false)
        })
    })
  }

  // Queue system for commands
  const addToQueue = (command, type = 'control') => {
    setCommandQueue((prev) => [...prev, { command, type, timestamp: Date.now() }])
  }

  // Process command queue
  const processQueue = async () => {
    if (commandQueue.length === 0 || isWaitingForResponse) return

    const nextCommand = commandQueue[0]
    setCommandQueue((prev) => prev.slice(1))

    await sendCommand(nextCommand.command)
  }

  // Set CH1 voltage (format: suXXXX, e.g., su1200 for 12.00V)
  const setCH1Voltage = async (voltage) => {
    const voltageInt = Math.round(voltage * 100) // Convert to hundredths
    const command = `su${voltageInt.toString().padStart(4, '0')}`
    return await sendCommand(command)
  }

  // Set CH1 current (format: siXXXX, e.g., si2500 for 2.500A)
  const setCH1Current = async (current) => {
    const currentInt = Math.round(current * 1000) // Convert to thousandths
    const command = `si${currentInt.toString().padStart(4, '0')}`
    return await sendCommand(command)
  }

  // Set CH2 voltage (format: saXXXX)
  const setCH2Voltage = async (voltage) => {
    const voltageInt = Math.round(voltage * 100)
    const command = `sa${voltageInt.toString().padStart(4, '0')}`
    return await sendCommand(command)
  }

  // Set CH2 current (format: sdXXXX)
  const setCH2Current = async (current) => {
    const currentInt = Math.round(current * 1000)
    const command = `sd${currentInt.toString().padStart(4, '0')}`
    return await sendCommand(command)
  }

  // Set CH3 voltage
  const setCH3Voltage = async (voltage) => {
    let command = 'O8' // Default to 3.3V
    if (voltage === '2.5') command = 'Oa'
    else if (voltage === '3.3') command = 'O8'
    else if (voltage === '5') command = 'O9'
    return await sendCommand(command)
  }

  // Set output mode
  const setDeviceOutputMode = async (mode) => {
    let command = 'O2' // Independent
    switch (mode) {
      case 'independent':
        command = 'O2'
        break
      case 'parallel':
        command = 'O3'
        break
      case 'series':
        command = 'O4'
        break
      case 'track':
        command = 'O5'
        break
    }
    const success = await sendCommand(command)
    if (success) {
      setOutputMode(mode)
    }
    return success
  }

  // Toggle main output
  const toggleOutput = async () => {
    const command = isOutputOn ? 'O0' : 'O1'
    const success = await sendCommand(command)
    if (success) {
      setIsOutputOn(!isOutputOn)
    }
    return success
  }

  // Serial response handler
  useEffect(() => {
    if (!isConnected) return

    const handleSerialResponse = (data) => {
      const response = data.trim().toLowerCase()

      if (response === 'ok') {
        // Only handle "ok" for set commands (not read commands)
        if (currentCommand && !currentCommand.startsWith('r')) {
          setIsWaitingForResponse(false)
          setCurrentCommand(null)
          setLastResponseTime(Date.now())
          setConnectionStatus('connected')
          console.log('Received OK response for set command')
        }
      } else if (response && currentCommand && currentCommand.startsWith('r')) {
        // This is a query response with data - read commands don't send "ok"
        setIsWaitingForResponse(false)
        setCurrentCommand(null)
        setLastResponseTime(Date.now())
        setConnectionStatus('connected')

        // Parse the response based on the command
        parseQueryResponse(currentCommand, response)
      }
    }

    // Listen for serial data to handle responses
    if (window.electronAPI && window.electronAPI.onSerialData) {
      window.electronAPI.onSerialData(handleSerialResponse)
    }

    return () => {
      if (window.electronAPI && window.electronAPI.removeSerialDataListener) {
        window.electronAPI.removeSerialDataListener()
      }
    }
  }, [isConnected, currentCommand])

  // Parse query responses
  const parseQueryResponse = (command, response) => {
    const value = parseFloat(response)
    if (isNaN(value)) return

    switch (command) {
      case 'rv': // CH1 actual voltage
        setCh1ActualVoltage(value / 100) // Convert from hundredths
        break
      case 'ra': // CH1 actual current
        setCh1ActualCurrent(value / 1000) // Convert from thousandths
        break
      case 'rh': // CH2 actual voltage
        setCh2ActualVoltage(value / 100)
        break
      case 'rj': // CH2 actual current
        setCh2ActualCurrent(value / 1000)
        break
      default:
        console.log(`Unhandled query response: ${command} = ${response}`)
    }
  }

  // Periodic query for live readings with proper queue management
  useEffect(() => {
    if (!isConnected) return

    const queryReadings = async () => {
      // Only query if not already waiting for response
      if (isWaitingForResponse) return

      // Query readings one by one with proper delays
      const queries = [
        'rv', // CH1 actual voltage
        'ra', // CH1 actual current
        'rh', // CH2 actual voltage
        'rj' // CH2 actual current
      ]

      // Send queries sequentially with waits
      for (const query of queries) {
        if (!isWaitingForResponse && isConnected) {
          await sendCommand(query)
          // Wait for response before sending next command
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }
      }
    }

    // Query every 10 seconds to avoid flooding
    const interval = setInterval(() => {
      queryReadings()
    }, 10000)

    return () => clearInterval(interval)
  }, [isConnected, isWaitingForResponse])

  // Fetch COM ports when the component opens
  useEffect(() => {
    fetchComPorts()
  }, [])

  return (
    <div className="sidebar p-4 bg-[#edeff3]">
      {/* Serial Port Connection Section */}
      <div className="serial-connection mb-4 p-3 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-3">Serial Connection</h3>

        {/* Port Selection */}
        <div className="flex gap-2 mb-3">
          <select
            className="flex-1 py-2 px-3 border border-gray-300 rounded"
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            disabled={isConnected}
          >
            {portsError ? (
              <option value="" disabled>
                {portsError}
              </option>
            ) : comPorts.length > 0 ? (
              <>
                <option value="" disabled>
                  Select a port...
                </option>
                {comPorts.map((port) => (
                  <option key={port} value={port}>
                    {port}
                  </option>
                ))}
              </>
            ) : (
              <option value="" disabled>
                Searching for ports...
              </option>
            )}
          </select>
          <button
            className="p-2 text-gray-700 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
            onClick={fetchComPorts}
            title="Refresh ports"
          >
            <ReplayIcon />
          </button>
        </div>

        {/* Connect Button */}
        <button
          className={`w-full p-2 text-white rounded cursor-pointer font-medium transition-all ${
            isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleConnect}
          disabled={isConnecting || (!selectedPort && !isConnected)}
        >
          {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
        </button>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mt-3">
          <div
            className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-green-500'
                : connectionStatus === 'timeout'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            {connectionStatus === 'connected'
              ? `Connected to ${selectedPort}`
              : connectionStatus === 'timeout'
                ? `Connected to ${selectedPort} (No Response)`
                : 'Disconnected'}
            {isWaitingForResponse && connectionStatus === 'connected' && (
              <AutorenewIcon className="ml-2 w-1 h-1 text-blue-600 animate-spin" />
            )}
          </span>
        </div>
      </div>

      {/* Voltage and Current Display Section */}
      <div className="voltage-current-display mb-4">
        {/* CH1 Display */}
        <h4 className="text-2xl font-light">CH1</h4>
        <div className="ch1-display flex items-center justify-between mb-4">
          <div className="items-center gap-4">
            <div>
              <div className="text-5xl font-light text-right">{ch1ActualVoltage.toFixed(2)} V</div>
            </div>
            <div>
              <div className="text-5xl font-light text-right">{ch1ActualCurrent.toFixed(3)} A</div>
            </div>
          </div>
          <div className="status-indicators gap-2 items-center">
            <div className="flex items-center gap-2">
              <div className="status bg-red-500 w-4 h-4 rounded-full"></div>
              <div>C.V</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status bg-green-500 w-4 h-4 rounded-full"></div>
              <div>C.C</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status bg-yellow-500 w-4 h-4 rounded-full"></div>
              <div>OUT</div>
            </div>
          </div>
        </div>
        {/* CH2 Display */}
        <h4 className="text-2xl font-light">CH2</h4>
        <div className="ch2-display flex items-center justify-between mb-4">
          <div className="items-center gap-4">
            <div>
              <div className="text-5xl font-light text-right">{ch2ActualVoltage.toFixed(2)} V</div>
            </div>
            <div>
              <div className="text-5xl font-light text-right">{ch2ActualCurrent.toFixed(3)} A</div>
            </div>
          </div>
          <div className="status-indicators gap-2 items-center">
            <div className="flex items-center gap-2">
              <div className="status bg-red-500 w-4 h-4 rounded-full"></div>
              <div>C.V</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status bg-green-500 w-4 h-4 rounded-full"></div>
              <div>C.C</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status bg-yellow-500 w-4 h-4 rounded-full"></div>
              <div>OUT</div>
            </div>
          </div>
        </div>
        {/* CH3 Display */}
        <h4 className="text-2xl font-light">CH3</h4>
        <div className="ch3-display flex items-center justify-between mb-4">
          <div className="items-center gap-4">
            <div>
              <div className="text-5xl font-light text-right">{ch3Voltage} V</div>
            </div>
          </div>
          <div className="status-indicators gap-2 items-center">
            <div className="flex items-center gap-2">
              <div className="status bg-red-500 w-4 h-4 rounded-full"></div>
              <div>C.V</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status bg-green-500 w-4 h-4 rounded-full"></div>
              <div>C.C</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status bg-yellow-500 w-4 h-4 rounded-full"></div>
              <div>OUT</div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-4" />

      {/* CH1 Section */}
      <div className="ch1 mb-4">
        <h4 className="text-2xl font-light">CH1</h4>
        <div className="flex flex-col gap-2">
          <div>
            <label>Set Voltage:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                max="30"
                value={ch1Voltage}
                onChange={(e) => setCh1Voltage(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter voltage"
                disabled={!isConnected}
              />
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => setCH1Voltage(ch1Voltage)}
                disabled={!isConnected}
              >
                Apply
              </button>
            </div>
          </div>
          <div>
            <label>Set Current:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.001"
                min="0"
                max="5"
                value={ch1Current}
                onChange={(e) => setCh1Current(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter current"
                disabled={!isConnected}
              />
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => setCH1Current(ch1Current)}
                disabled={!isConnected}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CH2 Section */}
      <div className="ch2 mb-4">
        <h4 className="text-2xl font-light">CH2</h4>
        <div className="flex flex-col gap-2">
          <div>
            <label>Set Voltage:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                max="30"
                value={ch2Voltage}
                onChange={(e) => setCh2Voltage(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter voltage"
                disabled={!isConnected}
              />
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => setCH2Voltage(ch2Voltage)}
                disabled={!isConnected}
              >
                Apply
              </button>
            </div>
          </div>
          <div>
            <label>Set Current:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.001"
                min="0"
                max="5"
                value={ch2Current}
                onChange={(e) => setCH2Current(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter current"
                disabled={!isConnected}
              />
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => setCH2Current(ch2Current)}
                disabled={!isConnected}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CH3 Section */}
      <div className="ch3 mb-4">
        <h4 className="text-2xl font-light">CH3</h4>
        <div className="flex flex-col gap-2">
          <div>
            <label>Set Voltage:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={ch3Voltage}
              onChange={(e) => {
                setCh3Voltage(e.target.value)
                setCH3Voltage(e.target.value)
              }}
              disabled={!isConnected}
            >
              <option value="2.5">2.5V</option>
              <option value="3.3">3.3V</option>
              <option value="5">5V</option>
            </select>
          </div>
        </div>
      </div>
      <hr className="my-4" />

      {/* Output Mode Section */}
      <div className="output-mode mb-4">
        <h3>Output Mode</h3>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={outputMode}
          onChange={(e) => {
            setOutputMode(e.target.value)
            setDeviceOutputMode(e.target.value)
          }}
          disabled={!isConnected}
        >
          <option value="independent">Independent Output</option>
          <option value="series">SER Output</option>
          <option value="parallel">PARA Output</option>
          <option value="track">TRACK Output</option>
        </select>
      </div>
      <hr className="my-4" />

      {/* ON/OFF Toggle Button */}
      <div className="toggle-button">
        <button
          className={`w-full p-2 transition-all text-white rounded cursor-pointer font-medium disabled:bg-gray-400 disabled:cursor-not-allowed ${
            isOutputOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={toggleOutput}
          disabled={!isConnected}
        >
          {isOutputOn ? 'Output OFF' : 'Output ON'}
        </button>
      </div>
    </div>
  )
}
