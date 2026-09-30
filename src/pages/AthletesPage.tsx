import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ATHLETES, DEMO_TEAMS, DEMO_GROUPS, DEMO_SPORTS, getSessionsForAthlete, getSport } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge, StatusDot } from '@/components/ui/StatusBadge';
import { Sparkline } from '@/components/ui/Sparkline';
import { Search, Filter, Download, UserPlus, Dumbbell, Zap, Waves, TrendingUp, Activity, Shuffle } from 'lucide-react';
import type { Athlete } from '@/lib/types';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity,
  'sport-sprint': Zap,
  'sport-swim': Waves,
  'sport-hj': TrendingUp,
  'sport-imtp': Dumbbell,
  'sport-cod': Shuffle,
};

export function AthletesPage() {
  const { navigate, selectedTeamId, addToast, lang } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');

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
      const matchesSport = sportFilter === 'all' || a.sportId === sportFilter;
      return matchesSearch && matchesStatus && matchesGroup && matchesSport;
    });
  }, [teamAthletes, search, statusFilter, groupFilter, sportFilter]);

  const team = DEMO_TEAMS.find((t) => t.id === selectedTeamId);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
  };

  const getTrendData = (athlete: Athlete) => {
    const sessions = getSessionsForAthlete(athlete.id).filter((s) => s.sportId === athlete.sportId);
    return sessions.reverse().map((s) => Object.values(s.summary)[0] || 0);
  };

  return (
    <div>
      <TopBar
        title={tr('nav.athletes', lang)}
        subtitle={`${lang === 'cn' ? team?.nameCn : team?.name} · ${filteredAthletes.length} / ${teamAthletes.length}`}
        actions={
          <>
            <button onClick={() => addToast(lang === 'cn' ? '导出已开始（演示）' : 'Export started (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 hover:bg-ink-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> {tr('common.export', lang)}
            </button>
            <button onClick={() => addToast(lang === 'cn' ? '添加运动员（演示）' : 'Add athlete (demo)', 'info')} className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
              <UserPlus className="w-4 h-4" /> {tr('common.addAthlete', lang)}
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
              placeholder={tr('athletes.searchPlaceholder', lang)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
              <option value="all">{tr('library.allSports', lang)}</option>
              {DEMO_SPORTS.map((s) => (
                <option key={s.id} value={s.id}>{lang === 'cn' ? s.nameCn : s.name}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
              <option value="all">{tr('athletes.allStatuses', lang)}</option>
              <option value="normal">{tr('common.normal', lang)}</option>
              <option value="warning">{tr('common.warning', lang)}</option>
              <option value="attention">{tr('common.attention', lang)}</option>
            </select>
            <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
              <option value="all">{tr('athletes.allGroups', lang)}</option>
              {DEMO_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>{lang === 'cn' ? g.nameCn : g.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'lastName',
                header: lang === 'cn' ? '运动员' : 'Athlete',
                sortable: true,
                render: (a) => {
                  const sport = getSport(a.sportId);
                  const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center text-sm font-medium text-ink-600 shrink-0">
                        {a.firstName[0]}{a.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-ink-900">{a.lastName} {a.firstName}</p>
                        <p className="text-xs text-ink-500 flex items-center gap-1">
                          <SportIcon className="w-3 h-3" />
                          {a.position} · {a.height}cm · {a.weight}kg
                        </p>
                      </div>
                    </div>
                  );
                },
              },
              {
                key: 'sportId',
                header: lang === 'cn' ? '项目' : 'Sport',
                sortable: true,
                render: (a) => {
                  const sport = getSport(a.sportId);
                  return <span className="text-sm text-ink-700">{sport ? (lang === 'cn' ? sport.nameCn : sport.name) : '—'}</span>;
                },
              },
              {
                key: 'status',
                header: lang === 'cn' ? '状态' : 'Status',
                sortable: true,
                render: (a) => <StatusBadge status={a.status} lang={lang} />,
              },
              {
                key: 'lastTestDate',
                header: tr('athletes.lastTest', lang),
                sortable: true,
                render: (a) => (
                  <div>
                    <p className="text-ink-800">{formatDate(a.lastTestDate)}</p>
                    <p className="text-xs text-ink-400">{a.lastTestProtocol || '—'}</p>
                  </div>
                ),
              },
              {
                key: 'trend',
                header: lang === 'cn' ? '趋势' : 'Trend',
                align: 'right',
                render: (a) => {
                  const trend = getTrendData(a);
                  if (trend.length < 2) return <span className="text-ink-400">—</span>;
                  return (
                    <div className="flex items-center justify-end gap-2">
                      <Sparkline data={trend} width={50} height={20} color={a.status === 'attention' ? '#f97316' : a.status === 'warning' ? '#fbbf24' : '#06b56b'} />
                    </div>
                  );
                },
              },
              {
                key: 'tags',
                header: lang === 'cn' ? '标签' : 'Tags',
                render: (a) => (
                  <div className="flex flex-wrap gap-1">
                    {a.tags.length === 0 ? <span className="text-ink-400 text-xs">—</span> :
                      a.tags.map((tag) => (
                        <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          tag === 'Flagged' || tag === 'RTP' ? 'bg-attention-50 text-attention-700' : 'bg-ink-100 text-ink-600'
                        }`}>{tag}</span>
                      ))
                    }
                  </div>
                ),
              },
              {
                key: 'action',
                header: '',
                align: 'right',
                render: (a) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('testing', { athleteId: a.id }); }}
                    className="p-1.5 text-ink-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                    title={tr('common.startTesting', lang)}
                  >
                    <Dumbbell className="w-4 h-4" />
                  </button>
                ),
              },
            ]}
            data={filteredAthletes}
            rowKey={(a) => a.id}
            onRowClick={(a) => navigate('athlete-profile', { athleteId: a.id })}
            initialSort={{ key: 'lastName', direction: 'asc' }}
            emptyMessage={tr('athletes.noMatch', lang)}
          />
        </div>
      </div>
    </div>
  );
}
