import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AuthProfile = {
  username?: string | null;
  email?: string | null;
  fullName?: string | null;
  avatar?: string | null;
  provider?: string | null;
  userId?: number | null;
};

type AuthState = {
  token: string | null;
  profile: AuthProfile | null;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthProfile | null;
  refresh: () => void;
  logout: () => void;
};

const defaultContext: AuthContextValue = {
  isAuthenticated: false,
  token: null,
  user: null,
  refresh: () => {},
  logout: () => {}
};

const STORAGE_KEYS = ['authToken', 'username', 'email', 'fullName', 'avatar', 'authProvider', 'userId'];

const normalizeToken = (rawToken: string | null): string | null => {
  if (!rawToken) {
    return null;
  }

  const normalized = rawToken.trim();
  if (!normalized) {
    return null;
  }

  const invalidTokens = new Set(['null', 'undefined', 'NaN', 'false']);
  return invalidTokens.has(normalized.toLowerCase()) ? null : normalized;
};

const readStateFromStorage = (): AuthState => {
  if (typeof window === 'undefined') {
    return { token: null, profile: null };
  }

  const token = normalizeToken(window.localStorage.getItem('authToken'));
  if (!token) {
    return { token: null, profile: null };
  }

  const profile: AuthProfile = {
    username: window.localStorage.getItem('username'),
    email: window.localStorage.getItem('email'),
    fullName: window.localStorage.getItem('fullName'),
    avatar: window.localStorage.getItem('avatar'),
    provider: window.localStorage.getItem('authProvider')
  };

  const rawUserId = window.localStorage.getItem('userId');
  if (rawUserId) {
      const parsed = Number(rawUserId);
      profile.userId = Number.isNaN(parsed) ? null : parsed;
  }

  return { token, profile };
};

const AuthContext = createContext<AuthContextValue>(defaultContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>(() => readStateFromStorage());

  const refresh = useCallback(() => {
    setState(readStateFromStorage());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || STORAGE_KEYS.includes(event.key)) {
        refresh();
      }
    };

    const handleAuthChanged = () => {
      refresh();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-changed', handleAuthChanged);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-changed', handleAuthChanged);
    };
  }, [refresh]);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      STORAGE_KEYS.forEach((key) => {
        window.localStorage.removeItem(key);
      });
      window.dispatchEvent(new Event('auth-changed'));
    }
    setState({ token: null, profile: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(state.token),
      token: state.token,
      user: state.profile,
      refresh,
      logout
    }),
    [state, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);

