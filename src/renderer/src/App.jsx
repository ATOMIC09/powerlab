// import { useEffect, useState } from 'react'
import Sidebar from "./components/Sidebar"
import TopBar from "./components/TopBar"

export default function App() {
  return (
    <>
      <TopBar />
      <div className="app-container flex">
        <Sidebar />
        <div className="main-content flex-1 p-4 bg-[#d0d8dc]">
          <h1>Data Chart</h1>
          <div className="chart-placeholder border border-gray-300 rounded p-4">
            <p>ไว้ก่อน</p>
          </div>
        </div>
      </div>
    </>
  )
}
