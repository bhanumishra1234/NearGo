import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const { signIn, signUp, signInAsDemo } = useAuth();

  if (!isOpen) return null;

  const handleDemoLogin = () => {
    setError(null);
    signInAsDemo('Aarav Sharma (Verified Local)');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        onClose();
      } else {
        const res = await signUp(email, password, fullName);
        if (!res?.session) {
          setSuccessMsg(
            'Account created! Supabase has email confirmation enabled. Turn it off in Supabase Dashboard -> Auth -> Providers -> Email for instant logins, or click Quick Demo Sign In below.'
          );
        } else {
          setSuccessMsg('Account created & logged in successfully!');
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('email not confirmed')) {
        setError(
          'Email not confirmed yet. In your Supabase Dashboard (Auth -> Providers -> Email), toggle off "Confirm email" for instant login, or use 1-Click Evaluator Login.'
        );
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] w-full max-w-md p-6 shadow-2xl relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#161616] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold mb-2">
            <ShieldCheck className="w-3 h-3" />
            <span>Supabase Authentication</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {mode === 'login' ? 'Sign in to NearGo' : 'Join NearGo Community'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {mode === 'login'
              ? 'Connect with locals, upvote answers, and ask city questions.'
              : 'Create an account to share hidden spots and verified advice.'}
          </p>
        </div>

        {/* 1-Click Evaluator / Judge Quick Sign In */}
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#18120b] dark:to-[#1a1410] border border-amber-200/80 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Hackathon Evaluator Quick Access</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold">
              1-Click
            </span>
          </div>
          <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 mt-1">
            Skip registration. Test all verified local features instantly as Aarav Sharma (Delhi Local Guide).
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full mt-2 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            <span>Continue as Verified Local (Demo Mode)</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center mb-3">
          <div className="flex-grow border-t border-stone-200 dark:border-[#1a1a1a]"></div>
          <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
            or use credentials
          </span>
          <div className="flex-grow border-t border-stone-200 dark:border-[#1a1a1a]"></div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug text-[11px]">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs leading-snug">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Deepanshu Aggarwal"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121212] border border-stone-300 dark:border-[#222222] rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-[#D9532F]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121212] border border-stone-300 dark:border-[#222222] rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-[#D9532F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#121212] border border-stone-300 dark:border-[#222222] rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-[#D9532F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 mt-2 shadow-xs cursor-pointer"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-stone-500 dark:text-stone-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-[#D9532F] font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-[#D9532F] font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
