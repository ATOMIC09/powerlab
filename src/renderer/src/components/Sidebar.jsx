export default function Sidebar() {
  return (
    <div className="sidebar p-4">
      {/* Serial COM Port Section */}
      <div className="serial-com-port mb-4">
        <h3>Serial COM Port</h3>
        <div className="flex items-center gap-2">
          <select className="w-full p-2 border border-gray-300 rounded">
            <option value="COM1">COM1</option>
            <option value="COM2">COM2</option>
            <option value="COM3">COM3</option>
          </select>
          <button className="p-2 bg-blue-500 text-white rounded">Connect</button>
        </div>
      </div>
      <hr className="my-4" />

      {/* Voltage and Current Display Section */}
      <div className="voltage-current-display mb-4">
        <h3>Voltage and Current Display</h3>
        {/* CH1 Display */}
        <div className="ch1-display mb-4">
          <h4>CH1</h4>
          <div className="flex items-center gap-4">
            <div>
              <label>Voltage:</label>
              <span className="block p-2 border border-gray-300 rounded">12.0V</span>
            </div>
            <div>
              <label>Current:</label>
              <span className="block p-2 border border-gray-300 rounded">1.5A</span>
            </div>
          </div>
          <div className="status-indicators flex gap-2 items-center">
            <span className="status bg-red-500 w-4 h-4 rounded-full"></span>
            <span>C.V</span>
            <span className="status bg-green-500 w-4 h-4 rounded-full"></span>
            <span>C.C</span>
            <span className="status bg-yellow-500 w-4 h-4 rounded-full"></span>
            <span>OUT</span>
          </div>
        </div>
        {/* CH2 Display */}
        <div className="ch2-display mb-4">
          <h4>CH2</h4>
          <div className="flex items-center gap-4">
            <div>
              <label>Voltage:</label>
              <span className="block p-2 border border-gray-300 rounded">5.0V</span>
            </div>
            <div>
              <label>Current:</label>
              <span className="block p-2 border border-gray-300 rounded">0.8A</span>
            </div>
          </div>
          <div className="status-indicators flex gap-2 items-center">
            <span className="status bg-red-500 w-4 h-4 rounded-full"></span>
            <span>C.V</span>
            <span className="status bg-green-500 w-4 h-4 rounded-full"></span>
            <span>C.C</span>
            <span className="status bg-yellow-500 w-4 h-4 rounded-full"></span>
            <span>OUT</span>
          </div>
        </div>
        {/* CH3 Display */}
        <div className="ch3-display mb-4">
          <h4>CH3</h4>
          <div className="flex items-center gap-4">
            <div>
              <label>Voltage:</label>
              <span className="block p-2 border border-gray-300 rounded">3.3V</span>
            </div>
            <div>
              <label>Current:</label>
              <span className="block p-2 border border-gray-300 rounded">0.5A</span>
            </div>
          </div>
          <div className="status-indicators flex gap-2 items-center">
            <span className="status bg-red-500 w-4 h-4 rounded-full"></span>
            <span>C.V</span>
            <span className="status bg-green-500 w-4 h-4 rounded-full"></span>
            <span>C.C</span>
            <span className="status bg-yellow-500 w-4 h-4 rounded-full"></span>
            <span>OUT</span>
          </div>
        </div>
      </div>
      <hr className="my-4" />

      {/* CH1 Section */}
      <div className="ch1 mb-4">
        <h3>CH1</h3>
        <div className="flex flex-col gap-2">
          <div>
            <label>Set Voltage:</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter voltage"
            />
          </div>
          <div>
            <label>Set Current:</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter current"
            />
          </div>
        </div>
      </div>
      <hr className="my-4" />

      {/* CH2 Section */}
      <div className="ch2 mb-4">
        <h3>CH2</h3>
        <div className="flex flex-col gap-2">
          <div>
            <label>Set Voltage:</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter voltage"
            />
          </div>
          <div>
            <label>Set Current:</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter current"
            />
          </div>
        </div>
      </div>
      <hr className="my-4" />

      {/* CH3 Section */}
      <div className="ch3 mb-4">
        <h3>CH3</h3>
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
        <button className="w-full p-2 bg-green-500 text-white rounded">Toggle ON/OFF</button>
      </div>
    </div>
  );
}
