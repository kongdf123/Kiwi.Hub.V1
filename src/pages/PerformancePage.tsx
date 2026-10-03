import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { TrendChart } from '@/components/ui/TrendChart';
import { BarChart } from '@/components/ui/BarChart';
import { MetricCard } from '@/components/ui/MetricCard';
import { DEMO_SESSIONS, DEMO_ATHLETES, DEMO_PROTOCOLS, getSport, getProtocol, getAthlete } from '@/lib/demo-data';
import { getMetricLabel, getMetricUnit } from '@/lib/metrics';
import { TrendingUp, Activity, Download } from 'lucide-react';
import { useState } from 'react';

export function PerformancePage() {
  const { lang, addToast, navigate } = useApp();
  const [protocolId, setProtocolId] = useState('all');
  const [metricKey, setMetricKey] = useState('jump_height');

  const filteredSessions = protocolId === 'all'
    ? DEMO_SESSIONS
    : DEMO_SESSIONS.filter((s) => s.protocolId === protocolId);

  const avgByProtocol = DEMO_PROTOCOLS.map((p) => {
    const sessions = DEMO_SESSIONS.filter((s) => s.protocolId === p.id);
    const vals = sessions.map((s) => Object.values(s.summary)[0] || 0).filter((v) => v > 0);
    return {
      label: lang === 'cn' ? p.nameCn : p.name,
      value: vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
      color: '#06b56b',
    };
  });

  const trendData = filteredSessions.slice().reverse().map((s) => ({
    label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
    value: s.summary[metricKey] || Object.values(s.summary)[0] || 0,
  }));

  return (
    <div>
      <TopBar
        title={tr('performance.title', lang)}
        subtitle={tr('performance.subtitle', lang)}
        actions={
          <button onClick={() => addToast(lang === 'cn' ? '导出（演示）' : 'Export (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> {tr('common.export', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={protocolId} onChange={(e) => setProtocolId(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('common.allSubjects', lang)}</option>
            {DEMO_PROTOCOLS.map((p) => (
              <option key={p.id} value={p.id}>{lang === 'cn' ? p.nameCn : p.name}</option>
            ))}
          </select>
          <select value={metricKey} onChange={(e) => setMetricKey(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            {DEMO_PROTOCOLS.flatMap((p) => p.metrics).filter((m, i, arr) => arr.findIndex((x) => x.key === m.key) === i).map((m) => (
              <option key={m.key} value={m.key}>{lang === 'cn' ? m.nameCn : m.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label={lang === 'cn' ? '总会话数' : 'Total Sessions'} value={filteredSessions.length} />
          <MetricCard label={lang === 'cn' ? '受试者数' : 'Subjects'} value={new Set(filteredSessions.map((s) => s.athleteId)).size} />
          <MetricCard label={lang === 'cn' ? '方案数' : 'Protocols'} value={new Set(filteredSessions.map((s) => s.protocolId)).size} />
          <MetricCard label={lang === 'cn' ? '平均指标' : 'Avg Metric'} value={trendData.length > 0 ? (trendData.reduce((a, b) => a + b.value, 0) / trendData.length).toFixed(1) : '—'} unit={getMetricUnit(metricKey)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <h4 className="text-sm font-semibold text-ink-900">{getMetricLabel(metricKey, lang)} {lang === 'cn' ? '趋势' : 'Trend'}</h4>
            </div>
            {trendData.length > 0 ? (
              <TrendChart data={trendData} unit={getMetricUnit(metricKey)} height={220} color="#06b56b" />
            ) : (
              <div className="h-[220px] flex items-center justify-center text-ink-400 text-sm">{tr('trends.noData', lang)}</div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-teal-600" />
              <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '各方案平均表现' : 'Average by Protocol'}</h4>
            </div>
            <BarChart data={avgByProtocol} height={220} />
          </div>
        </div>
      </div>
    </div>
  );
}
