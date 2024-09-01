import { Roboto_Flex as Roboto } from 'next/font/google'

import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

// import { ThemeProvider } from '@material-tailwind/react'

import './globals.css'
import { ModalContextProvider } from '@/hooks/useModal'
import { LoadingContextProvider } from '@/hooks/useLoading'

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
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </head>

      <body suppressHydrationWarning={true} className={`${roboto.variable} bg-blue-gray-50/50  font-sans`}>
        <LoadingContextProvider>
          <ModalContextProvider>{children}</ModalContextProvider>
          <ToastContainer position="top-right" autoClose={3000} />
        </LoadingContextProvider>
      </body>
    </html>
  )
}
