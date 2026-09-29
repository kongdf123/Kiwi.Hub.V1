import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { DEMO_SESSIONS, DEMO_ATHLETES } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { ForceTimeCurve } from '@/components/ui/ForceTimeCurve';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BarChart } from '@/components/ui/BarChart';
import { ArrowLeft, Download, CheckCircle, XCircle, Activity, Info, FileText } from 'lucide-react';

export function TestResultPage() {
  const { viewParams, navigate, addToast } = useApp();
  const sessionId = viewParams.sessionId || 's-1';
  const session = DEMO_SESSIONS.find((s) => s.id === sessionId) || DEMO_SESSIONS[0];
  const athlete = DEMO_ATHLETES.find((a) => a.id === session.athleteId);
  const [selectedTrial, setSelectedTrial] = useState(0);

  const trial = session.trials[selectedTrial];
  const date = new Date(session.date);
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const trialBarData = session.trials.map((t, i) => ({
    label: `T${i + 1}`,
    value: t.status === 'valid' ? (Object.values(t.values)[0] || 0) : 0,
    color: t.status === 'valid' ? '#3384fc' : '#fecaca',
  }));

  return (
    <div>
      <TopBar
        title="Test Result"
        subtitle={`${session.protocolName} · ${athlete?.lastName} ${athlete?.firstName}`}
        actions={
          <>
            <button onClick={() => navigate('athlete-profile', { athleteId: athlete?.id || '' })} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Athlete
            </button>
            <button onClick={() => addToast('Report export started (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
          </>
        }
      />
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-ink-900">{session.protocolName}</h3>
                <StatusBadge status={session.status} size="md" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">Athlete</p>
                  <p className="text-sm text-ink-900 font-medium">{athlete?.lastName} {athlete?.firstName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">Date & Time</p>
                  <p className="text-sm text-ink-900 font-medium">{dateStr}</p>
                  <p className="text-xs text-ink-400">{timeStr}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">Operator</p>
                  <p className="text-sm text-ink-900 font-medium">{session.operatorName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider">Device</p>
                  <p className="text-sm text-ink-900 font-medium">{session.deviceSerial}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                session.qualityFlag === 'valid' ? 'bg-success-50 text-success-700' :
                session.qualityFlag === 'questionable' ? 'bg-warning-50 text-warning-700' :
                'bg-invalid-50 text-invalid-700'
              }`}>
                Quality: {session.qualityFlag}
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-ink-100 text-sm font-medium text-ink-600">
                v{session.processingVersion}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(session.summary).slice(0, 4).map(([key, val]) => {
            const unit = key.includes('force') && !key.includes('relative') ? 'N' : key.includes('power') ? 'W' : key.includes('asymmetry') ? '%' : key.includes('height') ? 'cm' : key.includes('time') ? 'ms' : key.includes('rsi') ? '' : key.includes('rfd') ? 'N/s' : key.includes('relative') ? 'N/kg' : '';
            return (
              <MetricCard
                key={key}
                label={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                value={val}
                unit={unit}
                deltaLabel="Session summary"
                status="normal"
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-ink-900">Force-Time Curve</h4>
                <p className="text-xs text-ink-500">Trial {selectedTrial + 1} of {session.trials.length}</p>
              </div>
              <Activity className="w-5 h-5 text-accent-600" />
            </div>
            {trial && trial.forceTimeData && (
              <ForceTimeCurve data={trial.forceTimeData} bodyWeight={athlete ? athlete.weight * 9.81 : 780} height={280} />
            )}
            <div className="flex items-center gap-2 mt-4">
              {session.trials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTrial(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTrial === i
                      ? 'bg-accent-600 text-white'
                      : t.status === 'valid'
                      ? 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                      : 'bg-invalid-50 text-invalid-600 hover:bg-invalid-100'
                  }`}
                >
                  {t.status === 'valid' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  Trial {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">Trial Comparison</h4>
            <BarChart data={trialBarData} unit="" height={180} />
            <div className="mt-4 space-y-2">
              {session.trials.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-ink-500 w-16">Trial {i + 1}</span>
                  {t.status === 'valid' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      <span className="text-ink-700 font-mono text-xs">
                        {Object.entries(t.values).slice(0, 2).map(([k, v]) => `${v.toFixed(1)}`).join(' · ')}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-invalid-500" />
                      <span className="text-invalid-600 text-xs">{t.reason}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-ink-500" />
            <h4 className="text-sm font-semibold text-ink-900">Session Metadata</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Processing Version</p>
              <p className="text-sm text-ink-900 font-mono">{session.processingVersion}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Quality Flag</p>
              <p className={`text-sm font-medium ${session.qualityFlag === 'valid' ? 'text-success-700' : session.qualityFlag === 'questionable' ? 'text-warning-700' : 'text-invalid-700'}`}>
                {session.qualityFlag}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Total Trials</p>
              <p className="text-sm text-ink-900 font-mono">{session.trials.length}</p>
            </div>
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Valid Trials</p>
              <p className="text-sm text-ink-900 font-mono">{session.trials.filter((t) => t.status === 'valid').length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
