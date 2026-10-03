import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { DEMO_RAW_MEASUREMENTS, DEMO_SESSIONS, DEMO_ATHLETES, DEMO_DEVICES } from '@/lib/demo-data';
import { Search, Download, FileJson } from 'lucide-react';
import type { RawMeasurement } from '@/lib/types';

const DATA_TYPE_LABELS: Record<string, { en: string; cn: string }> = {
  force: { en: 'Force', cn: '力' },
  timing: { en: 'Timing', cn: '计时' },
  position: { en: 'Position', cn: '位置' },
  video: { en: 'Video', cn: '视频' },
  pose: { en: 'Pose', cn: '姿态' },
  events: { en: 'Events', cn: '事件' },
  manual: { en: 'Manual', cn: '手动' },
  emg: { en: 'EMG', cn: '肌电' },
  imu: { en: 'IMU', cn: '惯性测量' },
};

export function RawDataPage() {
  const { lang, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return DEMO_RAW_MEASUREMENTS.filter((m) => {
      const session = DEMO_SESSIONS.find((s) => s.id === m.sessionId);
      const athlete = session ? DEMO_ATHLETES.find((a) => a.id === session.athleteId) : undefined;
      const name = athlete ? `${athlete.lastName} ${athlete.firstName}` : '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || m.sessionId.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || m.dataType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  return (
    <div>
      <TopBar
        title={tr('rawData.title', lang)}
        subtitle={tr('rawData.subtitle', lang)}
        actions={
          <button onClick={() => addToast(lang === 'cn' ? '导出（演示）' : 'Export (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> {tr('common.export', lang)}
          </button>
        }
      />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'cn' ? '搜索受试者或记录...' : 'Search by subject or session...'}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('common.allTypes', lang)}</option>
            {Object.entries(DATA_TYPE_LABELS).map(([key, val]) => (
              <option key={key} value={key}>{lang === 'cn' ? val.cn : val.en}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'session',
                header: tr('rawData.session', lang),
                render: (m: RawMeasurement) => {
                  const session = DEMO_SESSIONS.find((s) => s.id === m.sessionId);
                  const athlete = session ? DEMO_ATHLETES.find((a) => a.id === session.athleteId) : undefined;
                  return (
                    <div className="flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-ink-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink-900">{athlete ? `${athlete.lastName} ${athlete.firstName}` : m.sessionId}</p>
                        <p className="text-xs text-ink-400">{session?.protocolName || m.sessionId}</p>
                      </div>
                    </div>
                  );
                },
              },
              {
                key: 'trial',
                header: tr('rawData.trial', lang),
                render: (m: RawMeasurement) => <span className="text-sm text-ink-700">#{m.trialNumber}</span>,
              },
              {
                key: 'dataType',
                header: tr('rawData.dataType', lang),
                render: (m: RawMeasurement) => {
                  const t = DATA_TYPE_LABELS[m.dataType];
                  return <span className="text-sm text-ink-700">{t ? (lang === 'cn' ? t.cn : t.en) : m.dataType}</span>;
                },
              },
              {
                key: 'device',
                header: tr('rawData.device', lang),
                render: (m: RawMeasurement) => {
                  const device = DEMO_DEVICES.find((d) => d.id === m.sourceDeviceId);
                  return <span className="text-sm text-ink-700">{device?.serialNumber || m.sourceDeviceId}</span>;
                },
              },
              {
                key: 'sampleRate',
                header: tr('rawData.sampleRate', lang),
                align: 'right',
                render: (m: RawMeasurement) => <span className="text-sm font-mono text-ink-600">{m.sampleRateHz} Hz</span>,
              },
              {
                key: 'duration',
                header: tr('rawData.duration', lang),
                align: 'right',
                render: (m: RawMeasurement) => <span className="text-sm font-mono text-ink-600">{m.durationMs} ms</span>,
              },
              {
                key: 'canonical',
                header: tr('rawData.canonical', lang),
                render: (m: RawMeasurement) => (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.canonical ? 'bg-teal-50 text-teal-700' : 'bg-ink-100 text-ink-500'}`}>
                    {m.canonical ? (lang === 'cn' ? '是' : 'Yes') : (lang === 'cn' ? '否' : 'No')}
                  </span>
                ),
              },
              {
                key: 'action',
                header: '',
                align: 'right',
                render: (m: RawMeasurement) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); addToast(lang === 'cn' ? '下载原始数据（演示）' : 'Download raw data (demo)', 'info'); }}
                    className="p-1.5 text-ink-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                ),
              },
            ]}
            data={filtered}
            rowKey={(m) => m.id}
            emptyMessage={tr('rawData.noMatch', lang)}
          />
        </div>
      </div>
    </div>
  );
}
