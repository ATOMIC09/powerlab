import { Link, useLocation } from 'react-router-dom'
import ReplayIcon from '@mui/icons-material/Replay'
import { useState, useEffect } from 'react'

export default function TopBar() {
  const location = useLocation()
  const [comPorts, setComPorts] = useState([])
  const [portsError, setPortsError] = useState(null)

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

  // Fetch COM ports when the app opens
  useEffect(() => {
    fetchComPorts()
  }, [])

  return (
    <div className="top-bar flex items-center m-2">
      <div className="flex gap-2">
        <select className="w-full py-2 px-10 border border-gray-300 rounded">
          {portsError ? (
            <option value="" disabled>
              {portsError}
            </option>
          ) : comPorts.length > 0 ? (
            comPorts.map((port) => (
              <option key={port} value={port}>
                {port}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Searching for ports...
            </option>
          )}
        </select>
        <button className="p-2 text-gray-700 rounded cursor-pointer" onClick={fetchComPorts}>
          <ReplayIcon />
        </button>
        <button className="p-2 bg-blue-500 text-white rounded cursor-pointer">Connect</button>
        <div className="flex items-center gap-2 bg-gray-400 px-[1px] rounded-2xl"></div>

        {/* Menu bar */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`whitespace-nowrap text-xl ${
              location.pathname === '/' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            POWER LOGGER
          </Link>
          <Link
            to="/serial-monitor"
            className={`whitespace-nowrap text-xl ${
              location.pathname === '/serial-monitor' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            SERIAL MONITOR
          </Link>
        </div>
      </div>
    </div>
  )
}
