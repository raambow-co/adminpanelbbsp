import React, { createContext, useContext, useState } from 'react';

interface UserProfile {
  name: string;
  title: string;
  role: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile;
  login: (email?: string, password?: string) => boolean;
  logout: () => void;
  showSplash: boolean;
  finishSplash: () => void;
}

const defaultUser: UserProfile = {
  name: 'Sudheer Reddy',
  title: 'Managing Director & SuperAdmin',
  role: 'Chief Administrator',
  email: 'sudheer.reddy@bbsp.in',
  avatar: '/build-bharat-logo.png',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Check session storage to show splash on initial load
    return true;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('bbsp_admin_auth');
    return saved === 'true';
  });

  const [user] = useState<UserProfile>(defaultUser);

  const login = (email?: string, password?: string): boolean => {
    if (!email || !password) return false;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const isValidUser =
      cleanEmail === 'sudheer.reddy@bbsp.in' ||
      cleanEmail === 'admin@bbsp.in' ||
      cleanEmail === 'sudheer' ||
      cleanEmail === 'admin';

    const isValidPassword =
      cleanPass === 'admin' ||
      cleanPass === 'bbsp@2026' ||
      cleanPass === 'admin123';

    if (isValidUser && isValidPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('bbsp_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('bbsp_admin_auth');
  };

  const finishSplash = () => {
    setShowSplash(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        showSplash,
        finishSplash,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
