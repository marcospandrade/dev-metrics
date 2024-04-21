'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { CustomButton } from '../common/CustomButton'

export function Services() {
  const { push } = useRouter()

  function navigateToLogin() {
    return push('/login')
  }

  return (
    <section className="-mt-24 bg-indigo-300 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full px-4 pt-6 text-center md:w-4/12 lg:pt-12">
            <div className="relative mb-8 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg">
              <div className="flex-auto px-6 py-5">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-400 p-3 text-center text-white shadow-lg">
                  <i className="fas fa-award"></i>
                </div>
                <h6 className="text-xl font-semibold text-gray-800">
                  Remove waste of time
                </h6>
                <p className="mb-4 mt-2 text-gray-500">
                  Make the estimation process easier with EstimAi, we will use
                  the expertise of your team to make better suggestions.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full px-4 text-center md:w-4/12">
            <div className="relative mb-8 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg">
              <div className="flex-auto px-4 py-5">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 p-3 text-center text-white shadow-lg">
                  <i className="fas fa-retweet"></i>
                </div>
                <h6 className="text-xl font-semibold text-gray-800">
                  Review your cycles and adapt
                </h6>
                <p className="mb-4 mt-2 text-gray-600">
                  After any cycle, you can saw what was the pain points for your
                  team and work on these to improve performance.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full px-4 pt-6 text-center md:w-4/12">
            <div className="relative mb-8 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg">
              <div className="flex-auto px-4 py-5">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-400 p-3 text-center text-white shadow-lg">
                  <i className="fas fa-fingerprint"></i>
                </div>
                <h6 className="text-xl font-semibold text-gray-800">
                  Open source project
                </h6>
                <p className="mb-4 mt-2 text-gray-600">
                  Made by a dev for devs. You can contribute with this project
                  and give suggestions of improvements for the tool
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-wrap items-center">
          <div className="ml-auto mr-auto w-full px-4 md:w-6/12">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 text-center text-gray-600 shadow-lg">
              <i className="fas fa-user-friends text-xl"></i>
            </div>
            <h3 className="mb-2 text-3xl font-semibold leading-normal text-white">
              Embrace innovation to evolve your team
            </h3>
            <p className="mb-4 mt-4 text-lg font-light leading-relaxed text-gray-700">
              With EstimAi, you can say goodbye to guessing and uncertainty in
              your estimation process. This tool uses your own team expertise to
              make suggestions about estimations.
            </p>
            <p className="mb-4 mt-0 text-lg font-light leading-relaxed text-gray-700">
              EstimAi comes to help your team to easily understand the scrum
              process and have a more predictable rhythm of work. With EstimAi,
              you can streamline your estimation process and improve your
              team&rsquo;s performance.
            </p>
            <CustomButton onClick={navigateToLogin}>
              Check EstimAi!
            </CustomButton>
            <Link href="/login" className="mt-8 font-bold text-gray-800"></Link>
          </div>

          <div className="ml-auto mr-auto w-full px-4 md:w-4/12">
            <div className="relative mb-6 flex w-full min-w-0  flex-col break-words rounded-lg bg-red-600 shadow-lg">
              <Image
                alt="..."
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
                className="w-full rounded-t-lg align-middle"
                width={200}
                height={200}
              />
              <blockquote className="relative mb-4 p-8">
                <svg
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 583 95"
                  className="absolute left-0 block w-full"
                  style={{
                    height: '95px',
                    top: '-94px',
                  }}
                >
                  <polygon
                    points="-30,95 583,95 583,65"
                    className="fill-current text-red-400"
                  ></polygon>
                </svg>
                <h4 className="text-xl font-bold text-white">
                  Top Notch Services
                </h4>
                <p className="text-md mt-2 font-light text-white">
                  The Arctic Ocean freezes every winter and much of the sea-ice
                  then thaws every summer, and that process will continue
                  whatever happens.
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
