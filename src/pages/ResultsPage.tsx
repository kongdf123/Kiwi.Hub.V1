import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { DEMO_RESULTS, DEMO_SESSIONS, DEMO_ATHLETES, DEMO_PROTOCOLS, getAthlete, getProtocol, getDataSource } from '@/lib/demo-data';
import { Search, Download, ChevronRight, Activity, Zap, Waves, TrendingUp, Dumbbell, Shuffle, BarChart3 } from 'lucide-react';
import type { Result } from '@/lib/types';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity, 'sport-sprint': Zap, 'sport-swim': Waves,
  'sport-hj': TrendingUp, 'sport-imtp': Dumbbell, 'sport-cod': Shuffle,
};

export function ResultsPage() {
  const { navigate, lang, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('all');

  const filtered = useMemo(() => {
    return DEMO_RESULTS.filter((r) => {
      const session = DEMO_SESSIONS.find((s) => s.id === r.sessionId);
      const athlete = getAthlete(r.subjectId);
      const name = athlete ? `${athlete.lastName} ${athlete.firstName}` : '';
      const protocol = getProtocol(r.protocolId);
      const protoName = protocol ? (lang === 'cn' ? protocol.nameCn : protocol.name) : '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || protoName.toLowerCase().includes(search.toLowerCase());
      const matchesProtocol = protocolFilter === 'all' || r.protocolId === protocolFilter;
      return matchesSearch && matchesProtocol;
    });
  }, [search, protocolFilter, lang]);

  return (
    <div>
      <TopBar
        title={tr('results.title', lang)}
        subtitle={tr('results.subtitle', lang)}
        actions={
          <button onClick={() => addToast(lang === 'cn' ? '导出（演示）' : 'Export (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> {tr('common.export', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'cn' ? '搜索受试者或方案...' : 'Search by subject or protocol...'}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
            />
          </div>
          <select value={protocolFilter} onChange={(e) => setProtocolFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('sessions.allProtocols', lang)}</option>
            {DEMO_PROTOCOLS.map((p) => (
              <option key={p.id} value={p.id}>{lang === 'cn' ? p.nameCn : p.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'subject',
                header: tr('common.subject', lang),
                render: (r: Result) => {
                  const athlete = getAthlete(r.subjectId);
                  const session = DEMO_SESSIONS.find((s) => s.id === r.sessionId);
                  const SportIcon = session ? SPORT_ICONS[session.sportId] || Activity : Activity;
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                        <SportIcon className="w-4 h-4 text-ink-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-900">{athlete ? `${athlete.lastName} ${athlete.firstName}` : r.subjectId}</p>
                      </div>
                    </div>
                  );
                },
              },
              {
                key: 'protocol',
                header: tr('common.protocol', lang),
                render: (r: Result) => {
                  const protocol = getProtocol(r.protocolId);
                  return <span className="text-sm text-ink-700">{protocol ? (lang === 'cn' ? protocol.nameCn : protocol.name) : r.protocolId}</span>;
                },
              },
              {
                key: 'primaryMetric',
                header: tr('results.primaryMetric', lang),
                render: (r: Result) => (
                  <span className="text-sm font-medium text-ink-600">{lang === 'cn' ? r.primaryMetric.nameCn : r.primaryMetric.name}</span>
                ),
              },
              {
                key: 'value',
                header: tr('sessions.result', lang),
                align: 'right',
                render: (r: Result) => (
                  <span className="text-sm font-mono font-semibold text-ink-900">
                    {r.primaryMetric.value.toFixed(2)} <span className="text-xs text-ink-400 font-normal">{r.primaryMetric.unit}</span>
                  </span>
                ),
              },
              {
                key: 'source',
                header: tr('sessions.source', lang),
                render: (r: Result) => {
                  const session = DEMO_SESSIONS.find((s) => s.id === r.sessionId);
                  const ds = session ? getDataSource(session.dataSourceId) : undefined;
                  return <span className="text-sm text-ink-600">{ds ? (lang === 'cn' ? ds.nameCn : ds.name) : session?.source || '—'}</span>;
                },
              },
              {
                key: 'status',
                header: tr('sessions.status', lang),
                render: (r: Result) => {
                  const session = DEMO_SESSIONS.find((s) => s.id === r.sessionId);
                  const isPublished = session?.sessionStatus === 'PUBLISHED' || session?.sessionStatus === 'ANALYZED';
                  return (
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isPublished ? 'text-success-600' : 'text-ink-500'}`}>
                      {isPublished ? (lang === 'cn' ? '已发布' : 'Published') : (lang === 'cn' ? '处理中' : 'Processing')}
                    </span>
                  );
                },
              },
              {
                key: 'date',
                header: tr('sessions.date', lang),
                align: 'right',
                render: (r: Result) => {
                  const session = DEMO_SESSIONS.find((s) => s.id === r.sessionId);
                  return session ? <span className="text-sm text-ink-600">{new Date(session.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}</span> : '—';
                },
              },
              {
                key: 'action',
                header: '',
                align: 'right',
                render: (r: Result) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('result-detail', { sessionId: r.sessionId }); }}
                    className="p-1.5 text-ink-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ),
              },
            ]}
            data={filtered}
            rowKey={(r) => r.sessionId}
            onRowClick={(r) => navigate('result-detail', { sessionId: r.sessionId })}
            emptyMessage={tr('results.noMatch', lang)}
          />
        </div>
      </div>
    </div>
  );
}
