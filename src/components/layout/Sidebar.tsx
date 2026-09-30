import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_ORG } from '@/lib/demo-data';
import { Activity, Users, Dumbbell, Database, BarChart3, FileText, Settings, ChevronRight, FlaskConical, LayoutDashboard } from 'lucide-react';
import { StatusDot } from '@/components/ui/StatusBadge';

export function Sidebar() {
  const { currentView, navigate, lang } = useApp();

  const navItems = [
    { view: 'home', label: tr('nav.home', lang), icon: LayoutDashboard },
    { view: 'athletes', label: tr('nav.athletes', lang), icon: Users },
    { view: 'testing', label: tr('nav.testing', lang), icon: Dumbbell },
    { view: 'data', label: tr('nav.data', lang), icon: Database },
    { view: 'dashboard', label: tr('nav.dashboard', lang), icon: BarChart3 },
    { view: 'reports', label: tr('nav.reports', lang), icon: FileText },
    { view: 'management', label: tr('nav.management', lang), icon: Settings },
  ];

  const isActive = (view: string) => {
    if (view === 'athletes') return currentView === 'athletes' || currentView === 'athlete-profile';
    if (view === 'testing') return currentView === 'testing' || currentView === 'test-result' || currentView === 'test-library';
    if (view === 'data') return currentView === 'data' || currentView === 'integrations' || currentView === 'sync-center';
    if (view === 'management') return currentView === 'management';
    return currentView === view;
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

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.view);
          return (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-teal-500 text-white' : 'text-kunwei-200 hover:bg-kunwei-900 hover:text-white'
              }`}
            >
              <Icon className="shrink-0" style={{ width: 18, height: 18 }} />
              {item.label}
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          );
        })}
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
