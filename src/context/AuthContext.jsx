import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const DEMO_USER_STORAGE_KEY = 'neargo_demo_user';

export const DEMO_LOCAL_USER = {
  id: 'demo-local-aarav',
  email: 'aarav.sharma@neargo.in',
  user_metadata: {
    full_name: 'Aarav Sharma',
    badge: 'Verified South Delhi Local',
    badgeColor: 'emerald',
    reputation: 98,
    isVerified: true,
    city: 'Delhi NCR',
  },
};

const AuthContext = createContext({
  user: null,
  session: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  loading: true,
  isDemoUser: false,
  isPasswordRecovery: false,
  setIsPasswordRecovery: () => {},
  isAccountActivated: false,
  setIsAccountActivated: () => {},
  signUp: async () => {},
  signIn: async () => {},
  loginWithRateLimit: async () => {},
  refreshSession: async () => {},
  sendPasswordResetEmail: async () => {},
  updatePassword: async () => {},
  resendActivationEmail: async () => {},
  signInAsDemo: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isAccountActivated, setIsAccountActivated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check URL hash for recovery tokens (e.g., /#access_token=...&type=recovery) or activation hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        setIsPasswordRecovery(true);
      }
      if (hash && (hash.includes('account-activated') || hash.includes('type=signup'))) {
        setIsAccountActivated(true);
      }
    }
  }, []);

  useEffect(() => {
    // 1. Check for real Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setIsDemoUser(false);
        setLoading(false);
      } else {
        // 2. Check for saved demo user in localStorage
        try {
          const savedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (savedDemo) {
            const parsed = JSON.parse(savedDemo);
            setUser(parsed);
            setIsDemoUser(true);
          }
        } catch (e) {
          console.warn('Failed to parse demo user session', e);
        }
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }

      if (session) {
        setSession(session);
        setUser(session.user);
        setIsDemoUser(false);
        try {
          localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        } catch (_) {}
      } else {
        // Only clear if not in demo mode
        const savedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
        if (!savedDemo) {
          setSession(null);
          setUser(null);
          setIsDemoUser(false);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    try {
      // 1. Try Express backend endpoint (with rate limiter & SMTP email activation)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      let result = null;
      try {
        result = await response.json();
      } catch (_) {
        throw new Error('BACKEND_UNAVAILABLE');
      }

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500 && result?.error) {
          throw new Error(result.error);
        }
        throw new Error('BACKEND_UNAVAILABLE');
      }

      // If backend returned immediate session
      if (result?.session) {
        setSession(result.session);
        setUser(result.user);
        setIsDemoUser(false);
      }

      return result;
    } catch (err) {
      if (err.rateLimited || (err.message && err.message !== 'BACKEND_UNAVAILABLE' && err.message !== 'Failed to fetch' && !err.message.includes('not valid JSON') && !err.message.includes('server error') && !err.message.includes('Unexpected token'))) {
        throw err;
      }

      // 2. Direct Supabase Client Fallback with activation redirect
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            badge: 'Verified Local',
            isVerified: true,
          },
          emailRedirectTo: `${window.location.origin}/#account-activated`,
        },
      });

      if (error) throw error;

      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
        setIsDemoUser(false);
        try {
          localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        } catch (_) {}
      }

      return data;
    }
  };

  // Resend Activation Email via backend
  const resendActivationEmail = async (email) => {
    const res = await fetch('/api/auth/resend-activation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    let data = null;
    try {
      data = await res.json();
    } catch (_) {}
    if (res.ok && data) {
      return data;
    }
    // Direct Supabase fallback
    return await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/#account-activated` },
    });

  };

  // Direct Supabase Sign In
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data?.session) {
      setSession(data.session);
      setUser(data.user);
      setIsDemoUser(false);
      try {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      } catch (_) {}
    }

    return data;
  };

  // Rate-Limited Login via Express Backend with JWT access & refresh token delivery
  const loginWithRateLimit = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let result = null;
      try {
        result = await response.json();
      } catch (_) {
        throw new Error('BACKEND_UNAVAILABLE');
      }

      if (response.status === 429) {
        const err = new Error(result.error || 'Too many login attempts.');
        err.rateLimited = true;
        err.retryAfterSeconds = result.retryAfterSeconds || 900;
        throw err;
      }

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500 && result?.error) {
          const err = new Error(result.error);
          err.remainingAttempts = result.remainingAttempts;
          throw err;
        }
        throw new Error('BACKEND_UNAVAILABLE');
      }

      // Sync Supabase client session if access & refresh tokens are returned
      if (result.accessToken && result.refreshToken) {
        await supabase.auth.setSession({
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
        });
      }

      setUser(result.user);
      setIsDemoUser(false);
      try {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      } catch (_) {}

      return result;
    } catch (err) {
      // If network fetch fails (e.g. backend offline in dev), fallback to direct Supabase login
      if (err.rateLimited || (err.message && err.message !== 'BACKEND_UNAVAILABLE' && err.message !== 'Failed to fetch' && !err.message.includes('not valid JSON') && !err.message.includes('server error') && !err.message.includes('Unexpected token'))) {
        throw err;
      }
      return await signIn(email, password);
    }
  };

  // Refresh JWT Access Token using Refresh Token
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setSession(data.session);
      setUser(data.user);
      return data.session;
    } catch (err) {
      // Fallback via backend endpoint
      if (session?.refresh_token) {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        });
        const json = await res.json();
        if (json.accessToken && json.refreshToken) {
          await supabase.auth.setSession({
            access_token: json.accessToken,
            refresh_token: json.refreshToken,
          });
          return json;
        }
      }
      throw err;
    }
  };

  // Forgot Password: sends reset link via backend SMTP / Supabase
  const sendPasswordResetEmail = async (email) => {
    try {
      // Try backend endpoint first (which supports both SMTP & Supabase)
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}

    // Fallback directly to Supabase client
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#reset-password`,
    });
    if (error) throw error;
    return data;
  };

  // Update Password (when user lands from recovery link)
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    setIsPasswordRecovery(false);
    return data;
  };

  const signInAsDemo = (customName) => {
    const demoProfile = {
      ...DEMO_LOCAL_USER,
      user_metadata: {
        ...DEMO_LOCAL_USER.user_metadata,
        full_name: customName || DEMO_LOCAL_USER.user_metadata.full_name,
      },
    };
    try {
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoProfile));
    } catch (_) {}
    setUser(demoProfile);
    setIsDemoUser(true);
    return demoProfile;
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    } catch (_) {}
    setUser(null);
    setSession(null);
    setIsDemoUser(false);
    setIsPasswordRecovery(false);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
  };

  const accessToken = session?.access_token || (isDemoUser ? 'demo-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aarav-delhi' : null);
  const refreshToken = session?.refresh_token || (isDemoUser ? 'demo-refresh-token-987654321' : null);
  const expiresAt = session?.expires_at || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        accessToken,
        refreshToken,
        expiresAt,
        loading,
        isDemoUser,
        isPasswordRecovery,
        setIsPasswordRecovery,
        isAccountActivated,
        setIsAccountActivated,
        signUp,
        signIn,
        loginWithRateLimit,
        refreshSession,
        sendPasswordResetEmail,
        updatePassword,
        resendActivationEmail,
        signInAsDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
