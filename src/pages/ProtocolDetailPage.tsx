import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { DEMO_PROTOCOLS, getSport } from '@/lib/demo-data';
import {
  ArrowLeft, Activity, Zap, Waves, TrendingUp, Dumbbell, Shuffle,
  BookOpen, Cpu, BarChart3, GitCompare, FileText, History, CheckCircle,
  Settings2, ListChecks, FlaskConical, Database, Clock, type LucideIcon,
} from 'lucide-react';

const SPORT_ICONS: Record<string, LucideIcon> = {
  'sport-cmj': Activity, 'sport-sprint': Zap, 'sport-swim': Waves,
  'sport-hj': TrendingUp, 'sport-imtp': Dumbbell, 'sport-cod': Shuffle,
};

const CAPTURE_MODE_LABELS: Record<string, { en: string; cn: string }> = {
  force_plate: { en: 'Force Plate', cn: '测力台' },
  timing: { en: 'Timing', cn: '计时' },
  video: { en: 'Video', cn: '视频' },
  manual: { en: 'Manual', cn: '手动' },
  sensor: { en: 'Sensor', cn: '传感器' },
};

const DIFFICULTY_CONFIG = {
  basic: { label: { en: 'Basic', cn: '基础' }, color: 'bg-success-50 text-success-700 border-success-200' },
  standard: { label: { en: 'Standard', cn: '标准' }, color: 'bg-teal-50 text-teal-700 border-teal-200' },
  advanced: { label: { en: 'Advanced', cn: '高级' }, color: 'bg-attention-50 text-attention-700 border-attention-200' },
};

const COMPARISON_LABELS: Record<string, { en: string; cn: string }> = {
  baseline: { en: 'Baseline', cn: '基线' },
  personal_best: { en: 'Personal Best', cn: '个人最佳' },
  team_average: { en: 'Team Average', cn: '团队均值' },
  normative: { en: 'Normative', cn: '常模' },
};

type Tab = 'overview' | 'input' | 'trials' | 'validation' | 'processing' | 'metrics' | 'visualization' | 'comparison' | 'report' | 'versions';

const TABS: { key: Tab; labelKey: string; icon: LucideIcon }[] = [
  { key: 'overview', labelKey: 'protocolDetail.tab.overview', icon: BookOpen },
  { key: 'input', labelKey: 'protocolDetail.tab.input', icon: Database },
  { key: 'trials', labelKey: 'protocolDetail.tab.trials', icon: ListChecks },
  { key: 'validation', labelKey: 'protocolDetail.tab.validation', icon: CheckCircle },
  { key: 'processing', labelKey: 'protocolDetail.tab.processing', icon: Cpu },
  { key: 'metrics', labelKey: 'protocolDetail.tab.metrics', icon: BarChart3 },
  { key: 'visualization', labelKey: 'protocolDetail.tab.visualization', icon: BarChart3 },
  { key: 'comparison', labelKey: 'protocolDetail.tab.comparison', icon: GitCompare },
  { key: 'report', labelKey: 'protocolDetail.tab.report', icon: FileText },
  { key: 'versions', labelKey: 'protocolDetail.tab.versions', icon: History },
];

export function ProtocolDetailPage() {
  const { viewParams, navigate, lang } = useApp();
  const protocolId = viewParams.protocolId || DEMO_PROTOCOLS[0].id;
  const protocol = DEMO_PROTOCOLS.find((p) => p.id === protocolId) || DEMO_PROTOCOLS[0];
  const [tab, setTab] = useState<Tab>('overview');

  const sport = getSport(protocol.sportId);
  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
  const diff = DIFFICULTY_CONFIG[protocol.difficulty];
  const captureMode = CAPTURE_MODE_LABELS[protocol.input.captureMode] || { en: protocol.input.captureMode, cn: protocol.input.captureMode };

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-2">{lang === 'cn' ? '描述' : 'Description'}</h4>
              <p className="text-sm text-ink-600">{lang === 'cn' ? protocol.descriptionCn : protocol.description}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard icon={Settings2} label={tr('protocolDetail.captureMode', lang)} value={lang === 'cn' ? captureMode.cn : captureMode.en} />
              <InfoCard icon={Database} label={tr('protocolDetail.dataTypes', lang)} value={protocol.input.dataTypes.join(', ')} />
              <InfoCard icon={ListChecks} label={tr('protocolDetail.trials', lang)} value={`${protocol.input.trials}`} />
              <InfoCard icon={Cpu} label={tr('protocolDetail.processingVersion', lang)} value={`v${protocol.processing.processingVersion}`} />
              <InfoCard icon={FlaskConical} label={tr('protocolDetail.duration', lang)} value={`${protocol.durationMin} ${tr('library.duration', lang)}`} />
              <InfoCard icon={Activity} label={tr('protocolDetail.difficulty', lang)} value={lang === 'cn' ? diff.label.cn : diff.label.en} />
              <InfoCard icon={BookOpen} label={tr('protocolDetail.deviceType', lang)} value={protocol.deviceType} />
              <InfoCard icon={BarChart3} label={tr('library.metrics', lang)} value={`${protocol.metrics.length}`} />
            </div>
          </div>
        );

      case 'input':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5 space-y-4">
            <h4 className="text-sm font-semibold text-ink-900">{tr('protocolDetail.tab.input', lang)}</h4>
            <div className="grid grid-cols-2 gap-4">
              <InfoCard icon={Settings2} label={tr('protocolDetail.captureMode', lang)} value={lang === 'cn' ? captureMode.cn : captureMode.en} />
              <InfoCard icon={Database} label={tr('protocolDetail.dataTypes', lang)} value={protocol.input.dataTypes.join(', ')} />
              <InfoCard icon={ListChecks} label={tr('protocolDetail.trials', lang)} value={`${protocol.input.trials}`} />
              <InfoCard icon={Clock} label={tr('protocolDetail.trialInterval', lang)} value={`${protocol.input.trialIntervalSec}s`} />
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider mb-2">{tr('protocolDetail.dataTypes', lang)}</p>
              <div className="flex flex-wrap gap-2">
                {protocol.input.dataTypes.map((dt) => (
                  <span key={dt} className="text-sm px-3 py-1 rounded-lg bg-ink-100 text-ink-700">{dt}</span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'trials':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5 space-y-3">
            <h4 className="text-sm font-semibold text-ink-900">{tr('protocolDetail.tab.trials', lang)}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard icon={ListChecks} label={tr('protocolDetail.trials', lang)} value={`${protocol.input.trials}`} />
              <InfoCard icon={Clock} label={tr('protocolDetail.trialInterval', lang)} value={`${protocol.input.trialIntervalSec}s`} />
            </div>
            <div className="divide-y divide-ink-50">
              {Array.from({ length: protocol.input.trials }, (_, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-medium">{i + 1}</div>
                  <span className="text-sm text-ink-700">{tr('sessions.trial', lang)} {i + 1}</span>
                  <span className="text-xs text-ink-400 ml-auto">{i > 0 ? `${i * protocol.input.trialIntervalSec}s ${lang === 'cn' ? '间隔' : 'interval'}` : (lang === 'cn' ? '首次' : 'First')}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'validation':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5 space-y-3">
            <h4 className="text-sm font-semibold text-ink-900">{tr('protocolDetail.tab.validation', lang)}</h4>
            <div className="space-y-2">
              {(lang === 'cn' ? protocol.validityRulesCn : protocol.validityRules).map((rule, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-ink-50">
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-ink-700">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5 space-y-4">
            <h4 className="text-sm font-semibold text-ink-900">{tr('protocolDetail.tab.processing', lang)}</h4>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider mb-2">{tr('protocolDetail.processingVersion', lang)}</p>
              <span className="text-sm font-mono font-medium text-ink-900">v{protocol.processing.processingVersion}</span>
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider mb-2">{lang === 'cn' ? '处理步骤' : 'Processing Steps'}</p>
              <div className="space-y-2">
                {protocol.processing.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-ink-50">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-medium shrink-0">{i + 1}</div>
                    <span className="text-sm text-ink-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider mb-2">{tr('protocolDetail.eventDetection', lang)}</p>
              <div className="flex flex-wrap gap-2">
                {protocol.processing.eventDetection.map((evt, i) => (
                  <span key={i} className="text-sm px-3 py-1 rounded-lg bg-ink-100 text-ink-700">{evt}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider mb-2">{tr('protocolDetail.formulaRefs', lang)}</p>
              <div className="flex flex-wrap gap-2">
                {protocol.processing.formulaRefs.map((f, i) => (
                  <span key={i} className="text-sm font-mono px-3 py-1 rounded-lg bg-teal-50 text-teal-700">{f}</span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
            <h4 className="text-sm font-semibold text-ink-900 px-5 py-4 border-b border-ink-100">{tr('protocolDetail.tab.metrics', lang)}</h4>
            <div className="divide-y divide-ink-50">
              {protocol.metrics.map((m) => (
                <div key={m.key} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? m.nameCn : m.name}</p>
                      {m.primary && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium">{lang === 'cn' ? '主要' : 'Primary'}</span>}
                    </div>
                    <p className="text-xs text-ink-500">{m.key}</p>
                    {m.description && <p className="text-xs text-ink-400 mt-0.5">{lang === 'cn' ? m.descriptionCn : m.description}</p>}
                  </div>
                  <span className="text-sm font-mono text-ink-600 w-16 text-right">{m.unit || '—'}</span>
                  <span className={`text-xs w-24 text-right ${m.higherIsBetter ? 'text-success-600' : 'text-warning-600'}`}>
                    {m.higherIsBetter ? '↑' : '↓'} {tr('protocolDetail.higherIsBetter', lang)}
                  </span>
                  {m.threshold && (
                    <div className="text-xs text-ink-500 w-32 text-right">
                      <span className="text-warning-600">W:{m.threshold.warning}</span>
                      <span className="mx-1">·</span>
                      <span className="text-attention-600">A:{m.threshold.attention}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'visualization':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {protocol.visualization.map((viz, i) => (
              <div key={i} className="bg-white rounded-xl border border-ink-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? viz.titleCn : viz.title}</h4>
                </div>
                <p className="text-xs text-ink-500 mb-3">{viz.type}</p>
                <div className="h-24 rounded-lg bg-ink-50 flex items-center justify-center text-xs text-ink-400">
                  {lang === 'cn' ? '可视化预览' : 'Visualization preview'}
                </div>
              </div>
            ))}
          </div>
        );

      case 'comparison':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5 space-y-3">
            <h4 className="text-sm font-semibold text-ink-900">{tr('protocolDetail.tab.comparison', lang)}</h4>
            <div className="space-y-2">
              {protocol.comparison.map((cmp, i) => {
                const lbl = COMPARISON_LABELS[cmp.type] || { en: cmp.label, cn: cmp.labelCn };
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-ink-50">
                    <GitCompare className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-ink-700">{lang === 'cn' ? lbl.cn : lbl.en}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'report':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-3">{tr('protocolDetail.tab.report', lang)}</h4>
            <p className="text-sm text-ink-600">{lang === 'cn' ? '该方案支持的报告类型和模板配置。' : 'Report types and template configuration for this protocol.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm px-3 py-1 rounded-lg bg-teal-50 text-teal-700">{lang === 'cn' ? '表现报告' : 'Performance Report'}</span>
              <span className="text-sm px-3 py-1 rounded-lg bg-ink-100 text-ink-600">{lang === 'cn' ? '生物力学报告' : 'Biomechanics Report'}</span>
            </div>
          </div>
        );

      case 'versions':
        return (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-3">{tr('protocolDetail.tab.versions', lang)}</h4>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-teal-50 border border-teal-200">
              <History className="w-5 h-5 text-teal-600" />
              <div>
                <p className="text-sm font-medium text-teal-800">v{protocol.version}</p>
                <p className="text-xs text-teal-600">{lang === 'cn' ? '当前版本' : 'Current version'}</p>
              </div>
            </div>
            <p className="text-xs text-ink-400 mt-3">{tr('protocolDetail.noVersions', lang)}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <TopBar
        title={tr('protocolDetail.title', lang)}
        subtitle={`${lang === 'cn' ? protocol.nameCn : protocol.name} · v${protocol.version}`}
        actions={
          <button onClick={() => navigate('protocols')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" /> {tr('common.back', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {/* Protocol header */}
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-ink-100 flex items-center justify-center">
              <SportIcon className="w-6 h-6 text-ink-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-ink-900">{lang === 'cn' ? protocol.nameCn : protocol.name}</h3>
                <span className="text-xs font-mono text-ink-400">v{protocol.version}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${diff.color}`}>
                  {lang === 'cn' ? diff.label.cn : diff.label.en}
                </span>
              </div>
              <p className="text-sm text-ink-500 mt-0.5">{sport ? (lang === 'cn' ? sport.nameCn : sport.name) : ''} · {protocol.deviceType}</p>
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
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.key ? 'border-teal-600 text-teal-700' : 'border-transparent text-ink-500 hover:text-ink-700'
                }`}
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

function InfoCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-ink-200 p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-ink-400" />
        <p className="text-xs text-ink-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm text-ink-900 font-medium">{value}</p>
    </div>
  );
}
