import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_INTEGRATIONS } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { Zap, Watch, Heart, Database, Dumbbell, CheckCircle, XCircle, AlertTriangle, Plus } from 'lucide-react';

const ICONS: Record<string, typeof Zap> = {
  Zap, Watch, Heart, Database, Dumbbell,
};

export function IntegrationsPage() {
  const { lang, addToast } = useApp();

  const statusConfig = {
    connected: { label: { en: 'Connected', cn: '已连接' }, color: 'text-success-700 bg-success-50 border-success-200', icon: CheckCircle },
    disconnected: { label: { en: 'Disconnected', cn: '未连接' }, color: 'text-ink-600 bg-ink-100 border-ink-200', icon: XCircle },
    error: { label: { en: 'Error', cn: '错误' }, color: 'text-invalid-700 bg-invalid-50 border-invalid-200', icon: AlertTriangle },
  };

  return (
    <div>
      <TopBar title={tr('int.title', lang)} subtitle={lang === 'cn' ? '连接外部数据源和平台' : 'Connect external data sources and platforms'} />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_INTEGRATIONS.map((integration) => {
            const Icon = ICONS[integration.icon] || Zap;
            const cfg = statusConfig[integration.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={integration.id} className="bg-white rounded-xl border border-ink-200 p-5 hover:border-ink-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-ink-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-ink-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-ink-900">{lang === 'cn' ? integration.nameCn : integration.name}</h3>
                      <p className="text-xs text-ink-500">{integration.category}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {lang === 'cn' ? cfg.label.cn : cfg.label.en}
                  </span>
                </div>
                <p className="text-sm text-ink-600 mb-4">{integration.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                  <span className="text-xs text-ink-400">
                    {integration.lastSync ? `${tr('int.lastSync', lang)}: ${new Date(integration.lastSync).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : '—'}
                  </span>
                  {integration.status === 'connected' ? (
                    <button onClick={() => addToast(lang === 'cn' ? '已断开连接（演示）' : 'Disconnected (demo)', 'info')} className="text-sm font-medium text-invalid-600 hover:text-invalid-700">
                      {tr('int.disconnect', lang)}
                    </button>
                  ) : integration.status === 'error' ? (
                    <button onClick={() => addToast(lang === 'cn' ? '重新连接中...' : 'Reconnecting...', 'info')} className="text-sm font-medium text-teal-600 hover:text-teal-700">
                      {lang === 'cn' ? '重新连接' : 'Reconnect'}
                    </button>
                  ) : (
                    <button onClick={() => addToast(lang === 'cn' ? '连接中...' : 'Connecting...', 'info')} className="text-sm font-medium text-teal-600 hover:text-teal-700">
                      {tr('int.connect', lang)}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add new integration card */}
          <div className="bg-ink-50 rounded-xl border-2 border-dashed border-ink-200 p-5 flex flex-col items-center justify-center text-center min-h-[200px] hover:border-teal-400 hover:bg-teal-50/20 transition-all cursor-pointer"
            onClick={() => addToast(lang === 'cn' ? '更多集成即将推出' : 'More integrations coming soon', 'info')}
          >
            <Plus className="w-8 h-8 text-ink-400 mb-2" />
            <p className="text-sm font-medium text-ink-600">{lang === 'cn' ? '浏览更多集成' : 'Browse more integrations'}</p>
            <p className="text-xs text-ink-400 mt-1">{lang === 'cn' ? 'Strava, TrainingPeaks, WHOOP...' : 'Strava, TrainingPeaks, WHOOP...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
