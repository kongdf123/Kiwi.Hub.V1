import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { ForceTimeCurve } from '@/components/ui/ForceTimeCurve';
import { DEMO_SESSIONS, DEMO_PROTOCOLS, DEMO_ATHLETES } from '@/lib/demo-data';
import { Waves, Activity, Zap, Video, Users, Radio, Navigation, Flag } from 'lucide-react';

const CHANNELS = [
  { key: 'force', labelKey: 'biomechanics.force', icon: Activity, color: '#06b56b' },
  { key: 'motion', labelKey: 'biomechanics.motion', icon: Users, color: '#3b82f6' },
  { key: 'timing', labelKey: 'biomechanics.timing', icon: Zap, color: '#fbbf24' },
  { key: 'video', labelKey: 'biomechanics.video', icon: Video, color: '#f97316' },
  { key: 'pose', labelKey: 'biomechanics.pose', icon: Navigation, color: '#8b5cf6' },
  { key: 'emg', labelKey: 'biomechanics.emg', icon: Radio, color: '#ec4899' },
  { key: 'imu', labelKey: 'biomechanics.imu', icon: Waves, color: '#06b6d4' },
  { key: 'events', labelKey: 'biomechanics.events', icon: Flag, color: '#ef4444' },
];

export function BiomechanicsPage() {
  const { lang } = useApp();
  const [sessionId, setSessionId] = useState(DEMO_SESSIONS[0]?.id || '');
  const session = DEMO_SESSIONS.find((s) => s.id === sessionId);
  const trial = session?.trials[0];

  return (
    <div>
      <TopBar
        title={tr('biomechanics.title', lang)}
        subtitle={tr('biomechanics.subtitle', lang)}
      />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={sessionId} onChange={(e) => setSessionId(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            {DEMO_SESSIONS.map((s) => {
              const athlete = DEMO_ATHLETES.find((a) => a.id === s.athleteId);
              return (
                <option key={s.id} value={s.id}>{athlete?.lastName} {athlete?.firstName} — {s.protocolName}</option>
              );
            })}
          </select>
        </div>

        {/* Channel selector */}
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <span key={ch.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-sm font-medium text-ink-600">
                <Icon className="w-3.5 h-3.5" style={{ color: ch.color }} />
                {tr(ch.labelKey, lang)}
              </span>
            );
          })}
        </div>

        {/* Synchronized Timeline */}
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <h4 className="text-sm font-semibold text-ink-900 mb-4">{tr('biomechanics.synchronizedTimeline', lang)}</h4>
          <div className="space-y-3">
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.key} className="flex items-center gap-3">
                  <div className="w-24 flex items-center gap-1.5 shrink-0">
                    <Icon className="w-3.5 h-3.5" style={{ color: ch.color }} />
                    <span className="text-xs font-medium text-ink-600">{tr(ch.labelKey, lang)}</span>
                  </div>
                  <div className="flex-1 h-12 rounded-lg bg-ink-50 border border-ink-100 relative overflow-hidden">
                    {ch.key === 'force' && trial?.forceTimeData ? (
                      <svg viewBox="0 0 700 48" preserveAspectRatio="none" className="w-full h-full">
                        <path
                          d={`M 0 40 ${(trial.forceTimeData || []).map((v, i) => `L ${(i / (trial.forceTimeData || []).length) * 700} ${40 - (v / 1500) * 35}`).join(' ')}`}
                          fill="none"
                          stroke={ch.color}
                          strokeWidth="1.5"
                        />
                      </svg>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-ink-300">
                        {lang === 'cn' ? '暂无数据' : 'No data'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Force-time curve (primary visualization) */}
        {trial?.forceTimeData && (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{tr('biomechanics.force', lang)} — {session?.protocolName}</h4>
            <ForceTimeCurve data={trial.forceTimeData} height={300} bodyWeight={DEMO_ATHLETES.find((a) => a.id === session?.athleteId)?.weight ? DEMO_ATHLETES.find((a) => a.id === session?.athleteId)!.weight * 9.81 : 780} />
          </div>
        )}
      </div>
    </div>
  );
}
