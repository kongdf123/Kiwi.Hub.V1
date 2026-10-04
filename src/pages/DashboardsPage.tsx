import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { TrendChart } from '@/components/ui/TrendChart';
import { BarChart } from '@/components/ui/BarChart';
import { MetricCard } from '@/components/ui/MetricCard';
import { Sparkline } from '@/components/ui/Sparkline';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_SESSIONS, DEMO_ATHLETES, DEMO_PROTOCOLS, getSport, getProtocol } from '@/lib/demo-data';
import { getMetricLabel, getMetricUnit } from '@/lib/metrics';
import { BarChart3, Download, LayoutDashboard, Plus, Settings2, X } from 'lucide-react';

interface DashboardWidget {
  id: string;
  type: 'kpi' | 'trend' | 'bar' | 'athletes';
  titleEn: string;
  titleCn: string;
  config?: Record<string, string>;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'w1', type: 'kpi', titleEn: 'Key Metrics', titleCn: '关键指标' },
  { id: 'w2', type: 'trend', titleEn: 'Team Performance Trend', titleCn: '团队表现趋势', config: { metric: 'jump_height' } },
  { id: 'w3', type: 'bar', titleEn: 'Status Distribution', titleCn: '状态分布' },
  { id: 'w4', type: 'athletes', titleEn: 'Athlete Performance', titleCn: '运动员表现' },
];

const WIDGET_TYPES: { type: DashboardWidget['type']; labelEn: string; labelCn: string; icon: typeof BarChart3 }[] = [
  { type: 'kpi', labelEn: 'KPI Cards', labelCn: '指标卡片', icon: LayoutDashboard },
  { type: 'trend', labelEn: 'Trend Chart', labelCn: '趋势图', icon: BarChart3 },
  { type: 'bar', labelEn: 'Bar Chart', labelCn: '柱状图', icon: BarChart3 },
  { type: 'athletes', labelEn: 'Athlete List', labelCn: '运动员列表', icon: LayoutDashboard },
];

const allMetrics = DEMO_PROTOCOLS.flatMap((p) => p.metrics).filter((m, i, arr) => arr.findIndex((x) => x.key === m.key) === i);

export function DashboardsPage() {
  const { lang, addToast } = useApp();
  const [widgets, setWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS);
  const [showEditor, setShowEditor] = useState(false);

  const trendData = DEMO_SESSIONS.slice().reverse().map((s) => ({
    label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
    value: Object.values(s.summary)[0] || 0,
  }));

  const statusDist = [
    { label: lang === 'cn' ? '正常' : 'Normal', value: DEMO_ATHLETES.filter((a) => a.status === 'normal').length, color: '#06b56b' },
    { label: lang === 'cn' ? '警告' : 'Warning', value: DEMO_ATHLETES.filter((a) => a.status === 'warning').length, color: '#fbbf24' },
    { label: lang === 'cn' ? '需关注' : 'Attention', value: DEMO_ATHLETES.filter((a) => a.status === 'attention').length, color: '#f97316' },
  ];

  const removeWidget = (id: string) => setWidgets((prev) => prev.filter((w) => w.id !== id));

  const addWidget = (type: DashboardWidget['type']) => {
    const wt = WIDGET_TYPES.find((w) => w.type === type)!;
    setWidgets((prev) => [...prev, {
      id: `w${Date.now()}`,
      type,
      titleEn: wt.labelEn,
      titleCn: wt.labelCn,
      config: type === 'trend' ? { metric: 'jump_height' } : undefined,
    }]);
  };

  const renderWidget = (w: DashboardWidget) => {
    switch (w.type) {
      case 'kpi':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label={tr('home.athletes', lang)} value={DEMO_ATHLETES.length} />
            <MetricCard label={tr('home.recentSessions', lang)} value={DEMO_SESSIONS.length} />
            <MetricCard label={tr('nav.protocols', lang)} value={DEMO_PROTOCOLS.length} />
            <MetricCard label={tr('home.attentionFlags', lang)} value={DEMO_ATHLETES.filter((a) => a.status === 'attention').length} status="attention" />
          </div>
        );
      case 'trend': {
        const metricKey = w.config?.metric || 'jump_height';
        const data = DEMO_SESSIONS.slice().reverse().map((s) => ({
          label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
          value: s.summary[metricKey] || Object.values(s.summary)[0] || 0,
        }));
        return <TrendChart data={data} height={200} color="#06b56b" unit={getMetricUnit(metricKey)} />;
      }
      case 'bar':
        return <BarChart data={statusDist} height={200} />;
      case 'athletes':
        return (
          <div className="divide-y divide-ink-50">
            {DEMO_ATHLETES.map((athlete) => {
              const sessions = DEMO_SESSIONS.filter((s) => s.athleteId === athlete.id);
              const trend = sessions.reverse().map((s) => Object.values(s.summary)[0] || 0);
              const latest = sessions[0];
              const protocol = latest ? getProtocol(latest.protocolId) : undefined;
              return (
                <div key={athlete.id} className="flex items-center gap-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center text-sm font-medium text-ink-600 shrink-0">
                    {athlete.firstName[0]}{athlete.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{athlete.lastName} {athlete.firstName}</p>
                    <p className="text-xs text-ink-500">{protocol ? (lang === 'cn' ? protocol.nameCn : protocol.name) : '—'}</p>
                  </div>
                  {trend.length > 1 && <Sparkline data={trend} width={60} height={24} />}
                  <StatusBadge status={athlete.status} lang={lang} />
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <TopBar
        title={tr('nav.dashboards', lang)}
        subtitle={lang === 'cn' ? '可配置团队表现仪表盘' : 'Configurable team performance dashboards'}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${showEditor ? 'bg-teal-600 text-white' : 'text-ink-700 bg-white border border-ink-200 hover:bg-ink-50'}`}
            >
              <Settings2 className="w-4 h-4" /> {lang === 'cn' ? '编辑仪表盘' : 'Edit Dashboard'}
            </button>
            <button onClick={() => addToast(lang === 'cn' ? '导出仪表盘（演示）' : 'Export dashboard (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> {tr('common.export', lang)}
            </button>
          </div>
        }
      />
      <div className="p-6 space-y-6">
        {/* Widget Editor Panel */}
        {showEditor && (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '添加组件' : 'Add Widgets'}</h4>
            <div className="flex flex-wrap gap-2">
              {WIDGET_TYPES.map((wt) => {
                const Icon = wt.icon;
                return (
                  <button
                    key={wt.type}
                    onClick={() => addWidget(wt.type)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-600 bg-ink-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <Icon className="w-4 h-4" />
                    {lang === 'cn' ? wt.labelCn : wt.labelEn}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-ink-400 mt-3">{lang === 'cn' ? '点击添加组件，点击组件右上角删除按钮移除。' : 'Click to add widgets. Use the X button on each widget to remove it.'}</p>
          </div>
        )}

        {/* Render widgets */}
        {widgets.map((w) => (
          <div key={w.id} className="bg-white rounded-xl border border-ink-200 p-5 relative group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? w.titleCn : w.titleEn}</h4>
              {showEditor && (
                <button
                  onClick={() => removeWidget(w.id)}
                  className="p-1 text-ink-300 hover:text-invalid-600 hover:bg-invalid-50 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {w.type === 'trend' && showEditor && (
              <div className="mb-3">
                <select
                  value={w.config?.metric || 'jump_height'}
                  onChange={(e) => setWidgets((prev) => prev.map((pw) => pw.id === w.id ? { ...pw, config: { ...pw.config, metric: e.target.value } } : pw))}
                  className="text-xs bg-ink-50 border border-ink-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  {allMetrics.map((m) => <option key={m.key} value={m.key}>{lang === 'cn' ? m.nameCn : m.name}</option>)}
                </select>
              </div>
            )}
            {renderWidget(w)}
          </div>
        ))}

        {widgets.length === 0 && (
          <div className="bg-ink-50 rounded-xl border-2 border-dashed border-ink-200 p-12 text-center">
            <LayoutDashboard className="w-10 h-10 text-ink-300 mx-auto mb-3" />
            <p className="text-sm text-ink-500">{lang === 'cn' ? '仪表盘为空，请添加组件。' : 'Dashboard is empty. Add widgets to get started.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
