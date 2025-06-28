import { Link, useLocation } from 'react-router-dom'

export default function TopBar() {
  const location = useLocation()

  return (
    <div className="top-bar flex items-center m-2">
      <div className="flex gap-2">
        {/* Menu bar */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`whitespace-nowrap text-xl ${
              location.pathname === '/' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            POWER LOGGER
          </Link>
          <Link
            to="/serial-monitor"
            className={`whitespace-nowrap text-xl ${
              location.pathname === '/serial-monitor' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            SERIAL MONITOR
          </Link>
        </div>
      </div>
    </div>
  )
}
