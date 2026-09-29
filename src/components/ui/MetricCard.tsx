interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  status?: 'normal' | 'warning' | 'attention';
  sparkData?: number[];
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCard({ label, value, unit, delta, deltaLabel, status = 'normal', sparkData, size = 'md' }: MetricCardProps) {
  const statusColor = status === 'attention' ? 'text-attention-600' : status === 'warning' ? 'text-warning-600' : 'text-success-600';
  const deltaPositive = (delta ?? 0) >= 0;

  return (
    <div className="bg-white rounded-xl border border-ink-200 p-4 hover:border-ink-300 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">{label}</span>
        {delta !== undefined && (
          <span className={`text-xs font-medium ${deltaPositive ? 'text-success-600' : 'text-invalid-600'}`}>
            {deltaPositive ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}{unit}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={size === 'lg' ? 'text-metric-lg text-ink-900' : size === 'sm' ? 'text-xl text-ink-900 font-semibold' : 'text-metric text-ink-900'}>
          {typeof value === 'number' ? value.toFixed(unit === '%' ? 1 : 1) : value}
        </span>
        {unit && <span className="text-sm text-ink-400 font-medium">{unit}</span>}
      </div>
      <div className="flex items-center justify-between mt-1">
        {deltaLabel && <span className={`text-xs ${statusColor}`}>{deltaLabel}</span>}
        {sparkData && sparkData.length > 1 && (
          <div className="ml-auto">
            <svg width={60} height={20} className="overflow-visible">
              <polyline
                points={sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * 60},${20 - ((v - Math.min(...sparkData)) / (Math.max(...sparkData) - Math.min(...sparkData) || 1)) * 16 - 2}`).join(' ')}
                fill="none"
                stroke={status === 'attention' ? '#f97316' : status === 'warning' ? '#fbbf24' : '#3384fc'}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
