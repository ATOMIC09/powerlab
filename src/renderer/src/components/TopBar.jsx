import { Link, useLocation } from 'react-router-dom';

export default function TopBar() {
    const location = useLocation();

    return (
        <div className="top-bar flex items-center m-2">
            <div className="flex gap-2">
                <select className="w-full py-2 px-10 border border-gray-300 rounded">
                    <option value="COM1">COM1</option>
                    <option value="COM2">COM2</option>
                    <option value="COM3">COM3</option>
                </select>
                <button className="p-2 bg-blue-500 text-white rounded">Connect</button>
                <div className="flex items-center gap-2 bg-gray-400 px-[1px] rounded-2xl"></div>
                {/* Menu bar */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className={`whitespace-nowrap text-xl ${
                            location.pathname === "/" ? "text-gray-900" : "text-gray-400"
                        }`}
                    >
                        POWER LOGGER
                    </Link>
                    <Link
                        to="/serial-monitor"
                        className={`whitespace-nowrap text-xl ${
                            location.pathname === "/serial-monitor" ? "text-gray-900" : "text-gray-400"
                        }`}
                    >
                        SERIAL MONITOR
                    </Link>
                </div>
            </div>
        </div>
    );
}