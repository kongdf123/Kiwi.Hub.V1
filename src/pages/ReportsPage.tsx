import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ATHLETES, DEMO_PROTOCOLS, DEMO_TEAMS, DEMO_SPORTS } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { FileText, Download, Plus, CheckCircle, ChevronRight, ChevronLeft, Eye, Clock, File, User, Users, Activity, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const STEPS: { key: WizardStep; labelKey: string; icon: LucideIcon }[] = [
  { key: 0, labelKey: 'reports.step.scope', icon: User },
  { key: 1, labelKey: 'reports.step.protocolMetrics', icon: Activity },
  { key: 2, labelKey: 'reports.step.timeRange', icon: Clock },
  { key: 3, labelKey: 'reports.step.visualization', icon: BarChart3 },
  { key: 4, labelKey: 'reports.step.preview', icon: Eye },
  { key: 5, labelKey: 'reports.step.generate', icon: FileText },
  { key: 6, labelKey: 'reports.step.scope', icon: Download },
];

interface ReportItem {
  id: string;
  name: string;
  nameCn: string;
  type: string;
  createdAt: string;
  status: 'ready' | 'generating' | 'scheduled';
  athletes: number;
}

const DEMO_REPORTS: ReportItem[] = [
  { id: 'r-1', name: 'Weekly Performance Summary', nameCn: '周表现总结', type: 'summary', createdAt: '2026-09-28T10:00:00Z', status: 'ready', athletes: 8 },
  { id: 'r-2', name: 'Pre-season Baseline Report', nameCn: '赛季前基线报告', type: 'baseline', createdAt: '2026-09-25T14:00:00Z', status: 'ready', athletes: 32 },
  { id: 'r-3', name: 'Athlete Comparison: Sprint Group', nameCn: '冲刺组对比报告', type: 'comparison', createdAt: '2026-09-29T09:00:00Z', status: 'generating', athletes: 6 },
  { id: 'r-4', name: 'Monthly Trend Analysis', nameCn: '月度趋势分析', type: 'trend', createdAt: '2026-09-20T08:00:00Z', status: 'scheduled', athletes: 24 },
];

const SCOPE_OPTIONS = [
  { key: 'subject', labelKey: 'reports.scope.subject', icon: User },
  { key: 'team', labelKey: 'reports.scope.team', icon: Users },
  { key: 'session', labelKey: 'reports.scope.session', icon: File },
  { key: 'performance', labelKey: 'reports.scope.performance', icon: Activity },
];

export function ReportsPage() {
  const { lang, addToast } = useApp();
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState<WizardStep>(0);
  const [scope, setScope] = useState('subject');
  const [reportName, setReportName] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('all');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('30');

  const statusConfig = {
    ready: { label: { en: 'Ready', cn: '已生成' }, color: 'text-success-700 bg-success-50', icon: CheckCircle },
    generating: { label: { en: 'Generating', cn: '生成中' }, color: 'text-teal-700 bg-teal-50', icon: Clock },
    scheduled: { label: { en: 'Scheduled', cn: '已排期' }, color: 'text-ink-600 bg-ink-100', icon: Clock },
  };

  const allMetrics = DEMO_PROTOCOLS.flatMap((p) => p.metrics).filter((m, i, arr) => arr.findIndex((x) => x.key === m.key) === i);

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return selectedProtocol !== 'all' || selectedMetrics.length > 0;
    return true;
  };

  const handleGenerate = () => {
    addToast(lang === 'cn' ? '报告生成中...' : 'Report generating...', 'success');
    setShowWizard(false);
    setStep(0);
  };

  const renderWizardStep = () => {
    switch (step) {
      case 0: // Scope
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">{lang === 'cn' ? '报告名称' : 'Report Name'}</label>
              <input type="text" value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder={lang === 'cn' ? '输入报告名称...' : 'Enter report name...'} className="w-full px-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">{lang === 'cn' ? '选择范围' : 'Select Scope'}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SCOPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setScope(opt.key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${scope === opt.key ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tr(opt.labelKey, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {scope === 'subject' && (
              <div>
                <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">{lang === 'cn' ? '选择受试者' : 'Select Subjects'}</label>
                <select className="w-full px-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <option>{lang === 'cn' ? '全部受试者' : 'All Subjects'}</option>
                  {DEMO_ATHLETES.map((a) => <option key={a.id}>{a.lastName} {a.firstName}</option>)}
                </select>
              </div>
            )}
            {scope === 'team' && (
              <div>
                <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">{lang === 'cn' ? '选择队伍' : 'Select Team'}</label>
                <select className="w-full px-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400">
                  {DEMO_TEAMS.map((t) => <option key={t.id}>{lang === 'cn' ? t.nameCn : t.name}</option>)}
                </select>
              </div>
            )}
          </div>
        );

      case 1: // Protocol & Metrics
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">{tr('common.protocol', lang)}</label>
              <select value={selectedProtocol} onChange={(e) => setSelectedProtocol(e.target.value)} className="w-full px-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="all">{tr('sessions.allProtocols', lang)}</option>
                {DEMO_PROTOCOLS.map((p) => <option key={p.id} value={p.id}>{lang === 'cn' ? p.nameCn : p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">{tr('common.allMetrics', lang)}</label>
              <div className="flex flex-wrap gap-2">
                {allMetrics.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => toggleMetric(m.key)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${selectedMetrics.includes(m.key) ? 'bg-teal-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
                  >
                    {lang === 'cn' ? m.nameCn : m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Time Range
        return (
          <div className="space-y-4">
            <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">{tr('common.timeRange', lang)}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: '7', label: tr('common.last7days', lang) },
                { key: '30', label: tr('common.last30days', lang) },
                { key: '90', label: tr('common.last90days', lang) },
                { key: 'season', label: tr('common.thisSeason', lang) },
                { key: 'all', label: tr('common.allTime', lang) },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setTimeRange(opt.key)}
                  className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${timeRange === opt.key ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 3: // Visualization
        return (
          <div className="space-y-4">
            <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">{lang === 'cn' ? '可视化选项' : 'Visualization Options'}</label>
            <div className="space-y-2">
              {[
                { key: 'trend', label: lang === 'cn' ? '趋势图' : 'Trend Chart' },
                { key: 'comparison', label: lang === 'cn' ? '对比图' : 'Comparison Chart' },
                { key: 'table', label: lang === 'cn' ? '数据表' : 'Data Table' },
                { key: 'cards', label: lang === 'cn' ? '指标卡片' : 'Metric Cards' },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-3 p-3 rounded-lg bg-ink-50 cursor-pointer hover:bg-ink-100 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400" />
                  <span className="text-sm text-ink-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4: // Preview
        return (
          <div className="space-y-4">
            <div className="bg-ink-50 rounded-xl border border-ink-200 p-8 text-center">
              <FileText className="w-12 h-12 text-ink-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-ink-900 mb-1">{reportName || (lang === 'cn' ? '未命名报告' : 'Untitled Report')}</h4>
              <p className="text-xs text-ink-500">
                {tr(SCOPE_OPTIONS.find((s) => s.key === scope)?.labelKey || 'reports.scope.subject', lang)} ·
                {' '}{selectedMetrics.length} {tr('library.metrics', lang)} ·
                {' '}{timeRange === 'all' ? tr('common.allTime', lang) : timeRange === 'season' ? tr('common.thisSeason', lang) : `${timeRange} ${lang === 'cn' ? '天' : 'days'}`}
              </p>
            </div>
          </div>
        );

      case 5: // Generate
        return (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-12 h-12 text-success-500 mx-auto" />
            <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '准备生成报告' : 'Ready to Generate'}</h4>
            <p className="text-sm text-ink-500">{lang === 'cn' ? '点击生成按钮创建报告。' : 'Click generate to create the report.'}</p>
          </div>
        );

      case 6: // Download / Share
        return (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-12 h-12 text-success-500 mx-auto" />
            <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '报告已生成' : 'Report Generated'}</h4>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => addToast(lang === 'cn' ? '下载已开始' : 'Download started', 'info')} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                <Download className="w-4 h-4" /> {tr('common.download', lang)}
              </button>
              <button onClick={() => addToast(lang === 'cn' ? '分享链接已复制' : 'Share link copied', 'info')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
                {lang === 'cn' ? '分享' : 'Share'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <TopBar
        title={tr('reports.title', lang)}
        subtitle={tr('reports.subtitle', lang)}
        actions={
          <button onClick={() => { setShowWizard(true); setStep(0); }} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> {lang === 'cn' ? '创建报告' : 'Create Report'}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {showWizard && (
          <div className="bg-white rounded-xl border border-ink-200 p-6">
            {/* Step indicator */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isDone = step > i;
                const isCurrent = step === i;
                return (
                  <div key={i} className="flex items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-success-100 text-success-600' : isCurrent ? 'bg-teal-600 text-white' : 'bg-ink-100 text-ink-400'}`}>
                      {isDone ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    {i < STEPS.length - 1 && <div className={`w-8 h-0.5 mx-0.5 ${isDone ? 'bg-success-300' : 'bg-ink-200'}`} />}
                  </div>
                );
              })}
            </div>

            <h3 className="text-sm font-semibold text-ink-900 mb-4">
              {tr(STEPS[step].labelKey, lang)}
            </h3>

            {renderWizardStep()}

            {/* Wizard Navigation */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-ink-100">
              <button
                onClick={() => step > 0 && setStep((step - 1) as WizardStep)}
                disabled={step === 0}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-600 disabled:opacity-40 hover:text-ink-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> {lang === 'cn' ? '上一步' : 'Previous'}
              </button>
              {step < 5 ? (
                <button
                  onClick={() => canProceed() && setStep((step + 1) as WizardStep)}
                  disabled={!canProceed()}
                  className="flex items-center gap-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {lang === 'cn' ? '下一步' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
              ) : step === 5 ? (
                <button onClick={handleGenerate} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <FileText className="w-4 h-4" /> {tr('common.generate', lang)}
                </button>
              ) : (
                <button onClick={() => { setShowWizard(false); setStep(0); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
                  {lang === 'cn' ? '完成' : 'Done'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reports list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_REPORTS.map((report) => {
            const cfg = statusConfig[report.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={report.id} className="bg-white rounded-xl border border-ink-200 p-5 hover:border-ink-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-ink-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-ink-600" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                    <StatusIcon className={`w-3 h-3 ${report.status === 'generating' ? 'animate-sync-spin' : ''}`} />
                    {lang === 'cn' ? cfg.label.cn : cfg.label.en}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-ink-900 mb-1">{lang === 'cn' ? report.nameCn : report.name}</h3>
                <p className="text-xs text-ink-500 mb-3">{report.athletes} {lang === 'cn' ? '名运动员' : 'athletes'} · {new Date(report.createdAt).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-ink-100">
                  <button onClick={() => addToast(lang === 'cn' ? '预览（演示）' : 'Preview (demo)', 'info')} className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
                    <Eye className="w-3.5 h-3.5" /> {tr('common.preview', lang)}
                  </button>
                  {report.status === 'ready' && (
                    <button onClick={() => addToast(lang === 'cn' ? '下载已开始' : 'Download started', 'info')} className="flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-ink-800 ml-auto">
                      <Download className="w-3.5 h-3.5" /> {tr('common.download', lang)}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
