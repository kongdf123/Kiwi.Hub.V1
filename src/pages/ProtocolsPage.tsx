import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { t as tr } from '@/lib/i18n';
import { DEMO_PROTOCOLS, DEMO_SPORTS, getSport } from '@/lib/demo-data';
import { TopBar } from '@/components/layout/TopBar';
import { Search, Activity, Zap, Waves, TrendingUp, Dumbbell, Shuffle, Clock, ChevronRight, BookOpen, Cpu, BarChart3, GitCompare } from 'lucide-react';

const SPORT_ICONS: Record<string, typeof Activity> = {
  'sport-cmj': Activity,
  'sport-sprint': Zap,
  'sport-swim': Waves,
  'sport-hj': TrendingUp,
  'sport-imtp': Dumbbell,
  'sport-cod': Shuffle,
};

const DIFFICULTY_CONFIG = {
  basic: { label: { en: 'Basic', cn: '基础' }, color: 'bg-success-50 text-success-700 border-success-200' },
  standard: { label: { en: 'Standard', cn: '标准' }, color: 'bg-teal-50 text-teal-700 border-teal-200' },
  advanced: { label: { en: 'Advanced', cn: '高级' }, color: 'bg-attention-50 text-attention-700 border-attention-200' },
};

const CAPTURE_MODE_LABELS: Record<string, { en: string; cn: string }> = {
  force_plate: { en: 'Force Plate', cn: '测力台' },
  timing: { en: 'Timing', cn: '计时' },
  video: { en: 'Video', cn: '视频' },
  manual: { en: 'Manual', cn: '手动' },
  sensor: { en: 'Sensor', cn: '传感器' },
};

export function ProtocolsPage() {
  const { lang, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('all');

  const filteredProtocols = useMemo(() => {
    return DEMO_PROTOCOLS.filter((p) => {
      const name = lang === 'cn' ? p.nameCn : p.name;
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || p.metrics.some((m) => (lang === 'cn' ? m.nameCn : m.name).toLowerCase().includes(search.toLowerCase()));
      const matchesSport = sportFilter === 'all' || p.sportId === sportFilter;
      return matchesSearch && matchesSport;
    });
  }, [search, sportFilter, lang]);

  return (
    <div>
      <TopBar title={tr('protocols.title', lang)} subtitle={tr('protocols.subtitle', lang)} />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'cn' ? '搜索方案名称或指标...' : 'Search protocols or metrics...'}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
            />
          </div>
          <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="text-sm bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all">
            <option value="all">{tr('library.allSports', lang)}</option>
            {DEMO_SPORTS.map((s) => (
              <option key={s.id} value={s.id}>{lang === 'cn' ? s.nameCn : s.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProtocols.map((protocol) => {
            const sport = getSport(protocol.sportId);
            const SportIcon = sport ? SPORT_ICONS[sport.id] || Activity : Activity;
            const diff = DIFFICULTY_CONFIG[protocol.difficulty];
            const captureMode = CAPTURE_MODE_LABELS[protocol.input.captureMode] || { en: protocol.input.captureMode, cn: protocol.input.captureMode };
            return (
              <div
                key={protocol.id}
                onClick={() => navigate('protocol-detail', { protocolId: protocol.id })}
                className="bg-white rounded-xl border border-ink-200 p-5 hover:border-teal-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-ink-50 flex items-center justify-center">
                    <SportIcon className="w-5.5 h-5.5 text-ink-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-ink-400">v{protocol.version}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${diff.color}`}>
                      {lang === 'cn' ? diff.label.cn : diff.label.en}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-ink-900 mb-1">{lang === 'cn' ? protocol.nameCn : protocol.name}</h3>
                <p className="text-xs text-ink-500 mb-3 line-clamp-2">{lang === 'cn' ? protocol.descriptionCn : protocol.description}</p>

                {/* Input / Capture Mode */}
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ink-100 text-ink-600">
                    <BookOpen className="w-3 h-3" />
                    {lang === 'cn' ? captureMode.cn : captureMode.en}
                  </span>
                  <span className="text-ink-500">
                    {protocol.input.dataTypes.join(', ')}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-ink-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5" />
                    {protocol.input.trials} {tr('library.trials', lang)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {protocol.durationMin} {tr('library.duration', lang)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    {protocol.metrics.length} {tr('library.metrics', lang)}
                  </span>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {protocol.metrics.slice(0, 4).map((m) => (
                    <span key={m.key} className={`text-xs px-2 py-0.5 rounded ${m.primary ? 'bg-teal-50 text-teal-700 font-medium' : 'bg-ink-100 text-ink-600'}`}>
                      {lang === 'cn' ? m.nameCn : m.name}
                    </span>
                  ))}
                  {protocol.metrics.length > 4 && (
                    <span className="text-xs px-2 py-0.5 text-ink-400">+{protocol.metrics.length - 4}</span>
                  )}
                </div>

                {/* Processing info */}
                <div className="flex items-center gap-3 text-xs text-ink-400 mb-3">
                  <span className="flex items-center gap-1" title={tr('protocols.processingSteps', lang)}>
                    <Cpu className="w-3.5 h-3.5" />
                    {protocol.processing.steps.length} {lang === 'cn' ? '步骤' : 'steps'}
                  </span>
                  <span className="flex items-center gap-1" title={tr('protocols.visualization', lang)}>
                    <BarChart3 className="w-3.5 h-3.5" />
                    {protocol.visualization.length} {lang === 'cn' ? '视图' : 'views'}
                  </span>
                  <span className="flex items-center gap-1" title={tr('protocols.comparison', lang)}>
                    <GitCompare className="w-3.5 h-3.5" />
                    {protocol.comparison.length} {lang === 'cn' ? '对比' : 'cmp'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                  <span className="text-xs text-ink-500">{sport ? (lang === 'cn' ? sport.nameCn : sport.name) : ''}</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-ink-400">
                    {tr('protocols.viewDetails', lang)} <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
