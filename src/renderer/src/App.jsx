import { useEffect, useState } from 'react'
import GraphView from './components/GraphView'
import PowerConfig from './components/PowerConfig'

function App() {
  const [serialOutput, setSerialOutput] = useState('')
  const [log, setLog] = useState([])

  useEffect(() => {
    window.electronAPI.onSerialData((data) => {
      setLog((prev) => [...prev, data])
      setSerialOutput(data)
    })
  }, [])

  const openSerial = () => {
    window.electronAPI.serialOpen('COM3', 9600).then(console.log)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Power Logger / Power Supply Controller</h1>
      <button onClick={openSerial} className="bg-blue-500 text-white px-4 py-2 rounded">
        Open Serial
      </button>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <GraphView log={log} />
        <PowerConfig sendCommand={window.electronAPI.serialSend} serialOutput={serialOutput} />
      </div>
    </div>
  )
}

export default App
