import { NextRequest, NextResponse } from 'next/server'
import { LoginHelper } from './login/helpers/login.helper'
import { redirect } from 'next/navigation'

const signInUrl = LoginHelper.getLoginUrl()

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const redirectURL = new URL(signInUrl, request.url)

  if (!token) {
    redirect('/login')
    return NextResponse.redirect(redirectURL, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20`,
      },
    })
  }

  return NextResponse.next()
}
