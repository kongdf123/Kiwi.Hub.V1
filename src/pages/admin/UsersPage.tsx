import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_USERS, DEMO_TEAMS } from '@/lib/demo-data';
import { Search, UserPlus } from 'lucide-react';
import type { User } from '@/lib/types';

export function UsersPage() {
  const { lang, addToast } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return DEMO_USERS.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [search]);

  return (
    <div>
      <TopBar
        title={tr('admin.users', lang)}
        actions={
          <button onClick={() => addToast(lang === 'cn' ? '添加用户（演示）' : 'Add user (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
            <UserPlus className="w-4 h-4" /> {lang === 'cn' ? '添加用户' : 'Add User'}
          </button>
        }
      />
      <div className="p-6 space-y-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'cn' ? '搜索用户...' : 'Search users...'}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
          />
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'name',
                header: lang === 'cn' ? '用户' : 'User',
                render: (u: User) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-sm font-medium text-ink-600 shrink-0">
                      {u.name[0]}{u.name.split(' ')[1]?.[0] || ''}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{u.name}</p>
                      <p className="text-xs text-ink-500">{u.email}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'role',
                header: lang === 'cn' ? '角色' : 'Role',
                render: (u: User) => <span className="text-sm text-ink-700">{lang === 'cn' ? u.roleCn : u.role}</span>,
              },
              {
                key: 'teamAccess',
                header: lang === 'cn' ? '队伍权限' : 'Team Access',
                render: (u: User) => (
                  <span className="text-sm text-ink-600">
                    {u.teamAccess.length} {lang === 'cn' ? '个队伍' : 'teams'}
                  </span>
                ),
              },
              {
                key: 'lastActive',
                header: lang === 'cn' ? '最近活跃' : 'Last Active',
                align: 'right',
                render: (u: User) => <span className="text-sm text-ink-600">{new Date(u.lastActive).toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}</span>,
              },
              {
                key: 'status',
                header: tr('dataSources.status', lang),
                render: (u: User) => (
                  <span className={`text-sm font-medium ${u.status === 'active' ? 'text-success-600' : 'text-ink-500'}`}>
                    {u.status === 'active' ? (lang === 'cn' ? '活跃' : 'Active') : (lang === 'cn' ? '未活跃' : 'Inactive')}
                  </span>
                ),
              },
            ]}
            data={filtered}
            rowKey={(u) => u.id}
            emptyMessage={lang === 'cn' ? '没有符合条件的用户' : 'No users match your search'}
          />
        </div>
      </div>
    </div>
  );
}
