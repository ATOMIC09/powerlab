import { useState } from 'react';

function PowerConfig({ sendCommand, serialOutput }) {
  const [voltage, setVoltage] = useState('1200');
  const [current, setCurrent] = useState('2500');

  const setVoltageClick = () => sendCommand(`su${voltage}`);
  const setCurrentClick = () => sendCommand(`si${current}`);
  const turnOn = () => sendCommand('O1');
  const turnOff = () => sendCommand('O0');
  const readVoltage = () => sendCommand('rv');
  const readCurrent = () => sendCommand('ra');

  return (
    <div className="border p-2">
      <h2 className="text-lg font-semibold">Power Supply Control (CH1)</h2>
      <div className="space-y-2">
        <div>
          <input className="border mr-2 p-1 w-24" value={voltage} onChange={(e) => setVoltage(e.target.value)} />
          <button onClick={setVoltageClick} className="bg-green-500 text-white px-2">Set Voltage</button>
        </div>
        <div>
          <input className="border mr-2 p-1 w-24" value={current} onChange={(e) => setCurrent(e.target.value)} />
          <button onClick={setCurrentClick} className="bg-green-500 text-white px-2">Set Current</button>
        </div>
        <button onClick={turnOn} className="bg-blue-500 text-white px-2">Output ON</button>
        <button onClick={turnOff} className="bg-gray-500 text-white px-2 ml-2">Output OFF</button>
        <button onClick={readVoltage} className="bg-yellow-500 text-white px-2 ml-2">Read Voltage</button>
        <button onClick={readCurrent} className="bg-yellow-500 text-white px-2 ml-2">Read Current</button>
        <pre className="bg-black text-white p-2 text-xs mt-2">{serialOutput}</pre>
      </div>
    </div>
  );
}

export default PowerConfig;
