import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_SYNC_JOBS, DEMO_SYNC_LOGS, DEMO_DEVICES, DEMO_ATHLETES } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { StatusDot } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ArrowDown, ArrowUp, CheckCircle, AlertTriangle, XCircle, RefreshCw, Database, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import type { SyncJob, SessionStatus } from '@/lib/types';

const JOB_STATUS_CONFIG: Record<string, { en: string; cn: string; color: string; icon: typeof CheckCircle }> = {
  RECEIVED: { en: 'Received', cn: '已接收', color: 'text-teal-600', icon: CheckCircle },
  VALIDATING: { en: 'Validating', cn: '验证中', color: 'text-teal-600', icon: RefreshCw },
  PROCESSING: { en: 'Processing', cn: '处理中', color: 'text-teal-600', icon: RefreshCw },
  ANALYZED: { en: 'Analyzed', cn: '已分析', color: 'text-success-600', icon: CheckCircle },
  PUBLISHED: { en: 'Completed', cn: '已完成', color: 'text-success-600', icon: CheckCircle },
  UPLOAD_FAILED: { en: 'Failed', cn: '失败', color: 'text-invalid-600', icon: XCircle },
  VALIDATION_FAILED: { en: 'Failed', cn: '失败', color: 'text-invalid-600', icon: XCircle },
  PROCESSING_FAILED: { en: 'Failed', cn: '失败', color: 'text-invalid-600', icon: XCircle },
};

type QueueTab = 'all' | 'queue' | 'received' | 'processing' | 'completed' | 'failed';

export function SyncCenterPage() {
  const { lang, addToast, navigate } = useApp();
  const [queueTab, setQueueTab] = useState<QueueTab>('all');

  const isFailed = (status: SessionStatus) => status.includes('FAILED');
  const isCompleted = (status: SessionStatus) => status === 'PUBLISHED' || status === 'ANALYZED';
  const isQueue = (status: SessionStatus) => status === 'QUEUED' || status === 'LOCAL';
  const isReceived = (status: SessionStatus) => status === 'RECEIVED';
  const isProcessing = (status: SessionStatus) => status === 'PROCESSING' || status === 'VALIDATING';

  const filteredJobs = DEMO_SYNC_JOBS.filter((job) => {
    if (queueTab === 'all') return true;
    if (queueTab === 'failed') return isFailed(job.sessionStatus);
    if (queueTab === 'completed') return isCompleted(job.sessionStatus);
    if (queueTab === 'queue') return isQueue(job.sessionStatus);
    if (queueTab === 'received') return isReceived(job.sessionStatus);
    if (queueTab === 'processing') return isProcessing(job.sessionStatus);
    return true;
  });

  const counts = {
    all: DEMO_SYNC_JOBS.length,
    queue: DEMO_SYNC_JOBS.filter((j) => isQueue(j.sessionStatus)).length,
    received: DEMO_SYNC_JOBS.filter((j) => isReceived(j.sessionStatus)).length,
    processing: DEMO_SYNC_JOBS.filter((j) => isProcessing(j.sessionStatus)).length,
    completed: DEMO_SYNC_JOBS.filter((j) => isCompleted(j.sessionStatus)).length,
    failed: DEMO_SYNC_JOBS.filter((j) => isFailed(j.sessionStatus)).length,
  };

  const TABS: { key: QueueTab; label: string; count: number }[] = [
    { key: 'all', label: lang === 'cn' ? '全部' : 'All', count: counts.all },
    { key: 'queue', label: tr('common.queued', lang), count: counts.queue },
    { key: 'received', label: tr('common.received', lang), count: counts.received },
    { key: 'processing', label: tr('common.processing', lang), count: counts.processing },
    { key: 'completed', label: lang === 'cn' ? '已完成' : 'Completed', count: counts.completed },
    { key: 'failed', label: tr('common.failed', lang), count: counts.failed },
  ];

  return (
    <div>
      <TopBar title={tr('sync.title', lang)} subtitle={lang === 'cn' ? '同步任务管理与处理队列' : 'Sync job management and processing queue'} />
      <div className="p-6 space-y-6">
        {/* Queue Tabs */}
        <div className="flex items-center gap-1 border-b border-ink-200 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setQueueTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${queueTab === t.key ? 'border-teal-600 text-teal-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${queueTab === t.key ? 'bg-teal-100 text-teal-700' : 'bg-ink-100 text-ink-500'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Job Table */}
        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'source',
                header: lang === 'cn' ? '来源' : 'Source',
                render: (job: SyncJob) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                      <Database className="w-4 h-4 text-ink-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{job.sourceName}</p>
                      <p className="text-xs text-ink-400">{job.idempotencyKey}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'session',
                header: tr('rawData.session', lang),
                render: (job: SyncJob) => {
                  const athlete = DEMO_ATHLETES.find((a) => a.id === job.subjectId);
                  return <span className="text-sm text-ink-700">{athlete ? `${athlete.lastName} ${athlete.firstName}` : job.subjectId}</span>;
                },
              },
              {
                key: 'started',
                header: lang === 'cn' ? '开始时间' : 'Started',
                render: (job: SyncJob) => <span className="text-xs text-ink-600">{new Date(job.startedAt).toLocaleString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>,
              },
              {
                key: 'progress',
                header: lang === 'cn' ? '进度' : 'Progress',
                align: 'right',
                render: (job: SyncJob) => (
                  <span className="text-sm font-mono text-ink-600">{job.recordsProcessed}/{job.recordsTotal}</span>
                ),
              },
              {
                key: 'status',
                header: tr('sessions.status', lang),
                render: (job: SyncJob) => {
                  const cfg = JOB_STATUS_CONFIG[job.sessionStatus] || JOB_STATUS_CONFIG.RECEIVED;
                  const Icon = cfg.icon;
                  const isProc = job.sessionStatus === 'PROCESSING' || job.sessionStatus === 'VALIDATING';
                  return (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
                      <Icon className={`w-3.5 h-3.5 ${isProc ? 'animate-sync-spin' : ''}`} />
                      {lang === 'cn' ? cfg.cn : cfg.en}
                    </span>
                  );
                },
              },
              {
                key: 'action',
                header: '',
                align: 'right',
                render: (job: SyncJob) => (
                  <div className="flex items-center gap-1">
                    {isFailed(job.sessionStatus) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); addToast(lang === 'cn' ? '重试（演示）' : 'Retry (demo)', 'info'); }}
                        className="p-1.5 text-invalid-600 hover:bg-invalid-50 rounded-md transition-colors"
                        title={tr('common.retry', lang)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('session-detail', { sessionId: job.sourceId }); }}
                      className="p-1.5 text-ink-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredJobs}
            rowKey={(job) => job.id}
            emptyMessage={lang === 'cn' ? '没有符合条件的任务' : 'No jobs match this filter'}
          />
        </div>

        {/* Failed Job Detail */}
        {queueTab === 'failed' && filteredJobs.length > 0 && (
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '失败详情' : 'Failed Job Details'}</h4>
            <div className="space-y-3">
              {filteredJobs.filter((j) => j.errorMessage).map((job) => (
                <div key={job.id} className="p-3 bg-invalid-50 rounded-lg border border-invalid-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-invalid-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-invalid-800">{job.sourceName}</p>
                      <p className="text-xs text-invalid-700 mt-0.5">{job.errorMessage}</p>
                    </div>
                    <button onClick={() => addToast(lang === 'cn' ? '重试（演示）' : 'Retry (demo)', 'info')} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-invalid-600 hover:bg-invalid-700 text-white text-xs font-medium rounded-lg transition-colors">
                      <RefreshCw className="w-3 h-3" /> {tr('common.retry', lang)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sync History + Device Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>
      </div>
    </div>
  );
}
