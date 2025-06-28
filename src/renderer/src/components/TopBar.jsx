export default function TopBar() {
    return (
        <div className="top-bar flex items-center m-2">
            <div className="flex gap-2">
                <select className="w-full py-2 px-10 border border-gray-300 rounded">
                    <option value="COM1">COM1</option>
                    <option value="COM2">COM2</option>
                    <option value="COM3">COM3</option>
                </select>
                <button className="p-2 bg-blue-500 text-white rounded">Connect</button>
            </div>
        </div>
    );
}