import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AdminAuthContext = createContext({
  isAuthenticated: false,
  token: null,
  user: null,
  permissions: [],
  isAdmin: false,
  isSuperAdmin: false,
  refresh: () => {},
  logout: () => {},
  hasPermission: () => false,
  updateLastActivity: () => {},
  isSessionExpired: () => true,
});

const ADMIN_STORAGE_KEYS = [
  'bt-admin-token',
  'bt-admin-username',
  'bt-admin-email',
  'bt-admin-fullName',
  'bt-admin-avatar',
  'bt-admin-role',
  'bt-admin-userId',
  'bt-admin-permissions',
  'bt-admin-lastActivity'
];

const SESSION_TIMEOUT = 15 * 60 * 1000;

const normalizeToken = (rawToken) => {
  if (!rawToken) return null;

  const normalized = rawToken.trim();
  if (!normalized) return null;

  const invalidTokens = new Set(['null', 'undefined', 'NaN', 'false']);
  return invalidTokens.has(normalized.toLowerCase()) ? null : normalized;
};

const parsePermissions = (rawPermissions) => {
  if (!rawPermissions) return [];
  try {
    return JSON.parse(rawPermissions);
  } catch {
    return [];
  }
};

const readStateFromStorage = () => {
  if (typeof window === 'undefined') {
    return { token: null, profile: null, permissions: [], lastActivity: Date.now() };
  }

  const token = normalizeToken(window.localStorage.getItem('bt-admin-token'));
  if (!token) {
    return { token: null, profile: null, permissions: [], lastActivity: Date.now() };
  }

  const rawLastActivity = window.localStorage.getItem('bt-admin-lastActivity');
  const lastActivity = rawLastActivity ? parseInt(rawLastActivity, 10) : Date.now();

  const profile = {
    username: window.localStorage.getItem('bt-admin-username'),
    email: window.localStorage.getItem('bt-admin-email'),
    fullName: window.localStorage.getItem('bt-admin-fullName'),
    avatar: window.localStorage.getItem('bt-admin-avatar'),
    role: window.localStorage.getItem('bt-admin-role'),
  };

  const rawUserId = window.localStorage.getItem('bt-admin-userId');
  if (rawUserId) {
    const parsed = Number(rawUserId);
    profile.userId = Number.isNaN(parsed) ? null : parsed;
  }

  const permissions = parsePermissions(window.localStorage.getItem('bt-admin-permissions'));
  profile.permissions = permissions;

  return { token, profile, permissions, lastActivity };
};

const saveStateToStorage = (state) => {
  if (typeof window === 'undefined') return;

  const { token, profile, permissions, lastActivity } = state;

  if (token) {
    window.localStorage.setItem('bt-admin-token', token);
    window.localStorage.setItem('bt-admin-lastActivity', lastActivity.toString());

    if (profile) {
      window.localStorage.setItem('bt-admin-username', profile.username || '');
      window.localStorage.setItem('bt-admin-email', profile.email || '');
      window.localStorage.setItem('bt-admin-fullName', profile.fullName || '');
      window.localStorage.setItem('bt-admin-avatar', profile.avatar || '');
      window.localStorage.setItem('bt-admin-role', profile.role || '');
      if (profile.userId) {
        window.localStorage.setItem('bt-admin-userId', profile.userId.toString());
      }
    }

    if (permissions && permissions.length > 0) {
      window.localStorage.setItem('bt-admin-permissions', JSON.stringify(permissions));
    }
  }
};

const clearStorage = () => {
  if (typeof window === 'undefined') return;
  ADMIN_STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

export const AdminAuthProvider = ({ children }) => {
  const [state, setState] = useState(() => readStateFromStorage());

  const isSessionExpired = useCallback(() => {
    return Date.now() - state.lastActivity > SESSION_TIMEOUT;
  }, [state.lastActivity]);

  const updateLastActivity = useCallback(() => {
    const now = Date.now();
    setState(prev => ({ ...prev, lastActivity: now }));
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bt-admin-lastActivity', now.toString());
    }
  }, []);

  const refresh = useCallback(() => {
    const newState = readStateFromStorage();
    setState(newState);
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setState({ token: null, profile: null, permissions: [], lastActivity: Date.now() });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('admin-auth-changed'));
    }
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!state.token) return false;
    if (state.profile?.role === 'SUPER_ADMIN') return true;
    return state.permissions.includes(permission);
  }, [state.token, state.profile?.role, state.permissions]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (isSessionExpired() && state.token) {
        console.warn('Admin session expired, logging out...');
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isSessionExpired, logout, state.token]);

  useEffect(() => {
    const handleWarning = () => {
      const timeUntilExpiration = SESSION_TIMEOUT - (Date.now() - state.lastActivity);
      if (timeUntilExpiration <= 5 * 60 * 1000 && timeUntilExpiration > 0 && state.token) {
        console.warn('Admin session will expire in 5 minutes');
      }
    };

    const warningInterval = setInterval(handleWarning, 30000); // Check every 30 seconds
    return () => clearInterval(warningInterval);
  }, [state.lastActivity, state.token]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === null || ADMIN_STORAGE_KEYS.includes(event.key)) {
        refresh();
      }
    };

    const handleAuthChanged = () => {
      refresh();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
      window.addEventListener('admin-auth-changed', handleAuthChanged);

      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('admin-auth-changed', handleAuthChanged);
      };
    }
  }, [refresh]);

  useEffect(() => {
    if (!state.token) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    const updateActivity = () => {
      updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [state.token, updateLastActivity]);

  const value = useMemo(() => {
    const isAdmin = state.profile?.role === 'ADMIN' || state.profile?.role === 'SUPER_ADMIN';
    const isSuperAdmin = state.profile?.role === 'SUPER_ADMIN';

    return {
      isAuthenticated: Boolean(state.token && !isSessionExpired()),
      token: state.token,
      user: state.profile,
      permissions: state.permissions,
      isAdmin,
      isSuperAdmin,
      refresh,
      logout,
      hasPermission,
      updateLastActivity,
      isSessionExpired,
    };
  }, [
    state.token,
    state.profile,
    state.permissions,
    isSessionExpired,
    refresh,
    logout,
    hasPermission,
    updateLastActivity,
  ]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => useContext(AdminAuthContext);
