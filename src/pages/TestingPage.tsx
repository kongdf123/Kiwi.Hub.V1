import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ATHLETES, DEMO_PROTOCOLS, DEMO_DEVICES, getSport } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Check, ChevronRight, ChevronLeft, Dumbbell, User, Settings, Activity, CheckCircle, XCircle, AlertTriangle, Zap, RefreshCw, Waves, TrendingUp, Shuffle } from 'lucide-react';
import type { ProtocolMetric } from '@/lib/types';

type Step = 'setup' | 'athlete' | 'protocol' | 'capture' | 'review' | 'complete';

interface TrialResult {
  number: number;
  status: 'valid' | 'invalid';
  reason?: string;
  values: Record<string, number>;
}

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity,
  'sport-sprint': Zap,
  'sport-swim': Waves,
  'sport-hj': TrendingUp,
  'sport-imtp': Dumbbell,
  'sport-cod': Shuffle,
};

const GENERATORS: Record<string, () => number> = {
  jump_height: () => 48 + Math.random() * 6,
  peak_force: () => 2000 + Math.random() * 200,
  peak_power: () => 4500 + Math.random() * 500,
  rsi_mod: () => 0.35 + Math.random() * 0.1,
  asymmetry: () => 3 + Math.random() * 8,
  time_to_takeoff: () => 850 + Math.random() * 150,
  peak_force_imtp: () => 2800 + Math.random() * 300,
  rfd: () => 5200 + Math.random() * 800,
  relative_peak_force: () => 38 + Math.random() * 5,
  contact_time: () => 180 + Math.random() * 50,
  peak_velocity: () => 9.5 + Math.random() * 1.2,
  split_time_30m: () => 3.9 + Math.random() * 0.5,
  ground_contact: () => 82 + Math.random() * 20,
  flight_time: () => 120 + Math.random() * 40,
  stroke_rate: () => 46 + Math.random() * 8,
  stroke_count: () => 34 + Math.random() * 6,
  lap_time: () => 24.5 + Math.random() * 2,
  dps: () => 2.0 + Math.random() * 0.3,
  takeoff_force: () => 2300 + Math.random() * 400,
  approach_velocity: () => 7.0 + Math.random() * 1.0,
  bar_clearance: () => 2.10 + Math.random() * 0.2,
  cod_time: () => 2.15 + Math.random() * 0.2,
  deceleration: () => 4.8 + Math.random() * 1.0,
  reacceleration: () => 5.0 + Math.random() * 1.0,
};

const INVALID_REASONS = [
  { en: 'Insufficient countermovement depth', cn: '反向深度不足' },
  { en: 'Excessive forward lean detected', cn: '前倾过度' },
  { en: 'Incomplete foot contact on landing', cn: '落地脚部接触不完整' },
  { en: 'False start detected', cn: '抢跑' },
  { en: 'Movement outside valid range', cn: '动作超出有效范围' },
];

export function TestingPage() {
  const { viewParams, navigate, addToast, lang } = useApp();
  const [step, setStep] = useState<Step>('setup');
  const [selectedAthleteId, setSelectedAthleteId] = useState(viewParams.athleteId || '');
  const [selectedProtocolId, setSelectedProtocolId] = useState(viewParams.protocolId || '');
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [trials, setTrials] = useState<TrialResult[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [captureState, setCaptureState] = useState<'idle' | 'countdown' | 'recording' | 'processing' | 'result'>('idle');
  const [countdown, setCountdown] = useState(3);

  const selectedAthlete = DEMO_ATHLETES.find((a) => a.id === selectedAthleteId);
  const selectedProtocol = DEMO_PROTOCOLS.find((p) => p.id === selectedProtocolId);
  const selectedDevice = DEMO_DEVICES.find((d) => d.id === selectedDeviceId);
  const totalTrials = selectedProtocol?.trials || 3;

  const steps: { key: Step; label: string; icon: typeof Settings }[] = [
    { key: 'setup', label: tr('testing.setup', lang), icon: Settings },
    { key: 'athlete', label: tr('testing.athlete', lang), icon: User },
    { key: 'protocol', label: tr('testing.protocol', lang), icon: Activity },
    { key: 'capture', label: tr('testing.capture', lang), icon: Dumbbell },
    { key: 'review', label: tr('testing.review', lang), icon: Check },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const generateTrialValues = (): Record<string, number> => {
    if (!selectedProtocol) return {};
    const values: Record<string, number> = {};
    selectedProtocol.metrics.forEach((metric: ProtocolMetric) => {
      const gen = GENERATORS[metric.key];
      if (gen) values[metric.key] = gen();
    });
    return values;
  };

  const startCapture = () => {
    setCaptureState('countdown');
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCaptureState('recording');
          setTimeout(() => {
            setCaptureState('processing');
            setTimeout(() => {
              const isValid = Math.random() > 0.25;
              const values = generateTrialValues();
              const reason = INVALID_REASONS[Math.floor(Math.random() * INVALID_REASONS.length)];
              const result: TrialResult = {
                number: currentTrial + 1,
                status: isValid ? 'valid' : 'invalid',
                reason: isValid ? undefined : (lang === 'cn' ? reason.cn : reason.en),
                values: isValid ? values : {},
              };
              setTrials((prev) => [...prev, result]);
              setCaptureState('result');
            }, 1000);
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 700);
  };

  const nextTrial = () => {
    if (currentTrial + 1 < totalTrials) {
      setCurrentTrial(currentTrial + 1);
      setCaptureState('idle');
    } else {
      setStep('review');
    }
  };

  const retryTrial = () => {
    setTrials((prev) => prev.filter((t) => t.number !== currentTrial + 1));
    setCaptureState('idle');
  };

  const validTrials = trials.filter((t) => t.status === 'valid');
  const bestTrial = validTrials.length > 0
    ? validTrials.reduce((best, t) => {
        const bestVal = Object.values(best.values)[0] || 0;
        const tVal = Object.values(t.values)[0] || 0;
        return tVal > bestVal ? t : best;
      })
    : null;

  const canProceed = () => {
    if (step === 'setup') return selectedDeviceId;
    if (step === 'athlete') return selectedAthleteId;
    if (step === 'protocol') return selectedProtocolId;
    return true;
  };

  const handleNext = () => {
    if (step === 'review') {
      addToast(`${lang === 'cn' ? '测试已保存' : 'Test session saved'}: ${selectedAthlete?.lastName} ${selectedAthlete?.firstName}`, 'success');
      setStep('complete');
    } else {
      const next: Record<Step, Step> = { setup: 'athlete', athlete: 'protocol', protocol: 'capture', capture: 'review', review: 'complete', complete: 'complete' };
      setStep(next[step]);
    }
  };

  const handleBack = () => {
    const prev: Record<Step, Step> = { setup: 'setup', athlete: 'setup', protocol: 'athlete', capture: 'protocol', review: 'capture', complete: 'review' };
    setStep(prev[step]);
  };

  const metricLabel = (m: ProtocolMetric) => lang === 'cn' ? m.nameCn : m.name;

  if (step === 'complete') {
    return (
      <div>
        <TopBar title={tr('testing.title', lang)} subtitle={tr('testing.sessionComplete', lang)} />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-success-600" />
            </div>
            <h2 className="text-xl font-semibold text-ink-900 mb-2">{tr('testing.sessionComplete', lang)}</h2>
            <p className="text-sm text-ink-500 mb-1">{lang === 'cn' ? selectedProtocol?.nameCn : selectedProtocol?.name} · {selectedAthlete?.lastName} {selectedAthlete?.firstName}</p>
            <p className="text-sm text-ink-500 mb-6">{validTrials.length} {tr('testing.validTrials', lang)} {trials.length} {tr('testing.total', lang)}</p>
            {bestTrial && (
              <div className="bg-white rounded-xl border border-ink-200 p-4 max-w-md mx-auto mb-6">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-2">{tr('testing.bestTrial', lang)}</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(bestTrial.values).slice(0, 4).map(([key, val]) => {
                    const m = selectedProtocol?.metrics.find((mm) => mm.key === key);
                    return (
                      <div key={key} className="text-left">
                        <p className="text-xs text-ink-500">{m ? metricLabel(m) : key}</p>
                        <p className="text-lg font-mono font-semibold text-ink-900">{val.toFixed(1)} <span className="text-xs text-ink-400">{m?.unit}</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => { setStep('setup'); setTrials([]); setCurrentTrial(0); setCaptureState('idle'); }} className="px-4 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
                {tr('testing.newTest', lang)}
              </button>
              <button onClick={() => navigate('home')} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                {tr('testing.backToHome', lang)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={tr('testing.title', lang)} subtitle={tr('testing.captureNew', lang)} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isDone ? 'bg-success-500 text-white' : isCurrent ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-ink-100 text-ink-400'
                  }`}>
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'text-teal-700' : isDone ? 'text-ink-700' : 'text-ink-400'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors ${isDone ? 'bg-success-500' : 'bg-ink-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          {step === 'setup' && (
            <div className="bg-white rounded-xl border border-ink-200 p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-ink-900 mb-1">{tr('testing.selectDevice', lang)}</h3>
              <p className="text-sm text-ink-500 mb-4">{lang === 'cn' ? '选择本次测试使用的设备' : 'Choose a device for this testing session'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DEMO_DEVICES.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDeviceId(device.id)}
                    disabled={device.status === 'offline'}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                      selectedDeviceId === device.id ? 'border-teal-500 bg-teal-50' : device.status === 'offline' ? 'border-ink-100 bg-ink-50 opacity-50 cursor-not-allowed' : 'border-ink-200 hover:border-ink-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-ink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900">{device.serialNumber}</p>
                      <p className="text-xs text-ink-500">{device.type} · {device.location}</p>
                    </div>
                    <StatusBadge status={device.status} lang={lang} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'athlete' && (
            <div className="bg-white rounded-xl border border-ink-200 p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-ink-900 mb-1">{tr('testing.selectAthlete', lang)}</h3>
              <p className="text-sm text-ink-500 mb-4">{lang === 'cn' ? '选择测试运动员' : 'Choose the athlete to test'}</p>
              <div className="space-y-2">
                {DEMO_ATHLETES.map((athlete) => {
                  const sport = getSport(athlete.sportId);
                  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
                  return (
                    <button
                      key={athlete.id}
                      onClick={() => setSelectedAthleteId(athlete.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                        selectedAthleteId === athlete.id ? 'border-teal-500 bg-teal-50' : 'border-ink-200 hover:border-ink-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-sm font-medium text-ink-600 shrink-0">
                        {athlete.firstName[0]}{athlete.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900">{athlete.lastName} {athlete.firstName}</p>
                        <p className="text-xs text-ink-500 flex items-center gap-1"><SportIcon className="w-3 h-3" />{athlete.position} · {sport ? (lang === 'cn' ? sport.nameCn : sport.name) : ''}</p>
                      </div>
                      <StatusBadge status={athlete.status} lang={lang} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'protocol' && (
            <div className="bg-white rounded-xl border border-ink-200 p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-ink-900 mb-1">{tr('testing.selectProtocol', lang)}</h3>
              <p className="text-sm text-ink-500 mb-4">{lang === 'cn' ? '选择测试方案' : 'Choose a test protocol to execute'}</p>
              <div className="space-y-3">
                {DEMO_PROTOCOLS.map((protocol) => {
                  const sport = getSport(protocol.sportId);
                  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
                  return (
                    <button
                      key={protocol.id}
                      onClick={() => setSelectedProtocolId(protocol.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedProtocolId === protocol.id ? 'border-teal-500 bg-teal-50' : 'border-ink-200 hover:border-ink-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-ink-900 flex items-center gap-2">
                          <SportIcon className="w-4 h-4 text-ink-500" />
                          {lang === 'cn' ? protocol.nameCn : protocol.name}
                        </p>
                        <span className="text-xs text-ink-500">{protocol.trials} {tr('library.trials', lang)} · {protocol.durationMin}{tr('library.duration', lang)}</span>
                      </div>
                      <p className="text-xs text-ink-500 mb-2">{lang === 'cn' ? protocol.descriptionCn : protocol.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {protocol.metrics.map((m) => (
                          <span key={m.key} className={`text-xs px-2 py-0.5 rounded ${m.primary ? 'bg-teal-50 text-teal-700 font-medium' : 'bg-ink-100 text-ink-600'}`}>
                            {metricLabel(m)}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'capture' && selectedAthlete && selectedProtocol && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-xl border border-ink-200 p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink-900">{lang === 'cn' ? selectedProtocol.nameCn : selectedProtocol.name}</h3>
                    <p className="text-sm text-ink-500">{selectedAthlete.lastName} {selectedAthlete.firstName} · {tr('testing.trial', lang)} {currentTrial + 1} / {totalTrials}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalTrials }).map((_, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        i < trials.length
                          ? trials[i].status === 'valid' ? 'bg-success-100 text-success-700' : 'bg-invalid-100 text-invalid-700'
                          : i === currentTrial ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-300' : 'bg-ink-100 text-ink-400'
                      }`}>
                        {i < trials.length ? (trials[i].status === 'valid' ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />) : i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-ink-50 rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-ink-700">{tr('testing.validityRules', lang)}</h4>
                    <AlertTriangle className="w-4 h-4 text-warning-500" />
                  </div>
                  <ul className="space-y-1.5">
                    {selectedProtocol.validityRules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                        <Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-center justify-center py-8">
                  {captureState === 'idle' && (
                    <>
                      <p className="text-sm text-ink-500 mb-4 text-center">{tr('testing.trial', lang)} {currentTrial + 1} {lang === 'cn' ? '准备就绪。' : 'ready to capture.'}<br />{lang === 'cn' ? '确保运动员在设备上静止站立。' : 'Ensure athlete is ready on the device.'}</p>
                      <button onClick={startCapture} className="flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold rounded-xl transition-colors animate-pulse-soft">
                        <Dumbbell className="w-5 h-5" />
                        {tr('testing.startCapture', lang)}
                      </button>
                    </>
                  )}

                  {captureState === 'countdown' && (
                    <div className="text-center">
                      <p className="text-sm text-ink-500 mb-2">{tr('testing.getReady', lang)}</p>
                      <div className="text-6xl font-bold text-teal-600 animate-pulse-soft">{countdown}</div>
                    </div>
                  )}

                  {captureState === 'recording' && (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-invalid-500 flex items-center justify-center mx-auto mb-3 animate-pulse-soft">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-base font-semibold text-invalid-600">{tr('testing.recording', lang)}</p>
                      <div className="w-48 h-1 bg-ink-200 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-invalid-500 animate-progress" />
                      </div>
                    </div>
                  )}

                  {captureState === 'processing' && (
                    <div className="text-center">
                      <RefreshCw className="w-12 h-12 text-teal-600 mx-auto mb-3 animate-sync-spin" />
                      <p className="text-sm font-medium text-ink-700">{tr('testing.processing', lang)}</p>
                      <p className="text-xs text-ink-400 mt-1">{tr('testing.runningChecks', lang)}</p>
                    </div>
                  )}

                  {captureState === 'result' && trials.length > currentTrial && (
                    <div className="text-center w-full max-w-md">
                      {trials[currentTrial].status === 'valid' ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-8 h-8 text-success-600" />
                          </div>
                          <p className="text-base font-semibold text-success-700 mb-3">{tr('testing.trialValid', lang)}</p>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {Object.entries(trials[currentTrial].values).slice(0, 4).map(([key, val]) => {
                              const m = selectedProtocol.metrics.find((mm) => mm.key === key);
                              return (
                                <div key={key} className="bg-ink-50 rounded-lg p-3">
                                  <p className="text-xs text-ink-500">{m ? metricLabel(m) : key}</p>
                                  <p className="text-lg font-mono font-semibold text-ink-900">{val.toFixed(1)} <span className="text-xs text-ink-400">{m?.unit}</span></p>
                                </div>
                              );
                            })}
                          </div>
                          <button onClick={nextTrial} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                            {currentTrial + 1 < totalTrials ? tr('testing.nextTrial', lang) : tr('testing.reviewResults', lang)}
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-invalid-100 flex items-center justify-center mx-auto mb-3">
                            <XCircle className="w-8 h-8 text-invalid-600" />
                          </div>
                          <p className="text-base font-semibold text-invalid-700 mb-1">{tr('testing.trialInvalid', lang)}</p>
                          <p className="text-sm text-ink-500 mb-4">{trials[currentTrial].reason}</p>
                          <button onClick={retryTrial} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                            {tr('testing.retryTrial', lang)}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {trials.length > 0 && (
                <div className="bg-white rounded-xl border border-ink-200 p-4">
                  <h4 className="text-sm font-semibold text-ink-900 mb-3">{tr('testing.trialHistory', lang)}</h4>
                  <div className="space-y-2">
                    {trials.map((trial) => (
                      <div key={trial.number} className="flex items-center gap-3 py-2 border-b border-ink-100 last:border-0">
                        <span className="text-sm font-medium text-ink-700 w-20">{tr('testing.trial', lang)} {trial.number}</span>
                        <StatusBadge status={trial.status === 'valid' ? 'normal' : 'invalid'} lang={lang} />
                        {trial.status === 'valid' && (
                          <div className="flex gap-3 text-xs text-ink-600 font-mono">
                            {Object.entries(trial.values).slice(0, 3).map(([key, val]) => (
                              <span key={key}>{val.toFixed(1)}</span>
                            ))}
                          </div>
                        )}
                        {trial.reason && <span className="text-xs text-invalid-600">{trial.reason}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'review' && selectedAthlete && selectedProtocol && (
            <div className="bg-white rounded-xl border border-ink-200 p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-ink-900 mb-1">{tr('testing.reviewSession', lang)}</h3>
              <p className="text-sm text-ink-500 mb-4">{tr('testing.confirmDetails', lang)}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-ink-50 rounded-lg p-3">
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{tr('testing.athlete', lang)}</p>
                  <p className="text-sm font-medium text-ink-900">{selectedAthlete.lastName} {selectedAthlete.firstName}</p>
                </div>
                <div className="bg-ink-50 rounded-lg p-3">
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{tr('testing.protocol', lang)}</p>
                  <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? selectedProtocol.nameCn : selectedProtocol.name}</p>
                </div>
                <div className="bg-ink-50 rounded-lg p-3">
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '设备' : 'Device'}</p>
                  <p className="text-sm font-medium text-ink-900">{selectedDevice?.serialNumber}</p>
                </div>
                <div className="bg-ink-50 rounded-lg p-3">
                  <p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '有效试次' : 'Valid Trials'}</p>
                  <p className="text-sm font-medium text-ink-900">{validTrials.length} / {trials.length}</p>
                </div>
              </div>

              {bestTrial && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-ink-900 mb-3">{tr('testing.bestTrial', lang)}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(bestTrial.values).map(([key, val]) => {
                      const m = selectedProtocol.metrics.find((mm) => mm.key === key);
                      return (
                        <div key={key} className="bg-teal-50 rounded-lg p-3">
                          <p className="text-xs text-ink-500">{m ? metricLabel(m) : key}</p>
                          <p className="text-xl font-mono font-semibold text-ink-900">{val.toFixed(1)} <span className="text-xs text-ink-400">{m?.unit}</span></p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step !== 'capture' && (
            <div className="flex items-center justify-between mt-6">
              <button onClick={handleBack} disabled={step === 'setup'} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> {tr('common.back', lang)}
              </button>
              <button onClick={handleNext} disabled={!canProceed()} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {step === 'review' ? tr('testing.saveSession', lang) : tr('common.continue', lang)}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
