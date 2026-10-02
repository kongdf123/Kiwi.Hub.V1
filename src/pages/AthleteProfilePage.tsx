import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ATHLETES, DEMO_GROUPS, DEMO_TEAMS, getSessionsForAthlete, getTimelineForAthlete, getSport, getProtocol } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrendChart } from '@/components/ui/TrendChart';
import { RadialGauge } from '@/components/ui/RadialGauge';
import { BarChart } from '@/components/ui/BarChart';
import { ArrowLeft, Dumbbell, TrendingUp, Calendar, Activity, Download, Zap, Waves, Shuffle } from 'lucide-react';

type Tab = 'overview' | 'timeline' | 'trends';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity,
  'sport-sprint': Zap,
  'sport-swim': Waves,
  'sport-hj': TrendingUp,
  'sport-imtp': Dumbbell,
  'sport-cod': Shuffle,
};

export function AthleteProfilePage() {
  const { viewParams, navigate, addToast, lang } = useApp();
  const athleteId = viewParams.athleteId || 'a-1';
  const athlete = DEMO_ATHLETES.find((a) => a.id === athleteId) || DEMO_ATHLETES[0];
  const [tab, setTab] = useState<Tab>('overview');

  const sessions = useMemo(() => getSessionsForAthlete(athleteId), [athleteId]);
  const timeline = useMemo(() => getTimelineForAthlete(athleteId), [athleteId]);
  const team = DEMO_TEAMS.find((t) => t.id === athlete.teamId);
  const athleteGroups = DEMO_GROUPS.filter((g) => athlete.groupIds.includes(g.id));
  const sport = getSport(athlete.sportId);
  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
  const age = Math.floor((Date.now() - new Date(athlete.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000));

  const sportSessions = sessions.filter((s) => s.sportId === athlete.sportId);
  const latestSession = sportSessions[0];
  const previousSession = sportSessions[1];

  const primaryMetricKey = latestSession ? Object.keys(latestSession.summary)[0] : 'jump_height';
  const trendData = sportSessions.reverse().map((s) => ({
    label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
    value: Object.values(s.summary)[0] || 0,
  }));

  const metricLabels: Record<string, { en: string; cn: string; unit: string }> = {
    jump_height: { en: 'Jump Height', cn: '跳跃高度', unit: 'cm' },
    peak_force: { en: 'Peak Force', cn: '峰值力', unit: 'N' },
    peak_power: { en: 'Peak Power', cn: '峰值功率', unit: 'W' },
    rsi_mod: { en: 'RSI-mod', cn: '反应力量指数', unit: '' },
    asymmetry: { en: 'Asymmetry', cn: '不对称性', unit: '%' },
    time_to_takeoff: { en: 'Time to Takeoff', cn: '起跳时间', unit: 'ms' },
    peak_force_imtp: { en: 'Peak Force', cn: '峰值力', unit: 'N' },
    rfd: { en: 'RFD', cn: '发力率', unit: 'N/s' },
    relative_peak_force: { en: 'Relative Peak Force', cn: '相对峰值力', unit: 'N/kg' },
    peak_velocity: { en: 'Peak Velocity', cn: '峰值速度', unit: 'm/s' },
    split_time_30m: { en: '30m Split', cn: '30米分段', unit: 's' },
    ground_contact: { en: 'Ground Contact', cn: '触地时间', unit: 'ms' },
    flight_time: { en: 'Flight Time', cn: '腾空时间', unit: 'ms' },
    stroke_rate: { en: 'Stroke Rate', cn: '划水频率', unit: '/min' },
    stroke_count: { en: 'Stroke Count', cn: '划水次数', unit: '' },
    lap_time: { en: 'Lap Time', cn: '单圈用时', unit: 's' },
    dps: { en: 'DPS', cn: '每划距离', unit: 'm' },
    takeoff_force: { en: 'Takeoff Force', cn: '起跳力', unit: 'N' },
    approach_velocity: { en: 'Approach Velocity', cn: '助跑速度', unit: 'm/s' },
    bar_clearance: { en: 'Bar Clearance', cn: '过杆高度', unit: 'm' },
    cod_time: { en: 'COD Time', cn: '变向时间', unit: 's' },
    deceleration: { en: 'Deceleration', cn: '减速能力', unit: 'm/s²' },
    reacceleration: { en: 'Reacceleration', cn: '再加速能力', unit: 'm/s²' },
  };

  const getMetricLabel = (key: string) => {
    const m = metricLabels[key];
    return m ? (lang === 'cn' ? m.cn : m.en) : key;
  };
  const getMetricUnit = (key: string) => metricLabels[key]?.unit || '';

  return (
    <div>
      <TopBar
        title={`${athlete.lastName} ${athlete.firstName}`}
        subtitle={`${athlete.position} · ${lang === 'cn' ? team?.nameCn : team?.name} · ${age} ${tr('profile.years', lang)}`}
        actions={
          <>
            <button onClick={() => navigate('athletes')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> {tr('common.back', lang)}
            </button>
            <button onClick={() => navigate('sessions', { athleteId: athlete.id })} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Calendar className="w-4 h-4" /> {tr('sessions.title', lang)}
            </button>
          </>
        }
      />
      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex flex-wrap items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xl font-semibold shrink-0">
              {athlete.firstName[0]}{athlete.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold text-ink-900">{athlete.lastName} {athlete.firstName}</h3>
                <StatusBadge status={athlete.status} size="md" lang={lang} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{tr('profile.sport', lang)}</p>
                  <p className="text-sm text-ink-900 font-medium flex items-center gap-1.5">
                    <SportIcon className="w-3.5 h-3.5" />
                    {sport ? (lang === 'cn' ? sport.nameCn : sport.name) : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{tr('profile.position', lang)}</p>
                  <p className="text-sm text-ink-900 font-medium">{athlete.position}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{tr('profile.heightWeight', lang)}</p>
                  <p className="text-sm text-ink-900 font-medium">{athlete.height} cm · {athlete.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{tr('profile.groups', lang)}</p>
                  <p className="text-sm text-ink-900 font-medium">{athleteGroups.length > 0 ? athleteGroups.map((g) => lang === 'cn' ? g.nameCn : g.name).join(', ') : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '标签' : 'Tags'}</p>
                  <div className="flex flex-wrap gap-1">
                    {athlete.tags.length === 0 ? <span className="text-sm text-ink-400">—</span> :
                      athlete.tags.map((tag) => (
                        <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tag === 'Flagged' || tag === 'RTP' ? 'bg-attention-50 text-attention-700' : 'bg-ink-100 text-ink-600'}`}>{tag}</span>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-ink-200">
          {([
            { key: 'overview' as Tab, label: tr('profile.overview', lang), icon: Activity },
            { key: 'timeline' as Tab, label: tr('profile.timeline', lang), icon: Calendar },
            { key: 'trends' as Tab, label: tr('profile.trends', lang), icon: TrendingUp },
          ]).map((t) => {
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
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {latestSession && (
              <>
                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-3">
                    {lang === 'cn' ? '最近测试结果' : 'Latest Results'} — {new Date(latestSession.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(latestSession.summary).slice(0, 4).map(([key, val]) => {
                      const prevVal = previousSession?.summary[key];
                      const delta = prevVal ? val - prevVal : undefined;
                      const baselineVal = athlete.baseline[key];
                      const status: 'normal' | 'warning' | 'attention' = baselineVal ? (val >= baselineVal ? 'normal' : 'warning') : 'normal';
                      return (
                        <MetricCard
                          key={key}
                          label={getMetricLabel(key)}
                          value={val}
                          unit={getMetricUnit(key)}
                          delta={delta}
                          deltaLabel={prevVal ? (lang === 'cn' ? '较上次' : 'vs previous') : (lang === 'cn' ? '首次测试' : 'First test')}
                          status={status}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-ink-200 p-5">
                    <h4 className="text-sm font-semibold text-ink-900 mb-4">{tr('profile.performanceBaseline', lang)}</h4>
                    <div className="flex justify-around items-center py-2">
                      {Object.entries(latestSession.summary).slice(0, 3).map(([key, val]) => {
                        const pb = athlete.personalBest[key];
                        const bl = athlete.baseline[key];
                        return (
                          <RadialGauge
                            key={key}
                            value={val}
                            max={pb ? pb * 1.1 : val * 1.2}
                            label={getMetricLabel(key)}
                            unit={getMetricUnit(key)}
                            size={130}
                            color="#06b56b"
                            warningThreshold={bl}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-ink-200 p-5">
                    <h4 className="text-sm font-semibold text-ink-900 mb-4">{tr('profile.baselineCurrent', lang)}</h4>
                    <BarChart
                      horizontal
                      unit={getMetricUnit(primaryMetricKey)}
                      data={[
                        { label: lang === 'cn' ? '基线' : 'Baseline', value: athlete.baseline[primaryMetricKey] || 0, color: '#c2c8d2' },
                        { label: lang === 'cn' ? '当前' : 'Current', value: Object.values(latestSession.summary)[0] || 0, color: '#06b56b' },
                        { label: lang === 'cn' ? '最佳' : 'Best', value: athlete.personalBest[primaryMetricKey] || 0, color: '#10b981' },
                      ]}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-ink-900">{tr('profile.recentTests', lang)}</h4>
                <button onClick={() => addToast(lang === 'cn' ? '导出（演示）' : 'Export (demo)', 'info')} className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium">
                  <Download className="w-3.5 h-3.5" /> {tr('common.export', lang)}
                </button>
              </div>
              <div className="divide-y divide-ink-100">
                {sessions.slice(0, 5).map((session) => {
                  const sSport = getSport(session.sportId);
                  const SIcon = sSport ? SPORT_ICONS[sSport.id] || Activity : Activity;
                  return (
                    <button
                      key={session.id}
                      onClick={() => navigate('session-detail', { sessionId: session.id })}
                      className="w-full flex items-center gap-4 py-3 hover:bg-ink-50 -mx-2 px-2 rounded-lg transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                        <SIcon className="w-5 h-5 text-ink-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? (getProtocol(session.protocolId)?.nameCn || session.protocolName) : session.protocolName}</p>
                        <p className="text-xs text-ink-500">{new Date(session.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {session.operatorName}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-3 text-xs text-ink-600 font-mono">
                        {Object.entries(session.summary).slice(0, 3).map(([key, val]) => (
                          <span key={key}>{val.toFixed(1)}</span>
                        ))}
                      </div>
                      <StatusBadge status={session.status} lang={lang} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {tab === 'timeline' && (
          <div className="bg-white rounded-xl border border-ink-200 p-6 animate-fade-in">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-ink-200" />
              <div className="space-y-6">
                {timeline.map((event) => {
                  const eSport = getSport(event.sportId || '');
                  const EIcon = eSport ? SPORT_ICONS[eSport.id] || Activity : Activity;
                  return (
                    <div key={event.id} className="relative pl-12">
                      <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-teal-600 ring-4 ring-white" />
                      <button
                        onClick={() => event.sessionId && navigate('session-detail', { sessionId: event.sessionId })}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-ink-900 group-hover:text-teal-700 transition-colors">{event.title}</h4>
                          <span className="text-xs text-ink-400">{new Date(event.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {tab === 'trends' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-1">{getMetricLabel(primaryMetricKey)} {lang === 'cn' ? '趋势' : 'Trend'}</h4>
              <p className="text-xs text-ink-500 mb-4">{lang === 'cn' ? '随时间变化，含基线参考' : 'Over time with baseline reference'}</p>
              <TrendChart data={trendData} unit={getMetricUnit(primaryMetricKey)} height={220} baseline={athlete.baseline[primaryMetricKey]} color="#06b56b" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.keys(latestSession?.summary || {}).slice(1, 3).map((key) => {
                const valTrend = sportSessions.map((s) => ({
                  label: new Date(s.date).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
                  value: s.summary[key] || 0,
                }));
                return (
                  <div key={key} className="bg-white rounded-xl border border-ink-200 p-5">
                    <h4 className="text-sm font-semibold text-ink-900 mb-1">{getMetricLabel(key)} {lang === 'cn' ? '趋势' : 'Trend'}</h4>
                    <p className="text-xs text-ink-500 mb-4">{getMetricUnit(key)}</p>
                    <TrendChart data={valTrend} unit={getMetricUnit(key)} height={180} color={key === 'asymmetry' ? '#f97316' : '#06b56b'} baseline={athlete.baseline[key]} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
