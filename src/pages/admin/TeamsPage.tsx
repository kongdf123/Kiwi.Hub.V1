import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { DataTable } from '@/components/ui/DataTable';
import { DEMO_TEAMS, DEMO_GROUPS, DEMO_ATHLETES, DEMO_SPORTS, getSport } from '@/lib/demo-data';
import type { Team, Group } from '@/lib/types';

export function TeamsPage() {
  const { lang } = useApp();

  return (
    <div>
      <TopBar title={tr('admin.teams', lang)} />
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <h4 className="text-sm font-semibold text-ink-900 px-5 py-4 border-b border-ink-100">
            {lang === 'cn' ? '队伍' : 'Teams'}
          </h4>
          <DataTable
            columns={[
              {
                key: 'name',
                header: lang === 'cn' ? '队伍' : 'Team',
                render: (t: Team) => <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? t.nameCn : t.name}</p>,
              },
              {
                key: 'sport',
                header: lang === 'cn' ? '项目' : 'Sport',
                render: (t: Team) => {
                  const sport = getSport(t.sportId);
                  return <span className="text-sm text-ink-700">{sport ? (lang === 'cn' ? sport.nameCn : sport.name) : '—'}</span>;
                },
              },
              { key: 'season', header: lang === 'cn' ? '赛季' : 'Season', render: (t: Team) => <span className="text-sm text-ink-700">{t.season}</span> },
              { key: 'count', header: lang === 'cn' ? '人数' : 'Athletes', align: 'right', render: (t: Team) => <span className="text-sm font-mono text-ink-600">{t.athleteCount}</span> },
            ]}
            data={DEMO_TEAMS}
            rowKey={(t) => t.id}
          />
        </div>

        <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
          <h4 className="text-sm font-semibold text-ink-900 px-5 py-4 border-b border-ink-100">
            {lang === 'cn' ? '分组' : 'Groups'}
          </h4>
          <DataTable
            columns={[
              {
                key: 'name',
                header: lang === 'cn' ? '分组' : 'Group',
                render: (g: Group) => <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? g.nameCn : g.name}</p>,
              },
              { key: 'type', header: lang === 'cn' ? '类型' : 'Type', render: (g: Group) => <span className="text-sm text-ink-700">{g.type}</span> },
              { key: 'desc', header: lang === 'cn' ? '描述' : 'Description', render: (g: Group) => <span className="text-sm text-ink-500">{g.description}</span> },
              { key: 'count', header: lang === 'cn' ? '人数' : 'Athletes', align: 'right', render: (g: Group) => <span className="text-sm font-mono text-ink-600">{g.athleteCount}</span> },
            ]}
            data={DEMO_GROUPS}
            rowKey={(g) => g.id}
          />
        </div>
      </div>
    </div>
  );
}
