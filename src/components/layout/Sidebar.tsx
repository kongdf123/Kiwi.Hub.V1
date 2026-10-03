import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ORG } from '@/lib/demo-data';
import {
  Activity, LayoutDashboard, Users, ClipboardList, BarChart3,
  TrendingUp, GitCompare, Waves, FileText, Database, Server,
  HardDrive, BookOpen, Plug, RefreshCw, ChevronDown, ChevronRight,
  Building2, UserCog, ShieldCheck, UsersRound, Cpu, Settings,
  FlaskConical, type LucideIcon,
} from 'lucide-react';
import { StatusDot } from '@/components/ui/StatusBadge';

interface NavItem {
  view: string;
  label: string;
  icon: LucideIcon;
  matchViews?: string[];
}

interface NavGroup {
  id: string;
  labelKey: string;
  items: NavItem[];
}

export function Sidebar() {
  const { currentView, navigate, lang } = useApp();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const topItem: NavItem = {
    view: 'home',
    label: tr('nav.home', lang),
    icon: LayoutDashboard,
  };

  const groups: NavGroup[] = [
    {
      id: 'data',
      labelKey: 'nav.group.data',
      items: [
        { view: 'athletes', label: tr('nav.athletes', lang), icon: Users, matchViews: ['athletes', 'athlete-profile'] },
        { view: 'sessions', label: tr('nav.sessions', lang), icon: ClipboardList, matchViews: ['sessions', 'session-detail'] },
        { view: 'results', label: tr('nav.results', lang), icon: BarChart3, matchViews: ['results', 'result-detail'] },
        { view: 'datasets', label: tr('nav.datasets', lang), icon: Database, matchViews: ['datasets', 'dataset-detail'] },
        { view: 'raw-data', label: tr('nav.rawData', lang), icon: HardDrive, matchViews: ['raw-data'] },
        { view: 'data-sources', label: tr('nav.dataSources', lang), icon: Server, matchViews: ['data-sources', 'data-source-detail'] },
      ],
    },
    {
      id: 'analysis',
      labelKey: 'nav.group.analysis',
      items: [
        { view: 'performance', label: tr('nav.performance', lang), icon: TrendingUp, matchViews: ['performance'] },
        { view: 'trends', label: tr('nav.trends', lang), icon: TrendingUp, matchViews: ['trends'] },
        { view: 'comparisons', label: tr('nav.comparisons', lang), icon: GitCompare, matchViews: ['comparisons'] },
        { view: 'biomechanics', label: tr('nav.biomechanics', lang), icon: Waves, matchViews: ['biomechanics'] },
        { view: 'dashboards', label: tr('nav.dashboards', lang), icon: LayoutDashboard, matchViews: ['dashboards'] },
      ],
    },
    {
      id: 'platform',
      labelKey: 'nav.group.platform',
      items: [
        { view: 'protocols', label: tr('nav.protocols', lang), icon: BookOpen, matchViews: ['protocols', 'protocol-detail'] },
        { view: 'reports', label: tr('nav.reports', lang), icon: FileText, matchViews: ['reports'] },
        { view: 'integrations', label: tr('nav.integrations', lang), icon: Plug, matchViews: ['integrations'] },
        { view: 'sync-center', label: tr('nav.syncCenter', lang), icon: RefreshCw, matchViews: ['sync-center'] },
      ],
    },
    {
      id: 'admin',
      labelKey: 'nav.group.admin',
      items: [
        { view: 'organization', label: tr('nav.organization', lang), icon: Building2, matchViews: ['organization'] },
        { view: 'users', label: tr('nav.users', lang), icon: UserCog, matchViews: ['users'] },
        { view: 'roles', label: tr('nav.roles', lang), icon: ShieldCheck, matchViews: ['roles'] },
        { view: 'teams', label: tr('nav.teams', lang), icon: UsersRound, matchViews: ['teams'] },
        { view: 'devices', label: tr('nav.devices', lang), icon: Cpu, matchViews: ['devices'] },
        { view: 'settings', label: tr('nav.settings', lang), icon: Settings, matchViews: ['settings'] },
      ],
    },
  ];

  const isItemActive = (item: NavItem) => {
    const matchViews = item.matchViews || [item.view];
    return matchViews.includes(currentView);
  };

  const isGroupActive = (group: NavGroup) => group.items.some(isItemActive);

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isItemActive(item);
    return (
      <button
        key={item.view}
        onClick={() => navigate(item.view)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
          active ? 'bg-teal-500 text-white' : 'text-kunwei-200 hover:bg-kunwei-900 hover:text-white'
        }`}
      >
        <Icon className="shrink-0" style={{ width: 16, height: 16 }} />
        <span className="truncate">{item.label}</span>
        {active && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />}
      </button>
    );
  };

  const renderGroup = (group: NavGroup) => {
    const collapsed = collapsedGroups[group.id];
    const groupActive = isGroupActive(group);
    return (
      <div key={group.id}>
        <button
          onClick={() => toggleGroup(group.id)}
          className={`w-full flex items-center gap-2 px-3 pt-4 pb-1.5 text-[11px] font-semibold tracking-wider transition-colors ${
            groupActive ? 'text-teal-400' : 'text-kunwei-400 hover:text-kunwei-200'
          }`}
        >
          <ChevronDown className={`w-3 h-3 transition-transform shrink-0 ${collapsed ? '-rotate-90' : ''}`} />
          {tr(group.labelKey, lang)}
        </button>
        {!collapsed && (
          <div className="space-y-0.5">
            {group.items.map(renderItem)}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-60 bg-kunwei-970 text-kunwei-100 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="px-5 py-5 border-b border-kunwei-900">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-white truncate">Kunwei Hub</h1>
            <p className="text-xs text-kunwei-300 truncate">{lang === 'cn' ? DEMO_ORG.nameCn : DEMO_ORG.name}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-thin">
        {renderItem(topItem)}
        {groups.map(renderGroup)}
      </nav>

      <div className="px-3 py-3 border-t border-kunwei-900 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-kunwei-960">
          <StatusDot status="processing" size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-kunwei-300 truncate">{tr('common.status', lang)}</p>
            <p className="text-xs text-success-400 font-medium">{tr('common.allSystems', lang)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-kunwei-400">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>v2.1 · {lang === 'cn' ? '处理正常' : 'Processing OK'}</span>
        </div>
      </div>
    </aside>
  );
}
