import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { DEMO_ORG, DEMO_TEAMS, DEMO_GROUPS, DEMO_SPORTS } from '@/lib/demo-data';
import { Building2, MapPin, Clock, Users, Dumbbell } from 'lucide-react';

export function OrganizationPage() {
  const { lang } = useApp();

  return (
    <div>
      <TopBar title={tr('admin.organization', lang)} />
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-ink-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-ink-900">{lang === 'cn' ? DEMO_ORG.nameCn : DEMO_ORG.name}</h3>
              <p className="text-sm text-ink-500">{DEMO_ORG.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ink-400" />
              <div>
                <p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '国家' : 'Country'}</p>
                <p className="text-sm text-ink-900 font-medium">{DEMO_ORG.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-ink-400" />
              <div>
                <p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '时区' : 'Timezone'}</p>
                <p className="text-sm text-ink-900 font-medium">{DEMO_ORG.timezone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-ink-400" />
              <div>
                <p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '队伍数' : 'Teams'}</p>
                <p className="text-sm text-ink-900 font-medium">{DEMO_TEAMS.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-ink-400" />
              <div>
                <p className="text-xs text-ink-500 uppercase tracking-wider">{lang === 'cn' ? '运动项目' : 'Sports'}</p>
                <p className="text-sm text-ink-900 font-medium">{DEMO_SPORTS.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '队伍列表' : 'Teams'}</h4>
            <div className="divide-y divide-ink-50">
              {DEMO_TEAMS.map((team) => (
                <div key={team.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? team.nameCn : team.name}</p>
                    <p className="text-xs text-ink-500">{team.season}</p>
                  </div>
                  <span className="text-sm text-ink-600">{team.athleteCount} {lang === 'cn' ? '人' : 'athletes'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ink-200 p-5">
            <h4 className="text-sm font-semibold text-ink-900 mb-4">{lang === 'cn' ? '分组列表' : 'Groups'}</h4>
            <div className="divide-y divide-ink-50">
              {DEMO_GROUPS.map((group) => (
                <div key={group.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{lang === 'cn' ? group.nameCn : group.name}</p>
                    <p className="text-xs text-ink-500">{group.type}</p>
                  </div>
                  <span className="text-sm text-ink-600">{group.athleteCount} {lang === 'cn' ? '人' : 'athletes'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
