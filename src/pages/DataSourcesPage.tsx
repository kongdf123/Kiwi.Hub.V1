import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { StatusDot } from '@/components/ui/StatusBadge';
import { DEMO_DATA_SOURCES, DEMO_SESSIONS } from '@/lib/demo-data';
import { Search, Server, Cpu, Plug, Upload } from 'lucide-react';
import type { DataSource, DataSourceCategory } from '@/lib/types';

const CATEGORY_ICONS: Record<DataSourceCategory, typeof Server> = {
  APPLICATION: Server,
  DEVICE: Cpu,
  INTEGRATION: Plug,
  IMPORT: Upload,
};

const CATEGORY_LABELS: Record<DataSourceCategory, { en: string; cn: string }> = {
  APPLICATION: { en: 'Application', cn: '应用' },
  DEVICE: { en: 'Device', cn: '设备' },
  INTEGRATION: { en: 'Integration', cn: '集成' },
  IMPORT: { en: 'Import', cn: '导入' },
};

const STATUS_COLORS: Record<string, string> = {
  connected: 'text-success-600',
  disconnected: 'text-ink-500',
  error: 'text-invalid-600',
};

export function DataSourcesPage() {
  const { lang } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = useMemo(() => {
    return DEMO_DATA_SOURCES.filter((ds) => {
      const name = lang === 'cn' ? ds.nameCn : ds.name;
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || ds.vendor.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || ds.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter, lang]);

  const getSessionCount = (sourceId: string) => DEMO_SESSIONS.filter((s) => s.dataSourceId === sourceId).length;

  return (
    <div>
      <TopBar title={tr('dataSources.title', lang)} subtitle={tr('dataSources.subtitle', lang)} />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'cn' ? '搜索数据源...' : 'Search data sources...'}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
            />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('common.allTypes', lang)}</option>
            {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
              <option key={key} value={key}>{lang === 'cn' ? val.cn : val.en}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'name',
                header: lang === 'cn' ? '数据源' : 'Source',
                render: (ds: DataSource) => {
                  const Icon = CATEGORY_ICONS[ds.category] || Server;
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-ink-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? ds.nameCn : ds.name}</p>
                        <p className="text-xs text-ink-400">{ds.vendor}</p>
                      </div>
                    </div>
                  );
                },
              },
              {
                key: 'category',
                header: tr('dataSources.type', lang),
                render: (ds: DataSource) => {
                  const cat = CATEGORY_LABELS[ds.category];
                  return <span className="text-sm text-ink-700">{cat ? (lang === 'cn' ? cat.cn : cat.en) : ds.category}</span>;
                },
              },
              {
                key: 'status',
                header: tr('dataSources.status', lang),
                render: (ds: DataSource) => (
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${STATUS_COLORS[ds.status] || 'text-ink-600'}`}>
                    <StatusDot status={ds.status === 'connected' ? 'normal' : ds.status === 'error' ? 'invalid' : 'offline'} size="sm" />
                    {ds.status === 'connected' ? (lang === 'cn' ? '已连接' : 'Connected') : ds.status === 'disconnected' ? (lang === 'cn' ? '未连接' : 'Disconnected') : (lang === 'cn' ? '错误' : 'Error')}
                  </span>
                ),
              },
              {
                key: 'dataTypes',
                header: tr('dataSources.dataTypes', lang),
                render: (ds: DataSource) => (
                  <div className="flex flex-wrap gap-1">
                    {ds.dataTypes.slice(0, 3).map((dt) => (
                      <span key={dt} className="text-xs px-2 py-0.5 rounded bg-ink-100 text-ink-600">{dt}</span>
                    ))}
                    {ds.dataTypes.length > 3 && <span className="text-xs text-ink-400">+{ds.dataTypes.length - 3}</span>}
                  </div>
                ),
              },
              {
                key: 'sessions',
                header: tr('dataSources.sessions', lang),
                align: 'right',
                render: (ds: DataSource) => <span className="text-sm font-mono text-ink-600">{getSessionCount(ds.id)}</span>,
              },
              {
                key: 'lastSync',
                header: tr('dataSources.lastSync', lang),
                align: 'right',
                render: (ds: DataSource) => <span className="text-sm text-ink-600">{ds.lastSync ? new Date(ds.lastSync).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }) : '—'}</span>,
              },
            ]}
            data={filtered}
            rowKey={(ds) => ds.id}
            emptyMessage={tr('dataSources.noMatch', lang)}
          />
        </div>
      </div>
    </div>
  );
}
