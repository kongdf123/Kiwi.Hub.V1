import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { TrendChart } from '@/components/ui/TrendChart';
import { DEMO_SESSIONS, DEMO_ATHLETES, DEMO_PROTOCOLS, getAthlete } from '@/lib/demo-data';
import { getMetricLabel, getMetricUnit } from '@/lib/metrics';
import { TrendingUp, Download } from 'lucide-react';

export function TrendsPage() {
  const { lang, addToast } = useApp();
  const [athleteId, setAthleteId] = useState('all');
  const [protocolId, setProtocolId] = useState('all');
  const [metricKey, setMetricKey] = useState('jump_height');

  let sessions = DEMO_SESSIONS;
  if (athleteId !== 'all') sessions = sessions.filter((s) => s.athleteId === athleteId);
  if (protocolId !== 'all') sessions = sessions.filter((s) => s.protocolId === protocolId);

  const trendData = sessions.slice().reverse().map((s) => ({
    label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
    value: s.summary[metricKey] || Object.values(s.summary)[0] || 0,
  }));

  const allMetrics = DEMO_PROTOCOLS.flatMap((p) => p.metrics).filter((m, i, arr) => arr.findIndex((x) => x.key === m.key) === i);

  return (
    <div>
      <TopBar
        title={tr('trends.title', lang)}
        subtitle={tr('trends.subtitle', lang)}
        actions={
          <button onClick={() => addToast(lang === 'cn' ? '导出（演示）' : 'Export (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> {tr('common.export', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={athleteId} onChange={(e) => setAthleteId(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('common.allSubjects', lang)}</option>
            {DEMO_ATHLETES.map((a) => (
              <option key={a.id} value={a.id}>{a.lastName} {a.firstName}</option>
            ))}
          </select>
          <select value={protocolId} onChange={(e) => setProtocolId(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('sessions.allProtocols', lang)}</option>
            {DEMO_PROTOCOLS.map((p) => (
              <option key={p.id} value={p.id}>{lang === 'cn' ? p.nameCn : p.name}</option>
            ))}
          </select>
          <select value={metricKey} onChange={(e) => setMetricKey(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            {allMetrics.map((m) => (
              <option key={m.key} value={m.key}>{lang === 'cn' ? m.nameCn : m.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-semibold text-ink-900">{getMetricLabel(metricKey, lang)} {lang === 'cn' ? '趋势' : 'Trend'}</h4>
          </div>
          {trendData.length > 1 ? (
            <TrendChart data={trendData} unit={getMetricUnit(metricKey)} height={280} color="#06b56b" />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-ink-400 text-sm">{tr('trends.noData', lang)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
