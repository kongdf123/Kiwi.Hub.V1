import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { Settings, Globe, Clock, Bell, Shield, Database } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const { lang } = useApp();
  const [autoSync, setAutoSync] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState('90');

  return (
    <div>
      <TopBar title={tr('admin.settings', lang)} />
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '语言与区域' : 'Language & Region'}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '显示语言' : 'Display Language'}</label>
              <select className="mt-1 w-full text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="cn">中文</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '时区' : 'Timezone'}</label>
              <select className="mt-1 w-full text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option>Asia/Shanghai</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '通知' : 'Notifications'}</h4>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-ink-700">{lang === 'cn' ? '处理完成通知' : 'Processing complete alerts'}</span>
              <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="w-9 h-5 rounded-full appearance-none bg-ink-200 checked:bg-teal-500 transition-colors relative cursor-pointer before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-ink-700">{lang === 'cn' ? '自动同步' : 'Auto-sync'}</span>
              <input type="checkbox" checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} className="w-9 h-5 rounded-full appearance-none bg-ink-200 checked:bg-teal-500 transition-colors relative cursor-pointer before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '数据保留' : 'Data Retention'}</h4>
          </div>
          <div>
            <label className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '保留天数' : 'Retention period (days)'}</label>
            <select value={dataRetention} onChange={(e) => setDataRetention(e.target.value)} className="mt-1 w-full text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option value="30">30</option>
              <option value="90">90</option>
              <option value="365">365</option>
              <option value="unlimited">{lang === 'cn' ? '无限制' : 'Unlimited'}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
