import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_SESSIONS, DEMO_ATHLETES, DEMO_PROTOCOLS, DEMO_DATA_SOURCES, getSport, getProtocol, getDataSource } from '@/lib/demo-data';
// metric labels handled inline via protocol definitions
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Upload, Search, Activity, Zap, Waves, TrendingUp, Dumbbell, Shuffle, ChevronRight, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import type { TestSession, SessionStatus } from '@/lib/types';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity,
  'sport-sprint': Zap,
  'sport-swim': Waves,
  'sport-hj': TrendingUp,
  'sport-imtp': Dumbbell,
  'sport-cod': Shuffle,
};

const SESSION_STATUS_CONFIG: Record<SessionStatus, { en: string; cn: string; color: string; icon: typeof CheckCircle }> = {
  LOCAL: { en: 'Local', cn: '本地', color: 'text-ink-500', icon: CheckCircle },
  QUEUED: { en: 'Queued', cn: '排队中', color: 'text-ink-500', icon: RefreshCw },
  UPLOADING: { en: 'Uploading', cn: '上传中', color: 'text-teal-600', icon: RefreshCw },
  RECEIVED: { en: 'Received', cn: '已接收', color: 'text-teal-600', icon: CheckCircle },
  VALIDATING: { en: 'Validating', cn: '验证中', color: 'text-teal-600', icon: RefreshCw },
  PROCESSING: { en: 'Processing', cn: '处理中', color: 'text-teal-600', icon: RefreshCw },
  ANALYZED: { en: 'Analyzed', cn: '已分析', color: 'text-success-600', icon: CheckCircle },
  PUBLISHED: { en: 'Published', cn: '已发布', color: 'text-success-600', icon: CheckCircle },
  UPLOAD_FAILED: { en: 'Upload Failed', cn: '上传失败', color: 'text-invalid-600', icon: XCircle },
  VALIDATION_FAILED: { en: 'Validation Failed', cn: '验证失败', color: 'text-invalid-600', icon: XCircle },
  PROCESSING_FAILED: { en: 'Processing Failed', cn: '处理失败', color: 'text-invalid-600', icon: XCircle },
};

export function SessionsPage() {
  const { navigate, addToast, lang } = useApp();
  const [search, setSearch] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredSessions = useMemo(() => {
    return DEMO_SESSIONS.filter((s) => {
      const athlete = DEMO_ATHLETES.find((a) => a.id === s.athleteId);
      const name = athlete ? `${athlete.lastName} ${athlete.firstName}` : '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || s.protocolName.toLowerCase().includes(search.toLowerCase());
      const matchesProtocol = protocolFilter === 'all' || s.protocolId === protocolFilter;
      const matchesStatus = statusFilter === 'all' || s.sessionStatus === statusFilter;
      const matchesSource = sourceFilter === 'all' || s.dataSourceId === sourceFilter;
      return matchesSearch && matchesProtocol && matchesStatus && matchesSource;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search, protocolFilter, statusFilter, sourceFilter]);

  const getPrimaryResult = (session: TestSession): string => {
    const protocol = getProtocol(session.protocolId);
    if (!protocol) return '—';
    const primaryMetric = protocol.metrics.find((m) => m.primary);
    if (!primaryMetric) return '—';
    const value = session.summary[primaryMetric.key];
    if (value === undefined) return '—';
    return `${value.toFixed(2)} ${primaryMetric.unit}`;
  };

  const getSessionStatusDisplay = (status: SessionStatus) => {
    const config = SESSION_STATUS_CONFIG[status] || SESSION_STATUS_CONFIG.RECEIVED;
    const Icon = config.icon;
    const isProcessing = status === 'PROCESSING' || status === 'VALIDATING' || status === 'UPLOADING';
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
        <Icon className={`w-3.5 h-3.5 ${isProcessing ? 'animate-sync-spin' : ''}`} />
        {lang === 'cn' ? config.cn : config.en}
      </span>
    );
  };

  const sourceOptions = DEMO_DATA_SOURCES.filter((ds) => ds.category === 'APPLICATION' || ds.category === 'DEVICE' || ds.category === 'INTEGRATION');

  return (
    <div>
      <TopBar
        title={tr('sessions.title', lang)}
        subtitle={tr('sessions.subtitle', lang)}
        actions={
          <button
            onClick={() => { addToast(lang === 'cn' ? '导入数据（演示）' : 'Import data (demo)', 'info'); navigate('data'); }}
            className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            {tr('common.importData', lang)}
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
              placeholder={tr('sessions.searchPlaceholder', lang)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
            />
          </div>
          <select value={protocolFilter} onChange={(e) => setProtocolFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('sessions.allProtocols', lang)}</option>
            {DEMO_PROTOCOLS.map((p) => (
              <option key={p.id} value={p.id}>{lang === 'cn' ? p.nameCn : p.name}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('sessions.allStatuses', lang)}</option>
            {Object.entries(SESSION_STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{lang === 'cn' ? cfg.cn : cfg.en}</option>
            ))}
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('sessions.allSources', lang)}</option>
            {sourceOptions.map((s) => (
              <option key={s.id} value={s.id}>{lang === 'cn' ? s.nameCn : s.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'subject',
                header: tr('sessions.subject', lang),
                render: (s) => {
                  const athlete = DEMO_ATHLETES.find((a) => a.id === s.athleteId);
                  const sport = getSport(s.sportId);
                  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                        <SportIcon className="w-4 h-4 text-ink-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900 truncate">{athlete ? `${athlete.lastName} ${athlete.firstName}` : '—'}</p>
                        <p className="text-xs text-ink-500 truncate">{sport ? (lang === 'cn' ? sport.nameCn : sport.name) : ''}</p>
                      </div>
                    </div>
                  );
                },
              },
              {
                key: 'protocol',
                header: tr('sessions.protocol', lang),
                render: (s) => {
                  const protocol = getProtocol(s.protocolId);
                  return (
                    <div>
                      <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? protocol?.nameCn || s.protocolName : s.protocolName}</p>
                      <p className="text-xs text-ink-400">v{protocol?.version || s.processingVersion}</p>
                    </div>
                  );
                },
              },
              {
                key: 'source',
                header: tr('sessions.source', lang),
                render: (s) => {
                  const ds = getDataSource(s.dataSourceId);
                  return (
                    <div>
                      <p className="text-sm text-ink-700">{ds ? (lang === 'cn' ? ds.nameCn : ds.name) : s.source}</p>
                      <p className="text-xs text-ink-400">{s.deviceSerial}</p>
                    </div>
                  );
                },
              },
              {
                key: 'status',
                header: tr('sessions.status', lang),
                render: (s) => getSessionStatusDisplay(s.sessionStatus),
              },
              {
                key: 'result',
                header: tr('sessions.result', lang),
                render: (s) => {
                  if (s.sessionStatus !== 'PUBLISHED' && s.sessionStatus !== 'ANALYZED') return <span className="text-sm text-ink-400">—</span>;
                  const protocol = getProtocol(s.protocolId);
                  const primaryMetric = protocol?.metrics.find((m) => m.primary);
                  if (!primaryMetric) return <span className="text-sm text-ink-400">—</span>;
                  const value = s.summary[primaryMetric.key];
                  if (value === undefined) return <span className="text-sm text-ink-400">—</span>;
                  return <span className="text-sm font-mono font-semibold text-ink-900">{value.toFixed(2)} <span className="text-xs text-ink-400 font-normal">{primaryMetric.unit}</span></span>;
                },
              },
              {
                key: 'quality',
                header: tr('sessions.quality', lang),
                render: (s) => {
                  const q = s.dataQuality;
                  const config = {
                    complete: { color: 'text-success-600', bg: 'bg-success-50', icon: CheckCircle, label: { en: 'Good', cn: '良好' } },
                    warning: { color: 'text-warning-600', bg: 'bg-warning-50', icon: AlertCircle, label: { en: 'Warning', cn: '警告' } },
                    invalid: { color: 'text-invalid-600', bg: 'bg-invalid-50', icon: XCircle, label: { en: 'Invalid', cn: '无效' } },
                    processing_error: { color: 'text-invalid-600', bg: 'bg-invalid-50', icon: XCircle, label: { en: 'Error', cn: '错误' } },
                  }[q.status];
                  const Icon = config.icon;
                  return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                      <Icon className="w-3 h-3" />
                      {lang === 'cn' ? config.label.cn : config.label.en}
                    </span>
                  );
                },
              },
              {
                key: 'date',
                header: tr('sessions.date', lang),
                align: 'right',
                render: (s) => {
                  const date = new Date(s.date);
                  return (
                    <div className="text-right">
                      <p className="text-sm text-ink-700">{date.toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-xs text-ink-400">{date.toLocaleTimeString(lang === 'cn' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  );
                },
              },
              {
                key: 'action',
                header: '',
                align: 'right',
                render: (s) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('session-detail', { sessionId: s.id }); }}
                    className="p-1.5 text-ink-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                    title={tr('common.viewSession', lang)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ),
              },
            ]}
            data={filteredSessions}
            rowKey={(s) => s.id}
            onRowClick={(s) => navigate('session-detail', { sessionId: s.id })}
            emptyMessage={tr('sessions.noMatch', lang)}
          />
        </div>
      </div>
    </div>
  );
}
