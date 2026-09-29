import { useApp } from '@/lib/app-context';
import { DEMO_ORG } from '@/lib/demo-data';
import { Activity, Users, Calendar, BarChart3, FileText, Settings, Dumbbell, FlaskConical, LayoutDashboard, ChevronRight } from 'lucide-react';
import { StatusDot } from '@/components/ui/StatusBadge';

const NAV_ITEMS = [
  { view: 'home', label: 'Home', icon: LayoutDashboard },
  { view: 'athletes', label: 'Athletes', icon: Users },
  { view: 'testing', label: 'Testing', icon: Dumbbell },
  { view: 'team', label: 'Team Dashboard', icon: BarChart3 },
  { view: 'reports', label: 'Reports', icon: FileText },
  { view: 'management', label: 'Management', icon: Settings },
];

export function Sidebar() {
  const { currentView, navigate } = useApp();

  return (
    <aside className="w-60 bg-ink-950 text-ink-100 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="px-5 py-5 border-b border-ink-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-white truncate">Kunwei Hub</h1>
            <p className="text-xs text-ink-400 truncate">{DEMO_ORG.name}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.view || (item.view === 'athletes' && currentView === 'athlete-profile') || (item.view === 'testing' && (currentView === 'test-result' || currentView === 'test-capture'));
          return (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-accent-600 text-white' : 'text-ink-300 hover:bg-ink-800 hover:text-white'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18 }} />
              {item.label}
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-ink-800 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-900">
          <StatusDot status="processing" size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-300 truncate">System Status</p>
            <p className="text-xs text-success-400 font-medium">All systems operational</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-ink-400">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>v2.1 · Processing OK</span>
        </div>
      </div>
    </aside>
  );
}
