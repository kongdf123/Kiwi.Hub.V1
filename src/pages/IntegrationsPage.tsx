import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_INTEGRATIONS } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { Modal } from '@/components/ui/Modal';
import { Zap, Watch, Heart, Database, Dumbbell, CheckCircle, XCircle, AlertTriangle, Plus, Key, RefreshCw, Code, AlertCircle, type LucideIcon } from 'lucide-react';
import type { Integration } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = { Zap, Watch, Heart, Database, Dumbbell };

const AUTH_TYPE_LABELS: Record<string, { en: string; cn: string }> = {
  api_key: { en: 'API Key', cn: 'API密钥' },
  oauth: { en: 'OAuth', cn: 'OAuth' },
  m2m: { en: 'Machine-to-Machine', cn: '机器间认证' },
};

export function IntegrationsPage() {
  const { lang, addToast } = useApp();
  const [detailIntegration, setDetailIntegration] = useState<Integration | null>(null);

  const statusConfig = {
    connected: { label: { en: 'Connected', cn: '已连接' }, color: 'text-success-700 bg-success-50 border-success-200', icon: CheckCircle },
    disconnected: { label: { en: 'Disconnected', cn: '未连接' }, color: 'text-ink-600 bg-ink-100 border-ink-200', icon: XCircle },
    error: { label: { en: 'Error', cn: '错误' }, color: 'text-invalid-700 bg-invalid-50 border-invalid-200', icon: AlertTriangle },
  };

  return (
    <div>
      <TopBar title={tr('int.title', lang)} subtitle={lang === 'cn' ? '外部平台连接与集成管理' : 'External platform connections and integration management'} />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_INTEGRATIONS.map((integration) => {
            const Icon = ICONS[integration.icon] || Zap;
            const cfg = statusConfig[integration.status];
            const StatusIcon = cfg.icon;
            const authType = integration.id.includes('garmin') || integration.id.includes('whoop') ? 'oauth' : 'api_key';
            return (
              <div key={integration.id} className="bg-white rounded-xl border border-ink-200 p-5 hover:border-ink-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-ink-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-ink-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-ink-900">{lang === 'cn' ? integration.nameCn : integration.name}</h3>
                      <p className="text-xs text-ink-500">{integration.category} · {lang === 'cn' ? AUTH_TYPE_LABELS[authType].cn : AUTH_TYPE_LABELS[authType].en}</p>
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
                  <div className="flex items-center gap-3">
                    <button onClick={() => setDetailIntegration(integration)} className="text-sm font-medium text-ink-600 hover:text-ink-800">
                      {lang === 'cn' ? '配置' : 'Configure'}
                    </button>
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
              </div>
            );
          })}

          <div className="bg-ink-50 rounded-xl border-2 border-dashed border-ink-200 p-5 flex flex-col items-center justify-center text-center min-h-[200px] hover:border-teal-400 hover:bg-teal-50/20 transition-all cursor-pointer"
            onClick={() => addToast(lang === 'cn' ? '更多集成即将推出' : 'More integrations coming soon', 'info')}
          >
            <Plus className="w-8 h-8 text-ink-400 mb-2" />
            <p className="text-sm font-medium text-ink-600">{lang === 'cn' ? '浏览更多集成' : 'Browse more integrations'}</p>
            <p className="text-xs text-ink-400 mt-1">Strava, TrainingPeaks, WHOOP...</p>
          </div>
        </div>
      </div>

      {/* Integration Detail Modal */}
      {detailIntegration && (
        <Modal
          open={!!detailIntegration}
          onClose={() => setDetailIntegration(null)}
          title={lang === 'cn' ? detailIntegration.nameCn : detailIntegration.name}
          width="max-w-lg"
          footer={
            <div className="flex items-center gap-3">
              <button onClick={() => setDetailIntegration(null)} className="px-4 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
                {tr('common.cancel', lang)}
              </button>
              <button onClick={() => { addToast(lang === 'cn' ? '配置已保存（演示）' : 'Configuration saved (demo)', 'success'); setDetailIntegration(null); }} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                {tr('common.save', lang)}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-ink-400" />
              <span className="text-sm text-ink-700">{lang === 'cn' ? '认证方式' : 'Authentication'}: </span>
              <span className="text-sm font-medium text-ink-900">{lang === 'cn' ? AUTH_TYPE_LABELS[detailIntegration.id.includes('garmin') || detailIntegration.id.includes('whoop') ? 'oauth' : 'api_key'].cn : AUTH_TYPE_LABELS[detailIntegration.id.includes('garmin') || detailIntegration.id.includes('whoop') ? 'oauth' : 'api_key'].en}</span>
            </div>
            <div>
              <label className="text-xs text-ink-500 uppercase tracking-wider mb-1.5 block">{lang === 'cn' ? '权限范围' : 'Scopes'}</label>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-ink-100 text-ink-700">read:sessions</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-ink-100 text-ink-700">read:athletes</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-ink-100 text-ink-700">write:results</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">{lang === 'cn' ? '上次请求' : 'Last Request'}</span>
              <span className="text-ink-700">{detailIntegration.lastSync ? new Date(detailIntegration.lastSync).toLocaleString(lang === 'cn' ? 'zh-CN' : 'en-US') : '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">{lang === 'cn' ? '错误计数' : 'Error Count'}</span>
              <span className={`font-medium ${detailIntegration.status === 'error' ? 'text-invalid-600' : 'text-success-600'}`}>{detailIntegration.status === 'error' ? '3' : '0'}</span>
            </div>
            {detailIntegration.status === 'error' && (
              <div className="p-3 bg-invalid-50 rounded-lg border border-invalid-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-invalid-600 mt-0.5 shrink-0" />
                <span className="text-xs text-invalid-700">{lang === 'cn' ? '认证令牌已过期，请重新连接。' : 'Authentication token expired. Please reconnect.'}</span>
              </div>
            )}
            <div className="pt-3 border-t border-ink-100">
              <button onClick={() => addToast(lang === 'cn' ? '查看API文档（演示）' : 'View API docs (demo)', 'info')} className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700">
                <Code className="w-4 h-4" /> {lang === 'cn' ? 'API 文档' : 'API Documentation'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
