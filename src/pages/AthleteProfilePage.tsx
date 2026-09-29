import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { DEMO_ATHLETES, DEMO_GROUPS, DEMO_TEAMS, getSessionsForAthlete, getTimelineForAthlete } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrendChart } from '@/components/ui/TrendChart';
import { RadialGauge } from '@/components/ui/RadialGauge';
import { BarChart } from '@/components/ui/BarChart';
import { ArrowLeft, Dumbbell, TrendingUp, Calendar, Activity, FileText, Download } from 'lucide-react';

type Tab = 'overview' | 'timeline' | 'trends';

export function AthleteProfilePage() {
  const { viewParams, navigate, addToast } = useApp();
  const athleteId = viewParams.athleteId || 'a-1';
  const athlete = DEMO_ATHLETES.find((a) => a.id === athleteId) || DEMO_ATHLETES[0];
  const [tab, setTab] = useState<Tab>('overview');

  const sessions = useMemo(() => getSessionsForAthlete(athleteId), [athleteId]);
  const timeline = useMemo(() => getTimelineForAthlete(athleteId), [athleteId]);
  const team = DEMO_TEAMS.find((t) => t.id === athlete.teamId);
  const athleteGroups = DEMO_GROUPS.filter((g) => athlete.groupIds.includes(g.id));
  const age = Math.floor((Date.now() - new Date(athlete.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000));

  const cmjSessions = sessions.filter((s) => s.testType === 'CMJ');
  const latestCMJ = cmjSessions[0];
  const previousCMJ = cmjSessions[1];

  const jumpHeightTrend = cmjSessions.reverse().map((s) => ({
    label: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: s.summary.jump_height || 0,
  }));

  const asymmetryTrend = cmjSessions.map((s) => ({
    label: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: s.summary.asymmetry || 0,
  }));

  return (
    <div>
      <TopBar
        title={`${athlete.lastName} ${athlete.firstName}`}
        subtitle={`${athlete.position} · ${team?.name} · ${age} years`}
        actions={
          <>
            <button onClick={() => navigate('athletes')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => navigate('test-capture', { athleteId: athlete.id })} className="flex items-center gap-2 px-3 py-2 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Dumbbell className="w-4 h-4" /> New Test
            </button>
          </>
        }
      />
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex flex-wrap items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-xl font-semibold shrink-0">
              {athlete.firstName[0]}{athlete.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold text-ink-900">{athlete.lastName} {athlete.firstName}</h3>
                <StatusBadge status={athlete.status} size="md" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">Sport</p>
                  <p className="text-sm text-ink-900 font-medium">{athlete.sport}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">Position</p>
                  <p className="text-sm text-ink-900 font-medium">{athlete.position}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">Height / Weight</p>
                  <p className="text-sm text-ink-900 font-medium">{athlete.height} cm · {athlete.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">Groups</p>
                  <p className="text-sm text-ink-900 font-medium">{athleteGroups.length > 0 ? athleteGroups.map((g) => g.name).join(', ') : 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-ink-200">
          {([
            { key: 'overview', label: 'Overview', icon: Activity },
            { key: 'timeline', label: 'Timeline', icon: Calendar },
            { key: 'trends', label: 'Trends', icon: TrendingUp },
          ] as { key: Tab; label: string; icon: typeof Activity }[]).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.key ? 'border-accent-600 text-accent-700' : 'border-transparent text-ink-500 hover:text-ink-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {latestCMJ && (
              <>
                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-3">Latest CMJ Results — {new Date(latestCMJ.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                      label="Jump Height"
                      value={latestCMJ.summary.jump_height || 0}
                      unit="cm"
                      delta={previousCMJ ? (latestCMJ.summary.jump_height || 0) - (previousCMJ.summary.jump_height || 0) : undefined}
                      deltaLabel={previousCMJ ? 'vs previous' : 'First test'}
                      status={(latestCMJ.summary.jump_height || 0) >= athlete.baseline.jump_height ? 'normal' : 'warning'}
                    />
                    <MetricCard
                      label="Peak Force"
                      value={latestCMJ.summary.peak_force || 0}
                      unit="N"
                      delta={previousCMJ ? (latestCMJ.summary.peak_force || 0) - (previousCMJ.summary.peak_force || 0) : undefined}
                      deltaLabel={previousCMJ ? 'vs previous' : 'First test'}
                      status="normal"
                    />
                    <MetricCard
                      label="RSI-mod"
                      value={latestCMJ.summary.rsi_mod || 0}
                      delta={previousCMJ ? (latestCMJ.summary.rsi_mod || 0) - (previousCMJ.summary.rsi_mod || 0) : undefined}
                      deltaLabel={previousCMJ ? 'vs previous' : 'First test'}
                      status="normal"
                    />
                    <MetricCard
                      label="Asymmetry"
                      value={latestCMJ.summary.asymmetry || 0}
                      unit="%"
                      delta={previousCMJ ? (latestCMJ.summary.asymmetry || 0) - (previousCMJ.summary.asymmetry || 0) : undefined}
                      deltaLabel={(latestCMJ.summary.asymmetry || 0) > 10 ? 'Above threshold' : 'Within range'}
                      status={(latestCMJ.summary.asymmetry || 0) > 10 ? 'attention' : (latestCMJ.summary.asymmetry || 0) > 7 ? 'warning' : 'normal'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-ink-200 p-5">
                    <h4 className="text-sm font-semibold text-ink-900 mb-4">Performance vs Baseline</h4>
                    <div className="flex justify-around items-center py-2">
                      <RadialGauge
                        value={latestCMJ.summary.jump_height || 0}
                        max={athlete.personalBest.jump_height * 1.1}
                        label="Jump Height"
                        unit="cm"
                        size={140}
                        warningThreshold={athlete.baseline.jump_height}
                      />
                      <RadialGauge
                        value={latestCMJ.summary.peak_force || 0}
                        max={athlete.personalBest.peak_force * 1.1}
                        label="Peak Force"
                        unit="N"
                        size={140}
                        warningThreshold={athlete.baseline.peak_force}
                      />
                      <RadialGauge
                        value={latestCMJ.summary.asymmetry || 0}
                        max={20}
                        label="Asymmetry"
                        unit="%"
                        size={140}
                        color="#10b981"
                        warningThreshold={7}
                        attentionThreshold={10}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-ink-200 p-5">
                    <h4 className="text-sm font-semibold text-ink-900 mb-4">Baseline vs Current vs Personal Best</h4>
                    <BarChart
                      horizontal
                      unit="cm"
                      data={[
                        { label: 'Baseline', value: athlete.baseline.jump_height, color: '#b1b8c8' },
                        { label: 'Current', value: latestCMJ.summary.jump_height || 0, color: '#3384fc' },
                        { label: 'Personal Best', value: athlete.personalBest.jump_height, color: '#10b981' },
                      ]}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-ink-900">Recent Tests</h4>
                <button onClick={() => addToast('Export coming soon', 'info')} className="flex items-center gap-1.5 text-sm text-accent-600 hover:text-accent-700 font-medium">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
              <div className="divide-y divide-ink-100">
                {sessions.slice(0, 5).map((session) => (
                  <button
                    key={session.id}
                    onClick={() => navigate('test-result', { sessionId: session.id })}
                    className="w-full flex items-center gap-4 py-3 hover:bg-ink-50 -mx-2 px-2 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5 text-ink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900">{session.protocolName}</p>
                      <p className="text-xs text-ink-500">{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {session.operatorName}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-xs text-ink-600 font-mono">
                      {Object.entries(session.summary).slice(0, 3).map(([key, val]) => (
                        <span key={key}>{val.toFixed(1)}</span>
                      ))}
                    </div>
                    <StatusBadge status={session.status} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'timeline' && (
          <div className="bg-white rounded-xl border border-ink-200 p-6 animate-fade-in">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-ink-200" />
              <div className="space-y-6">
                {timeline.map((event) => (
                  <div key={event.id} className="relative pl-12">
                    <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-accent-600 ring-4 ring-white" />
                    <button
                      onClick={() => event.sessionId && navigate('test-result', { sessionId: event.sessionId })}
                      className="w-full text-left group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-ink-900 group-hover:text-accent-700 transition-colors">{event.title}</h4>
                        <span className="text-xs text-ink-400">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {event.metrics && event.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-2">
                          {event.metrics.map((m, i) => (
                            <div key={i} className="bg-ink-50 rounded-lg px-3 py-1.5">
                              <span className="text-xs text-ink-500">{m.name}: </span>
                              <span className="text-sm font-mono font-medium text-ink-900">{m.value.toFixed(1)}{m.unit && ` ${m.unit}`}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'trends' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-1">Jump Height Trend</h4>
              <p className="text-xs text-ink-500 mb-4">CMJ jump height over time with baseline reference</p>
              <TrendChart data={jumpHeightTrend} unit="cm" height={220} baseline={athlete.baseline.jump_height} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-ink-200 p-5">
                <h4 className="text-sm font-semibold text-ink-900 mb-1">Asymmetry Trend</h4>
                <p className="text-xs text-ink-500 mb-4">Left-right force asymmetry percentage</p>
                <TrendChart data={asymmetryTrend} unit="%" height={180} color="#f97316" baseline={10} />
              </div>
              <div className="bg-white rounded-xl border border-ink-200 p-5">
                <h4 className="text-sm font-semibold text-ink-900 mb-1">RSI-mod Trend</h4>
                <p className="text-xs text-ink-500 mb-4">Reactive Strength Index modified</p>
                <TrendChart
                  data={cmjSessions.map((s) => ({ label: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: s.summary.rsi_mod || 0 }))}
                  height={180}
                  color="#10b981"
                  baseline={athlete.baseline.rsi_mod}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
