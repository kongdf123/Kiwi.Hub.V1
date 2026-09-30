import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_SESSIONS, DEMO_ATHLETES, getSport, getProtocol } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { ForceTimeCurve } from '@/components/ui/ForceTimeCurve';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BarChart } from '@/components/ui/BarChart';
import { ArrowLeft, Download, CheckCircle, XCircle, Activity, Info, Zap, Waves, TrendingUp, Dumbbell, Shuffle } from 'lucide-react';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity, 'sport-sprint': Zap, 'sport-swim': Waves, 'sport-hj': TrendingUp, 'sport-imtp': Dumbbell, 'sport-cod': Shuffle,
};

const METRIC_LABELS: Record<string, { en: string; cn: string; unit: string }> = {
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

export function TestResultPage() {
  const { viewParams, navigate, addToast, lang } = useApp();
  const sessionId = viewParams.sessionId || 's-1';
  const session = DEMO_SESSIONS.find((s) => s.id === sessionId) || DEMO_SESSIONS[0];
  const athlete = DEMO_ATHLETES.find((a) => a.id === session.athleteId);
  const sport = getSport(session.sportId);
  const protocol = getProtocol(session.protocolId);
  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
  const [selectedTrial, setSelectedTrial] = useState(0);

  const trial = session.trials[selectedTrial];
  const date = new Date(session.date);
  const locale = lang === 'cn' ? 'zh-CN' : 'en-US';
  const dateStr = date.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  const trialBarData = session.trials.map((t, i) => ({
    label: `T${i + 1}`,
    value: t.status === 'valid' ? (Object.values(t.values)[0] || 0) : 0,
    color: t.status === 'valid' ? '#06b56b' : '#fecaca',
  }));

  const getLabel = (key: string) => {
    const m = METRIC_LABELS[key];
    return m ? (lang === 'cn' ? m.cn : m.en) : key;
  };
  const getUnit = (key: string) => METRIC_LABELS[key]?.unit || '';

  return (
    <div>
      <TopBar
        title={lang === 'cn' ? '测试结果' : 'Test Result'}
        subtitle={`${lang === 'cn' ? protocol?.nameCn || session.protocolName : session.protocolName} · ${athlete?.lastName} ${athlete?.firstName}`}
        actions={
          <>
            <button onClick={() => navigate('athlete-profile', { athleteId: athlete?.id || '' })} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> {tr('common.back', lang)}
            </button>
            <button onClick={() => addToast(lang === 'cn' ? '导出已开始（演示）' : 'Export started (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Download className="w-4 h-4" /> {tr('common.export', lang)}
            </button>
          </>
        }
      />
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                  <SportIcon className="w-5 h-5 text-ink-500" />
                </div>
                <h3 className="text-lg font-semibold text-ink-900">{lang === 'cn' ? protocol?.nameCn || session.protocolName : session.protocolName}</h3>
                <StatusBadge status={session.status} size="md" lang={lang} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '运动员' : 'Athlete'}</p><p className="text-sm text-ink-900 font-medium">{athlete?.lastName} {athlete?.firstName}</p></div>
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '日期时间' : 'Date & Time'}</p><p className="text-sm text-ink-900 font-medium">{dateStr}</p><p className="text-xs text-ink-400">{timeStr}</p></div>
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '操作员' : 'Operator'}</p><p className="text-sm text-ink-900 font-medium">{session.operatorName}</p></div>
                <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '设备' : 'Device'}</p><p className="text-sm text-ink-900 font-medium">{session.deviceSerial}</p></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${session.qualityFlag === 'valid' ? 'bg-success-50 text-success-700' : session.qualityFlag === 'questionable' ? 'bg-warning-50 text-warning-700' : 'bg-invalid-50 text-invalid-700'}`}>
                {lang === 'cn' ? '质量' : 'Quality'}: {session.qualityFlag}
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-ink-100 text-sm font-medium text-ink-600">v{session.processingVersion}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(session.summary).slice(0, 4).map(([key, val]) => (
            <MetricCard key={key} label={getLabel(key)} value={val} unit={getUnit(key)} deltaLabel={lang === 'cn' ? '本次结果' : 'Session summary'} status="normal" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '力-时曲线' : 'Force-Time Curve'}</h4>
                <p className="text-xs text-ink-500">{tr('testing.trial', lang)} {selectedTrial + 1} / {session.trials.length}</p>
              </div>
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            {trial && trial.forceTimeData ? (
              <ForceTimeCurve data={trial.forceTimeData} bodyWeight={athlete ? athlete.weight * 9.81 : 780} height={280} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-ink-400 text-sm">{lang === 'cn' ? '该试次无力-时数据' : 'No force-time data for this trial'}</div>
            )}
            <div className="flex items-center gap-2 mt-4">
              {session.trials.map((t, i) => (
                <button key={i} onClick={() => setSelectedTrial(i)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTrial === i ? 'bg-teal-600 text-white' : t.status === 'valid' ? 'bg-ink-100 text-ink-700 hover:bg-ink-200' : 'bg-invalid-50 text-invalid-600 hover:bg-invalid-100'}`}>
                  {t.status === 'valid' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {tr('testing.trial', lang)} {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '试次对比' : 'Trial Comparison'}</h4>
            <BarChart data={trialBarData} unit="" height={180} />
            <div className="mt-4 space-y-2">
              {session.trials.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-ink-500 w-20">{tr('testing.trial', lang)} {i + 1}</span>
                  {t.status === 'valid' ? (
                    <><CheckCircle className="w-4 h-4 text-success-500" /><span className="text-ink-700 font-mono text-xs">{Object.entries(t.values).slice(0, 2).map(([k, v]) => `${v.toFixed(1)}`).join(' · ')}</span></>
                  ) : (
                    <><XCircle className="w-4 h-4 text-invalid-500" /><span className="text-invalid-600 text-xs">{t.reason}</span></>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-ink-500" />
            <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '测试元数据' : 'Session Metadata'}</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '处理版本' : 'Processing'}</p><p className="text-sm text-ink-900 font-mono">v{session.processingVersion}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '质量标记' : 'Quality'}</p><p className={`text-sm font-medium ${session.qualityFlag === 'valid' ? 'text-success-700' : session.qualityFlag === 'questionable' ? 'text-warning-700' : 'text-invalid-700'}`}>{session.qualityFlag}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '总试次' : 'Total Trials'}</p><p className="text-sm text-ink-900 font-mono">{session.trials.length}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '有效试次' : 'Valid Trials'}</p><p className="text-sm text-ink-900 font-mono">{session.trials.filter((t) => t.status === 'valid').length}</p></div>
            <div><p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '数据来源' : 'Source'}</p><p className="text-sm text-ink-900 font-mono capitalize">{session.source}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
