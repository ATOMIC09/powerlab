import { Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import SerialMonitor from './pages/SerialMonitor'

export default function App() {
  const location = useLocation()
  const [isConnected, setIsConnected] = useState(false)
  const [selectedPort, setSelectedPort] = useState('')

  return (
    <>
      <TopBar />
      <div className="app-container flex">
        {location.pathname === '/' && (
          <Sidebar
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            selectedPort={selectedPort}
            setSelectedPort={setSelectedPort}
          />
        )}{' '}
        {/* โคตร Hardcode */}
        <div className="main-content flex-1 p-4 bg-[#d0d8dc]">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1>Data Chart</h1>
                  <div className="chart-placeholder border border-gray-300 rounded p-4">
                    <p>ไว้ก่อน</p>
                  </div>
                </>
              }
            />
            <Route path="/serial-monitor" element={<SerialMonitor />} />
          </Routes>
        </div>
      </div>
    </>
  )
}
