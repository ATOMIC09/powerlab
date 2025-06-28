import React, { useState } from 'react';

export default function SerialMonitor() {
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            setLogs([...logs, `Sent: ${message}`]);
            setMessage('');
        }
    };

    return (
        <div className="serial-monitor p-4">
            <div className="logs bg-gray-100 p-2 rounded h-screen overflow-y-auto border border-gray-300">
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <p key={index} className="text-sm font-mono">{log}</p>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No logs available</p>
                )}
            </div>
            <div className="send-message mt-4 flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded bg-white"
                    placeholder="Type your message here..."
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
