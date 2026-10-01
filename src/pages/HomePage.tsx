import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ATHLETES, DEMO_SESSIONS, DEMO_TEAMS, DEMO_DEVICES, DEMO_IMPORTS, DEMO_SYNC_LOGS, getSessionsForAthlete, getSport } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge, StatusDot } from '@/components/ui/StatusBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { TrendChart } from '@/components/ui/TrendChart';
import { Upload, AlertCircle, ArrowRight, Clock, Activity, Database, CheckCircle, AlertTriangle, RefreshCw, XCircle, Zap, Waves, TrendingUp, Shuffle } from 'lucide-react';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity,
  'sport-sprint': Zap,
  'sport-swim': Waves,
  'sport-hj': TrendingUp,
  'sport-imtp': Dumbbell,
  'sport-cod': Shuffle,
};

export function HomePage() {
  const { navigate, selectedTeamId, lang } = useApp();
  const team = DEMO_TEAMS.find((t) => t.id === selectedTeamId) || DEMO_TEAMS[0];
  const teamAthletes = DEMO_ATHLETES.filter((a) => a.teamId === selectedTeamId);
  const attentionAthletes = teamAthletes.filter((a) => a.status === 'attention' || a.status === 'warning');
  const recentSessions = [...DEMO_SESSIONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  const testedThisWeek = teamAthletes.filter((a) => a.lastTestDate).length;
  const pendingTests = teamAthletes.length - testedThisWeek;
  const onlineDevices = DEMO_DEVICES.filter((d) => d.status !== 'offline').length;
  const syncIssues = DEMO_SYNC_LOGS.filter((s) => s.status !== 'success').length;

  const avgJumpHeight = teamAthletes
    .map((a) => getSessionsForAthlete(a.id).find((s) => s.sportId === 'sport-cmj')?.summary.jump_height)
    .filter((v): v is number => v !== undefined);
  const teamTrend = avgJumpHeight.length > 0 ? [
    { label: lang === 'cn' ? '5月' : 'May', value: 44.2 },
    { label: lang === 'cn' ? '6月' : 'Jun', value: 45.8 },
    { label: lang === 'cn' ? '7月' : 'Jul', value: 46.5 },
    { label: lang === 'cn' ? '8月' : 'Aug', value: 47.1 },
    { label: lang === 'cn' ? '9月' : 'Sep', value: avgJumpHeight.reduce((a, b) => a + b, 0) / avgJumpHeight.length },
  ] : [];

  return (
    <div>
      <TopBar
        title={tr('nav.home', lang)}
        subtitle={`${lang === 'cn' ? team.nameCn : team.name} · ${team.season} ${lang === 'cn' ? '赛季' : 'season'}`}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label={tr('home.athletes', lang)} value={teamAthletes.length} delta={0} deltaLabel={tr('home.active', lang)} sparkData={[8, 8, 8, 8]} status="normal" />
          <MetricCard label={tr('home.testedThisWeek', lang)} value={testedThisWeek} delta={pendingTests > 0 ? -pendingTests : 0} deltaLabel={`${pendingTests} ${tr('home.pending', lang)}`} status={pendingTests > 2 ? 'warning' : 'normal'} sparkData={[3, 5, 4, 6]} />
          <MetricCard label={tr('home.attentionFlags', lang)} value={attentionAthletes.length} delta={0} deltaLabel={tr('home.needsReview', lang)} status={attentionAthletes.length > 2 ? 'attention' : 'warning'} sparkData={[1, 2, 3, 2]} />
          <MetricCard label={tr('home.dataSync', lang)} value={onlineDevices + '/' + DEMO_DEVICES.length} delta={syncIssues > 0 ? -syncIssues : 0} deltaLabel={syncIssues > 0 ? tr('home.syncIssues', lang) : tr('home.syncHealthy', lang)} status={syncIssues > 0 ? 'warning' : 'normal'} sparkData={[4, 3, 4, 4]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '队伍跳跃高度趋势' : 'Team Jump Height Trend'}</h3>
                <p className="text-xs text-ink-500">{lang === 'cn' ? '全队平均CMJ跳跃高度' : 'Average CMJ jump height across all athletes'}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <TrendChart data={teamTrend} unit="cm" height={200} baseline={45} color="#06b56b" />
          </div>

          {/* Attention List */}
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
                  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
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

        {/* Multi-Sport Recent Sessions */}
        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-ink-500" />
              <h3 className="text-sm font-semibold text-ink-900">{tr('home.recentSessions', lang)}</h3>
            </div>
            <button onClick={() => navigate('athletes')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
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
                  onClick={() => navigate('session-detail', { sessionId: session.id })}}
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

        {/* Data Sync Status Mini-Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '设备状态' : 'Device Status'}</h3>
              <button onClick={() => navigate('management')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">{tr('common.viewAll', lang)}</button>
            </div>
            <div className="space-y-2">
              {DEMO_DEVICES.map((device) => (
                <div key={device.id} className="flex items-center gap-3 py-2 border-b border-ink-50 last:border-0">
                  <StatusDot status={device.status} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-800 truncate">{device.serialNumber}</p>
                    <p className="text-xs text-ink-400">{device.type} · {device.location}</p>
                  </div>
                  <span className="text-xs text-ink-400">{device.battery > 0 ? `${device.battery}%` : '—'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '数据导入' : 'Data Imports'}</h3>
              <button onClick={() => navigate('data')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">{tr('common.viewAll', lang)}</button>
            </div>
            <div className="space-y-2">
              {DEMO_IMPORTS.slice(0, 4).map((job) => {
                const Icon = job.status === 'completed' ? CheckCircle : job.status === 'failed' ? XCircle : job.status === 'processing' ? RefreshCw : AlertTriangle;
                const color = job.status === 'completed' ? 'text-success-600' : job.status === 'failed' ? 'text-invalid-600' : job.status === 'processing' ? 'text-teal-600' : 'text-warning-600';
                return (
                  <div key={job.id} className="flex items-center gap-3 py-2 border-b border-ink-50 last:border-0">
                    <Icon className={`w-4 h-4 shrink-0 ${color} ${job.status === 'processing' ? 'animate-sync-spin' : ''}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-800 truncate">{job.fileName}</p>
                      <p className="text-xs text-ink-400">{job.processedRows}/{job.totalRows} {tr('data.rows', lang)}</p>
                    </div>
                    {job.status === 'processing' && (
                      <div className="w-16 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${job.progress}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
