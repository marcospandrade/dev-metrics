import { ReactNode } from 'react'

import { ThemeProvider } from '@/lib/material'
import { Sidenav } from './components/layout/Sidenav'
import { DashboardFooter } from './components/layout/DashboardFooter'
import { DashboardNavbar } from './components/layout/DashboardNavbar'
import { AuthContextProvider } from '@/hooks/useAuth'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <div className="bg-gray-50">
          <div className="min-h-screen bg-blue-gray-50/50">
            <Sidenav brandImg={'../../public/img/logo-ct.png'} brandName="EstimAi" />
            <div className="p-4 xl:ml-80 min-h-screen flex flex-col justify-between">
              <DashboardNavbar />
              <div className="mb-auto">
                {children}
              </div>

              <div className="h-12 text-blue-gray-400">
                <DashboardFooter />
              </div>
            </div>
          </div>
        </div>
      </AuthContextProvider>
    </ThemeProvider>
  )
}
