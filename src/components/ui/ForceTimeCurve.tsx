interface ForceTimeCurveProps {
  data: number[];
  height?: number;
  bodyWeight?: number;
  showPhases?: boolean;
}

export function ForceTimeCurve({ data, height = 240, bodyWeight = 780, showPhases = true }: ForceTimeCurveProps) {
  if (data.length === 0) {
    return <div style={{ height }} className="flex items-center justify-center text-ink-400 text-sm">No force data</div>;
  }

  const width = 700;
  const padding = { top: 20, right: 20, bottom: 35, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const max = Math.max(...data) * 1.05;
  const min = 0;
  const range = max - min || 1;
  const stepX = chartW / (data.length - 1);

  const linePath = data.map((v, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + chartH - ((v - min) / range) * chartH;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  const areaPath = `${linePath} L${padding.left + chartW},${padding.top + chartH} L${padding.left},${padding.top + chartH} Z`;

  const bwY = padding.top + chartH - ((bodyWeight - min) / range) * chartH;
  const gradId = 'force-grad';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b56b" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#06b56b" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padding.top + chartH * t;
        const val = max - range * t;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#eceef2" strokeWidth={1} />
            <text x={padding.left - 8} y={y + 3} textAnchor="end" className="fill-ink-400" style={{ fontSize: 10 }}>
              {val.toFixed(0)}
            </text>
          </g>
        );
      })}
      <line x1={padding.left} y1={bwY} x2={width - padding.right} y2={bwY} stroke="#fbbf24" strokeWidth={1} strokeDasharray="6 3" />
      <text x={width - padding.right} y={bwY - 4} textAnchor="end" className="fill-warning-600" style={{ fontSize: 10, fontWeight: 500 }}>
        Body Weight
      </text>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke="#06b56b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {showPhases && (
        <>
          <line x1={padding.left + chartW * 0.2} y1={padding.top} x2={padding.left + chartW * 0.2} y2={padding.top + chartH} stroke="#b1b8c8" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={padding.left + chartW * 0.45} y1={padding.top} x2={padding.left + chartW * 0.45} y2={padding.top + chartH} stroke="#b1b8c8" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={padding.left + chartW * 0.55} y1={padding.top} x2={padding.left + chartW * 0.55} y2={padding.top + chartH} stroke="#b1b8c8" strokeWidth={1} strokeDasharray="3 3" />
          <text x={padding.left + chartW * 0.1} y={padding.top + chartH + 18} textAnchor="middle" className="fill-ink-500" style={{ fontSize: 9 }}>Weighing</text>
          <text x={padding.left + chartW * 0.325} y={padding.top + chartH + 18} textAnchor="middle" className="fill-ink-500" style={{ fontSize: 9 }}>Eccentric</text>
          <text x={padding.left + chartW * 0.5} y={padding.top + chartH + 18} textAnchor="middle" className="fill-ink-500" style={{ fontSize: 9 }}>Concentric</text>
          <text x={padding.left + chartW * 0.75} y={padding.top + chartH + 18} textAnchor="middle" className="fill-ink-500" style={{ fontSize: 9 }}>Flight</text>
        </>
      )}
      <text x={padding.left - 35} y={padding.top + chartH / 2} textAnchor="middle" className="fill-ink-500" style={{ fontSize: 10, transform: `rotate(-90deg, ${padding.left - 35}, ${padding.top + chartH / 2})` }}>
        Force (N)
      </text>
      <text x={padding.left + chartW / 2} y={height - 5} textAnchor="middle" className="fill-ink-500" style={{ fontSize: 10 }}>
        Time (ms)
      </text>
    </svg>
  );
}
