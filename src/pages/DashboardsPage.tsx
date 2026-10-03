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
import { BarChart3, Download, FileText } from 'lucide-react';

export function DashboardsPage() {
  const { lang, addToast } = useApp();

  const trendData = DEMO_SESSIONS.slice().reverse().map((s) => ({
    label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
    value: Object.values(s.summary)[0] || 0,
  }));

  const statusDist = [
    { label: lang === 'cn' ? '正常' : 'Normal', value: DEMO_ATHLETES.filter((a) => a.status === 'normal').length, color: '#06b56b' },
    { label: lang === 'cn' ? '警告' : 'Warning', value: DEMO_ATHLETES.filter((a) => a.status === 'warning').length, color: '#fbbf24' },
    { label: lang === 'cn' ? '需关注' : 'Attention', value: DEMO_ATHLETES.filter((a) => a.status === 'attention').length, color: '#f97316' },
  ];

  return (
    <div>
      <TopBar
        title={tr('nav.dashboards', lang)}
        subtitle={lang === 'cn' ? '团队级表现仪表盘' : 'Team-level performance dashboards'}
        actions={
          <button onClick={() => addToast(lang === 'cn' ? '导出仪表盘（演示）' : 'Export dashboard (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> {tr('common.export', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label={tr('home.athletes', lang)} value={DEMO_ATHLETES.length} />
          <MetricCard label={tr('home.recentSessions', lang)} value={DEMO_SESSIONS.length} />
          <MetricCard label={tr('nav.protocols', lang)} value={DEMO_PROTOCOLS.length} />
          <MetricCard label={tr('home.attentionFlags', lang)} value={DEMO_ATHLETES.filter((a) => a.status === 'attention').length} status="attention" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '团队表现趋势' : 'Team Performance Trend'}</h4>
            </div>
            <TrendChart data={trendData} height={200} color="#06b56b" />
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '状态分布' : 'Status Distribution'}</h4>
            <BarChart data={statusDist} height={200} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '运动员表现' : 'Athlete Performance'}</h4>
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
        </div>
      </div>
    </div>
  );
}
