'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { useState } from 'react'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { routes } from '@/helpers/app.routes'

import { Avatar, Button, IconButton, Typography } from '@/lib/material'

interface SidenavProps {
  brandImg: string
  brandName: string
}

export function Sidenav({ brandImg, brandName }: SidenavProps) {
  const pathName = usePathname()
  const { push } = useRouter()

  const [openSideNav, setOpenSideNav] = useState(true)

  function isActiveRoute(routePath: string) {
    return pathName === routePath
  }

  function changeRoute(route: string) {
    return push(route)
  }

  return (
    <aside
      className={`bg-gradient-to-br from-indigo-500 to-indigo-600 ${
        openSideNav ? 'translate-x-0' : '-translate-x-80'
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0`}
    >
      <div className="relative border-b border-white/20">
        <Link href="/" className="flex items-center gap-4 py-6 px-8">
          <Avatar
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3EseM8xGgrPeEfubhmXjbXb3Tn-_1N_nOQA&usqp=CAU"
            width={50}
            height={50}
            alt="Logo"
          />
          <Typography variant="h6" color="white">
            {brandName ?? 'EstimAi'}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSideNav(false)}
        >
          <FontAwesomeIcon icon={faClose} />
        </IconButton>
      </div>
      <div className="m-4">
        <ul className="mb-4 flex flex-col gap-1">
          {routes.map((route) => (
            <li key={route.path} className="mx-3.5 mt-4 mb-2">
              <Button
                variant="text"
                className={`flex items-center gap-4 px-4 capitalize ${
                  isActiveRoute(route.path) ? 'bg-red-600 hover:bg-red-500' : 'bg-transparent'
                }`}
                fullWidth
                onClick={() => changeRoute(route.path)}
              >
                <FontAwesomeIcon icon={route.icon} size="1x" className="text-white" />
                <Typography className="font-medium capitalize text-white">{route.name}</Typography>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
