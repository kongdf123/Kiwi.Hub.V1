interface RadialGaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  size?: number;
  color?: string;
  warningThreshold?: number;
  attentionThreshold?: number;
}

export function RadialGauge({
  value,
  max,
  label,
  unit = '',
  size = 120,
  color = '#06b56b',
  warningThreshold,
  attentionThreshold,
}: RadialGaugeProps) {
  const pct = Math.min(value / max, 1);
  const radius = size / 2 - 12;
  const circumference = Math.PI * radius;
  const strokeColor = attentionThreshold && value >= attentionThreshold
    ? '#f97316'
    : warningThreshold && value >= warningThreshold
    ? '#fbbf24'
    : color;
  const gradId = `gauge-${label.replace(/\s/g, '')}-${color.replace('#', '')}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={strokeColor} />
          </linearGradient>
        </defs>
        <path
          d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
          fill="none"
          stroke="#eceef2"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          className="fill-ink-900"
          style={{ fontSize: size > 100 ? 20 : 16, fontWeight: 600 }}
        >
          {value.toFixed(unit === '%' ? 1 : 0)}{unit}
        </text>
      </svg>
      <span className="text-xs text-ink-500 font-medium">{label}</span>
    </div>
  );
}
