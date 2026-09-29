import { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('john@kunwei.com');
  const [password, setPassword] = useState('demo');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 600);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-600 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-800 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold">Kunwei Hub</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">Force testing,<br />elevated to a system.</h1>
            <p className="text-lg text-ink-300 max-w-md leading-relaxed">
              The operating system for sports-performance testing. Capture, analyze, and act on neuromuscular data — all in one place.
            </p>
            <div className="mt-8 space-y-3">
              {['Multi-athlete testing workflows', 'Real-time validity checking', 'Automated trend analysis & alerts', 'Configurable reports & exports'].map((feat) => (
                <div key={feat} className="flex items-center gap-3 text-ink-200">
                  <div className="w-5 h-5 rounded-full bg-success-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-success-400" />
                  </div>
                  <span className="text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-ink-500">© 2026 Kunwei Performance Technologies</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-ink-50 px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-ink-900">Kunwei Hub</span>
          </div>

          <h2 className="text-2xl font-semibold text-ink-900 mb-1">Welcome back</h2>
          <p className="text-sm text-ink-500 mb-8">Sign in to your organization's testing hub</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-600">
                <input type="checkbox" defaultChecked className="rounded border-ink-300 text-accent-600 focus:ring-accent-400" />
                Remember me
              </label>
              <button type="button" className="text-accent-600 hover:text-accent-700 font-medium">Forgot password?</button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent-600 hover:bg-accent-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-xs text-ink-400 text-center mt-6">
            Demo credentials are pre-filled. Just click Sign In.
          </p>
        </div>
      </div>
    </div>
  );
}
