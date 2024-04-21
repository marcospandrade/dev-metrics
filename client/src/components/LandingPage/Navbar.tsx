'use client'

import React, { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
interface Props {
  transparent?: boolean
}

export function Navbar(props: Props): ReactElement {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const { push } = useRouter()

  function navigateToLogin() {
    return push('/login')
  }

  return (
    <nav
      className={
        (props.transparent
          ? 'absolute top-0 z-50 w-full'
          : 'relative bg-indigo-700 shadow-lg') +
        ' flex flex-wrap items-center justify-between px-2 py-3 '
      }
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
        <div className="relative flex w-full justify-between lg:static lg:block lg:w-auto lg:justify-start">
          <a
            className={
              'title-lg mr-4 inline-block whitespace-nowrap py-2 font-bold uppercase leading-relaxed text-white'
            }
            href="/"
          >
            {/* TODO: Think about create a logo to put on that place */}
            EstimAi
          </a>
          <button
            className="block cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none outline-none focus:outline-none lg:hidden"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i
              className={
                (props.transparent ? 'text-white' : 'text-gray-100') +
                ' fas fa-bars'
              }
            ></i>
          </button>
        </div>
        <div
          className={
            'flex-grow items-center bg-white lg:flex lg:bg-transparent lg:shadow-none' +
            (navbarOpen ? ' block rounded shadow-lg' : ' hidden')
          }
          id="example-navbar-warning"
        >
          <ul className="flex list-none flex-col lg:ml-auto lg:flex-row">
            <li className="flex items-center">
              <a
                className={
                  'flex items-center px-3 py-4 text-xs font-bold uppercase text-gray-800 lg:py-2 lg:text-white lg:hover:text-gray-300'
                }
                href="https://github.com/marcospandrade/estimai-web"
                target="_blank"
                rel="noreferrer"
              >
                <i
                  className={
                    'fab fa-github leading-lg text-lg text-gray-500 lg:text-white'
                  }
                />
                <span className="ml-2 inline-block lg:hidden">Star</span>
              </a>
            </li>

            <li className="flex items-center">
              <button
                className={
                  (props.transparent
                    ? 'bg-white text-gray-800 active:bg-gray-100'
                    : 'bg-red-700 text-white active:bg-red-300') +
                  ' mb-3 ml-3 rounded px-4 py-2 text-xs font-bold uppercase shadow outline-none hover:shadow-md focus:outline-none lg:mb-0 lg:mr-1'
                }
                type="button"
                style={{ transition: 'all .15s ease' }}
                onClick={navigateToLogin}
              >
                Sign In
                <i className="fa fa-sign-in ml-2" aria-hidden="true"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
