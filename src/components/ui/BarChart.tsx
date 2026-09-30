interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  unit?: string;
  horizontal?: boolean;
}

export function BarChart({ data, height = 200, unit = '', horizontal = false }: BarChartProps) {
  if (data.length === 0) {
    return <div style={{ height }} className="flex items-center justify-center text-ink-400 text-sm">No data</div>;
  }
  const max = Math.max(...data.map((d) => d.value)) * 1.1;

  if (horizontal) {
    return (
      <div className="space-y-3" style={{ minHeight: height }}>
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm text-ink-700 w-24 text-right truncate">{d.label}</span>
            <div className="flex-1 h-7 bg-ink-100 rounded-md overflow-hidden relative">
              <div
                className="h-full rounded-md transition-all duration-500 animate-slide-right"
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color || '#06b56b' }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-700">
                {d.value.toFixed(1)}{unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 justify-around" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
          <span className="text-xs font-medium text-ink-700">{d.value.toFixed(1)}{unit}</span>
          <div
            className="w-full max-w-[48px] rounded-t-md transition-all duration-500 animate-slide-up"
            style={{ height: `${(d.value / max) * (height - 50)}px`, backgroundColor: d.color || '#3384fc', minHeight: 4 }}
          />
          <span className="text-xs text-ink-500 truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
