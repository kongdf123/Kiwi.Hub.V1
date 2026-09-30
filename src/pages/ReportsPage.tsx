import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ATHLETES, DEMO_TEAMS, DEMO_SPORTS } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { FileText, Download, Plus, File, Clock, CheckCircle, Eye } from 'lucide-react';

interface ReportItem {
  id: string;
  name: string;
  nameCn: string;
  type: string;
  createdAt: string;
  status: 'ready' | 'generating' | 'scheduled';
  athletes: number;
}

const DEMO_REPORTS: ReportItem[] = [
  { id: 'r-1', name: 'Weekly Performance Summary', nameCn: '周表现总结', type: 'summary', createdAt: '2026-09-28T10:00:00Z', status: 'ready', athletes: 8 },
  { id: 'r-2', name: 'Pre-season Baseline Report', nameCn: '赛季前基线报告', type: 'baseline', createdAt: '2026-09-25T14:00:00Z', status: 'ready', athletes: 32 },
  { id: 'r-3', name: 'Athlete Comparison: Sprint Group', nameCn: '冲刺组对比报告', type: 'comparison', createdAt: '2026-09-29T09:00:00Z', status: 'generating', athletes: 6 },
  { id: 'r-4', name: 'Monthly Trend Analysis', nameCn: '月度趋势分析', type: 'trend', createdAt: '2026-09-20T08:00:00Z', status: 'scheduled', athletes: 24 },
];

export function ReportsPage() {
  const { lang, addToast } = useApp();
  const [showBuilder, setShowBuilder] = useState(false);

  const statusConfig = {
    ready: { label: { en: 'Ready', cn: '已生成' }, color: 'text-success-700 bg-success-50', icon: CheckCircle },
    generating: { label: { en: 'Generating', cn: '生成中' }, color: 'text-teal-700 bg-teal-50', icon: Clock },
    scheduled: { label: { en: 'Scheduled', cn: '已排期' }, color: 'text-ink-600 bg-ink-100', icon: Clock },
  };

  return (
    <div>
      <TopBar
        title={tr('nav.reports', lang)}
        subtitle={lang === 'cn' ? '生成与导出表现报告' : 'Generate and export performance reports'}
        actions={
          <button onClick={() => setShowBuilder(!showBuilder)} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> {lang === 'cn' ? '创建报告' : 'Create Report'}
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {showBuilder && (
          <div className="bg-white rounded-xl border border-ink-200 p-6 animate-slide-up">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '报告生成器' : 'Report Builder'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">{lang === 'cn' ? '报告名称' : 'Report Name'}</label>
                <input type="text" placeholder={lang === 'cn' ? '输入报告名称...' : 'Enter report name...'} className="w-full px-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">{lang === 'cn' ? '报告类型' : 'Report Type'}</label>
                <select className="w-full px-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
                  <option>{lang === 'cn' ? '总结报告' : 'Summary Report'}</option>
                  <option>{lang === 'cn' ? '基线报告' : 'Baseline Report'}</option>
                  <option>{lang === 'cn' ? '对比报告' : 'Comparison Report'}</option>
                  <option>{lang === 'cn' ? '趋势分析' : 'Trend Analysis'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">{lang === 'cn' ? '选择运动员' : 'Select Athletes'}</label>
                <select className="w-full px-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
                  <option>{lang === 'cn' ? '全队' : 'All Athletes'}</option>
                  {DEMO_ATHLETES.map((a) => <option key={a.id}>{a.lastName} {a.firstName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 uppercase tracking-wider mb-1.5">{lang === 'cn' ? '运动项目' : 'Sport'}</label>
                <select className="w-full px-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
                  {DEMO_SPORTS.map((s) => <option key={s.id}>{lang === 'cn' ? s.nameCn : s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-ink-100">
              <button onClick={() => { setShowBuilder(false); addToast(lang === 'cn' ? '报告生成中...' : 'Report generating...', 'success'); }} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                {lang === 'cn' ? '生成报告' : 'Generate Report'}
              </button>
              <button onClick={() => setShowBuilder(false)} className="px-4 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
                {tr('common.cancel', lang)}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_REPORTS.map((report) => {
            const cfg = statusConfig[report.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={report.id} className="bg-white rounded-xl border border-ink-200 p-5 hover:border-ink-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-ink-50 flex items-center justify-center">
                    <FileText className="w-5.5 h-5.5 text-ink-600" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                    <StatusIcon className={`w-3 h-3 ${report.status === 'generating' ? 'animate-sync-spin' : ''}`} />
                    {lang === 'cn' ? cfg.label.cn : cfg.label.en}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-ink-900 mb-1">{lang === 'cn' ? report.nameCn : report.name}</h3>
                <p className="text-xs text-ink-500 mb-3">{report.athletes} {lang === 'cn' ? '名运动员' : 'athletes'} · {new Date(report.createdAt).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-ink-100">
                  <button onClick={() => addToast(lang === 'cn' ? '预览（演示）' : 'Preview (demo)', 'info')} className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
                    <Eye className="w-3.5 h-3.5" /> {lang === 'cn' ? '预览' : 'Preview'}
                  </button>
                  {report.status === 'ready' && (
                    <button onClick={() => addToast(lang === 'cn' ? '下载已开始' : 'Download started', 'info')} className="flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-ink-800 ml-auto">
                      <Download className="w-3.5 h-3.5" /> {lang === 'cn' ? '下载' : 'Download'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
