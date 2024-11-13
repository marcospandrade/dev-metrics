'use client';

import { localApi } from '@/services/api';
import { User } from '@/models/User.model';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

interface AuthContextData {
  user: User | null;
  getUserDetails: () => Promise<User>;
  handleLogout: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  function setUserInfo(user: User) {
    return setUser(user);
  }

  async function getUserDetails() {
    if (user) {
      return user;
    }

    try {
      const { data } = await localApi.get<User>('api/auth/user');
      setUserInfo(data);

      return data;
    } catch (error: any) {
      throw new Error(error?.message ?? 'Error getting user in AuthContext');
    }
  }

  async function handleLogout() {
    await localApi.get<User>('api/auth/logout');
    setUser(null);
  }

  const contextData: AuthContextData = useMemo(
    () => ({
      user,
      getUserDetails,
      handleLogout,
    }),
    [user, handleLogout],
  );

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthContextProvider, useAuth };
