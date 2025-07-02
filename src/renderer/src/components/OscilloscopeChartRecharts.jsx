import { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const OscilloscopeChartRecharts = ({ isConnected, deviceState }) => {
  const [timeWindow, setTimeWindow] = useState(10) // seconds
  const [maxDataPoints, setMaxDataPoints] = useState(40) // ~4 data points per second for 60s
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState(Date.now()) // Reference time for left-to-right movement

  // Parameter selection states
  const [selectedParams, setSelectedParams] = useState({
    showVoltage: true,
    showCurrent: true,
    showCH1: true,
    showCH2: true
  })

  // Chart data - single array with all measurements
  const [chartData, setChartData] = useState([])

  // Statistics data
  const [statistics, setStatistics] = useState({
    ch1Voltage: { avg: 0, min: 0, max: 0, rms: 0, count: 0 },
    ch2Voltage: { avg: 0, min: 0, max: 0, rms: 0, count: 0 },
    ch1Current: { avg: 0, min: 0, max: 0, rms: 0, count: 0 },
    ch2Current: { avg: 0, min: 0, max: 0, rms: 0, count: 0 }
  })

  // Calculate statistics for a dataset
  const calculateStatistics = useCallback((data, key) => {
    if (!data || data.length === 0) {
      return { avg: 0, min: 0, max: 0, rms: 0, count: 0 }
    }

    const values = data
      .map((point) => point[key])
      .filter((val) => val !== undefined && val !== null)
    if (values.length === 0) {
      return { avg: 0, min: 0, max: 0, rms: 0, count: 0 }
    }

    const count = values.length
    const sum = values.reduce((acc, val) => acc + val, 0)
    const avg = sum / count
    const min = Math.min(...values)
    const max = Math.max(...values)
    const sumSquares = values.reduce((acc, val) => acc + val * val, 0)
    const rms = Math.sqrt(sumSquares / count)

    return { avg, min, max, rms, count }
  }, [])

  // Update chart data when device state changes
  useEffect(() => {
    if (!isConnected || isPaused || !deviceState) return

    const now = Date.now()
    const timeElapsed = (now - startTime) / 1000 // Time in seconds from start

    setChartData((prevData) => {
      const newData = [...prevData]

      // Add new data point
      const newPoint = {
        time: timeElapsed,
        ch1Voltage: deviceState.ch1MeasureVoltage || 0,
        ch2Voltage: deviceState.ch2MeasureVoltage || 0,
        ch1Current: deviceState.ch1MeasureCurrent || 0,
        ch2Current: deviceState.ch2MeasureCurrent || 0,
        ch1State: deviceState.ch1State || '0000',
        ch2State: deviceState.ch2State || '0000'
      }

      newData.push(newPoint)

      // Remove old data points to maintain window size
      while (newData.length > maxDataPoints) {
        newData.shift()
      }

      // Update statistics
      setStatistics({
        ch1Voltage: calculateStatistics(newData, 'ch1Voltage'),
        ch2Voltage: calculateStatistics(newData, 'ch2Voltage'),
        ch1Current: calculateStatistics(newData, 'ch1Current'),
        ch2Current: calculateStatistics(newData, 'ch2Current')
      })

      return newData
    })
  }, [deviceState, isConnected, isPaused, maxDataPoints, startTime, calculateStatistics])

  // Handle parameter selection change
  const handleParameterChange = (param, checked) => {
    setSelectedParams((prev) => ({
      ...prev,
      [param]: checked
    }))
  }

  // Clear chart data
  const clearChart = () => {
    setChartData([])
    setStartTime(Date.now()) // Reset start time to current time
    // Reset statistics
    setStatistics({
      ch1Voltage: { avg: 0, min: 0, max: 0, rms: 0, count: 0 },
      ch2Voltage: { avg: 0, min: 0, max: 0, rms: 0, count: 0 },
      ch1Current: { avg: 0, min: 0, max: 0, rms: 0, count: 0 },
      ch2Current: { avg: 0, min: 0, max: 0, rms: 0, count: 0 }
    })
  }

  // Handle time window change
  const handleTimeWindowChange = (newWindow) => {
    setTimeWindow(newWindow)
    setMaxDataPoints(newWindow * 4) // Approximately 4 data points per second
  }

  // Helper function to decode channel state to C.C/C.V status
  const getChannelStatus = (stateCode) => {
    // Assuming state code format where specific bits indicate C.C or C.V mode
    // You may need to adjust this based on your device's actual state encoding
    if (!stateCode || stateCode === '0000') return 'OFF'
    // Common patterns for power supply states:
    // This is a placeholder - adjust based on your device's actual state encoding
    const state = parseInt(stateCode, 16)
    if (state & 0x01) return 'C.V' // Constant Voltage mode
    if (state & 0x02) return 'C.C' // Constant Current mode
    return 'ON' // Some other active state
  }

  // Export data to CSV
  const exportToCSV = () => {
    if (chartData.length === 0) {
      alert('No data to export. Please record some measurements first.')
      return
    }

    // Create CSV header
    const headers = ['Time (s)']
    if (selectedParams.showCH1) {
      headers.push('CH1 Voltage (V)', 'CH1 Current (A)', 'CH1 Status')
    }
    if (selectedParams.showCH2) {
      headers.push('CH2 Voltage (V)', 'CH2 Current (A)', 'CH2 Status')
    }

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...chartData.map((point) => {
        const row = [point.time.toFixed(3)]
        if (selectedParams.showCH1) {
          row.push(
            point.ch1Voltage.toFixed(3),
            point.ch1Current.toFixed(6),
            getChannelStatus(point.ch1State)
          )
        }
        if (selectedParams.showCH2) {
          row.push(
            point.ch2Voltage.toFixed(3),
            point.ch2Current.toFixed(6),
            getChannelStatus(point.ch2State)
          )
        }
        return row.join(',')
      })
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)

    // Generate filename with timestamp
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `power-measurement-${timestamp}.csv`

    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium">{`Time: ${label?.toFixed(1)}s`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value?.toFixed(entry.name.includes('Current') ? 4 : 3)} ${
                entry.name.includes('Current') ? 'A' : 'V'
              }`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // PropTypes for CustomTooltip
  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.number
      })
    ),
    label: PropTypes.number
  }

  // Calculate domain for time axis (left-to-right scrolling with fixed window)
  const getTimeDomain = () => {
    if (chartData.length === 0) return [0, timeWindow]
    const latestTime = chartData[chartData.length - 1]?.time || 0
    const minTime = Math.max(0, latestTime - timeWindow)
    return [minTime, minTime + timeWindow] // Fixed window size
  }

  return (
    <div className="oscilloscope-chart bg-white rounded-lg shadow-lg p-4">
      <div className="controls mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Time Window:</label>
          <select
            value={timeWindow}
            onChange={(e) => handleTimeWindowChange(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
            <option value={600}>10 minutes</option>
            <option value={1800}>30 minutes</option>
            <option value={3600}>1 hour</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Charts:</label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedParams.showVoltage}
              onChange={(e) => handleParameterChange('showVoltage', e.target.checked)}
              className="rounded"
            />
            <span className="flex items-center gap-1">Show Voltage Chart</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedParams.showCurrent}
              onChange={(e) => handleParameterChange('showCurrent', e.target.checked)}
              className="rounded"
            />
            <span className="flex items-center gap-1">Show Current Chart</span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Channels:</label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedParams.showCH1}
              onChange={(e) => handleParameterChange('showCH1', e.target.checked)}
              className="rounded"
            />
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
              CH1
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedParams.showCH2}
              onChange={(e) => handleParameterChange('showCH2', e.target.checked)}
              className="rounded"
            />
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
              CH2
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1 rounded text-sm font-medium cursor-pointer transition-all  ${
              isPaused
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={clearChart}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium cursor-pointer transition-all"
          >
            Clear
          </button>
          <button
            onClick={exportToCSV}
            className={`px-3 py-1 rounded text-sm font-medium cursor-pointer transition-all ${
              chartData.length === 0
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={chartData.length === 0}
            title={
              chartData.length === 0 ? 'No data to export' : 'Export current chart data to CSV'
            }
          >
            Export CSV
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected && !isPaused ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm text-gray-600">
            {isConnected ? (isPaused ? 'Paused' : 'Recording') : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="charts-container space-y-6">
        {selectedParams.showVoltage && (
          <div className="voltage-chart-container">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Voltage Monitor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="time"
                  type="number"
                  scale="linear"
                  domain={getTimeDomain()}
                  tickFormatter={(value) => `${value.toFixed(0)}s`}
                  stroke="#666"
                />
                <YAxis stroke="#666" tickFormatter={(value) => `${value.toFixed(1)}V`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedParams.showCH1 && (
                  <Line
                    type="monotone"
                    dataKey="ch1Voltage"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="CH1 Voltage"
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                )}
                {selectedParams.showCH2 && (
                  <Line
                    type="monotone"
                    dataKey="ch2Voltage"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="CH2 Voltage"
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedParams.showCurrent && (
          <div className="current-chart-container">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Current Monitor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="time"
                  type="number"
                  scale="linear"
                  domain={getTimeDomain()}
                  tickFormatter={(value) => `${value.toFixed(0)}s`}
                  stroke="#666"
                />
                <YAxis stroke="#666" tickFormatter={(value) => `${value.toFixed(3)}A`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedParams.showCH1 && (
                  <Line
                    type="monotone"
                    dataKey="ch1Current"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="CH1 Current"
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                )}
                {selectedParams.showCH2 && (
                  <Line
                    type="monotone"
                    dataKey="ch2Current"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="CH2 Current"
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {(!selectedParams.showVoltage && !selectedParams.showCurrent) ||
        (!selectedParams.showCH1 && !selectedParams.showCH2) ? (
          <div className="no-charts-message flex items-center justify-center h-64 text-gray-500">
            <p>
              {!selectedParams.showVoltage && !selectedParams.showCurrent
                ? 'Select at least one chart to display data'
                : 'Select at least one channel to display data'}
            </p>
          </div>
        ) : null}
      </div>

      <div className="legend-details mt-4 grid grid-cols-2 gap-4 text-sm">
        {selectedParams.showCH1 && (
          <div className="ch1-info">
            <h4 className="font-semibold text-gray-700 mb-2">Channel 1</h4>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Voltage: {deviceState?.ch1MeasureVoltage?.toFixed(2) || '---.--'} V</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span>Current: {deviceState?.ch1MeasureCurrent?.toFixed(3) || '--.---'} A</span>
            </div>
          </div>
        )}
        {selectedParams.showCH2 && (
          <div className="ch2-info">
            <h4 className="font-semibold text-gray-700 mb-2">Channel 2</h4>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Voltage: {deviceState?.ch2MeasureVoltage?.toFixed(2) || '---.--'} V</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span>Current: {deviceState?.ch2MeasureCurrent?.toFixed(3) || '--.---'} A</span>
            </div>
          </div>
        )}
      </div>

      <div className="statistics-section mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voltage Statistics */}
          <div className="voltage-stats bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              Voltage Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {selectedParams.showCH1 && (
                <div className="ch1-voltage-stats">
                  <h5 className="font-medium text-blue-600 mb-2">Channel 1</h5>
                  <div className="space-y-1">
                    <div>Avg: {statistics.ch1Voltage.avg.toFixed(3)} V</div>
                    <div>Min: {statistics.ch1Voltage.min.toFixed(3)} V</div>
                    <div>Max: {statistics.ch1Voltage.max.toFixed(3)} V</div>
                    <div>RMS: {statistics.ch1Voltage.rms.toFixed(3)} V</div>
                    <div>Points: {statistics.ch1Voltage.count}</div>
                  </div>
                </div>
              )}
              {selectedParams.showCH2 && (
                <div className="ch2-voltage-stats">
                  <h5 className="font-medium text-red-600 mb-2">Channel 2</h5>
                  <div className="space-y-1">
                    <div>Avg: {statistics.ch2Voltage.avg.toFixed(3)} V</div>
                    <div>Min: {statistics.ch2Voltage.min.toFixed(3)} V</div>
                    <div>Max: {statistics.ch2Voltage.max.toFixed(3)} V</div>
                    <div>RMS: {statistics.ch2Voltage.rms.toFixed(3)} V</div>
                    <div>Points: {statistics.ch2Voltage.count}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Current Statistics */}
          <div className="current-stats bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded"></div>
              Current Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {selectedParams.showCH1 && (
                <div className="ch1-current-stats">
                  <h5 className="font-medium text-emerald-600 mb-2">Channel 1</h5>
                  <div className="space-y-1">
                    <div>Avg: {statistics.ch1Current.avg.toFixed(4)} A</div>
                    <div>Min: {statistics.ch1Current.min.toFixed(4)} A</div>
                    <div>Max: {statistics.ch1Current.max.toFixed(4)} A</div>
                    <div>RMS: {statistics.ch1Current.rms.toFixed(4)} A</div>
                    <div>Points: {statistics.ch1Current.count}</div>
                  </div>
                </div>
              )}
              {selectedParams.showCH2 && (
                <div className="ch2-current-stats">
                  <h5 className="font-medium text-amber-600 mb-2">Channel 2</h5>
                  <div className="space-y-1">
                    <div>Avg: {statistics.ch2Current.avg.toFixed(4)} A</div>
                    <div>Min: {statistics.ch2Current.min.toFixed(4)} A</div>
                    <div>Max: {statistics.ch2Current.max.toFixed(4)} A</div>
                    <div>RMS: {statistics.ch2Current.rms.toFixed(4)} A</div>
                    <div>Points: {statistics.ch2Current.count}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

OscilloscopeChartRecharts.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  deviceState: PropTypes.shape({
    ch1MeasureVoltage: PropTypes.number,
    ch2MeasureVoltage: PropTypes.number,
    ch1MeasureCurrent: PropTypes.number,
    ch2MeasureCurrent: PropTypes.number,
    ch1State: PropTypes.string,
    ch2State: PropTypes.string
  })
}

export default OscilloscopeChartRecharts
