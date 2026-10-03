import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_SESSIONS, DEMO_ATHLETES, getSport, getProtocol, getDataSource, getResultForSession, DEMO_RAW_MEASUREMENTS, DEMO_PROCESSED_MEASUREMENTS } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { ForceTimeCurve } from '@/components/ui/ForceTimeCurve';
import { MetricCard } from '@/components/ui/MetricCard';
import { BarChart } from '@/components/ui/BarChart';
import {
  ArrowLeft, Download, CheckCircle, XCircle, Activity, Info, Zap, Waves,
  TrendingUp, Dumbbell, Shuffle, RefreshCw, Database, FileJson, Clock,
  Server, FileText, AlertCircle, Cpu, BarChart3, type LucideIcon,
} from 'lucide-react';
import type { SessionStatus } from '@/lib/types';

const SPORT_ICONS: Record<string, LucideIcon> = {
  'sport-cmj': Activity, 'sport-sprint': Zap, 'sport-swim': Waves,
  'sport-hj': TrendingUp, 'sport-imtp': Dumbbell, 'sport-cod': Shuffle,
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

const LIFECYCLE_STEPS: { status: SessionStatus; labelEn: string; labelCn: string }[] = [
  { status: 'RECEIVED', labelEn: 'Received', labelCn: '已接收' },
  { status: 'VALIDATING', labelEn: 'Validating', labelCn: '验证中' },
  { status: 'PROCESSING', labelEn: 'Processing', labelCn: '处理中' },
  { status: 'ANALYZED', labelEn: 'Analyzed', labelCn: '已分析' },
  { status: 'PUBLISHED', labelEn: 'Published', labelCn: '已发布' },
];

type Tab = 'overview' | 'trials' | 'metrics' | 'visualization' | 'analysis' | 'rawData' | 'processing' | 'dataQuality' | 'reports';

const TABS: { key: Tab; labelKey: string; icon: LucideIcon }[] = [
  { key: 'overview', labelKey: 'sessionDetail.tab.overview', icon: Activity },
  { key: 'trials', labelKey: 'sessionDetail.tab.trials', icon: CheckCircle },
  { key: 'metrics', labelKey: 'sessionDetail.tab.metrics', icon: BarChart3 },
  { key: 'visualization', labelKey: 'sessionDetail.tab.visualization', icon: BarChart3 },
  { key: 'analysis', labelKey: 'sessionDetail.tab.analysis', icon: Info },
  { key: 'rawData', labelKey: 'sessionDetail.tab.rawData', icon: Database },
  { key: 'processing', labelKey: 'sessionDetail.tab.processing', icon: Cpu },
  { key: 'dataQuality', labelKey: 'sessionDetail.tab.dataQuality', icon: AlertCircle },
  { key: 'reports', labelKey: 'sessionDetail.tab.reports', icon: FileText },
];

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
  const [tab, setTab] = useState<Tab>('overview');
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
  const isFailed = session.sessionStatus.includes('FAILED');
  const isPublished = session.sessionStatus === 'PUBLISHED' || session.sessionStatus === 'ANALYZED';

  const trialBarData = session.trials.map((t, i) => {
    const primaryMetric = protocol?.metrics.find((m) => m.primary);
    const val = primaryMetric ? t.values[primaryMetric.key] : Object.values(t.values)[0];
    return {
      label: `T${i + 1}`,
      value: t.status === 'valid' ? (val || 0) : 0,
      color: t.status === 'valid' ? '#06b56b' : '#fecaca',
    };
  });

  const currentLifecycleIdx = LIFECYCLE_STEPS.findIndex((s) => s.status === session.sessionStatus);

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <InfoCell label={tr('sessions.subject', lang)} value={athlete ? `${athlete.lastName} ${athlete.firstName}` : '—'} />
              <InfoCell label={tr('sessions.date', lang)} value={dateStr} sub={timeStr} />
              <InfoCell label={tr('sessions.source', lang)} value={dataSource ? (lang === 'cn' ? dataSource.nameCn : dataSource.name) : session.source} />
              <InfoCell label={tr('sessions.device', lang)} value={session.deviceSerial} />
              <InfoCell label={lang === 'cn' ? '操作员' : 'Operator'} value={session.operatorName} />
              <InfoCell label={tr('sessions.processingVersion', lang)} value={`v${session.processingVersion}`} />
            </div>

            {isPublished && result && (
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
            )}

            {isFailed && (
              <div className="p-4 bg-invalid-50 rounded-xl border border-invalid-200">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-invalid-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-invalid-800">{lang === 'cn' ? '处理失败' : 'Processing Failed'}</p>
                    <p className="text-xs text-invalid-700 mt-0.5">{lang === 'cn' ? '该记录在处理过程中出现错误，请查看处理选项卡获取详情。' : 'This session encountered errors during processing. See the Processing tab for details.'}</p>
                  </div>
                </div>
              </div>
            )}

            {session.dataQuality.issues.length > 0 && (
              <div className="p-3 bg-warning-50 rounded-lg border border-warning-200">
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
        );

      case 'trials':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                {session.trials.map((t, i) => (
                  <button key={i} onClick={() => setSelectedTrial(i)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTrial === i ? 'bg-teal-600 text-white' : t.status === 'valid' ? 'bg-ink-100 text-ink-700 hover:bg-ink-200' : 'bg-invalid-50 text-invalid-600 hover:bg-invalid-100'}`}>
                    {t.status === 'valid' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {tr('sessions.trial', lang)} {i + 1}
                  </button>
                ))}
              </div>
              {trial && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoCell label={lang === 'cn' ? '状态' : 'Status'} value={trial.status === 'valid' ? (lang === 'cn' ? '有效' : 'Valid') : (lang === 'cn' ? '无效' : 'Invalid')} />
                  {trial.reason && <InfoCell label={lang === 'cn' ? '原因' : 'Reason'} value={trial.reason} />}
                  {Object.entries(trial.values).slice(0, 3).map(([k, v]) => {
                    const metric = protocol?.metrics.find((m) => m.key === k);
                    return <InfoCell key={k} label={metric ? (lang === 'cn' ? metric.nameCn : metric.name) : k} value={v.toFixed(2)} unit={metric?.unit} />;
                  })}
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '试次对比' : 'Trial Comparison'}</h4>
              <BarChart data={trialBarData} height={200} />
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
            <h4 className="text-sm font-semibold text-ink-900 px-5 py-4 border-b border-ink-100">{lang === 'cn' ? '全部指标' : 'All Metrics'}</h4>
            {result && isPublished ? (
              <div className="divide-y divide-ink-50">
                {result.metrics.map((metric) => (
                  <div key={metric.key} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? metric.nameCn : metric.name}</p>
                        {metric.primary && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium">{lang === 'cn' ? '主要' : 'Primary'}</span>}
                      </div>
                      <p className="text-xs text-ink-500">{metric.key}</p>
                    </div>
                    <div className="text-right w-28">
                      <p className="text-sm font-mono font-semibold text-ink-900">{metric.value.toFixed(2)}</p>
                      <p className="text-xs text-ink-400">{metric.unit}</p>
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
            ) : (
              <p className="text-sm text-ink-400 text-center py-8">{lang === 'cn' ? '结果尚未发布' : 'Results not yet published'}</p>
            )}
          </div>
        );

      case 'visualization':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-ink-200 p-5">
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
                <ForceTimeCurve data={trial.forceTimeData} bodyWeight={athlete ? athlete.weight * 9.81 : 780} height={300} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-ink-400 text-sm">
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
              <BarChart data={trialBarData} height={200} />
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '分析备注' : 'Analysis Notes'}</h4>
            {result && result.analysisNotes.length > 0 ? (
              <div className="space-y-2">
                {result.analysisNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-ink-50">
                    <Info className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-ink-700">{note}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-400 text-center py-6">{lang === 'cn' ? '暂无分析备注' : 'No analysis notes available'}</p>
            )}
            {result && (
              <div className="mt-4 pt-4 border-t border-ink-100">
                <h4 className="text-sm font-semibold text-ink-900 mb-2">{lang === 'cn' ? '原始数据引用' : 'Raw Data References'}</h4>
                <p className="text-xs text-ink-500">Dataset: {result.rawDataRef.datasetId || '—'}</p>
                <p className="text-xs text-ink-500">Measurements: {result.rawDataRef.measurementIds.join(', ') || '—'}</p>
              </div>
            )}
          </div>
        );

      case 'rawData':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-ink-500" />
                <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '原始数据' : 'Raw Data'}</h4>
              </div>
              {rawMeasurements.length > 0 ? (
                <div className="space-y-2">
                  {rawMeasurements.map((rm) => (
                    <div key={rm.id} className="flex items-center gap-3 p-3 rounded-lg bg-ink-50">
                      <FileJson className="w-4 h-4 text-ink-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-800 truncate">{rm.dataType} · {tr('sessions.trial', lang)} {rm.trialNumber}</p>
                        <p className="text-xs text-ink-400">{rm.sampleRateHz}Hz · {rm.durationMs}ms · {rm.canonical ? (lang === 'cn' ? '已标准化' : 'Canonical') : (lang === 'cn' ? '原始格式' : 'Raw format')}</p>
                      </div>
                      <button onClick={() => addToast(lang === 'cn' ? '下载原始数据（演示）' : 'Download raw data (demo)', 'info')} className="p-1.5 text-ink-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400 text-center py-6">{lang === 'cn' ? '无原始数据' : 'No raw data'}</p>
              )}
            </div>
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '已处理数据' : 'Processed Data'}</h4>
              </div>
              {processedMeasurements.length > 0 ? (
                <div className="space-y-2">
                  {processedMeasurements.map((pm) => (
                    <div key={pm.id} className="flex items-center gap-3 p-3 rounded-lg bg-teal-50">
                      <Server className="w-4 h-4 text-teal-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-teal-800 truncate">{tr('sessions.trial', lang)} {pm.trialNumber} · v{pm.processingVersion}</p>
                        <p className="text-xs text-teal-600">{pm.events.length} {lang === 'cn' ? '事件' : 'events'} · {pm.segments.length} {lang === 'cn' ? '分段' : 'segments'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400 text-center py-6">{lang === 'cn' ? '无已处理数据' : 'No processed data'}</p>
              )}
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-ink-500" />
                <h4 className="text-sm font-semibold text-ink-900">{tr('sessionDetail.processingLifecycle', lang)}</h4>
              </div>
              <div className="flex items-center gap-1">
                {LIFECYCLE_STEPS.map((step, i) => {
                  const isDone = currentLifecycleIdx > i;
                  const isCurrent = session.sessionStatus === step.status;
                  const isFailedStep = isFailed && i === currentLifecycleIdx;
                  return (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isFailedStep ? 'bg-invalid-100 text-invalid-600' : isDone ? 'bg-success-100 text-success-600' : isCurrent ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-300' : 'bg-ink-100 text-ink-400'}`}>
                          {isFailedStep ? <XCircle className="w-4 h-4" /> : isDone ? <CheckCircle className="w-4 h-4" /> : isCurrent && isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-sync-spin" /> : <span className="text-xs">{i + 1}</span>}
                        </div>
                        <span className={`text-xs font-medium ${isDone || isCurrent ? 'text-ink-900' : 'text-ink-400'}`}>{lang === 'cn' ? step.labelCn : step.labelEn}</span>
                      </div>
                      {i < LIFECYCLE_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 ${isDone ? 'bg-success-300' : 'bg-ink-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {isFailed && (
              <div className="p-4 bg-invalid-50 rounded-xl border border-invalid-200">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-invalid-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-invalid-800">{lang === 'cn' ? '处理失败详情' : 'Processing Failure Details'}</p>
                    <p className="text-xs text-invalid-700 mt-0.5">
                      {session.sessionStatus === 'UPLOAD_FAILED' ? (lang === 'cn' ? '上传过程中发生错误。' : 'Error occurred during upload.') :
                       session.sessionStatus === 'VALIDATION_FAILED' ? (lang === 'cn' ? '数据验证未通过。' : 'Data validation failed.') :
                       (lang === 'cn' ? '处理过程中发生错误。' : 'Error occurred during processing.')}
                    </p>
                    <button onClick={() => addToast(lang === 'cn' ? '重试处理（演示）' : 'Retry processing (demo)', 'info')} className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-invalid-600 hover:bg-invalid-700 text-white text-sm font-medium rounded-lg transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> {tr('common.retryProcessing', lang)}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? 'API 元数据' : 'API Metadata'}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs"><span className="text-ink-500">{tr('sessions.idempotencyKey', lang)}</span><span className="font-mono text-ink-700">{session.idempotencyKey}</span></div>
                <div className="flex items-center justify-between text-xs"><span className="text-ink-500">Status URL</span><span className="font-mono text-ink-700 truncate ml-2">{session.statusUrl}</span></div>
                <div className="flex items-center justify-between text-xs"><span className="text-ink-500">{tr('sessionDetail.algorithmVersion', lang)}</span><span className="font-mono text-ink-700">v{session.processingVersion}</span></div>
                <div className="flex items-center justify-between text-xs"><span className="text-ink-500">{lang === 'cn' ? '协议版本' : 'Protocol Version'}</span><span className="font-mono text-ink-700">v{protocol?.version || '—'}</span></div>
              </div>
            </div>
          </div>
        );

      case 'dataQuality':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-4">{tr('sessions.quality', lang)}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCell label={lang === 'cn' ? '质量状态' : 'Quality Status'} value={session.dataQuality.status === 'complete' ? (lang === 'cn' ? '完整' : 'Complete') : session.dataQuality.status === 'warning' ? (lang === 'cn' ? '警告' : 'Warning') : session.dataQuality.status === 'invalid' ? (lang === 'cn' ? '无效' : 'Invalid') : (lang === 'cn' ? '错误' : 'Error')} />
                <InfoCell label={lang === 'cn' ? '验证通过' : 'Validation Passed'} value={session.dataQuality.validationPassed ? (lang === 'cn' ? '是' : 'Yes') : (lang === 'cn' ? '否' : 'No')} />
                <InfoCell label={lang === 'cn' ? '质量标记' : 'Quality Flag'} value={session.qualityFlag} />
                <InfoCell label={tr('sessions.validTrials', lang)} value={`${session.trials.filter((t) => t.status === 'valid').length} / ${session.trials.length}`} />
              </div>
            </div>
            {session.dataQuality.issues.length > 0 && (
              <div className="bg-white rounded-xl border border-ink-200 p-5">
                <h4 className="text-sm font-semibold text-ink-900 mb-3">{lang === 'cn' ? '问题列表' : 'Issues'}</h4>
                <div className="space-y-2">
                  {session.dataQuality.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-warning-50">
                      <AlertCircle className="w-4 h-4 text-warning-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-warning-800">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'reports':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '报告' : 'Reports'}</h4>
            <p className="text-sm text-ink-600 mb-4">{lang === 'cn' ? '为该记录生成报告。' : 'Generate a report for this session.'}</p>
            <button onClick={() => navigate('reports')} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
              <FileText className="w-4 h-4" /> {tr('common.generateReport', lang)}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

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
            <button onClick={() => addToast(lang === 'cn' ? '导出（演示）' : 'Export (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Download className="w-4 h-4" /> {tr('common.export', lang)}
            </button>
          </>
        }
      />
      <div className="p-6 space-y-6">
        {/* Session Header */}
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                <SportIcon className="w-5 h-5 text-ink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink-900">{lang === 'cn' ? protocol?.nameCn || session.protocolName : session.protocolName}</h3>
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusCfg.color}`}>
                  {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-sync-spin" />}
                  {lang === 'cn' ? statusCfg.cn : statusCfg.en}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${session.dataQuality.status === 'complete' ? 'bg-success-50 text-success-700' : session.dataQuality.status === 'warning' ? 'bg-warning-50 text-warning-700' : 'bg-invalid-50 text-invalid-700'}`}>
                {tr('sessions.quality', lang)}: {session.dataQuality.status === 'complete' ? (lang === 'cn' ? '良好' : 'Good') : session.dataQuality.status === 'warning' ? (lang === 'cn' ? '警告' : 'Warning') : (lang === 'cn' ? '无效' : 'Invalid')}
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-ink-100 text-sm font-medium text-ink-600">v{session.processingVersion}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-ink-200 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.key ? 'border-teal-600 text-teal-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
              >
                <Icon className="w-4 h-4" />
                {tr(t.labelKey, lang)}
              </button>
            );
          })}
        </div>

        {renderTab()}
      </div>
    </div>
  );
}

function InfoCell({ label, value, sub, unit }: { label: string; value: string; sub?: string; unit?: string }) {
  return (
    <div>
      <p className="text-xs text-ink-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-ink-900 font-medium">{value}{unit ? ` ${unit}` : ''}</p>
      {sub && <p className="text-xs text-ink-400">{sub}</p>}
    </div>
  );
}
