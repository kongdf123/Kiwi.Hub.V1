import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import {
  DEMO_ATHLETES, DEMO_SESSIONS, DEMO_PROTOCOLS, DEMO_DEVICES, DEMO_IMPORTS,
  DEMO_SYNC_JOBS, DEMO_DATA_SOURCES, DEMO_RAW_MEASUREMENTS,
  getSessionsForAthlete, getSport, getProtocol,
} from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge, StatusDot } from '@/components/ui/StatusBadge';
import { TrendChart } from '@/components/ui/TrendChart';
import { Upload, AlertCircle, ArrowRight, Clock, Activity, Database, CheckCircle, AlertTriangle, RefreshCw, XCircle, Zap, Waves, TrendingUp, Dumbbell, Shuffle, Server, HardDrive, BarChart3 } from 'lucide-react';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity, 'sport-sprint': Zap, 'sport-swim': Waves,
  'sport-hj': TrendingUp, 'sport-imtp': Dumbbell, 'sport-cod': Shuffle,
};

export function HomePage() {
  const { navigate, lang } = useApp();
  const [perfProtocol, setPerfProtocol] = useState('all');
  const [perfMetric, setPerfMetric] = useState('jump_height');

  const allAthletes = DEMO_ATHLETES;
  const attentionAthletes = allAthletes.filter((a) => a.status === 'attention' || a.status === 'warning');
  const recentSessions = [...DEMO_SESSIONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const today = new Date();
  const todayStr = today.toDateString();
  const testsToday = DEMO_SESSIONS.filter((s) => new Date(s.date).toDateString() === todayStr).length;

  const processingQueue = DEMO_SESSIONS.filter((s) =>
    s.sessionStatus === 'RECEIVED' || s.sessionStatus === 'VALIDATING' ||
    s.sessionStatus === 'PROCESSING' || s.sessionStatus === 'QUEUED'
  ).length;

  const failedSessions = DEMO_SESSIONS.filter((s) =>
    s.sessionStatus === 'UPLOAD_FAILED' || s.sessionStatus === 'VALIDATION_FAILED' || s.sessionStatus === 'PROCESSING_FAILED'
  ).length;

  const onlineSources = DEMO_DATA_SOURCES.filter((ds) => ds.status === 'connected').length;

  const allMetrics = DEMO_PROTOCOLS.flatMap((p) => p.metrics).filter((m, i, arr) => arr.findIndex((x) => x.key === m.key) === i);

  const perfSessions = perfProtocol === 'all' ? DEMO_SESSIONS : DEMO_SESSIONS.filter((s) => s.protocolId === perfProtocol);
  const perfTrend = perfSessions.slice().reverse().map((s) => ({
    label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
    value: s.summary[perfMetric] || Object.values(s.summary)[0] || 0,
  }));

  const metricUnit = allMetrics.find((m) => m.key === perfMetric)?.unit || '';

  return (
    <div>
      <TopBar
        title={tr('nav.home', lang)}
        subtitle={lang === 'cn' ? '组织级数据平台概览' : 'Organization-level data platform overview'}
        actions={
          <button
            onClick={() => navigate('data')}
            className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            {tr('common.importData', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard label={lang === 'cn' ? '受试者' : 'Subjects'} value={allAthletes.length} status="normal" />
          <MetricCard label={lang === 'cn' ? '测试记录' : 'Sessions'} value={DEMO_SESSIONS.length} status="normal" />
          <MetricCard label={tr('home.testsToday', lang)} value={testsToday} status="normal" />
          <MetricCard label={tr('home.processingQueue', lang)} value={processingQueue} status={processingQueue > 0 ? 'warning' : 'normal'} />
          <MetricCard label={tr('home.failedSessions', lang)} value={failedSessions} status={failedSessions > 0 ? 'attention' : 'normal'} />
        </div>

        {/* Performance Overview + Attention List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">{tr('home.performanceOverview', lang)}</h3>
                <p className="text-xs text-ink-500">{lang === 'cn' ? '按方案和指标查看趋势' : 'Configurable by protocol and metric'}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={perfProtocol} onChange={(e) => setPerfProtocol(e.target.value)} className="text-xs bg-white border border-ink-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="all">{tr('sessions.allProtocols', lang)}</option>
                  {DEMO_PROTOCOLS.map((p) => (
                    <option key={p.id} value={p.id}>{lang === 'cn' ? p.nameCn : p.name}</option>
                  ))}
                </select>
                <select value={perfMetric} onChange={(e) => setPerfMetric(e.target.value)} className="text-xs bg-white border border-ink-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  {allMetrics.map((m) => (
                    <option key={m.key} value={m.key}>{lang === 'cn' ? m.nameCn : m.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {perfTrend.length > 1 ? (
              <TrendChart data={perfTrend} unit={metricUnit} height={200} color="#06b56b" />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-ink-400 text-sm">{tr('trends.noData', lang)}</div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink-900">{tr('home.needsAttention', lang)}</h3>
              <AlertCircle className="w-5 h-5 text-attention-600" />
            </div>
            <div className="space-y-3">
              {attentionAthletes.length === 0 ? (
                <p className="text-sm text-ink-400 text-center py-8">{lang === 'cn' ? '所有运动员状态正常' : 'All athletes within normal range'}</p>
              ) : (
                attentionAthletes.map((athlete) => {
                  const sport = getSport(athlete.sportId);
                  return (
                    <button
                      key={athlete.id}
                      onClick={() => navigate('athlete-profile', { athleteId: athlete.id })}
                      className="w-full flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-ink-50 transition-colors text-left"
                    >
                      <StatusDot status={athlete.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900 truncate">{athlete.lastName} {athlete.firstName}</p>
                        <p className="text-xs text-ink-500 truncate">{athlete.position} · {sport ? (lang === 'cn' ? sport.nameCn : sport.name) : ''}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-400 shrink-0" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-ink-500" />
              <h3 className="text-sm font-semibold text-ink-900">{tr('home.recentActivity', lang)}</h3>
            </div>
            <button onClick={() => navigate('sessions')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              {tr('common.viewAll', lang)}
            </button>
          </div>
          <div className="divide-y divide-ink-100">
            {recentSessions.map((session) => {
              const athlete = DEMO_ATHLETES.find((a) => a.id === session.athleteId);
              if (!athlete) return null;
              const sport = getSport(session.sportId);
              const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
              const date = new Date(session.date);
              const dateStr = date.toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
              const timeStr = date.toLocaleTimeString(lang === 'cn' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' });
              return (
                <button
                  key={session.id}
                  onClick={() => navigate('session-detail', { sessionId: session.id })}
                  className="w-full flex items-center gap-4 px-5 py-3 hover:bg-ink-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                    <SportIcon className="w-5 h-5 text-ink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900">{athlete.lastName} {athlete.firstName}</p>
                    <p className="text-xs text-ink-500">{lang === 'cn' ? (sport?.nameCn || session.protocolName) : session.protocolName} · {session.operatorName}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-ink-500 font-mono">
                    {Object.entries(session.summary).slice(0, 3).map(([key, val]) => (
                      <span key={key}>{val.toFixed(1)}</span>
                    ))}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-ink-700">{dateStr}</p>
                    <p className="text-xs text-ink-400">{timeStr}</p>
                  </div>
                  <StatusBadge status={session.status} lang={lang} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Infrastructure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '数据源' : 'Data Sources'}</h3>
              </div>
              <button onClick={() => navigate('data-sources')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">{tr('common.viewAll', lang)}</button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{lang === 'cn' ? '已连接' : 'Connected'}</span>
                <span className="font-mono font-medium text-success-600">{onlineSources} / {DEMO_DATA_SOURCES.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{lang === 'cn' ? '断开' : 'Disconnected'}</span>
                <span className="font-mono font-medium text-ink-500">{DEMO_DATA_SOURCES.filter((ds) => ds.status === 'disconnected').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{lang === 'cn' ? '错误' : 'Errors'}</span>
                <span className="font-mono font-medium text-invalid-600">{DEMO_DATA_SOURCES.filter((ds) => ds.status === 'error').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '同步队列' : 'Sync Queue'}</h3>
              </div>
              <button onClick={() => navigate('sync-center')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">{tr('common.viewAll', lang)}</button>
            </div>
            <div className="space-y-2">
              {DEMO_SYNC_JOBS.slice(0, 4).map((job) => (
                <div key={job.id} className="flex items-center gap-2 text-sm">
                  <StatusDot status={job.sessionStatus === 'PUBLISHED' ? 'normal' : job.sessionStatus.includes('FAILED') ? 'invalid' : 'processing'} size="sm" />
                  <span className="text-ink-700 flex-1 truncate">{job.sourceName}</span>
                  <span className="text-xs text-ink-400 font-mono">{job.recordsProcessed}/{job.recordsTotal}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '原始数据' : 'Raw Data'}</h3>
              </div>
              <button onClick={() => navigate('raw-data')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">{tr('common.viewAll', lang)}</button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{lang === 'cn' ? '原始记录' : 'Raw Records'}</span>
                <span className="font-mono font-medium text-ink-700">{DEMO_RAW_MEASUREMENTS.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{lang === 'cn' ? '数据集' : 'Datasets'}</span>
                <span className="font-mono font-medium text-ink-700">{DEMO_SESSIONS.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{lang === 'cn' ? '设备' : 'Devices'}</span>
                <span className="font-mono font-medium text-ink-700">{DEMO_DEVICES.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
