import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import OscilloscopeChart from './components/OscilloscopeChart'
import SerialMonitor from './pages/SerialMonitor'

export default function App() {
  const location = useLocation()
  const [isConnected, setIsConnected] = useState(false)
  const [selectedPort, setSelectedPort] = useState('')
  const [deviceState, setDeviceStateInternal] = useState({
    ch1MeasureVoltage: null,
    ch1MeasureCurrent: null,
    ch2MeasureVoltage: null,
    ch2MeasureCurrent: null,
    ch1PresetVoltage: null,
    ch1PresetCurrent: null,
    ch2PresetVoltage: null,
    ch2PresetCurrent: null,
    workingMode: '0000',
    ch1State: '0000',
    ch2State: '0000'
  })

  const setDeviceState = useCallback((newState) => {
    setDeviceStateInternal(newState)
  }, [])

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
            deviceState={deviceState}
            setDeviceState={setDeviceState}
          />
        )}{' '}
        {/* โคตร Hardcode */}
        <div className="main-content flex-1 p-4 bg-[#d0d8dc]">
          <Routes>
            <Route
              path="/"
              element={<OscilloscopeChart isConnected={isConnected} deviceState={deviceState} />}
            />
            <Route path="/serial-monitor" element={<SerialMonitor />} />
          </Routes>
        </div>
      </div>
    </>
  )
}
