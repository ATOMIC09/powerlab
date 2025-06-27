function GraphView({ log }) {
  return (
    <div className="border p-2 h-96 overflow-y-scroll">
      <h2 className="text-lg font-semibold">Live Serial Data (Graph Data Source)</h2>
      <pre className="text-sm">{log.slice(-20).join('')}</pre>
    </div>
  )
}

export default GraphView
