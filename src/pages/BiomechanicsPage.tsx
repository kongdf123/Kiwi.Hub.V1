import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { ForceTimeCurve } from '@/components/ui/ForceTimeCurve';
import { DEMO_SESSIONS, DEMO_PROTOCOLS, DEMO_ATHLETES, getProtocol } from '@/lib/demo-data';
import { Waves, Activity, Zap, Video, Users, Radio, Navigation, Flag, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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

type PhaseTab = 'phases' | 'metrics' | 'channels';

const PHASES = [
  { key: 'unweighting', labelEn: 'Unweighting', labelCn: '失重期', color: 'bg-blue-50 text-blue-700 border-blue-200', descEn: 'Athlete begins descending, reducing force on the platform.', descCn: '运动员开始下蹲，减少对平台的作用力。' },
  { key: 'eccentric', labelEn: 'Eccentric', labelCn: '离心期', color: 'bg-amber-50 text-amber-700 border-amber-200', descEn: 'Negative work phase — muscles lengthen under load.', descCn: '肌肉在负荷下延长的离心收缩阶段。' },
  { key: 'concentric', labelEn: 'Concentric', labelCn: '向心期', color: 'bg-teal-50 text-teal-700 border-teal-200', descEn: 'Positive work phase — muscles shorten to produce force.', descCn: '肌肉收缩产生推力的向心收缩阶段。' },
  { key: 'flight', labelEn: 'Flight', labelCn: '腾空期', color: 'bg-success-50 text-success-700 border-success-200', descEn: 'Athlete is airborne — no contact with platform.', descCn: '运动员离开平台，处于腾空状态。' },
];

const PHASE_METRICS = [
  { key: 'unweighting_dur', labelEn: 'Unweighting Duration', labelCn: '失重时长', unit: 'ms', value: 180 },
  { key: 'eccentric_dur', labelEn: 'Eccentric Duration', labelCn: '离心时长', unit: 'ms', value: 220 },
  { key: 'concentric_dur', labelEn: 'Concentric Duration', labelCn: '向心时长', unit: 'ms', value: 160 },
  { key: 'eccentric_peak', labelEn: 'Eccentric Peak Force', labelCn: '离心峰值力', unit: 'N', value: 950 },
  { key: 'concentric_peak', labelEn: 'Concentric Peak Force', labelCn: '向心峰值力', unit: 'N', value: 1450 },
  { key: 'rfd', labelEn: 'Rate of Force Development', labelCn: '发力率', unit: 'N/s', value: 4200 },
  { key: 'impulse_ecc', labelEn: 'Eccentric Impulse', labelCn: '离心冲量', unit: 'N·s', value: 145 },
  { key: 'impulse_con', labelEn: 'Concentric Impulse', labelCn: '向心冲量', unit: 'N·s', value: 210 },
  { key: 'stiffness', labelEn: 'Leg Stiffness', labelCn: '腿部刚度', unit: 'kN/m', value: 28.5 },
];

export function BiomechanicsPage() {
  const { lang } = useApp();
  const [sessionId, setSessionId] = useState(DEMO_SESSIONS[0]?.id || '');
  const [phaseTab, setPhaseTab] = useState<PhaseTab>('phases');
  const [selectedTrial, setSelectedTrial] = useState(0);
  const session = DEMO_SESSIONS.find((s) => s.id === sessionId);
  const trial = session?.trials[selectedTrial];
  const athlete = session ? DEMO_ATHLETES.find((a) => a.id === session.athleteId) : undefined;
  const protocol = session ? getProtocol(session.protocolId) : undefined;

  return (
    <div>
      <TopBar
        title={tr('biomechanics.title', lang)}
        subtitle={tr('biomechanics.subtitle', lang)}
      />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={sessionId} onChange={(e) => { setSessionId(e.target.value); setSelectedTrial(0); }} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            {DEMO_SESSIONS.map((s) => {
              const a = DEMO_ATHLETES.find((at) => at.id === s.athleteId);
              return (
                <option key={s.id} value={s.id}>{a?.lastName} {a?.firstName} — {s.protocolName}</option>
              );
            })}
          </select>
          {session && session.trials.length > 1 && (
            <div className="flex items-center gap-1">
              {session.trials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTrial(i)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${selectedTrial === i ? 'bg-teal-600 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'}`}
                >
                  {tr('sessions.trial', lang)} {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phase / Metrics / Channels tabs */}
        <div className="flex items-center gap-1 border-b border-ink-200">
          {([
            { key: 'phases' as PhaseTab, label: lang === 'cn' ? '阶段分析' : 'Phase Analysis' },
            { key: 'metrics' as PhaseTab, label: lang === 'cn' ? '生物力学指标' : 'Biomechanical Metrics' },
            { key: 'channels' as PhaseTab, label: lang === 'cn' ? '通道时间线' : 'Channel Timeline' },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setPhaseTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${phaseTab === t.key ? 'border-teal-600 text-teal-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Phase Analysis */}
        {phaseTab === 'phases' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PHASES.map((phase, i) => (
                <div key={phase.key} className={`rounded-xl border p-4 ${phase.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{lang === 'cn' ? phase.labelCn : phase.labelEn}</span>
                    <span className="text-xs font-mono opacity-60">P{i + 1}</span>
                  </div>
                  <p className="text-xs opacity-80">{lang === 'cn' ? phase.descCn : phase.descEn}</p>
                </div>
              ))}
            </div>

            {/* Phase timeline bar */}
            <div className="bg-white rounded-xl border border-ink-200 p-5">
              <h4 className="text-sm font-semibold text-ink-900 mb-3">{lang === 'cn' ? '阶段时间线' : 'Phase Timeline'}</h4>
              <div className="flex items-center h-10 rounded-lg overflow-hidden">
                <div className="bg-blue-200 h-full flex items-center justify-center text-xs font-medium text-blue-800" style={{ width: '20%' }}>20%</div>
                <div className="bg-amber-200 h-full flex items-center justify-center text-xs font-medium text-amber-800" style={{ width: '25%' }}>25%</div>
                <div className="bg-teal-200 h-full flex items-center justify-center text-xs font-medium text-teal-800" style={{ width: '18%' }}>18%</div>
                <div className="bg-success-200 h-full flex items-center justify-center text-xs font-medium text-success-800" style={{ width: '37%' }}>37%</div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-ink-400">
                <span>0ms</span>
                <span>{lang === 'cn' ? '触地时间' : 'Contact Time'}: 560ms</span>
                <span>{lang === 'cn' ? '腾空' : 'Flight'}: 380ms</span>
              </div>
            </div>
          </div>
        )}

        {/* Biomechanical Metrics */}
        {phaseTab === 'metrics' && (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-ink-100">
              <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '阶段生物力学指标' : 'Phase Biomechanical Metrics'}</h4>
              {protocol && <p className="text-xs text-ink-500 mt-0.5">{lang === 'cn' ? protocol.nameCn : protocol.name}</p>}
            </div>
            <div className="divide-y divide-ink-50">
              {PHASE_METRICS.map((m) => (
                <div key={m.key} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? m.labelCn : m.labelEn}</p>
                    <p className="text-xs text-ink-400 font-mono">{m.key}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-semibold text-ink-900">{m.value.toFixed(1)}</span>
                    <span className="text-xs text-ink-400 ml-1">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Channel Timeline */}
        {phaseTab === 'channels' && (
          <div className="space-y-4">
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
          </div>
        )}

        {/* Force-time curve (always visible) */}
        {trial?.forceTimeData && (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-ink-900">{tr('biomechanics.force', lang)} — {session?.protocolName}</h4>
              {athlete && <span className="text-xs text-ink-500">{athlete.lastName} {athlete.firstName}</span>}
            </div>
            <ForceTimeCurve data={trial.forceTimeData} height={300} bodyWeight={athlete ? athlete.weight * 9.81 : 780} />
            <div className="mt-4 flex items-center gap-4 text-xs text-ink-500">
              <span>{lang === 'cn' ? '体重线' : 'Body Weight'}: {athlete ? (athlete.weight * 9.81).toFixed(0) : 780} N</span>
              <span>{lang === 'cn' ? '峰值力' : 'Peak Force'}: {Math.max(...trial.forceTimeData).toFixed(0)} N</span>
              <span>{lang === 'cn' ? '采样率' : 'Sample Rate'}: 1000 Hz</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
