import { useApp } from '@/lib/app-context';
import { DEMO_ATHLETES, DEMO_SESSIONS, DEMO_TEAMS, getSessionsForAthlete } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge, StatusDot } from '@/components/ui/StatusBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { TrendChart } from '@/components/ui/TrendChart';
import { Dumbbell, AlertCircle, Calendar, TrendingUp, Users, ArrowRight, Clock, Activity } from 'lucide-react';

export function HomePage() {
  const { navigate, selectedTeamId } = useApp();
  const team = DEMO_TEAMS.find((t) => t.id === selectedTeamId) || DEMO_TEAMS[0];
  const teamAthletes = DEMO_ATHLETES.filter((a) => a.teamId === selectedTeamId);
  const attentionAthletes = teamAthletes.filter((a) => a.status === 'attention' || a.status === 'warning');
  const recentSessions = [...DEMO_SESSIONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const testedThisWeek = teamAthletes.filter((a) => a.lastTestDate).length;
  const pendingTests = teamAthletes.length - testedThisWeek;

  const avgJumpHeight = teamAthletes
    .map((a) => getSessionsForAthlete(a.id).find((s) => s.testType === 'CMJ')?.summary.jump_height)
    .filter((v): v is number => v !== undefined);
  const teamTrend = avgJumpHeight.length > 0 ? [
    { label: 'May', value: 44.2 },
    { label: 'Jun', value: 45.8 },
    { label: 'Jul', value: 46.5 },
    { label: 'Aug', value: 47.1 },
    { label: 'Sep', value: avgJumpHeight.reduce((a, b) => a + b, 0) / avgJumpHeight.length },
  ] : [];

  return (
    <div>
      <TopBar
        title="Home"
        subtitle={`${team.name} · ${team.season} season`}
        actions={
          <button
            onClick={() => navigate('testing')}
            className="flex items-center gap-2 px-3 py-2 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Dumbbell className="w-4 h-4" />
            Start Testing
          </button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Athletes" value={teamAthletes.length} delta={0} deltaLabel="Active roster" sparkData={[8, 8, 8, 8]} status="normal" />
          <MetricCard label="Tested This Week" value={testedThisWeek} unit="" delta={pendingTests > 0 ? -pendingTests : 0} deltaLabel={`${pendingTests} pending`} status={pendingTests > 2 ? 'warning' : 'normal'} sparkData={[3, 5, 4, 6]} />
          <MetricCard label="Avg Jump Height" value={teamTrend.length > 0 ? teamTrend[teamTrend.length - 1].value : 0} unit="cm" delta={teamTrend.length > 1 ? teamTrend[teamTrend.length - 1].value - teamTrend[0].value : 0} deltaLabel="vs start of season" status="normal" sparkData={teamTrend.map((t) => t.value)} />
          <MetricCard label="Attention Flags" value={attentionAthletes.length} delta={0} deltaLabel="Needs review" status={attentionAthletes.length > 2 ? 'attention' : 'warning'} sparkData={[1, 2, 3, 2]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Team Jump Height Trend</h3>
                <p className="text-xs text-ink-500">Average CMJ jump height across all athletes</p>
              </div>
              <TrendingUp className="w-5 h-5 text-accent-600" />
            </div>
            <TrendChart data={teamTrend} unit="cm" height={200} baseline={45} />
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink-900">Needs Attention</h3>
              <AlertCircle className="w-5 h-5 text-attention-600" />
            </div>
            <div className="space-y-3">
              {attentionAthletes.length === 0 ? (
                <p className="text-sm text-ink-400 text-center py-8">All athletes within normal range</p>
              ) : (
                attentionAthletes.map((athlete) => (
                  <button
                    key={athlete.id}
                    onClick={() => navigate('athlete-profile', { athleteId: athlete.id })}
                    className="w-full flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-ink-50 transition-colors text-left"
                  >
                    <StatusDot status={athlete.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{athlete.lastName} {athlete.firstName}</p>
                      <p className="text-xs text-ink-500 truncate">{athlete.position} · {athlete.lastTestType}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-400 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-ink-500" />
              <h3 className="text-sm font-semibold text-ink-900">Recent Test Sessions</h3>
            </div>
            <button onClick={() => navigate('athletes')} className="text-sm text-accent-600 hover:text-accent-700 font-medium">
              View all
            </button>
          </div>
          <div className="divide-y divide-ink-100">
            {recentSessions.map((session) => {
              const athlete = DEMO_ATHLETES.find((a) => a.id === session.athleteId);
              if (!athlete) return null;
              const date = new Date(session.date);
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              return (
                <button
                  key={session.id}
                  onClick={() => navigate('test-result', { sessionId: session.id })}
                  className="w-full flex items-center gap-4 px-5 py-3 hover:bg-ink-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-ink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900">{athlete.lastName} {athlete.firstName}</p>
                    <p className="text-xs text-ink-500">{session.protocolName} · {session.operatorName}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-ink-500">
                    {Object.entries(session.summary).slice(0, 3).map(([key, val]) => (
                      <span key={key} className="font-mono">
                        {val.toFixed(1)}
                      </span>
                    ))}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-ink-700">{dateStr}</p>
                    <p className="text-xs text-ink-400">{timeStr}</p>
                  </div>
                  <StatusBadge status={session.status} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
