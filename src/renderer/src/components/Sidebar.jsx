import ReplayIcon from '@mui/icons-material/Replay'
import { useState, useEffect } from 'react'

export default function Sidebar({ isConnected, setIsConnected, selectedPort, setSelectedPort }) {
  const [comPorts, setComPorts] = useState([])
  const [portsError, setPortsError] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const [ch1MeasureVoltage, setCh1MeasureVoltage] = useState(null)
  const [ch1MeasureCurrent, setCh1MeasureCurrent] = useState(null)
  const [ch2MeasureVoltage, setCh2MeasureVoltage] = useState(null)
  const [ch2MeasureCurrent, setCh2MeasureCurrent] = useState(null)
  const [ch1PresetVoltage, setCh1PresetVoltage] = useState(null)
  const [ch1PresetCurrent, setCh1PresetCurrent] = useState(null)
  const [ch2PresetVoltage, setCh2PresetVoltage] = useState(null)
  const [ch2PresetCurrent, setCh2PresetCurrent] = useState(null)

  // Input field values for setting presets
  const [ch1VoltageInput, setCh1VoltageInput] = useState('')
  const [ch1CurrentInput, setCh1CurrentInput] = useState('')
  const [ch2VoltageInput, setCh2VoltageInput] = useState('')
  const [ch2CurrentInput, setCh2CurrentInput] = useState('')

  const [workingMode, setWorkingMode] = useState('0000') // 0000: Independent, 0017: SER, 0001: PARA, 0016: TRACK
  const [lockState, setLockState] = useState('0000') // 0000: Unlocked, 0001: Locked
  const [ch1State, setCh1State] = useState('0000') // 0000: OFF, 0001: ON C.V, 0016: ON C.C
  const [ch2State, setCh2State] = useState('0000') // 0000: OFF, 0001: ON C.V, 0016: ON C.C
  const [ch3State, setCh3State] = useState('0000') // 0000: OFF, 0001: ON C.V, 0016: ON C.C

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

  // Fetch COM ports when the component opens
  useEffect(() => {
    fetchComPorts()
  }, [])

  // Read measure, preset values, channelState, and working mode every second if connected
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isConnected) {
        try {
          // Read parameter
          const result = await window.electronAPI.serialReadAllValues()
          if (result) {
            setCh1MeasureVoltage(result.ch1Voltage)
            setCh1MeasureCurrent(result.ch1Current)
            setCh2MeasureVoltage(result.ch2Voltage)
            setCh2MeasureCurrent(result.ch2Current)
            setCh1PresetVoltage(result.ch1PresetVoltage)
            setCh1PresetCurrent(result.ch1PresetCurrent)
            setCh2PresetVoltage(result.ch2PresetVoltage)
            setCh2PresetCurrent(result.ch2PresetCurrent)
            setWorkingMode(result.workingMode)
            setLockState(result.lockState)
            setCh1State(result.ch1State)
            setCh2State(result.ch2State)
            setCh3State(result.ch3State)
          }
        } catch (error) {
          console.error('Error reading CH1 voltage:', error)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isConnected])

  // Update input fields when preset values change
  useEffect(() => {
    if (ch1PresetVoltage !== null) {
      setCh1VoltageInput(ch1PresetVoltage.toFixed(2))
    }
    if (ch1PresetCurrent !== null) {
      setCh1CurrentInput(ch1PresetCurrent.toFixed(3))
    }
    if (ch2PresetVoltage !== null) {
      setCh2VoltageInput(ch2PresetVoltage.toFixed(2))
    }
    if (ch2PresetCurrent !== null) {
      setCh2CurrentInput(ch2PresetCurrent.toFixed(3))
    }
  }, [ch1PresetVoltage, ch1PresetCurrent, ch2PresetVoltage, ch2PresetCurrent])

  // Functions to handle setting preset values
  const handleSetCh1Voltage = async () => {
    const voltage = parseFloat(ch1VoltageInput)
    if (isNaN(voltage) || voltage < 0) {
      alert('Please enter a valid voltage value')
      return
    }

    try {
      // Convert to the format expected by the device (multiply by 100)
      const voltageValue = Math.round(voltage * 100)
      const command = `su${voltageValue.toString().padStart(4, '0')}`
      await window.electronAPI.serialSendCommand(command)
      console.log(`Set CH1 voltage to ${voltage}V (command: ${command})`)
    } catch (error) {
      console.error('Error setting CH1 voltage:', error)
      alert('Failed to set CH1 voltage')
    }
  }

  const handleSetCh1Current = async () => {
    const current = parseFloat(ch1CurrentInput)
    if (isNaN(current) || current < 0) {
      alert('Please enter a valid current value')
      return
    }

    try {
      // Convert to the format expected by the device (multiply by 1000)
      const currentValue = Math.round(current * 1000)
      const command = `si${currentValue.toString().padStart(4, '0')}`
      await window.electronAPI.serialSendCommand(command)
      console.log(`Set CH1 current to ${current}A (command: ${command})`)
    } catch (error) {
      console.error('Error setting CH1 current:', error)
      alert('Failed to set CH1 current')
    }
  }

  const handleSetCh2Voltage = async () => {
    const voltage = parseFloat(ch2VoltageInput)
    if (isNaN(voltage) || voltage < 0) {
      alert('Please enter a valid voltage value')
      return
    }

    try {
      // Convert to the format expected by the device (multiply by 100)
      const voltageValue = Math.round(voltage * 100)
      const command = `sa${voltageValue.toString().padStart(4, '0')}`
      await window.electronAPI.serialSendCommand(command)
      console.log(`Set CH2 voltage to ${voltage}V (command: ${command})`)
    } catch (error) {
      console.error('Error setting CH2 voltage:', error)
      alert('Failed to set CH2 voltage')
    }
  }

  const handleSetCh2Current = async () => {
    const current = parseFloat(ch2CurrentInput)
    if (isNaN(current) || current < 0) {
      alert('Please enter a valid current value')
      return
    }

    try {
      // Convert to the format expected by the device (multiply by 1000)
      const currentValue = Math.round(current * 1000)
      const command = `sd${currentValue.toString().padStart(4, '0')}`
      await window.electronAPI.serialSendCommand(command)
      console.log(`Set CH2 current to ${current}A (command: ${command})`)
    } catch (error) {
      console.error('Error setting CH2 current:', error)
      alert('Failed to set CH2 current')
    }
  }

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
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          ></div>
          <span className="text-sm text-gray-600">
            {isConnected ? `Connected to ${selectedPort}` : 'Disconnected'}
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
              <div className="text-5xl font-light text-right">
                {ch1MeasureVoltage !== null ? `${ch1MeasureVoltage.toFixed(2)} V` : '---.-- V'}
              </div>
            </div>
            <div>
              <div className="text-5xl font-light text-right">
                {ch1MeasureCurrent !== null ? `${ch1MeasureCurrent.toFixed(3)} A` : '--.--- A'}
              </div>
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
              <div className="text-5xl font-light text-right">
                {ch2MeasureVoltage !== null ? `${ch2MeasureVoltage.toFixed(2)} V` : '---.-- V'}
              </div>
            </div>
            <div>
              <div className="text-5xl font-light text-right">
                {ch2MeasureCurrent !== null ? `${ch2MeasureCurrent.toFixed(3)} A` : '--.--- A'}
              </div>
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
              <div className="text-5xl font-light text-right">3.3 V</div>
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
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter voltage"
                value={ch1VoltageInput}
                onChange={(e) => setCh1VoltageInput(e.target.value)}
                disabled={!isConnected}
                step="0.01"
                min="0"
              />
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSetCh1Voltage}
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
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter current"
                value={ch1CurrentInput}
                onChange={(e) => setCh1CurrentInput(e.target.value)}
                disabled={!isConnected}
                step="0.001"
                min="0"
              />
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSetCh1Current}
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
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter voltage"
                value={ch2VoltageInput}
                onChange={(e) => setCh2VoltageInput(e.target.value)}
                disabled={!isConnected}
                step="0.01"
                min="0"
              />
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSetCh2Voltage}
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
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter current"
                value={ch2CurrentInput}
                onChange={(e) => setCh2CurrentInput(e.target.value)}
                disabled={!isConnected}
                step="0.001"
                min="0"
              />
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSetCh2Current}
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
            <select className="w-full p-2 border border-gray-300 rounded">
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
        <select className="w-full p-2 border border-gray-300 rounded">
          <option value="independent">Independent Output</option>
          <option value="ser">SER Output</option>
          <option value="para">PARA Output</option>
          <option value="track">TRACK Output</option>
        </select>
      </div>
      <hr className="my-4" />

      {/* ON/OFF Toggle Button */}
      <div className="toggle-button">
        <button className="w-full p-2 bg-green-500 hover:bg-green-600 transition-all text-white rounded cursor-pointer">
          Output ON/OFF
        </button>
      </div>
    </div>
  )
}
