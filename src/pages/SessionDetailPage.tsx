import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_SESSIONS, DEMO_ATHLETES, getSport, getProtocol, getDataSource, getResultForSession, DEMO_RAW_MEASUREMENTS, DEMO_PROCESSED_MEASUREMENTS } from '@/lib/demo-data';
// metric helpers defined locally to avoid lang-param mismatch with metrics.ts
import { TopBar } from '@/components/layout/TopBar';
import { ForceTimeCurve } from '@/components/ui/ForceTimeCurve';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BarChart } from '@/components/ui/BarChart';
import { ArrowLeft, Download, CheckCircle, XCircle, Activity, Info, Zap, Waves, TrendingUp, Dumbbell, Shuffle, RefreshCw, Database, FileJson, Clock, Server } from 'lucide-react';
import type { SessionStatus } from '@/lib/types';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity, 'sport-sprint': Zap, 'sport-swim': Waves, 'sport-hj': TrendingUp, 'sport-imtp': Dumbbell, 'sport-cod': Shuffle,
};

const SESSION_STATUS_CONFIG: Record<SessionStatus, { en: string; cn: string; color: string }> = {
  LOCAL: { en: 'Local', cn: '本地', color: 'text-ink-500' },
  QUEUED: { en: 'Queued', cn: '排队中', color: 'text-ink-500' },
  UPLOADING: { en: 'Uploading', cn: '上传中', color: 'text-teal-600' },
  RECEIVED: { en: 'Received', cn: '已接收', color: 'text-teal-600' },
  VALIDATING: { en: 'Validating', cn: '验证中', color: 'text-teal-600' },
  PROCESSING: { en: 'Processing', cn: '处理中', color: 'text-teal-600' },
  ANALYZED: { en: 'Analyzed', cn: '已分析', color: 'text-success-600' },
  PUBLISHED: { en: 'Published', cn: '已发布', color: 'text-success-600' },
  UPLOAD_FAILED: { en: 'Upload Failed', cn: '上传失败', color: 'text-invalid-600' },
  VALIDATION_FAILED: { en: 'Validation Failed', cn: '验证失败', color: 'text-invalid-600' },
  PROCESSING_FAILED: { en: 'Processing Failed', cn: '处理失败', color: 'text-invalid-600' },
};

export function SessionDetailPage() {
  const { viewParams, navigate, addToast, lang } = useApp();
  const sessionId = viewParams.sessionId || 's-1';
  const session = DEMO_SESSIONS.find((s) => s.id === sessionId) || DEMO_SESSIONS[0];
  const athlete = DEMO_ATHLETES.find((a) => a.id === session.athleteId);
  const sport = getSport(session.sportId);
  const protocol = getProtocol(session.protocolId);
  const dataSource = getDataSource(session.dataSourceId);
  const result = getResultForSession(session.id);
  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
  const [selectedTrial, setSelectedTrial] = useState(0);

  const trial = session.trials[selectedTrial];
  const date = new Date(session.date);
  const locale = lang === 'cn' ? 'zh-CN' : 'en-US';
  const dateStr = date.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  const rawMeasurements = DEMO_RAW_MEASUREMENTS.filter((m) => m.sessionId === session.id);
  const processedMeasurements = DEMO_PROCESSED_MEASUREMENTS.filter((m) => m.sessionId === session.id);

  const statusCfg = SESSION_STATUS_CONFIG[session.sessionStatus] || SESSION_STATUS_CONFIG.RECEIVED;
  const isProcessing = session.sessionStatus === 'PROCESSING' || session.sessionStatus === 'VALIDATING';

  const trialBarData = session.trials.map((t, i) => {
    const primaryMetric = protocol?.metrics.find((m) => m.primary);
    const val = primaryMetric ? t.values[primaryMetric.key] : Object.values(t.values)[0];
    return {
      label: `T${i + 1}`,
      value: t.status === 'valid' ? (val || 0) : 0,
      color: t.status === 'valid' ? '#06b56b' : '#fecaca',
    };
  });

  return (
    <div>
      <TopBar
        title={lang === 'cn' ? '测试记录详情' : 'Session Detail'}
        subtitle={`${lang === 'cn' ? protocol?.nameCn || session.protocolName : session.protocolName} · ${athlete?.lastName} ${athlete?.firstName}`}
        actions={
          <>
            <button onClick={() => navigate('sessions')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> {tr('common.back', lang)}
            </button>
            <button onClick={() => addToast(lang === 'cn' ? '导出已开始（演示）' : 'Export started (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Download className="w-4 h-4" /> {tr('common.export', lang)}
            </button>
          </>
        }
      />
      <div className="p-6 space-y-6">
        {/* Session Header */}
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                  <SportIcon className="w-5 h-5 text-ink-500" />
                </div>
                <h3 className="text-lg font-semibold text-ink-900">{lang === 'cn' ? protocol?.nameCn || session.protocolName : session.protocolName}</h3>
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusCfg.color}`}>
                  {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-sync-spin" />}
                  {lang === 'cn' ? statusCfg.cn : statusCfg.en}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{tr('sessions.subject', lang)}</p><p className="text-sm text-ink-900 font-medium">{athlete?.lastName} {athlete?.firstName}</p></div>
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{tr('sessions.date', lang)}</p><p className="text-sm text-ink-900 font-medium">{dateStr}</p><p className="text-xs text-ink-400">{timeStr}</p></div>
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{tr('sessions.source', lang)}</p><p className="text-sm text-ink-900 font-medium">{dataSource ? (lang === 'cn' ? dataSource.nameCn : dataSource.name) : session.source}</p></div>
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{tr('sessions.device', lang)}</p><p className="text-sm text-ink-900 font-medium">{session.deviceSerial}</p></div>
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '操作员' : 'Operator'}</p><p className="text-sm text-ink-900 font-medium">{session.operatorName}</p></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${session.dataQuality.status === 'complete' ? 'bg-success-50 text-success-700' : session.dataQuality.status === 'warning' ? 'bg-warning-50 text-warning-700' : 'bg-invalid-50 text-invalid-700'}`}>
                {tr('sessions.quality', lang)}: {session.dataQuality.status === 'complete' ? (lang === 'cn' ? '良好' : 'Good') : session.dataQuality.status === 'warning' ? (lang === 'cn' ? '警告' : 'Warning') : (lang === 'cn' ? '无效' : 'Invalid')}
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-ink-100 text-sm font-medium text-ink-600">v{session.processingVersion}</div>
            </div>
          </div>

          {/* Data Quality Issues */}
          {session.dataQuality.issues.length > 0 && (
            <div className="mt-4 p-3 bg-warning-50 rounded-lg border border-warning-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-warning-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-warning-800">{lang === 'cn' ? '数据质量提示' : 'Data Quality Notes'}</p>
                  <ul className="mt-1 space-y-0.5">
                    {session.dataQuality.issues.map((issue, i) => (
                      <li key={i} className="text-xs text-warning-700">{issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result Metrics — generic, protocol-driven */}
        {result && (session.sessionStatus === 'PUBLISHED' || session.sessionStatus === 'ANALYZED') && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.metrics.filter((m) => m.primary).slice(0, 4).map((metric) => (
                <MetricCard
                  key={metric.key}
                  label={lang === 'cn' ? metric.nameCn : metric.name}
                  value={metric.value}
                  unit={metric.unit}
                  delta={metric.comparison?.deltaFromBaseline}
                  deltaLabel={metric.comparison?.baseline !== undefined ? `${lang === 'cn' ? '基线' : 'baseline'}: ${metric.comparison.baseline.toFixed(1)}` : undefined}
                  status="normal"
                />
              ))}
            </div>

            {/* All Metrics Table */}
            <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-100">
                <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '全部指标' : 'All Metrics'}</h4>
              </div>
              <div className="divide-y divide-ink-50">
                {result.metrics.map((metric) => (
                  <div key={metric.key} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? metric.nameCn : metric.name}</p>
                      <p className="text-xs text-ink-500">{metric.key}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold text-ink-900">{metric.value.toFixed(2)} <span className="text-xs text-ink-400 font-normal">{metric.unit}</span></p>
                    </div>
                    {metric.comparison?.baseline !== undefined && (
                      <div className="text-right w-24">
                        <p className="text-xs text-ink-500">{lang === 'cn' ? '基线' : 'Baseline'}</p>
                        <p className="text-xs font-mono text-ink-700">{metric.comparison.baseline.toFixed(2)}</p>
                      </div>
                    )}
                    {metric.comparison?.personalBest !== undefined && (
                      <div className="text-right w-24">
                        <p className="text-xs text-ink-500">{lang === 'cn' ? '最佳' : 'PB'}</p>
                        <p className="text-xs font-mono text-ink-700">{metric.comparison.personalBest.toFixed(2)}</p>
                      </div>
                    )}
                    {metric.comparison?.deltaFromBaseline !== undefined && (
                      <div className="text-right w-20">
                        <p className={`text-xs font-mono font-medium ${metric.comparison.deltaFromBaseline > 0 ? 'text-success-600' : metric.comparison.deltaFromBaseline < 0 ? 'text-invalid-600' : 'text-ink-500'}`}>
                          {metric.comparison.deltaFromBaseline > 0 ? '+' : ''}{metric.comparison.deltaFromBaseline.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Visualization — protocol-driven */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-ink-900">
                  {protocol?.visualization.find((v) => v.type === 'force_time_curve')
                    ? (lang === 'cn' ? protocol.visualization.find((v) => v.type === 'force_time_curve')!.titleCn : protocol.visualization.find((v) => v.type === 'force_time_curve')!.title)
                    : (lang === 'cn' ? '可视化' : 'Visualization')}
                </h4>
                <p className="text-xs text-ink-500">{tr('sessions.trial', lang)} {selectedTrial + 1} / {session.trials.length}</p>
              </div>
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            {trial && trial.forceTimeData ? (
              <ForceTimeCurve data={trial.forceTimeData} bodyWeight={athlete ? athlete.weight * 9.81 : 780} height={280} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-ink-400 text-sm">
                {lang === 'cn' ? '该协议无力-时曲线数据' : 'No force-time data for this protocol'}
              </div>
            )}
            <div className="flex items-center gap-2 mt-4">
              {session.trials.map((t, i) => (
                <button key={i} onClick={() => setSelectedTrial(i)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTrial === i ? 'bg-teal-600 text-white' : t.status === 'valid' ? 'bg-ink-100 text-ink-700 hover:bg-ink-200' : 'bg-invalid-50 text-invalid-600 hover:bg-invalid-100'}`}>
                  {t.status === 'valid' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {tr('sessions.trial', lang)} {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '试次对比' : 'Trial Comparison'}</h4>
            <BarChart data={trialBarData} unit="" height={180} />
            <div className="mt-4 space-y-2">
              {session.trials.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-ink-500 w-20">{tr('sessions.trial', lang)} {i + 1}</span>
                  {t.status === 'valid' ? (
                    <><CheckCircle className="w-4 h-4 text-success-500" /><span className="text-ink-700 font-mono text-xs">{Object.entries(t.values).slice(0, 2).map(([k, v]) => `${v.toFixed(1)}`).join(' · ')}</span></>
                  ) : (
                    <><XCircle className="w-4 h-4 text-invalid-500" /><span className="text-invalid-600 text-xs">{t.reason}</span></>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing & Data Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Processing History */}
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-ink-500" />
              <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '处理生命周期' : 'Processing Lifecycle'}</h4>
            </div>
            <div className="space-y-2.5">
              {([
                { status: 'RECEIVED' as SessionStatus, label: { en: 'Received', cn: '已接收' }, desc: session.startedAt },
                { status: 'VALIDATING' as SessionStatus, label: { en: 'Validated', cn: '已验证' }, desc: session.dataQuality.validationPassed ? (lang === 'cn' ? '验证通过' : 'Validation passed') : (lang === 'cn' ? '验证失败' : 'Validation failed') },
                { status: 'PROCESSING' as SessionStatus, label: { en: 'Processed', cn: '已处理' }, desc: `v${session.processingVersion}` },
                { status: 'PUBLISHED' as SessionStatus, label: { en: 'Published', cn: '已发布' }, desc: session.completedAt || '—' },
              ]).map((step, i) => {
                const currentIdx = Object.keys(SESSION_STATUS_CONFIG).indexOf(session.sessionStatus);
                const stepIdx = Object.keys(SESSION_STATUS_CONFIG).indexOf(step.status);
                const isDone = currentIdx > stepIdx || session.sessionStatus === 'PUBLISHED';
                const isCurrent = session.sessionStatus === step.status;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-success-100 text-success-600' : isCurrent ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-300' : 'bg-ink-100 text-ink-400'}`}>
                      {isDone ? <CheckCircle className="w-4 h-4" /> : isCurrent ? <RefreshCw className="w-3.5 h-3.5 animate-sync-spin" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDone || isCurrent ? 'text-ink-900' : 'text-ink-400'}`}>{lang === 'cn' ? step.label.cn : step.label.en}</p>
                      <p className="text-xs text-ink-400">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raw Data References */}
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-ink-500" />
              <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '原始数据' : 'Raw Data'}</h4>
            </div>
            {rawMeasurements.length > 0 ? (
              <div className="space-y-2">
                {rawMeasurements.map((rm) => (
                  <div key={rm.id} className="flex items-center gap-3 p-2 rounded-lg bg-ink-50">
                    <FileJson className="w-4 h-4 text-ink-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-800 truncate">{rm.dataType} · {tr('sessions.trial', lang)} {rm.trialNumber}</p>
                      <p className="text-xs text-ink-400">{rm.sampleRateHz}Hz · {rm.durationMs}ms · {rm.canonical ? (lang === 'cn' ? '已标准化' : 'Canonical') : (lang === 'cn' ? '原始格式' : 'Raw format')}</p>
                    </div>
                  </div>
                ))}
                {processedMeasurements.map((pm) => (
                  <div key={pm.id} className="flex items-center gap-3 p-2 rounded-lg bg-teal-50">
                    <Server className="w-4 h-4 text-teal-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-teal-800 truncate">{lang === 'cn' ? '已处理数据' : 'Processed'} · {tr('sessions.trial', lang)} {pm.trialNumber}</p>
                      <p className="text-xs text-teal-600">{pm.events.length} {lang === 'cn' ? '事件' : 'events'} · {pm.segments.length} {lang === 'cn' ? '分段' : 'segments'} · v{pm.processingVersion}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-400 text-center py-6">{lang === 'cn' ? '无原始数据引用' : 'No raw data references'}</p>
            )}

            {/* API Metadata */}
            <div className="mt-4 pt-4 border-t border-ink-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500">{tr('sessions.idempotencyKey', lang)}</span>
                <span className="font-mono text-ink-700">{session.idempotencyKey}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500">Status URL</span>
                <span className="font-mono text-ink-700 truncate ml-2">{session.statusUrl}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Metadata */}
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-ink-500" />
            <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '记录元数据' : 'Session Metadata'}</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{tr('sessions.processingVersion', lang)}</p><p className="text-sm text-ink-900 font-mono">v{session.processingVersion}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{tr('sessions.quality', lang)}</p><p className={`text-sm font-medium ${session.qualityFlag === 'valid' ? 'text-success-700' : session.qualityFlag === 'questionable' ? 'text-warning-700' : 'text-invalid-700'}`}>{session.qualityFlag}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '总试次' : 'Total Trials'}</p><p className="text-sm text-ink-900 font-mono">{session.trials.length}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{tr('sessions.validTrials', lang)}</p><p className="text-sm text-ink-900 font-mono">{session.trials.filter((t) => t.status === 'valid').length}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{tr('sessions.source', lang)}</p><p className="text-sm text-ink-900 font-mono capitalize">{session.source}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '协议版本' : 'Protocol Version'}</p><p className="text-sm text-ink-900 font-mono">v{protocol?.version || '—'}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
