import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_TEAMS } from '@/lib/demo-data';
import { Search, Bell, ChevronDown, User, Settings, LogOut, HelpCircle, Languages } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { selectedTeamId, setSelectedTeamId, addToast, lang, setLang } = useApp();
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const teamRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (teamRef.current && !teamRef.current.contains(e.target as Node)) setTeamMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedTeam = DEMO_TEAMS.find((t) => t.id === selectedTeamId) || DEMO_TEAMS[0];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-ink-200 px-6 py-3 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold text-ink-900 truncate">{title}</h2>
        {subtitle && <p className="text-sm text-ink-500 truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder={tr('common.search', lang)}
            className="w-56 pl-9 pr-3 py-2 text-sm bg-ink-50 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
          />
        </div>

        <button
          onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}
          className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 rounded-lg transition-colors"
          title={lang === 'cn' ? 'Switch to English' : '切换中文'}
        >
          <Languages className="w-4 h-4" />
          {lang === 'cn' ? 'EN' : '中'}
        </button>

        <div className="relative" ref={teamRef}>
          <button
            onClick={() => setTeamMenuOpen(!teamMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-700 bg-ink-50 hover:bg-ink-100 rounded-lg transition-colors"
          >
            {lang === 'cn' ? selectedTeam.nameCn : selectedTeam.name}
            <ChevronDown className="w-4 h-4 text-ink-400" />
          </button>
          {teamMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-ink-200 py-1 z-20 animate-slide-up">
              {DEMO_TEAMS.map((team) => (
                <button
                  key={team.id}
                  onClick={() => { setSelectedTeamId(team.id); setTeamMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-ink-50 transition-colors ${team.id === selectedTeamId ? 'text-teal-700 font-medium' : 'text-ink-700'}`}
                >
                  <span>{lang === 'cn' ? team.nameCn : team.name}</span>
                  <span className="text-xs text-ink-400">{team.athleteCount}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-ink-500 hover:text-ink-700 hover:bg-ink-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-attention-500 rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-lg border border-ink-200 py-2 z-20 animate-slide-up">
              <div className="px-3 py-2 border-b border-ink-100">
                <h3 className="text-sm font-semibold text-ink-900">{lang === 'cn' ? '通知' : 'Notifications'}</h3>
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                {(lang === 'cn' ? [
                  { msg: '张伟 需关注 — 不对称性 >15%', time: '10分钟前' },
                  { msg: '设备 KW-FP-00125 已离线', time: '2小时前' },
                  { msg: '3名运动员本周未测试', time: '5小时前' },
                  { msg: '赛季前测试窗口将在3天后关闭', time: '1天前' },
                ] : [
                  { msg: 'Zhang Wei flagged for attention — asymmetry >15%', time: '10 min ago' },
                  { msg: 'Device KW-FP-00125 went offline', time: '2 hours ago' },
                  { msg: '3 athletes have not tested this week', time: '5 hours ago' },
                  { msg: 'Pre-season testing window closes in 3 days', time: '1 day ago' },
                ]).map((n, i) => (
                  <div key={i} className="px-3 py-2.5 hover:bg-ink-50 border-b border-ink-50 last:border-0 transition-colors">
                    <p className="text-sm text-ink-800">{n.msg}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pr-2 hover:bg-ink-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
              JS
            </div>
            <ChevronDown className="w-4 h-4 text-ink-400" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-ink-200 py-1 z-20 animate-slide-up">
              <div className="px-3 py-2 border-b border-ink-100">
                <p className="text-sm font-medium text-ink-900">Li Wei</p>
                <p className="text-xs text-ink-500">{lang === 'cn' ? '组织管理员' : 'Organization Admin'}</p>
              </div>
              <button onClick={() => { addToast(lang === 'cn' ? '个人资料（演示）' : 'Profile (demo)', 'info'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                <User className="w-4 h-4" /> {lang === 'cn' ? '个人资料' : 'My Profile'}
              </button>
              <button onClick={() => { addToast(lang === 'cn' ? '设置（演示）' : 'Settings (demo)', 'info'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                <Settings className="w-4 h-4" /> {lang === 'cn' ? '设置' : 'Settings'}
              </button>
              <button onClick={() => { addToast(lang === 'cn' ? '帮助（演示）' : 'Help (demo)', 'info'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                <HelpCircle className="w-4 h-4" /> {lang === 'cn' ? '帮助' : 'Help & Support'}
              </button>
              <div className="border-t border-ink-100 mt-1 pt-1">
                <button onClick={() => addToast(lang === 'cn' ? '已登出（演示）' : 'Signed out (demo)', 'info')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-invalid-600 hover:bg-invalid-50 transition-colors">
                  <LogOut className="w-4 h-4" /> {lang === 'cn' ? '退出登录' : 'Sign Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
