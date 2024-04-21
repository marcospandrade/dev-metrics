import Link from 'next/link'
import { LoginHelper } from './helpers/login.helper'

export default async function Login() {
  const url = LoginHelper.getLoginUrl()

  return (
    <div>
      <div className="mx-auto w-full px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
        <h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
          <span className="block">Welcome to EstimAi</span>
          <span className="block text-indigo-500">It&rsquo;s always time to improve team performance.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-xl text-gray-400">
          Come and see the future of estimation for activities!
        </p>

        <div className="lg:mt-0 lg:flex-shrink-0">
          <div className="mt-12 inline-flex rounded-md shadow">
            <Link
              href={url}
              className="w-full rounded-lg  bg-indigo-600 px-6 py-4 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  focus:ring-offset-indigo-200 "
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
