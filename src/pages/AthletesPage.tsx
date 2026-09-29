import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { DEMO_ATHLETES, DEMO_TEAMS, DEMO_GROUPS, getSessionsForAthlete } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge, StatusDot } from '@/components/ui/StatusBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { Search, Filter, Download, UserPlus, Dumbbell } from 'lucide-react';
import type { Athlete } from '@/lib/types';

export function AthletesPage() {
  const { navigate, selectedTeamId, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  const teamAthletes = useMemo(
    () => DEMO_ATHLETES.filter((a) => a.teamId === selectedTeamId),
    [selectedTeamId],
  );

  const filteredAthletes = useMemo(() => {
    return teamAthletes.filter((a) => {
      const fullName = `${a.lastName} ${a.firstName}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) || a.position.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesGroup = groupFilter === 'all' || a.groupIds.includes(groupFilter);
      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [teamAthletes, search, statusFilter, groupFilter]);

  const team = DEMO_TEAMS.find((t) => t.id === selectedTeamId);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTrendData = (athlete: Athlete) => {
    const sessions = getSessionsForAthlete(athlete.id).filter((s) => s.testType === 'CMJ');
    return sessions.reverse().map((s) => s.summary.jump_height || 0);
  };

  return (
    <div>
      <TopBar
        title="Athletes"
        subtitle={`${team?.name} · ${filteredAthletes.length} of ${teamAthletes.length} shown`}
        actions={
          <>
            <button onClick={() => addToast('Export started (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => addToast('Add athlete (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors">
              <UserPlus className="w-4 h-4" /> Add Athlete
            </button>
          </>
        }
      />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or position..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="attention">Attention</option>
            </select>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400 transition-all"
            >
              <option value="all">All Groups</option>
              {DEMO_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'lastName',
                header: 'Athlete',
                sortable: true,
                render: (a) => (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center text-sm font-medium text-ink-600 shrink-0">
                      {a.firstName[0]}{a.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{a.lastName} {a.firstName}</p>
                      <p className="text-xs text-ink-500">{a.position} · {a.height}cm · {a.weight}kg</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                sortable: true,
                render: (a) => <StatusBadge status={a.status} />,
              },
              {
                key: 'lastTestDate',
                header: 'Last Test',
                sortable: true,
                render: (a) => (
                  <div>
                    <p className="text-ink-800">{formatDate(a.lastTestDate)}</p>
                    <p className="text-xs text-ink-400">{a.lastTestType || '—'}</p>
                  </div>
                ),
              },
              {
                key: 'jumpHeight',
                header: 'Jump Height',
                align: 'right',
                render: (a) => {
                  const sessions = getSessionsForAthlete(a.id).filter((s) => s.testType === 'CMJ');
                  const latest = sessions[0];
                  const trend = getTrendData(a);
                  return (
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-sm text-ink-800">{latest ? `${latest.summary.jump_height?.toFixed(1)} cm` : '—'}</span>
                      {trend.length > 1 && <Sparkline data={trend} width={50} height={20} color={a.status === 'attention' ? '#f97316' : a.status === 'warning' ? '#fbbf24' : '#3384fc'} />}
                    </div>
                  );
                },
              },
              {
                key: 'asymmetry',
                header: 'Asymmetry',
                align: 'right',
                render: (a) => {
                  const sessions = getSessionsForAthlete(a.id).filter((s) => s.testType === 'CMJ');
                  const latest = sessions[0];
                  if (!latest) return <span className="text-ink-400">—</span>;
                  const val = latest.summary.asymmetry || 0;
                  const color = val > 10 ? 'text-attention-600' : val > 7 ? 'text-warning-600' : 'text-success-600';
                  return <span className={`font-mono text-sm ${color}`}>{val.toFixed(1)}%</span>;
                },
              },
              {
                key: 'action',
                header: '',
                align: 'right',
                render: (a) => (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('test-capture', { athleteId: a.id }); }}
                      className="p-1.5 text-ink-400 hover:text-accent-600 hover:bg-accent-50 rounded-md transition-colors"
                      title="Start test"
                    >
                      <Dumbbell className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredAthletes}
            rowKey={(a) => a.id}
            onRowClick={(a) => navigate('athlete-profile', { athleteId: a.id })}
            initialSort={{ key: 'lastName', direction: 'asc' }}
            emptyMessage="No athletes match your filters"
          />
        </div>
      </div>
    </div>
  );
}
