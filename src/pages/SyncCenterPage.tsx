import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_SYNC_LOGS, DEMO_DEVICES } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBadge, StatusDot } from '@/components/ui/StatusBadge';
import { ArrowDown, ArrowUp, CheckCircle, AlertTriangle, XCircle, RefreshCw, Database } from 'lucide-react';

export function SyncCenterPage() {
  const { lang } = useApp();

  const successCount = DEMO_SYNC_LOGS.filter((s) => s.status === 'success').length;
  const partialCount = DEMO_SYNC_LOGS.filter((s) => s.status === 'partial').length;
  const failedCount = DEMO_SYNC_LOGS.filter((s) => s.status === 'failed').length;
  const totalRecords = DEMO_SYNC_LOGS.reduce((sum, s) => sum + s.records, 0);

  return (
    <div>
      <TopBar title={tr('sync.title', lang)} subtitle={lang === 'cn' ? '设备同步与数据流' : 'Device sync and data flow'} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '成功' : 'Success'}</span>
              <CheckCircle className="w-5 h-5 text-success-500" />
            </div>
            <p className="text-2xl font-semibold text-ink-900">{successCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '部分' : 'Partial'}</span>
              <AlertTriangle className="w-5 h-5 text-warning-500" />
            </div>
            <p className="text-2xl font-semibold text-ink-900">{partialCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '失败' : 'Failed'}</span>
              <XCircle className="w-5 h-5 text-invalid-500" />
            </div>
            <p className="text-2xl font-semibold text-ink-900">{failedCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '总记录' : 'Total Records'}</span>
              <Database className="w-5 h-5 text-teal-500" />
            </div>
            <p className="text-2xl font-semibold text-ink-900">{totalRecords}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '设备同步状态' : 'Device Sync Status'}</h3>
            <div className="space-y-3">
              {DEMO_DEVICES.map((device) => (
                <div key={device.id} className="flex items-center gap-3 p-3 bg-ink-50 rounded-lg">
                  <StatusDot status={device.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-800">{device.serialNumber}</p>
                    <p className="text-xs text-ink-400">{device.type} · {device.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-500">{lang === 'cn' ? '上次同步' : 'Last sync'}</p>
                    <p className="text-xs text-ink-700 font-mono">{new Date(device.lastSync).toLocaleTimeString(lang === 'cn' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">{tr('sync.history', lang)}</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
              {DEMO_SYNC_LOGS.map((log) => {
                const Icon = log.direction === 'inbound' ? ArrowDown : ArrowUp;
                const statusColor = log.status === 'success' ? 'text-success-600' : log.status === 'partial' ? 'text-warning-600' : 'text-invalid-600';
                return (
                  <div key={log.id} className="flex items-center gap-3 py-2 border-b border-ink-50 last:border-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${log.direction === 'inbound' ? 'bg-teal-50' : 'bg-ink-100'}`}>
                      <Icon className={`w-3.5 h-3.5 ${log.direction === 'inbound' ? 'text-teal-600' : 'text-ink-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{log.source}</p>
                      <p className="text-xs text-ink-400 truncate">{log.message}</p>
                    </div>
                    <span className="text-xs text-ink-500 font-mono shrink-0">{log.records}</span>
                    <span className={`text-xs font-medium shrink-0 ${statusColor}`}>{tr(`sync.${log.status}`, lang)}</span>
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
