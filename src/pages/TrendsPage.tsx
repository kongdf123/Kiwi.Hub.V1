import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { TrendChart } from '@/components/ui/TrendChart';
import { DEMO_SESSIONS, DEMO_ATHLETES, DEMO_PROTOCOLS } from '@/lib/demo-data';
import { getMetricLabel, getMetricUnit } from '@/lib/metrics';
import { TrendingUp, Download, Users } from 'lucide-react';

const TIME_RANGES = [
  { key: '7', labelKey: 'common.last7days' },
  { key: '30', labelKey: 'common.last30days' },
  { key: '90', labelKey: 'common.last90days' },
  { key: 'all', labelKey: 'common.allTime' },
];

export function TrendsPage() {
  const { lang, addToast } = useApp();
  const [athleteIds, setAthleteIds] = useState<string[]>(['all']);
  const [protocolId, setProtocolId] = useState('all');
  const [metricKey, setMetricKey] = useState('jump_height');
  const [timeRange, setTimeRange] = useState('all');

  const allMetrics = DEMO_PROTOCOLS.flatMap((p) => p.metrics).filter((m, i, arr) => arr.findIndex((x) => x.key === m.key) === i);

  const toggleAthlete = (id: string) => {
    if (id === 'all') { setAthleteIds(['all']); return; }
    setAthleteIds((prev) => {
      const without = prev.filter((a) => a !== 'all');
      if (without.includes(id)) {
        const next = without.filter((a) => a !== id);
        return next.length === 0 ? ['all'] : next;
      }
      return [...without, id];
    });
  };

  const filteredSessions = useMemo(() => {
    let sessions = DEMO_SESSIONS.slice();
    if (!athleteIds.includes('all')) sessions = sessions.filter((s) => athleteIds.includes(s.athleteId));
    if (protocolId !== 'all') sessions = sessions.filter((s) => s.protocolId === protocolId);
    if (timeRange !== 'all') {
      const days = parseInt(timeRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      sessions = sessions.filter((s) => new Date(s.date) >= cutoff);
    }
    return sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [athleteIds, protocolId, timeRange]);

  const trendData = filteredSessions.map((s) => ({
    label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
    value: s.summary[metricKey] || Object.values(s.summary)[0] || 0,
  }));

  const perAthleteData = useMemo(() => {
    if (athleteIds.includes('all')) return [];
    return athleteIds.map((aid) => {
      const athlete = DEMO_ATHLETES.find((a) => a.id === aid);
      const sessions = filteredSessions.filter((s) => s.athleteId === aid);
      return {
        athlete,
        data: sessions.map((s) => ({
          label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
          value: s.summary[metricKey] || Object.values(s.summary)[0] || 0,
        })),
      };
    });
  }, [athleteIds, filteredSessions, metricKey, lang]);

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
          <div className="flex items-center gap-1">
            {TIME_RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setTimeRange(r.key)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${timeRange === r.key ? 'bg-teal-600 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'}`}
              >
                {tr(r.labelKey, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Athlete multi-select */}
        <div className="bg-white rounded-xl border border-ink-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-ink-400" />
            <span className="text-sm font-medium text-ink-700">{lang === 'cn' ? '选择运动员对比' : 'Select Athletes to Compare'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleAthlete('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${athleteIds.includes('all') ? 'bg-teal-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
            >
              {tr('common.allSubjects', lang)}
            </button>
            {DEMO_ATHLETES.map((a) => (
              <button
                key={a.id}
                onClick={() => toggleAthlete(a.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${athleteIds.includes(a.id) ? 'bg-teal-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
              >
                {a.lastName} {a.firstName}
              </button>
            ))}
          </div>
        </div>

        {/* Aggregate trend */}
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-semibold text-ink-900">{getMetricLabel(metricKey, lang)} — {lang === 'cn' ? '整体趋势' : 'Aggregate Trend'}</h4>
          </div>
          {trendData.length > 1 ? (
            <TrendChart data={trendData} unit={getMetricUnit(metricKey)} height={280} color="#06b56b" />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-ink-400 text-sm">{tr('trends.noData', lang)}</div>
          )}
        </div>

        {/* Per-athlete comparison trends */}
        {perAthleteData.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '运动员对比' : 'Athlete Comparison'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {perAthleteData.map(({ athlete, data }) => (
                <div key={athlete?.id} className="bg-white rounded-xl border border-ink-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-ink-100 flex items-center justify-center text-xs font-medium text-ink-600">
                      {athlete?.firstName[0]}{athlete?.lastName[0]}
                    </div>
                    <span className="text-sm font-medium text-ink-900">{athlete?.lastName} {athlete?.firstName}</span>
                  </div>
                  {data.length > 1 ? (
                    <TrendChart data={data} unit={getMetricUnit(metricKey)} height={160} color="#06b56b" />
                  ) : (
                    <div className="h-[160px] flex items-center justify-center text-xs text-ink-400">{tr('trends.noData', lang)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
