import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ATHLETES, DEMO_TEAMS, DEMO_SESSIONS, getSessionsForAthlete, getSport } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard } from '@/components/ui/MetricCard';
import { TrendChart } from '@/components/ui/TrendChart';
import { BarChart } from '@/components/ui/BarChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { TrendingUp, Activity, Users, AlertCircle, Download } from 'lucide-react';

export function TeamDashboardPage() {
  const { selectedTeamId, lang, addToast, navigate } = useApp();
  const team = DEMO_TEAMS.find((t) => t.id === selectedTeamId) || DEMO_TEAMS[0];
  const teamAthletes = DEMO_ATHLETES.filter((a) => a.teamId === selectedTeamId);

  const sport = getSport(team.sportId);
  const teamSessions = DEMO_SESSIONS.filter((s) => teamAthletes.some((a) => a.id === s.athleteId));

  const testedCount = teamAthletes.filter((a) => a.lastTestDate).length;
  const attentionCount = teamAthletes.filter((a) => a.status === 'attention' || a.status === 'warning').length;
  const avgPrimary = teamAthletes.map((a) => {
    const sessions = getSessionsForAthlete(a.id);
    return sessions[0] ? Object.values(sessions[0].summary)[0] : undefined;
  }).filter((v): v is number => v !== undefined);
  const avgValue = avgPrimary.length > 0 ? avgPrimary.reduce((a, b) => a + b, 0) / avgPrimary.length : 0;

  const trendData = [
    { label: lang === 'cn' ? '5月' : 'May', value: avgValue * 0.92 },
    { label: lang === 'cn' ? '6月' : 'Jun', value: avgValue * 0.96 },
    { label: lang === 'cn' ? '7月' : 'Jul', value: avgValue * 0.98 },
    { label: lang === 'cn' ? '8月' : 'Aug', value: avgValue * 0.99 },
    { label: lang === 'cn' ? '9月' : 'Sep', value: avgValue },
  ];

  const distributionData = teamAthletes.map((a) => {
    const sessions = getSessionsForAthlete(a.id);
    const val = sessions[0] ? Object.values(sessions[0].summary)[0] || 0 : 0;
    return { label: a.lastName, value: val, color: a.status === 'attention' ? '#f97316' : a.status === 'warning' ? '#fbbf24' : '#06b56b' };
  }).sort((a, b) => b.value - a.value);

  const statusDist = [
    { label: tr('common.normal', lang), value: teamAthletes.filter((a) => a.status === 'normal').length, color: '#10b981' },
    { label: tr('common.warning', lang), value: teamAthletes.filter((a) => a.status === 'warning').length, color: '#fbbf24' },
    { label: tr('common.attention', lang), value: teamAthletes.filter((a) => a.status === 'attention').length, color: '#f97316' },
  ].filter((d) => d.value > 0);

  return (
    <div>
      <TopBar
        title={tr('nav.dashboard', lang)}
        subtitle={`${lang === 'cn' ? team.nameCn : team.name} · ${team.season}`}
        actions={
          <button onClick={() => addToast(lang === 'cn' ? '导出已开始' : 'Export started', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> {tr('common.export', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label={tr('home.athletes', lang)} value={teamAthletes.length} deltaLabel={tr('home.active', lang)} status="normal" />
          <MetricCard label={tr('home.testedThisWeek', lang)} value={testedCount} delta={teamAthletes.length - testedCount} deltaLabel={`${teamAthletes.length - testedCount} ${tr('home.pending', lang)}`} status="normal" />
          <MetricCard label={tr('home.attentionFlags', lang)} value={attentionCount} deltaLabel={tr('home.needsReview', lang)} status={attentionCount > 2 ? 'attention' : 'warning'} />
          <MetricCard label={lang === 'cn' ? '平均表现' : 'Avg Performance'} value={avgValue} delta={trendData.length > 1 ? avgValue - trendData[0].value : 0} deltaLabel={tr('home.vsStart', lang)} status="normal" sparkData={trendData.map((t) => t.value)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '队伍表现趋势' : 'Team Performance Trend'}</h3>
                <p className="text-xs text-ink-500">{sport ? (lang === 'cn' ? sport.nameCn : sport.name) : ''} · {lang === 'cn' ? '全队平均' : 'team average'}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <TrendChart data={trendData} height={220} color="#06b56b" />
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '状态分布' : 'Status Distribution'}</h3>
            <BarChart data={statusDist} height={160} />
            <div className="mt-4 space-y-2">
              {teamAthletes.map((a) => {
                const sessions = getSessionsForAthlete(a.id);
                const val = sessions[0] ? Object.values(sessions[0].summary)[0] : undefined;
                return (
                  <button key={a.id} onClick={() => navigate('athlete-profile', { athleteId: a.id })} className="w-full flex items-center gap-2 py-1.5 hover:bg-ink-50 -mx-2 px-2 rounded-lg transition-colors text-left">
                    <span className="text-sm text-ink-700 flex-1 truncate">{a.lastName} {a.firstName}</span>
                    {val !== undefined && <Sparkline data={[val * 0.9, val * 0.95, val]} width={40} height={16} color={a.status === 'attention' ? '#f97316' : '#06b56b'} />}
                    <StatusBadge status={a.status} lang={lang} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '运动员排名' : 'Athlete Ranking'}</h3>
          <BarChart horizontal data={distributionData} />
        </div>

        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '最近测试活动' : 'Recent Test Activity'}</h3>
          <div className="divide-y divide-ink-100">
            {teamSessions.slice(0, 5).map((session) => {
              const athlete = DEMO_ATHLETES.find((a) => a.id === session.athleteId);
              if (!athlete) return null;
              return (
                <button key={session.id} onClick={() => navigate('session-detail', { sessionId: session.id })} className="w-full flex items-center gap-4 py-3 hover:bg-ink-50 -mx-2 px-2 rounded-lg transition-colors text-left">
                  <div className="w-9 h-9 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-ink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900">{athlete.lastName} {athlete.firstName}</p>
                    <p className="text-xs text-ink-500">{lang === 'cn' ? session.protocolName : session.protocolName} · {session.operatorName}</p>
                  </div>
                  <div className="hidden sm:flex gap-3 text-xs text-ink-600 font-mono">
                    {Object.entries(session.summary).slice(0, 3).map(([k, v]) => <span key={k}>{v.toFixed(1)}</span>)}
                  </div>
                  <StatusBadge status={session.status} lang={lang} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
