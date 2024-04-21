'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Navbar, Typography, Button, Avatar, Menu, MenuHandler, MenuList, MenuItem } from '@/lib/material'
import { useAuth } from '@/hooks/useAuth'
import { useModal } from '@/hooks/useModal'
import { LoginHelper } from '@/app/login/helpers/login.helper'

export function DashboardNavbar() {
  const { user, getUserDetails, handleLogout } = useAuth()
  const { push, replace } = useRouter()
  const { defineModal } = useModal()
  const pathName = usePathname().split('/').pop()

  async function onLogout() {
    try {
      await handleLogout()
      push('/')
    } catch (error: any) {
      throw new Error(error.message ?? 'Error trying to logout')
    }
  }

  useEffect(() => {
    async function getUser() {
      try {
        await getUserDetails()
      } catch (error) {
        defineModal({
          title: 'Unauthorized',
          text: "You'll need to refresh your credentials",
          handleConfirm: () => replace(LoginHelper.getLoginUrl()),
          handleCancel: () => push('/'),
          buttonConfirmText: 'Login',
        })
      }
    }

    if (!user) {
      getUser()
    }
  }, [])

  return (
    <Navbar
      className=" rounded-xl transition-all sticky top-4 z-40 py-3 shadow-lg shadow-blue-gray-500/5 mb-4 bg-gradient-to-br from-indigo-500 to-indigo-600"
      fullWidth
      blurred
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Typography variant="h5" color="white">
            {pathName ?? ''}
          </Typography>
        </div>
        <div className="flex items-center">
          <Menu>
            <MenuHandler>
              <Button variant="text" className="flex flex-row justify-center items-center">
                <Avatar src={user?.picture} width={10} height={10} />
                <p className="capitalize ml-4 text-base font-thin text-white">{user?.name.split(' ')[0] ?? ''}</p>
              </Button>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem
                className="items-center gap-1 justify-center px-4 py-2 xl:flex"
                color="indigo"
                onClick={onLogout}
              >
                <FontAwesomeIcon icon={faSignOut} className="h-5 w-5 mr-2 text-inherit" />
                Logout
              </MenuItem>
              <MenuItem className="grid xl:hidden" color="indigo">
                <Link href="dashboard/profile">
                  <FontAwesomeIcon icon={faSignOut} className="h-5 w-5 mr-2 text-inherit" />
                  Logout
                </Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  )
}
