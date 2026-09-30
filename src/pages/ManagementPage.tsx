import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_DEVICES, DEMO_USERS, DEMO_TEAMS, DEMO_PROTOCOLS, DEMO_SPORTS, getSport } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge, StatusDot } from '@/components/ui/StatusBadge';
import { Zap, Users, Shield, FlaskConical, Plus, Battery } from 'lucide-react';

type Tab = 'devices' | 'users' | 'teams' | 'protocols';

export function ManagementPage() {
  const { lang, addToast } = useApp();
  const [tab, setTab] = useState<Tab>('devices');

  const tabs = [
    { key: 'devices' as Tab, label: tr('mgmt.devices', lang), icon: Zap },
    { key: 'users' as Tab, label: tr('mgmt.users', lang), icon: Users },
    { key: 'teams' as Tab, label: tr('mgmt.teams', lang), icon: Shield },
    { key: 'protocols' as Tab, label: tr('mgmt.protocols', lang), icon: FlaskConical },
  ];

  return (
    <div>
      <TopBar title={tr('nav.management', lang)} subtitle={lang === 'cn' ? '设备、用户、队伍与方案管理' : 'Devices, users, teams, and protocols'} />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-1 border-b border-ink-200">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-teal-600 text-teal-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'devices' && (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100">
              <h3 className="text-sm font-semibold text-ink-900">{tr('mgmt.devices', lang)}</h3>
              <button onClick={() => addToast(lang === 'cn' ? '添加设备（演示）' : 'Add device (demo)', 'info')} className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium">
                <Plus className="w-4 h-4" /> {lang === 'cn' ? '添加设备' : 'Add Device'}
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'serialNumber', header: lang === 'cn' ? '序列号' : 'Serial Number', sortable: true, render: (d) => <span className="font-mono text-sm font-medium text-ink-900">{d.serialNumber}</span> },
                { key: 'type', header: lang === 'cn' ? '类型' : 'Type', sortable: true },
                { key: 'location', header: lang === 'cn' ? '位置' : 'Location' },
                { key: 'firmware', header: lang === 'cn' ? '固件' : 'Firmware', render: (d) => <span className="font-mono text-xs">{d.firmware}</span> },
                { key: 'battery', header: lang === 'cn' ? '电量' : 'Battery', align: 'right', render: (d) => d.battery > 0 ? <span className="flex items-center gap-1 justify-end text-sm"><Battery className="w-3.5 h-3.5 text-ink-400" />{d.battery}%</span> : <span className="text-ink-400">—</span> },
                { key: 'status', header: lang === 'cn' ? '状态' : 'Status', render: (d) => <StatusBadge status={d.status} lang={lang} /> },
              ]}
              data={DEMO_DEVICES}
              rowKey={(d) => d.id}
            />
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100">
              <h3 className="text-sm font-semibold text-ink-900">{tr('mgmt.users', lang)}</h3>
              <button onClick={() => addToast(lang === 'cn' ? '邀请用户（演示）' : 'Invite user (demo)', 'info')} className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium">
                <Plus className="w-4 h-4" /> {lang === 'cn' ? '邀请用户' : 'Invite User'}
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'name', header: lang === 'cn' ? '姓名' : 'Name', sortable: true, render: (u) => <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">{u.name[0]}</div><span className="font-medium text-ink-900">{u.name}</span></div> },
                { key: 'email', header: 'Email' },
                { key: 'role', header: lang === 'cn' ? '角色' : 'Role', render: (u) => <span className="text-sm text-ink-700">{lang === 'cn' ? u.roleCn : u.role}</span> },
                { key: 'teamAccess', header: lang === 'cn' ? '队伍权限' : 'Team Access', render: (u) => <span className="text-sm text-ink-600">{u.teamAccess.length} {lang === 'cn' ? '个队伍' : 'teams'}</span> },
                { key: 'status', header: lang === 'cn' ? '状态' : 'Status', render: (u) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status === 'active' ? 'bg-success-50 text-success-700' : 'bg-ink-100 text-ink-500'}`}>{u.status === 'active' ? (lang === 'cn' ? '活跃' : 'Active') : (lang === 'cn' ? '未活跃' : 'Inactive')}</span> },
              ]}
              data={DEMO_USERS}
              rowKey={(u) => u.id}
            />
          </div>
        )}

        {tab === 'teams' && (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100">
              <h3 className="text-sm font-semibold text-ink-900">{tr('mgmt.teams', lang)}</h3>
              <button onClick={() => addToast(lang === 'cn' ? '添加队伍（演示）' : 'Add team (demo)', 'info')} className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium">
                <Plus className="w-4 h-4" /> {lang === 'cn' ? '添加队伍' : 'Add Team'}
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'name', header: lang === 'cn' ? '队伍' : 'Team', sortable: true, render: (t) => <span className="font-medium text-ink-900">{lang === 'cn' ? t.nameCn : t.name}</span> },
                { key: 'sportId', header: lang === 'cn' ? '项目' : 'Sport', render: (t) => { const s = getSport(t.sportId); return <span className="text-sm text-ink-700">{s ? (lang === 'cn' ? s.nameCn : s.name) : '—'}</span>; } },
                { key: 'season', header: lang === 'cn' ? '赛季' : 'Season' },
                { key: 'athleteCount', header: lang === 'cn' ? '人数' : 'Athletes', align: 'right' },
              ]}
              data={DEMO_TEAMS}
              rowKey={(t) => t.id}
            />
          </div>
        )}

        {tab === 'protocols' && (
          <div className="bg-white rounded-xl border border-ink-200 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100">
              <h3 className="text-sm font-semibold text-ink-900">{tr('mgmt.protocols', lang)}</h3>
              <button onClick={() => addToast(lang === 'cn' ? '创建方案（演示）' : 'Create protocol (demo)', 'info')} className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium">
                <Plus className="w-4 h-4" /> {lang === 'cn' ? '创建方案' : 'Create Protocol'}
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'name', header: lang === 'cn' ? '方案' : 'Protocol', sortable: true, render: (p) => <span className="font-medium text-ink-900">{lang === 'cn' ? p.nameCn : p.name}</span> },
                { key: 'sportId', header: lang === 'cn' ? '项目' : 'Sport', render: (p) => { const s = getSport(p.sportId); return <span className="text-sm text-ink-700">{s ? (lang === 'cn' ? s.nameCn : s.name) : '—'}</span>; } },
                { key: 'deviceType', header: lang === 'cn' ? '设备类型' : 'Device Type' },
                { key: 'trials', header: lang === 'cn' ? '试次数' : 'Trials', align: 'right' },
                { key: 'durationMin', header: lang === 'cn' ? '时长' : 'Duration', align: 'right', render: (p) => <span>{p.durationMin} {tr('library.duration', lang)}</span> },
                { key: 'difficulty', header: lang === 'cn' ? '难度' : 'Difficulty', render: (p) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.difficulty === 'basic' ? 'bg-success-50 text-success-700' : p.difficulty === 'standard' ? 'bg-teal-50 text-teal-700' : 'bg-attention-50 text-attention-700'}`}>{p.difficulty}</span> },
              ]}
              data={DEMO_PROTOCOLS}
              rowKey={(p) => p.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
