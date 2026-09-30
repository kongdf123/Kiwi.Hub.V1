import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Toast } from '@/components/ui/Toast';
import type { Lang } from '@/lib/types';

interface AppContextValue {
  currentView: string;
  navigate: (view: string, params?: Record<string, string>) => void;
  viewParams: Record<string, string>;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  selectedTeamId: string;
  setSelectedTeamId: (id: string) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState('team-1');
  const [lang, setLang] = useState<Lang>('cn');

  const navigate = useCallback((view: string, params: Record<string, string> = {}) => {
    setCurrentView(view);
    setViewParams(params);
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const tFn = useCallback((key: string) => {
    return key; // placeholder — pages use i18n.t directly with lang
  }, []);

  return (
    <AppContext.Provider value={{ currentView, navigate, viewParams, toasts, addToast, dismissToast, selectedTeamId, setSelectedTeamId, lang, setLang, t: tFn }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
