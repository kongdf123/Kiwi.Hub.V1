interface TrendChartProps {
  data: { label: string; value: number }[];
  unit?: string;
  height?: number;
  color?: string;
  baseline?: number;
  showGrid?: boolean;
}

export function TrendChart({ data, unit = '', height = 180, color = '#3384fc', baseline, showGrid = true }: TrendChartProps) {
  if (data.length === 0) {
    return <div style={{ height }} className="flex items-center justify-center text-ink-400 text-sm">No data yet</div>;
  }

  const width = 600;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const values = data.map((d) => d.value);
  const min = Math.min(...values, baseline ?? Infinity) * 0.95;
  const max = Math.max(...values, baseline ?? -Infinity) * 1.05;
  const range = max - min || 1;

  const stepX = data.length > 1 ? chartW / (data.length - 1) : chartW;
  const points = data.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + chartH - ((d.value - min) / range) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => padding.top + chartH * t);
  const gradId = `trend-${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {showGrid && gridLines.map((y, i) => (
        <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#eceef2" strokeWidth={1} />
      ))}
      {baseline !== undefined && (
        <line
          x1={padding.left}
          y1={padding.top + chartH - ((baseline - min) / range) * chartH}
          x2={width - padding.right}
          y2={padding.top + chartH - ((baseline - min) / range) * chartH}
          stroke="#b1b8c8"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      )}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill="white" stroke={color} strokeWidth={2} />
          <text x={p.x} y={padding.top + chartH + 18} textAnchor="middle" className="fill-ink-500" style={{ fontSize: 10 }}>
            {p.label}
          </text>
        </g>
      ))}
      {showGrid && gridLines.map((y, i) => {
        const val = max - (range * i);
        return (
          <text key={i} x={padding.left - 8} y={y + 3} textAnchor="end" className="fill-ink-400" style={{ fontSize: 10 }}>
            {val.toFixed(0)}{unit}
          </text>
        );
      })}
    </svg>
  );
}
