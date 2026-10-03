import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { ForceTimeCurve } from '@/components/ui/ForceTimeCurve';
import { MetricCard } from '@/components/ui/MetricCard';
import { BarChart } from '@/components/ui/BarChart';
import { DEMO_RESULTS, DEMO_SESSIONS, DEMO_ATHLETES, getProtocol, getAthlete } from '@/lib/demo-data';
import { ArrowLeft, BarChart3, Activity, CheckCircle, XCircle, Download, Info } from 'lucide-react';

type Tab = 'overview' | 'metrics' | 'visualization' | 'analysis';

export function ResultDetailPage() {
  const { viewParams, navigate, addToast, lang } = useApp();
  const sessionId = viewParams.sessionId || DEMO_SESSIONS[0].id;
  const result = DEMO_RESULTS.find((r) => r.sessionId === sessionId);
  const session = DEMO_SESSIONS.find((s) => s.id === sessionId);
  const [tab, setTab] = useState<Tab>('overview');

  if (!result || !session) {
    return (
      <div>
        <TopBar title={tr('results.detail', lang)} />
        <div className="p-6"><p className="text-sm text-ink-500">{lang === 'cn' ? '未找到结果' : 'Result not found'}</p></div>
      </div>
    );
  }

  const athlete = getAthlete(result.subjectId);
  const protocol = getProtocol(result.protocolId);
  const trial = session.trials[0];

  const trialBarData = result.trialResults.map((t) => ({
    label: `T${t.number}`,
    value: t.status === 'valid' ? Object.values(t.values)[0] || 0 : 0,
    color: t.status === 'valid' ? '#06b56b' : '#fecaca',
  }));

  const TABS: { key: Tab; labelKey: string; icon: typeof Activity }[] = [
    { key: 'overview', labelKey: 'result.tab.overview', icon: Activity },
    { key: 'metrics', labelKey: 'result.tab.metrics', icon: BarChart3 },
    { key: 'visualization', labelKey: 'result.tab.visualization', icon: BarChart3 },
    { key: 'analysis', labelKey: 'result.tab.analysis', icon: Info },
  ];

  return (
    <div>
      <TopBar
        title={tr('results.detail', lang)}
        subtitle={`${athlete?.lastName} ${athlete?.firstName} · ${protocol ? (lang === 'cn' ? protocol.nameCn : protocol.name) : session.protocolName}`}
        actions={
          <>
            <button onClick={() => navigate('results')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> {tr('common.back', lang)}
            </button>
            <button onClick={() => addToast(lang === 'cn' ? '导出（演示）' : 'Export (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Download className="w-4 h-4" /> {tr('common.export', lang)}
            </button>
          </>
        }
      />
      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-ink-200">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.key ? 'border-teal-600 text-teal-700' : 'border-transparent text-ink-500 hover:text-ink-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tr(t.labelKey, lang)}
              </button>
            );
          })}
        </div>

        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Primary metric */}
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

            {/* Trial results */}
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-4">{tr('results.trialResults', lang)}</h4>
              <div className="space-y-2">
                {result.trialResults.map((t) => (
                  <div key={t.number} className="flex items-center gap-3 py-2">
                    {t.status === 'valid' ? <CheckCircle className="w-4 h-4 text-success-500" /> : <XCircle className="w-4 h-4 text-invalid-500" />}
                    <span className="text-sm text-ink-600">{tr('sessions.trial', lang)} {t.number}</span>
                    <div className="flex-1 flex items-center gap-3 text-xs text-ink-600 font-mono">
                      {Object.entries(t.values).slice(0, 3).map(([k, v]) => (
                        <span key={k}>{v.toFixed(1)}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'metrics' && (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
            <h4 className="text-sm font-semibold text-ink-900 px-5 py-4 border-b border-ink-100">{lang === 'cn' ? '全部指标' : 'All Metrics'}</h4>
            <div className="divide-y divide-ink-50">
              {result.metrics.map((metric) => (
                <div key={metric.key} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? metric.nameCn : metric.name}</p>
                    <p className="text-xs text-ink-500">{metric.key}</p>
                  </div>
                  <span className="text-sm font-mono font-semibold text-ink-900 w-24 text-right">
                    {metric.value.toFixed(2)} <span className="text-xs text-ink-400 font-normal">{metric.unit}</span>
                  </span>
                  {metric.comparison?.baseline !== undefined && (
                    <div className="text-right w-24">
                      <p className="text-xs text-ink-500">{lang === 'cn' ? '基线' : 'Baseline'}</p>
                      <p className="text-xs font-mono text-ink-700">{metric.comparison.baseline.toFixed(2)}</p>
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
        )}

        {tab === 'visualization' && (
          <div className="space-y-6">
            {trial?.forceTimeData && (
              <div className="bg-white rounded-xl border border-ink-200 p-5">
                <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '力-时曲线' : 'Force-Time Curve'}</h4>
                <ForceTimeCurve data={trial.forceTimeData} height={300} bodyWeight={athlete ? athlete.weight * 9.81 : 780} />
              </div>
            )}
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '试次对比' : 'Trial Comparison'}</h4>
              <BarChart data={trialBarData} height={200} />
            </div>
          </div>
        )}

        {tab === 'analysis' && (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '分析备注' : 'Analysis Notes'}</h4>
            <div className="space-y-2">
              {result.analysisNotes.map((note, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-ink-50">
                  <Info className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-ink-700">{note}</span>
                </div>
              ))}
            </div>
            {/* Raw data reference */}
            <div className="mt-4 pt-4 border-t border-ink-100">
              <h4 className="text-sm font-semibold text-ink-900 mb-2">{lang === 'cn' ? '原始数据引用' : 'Raw Data References'}</h4>
              <p className="text-xs text-ink-500">Dataset: {result.rawDataRef.datasetId || '—'}</p>
              <p className="text-xs text-ink-500">Measurements: {result.rawDataRef.measurementIds.join(', ') || '—'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
