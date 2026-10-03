import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { BarChart } from '@/components/ui/BarChart';
import { DEMO_SESSIONS, DEMO_ATHLETES, DEMO_PROTOCOLS, DEMO_GROUPS, getAthlete } from '@/lib/demo-data';
import { getMetricLabel, getMetricUnit } from '@/lib/metrics';
import { GitCompare, Download } from 'lucide-react';

const COMPARISON_MODES = [
  { key: 'vsPrevious', labelKey: 'comparisons.currentVsPrevious' },
  { key: 'vsBaseline', labelKey: 'comparisons.currentVsBaseline' },
  { key: 'vsPB', labelKey: 'comparisons.currentVsPB' },
  { key: 'vsTeam', labelKey: 'comparisons.currentVsTeam' },
  { key: 'vsGroup', labelKey: 'comparisons.currentVsGroup' },
];

export function ComparisonsPage() {
  const { lang, addToast } = useApp();
  const [mode, setMode] = useState('vsBaseline');
  const [metricKey, setMetricKey] = useState('jump_height');
  const [protocolId, setProtocolId] = useState('all');

  const allMetrics = DEMO_PROTOCOLS.flatMap((p) => p.metrics).filter((m, i, arr) => arr.findIndex((x) => x.key === m.key) === i);

  const sessions = protocolId === 'all' ? DEMO_SESSIONS : DEMO_SESSIONS.filter((s) => s.protocolId === protocolId);

  const chartData = DEMO_ATHLETES.map((athlete) => {
    const athleteSessions = sessions.filter((s) => s.athleteId === athlete.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const current = athleteSessions[0]?.summary[metricKey] || 0;

    let compareValue = 0;
    let label = '';
    if (mode === 'vsPrevious') {
      compareValue = athleteSessions[1]?.summary[metricKey] || 0;
      label = lang === 'cn' ? '上次' : 'Prev';
    } else if (mode === 'vsBaseline') {
      compareValue = athlete.baseline[metricKey] || 0;
      label = lang === 'cn' ? '基线' : 'Base';
    } else if (mode === 'vsPB') {
      compareValue = athlete.personalBest[metricKey] || 0;
      label = lang === 'cn' ? '最佳' : 'PB';
    } else if (mode === 'vsTeam') {
      const teamVals = sessions.map((s) => s.summary[metricKey] || 0).filter((v) => v > 0);
      compareValue = teamVals.length > 0 ? teamVals.reduce((a, b) => a + b, 0) / teamVals.length : 0;
      label = lang === 'cn' ? '团队' : 'Team';
    } else if (mode === 'vsGroup') {
      const groupIds = athlete.groupIds;
      const groupAthletes = DEMO_ATHLETES.filter((a) => a.groupIds.some((g) => groupIds.includes(g)));
      const groupVals = groupAthletes.flatMap((a) =>
        sessions.filter((s) => s.athleteId === a.id).map((s) => s.summary[metricKey] || 0)
      ).filter((v) => v > 0);
      compareValue = groupVals.length > 0 ? groupVals.reduce((a, b) => a + b, 0) / groupVals.length : 0;
      label = lang === 'cn' ? '分组' : 'Group';
    }

    const delta = current - compareValue;
    return {
      label: `${athlete.lastName} ${athlete.firstName[0]}.`,
      value: Math.abs(delta),
      color: delta >= 0 ? '#06b56b' : '#f97316',
    };
  }).filter((d) => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <div>
      <TopBar
        title={tr('comparisons.title', lang)}
        subtitle={tr('comparisons.subtitle', lang)}
        actions={
          <button onClick={() => addToast(lang === 'cn' ? '导出（演示）' : 'Export (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> {tr('common.export', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            {COMPARISON_MODES.map((m) => (
              <option key={m.key} value={m.key}>{tr(m.labelKey, lang)}</option>
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
            <GitCompare className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-semibold text-ink-900">
              {getMetricLabel(metricKey, lang)} — {COMPARISON_MODES.find((m) => m.key === mode) ? tr(COMPARISON_MODES.find((m) => m.key === mode)!.labelKey, lang) : ''}
            </h4>
          </div>
          {chartData.length > 0 ? (
            <BarChart data={chartData} horizontal height={Math.max(200, chartData.length * 40)} unit={getMetricUnit(metricKey)} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-ink-400 text-sm">{tr('trends.noData', lang)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
