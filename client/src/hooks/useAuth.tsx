'use client'

import { localApi } from '@/lib/api'
import { User } from '@/models/User.model'
import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

interface AuthContextData {
  user: User | null
  setUserInfo: (user: User) => void
  getUserDetails: () => Promise<void>
  handleLogout: () => Promise<void>
}

interface AuthContextProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  function setUserInfo(user: User) {
    return setUser(user)
  }

  async function getUserDetails() {
    try {
      const { data } = await localApi.get<User>('api/auth/user')

      if (data) {
        setUser(data)
      }
    } catch (error: any) {
      throw new Error(error?.message ?? 'Error getting user in AuthContext')
    }
  }

  async function handleLogout() {
    await localApi.get<User>('api/auth/logout')
    setUser(null)
  }

  const contextData: AuthContextData = useMemo(
    () => ({
      user,
      setUserInfo,
      getUserDetails,
      handleLogout,
    }),
    [setUserInfo, handleLogout]
  )

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export { AuthContextProvider, useAuth }
