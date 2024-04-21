'use client'

import React, { ReactElement } from 'react'
import { FabIcon } from '../common/FabButton'

export function Footer(): ReactElement {
  return (
    <footer className="relative bg-indigo-700 pb-6 pt-8">
      <div
        className="pointer-events-none absolute bottom-auto left-0 right-0 top-0 -mt-20 w-full overflow-hidden"
        style={{ height: '80px' }}
      >
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="fill-current text-indigo-500"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap space-x-0">
          <div className="w-full px-4 lg:w-6/12">
            <h4 className="text-3xl font-semibold text-white">
              Lets keep in touch!
            </h4>
            <h5 className="mb-2 mt-0 text-lg text-white">
              Be part of the revolution of estimation process.
            </h5>
            <div className="mt-6">
              {/* <FabIcon>
                <i className="fab fa-twitter flex"></i>
              </FabIcon>
              <FabIcon>
                <i className="fab fa-facebook-square flex"></i>
              </FabIcon>
              <FabIcon>
                <i className="fab fa-dribbble flex"></i>
              </FabIcon> */}
              <FabIcon
                onClick={() =>
                  window.open('https://github.com/marcospandrade/estimai-web')
                }
              >
                <i className="fab fa-github flex"></i>
              </FabIcon>
            </div>
          </div>
          <div className="w-full px-4 lg:w-6/12">
            <div className="items-top mb-6 flex flex-wrap justify-end">
              <div className="w-full px-4 lg:w-4/12">
                <span className="mb-2 block text-sm font-semibold uppercase text-white">
                  Resources
                </span>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="block pb-2 text-sm font-semibold text-white hover:text-gray-100"
                      href="https://orgestimai.wixsite.com/estimai/privacy-policy"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      className="block pb-2 text-sm font-semibold text-white hover:text-gray-100"
                      href="https://orgestimai.wixsite.com/estimai/privacy-policy"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-red-400" />
        <div className="flex flex-wrap items-center justify-center md:justify-between">
          <div className="mx-auto w-full px-4 text-center md:w-4/12">
            <div className="py-1 text-sm font-semibold text-white">
              Copyright © {new Date().getFullYear()} EstimAi.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
