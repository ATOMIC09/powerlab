// import { useEffect, useState } from 'react'
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="app-container flex">
      <Sidebar />
      <div className="main-content flex-1 p-4">
        <h1>Data Chart</h1>
        <div className="chart-placeholder border border-gray-300 rounded p-4">
          <p>Chart will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}
