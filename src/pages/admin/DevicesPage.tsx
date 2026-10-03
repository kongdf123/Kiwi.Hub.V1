import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_DEVICES } from '@/lib/demo-data';
import type { Device } from '@/lib/types';

export function DevicesPage() {
  const { lang } = useApp();

  return (
    <div>
      <TopBar title={tr('admin.devices', lang)} />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'serial',
                header: lang === 'cn' ? '设备' : 'Device',
                render: (d: Device) => (
                  <div>
                    <p className="text-sm font-medium text-ink-900">{d.serialNumber}</p>
                    <p className="text-xs text-ink-500">{d.type}</p>
                  </div>
                ),
              },
              {
                key: 'location',
                header: lang === 'cn' ? '位置' : 'Location',
                render: (d: Device) => <span className="text-sm text-ink-700">{d.location}</span>,
              },
              {
                key: 'firmware',
                header: lang === 'cn' ? '固件' : 'Firmware',
                render: (d: Device) => <span className="text-sm font-mono text-ink-600">{d.firmware}</span>,
              },
              {
                key: 'battery',
                header: lang === 'cn' ? '电量' : 'Battery',
                align: 'right',
                render: (d: Device) => (
                  <span className={`text-sm font-mono ${d.battery > 50 ? 'text-success-600' : d.battery > 20 ? 'text-warning-600' : 'text-invalid-600'}`}>
                    {d.battery > 0 ? `${d.battery}%` : '—'}
                  </span>
                ),
              },
              {
                key: 'lastSync',
                header: lang === 'cn' ? '上次同步' : 'Last Sync',
                align: 'right',
                render: (d: Device) => <span className="text-sm text-ink-600">{new Date(d.lastSync).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}</span>,
              },
              {
                key: 'status',
                header: tr('dataSources.status', lang),
                render: (d: Device) => <StatusBadge status={d.status} lang={lang} />,
              },
            ]}
            data={DEMO_DEVICES}
            rowKey={(d) => d.id}
          />
        </div>
      </div>
    </div>
  );
}
