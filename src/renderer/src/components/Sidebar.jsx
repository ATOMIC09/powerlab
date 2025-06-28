import ReplayIcon from '@mui/icons-material/Replay'
import { useState, useEffect } from 'react'

export default function Sidebar({ isConnected, setIsConnected, selectedPort, setSelectedPort }) {
  const [comPorts, setComPorts] = useState([])
  const [portsError, setPortsError] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

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
          className={`w-full p-2 text-white rounded cursor-pointer font-medium ${
            isConnected 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleConnect}
          disabled={isConnecting || (!selectedPort && !isConnected)}
        >
          {isConnecting 
            ? 'Connecting...' 
            : isConnected 
              ? 'Disconnect' 
              : 'Connect'
          }
        </button>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mt-3">
          <div 
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
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
              <div className="text-5xl font-light text-right">12.00 V</div>
            </div>
            <div>
              <div className="text-5xl font-light text-right">1.500 A</div>
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
              <div className="text-5xl font-light text-right">05.00 V</div>
            </div>
            <div>
              <div className="text-5xl font-light text-right">0.800 A</div>
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
              />
              <button className="p-2 bg-blue-500 text-white rounded cursor-pointer">Apply</button>
            </div>
          </div>
          <div>
            <label>Set Current:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter current"
              />
              <button className="p-2 bg-blue-500 text-white rounded cursor-pointer">Apply</button>
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
              />
              <button className="p-2 bg-blue-500 text-white rounded cursor-pointer">Apply</button>
            </div>
          </div>
          <div>
            <label>Set Current:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter current"
              />
              <button className="p-2 bg-blue-500 text-white rounded cursor-pointer">Apply</button>
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
        <button className="w-full p-2 bg-green-500 text-white rounded cursor-pointer">Output ON/OFF</button>
      </div>
    </div>
  );
}
