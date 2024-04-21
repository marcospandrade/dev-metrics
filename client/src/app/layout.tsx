import { Roboto_Flex as Roboto } from 'next/font/google'

import { ReactNode } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

// import { ThemeProvider } from '@material-tailwind/react'

import './globals.css'
import { AuthContextProvider } from '@/hooks/useAuth'
import { ModalContextProvider } from '@/hooks/useModal'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })

export const metadata = {
  title: 'EstimAi',
  description: 'EstimAi',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </head>

      <body suppressHydrationWarning={true} className={`${roboto.variable} bg-gray-900 font-sans`}>
        <AuthContextProvider>
          <ModalContextProvider>{children}</ModalContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
