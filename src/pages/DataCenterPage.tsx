import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_IMPORTS, DEMO_SYNC_LOGS, getSport } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UploadCloud, FileText, CheckCircle, XCircle, RefreshCw, AlertTriangle, ArrowDown, ArrowUp, Database, HardDrive, Clock } from 'lucide-react';
import type { ImportJob } from '@/lib/types';

const IMPORT_STATUS_CONFIG: Record<ImportJob['status'], { label: { en: string; cn: string }; color: string; icon: typeof CheckCircle }> = {
  completed: { label: { en: 'Completed', cn: '已完成' }, color: 'text-success-700 bg-success-50 border-success-200', icon: CheckCircle },
  processing: { label: { en: 'Processing', cn: '处理中' }, color: 'text-teal-700 bg-teal-50 border-teal-200', icon: RefreshCw },
  mapping: { label: { en: 'Mapping', cn: '列映射' }, color: 'text-warning-700 bg-warning-50 border-warning-200', icon: AlertTriangle },
  pending: { label: { en: 'Pending', cn: '等待中' }, color: 'text-ink-600 bg-ink-100 border-ink-200', icon: Clock },
  failed: { label: { en: 'Failed', cn: '失败' }, color: 'text-invalid-700 bg-invalid-50 border-invalid-200', icon: XCircle },
};

export function DataCenterPage() {
  const { navigate, lang, addToast } = useApp();
  const [tab, setTab] = useState<'import' | 'history' | 'sync'>('import');
  const [showMapping, setShowMapping] = useState(false);

  const tabs = [
    { key: 'import' as const, label: tr('data.import', lang), icon: UploadCloud },
    { key: 'history' as const, label: tr('data.importHistory', lang), icon: FileText },
    { key: 'sync' as const, label: tr('data.syncStatus', lang), icon: Database },
  ];

  return (
    <div>
      <TopBar title={tr('data.title', lang)} subtitle={lang === 'cn' ? '导入、同步与数据质量' : 'Import, sync, and data quality'} />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-1 border-b border-ink-200">
          {tabs.map((t) => {
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

        {tab === 'import' && (
          <div className="space-y-6 animate-fade-in">
            {!showMapping ? (
              <div className="bg-white rounded-xl border border-ink-200 p-8">
                <div
                  className="border-2 border-dashed border-ink-300 rounded-xl p-12 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer"
                  onClick={() => setShowMapping(true)}
                >
                  <UploadCloud className="w-12 h-12 text-ink-400 mx-auto mb-4" />
                  <p className="text-base font-medium text-ink-700 mb-1">{tr('data.dragDrop', lang)}</p>
                  <p className="text-sm text-ink-400">{tr('data.supportedFormats', lang)}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {[
                    { icon: HardDrive, label: { en: 'CSV / Excel', cn: 'CSV / Excel' }, desc: { en: 'Spreadsheet import', cn: '表格导入' } },
                    { icon: Database, label: { en: 'API', cn: 'API' }, desc: { en: 'Direct API connection', cn: 'API直接对接' } },
                    { icon: RefreshCw, label: { en: 'Auto Sync', cn: '自动同步' }, desc: { en: 'From connected devices', cn: '从已连接设备' } },
                  ].map((src, i) => {
                    const Icon = src.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 bg-ink-50 rounded-lg">
                        <Icon className="w-5 h-5 text-ink-500 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-ink-800">{lang === 'cn' ? src.label.cn : src.label.en}</p>
                          <p className="text-xs text-ink-500">{lang === 'cn' ? src.desc.cn : src.desc.en}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-ink-200 p-6 animate-fade-in">
                <h3 className="text-sm font-semibold text-ink-900 mb-1">{tr('data.columnMapping', lang)}</h3>
                <p className="text-sm text-ink-500 mb-4">{lang === 'cn' ? 'hawkin_cmj_export.xlsx · 180行' : 'hawkin_cmj_export.xlsx · 180 rows'}</p>
                <div className="space-y-3">
                  {[
                    { source: 'Athlete Name', target: 'athlete_name', matched: true },
                    { source: 'Jump Height (cm)', target: 'jump_height', matched: true },
                    { source: 'Peak Force (N)', target: 'peak_force', matched: true },
                    { source: 'RSI', target: 'rsi_mod', matched: true },
                    { source: 'Left/Right %', target: '', matched: false },
                    { source: 'Timestamp', target: 'date', matched: true },
                    { source: 'Notes', target: '', matched: false },
                    { source: 'Device ID', target: '', matched: false },
                  ].map((col, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-ink-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink-800">{col.source}</p>
                      </div>
                      {col.matched ? (
                        <>
                          <span className="text-ink-400">→</span>
                          <span className="text-sm font-mono text-teal-700 bg-teal-50 px-2 py-1 rounded">{col.target}</span>
                          <CheckCircle className="w-4 h-4 text-success-500" />
                        </>
                      ) : (
                        <>
                          <span className="text-ink-400">→</span>
                          <select className="text-sm bg-ink-50 border border-ink-200 rounded px-2 py-1 text-ink-500">
                            <option>{lang === 'cn' ? '选择字段...' : 'Select field...'}</option>
                            <option>athlete_name</option>
                            <option>jump_height</option>
                            <option>peak_force</option>
                          </select>
                          <AlertTriangle className="w-4 h-4 text-warning-500" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-100">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-success-600 font-medium">{tr('data.matched', lang)}: 5</span>
                    <span className="text-warning-600 font-medium">{tr('data.unmatched', lang)}: 3</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowMapping(false)} className="px-4 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
                      {tr('common.cancel', lang)}
                    </button>
                    <button onClick={() => { setShowMapping(false); addToast(lang === 'cn' ? '导入已开始' : 'Import started', 'success'); }} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                      {tr('data.startImport', lang)}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden animate-fade-in">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-200">
                  <th className="px-4 py-2.5 text-xs font-medium text-ink-500 uppercase tracking-wider text-left">{lang === 'cn' ? '文件名' : 'File Name'}</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-ink-500 uppercase tracking-wider text-left">{lang === 'cn' ? '来源' : 'Source'}</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-ink-500 uppercase tracking-wider text-left">{lang === 'cn' ? '项目' : 'Sport'}</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-ink-500 uppercase tracking-wider text-right">{lang === 'cn' ? '行数' : 'Rows'}</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-ink-500 uppercase tracking-wider text-left">{lang === 'cn' ? '状态' : 'Status'}</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-ink-500 uppercase tracking-wider text-left">{lang === 'cn' ? '时间' : 'Created'}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_IMPORTS.map((job) => {
                  const cfg = IMPORT_STATUS_CONFIG[job.status];
                  const Icon = cfg.icon;
                  const sport = getSport(job.sportId);
                  return (
                    <tr key={job.id} className="border-b border-ink-100 hover:bg-ink-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-ink-800">{job.fileName}</td>
                      <td className="px-4 py-3 text-sm text-ink-600 capitalize">{job.source}</td>
                      <td className="px-4 py-3 text-sm text-ink-600">{sport ? (lang === 'cn' ? sport.nameCn : sport.name) : '—'}</td>
                      <td className="px-4 py-3 text-sm text-ink-600 text-right font-mono">{job.processedRows}/{job.totalRows}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                          <Icon className={`w-3 h-3 ${job.status === 'processing' ? 'animate-sync-spin' : ''}`} />
                          {lang === 'cn' ? cfg.label.cn : cfg.label.en}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-500">{new Date(job.createdAt).toLocaleString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'sync' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-ink-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '同步成功' : 'Sync Success'}</span>
                  <CheckCircle className="w-5 h-5 text-success-500" />
                </div>
                <p className="text-2xl font-semibold text-ink-900">{DEMO_SYNC_LOGS.filter((s) => s.status === 'success').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-ink-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '部分失败' : 'Partial'}</span>
                  <AlertTriangle className="w-5 h-5 text-warning-500" />
                </div>
                <p className="text-2xl font-semibold text-ink-900">{DEMO_SYNC_LOGS.filter((s) => s.status === 'partial').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-ink-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '同步失败' : 'Failed'}</span>
                  <XCircle className="w-5 h-5 text-invalid-500" />
                </div>
                <p className="text-2xl font-semibold text-ink-900">{DEMO_SYNC_LOGS.filter((s) => s.status === 'failed').length}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-100">
                <h3 className="text-sm font-semibold text-ink-900">{tr('sync.history', lang)}</h3>
              </div>
              <div className="divide-y divide-ink-100">
                {DEMO_SYNC_LOGS.map((log) => {
                  const Icon = log.direction === 'inbound' ? ArrowDown : ArrowUp;
                  const statusColor = log.status === 'success' ? 'text-success-600' : log.status === 'partial' ? 'text-warning-600' : 'text-invalid-600';
                  return (
                    <div key={log.id} className="flex items-center gap-4 px-5 py-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${log.direction === 'inbound' ? 'bg-teal-50' : 'bg-ink-100'}`}>
                        <Icon className={`w-4 h-4 ${log.direction === 'inbound' ? 'text-teal-600' : 'text-ink-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900">{log.source}</p>
                        <p className="text-xs text-ink-500">{log.message}</p>
                      </div>
                      <span className="text-xs text-ink-500 font-mono">{log.records} {tr('sync.records', lang)}</span>
                      <span className={`text-xs font-medium ${statusColor}`}>{tr(`sync.${log.status}`, lang)}</span>
                      <span className="text-xs text-ink-400">{new Date(log.timestamp).toLocaleTimeString(lang === 'cn' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={() => navigate('sync-center')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              {lang === 'cn' ? '查看全部同步记录 →' : 'View all sync logs →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
