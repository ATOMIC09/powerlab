import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const OscilloscopeChart = ({ isConnected, deviceState }) => {
  const voltageChartRef = useRef(null)
  const currentChartRef = useRef(null)

  // Voltage chart data
  const [voltageChartData, setVoltageChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'CH1 Voltage (V)',
        data: [],
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 3
      },
      {
        label: 'CH2 Voltage (V)',
        data: [],
        borderColor: 'rgb(239, 68, 68)', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 3
      }
    ]
  })

  // Current chart data
  const [currentChartData, setCurrentChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'CH1 Current (A)',
        data: [],
        borderColor: 'rgb(16, 185, 129)', // emerald-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 3
      },
      {
        label: 'CH2 Current (A)',
        data: [],
        borderColor: 'rgb(245, 158, 11)', // amber-500
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 3
      }
    ]
  })

  const [timeWindow, setTimeWindow] = useState(60) // seconds
  const [maxDataPoints, setMaxDataPoints] = useState(240) // ~4 data points per second for 60s
  const [isPaused, setIsPaused] = useState(false)
  const [startTime] = useState(Date.now()) // Reference time for left-to-right movement

  // Parameter selection states
  const [selectedParams, setSelectedParams] = useState({
    showVoltage: true,
    showCurrent: true
  })

  const voltageChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animation for better performance
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Voltage Monitor',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            return `${label}: ${value.toFixed(2)} V`
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Time (seconds)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)'
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(0) + 's'
          },
          maxTicksLimit: 10
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Voltage (V)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)'
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(1) + 'V'
          }
        }
      }
    }
  }

  const currentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animation for better performance
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Current Monitor',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            return `${label}: ${value.toFixed(3)} A`
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Time (seconds)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)'
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(0) + 's'
          },
          maxTicksLimit: 10
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Current (A)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)'
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(3) + 'A'
          }
        }
      }
    }
  }

  // Update chart data when device state changes
  useEffect(() => {
    if (!isConnected || isPaused || !deviceState) return

    const now = Date.now()
    const timeElapsed = (now - startTime) / 1000 // Time in seconds from start

    // Update voltage chart data
    if (selectedParams.showVoltage) {
      setVoltageChartData((prevData) => {
        const newData = { ...prevData }

        // Add new voltage data points
        newData.datasets[0].data.push({
          x: timeElapsed,
          y: deviceState.ch1MeasureVoltage || 0
        })
        newData.datasets[1].data.push({
          x: timeElapsed,
          y: deviceState.ch2MeasureVoltage || 0
        })

        // Remove old data points to maintain window size
        newData.datasets.forEach((dataset) => {
          if (dataset.data.length > maxDataPoints) {
            dataset.data.shift()
          }
        })

        return newData
      })

      // Update voltage chart x-axis range
      if (voltageChartRef.current) {
        const chart = voltageChartRef.current
        const minTime = Math.max(0, timeElapsed - timeWindow)
        const maxTime = timeElapsed
        chart.options.scales.x.min = minTime
        chart.options.scales.x.max = maxTime
      }
    }

    // Update current chart data
    if (selectedParams.showCurrent) {
      setCurrentChartData((prevData) => {
        const newData = { ...prevData }

        // Add new current data points
        newData.datasets[0].data.push({
          x: timeElapsed,
          y: deviceState.ch1MeasureCurrent || 0
        })
        newData.datasets[1].data.push({
          x: timeElapsed,
          y: deviceState.ch2MeasureCurrent || 0
        })

        // Remove old data points to maintain window size
        newData.datasets.forEach((dataset) => {
          if (dataset.data.length > maxDataPoints) {
            dataset.data.shift()
          }
        })

        return newData
      })

      // Update current chart x-axis range
      if (currentChartRef.current) {
        const chart = currentChartRef.current
        const minTime = Math.max(0, timeElapsed - timeWindow)
        const maxTime = timeElapsed
        chart.options.scales.x.min = minTime
        chart.options.scales.x.max = maxTime
      }
    }
  }, [deviceState, isConnected, isPaused, timeWindow, maxDataPoints, selectedParams, startTime])

  // Handle parameter selection change
  const handleParameterChange = (param, checked) => {
    setSelectedParams((prev) => ({
      ...prev,
      [param]: checked
    }))
  }

  // Clear chart data
  const clearChart = () => {
    setVoltageChartData((prevData) => {
      const newData = { ...prevData }
      newData.datasets.forEach((dataset) => {
        dataset.data = []
      })
      return newData
    })
    setCurrentChartData((prevData) => {
      const newData = { ...prevData }
      newData.datasets.forEach((dataset) => {
        dataset.data = []
      })
      return newData
    })
  }

  // Handle time window change
  const handleTimeWindowChange = (newWindow) => {
    setTimeWindow(newWindow)
    setMaxDataPoints(newWindow * 4) // Approximately 4 data points per second
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
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isPaused
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={clearChart}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
          >
            Clear
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

      <div className="charts-container space-y-4">
        {selectedParams.showVoltage && (
          <div className="voltage-chart-container" style={{ height: '400px' }}>
            <Line ref={voltageChartRef} data={voltageChartData} options={voltageChartOptions} />
          </div>
        )}

        {selectedParams.showCurrent && (
          <div className="current-chart-container" style={{ height: '400px' }}>
            <Line ref={currentChartRef} data={currentChartData} options={currentChartOptions} />
          </div>
        )}

        {!selectedParams.showVoltage && !selectedParams.showCurrent && (
          <div className="no-charts-message flex items-center justify-center h-64 text-gray-500">
            <p>Select at least one chart to display data</p>
          </div>
        )}
      </div>

      <div className="legend-details mt-4 grid grid-cols-2 gap-4 text-sm">
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
      </div>
    </div>
  )
}

OscilloscopeChart.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  deviceState: PropTypes.shape({
    ch1MeasureVoltage: PropTypes.number,
    ch2MeasureVoltage: PropTypes.number,
    ch1MeasureCurrent: PropTypes.number,
    ch2MeasureCurrent: PropTypes.number
  })
}

export default OscilloscopeChart
