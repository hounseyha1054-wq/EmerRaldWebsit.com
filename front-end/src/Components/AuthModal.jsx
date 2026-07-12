import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AuthModal = ({ onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signup' && !form.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (mode === 'signup' && form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      let ok;
      if (mode === 'login') {
        ok = await login(form.email, form.password);
      } else {
        ok = await register(form.name, form.email, form.password);
      }
      if (ok) onClose();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-xl text-white placeholder-zinc-500 outline-none transition-all text-sm';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl shadow-black/60 overflow-hidden">

        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all text-sm"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">E</div>
            <div>
              <p className="text-white font-serif tracking-wider leading-none text-lg">EMERALD</p>
              <p className="text-[9px] text-emerald-400 tracking-[3px]">BISTRO</p>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-serif text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-zinc-500 text-sm mb-7">
            {mode === 'login'
              ? 'Sign in to order and book a table.'
              : 'Join us for an unforgettable dining experience.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Full Name</label>
                <input
                  value={form.name}
                  onChange={update('name')}
                  type="text"
                  placeholder="John Doe"
                  required={mode === 'signup'}
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Email Address</label>
              <input
                value={form.email}
                onChange={update('email')}
                type="email"
                placeholder="john@example.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Password</label>
              <div className="relative">
                <input
                  value={form.password}
                  onChange={update('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-bold tracking-wide"
                >
                  {showPass ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-xs font-bold tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                  </svg>
                  {mode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}
                </>
              ) : (
                mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">OR</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Google placeholder — wire up later */}
          <button
            type="button"
            onClick={() => toast.info('Google sign-in coming soon!')}
            className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-white text-xs font-bold tracking-widest rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            CONTINUE WITH GOOGLE
          </button>

          {/* Toggle mode */}
          <p className="text-center text-zinc-500 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setForm({ name: '', email: '', password: '' }); }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
