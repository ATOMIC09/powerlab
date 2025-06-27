import React, { useState } from 'react';

function PowerConfig() {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [outputMode, setOutputMode] = useState('');
  const [ch3Voltage, setCh3Voltage] = useState('');
  const [error, setError] = useState(null);

  const sendCommand = async (cmd) => {
    try {
      const result = await window.electronAPI.sendSerial(cmd);
      console.log(result);
    } catch (err) {
      setError(`Failed to send command: ${err.message}`);
    }
  };

  const handleSetVoltage = () => sendCommand(`su${Math.round(parseFloat(voltage) * 100)}`);
  const handleSetCurrent = () => sendCommand(`si${Math.round(parseFloat(current) * 1000)}`);
  const handleOutputOn = () => sendCommand('O1');
  const handleOutputOff = () => sendCommand('O0');

  const handleModeChange = (mode) => {
    setOutputMode(mode);
    const modeCommands = { independent: 'O2', parallel: 'O3', series: 'O4', tracking: 'O5' };
    sendCommand(modeCommands[mode]);
  };

  const handleCh3Change = (v) => {
    setCh3Voltage(v);
    const map = { '2.5': 'Oa', '3.3': 'O8', '5': 'O9' };
    sendCommand(map[v]);
  };

  return (
    <div>
      <h2>Power Supply Config</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>CH1</h3>
        <input placeholder="Voltage (V)" value={voltage} onChange={(e) => setVoltage(e.target.value)} />
        <button onClick={handleSetVoltage}>Set Voltage</button><br/>
        <input placeholder="Current (A)" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <button onClick={handleSetCurrent}>Set Current</button>
      </div>

      <div>
        <h3>Output Mode</h3>
        {['independent', 'parallel', 'series', 'tracking'].map((mode) => (
          <button key={mode} onClick={() => handleModeChange(mode)}>{mode}</button>
        ))}
      </div>

      <div>
        <h3>CH3 Voltage</h3>
        {['2.5', '3.3', '5'].map((v) => (
          <button key={v} onClick={() => handleCh3Change(v)}>{v}V</button>
        ))}
      </div>

      <div>
        <h3>Output</h3>
        <button onClick={handleOutputOn}>Turn ON</button>
        <button onClick={handleOutputOff}>Turn OFF</button>
      </div>
    </div>
  );
}

export default PowerConfig;
