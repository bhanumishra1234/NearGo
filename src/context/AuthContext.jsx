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
  loading: true,
  isDemoUser: false,
  signUp: async () => {},
  signIn: async () => {},
  signInAsDemo: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          badge: 'Verified Local',
          isVerified: true,
        },
      },
    });

    if (error) throw error;

    // If Supabase created the user and gave a session, clear demo user
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
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isDemoUser,
        signUp,
        signIn,
        signInAsDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
